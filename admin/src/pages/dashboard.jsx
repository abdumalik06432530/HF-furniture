import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchStats = async () => {
    try {
      const productRes = await axios.get(`${backendUrl}/api/product/list`);
      const orderRes = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (productRes.data.success && orderRes.data.success) {
        setProducts(productRes.data.products);
        setOrders(orderRes.data.orders);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      toast.error("Error loading dashboard data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
  const lowStock = products.filter((p) => p.quantity < 5).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 p-6 md:p-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 flex items-center gap-3 animate-fade-in">
        <span className="text-indigo-600 transform hover:scale-110 transition-transform duration-300">📊</span>
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border-l-4 border-blue-500 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-blue-500">🛍️</span> Total Products
          </p>
          <h3 className="text-2xl font-bold text-blue-700 mt-2">{products.length}</h3>
        </div>
        <div className="bg-white border-l-4 border-purple-500 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-purple-500">🧾</span> Total Orders
          </p>
          <h3 className="text-2xl font-bold text-purple-700 mt-2">{orders.length}</h3>
        </div>
        <div className="bg-white border-l-4 border-yellow-500 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-yellow-500">⏳</span> Pending Orders
          </p>
          <h3 className="text-2xl font-bold text-yellow-700 mt-2">{pendingOrders}</h3>
        </div>
        <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-indigo-500">✅</span> Delivered Orders
          </p>
          <h3 className="text-2xl font-bold text-indigo-700 mt-2">{completedOrders}</h3>
        </div>
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="text-red-500">⚠️</span> Low Stock
          </p>
          <h3 className="text-2xl font-bold text-red-700 mt-2">{lowStock}</h3>
        </div>
      </div>

      {/* Recent Orders & Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-xl p-6 transition-allveckl duration-300 animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-indigo-600">🧾</span> Recent Orders
          </h2>
          {orders.slice(0, 5).map((order, index) => (
            <div
              key={index}
              className="border-b py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-3 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium truncate max-w-[200px]">
                  {order.address.firstName} {order.address.lastName}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.date).toLocaleDateString()} | {order.address.city}
              </p>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-gray-500 py-6">No recent orders found.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 transition-all duration-300 animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-indigo-600">📦</span> Product Overview
          </h2>
          {products.slice(0, 5).map((product, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-3 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image && product.image[0] ? product.image[0] : "https://via.placeholder.com/40?text=No+Image"}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  alt={product.name}
                />
                <div>
                  <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  product.quantity < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {product.quantity ?? "Out of Stock"}
              </span>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-center text-gray-500 py-6">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;