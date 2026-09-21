import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Lock, ArrowRight, Shield, CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, go straight to dashboard
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const performLogin = async (u: string, p: string) => {
    setError('');
    setLoading(true);
    try {
      const response = await authService.login({ username: u, password: p });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        role: response.role,
        full_name: response.full_name
      }));
      navigate('/');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  };

  const demoAccounts = [
    { u: 'admin', p: 'admin123', r: 'System Administrator (Full Access)', desc: 'Admin' },
    { u: 'reporting', p: 'report123', r: 'Reporting Officer (R.K. Sharma)', desc: 'Reports' },
    { u: 'analyst', p: 'analyst123', r: 'Data Analyst (P. Verma)', desc: 'Analytics' },
    { u: 'viewer', p: 'viewer123', r: 'Executive Viewer (A. Singh)', desc: 'Read Only' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-14 w-14 bg-blue-700 text-white flex items-center justify-center rounded-2xl shadow-md">
          <Lock size={28} />
        </div>
        <h1 className="mt-5 text-center text-3xl font-extrabold text-slate-900 tracking-tight">MineSight</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          AI-Powered Mining &amp; Reporting Intelligence Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg shadow-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-medium">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </div>
          </form>

          {/* Quick 1-Click Login Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-500 font-medium uppercase tracking-wider">
                  Quick Access Profiles
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {demoAccounts.map(acc => (
                <button
                  type="button"
                  key={acc.u}
                  onClick={() => {
                    setUsername(acc.u);
                    setPassword(acc.p);
                    performLogin(acc.u, acc.p);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                      <Shield size={14} className="text-slate-600 group-hover:text-blue-700" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{acc.r}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{acc.u} • {acc.p}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-700 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
