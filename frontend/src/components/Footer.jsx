import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { SiTiktok, SiX } from 'react-icons/si';

const Footer = () => {
  // Navigation items to match Navbar
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/collection', label: 'Collection' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/orders', label: 'Orders' },
  ];

  return (
    <footer className="bg-black text-white px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 animate-fade-in">
        {/* Logo & Socials */}
        <div className="flex flex-col items-start gap-4 bg-black">
          <img
            src={assets.logo}
            alt="Hamad Furniture Logo"
            className="w-20 sm:w-24 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          />
          <div className="flex gap-3">
            {[
              { Icon: FaFacebookF, label: 'Facebook' },
              { Icon: SiTiktok, label: 'TikTok' },
              { Icon: FaLinkedinIn, label: 'LinkedIn' },
              { Icon: SiX, label: 'X' },
            ].map(({ Icon, label }, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-black bg-opacity-10 rounded-full hover:bg-gray-700 hover:text-white hover:scale-105 transition-all duration-300"
                aria-label={`Visit our ${label}`}
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <ul className="space-y-2 text-xs">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-all duration-200 hover:text-gray-300 ${
                      isActive ? 'text-white font-medium' : 'text-gray-300'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-start gap-3 text-xs bg-black bg-opacity-90 p-4 rounded-md shadow-sm">
          <h3 className="text-sm font-semibold text-white">Contact Us</h3>
          <p className="text-gray-300 hover:text-white transition-colors duration-200">
            Main Office
          </p>
          <a
            href="tel:+251111234567"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            +251-11-123-4567
          </a>
          <a
            href="mailto:contact@hamadfurniture.com"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            contact@hamadfurniture.com
          </a>
          <p className="text-gray-300 hover:text-white transition-colors duration-200">
            Bole, Addis Ababa
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-2xs text-gray-400 mt-6 border-t border-gray-700 pt-3">
        © 2025 Hamad Furniture. All rights reserved.
      </div>
    </footer>
  );
};

// Custom Tailwind animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;

export default Footer;