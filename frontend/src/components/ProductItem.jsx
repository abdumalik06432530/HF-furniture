import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image = [], name, price, nameClassName = '', imageClassName = '' }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link onClick={() => scrollTo(0, 0)} className="text-gray-700 cursor-pointer group w-48" to={`/product/${id}`}>
      <div className={`overflow-hidden rounded-lg bg-white flex items-center justify-center p-2 ${imageClassName} mx-5`}>
        {image[0] ? (
          <img
            className="max-h-44 w-full object-contain transition-transform duration-500 group-hover:scale-105"
            src={image[0]}
            alt={name}
          />
        ) : (
          <div className="h-32 w-full flex items-center justify-center text-gray-300">No Image</div>
        )}
      </div>

      <div className="mt-1 text-center px-1">
        <h3
          className={`text-xs font-semibold text-gray-800 leading-tight truncate max-w-[180px] mx-auto tracking-wide group-hover:text-blue-600 ${nameClassName}`}
          title={name}
        >
          {name}
        </h3>
        <p className="mt-1 text-xs font-medium text-blue-600">{currency}{price}</p>
      </div>
    </Link>
  );
};

export default ProductItem