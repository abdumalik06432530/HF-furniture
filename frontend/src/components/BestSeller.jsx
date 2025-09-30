import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';

// small local wrap helper
function wrap(min, max, v) {
  const range = max - min;
  return ((v - min) % range + range) % range + min;
}

const BestSeller = () => {
  const { backendUrl } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchBest = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/list?bestseller=true`);
        if (mounted && res.data?.success) {
          setBestSeller(res.data.products.slice(0, 10));
        }
      } catch (err) {
        console.error('Failed to fetch bestsellers', err);
      }
    };

    if (backendUrl) fetchBest();
    return () => {
      mounted = false;
    };
  }, [backendUrl]);
  // ParallaxText defined inside so it can access `bestSeller` state
  function ParallaxText() {
    const baseVelocity = -6; // Negative for leftward movement
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
      clamp: false,
    });

    // Duplicate items for seamless loop
    const items = bestSeller.concat(bestSeller);
    // Wrap between -50% and 0% (second half replaces first)
    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    return (
      <div className="parallax w-full overflow-hidden">
        <motion.div className="scroller flex flex-nowrap px-4 sm:px-8" style={{ x }}>
          {items.map((item, index) => (
            <div key={index} className="flex-none inline-block mr-4">
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className='my-12 bg-white rounded-lg py-8'>
      <div className='text-center text-4xl sm:text-5xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-11/12 sm:w-3/4 mx-auto mt-4 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard.
        </p>
      </div>

      {/* Parallax horizontal scroller like LatestCollection */}
      <div className="overflow-hidden">
        <ParallaxText />
      </div>
    </div>
  );
};

export default BestSeller;