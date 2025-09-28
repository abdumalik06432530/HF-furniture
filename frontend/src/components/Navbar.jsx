import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItems
  } = useContext(ShopContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setVisible(false);
    setProfileOpen(false);
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-sidebar') && visible) {
        setVisible(false);
      }
      if (!e.target.closest('.profile-dropdown') && profileOpen) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, profileOpen]);

  // Navigation items data
  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/collection', label: 'COLLECTION' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
    ...(token ? [{ path: '/orders', label: 'ORDERS' }] : [])
  ];

  return (
    <header className="bg-white sticky top-0 z-50 py-4 px-4 sm:px-8 md:px-12 flex items-center justify-between w-full">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src={assets.logo}
          alt="Hamad Furniture Logo"
          className="h-12 sm:h-14 transition-transform duration-300 group-hover:scale-105"
        />
        <span className="text-xl sm:text-2xl font-semibold text-blue-600 group-hover:text-red-500 transition-colors duration-300 hidden sm:inline">
          Hamad Furniture
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex gap-8 text-base font-medium text-blue-600">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative transition-all duration-300 hover:text-red-500 ${
                    isActive
                      ? 'text-blue-700 font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-500'
                      : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Icons Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Icon */}
        <button
          aria-label="Search"
          onClick={() => {
            setShowSearch(true);
            navigate('/collection');
          }}
          className="p-2 rounded-full hover:bg-blue-50 hover:scale-110 transition-all duration-300"
        >
          <img src={assets.search_icon} className="w-5 sm:w-6 text-blue-600" alt="Search" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button
            aria-label="Profile"
            onClick={() => (token ? setProfileOpen(!profileOpen) : navigate('/login'))}
            className="p-2 rounded-full hover:bg-blue-50 hover:scale-110 transition-all duration-300"
          >
            <img src={assets.profile_icon} className="w-5 sm:w-6 text-blue-600" alt="Profile" />
          </button>
          
          {token && profileOpen && (
            <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-lg py-3 w-56 z-50 text-sm animate-slide-in">
              <button
                onClick={() => {
                  navigate('/profile');
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-5 py-3 text-blue-600 hover:bg-blue-50 hover:text-red-500 transition-all duration-200"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate('/orders');
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-5 py-3 text-blue-600 hover:bg-blue-50 hover:text-red-500 transition-all duration-200"
              >
                My Orders
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Cart Icon with Counter */}
        <Link to="/cart" className="relative p-2 rounded-full hover:bg-blue-50 hover:scale-110 transition-all duration-300">
          <img src={assets.cart_icon} className="w-5 sm:w-6 text-blue-600" alt="Cart" />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 transition-colors duration-200">
              {getCartCount()}
            </span>
          )}
        </Link>

        {/* Dark mode toggle */}
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-blue-50 hover:scale-110 transition-all duration-300"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM15.657 4.343a1 1 0 010 1.414L14.243 7.17a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 15.657a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414a1 1 0 010 1.414zM10 16a1 1 0 011-1v1a1 1 0 11-2 0v-1a1 1 0 011 1zM4.343 15.657a1 1 0 00-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414a1 1 0 000 1.414zM4 10a1 1 0 100 2H3a1 1 0 100-2h1zM4.343 4.343a1 1 0 011.414 0L7.171 5.757A1 1 0 105.757 7.171L4.343 5.757a1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          aria-label="Menu"
          onClick={() => setVisible(true)}
          className="p-2 rounded-full hover:bg-blue-50 hover:scale-110 transition-all duration-300 lg:hidden"
        >
          <img src={assets.menu_icon} className="w-6 sm:w-7 text-blue-600" alt="Menu" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white z-50 transition-transform duration-300 ease-in-out transform ${
          visible ? 'translate-x-0 w-4/5 sm:w-2/5' : 'translate-x-full w-0'
        } overflow-x-hidden mobile-sidebar`}
        aria-hidden={!visible}
      >
        <div className="flex flex-col p-6 gap-6 text-blue-600 h-full">
          {/* Close Button */}
          <button
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 self-start mb-4 text-blue-600 font-medium hover:text-red-500 transition-colors duration-200"
          >
            <img className="w-5 rotate-180" src={assets.dropdown_icon} alt="Close" />
            <span>Close</span>
          </button>

          {/* Mobile Navigation */}
          <nav>
            <ul className="space-y-5 text-base">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg transition-all duration-200 ${
                        isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-blue-50 hover:text-red-500'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              {token && (
                <li>
                  <button
                    onClick={logout}
                    className="block w-full text-left py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    LOGOUT
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </header>
  );
};

// Custom Tailwind animations (kept inline where used)

export default Navbar;