import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import sanitizeMessage from '../utils/sanitizeMessage';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState('');

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        const products = response.data.products.reverse();
        setList(products);
        setFilteredList(products);
      } else {
        toast.error(sanitizeMessage(response.data.message));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(sanitizeMessage(response.data.message));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const startEdit = (id, currentQuantity) => {
    setEditingId(id);
    setEditingQuantity(String(currentQuantity ?? 0));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingQuantity('');
  };

  const saveQuantity = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update-quantity`,
        { id, quantity: editingQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(sanitizeMessage(response.data.message) || 'Quantity updated');
        cancelEdit();
        fetchList();
      } else {
        toast.error(sanitizeMessage(response.data.message));
      }
    } catch (error) {
      console.error('Failed to update quantity', error);
      toast.error(error.message || 'Failed to update quantity');
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
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0">
          <span className="text-indigo-600 transform hover:scale-110 transition-transform duration-300">📦</span>
          All Products
        </h2>
        <div className="relative w-full sm:w-64 md:w-80">
          <input
            type="text"
            placeholder="Search by ID, name, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded-lg border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_120px] items-center py-3 px-4 bg-indigo-100 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 shadow-md">
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
            className="grid grid-cols-1 sm:grid-cols-[80px_2fr_1fr_1fr_120px] items-center gap-3 sm:gap-4 py-3 px-4 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center sm:block">
              <div className="relative">
                <img
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 shadow-sm transform hover:scale-105 transition-transform duration-200"
                  src={item.image && item.image[0] ? item.image[0] : "https://via.placeholder.com/64?text=No+Image"}
                  alt={item.name}
                />
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div className="sm:hidden ml-3">
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-600 capitalize">{item.category}</p>
              </div>
            </div>
            <p className="hidden sm:block text-sm sm:text-base font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors duration-200">
              {item.name}
            </p>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-600 capitalize">{item.category}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              {editingId === item._id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min={0}
                    value={editingQuantity}
                    onChange={(e) => setEditingQuantity(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-200 rounded-md text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveQuantity(item._id)}
                      className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded-lg text-xs sm:text-sm hover:bg-green-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 sm:px-3 py-1 bg-gray-200 rounded-lg text-xs sm:text-sm hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {item.quantity ?? <span className="text-red-500">Out of Stock</span>}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item._id, item.quantity)}
                      className="px-2 sm:px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="px-2 sm:px-3 py-1 text-red-500 hover:text-red-700 text-lg font-bold rounded-lg hover:bg-red-50 transition-all duration-200"
                      title="Remove Product"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-md">
            <p className="text-base sm:text-lg text-gray-500 font-medium animate-pulse">
              No products found. Try adjusting your search or add new products! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;