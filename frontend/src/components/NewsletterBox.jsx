import React from 'react';
import { Link } from 'react-router-dom';

const PromoBox = () => {
  return (
    <div className='text-center bg-white rounded-xl py-12 px-4 sm:px-8'>
      <p className='text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight'>
        Discover Our Latest Furniture Collections
      </p>
      <p className='text-gray-600 mt-4 max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed'>
        Elevate your home with Hamad Furniture’s newest arrivals. Explore handcrafted designs, premium materials, and timeless styles tailored to your space.
      </p>
      <div className='mt-8'>
        <Link
          to='/collection'
          className='inline-block bg-blue-600 text-white text-sm sm:text-base font-semibold px-10 py-4 rounded-full hover:bg-blue-700 transition-colors duration-300 hover:scale-105'
        >
          Shop New Arrivals
        </Link>
      </div>
    </div>
  );
};

export default PromoBox;