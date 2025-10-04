import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import sanitizeMessage from '../utils/sanitizeMessage';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data when token changes
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(backendUrl + "/api/user/profile", {
        headers: { Authorization: token ? `Bearer ${token}` : undefined, token },
      });
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        toast.error(response.data.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error(error);
      handleAuthError(error);
    }
  };

  // Central handler for auth-related errors (expired/invalid token or disabled account)
  const handleAuthError = (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;
    if (status === 401 || status === 403) {
      // Remove local token and redirect to login
      localStorage.removeItem('token');
      setToken('');
      setUserData(null);
      if (status === 403) {
        toast.error(serverMessage || 'Account disabled or access denied');
      } else {
        toast.error(serverMessage || 'Session expired. Please log in again.');
      }
      navigate('/login');
      return true;
    }
    return false;
  };

  // Update user profile
  const updateUserProfile = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          // prefer Authorization header but keep legacy token header for compatibility
          Authorization: token ? `Bearer ${token}` : undefined,
          token,
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("bio", formData.bio || "");
      // If the user provided a new password, send it as `password` (backend expects `password`)
      if (formData.newPassword)
        formDataToSend.append("password", formData.newPassword);
      if (formData.profilePhoto)
        formDataToSend.append("profilePhoto", formData.profilePhoto);

      const response = await axios.post(
        backendUrl + "/api/user/profile/update",
        formDataToSend,
        config
      );

      if (response.data.success) {
        // update local userData so UI refreshes immediately
        if (response.data.user) setUserData(response.data.user);
        toast.success("Profile updated successfully");
        return response.data;
      } else {
        toast.error(sanitizeMessage(response.data.message));
  throw new Error(sanitizeMessage(response.data.message));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Profile update failed");
      throw error;
    }
  };

  const addToCart = async (itemId, size) => {
    // Allow adding items without explicit colors by using a default key.
    const colorKey = size && typeof size === 'string' && size.trim() !== '' ? size : 'default';

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][colorKey]) {
        cartData[itemId][colorKey] += 1;
      } else {
        cartData[itemId][colorKey] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][colorKey] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { userId: userData?._id, itemId, Colors: colorKey },
          { headers: { Authorization: `Bearer ${token}`, token } }
        );
      } catch (error) {
        console.log(error);
        if (!handleAuthError(error)) {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    const colorKey = size && typeof size === 'string' && size.trim() !== '' ? size : 'default';
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][colorKey] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { userId: userData?._id, itemId, Colors: colorKey, quantity: Number(quantity) },
          { headers: { Authorization: `Bearer ${token}`, token } }
        );
      } catch (error) {
        console.log(error);
        if (!handleAuthError(error)) {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
        console.log(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (!handleAuthError(error)) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const getUserCart = async (maybeToken) => {
    try {
      const t = maybeToken || token;
      // Prefer sending userId as query param; backend will fallback to token if needed.
      const response = await axios.get(backendUrl + "/api/cart/get", {
        params: { userId: userData?._id },
        headers: { Authorization: t ? `Bearer ${t}` : undefined, token: t },
      });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      if (!handleAuthError(error)) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Initialize on component mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getProductsData();

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserCart(token);
      fetchUserData();
    } else {
      localStorage.removeItem("token");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    products,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    userData,
    updateUserProfile,
    fetchUserData,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
