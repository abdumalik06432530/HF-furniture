import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/list`);
        if (!mounted) return;
        if (res.data?.success) {
          const products = res.data.products || [];
          const map = new Map();
          for (const p of products) {
            if (!p.category) continue;
            if (!map.has(p.category) && p.image && p.image.length) {
              map.set(p.category, { category: p.category, image: p.image[0] });
            }
            if (map.size >= 5) break;
          }
          setSlides(Array.from(map.values()));
        }
      } catch (err) {
        // ignore; hero can render without images
      }
    })();
    return () => {
      mounted = false;
    };
  }, [backendUrl]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setActive((a) => (a + 1) % slides.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides]);

  const goTo = (i) => {
    setActive(i);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <BackgroundGradientAnimation>
      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row px-6 sm:px-4 text-black">
        {/* Text and Buttons */}
        <div className="w-full md:w-1/2 max-w-3xl md:text-left mt-20 md:mt-[120px]">
          {/* Heading */}
          <h1 className="prata-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight md:leading-[1.05] tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 drop-shadow-[0_4px_12px_rgba(59,130,246,0.12)]">
              Modern & Luxury Furniture
            </span>
            <br /> 
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-4 block gap-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-900">Made</span>
              <span className="text-red-600 mx-2">,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">Importers</span>
              <span className="text-red-600 mx-2">,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">Distributors</span>
            </span>
          </h1>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row md:justify-start justify-center gap-4 sm:gap-6">
            <button onClick={() => navigate('/collection')} className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-bold uppercase text-xs sm:text-sm tracking-widest hover:opacity-95 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Shop Collection
            </button>
            <button onClick={() => navigate('/how-to-use')} className="border-2 border-red-600/80 text-red-700 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full font-bold uppercase text-xs sm:text-sm tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 bg-white/90 backdrop-blur-sm">
              How to use
            </button>
          </div>
        </div>
<br /> <br />
        {/* Mobile Carousel */}
        <div className="md:hidden w-full mt-10 flex items-center justify-center">
          {slides.length === 0 ? (
            <div className="w-11/12 h-56 sm:h-72 rounded-xl flex items-center justify-center text-sm bg-transparent text-black">
              No images
            </div>
          ) : (
            <div className="w-11/12 h-56 sm:h-72 relative rounded-xl overflow-hidden">
              {slides.map((s, idx) => (
                <div
                  key={s.category}
                  className={`absolute inset-0 transition-opacity duration-500 ${idx === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <img src={s.image} alt={s.category} className="w-full h-full object-contain sm:object-cover object-center" />
                  <div className="absolute left-4 bottom-4 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-sm transform transition-transform duration-300 hover:scale-105 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-bold">{s.category ? s.category.charAt(0).toUpperCase() : ''}</span>
                    <span className="uppercase tracking-wide text-[11px] sm:text-sm font-semibold">{s.category}</span>
                  </div>
                </div>
              ))}

              {/* Mobile dots */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-3 h-3 rounded-full ${i === active ? 'bg-blue-800' : 'bg-blue-300/70'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Carousel */}
  <div className="hidden md:block absolute right-6 top-1/2 transform -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center pointer-events-auto">
          {slides.length === 0 ? (
            <div className="w-full h-full rounded-xl flex items-center justify-center text-xs bg-transparent text-black">No images</div>
          ) : (
            <div className="relative w-full h-full">
              {slides.map((s, idx) => (
                <div
                  key={s.category}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    idx === active ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  } group`}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300">
                    <img
                      src={s.image}
                      alt={s.category}
                      className="w-full h-full object-contain md:object-cover object-center"
                      style={{ background: 'transparent' }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute left-4 bottom-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-sm transform transition-transform duration-300 hover:scale-105 flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-sm font-bold">{s.category ? s.category.charAt(0).toUpperCase() : ''}</span>
                    <span className="uppercase tracking-wide text-sm md:text-base font-semibold">{s.category}</span>
                  </div>
                </div>
              ))}

              {/* Desktop dots */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-3 h-3 rounded-full ${i === active ? 'bg-blue-800' : 'bg-blue-300/70'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;
