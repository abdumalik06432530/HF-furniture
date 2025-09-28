import { useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchAllOrders = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const orderList = response.data.orders.reverse();
        setOrders(orderList);
        setFilteredOrders(orderList);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.message);
    }
  }, [token]);

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteHandler = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/delete`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Order deleted successfully");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      [
        order._id,
        `${order.address.firstName} ${order.address.lastName}`,
        order.address.city,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const getBankStatementUrl = (bankStatement) => {
    if (!bankStatement || typeof bankStatement !== 'string') return null;
    if (bankStatement.startsWith('http') || bankStatement.startsWith('/')) {
      return bankStatement.startsWith('/') ? `${backendUrl}${bankStatement}` : bankStatement;
    }
    const parts = bankStatement.split(/\\|\//);
    const filename = parts[parts.length - 1];
    return `${backendUrl}/uploads/${filename}`;
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-indigo-600">📦</span> Orders
        </h3>
        <div className="relative w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Search by ID, name, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>
      </div>
      <div className="space-y-6 sm:space-y-8">
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-indigo-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-4 sm:gap-6">
              <div className="relative">
                <img
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full bg-indigo-100 p-2"
                  src={assets.parcel_icon}
                  alt="Parcel"
                />
                <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-sm font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-indigo-50 p-4 sm:p-5 rounded-lg shadow-sm">
                  <p className="font-bold text-lg sm:text-xl text-gray-900">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {order.address.street}, {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {order.address.country} - {order.address.zipcode}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <p className="text-sm sm:text-base text-gray-500">{order.address.phone}</p>
                    <a
                      href={`tel:${order.address.phone}`}
                      className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm"
                    >
                      📞 Call
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image?.[0] || "https://via.placeholder.com/40?text=No+Image"}
                            alt={item.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-md border border-gray-200"
                          />
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[160px] sm:max-w-[200px]">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-indigo-600">×{item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {order.bankStatement && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2">Bank Statement:</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {(() => {
                        const url = getBankStatementUrl(order.bankStatement);
                        return url ? (
                          <>
                            <img
                              src={url}
                              alt="bank-statement"
                              className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                            />
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setPreviewImage(url)}
                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                              >
                                View
                              </button>
                              <a
                                href={url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
                              >
                                Download
                              </a>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No preview available</p>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base text-gray-700">
              <div>
                <p className="flex items-center gap-2">
                  <span className="text-indigo-500">🛒</span>
                  <span className="font-semibold">Quantity:</span>
                  <span className="font-bold text-indigo-600">
                    {order.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <span className="text-indigo-500">🧾</span>
                  <span className="font-semibold">Payment:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${
                      order.payment ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.payment ? "Completed" : "Pending"}
                  </span>
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2">
                  <span className="text-indigo-500">📅</span>
                  <span className="font-semibold">Date:</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-semibold text-gray-700">Status:</label>
                <div className="relative">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="w-full p-3 rounded-lg border border-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white shadow-sm appearance-none"
                  >
                    <option value="Order Accepted">Order Accepted</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {order.status === "Order Accepted" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">✔</span>
                  )}
                </div>
                {order.status === "Delivered" && (
                  <button
                    onClick={() => deleteHandler(order._id)}
                    className="mt-2 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <span>🗑️</span> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 sm:py-10 bg-white rounded-xl shadow-md">
            <p className="text-base sm:text-lg text-gray-500 flex items-center justify-center gap-2">
              <span className="text-indigo-500">📪</span> No orders found.
            </p>
          </div>
        )}
      </div>
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-xl overflow-hidden max-w-[90vw] sm:max-w-4xl w-full mx-4 shadow-2xl">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-700 px-3 py-1.5 text-base hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewImage}
                alt="preview"
                className="w-full h-auto max-h-[80vh] sm:max-h-[75vh] object-contain rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Orders.propTypes = {
  token: PropTypes.string,
};

export default Orders;