import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) {
      setError('Email and Password required');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Login failed');
        setLoading(false);
        return;
      }

      const data = await res.json();
      onLogin(data.token);
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`fixed inset-0 overflow-hidden ${darkMode ? '' : 'bg-gray-50'}`}>
      {/* Background */}
      <div
        className={`absolute inset-0 overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 animate-gradient-dark'
            : 'bg-gradient-to-br from-teal-50 via-indigo-50 to-cyan-100 animate-gradient-light'
        }`}
      >
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="pattern-lines" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="60" stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(100,100,200,0.08)'} strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-lines)" />
        </svg>
      </div>

      {/* Top right buttons */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            darkMode ? 'border-gray-400 text-gray-300 hover:bg-gray-700' : 'border-gray-600 text-gray-800 hover:bg-gray-200'
          } transition`}
        >
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
        <button
          onClick={() => navigate('/')}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            darkMode ? 'border-gray-400 text-gray-300 hover:bg-gray-700' : 'border-gray-600 text-gray-800 hover:bg-gray-200'
          } transition`}
        >
          Quiz
        </button>
      </div>

      {/* Card */}
      <div className="relative flex items-center justify-center h-screen w-screen">
        <div
          className={`${
            darkMode
              ? 'bg-gray-800/60 border-gray-700 text-gray-200'
              : 'bg-white/60 border-gray-300 text-gray-900 backdrop-blur-md'
          } shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all hover:scale-105 border`}
        >
          <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400'
                  : 'border-gray-300 bg-white/80 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400 transition`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400'
                  : 'border-gray-300 bg-white/80 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400 transition`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

          <Button
            onClick={handleLogin}
            disabled={loading}
            className={`mt-6 w-full ${
              darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
            } font-semibold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-1`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes gradient-light {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-light {
          background-size: 200% 200%;
          animation: gradient-light 10s ease infinite;
        }

        @keyframes gradient-dark {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-dark {
          background-size: 200% 200%;
          animation: gradient-dark 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
