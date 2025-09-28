import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className='my-12 bg-white rounded-lg py-8'>
      <div className='text-center text-4xl sm:text-5xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-11/12 sm:w-3/4 mx-auto mt-4 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 gap-y-8 px-4 sm:px-8'>
        {bestSeller.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;