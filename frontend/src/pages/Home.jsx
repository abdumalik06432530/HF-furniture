import React from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center snap-start overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-12 animate-fade-in-up">
          <Hero />
        </div>
      </section>

      {/* Latest Collection Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 snap-start border-t border-gray-200">
        <div className="max-w-7xl mx-auto animate-slide-in">
          <LatestCollection />
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 snap-start bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto animate-slide-in">
          <BestSeller />
        </div>
      </section>

      {/* Our Policy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 snap-start border-t border-gray-200">
        <div className="max-w-7xl mx-auto animate-slide-in">
          <OurPolicy />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 snap-start bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto animate-slide-in">
          <NewsletterBox />
        </div>
      </section>
    </div>
  );
};

// Custom Tailwind animations
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 1s ease-out forwards;
  }

  .animate-slide-in {
    animation: slide-in 1s ease-out forwards;
  }
`;

export default Home;