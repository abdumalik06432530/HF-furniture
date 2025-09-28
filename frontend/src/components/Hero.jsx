import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 px-4 sm:px-8'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-3'>
            <p className='w-10 md:w-14 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-lg uppercase tracking-wider'>Our Bestsellers</p>
          </div>
          <h1 className='prata-regular text-4xl sm:text-5xl lg:text-6xl leading-relaxed mt-4 sm:mt-6'>Latest Arrivals</h1>
          <div className='flex items-center gap-3 mt-6'>
            <p className='font-semibold text-sm md:text-lg uppercase tracking-wider transition-colors duration-300 hover:text-blue-600 cursor-pointer'>Shop Now</p>
            <p className='w-10 md:w-14 h-[1px] bg-[#414141]'></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img
        className='w-full sm:w-1/2 object-cover transition-transform duration-500 hover:scale-105'
        src={assets.hero_img}
        alt="Hero Image"
      />
    </div>
  )
}

export default Hero