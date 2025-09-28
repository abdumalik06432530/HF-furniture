import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Cart = () => {
  const { products, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        for (const color in cartItems[productId]) {
          if (cartItems[productId][color] > 0) {
            tempData.push({
              _id: productId,
              color: color,
              quantity: cartItems[productId][color],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  if (!products || products.length === 0) {
    return (
      <div className="pt-16 bg-gradient-to-br from-teal-50 via-white to-cyan-50 min-h-screen">
        <div className="text-2xl px-4 sm:px-8 md:px-16">
          <Title text1="YOUR" text2="CART" />
        </div>
        <div className="py-10 text-center text-gray-600 text-lg animate-pulse">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gradient-to-br from-teal-50 via-white to-cyan-50 min-h-screen">
      <div className="text-2xl px-4 sm:px-8 md:px-16">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="space-y-6 px-4 sm:px-8 md:px-16 py-10">
        {cartData.length === 0 ? (
          <div className="py-10 text-center text-gray-600 text-lg animate-fade-in">
            Your cart is empty.
          </div>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 animate-slide-in border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {productData ? (
                  <div className="flex items-start gap-6 w-full">
                    <img
                      className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-lg shadow-md"
                      src={productData.image?.[0] || assets.placeholder_image}
                      alt={productData.name || 'Product image'}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-base sm:text-lg">{productData.name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 text-gray-700">
                        <p className="px-3 py-1 bg-teal-100 text-teal-800 rounded-md text-sm font-medium capitalize">
                          {item.color}
                        </p>
                        <p className="text-sm sm:text-base">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500 text-sm sm:text-base">Product not found</div>
                )}

                <div className="flex items-center gap-4 sm:gap-6">
                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === '0') return;
                      updateQuantity(item._id, item.color, Number(value));
                    }}
                    className="border border-gray-300 max-w-16 sm:max-w-20 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.color, 0)}
                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <img
                      className="w-5 sm:w-6"
                      src={assets.bin_icon}
                      alt="Remove item"
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartData.length > 0 && (
        <div className="flex justify-end px-4 sm:px-8 md:px-16 py-8">
          <button
            onClick={() => navigate('/place-order')}
            className="bg-teal-600 text-white px-8 py-3 text-sm font-medium rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
};

// Custom Tailwind animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-15px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }

  .animate-slide-in {
    animation: slide-in 0.6s ease-out;
  }
`;

export default Cart;