import React from 'react';
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation';

const Hero = () => {
  return (
    <BackgroundGradientAnimation>
      <div className="relative z-10 w-full h-screen flex items-center justify-center px-6 sm:px-12 text-white">
        <div className="max-w-3xl text-center">
          {/* Section Label */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="w-12 h-[2px] bg-white/60"></span>
            <span className="uppercase text-sm sm:text-base tracking-widest text-white/80">
              Our Bestsellers
            </span>
            <span className="w-12 h-[2px] bg-white/60"></span>
          </div>

          {/* Main Heading */}
          <h1 className="prata-regular text-4xl sm:text-5xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-blue-300 via-blue-100 to-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            Discover the Future of Style
          </h1>

          {/* Buttons */}
          <div className="mt-10 flex justify-center gap-6">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold uppercase text-sm tracking-wider hover:opacity-90 transition-shadow shadow-md hover:shadow-xl">
              Shop Now
            </button>
            <button className="border border-white/70 text-white px-6 py-3 rounded-full font-semibold uppercase text-sm tracking-wider hover:bg-white hover:text-blue-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;
