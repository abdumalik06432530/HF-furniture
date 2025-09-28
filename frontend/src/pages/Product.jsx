import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const manualColors = ['red', 'blue', 'green', 'black', 'white'];

  useEffect(() => {
    const fetchProductData = () => {
      const product = products.find(item => item._id === productId);
      if (product) {
        const modifiedProduct = {
          ...product,
          colors: manualColors,
          description: product.description || "This is a premium product crafted with high-quality materials, designed to offer both style and durability."
        };
        setProductData(modifiedProduct);

        if (modifiedProduct.image && modifiedProduct.image.length > 0) {
          setSelectedImage(modifiedProduct.image[0]);
        }
        if (modifiedProduct.colors && modifiedProduct.colors.length > 0) {
          setSelectedColor(modifiedProduct.colors[0]);
        }
      }
    };

    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  const handleAddToCart = () => {
    if (!selectedColor && productData.colors && productData.colors.length > 0) {
      toast.error("Please select a color");
      return;
    }
    addToCart(productData._id, selectedColor);
    toast.success(`${productData.name} added to cart!`);
  };

  const getColorSwatch = (color) => {
    const colorMap = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      black: 'bg-black',
      white: 'bg-white border-2 border-gray-300'
    };
    return (
      <span
        className={`inline-block w-6 h-6 rounded-full transition-transform duration-300 transform hover:scale-110 ${colorMap[color] || 'bg-gray-300'}`}
        title={color}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:flex">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-16 scrollbar-hide">
                {productData.image.map((item, index) => (
                  <img
                    key={index}
                    onClick={() => setSelectedImage(item)}
                    src={item}
                    className={`w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                      selectedImage === item
                        ? 'border-indigo-500 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    alt={`Product thumbnail ${index + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="flex-1">
                <img
                  className="w-full h-auto max-h-[250px] sm:max-h-[350px] object-contain rounded-xl border border-gray-200 shadow-md transition-transform duration-300 hover:scale-[1.02]"
                  src={selectedImage}
                  alt={productData.name}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{productData.name}</h1>

            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-4">
              {currency}
              {productData.price}
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
              {productData.description}
            </p>

            {/* Highlights Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Highlights</h3>
              <ul className="text-gray-600 space-y-2 text-sm sm:text-base list-disc pl-5">
                <li>High-quality craftsmanship for lasting durability</li>
                <li>Modern design with vibrant color options</li>
                <li>Perfect for everyday use and special occasions</li>
                <li>Lightweight and comfortable materials</li>
              </ul>
            </div>

            {/* Color Selector */}
            <div className="mb-20">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {productData.colors.map((color, index) => (
                  <div key={index} className="relative group">
                    <input
                      type="radio"
                      id={`color-${index}`}
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`color-${index}`}
                      className={`flex items-center px-3 py-1 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedColor === color
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300'
                      }`}
                    >
                      {getColorSwatch(color)}
                      <span className="ml-1 capitalize text-xs sm:text-sm">{color}</span>
                    </label>
                    {selectedColor === color && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2 w-2 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-3 text-sm text-gray-500">
                  Selected color: <span className="font-medium capitalize">{selectedColor}</span>
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full sm:max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Cart
            </button>

            {/* Product Details */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h3>
              <ul className="text-gray-600 space-y-2 text-sm sm:text-base">
                <li><span className="font-medium">Category:</span> {productData.category}</li>
                <li><span className="font-medium">Subcategory:</span> {productData.subCategory}</li>
                <li><span className="font-medium">Availability:</span> {productData.quantity > 0 ? 'In Stock' : 'Out of Stock'}</li>
                <li><span className="font-medium">Material:</span> Premium Quality</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <RelatedProducts category={productData.category} currentProductId={productId} />
        </div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Product;