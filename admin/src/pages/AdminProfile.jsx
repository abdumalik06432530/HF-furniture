import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const AdminProfile = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const { user } = res.data;
        setForm({ name: user.name || '', email: user.email || '', password: '', confirmPassword: '' });
      } else {
        toast.error(res.data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProfile(); }, [token, fetchProfile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (name === 'password' || name === 'confirmPassword') {
      const pw = name === 'password' ? value : form.password;
      const cpw = name === 'confirmPassword' ? value : form.confirmPassword;
      if (pw && pw.length < 6) setPasswordError('Password must be at least 6 characters');
      else if (pw && cpw && pw !== cpw) setPasswordError("New passwords don't match");
      else setPasswordError('');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...form };
      // Validate passwords client-side if a new password was entered
      if (payload.password) {
        if (payload.password !== payload.confirmPassword) {
          toast.error('New password and confirm password do not match');
          setLoading(false);
          return;
        }
        // Optional: enforce minimum length
        if (payload.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
      }
      // Do not send confirmPassword to backend
      delete payload.confirmPassword;
      // Do not send empty password
      if (!payload.password) delete payload.password;
      const res = await axios.post(`${backendUrl}/api/user/profile/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success('Profile updated');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Admin Profile</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={onChange} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input name="email" value={form.email} onChange={onChange} type="email" className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">New Password (leave blank to keep)</label>
          <input name="password" value={form.password} onChange={onChange} type="password" className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Confirm New Password</label>
          <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" className="w-full mt-1 p-2 border rounded" />
          {passwordError && <p className="text-sm text-red-600 mt-2">{passwordError}</p>}
        </div>
        <div>
          <button className={`px-4 py-2 bg-indigo-600 text-white rounded ${loading || passwordError ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={loading || Boolean(passwordError)}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

AdminProfile.propTypes = { token: PropTypes.string };

export default AdminProfile;