import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import categories from '../shared/categories';

const subCategoryMap = categories;

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('none');

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
    setSubCategory([]);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'modelNumber':
        fpCopy.sort((a, b) => {
          const extractNum = (str) => {
            const match = str?.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          };
          return extractNum(a.modelNumber) - extractNum(b.modelNumber);
        });
        break;

      case 'name':
        fpCopy.sort((a, b) => {
          const aName = a.name?.toLowerCase() || '';
          const bName = b.name?.toLowerCase() || '';
          return aName.localeCompare(bName);
        });
        break;

      case 'none':
      default:
        applyFilter();
        return;
    }

    setFilterProducts(fpCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const availableSubCategories = category.flatMap((cat) => subCategoryMap[cat] || []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 px-3 sm:px-4 md:px-6  from-gray-50 to-blue-50 min-h-screen">
      {/* Filter Panel */}
      <div className="sm:min-w-40">
        <div
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md cursor-pointer sm:cursor-default my-1 transition-all duration-300 hover:shadow-lg"
          aria-label="Toggle filters"
        >
          <p className="text-base font-bold tracking-wide">FILTERS</p>
          <img
            className={`h-2.5 sm:hidden transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}
            src={assets.dropdown_icon}
            alt="dropdown"
          />
        </div>

        <div className={`bg-white rounded-lg shadow-md p-3 mt-1 sm:block ${showFilter ? 'animate-slide-in' : 'hidden'} transition-all duration-500 border border-gray-100`}>
          <p className="mb-2 text-xs font-bold text-gray-900 uppercase tracking-wide border-b pb-1">Categories</p>
          <div className="flex flex-col gap-1.5">
            {Object.keys(subCategoryMap).map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 text-2xs font-semibold cursor-pointer hover:bg-blue-200 hover:text-blue-800 p-1.5 rounded-md transition-all duration-200 border border-blue-100"
                aria-label={`Filter by ${cat}`}
              >
                <input
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  className="h-3.5 w-3.5 accent-blue-600 rounded focus:ring-1 focus:ring-blue-500"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          {availableSubCategories.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-bold text-gray-900 uppercase tracking-wide border-b pb-1">Types</p>
              <div className="flex flex-col gap-1.5">
                {availableSubCategories.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 text-2xs font-semibold cursor-pointer hover:bg-blue-200 hover:text-blue-800 p-1.5 rounded-md transition-all duration-200 border border-blue-100"
                    aria-label={`Filter by ${type}`}
                  >
                    <input
                      type="checkbox"
                      value={type}
                      onChange={toggleSubCategory}
                      className="h-3.5 w-3.5 accent-blue-600 rounded focus:ring-1 focus:ring-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Display Section */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <Title text1={'ALL'} text2={'COLLECTIONS'} className="text-xl sm:text-2xl text-gray-800" text2ClassName="text-blue-600" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-blue-400 px-2 py-1 text-xs rounded-lg bg-white shadow-sm hover:bg-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 font-medium text-gray-700"
            aria-label="Sort products"
          >
            <option value="none">Sort: None</option>
            <option value="modelNumber">Sort: Model Number</option>
            <option value="name">Sort: Product Name (A-Z)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filterProducts.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col h-full"
            >
              <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,0,0,0.65)] transition-all duration-300 h-80">
                <ProductItem
                  name={item.name}
                  id={item._id}
                  image={item.image}
                  hoverImage={item.hoverImage || item.image}
                  modelNumber={item.modelNumber}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:bg-black/50"
                  nameClassName="absolute bottom-10 left-10 px-6 py-3 text-xl font-extrabold text-white bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl hover:from-blue-700 hover:to-purple-600 hover:scale-105 transition-all duration-300 line-clamp-2 max-w-[85%] shadow-lg"
                  modelNumberClassName="absolute bottom-3 left-3 px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-950 transition-all duration-200 line-clamp-1 max-w-[65%] shadow-sm"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md tracking-wide">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filterProducts.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">🔍</div>
            <p className="text-gray-500 text-sm font-medium">No matching products found.</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Tailwind animations and text size
const styles = `
  @keyframes slide-in {
    from { 
      opacity: 0; 
      transform: translateX(-8px) scale(0.98); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }

  .text-2xs {
    font-size: 10px;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export default Collection;