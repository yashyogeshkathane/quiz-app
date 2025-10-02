import React, { useState } from 'react';
import { fetchQuestions, PublicQuestion } from '../api';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Start({ onStart }: { onStart: (qs: PublicQuestion[], email?: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [scoreData, setScoreData] = useState<{score: number, total: number,created_at?: string} | null>(null);

  const navigate = useNavigate();

  async function start() {
    if (!name || !email) {
      setError('Name and Email are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      }).then((r) => r.json());

      if (res.alreadyTaken) {
        setScoreData({
          score: res.result.score,
          total: res.result.total,
          created_at: res.result.created_at
        });
        setShowScorePopup(true);
      } else {
        const qs = await fetchQuestions();
        onStart(qs, email);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  }

  function handleClosePopup() {
    setShowScorePopup(false);
    setScoreData(null);
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
        {/* Stronger diagonal lines effect */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="lightPattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y="0" x2="0" y2="60" stroke="rgba(100,100,200,0.08)" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lightPattern)" />
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
          onClick={() => navigate('/admin/login')}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            darkMode ? 'border-gray-400 text-gray-300 hover:bg-gray-700' : 'border-gray-600 text-gray-800 hover:bg-gray-200'
          } transition`}
        >
          Admin
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
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Quiz</h1>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400'
                  : 'border-gray-300 bg-white/80 text-gray-900 placeholder-gray-500 backdrop-blur-sm'
              } focus:outline-none focus:ring-2 focus:ring-cyan-400 transition`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
          </div>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

          <Button
            onClick={start}
            disabled={loading}
            className={`mt-6 w-full ${
              darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
            } font-semibold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-1`}
          >
            {loading ? 'Loading...' : 'Start Quiz'}
          </Button>
        </div>
      </div>

      {/* Score Popup */}
      {showScorePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div
            className={`${
              darkMode
                ? 'bg-gray-800/90 border-gray-700 text-gray-200'
                : 'bg-white/90 border-gray-300 text-gray-900 backdrop-blur-md'
            } shadow-2xl rounded-3xl p-8 w-full max-w-md transform transition-all border`}
          >
            <h2 className="text-2xl font-bold text-center mb-4">Quiz Already Taken</h2>
            <div className="text-center mb-6">
              <p className="text-lg mb-2">You have already taken the quiz.{scoreData?.created_at && (<> You took the test on {new Date(scoreData.created_at).toLocaleString()}</>)}</p>
              <p className="text-xl font-semibold">
                Score: {scoreData?.score} / {scoreData?.total}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleClosePopup}
                className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1 ${
                  darkMode
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

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