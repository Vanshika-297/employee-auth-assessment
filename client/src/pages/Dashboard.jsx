import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Authenticated Session Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Employee'}!
            </h1>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-xl">
              You are securely authenticated using HTTP-only cookies and JSON Web Tokens (JWT).
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-white transition shadow-sm disabled:opacity-60"
          >
            {loggingOut ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-rose-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Logging out...</span>
              </span>
            ) : (
              'Sign Out'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Employee Profile Information
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-500">Full Name</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 sm:mt-0">
                {user?.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-500">Email Address</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 sm:mt-0">
                {user?.email}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-500">Assigned Role</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 uppercase tracking-wide mt-1 sm:mt-0">
                {user?.role || 'user'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-500">Account ID</span>
              <span className="text-xs font-mono text-slate-600 mt-1 sm:mt-0">
                {user?.id || user?._id || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & System Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Security Overview
            </h2>

            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>HTTP-Only Cookie:</strong> Token cannot be stolen via XSS.</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>Bcrypt Password:</strong> Hashed with 10 salt rounds.</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>SameSite & CORS:</strong> Protected against cross-site requests.</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span><strong>Rate Limiting:</strong> Brute-force protection enabled.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 block text-center">
              Employee Practical Assessment &bull; Full-Stack MERN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
