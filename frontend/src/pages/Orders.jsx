import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            if (!item.image || !Array.isArray(item.image)) {
              item.image = [''];
            }

            if (!item.name) item.name = 'Unnamed Product';
            if (!item.price) item.price = 0;
            if (!item.quantity) item.quantity = 1;
            if (!item.size) item.size = 'N/A';

            allOrdersItem.push({
              ...item,
              status: order.status || 'Processing',
              date: order.date || new Date().toISOString(),
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      } else {
        throw new Error(response.data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError(error.message || 'An error occurred while loading your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (loading) {
    return (
      <div className="pt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        <div className="text-2xl px-4 sm:px-8 md:px-16">
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className="py-10 text-center text-gray-600 text-lg animate-pulse">
          Loading your orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        <div className="text-2xl px-4 sm:px-8 md:px-16">
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className="py-10 text-center text-red-500 text-lg">
          {error}
          <button
            onClick={loadOrderData}
            className="mt-6 block mx-auto bg-indigo-600 text-white px-6 py-2.5 text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orderData.length === 0) {
    return (
      <div className="pt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        <div className="text-2xl px-4 sm:px-8 md:px-16">
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className="py-10 text-center text-gray-600 text-lg animate-fade-in">
          You haven't placed any orders yet.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      <div className="text-2xl px-4 sm:px-8 md:px-16">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="space-y-6 px-4 sm:px-8 md:px-16 py-10">
        {orderData.map((item, index) => (
          <div
            key={`${item._id || index}-${item.date}`}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6 animate-slide-in border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <img
              className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-lg shadow-md"
              src={item.image[0] || '/placeholder-product.jpg'}
              alt={item.name}
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm sm:text-base">
                <p className="font-semibold text-gray-800 text-base sm:text-lg">{item.name}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 text-gray-700">
                  <p>{currency}{item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Color: {item.size}</p>
                </div>
                <p className="mt-2 text-gray-600">
                  Date: <span className="text-gray-500">{new Date(item.date).toDateString()}</span>
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === 'Delivered' ? 'bg-green-500' :
                      item.status === 'Cancelled' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}
                  ></div>
                  <p className="text-sm sm:text-base font-medium text-gray-700 capitalize">{item.status.toLowerCase()}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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

export default Orders;