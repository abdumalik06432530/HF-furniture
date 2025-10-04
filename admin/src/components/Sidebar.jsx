import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import PropTypes from 'prop-types';

const Sidebar = () => {
  return (
    <div className="fixed bottom-0 w-full sm:static sm:w-16 md:w-60 min-h-[60px] sm:min-h-screen bg-white text-gray-800 shadow-lg sm:shadow-2xl flex flex-row sm:flex-col border-t sm:border-t-0 sm:border-r border-gray-100 z-50">
      {/* Navigation */}
      <nav className="flex flex-row sm:flex-col gap-2 sm:gap-3 sm:mt-8 px-2 sm:px-5 text-sm font-semibold overflow-x-auto sm:overflow-x-visible">
        <SidebarLink to="/dashboard" icon={assets.dashboard_icon} label="Dashboard" emoji="📊" />
        <SidebarLink to="/add" icon={assets.add_icon} label="Add Items" emoji="➕" />
        <SidebarLink to="/list" icon={assets.list_icon || assets.order_icon} label="List Items" emoji="📋" />
        <SidebarLink to="/orders" icon={assets.order_icon} label="Orders" emoji="🧾" />
        <SidebarLink to="/users" icon={assets.users_icon} label="Users" emoji="👥" />
        <SidebarLink to="/profile" icon={assets.logo} label="Profile" emoji="👤" />
      </nav>

      {/* Footer */}
      <div className="hidden sm:block mt-auto p-5 text-xs text-gray-400 border-t border-gray-200 bg-gray-50">
        © 2025 Malik Dev. All rights reserved.
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, emoji }) => {
  const hasIcon = Boolean(icon);
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        `relative flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-xl transition-colors duration-200 group
          ${isActive
            ? 'bg-indigo-600 text-white shadow-md sm:shadow-lg'
            : 'hover:bg-indigo-50 hover:text-indigo-700 text-gray-800'}`
      }
    >
      <div className={`flex items-center gap-2 sm:gap-3 ${hasIcon ? 'justify-start' : 'justify-center'}`}>
        {hasIcon ? (
          <img
            className="w-5 h-5 sm:w-6 sm:h-6"
            src={icon}
            alt={label}
          />
        ) : (
          <span className="text-base sm:text-lg">{emoji}</span>
        )}
      </div>
      
      {/* Text label - visible on medium+ screens */}
      <span className="hidden md:inline font-medium">{label}</span>
      
      {/* Tooltip for mobile and small screens */}
      <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 sm:hidden">
        {label}
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </span>
    </NavLink>
  );
};

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  emoji: PropTypes.string,
};

export default Sidebar;