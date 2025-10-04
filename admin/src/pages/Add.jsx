import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";
import sanitizeMessage from '../utils/sanitizeMessage';
import categories from '../../../shared/categories';
const Add = ({ token }) => {
  if (!token) {
    toast.error("You are not authorized to access this page. Please log in.");
    return null;
  }


  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [colors, setColors] = useState([]);

  const colorOptions = ["Red", "Blue", "Green", "Black", "White"];

  const subcategoryOptions = categories;

  useEffect(() => {
    if (category) {
      setSubCategory(subcategoryOptions[category][0]);
    } else {
      setSubCategory("");
    }
  }, [category]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("quantity", quantity);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("colors", JSON.stringify(colors));
      formData.append("bestseller", bestseller);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setQuantity("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setColors([]);
        setBestseller(false);
        setCategory("");
        setSubCategory("");
      } else {
        toast.error(sanitizeMessage(response.data.message));
      }
    } catch (error) {
      console.error(error);
      toast.error(sanitizeMessage(error.response?.data?.message) || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 p-6 md:p-12">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <span className="text-indigo-600 transform hover:scale-110 transition-transform duration-300">🛠️</span>
          Add New Product
        </h2>

        {/* Image Upload */}
        <div className="mb-8">
          <p className="mb-3 text-lg font-semibold text-gray-800">Upload Images (Max 4)</p>
          <div className="flex flex-wrap gap-4">
            {[image1, image2, image3, image4].map((img, idx) => (
              <label
                key={idx}
                htmlFor={`image${idx + 1}`}
                className="relative w-28 h-28 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer flex items-center justify-center overflow-hidden hover:border-indigo-500 hover:shadow-md transition-all duration-300 group"
              >
                {img ? (
                  <>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const setters = [setImage1, setImage2, setImage3, setImage4];
                        setters[idx](false);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors duration-200">
                    <img
                      src={assets.upload_area}
                      alt="Upload placeholder"
                      className="w-10 h-10 opacity-70 group-hover:opacity-100"
                    />
                    <span className="text-xs mt-1">Upload</span>
                  </div>
                )}
                <input
                  id={`image${idx + 1}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const setters = [setImage1, setImage2, setImage3, setImage4];
                      setters[idx](file);
                    }
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Product Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Product Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product"
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-white"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-white"
              >
                <option value="">Select Category</option>
                <option value="Chair">Chair</option>
                <option value="Table">Table</option>
                <option value="Shelf">Shelf</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="subcategory"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Sub Category
              </label>
              <select
                id="subcategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
                disabled={!category}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-white disabled:opacity-50"
              >
                {category &&
                  subcategoryOptions[category].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity (e.g., 10)"
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-white"
            />
          </div>

          {/* Colors */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Select Colors</p>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setColors((prev) =>
                      prev.includes(color)
                        ? prev.filter((c) => c !== color)
                        : [...prev, color]
                    )
                  }
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    colors.includes(color)
                      ? "bg-indigo-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Bestseller */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={() => setBestseller((prev) => !prev)}
              className="w-5 h-5 accent-indigo-500 cursor-pointer rounded"
            />
            <label
              htmlFor="bestseller"
              className="cursor-pointer text-sm font-semibold text-gray-700"
            >
              Add to Bestseller
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>➕</span> Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;