import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    state: '',
    country: '',
    phone: '',
  });
  const [bankStatement, setBankStatement] = useState(null);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onFileChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setBankStatement(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.color = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('address', JSON.stringify(formData));
      formDataToSend.append('items', JSON.stringify(orderItems));
      formDataToSend.append('amount', getCartAmount() + delivery_fee);
      if (bankStatement) {
        formDataToSend.append('bankStatement', bankStatement);
      }

      const response = await axios.post(backendUrl + '/api/order/place', formDataToSend, {
        headers: { token, 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
        toast.success('Order placed successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8 pt-5 sm:pt-14 min-h-[80vh] bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-4 sm:px-8 md:px-16"
    >
      {/* ------------- Left Side: Delivery Information ---------------- */}
      <div className="flex flex-col gap-6 w-full sm:max-w-[480px] bg-white rounded-xl shadow-lg p-6 sm:p-8 animate-slide-in">
        <div className="text-xl sm:text-2xl">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
              type="text"
              placeholder="First name"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
              type="text"
              placeholder="Last name"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
            type="email"
            placeholder="Email address"
          />
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
              type="text"
              placeholder="City"
            />
            <input
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
              type="text"
              placeholder="State"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
            type="text"
            placeholder="Country"
          />
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-teal-500 text-sm"
            type="number"
            placeholder="Phone"
          />
        </div>
      </div>

      {/* ------------- Right Side: Payment Information ------------------ */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="text-xl sm:text-2xl">
          <Title text1={'PAYMENT'} text2={'INFORMATION'} />
        </div>
        <div className="flex flex-col gap-4 bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-teal-500"></div>
            <p className="text-sm font-medium text-gray-700">Cash on Delivery</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Upload Bank Statement (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChangeHandler}
              className="border border-gray-300 rounded-lg p-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-100 file:text-teal-800 file:font-medium file:hover:bg-teal-200 file:transition-colors file:cursor-pointer"
            />
            {bankStatement && (
              <p className="text-sm text-gray-600 mt-1">Selected: {bankStatement.name}</p>
            )}
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button
            type="submit"
            className="bg-teal-600 text-white px-8 py-3 text-sm font-medium rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

// Custom Tailwind animations
const styles = `
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-15px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-slide-in {
    animation: slide-in 0.6s ease-out;
  }
`;

export default PlaceOrder;