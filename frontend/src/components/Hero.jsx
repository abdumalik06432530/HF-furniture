"use client";
import React from "react";
import BackgroundGradientAnimation from "../ui/background-gradient-animation"; // Adjust the import path as needed

const Hero = () => {
  return (
    <div className="w-full h-screen m-0 p-0 flex flex-col overflow-hidden">
      <BackgroundGradientAnimation className="w-full h-full m-0 p-0 flex items-start justify-start">
        <div className="relative z-10 w-full flex flex-col items-start justify-start py-12 px-4 sm:px-8">
          <div className="text-white">
            <div className="flex items-center gap-3">
              <p className="w-10 md:w-14 h-[2px] bg-white"></p>
              <p className="font-medium text-sm md:text-lg uppercase tracking-wider">
                Our Bestsellers
              </p>
            </div>
            <h1 className="prata-regular text-4xl sm:text-5xl lg:text-6xl leading-relaxed mt-4 sm:mt-6">
              Latest Arrivals
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <p className="font-semibold text-sm md:text-lg uppercase tracking-wider transition-colors duration-300 hover:text-blue-300 cursor-pointer">
                Shop Now
              </p>
              <p className="w-10 md:w-14 h-[1px] bg-white"></p>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
};

export default Hero;