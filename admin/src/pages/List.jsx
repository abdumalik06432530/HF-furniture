import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        const products = response.data.products.reverse();
        setList(products);
        setFilteredList(products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const filtered = list.filter((item) =>
      [item._id, item.name, item.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchQuery, list]);

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 animate-fade-in">
          <span className="text-indigo-600 transform hover:scale-110 transition-transform duration-300">📦</span>
          All Products
        </h2>
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search by ID, name, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[100px_2fr_1fr_1fr_100px] items-center py-4 px-6 bg-indigo-100 rounded-xl text-sm font-semibold text-gray-800 shadow-md">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Quantity</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product List */}
        {filteredList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr_1fr] md:grid-cols-[100px_2fr_1fr_1fr_100px] items-center gap-4 py-4 px-6 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
          >
            <div className="relative">
              <img
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm transform hover:scale-105 transition-transform duration-200"
                src={item.image && item.image[0] ? item.image[0] : "https://via.placeholder.com/64?text=No+Image"}
                alt={item.name}
              />
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <p className="text-base font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors duration-200">
              {item.name}
            </p>
            <p className="text-sm text-gray-600 capitalize">{item.category}</p>
            <p className="text-sm text-gray-700 font-medium">
              {item.quantity ?? <span className="text-red-500">Out of Stock</span>}
            </p>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-500 hover:text-red-700 text-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg py-2"
              title="Remove Product"
            >
              <span>🗑️</span>
            </button>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-lg text-gray-500 font-medium animate-pulse">
              No products found. Try adjusting your search or add new products! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;