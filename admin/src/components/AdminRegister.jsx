import axios from 'axios';
import { useState } from 'react';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminRegister = ({ setToken }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill all fields');
      return false;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/adminregister`, {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        toast.success('Admin created and logged in');
        navigate('/');
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error', err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Admin Account</h2>
        <div className="space-y-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Full name" className="w-full p-3 border rounded" />
          <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email" className="w-full p-3 border rounded" />
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" className="w-full p-3 border rounded" />
          <input name="password" value={form.password} onChange={onChange} type="password" placeholder="Password" className="w-full p-3 border rounded" />
          <input name="confirm" value={form.confirm} onChange={onChange} type="password" placeholder="Confirm password" className="w-full p-3 border rounded" />
        </div>
        <button disabled={isLoading} className={`mt-4 w-full py-3 rounded text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          {isLoading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
};

AdminRegister.propTypes = { setToken: PropTypes.func.isRequired };

export default AdminRegister;
