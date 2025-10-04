import axios from 'axios';
import { useState } from 'react';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import sanitizeMessage from '../utils/sanitizeMessage';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Only admin login allowed
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use regular login endpoint so DB-created admins can login
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;
        setToken(token);
        toast.success('Logged in');

  // Navigate to root; App.jsx will render the proper dashboard based on token role
  navigate('/');
      } else {
        toast.error(sanitizeMessage(response.data.message));
      }
    } catch (error) {
      console.error('Login error:', error);
  toast.error(sanitizeMessage(error.response?.data?.message) || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl px-8 py-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Login Panel</h1>
          <p className="text-gray-500 mt-2">Access your administration account</p>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              type="password"
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>
          {/* Create admin account link removed - only existing admins may log in */}
          <button 
            className={`w-full py-3 px-4 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};