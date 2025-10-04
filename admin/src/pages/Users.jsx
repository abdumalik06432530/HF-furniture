import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import sanitizeMessage from '../utils/sanitizeMessage';

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${backendUrl}/api/user/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      if (res.data.success) {
        setUsers(res.data.users || []);
      } else {
        toast.error(sanitizeMessage(res.data.message));
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const toggleStatus = async (userId, isActive) => {
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/${userId}/status`, { isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('User status updated');
        fetchUsers();
      } else {
        toast.error(sanitizeMessage(res.data.message));
      }
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const bulkToggleStatus = async (isActive) => {
    if (selected.length === 0) return;
    try {
      setBulkLoading(true);
      await Promise.all(selected.map(id => 
        axios.post(`${backendUrl}/api/user/${id}/status`, { isActive }, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ));
      toast.success('Bulk update completed');
      setSelected([]);
      fetchUsers();
    } catch (err) {
      console.error('Bulk update failed', err);
      toast.error(err.message || 'Bulk update failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchesQuery = `${u.name} ${u.email} ${u.role} ${u.phone}`.toLowerCase().includes(query.toLowerCase());
    if (!matchesQuery) return false;
    if (filter === 'all') return true;
    if (filter === 'active') return u.isActive;
    if (filter === 'disabled') return !u.isActive;
    return true;
  });

  const isAllSelected = filtered.length > 0 && selected.length === filtered.length;

  // Mobile card view component
  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selected.includes(user._id)}
            onChange={() => {
              if (selected.includes(user._id)) 
                setSelected(prev => prev.filter(id => id !== user._id));
              else 
                setSelected(prev => [...prev, user._id]);
            }}
            className="h-4 w-4"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Active' : 'Disabled'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-gray-500">Role:</span>
          <span className="ml-1 capitalize">{user.role}</span>
        </div>
        <div>
          <span className="text-gray-500">Phone:</span>
          <span className="ml-1">{user.phone || '-'}</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Created:</span>
          <span className="ml-1">{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <select
          value={user.isActive ? 'active' : 'disabled'}
          onChange={(e) => toggleStatus(user._id, e.target.value === 'active')}
          className="p-2 rounded-md border border-gray-300 text-sm flex-1 mr-2"
        >
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
        {user.isActive ? (
          <button
            onClick={() => toggleStatus(user._id, false)}
            className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            Deactivate
          </button>
        ) : (
          <button
            onClick={() => toggleStatus(user._id, true)}
            className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            Activate
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          👥 Users
        </h2>
        
        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm shadow-sm"
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="p-3 rounded-lg border border-gray-200 bg-white text-sm w-full sm:w-auto"
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-blue-800 font-medium text-sm">
                {selected.length} user{selected.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  id="bulkStatus" 
                  className="p-2 rounded-lg border border-gray-200 bg-white text-sm flex-1 sm:flex-none"
                >
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                </select>
                <button
                  disabled={bulkLoading}
                  onClick={() => {
                    const sel = document.getElementById('bulkStatus')?.value;
                    if (sel === 'activate') bulkToggleStatus(true);
                    else bulkToggleStatus(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm disabled:opacity-50 hover:bg-indigo-700 flex-1 sm:flex-none"
                >
                  {bulkLoading ? 'Applying...' : 'Apply'}
                </button>
                <button
                  onClick={() => setSelected([])}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users List */}
      {isMobile ? (
        /* Mobile Card View */
        <div className="bg-transparent">
          {loading ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="animate-pulse">Loading users...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No users found</p>
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div>
              {filtered.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-xl shadow-md overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected} 
                    onChange={() => {
                      if (isAllSelected) setSelected([]);
                      else setSelected(filtered.map(u => u._id));
                    }} 
                  />
                </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center">
                    <div className="animate-pulse">Loading users...</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center">
                    <p className="text-gray-500">No users found</p>
                    {query && (
                      <button 
                        onClick={() => setQuery('')}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(u._id)} 
                        onChange={() => {
                          if (selected.includes(u._id)) 
                            setSelected(prev => prev.filter(id => id !== u._id));
                          else 
                            setSelected(prev => [...prev, u._id]);
                        }} 
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.isActive ? 'active' : 'disabled'}
                        onChange={(e) => toggleStatus(u._id, e.target.value === 'active')}
                        className="p-2 rounded-md border border-gray-300 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{u.phone || '-'}</td>
                    <td className="px-4 py-3">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {u.isActive ? (
                        <button
                          onClick={() => toggleStatus(u._id, false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(u._id, true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;