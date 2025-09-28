import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AnswerDetail = {
  questionText: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  correct: boolean;
};

type AttemptData = {
  userName: string;
  userEmail: string;
  score: number;
  total: number;
  startedAt: string;
  submittedAt: string;
  answers: AnswerDetail[];
};

export default function AdminDashboard({ token }: { token: string }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [attempts, setAttempts] = useState<AttemptData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptData | null>(null);

  useEffect(() => {
    async function fetchAttempts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:4000/api/admin/attempts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch attempts');
        const data = await res.json();

        const formatted: AttemptData[] = data.map((a: any) => ({
          userName: a.userName,
          userEmail: a.userEmail,
          score: a.score,
          total: a.total,
          startedAt: a.startedAt,
          submittedAt: a.submittedAt,
          answers: a.answers.map((ans: any) => ({
            questionText: ans.questionText || 'Question text missing',
            options: ans.options || [],
            selectedIndex: ans.selectedIndex,
            correctIndex: ans.correctIndex,
            correct: ans.correct,
          })),
        }));

        setAttempts(formatted);
      } catch (e: any) {
        setError(e.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchAttempts();
  }, [token]);

  function handleLogout() {
    navigate('/admin/login');
  }

  return (
    <div
      className={`min-h-screen w-full fixed top-0 left-0 overflow-auto ${
        darkMode
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 animate-gradient-dark'
          : 'bg-gradient-to-br from-teal-50 via-indigo-50 to-cyan-100 animate-gradient-light'
      }`}
    >
      {/* Top-right buttons */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            darkMode
              ? 'border-gray-400 text-gray-300 hover:bg-gray-700'
              : 'border-gray-600 text-gray-800 hover:bg-gray-200'
          } transition`}
        >
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
        <button
          onClick={handleLogout}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            darkMode
              ? 'border-gray-400 text-gray-300 hover:bg-gray-700'
              : 'border-gray-600 text-gray-800 hover:bg-gray-200'
          } transition`}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center w-full py-24 px-4">
        {/* Card */}
        <div
          className={`w-full max-w-6xl p-10 ${
            darkMode
              ? 'bg-gray-800/70 border-gray-700 backdrop-blur-md'
              : 'bg-white/60 border-gray-300 backdrop-blur-md'
          } shadow-2xl rounded-3xl text-gray-600`}
        >
          <h1 className={`text-3xl font-bold mb-6 text-center text-gray-600`}>
            Admin Dashboard
          </h1>

          {loading && <p className="text-center text-gray-400">Loading attempts...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {selectedAttempt ? (
            // Detailed Attempt View - Scrollable
            <div className="max-h-[70vh] overflow-y-auto pr-4">
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1 ${
                    darkMode
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
                  }`}
                >
                  ← Back to summary
                </button>

                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                  {selectedAttempt.userName} ({selectedAttempt.userEmail})
                </h2>
                <div className="mb-2 text-gray-500">
                  Started: {new Date(selectedAttempt.startedAt).toLocaleString()} | Submitted:{' '}
                  {new Date(selectedAttempt.submittedAt).toLocaleString()}
                </div>
                <div className="mb-6 font-semibold text-gray-600">
                  Score: {selectedAttempt.score} / {selectedAttempt.total}
                </div>

                <div className="space-y-4">
                  {selectedAttempt.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl backdrop-blur-md border ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600'
                          : 'bg-white/50 border-gray-300'
                      } shadow-md`}
                    >
                      <div className="font-semibold mb-4 text-gray-600">{idx + 1}. {ans.questionText}</div>
                      <div className="space-y-3">
                        {ans.options.map((opt, i) => {
                          const isSelected = i === ans.selectedIndex;
                          const isCorrect = i === ans.correctIndex;
                          let bgClass = '';
                          let borderClass = '';
                          let textClass = 'text-gray-600';

                          if (isSelected && ans.correct) {
                            bgClass = darkMode ? 'bg-green-900/50' : 'bg-green-100';
                            borderClass = darkMode ? 'border border-green-600' : 'border border-green-400';
                          } else if (isSelected && !ans.correct) {
                            bgClass = darkMode ? 'bg-red-900/50' : 'bg-red-100';
                            borderClass = darkMode ? 'border border-red-600' : 'border border-red-400';
                          } else if (!isSelected && isCorrect) {
                            borderClass = darkMode ? 'border-2 border-green-600' : 'border-2 border-green-400';
                          }

                          return (
                            <div
                              key={i}
                              className={`px-4 py-3 rounded-lg flex justify-between items-center ${bgClass} ${borderClass} ${textClass}`}
                            >
                              <span>{opt}</span>
                              {isSelected && (
                                <span className={`font-bold ${ans.correct ? 'text-green-600' : 'text-red-600'}`}>
                                  {ans.correct ? '✔' : '✖'}
                                </span>
                              )}
                              {!isSelected && isCorrect && <span className="text-green-600 font-bold">✔</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Summary Table
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/50 text-gray-700'} backdrop-blur-md`}>
                    <th className="border border-gray-500 px-6 py-4 text-left">Name</th>
                    <th className="border border-gray-500 px-6 py-4 text-left">Email</th>
                    <th className="border border-gray-500 px-6 py-4 text-left">Score</th>
                    <th className="border border-gray-500 px-6 py-4 text-left">Started At</th>
                    <th className="border border-gray-500 px-6 py-4 text-left">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer transition ${
                        darkMode 
                          ? 'hover:bg-gray-700/30 text-gray-300' 
                          : 'hover:bg-gray-100/50 text-gray-700'
                      } backdrop-blur-sm`}
                      onClick={() => setSelectedAttempt(attempt)}
                    >
                      <td className="border border-gray-500 px-6 py-4">{attempt.userName}</td>
                      <td className="border border-gray-500 px-6 py-4">{attempt.userEmail}</td>
                      <td className="border border-gray-500 px-6 py-4">{attempt.score} / {attempt.total}</td>
                      <td className="border border-gray-500 px-6 py-4">{new Date(attempt.startedAt).toLocaleString()}</td>
                      <td className="border border-gray-500 px-6 py-4">{new Date(attempt.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Gradient animations */}
      <style>{`
        @keyframes gradient-light {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-light { background-size: 200% 200%; animation: gradient-light 10s ease infinite; }

        @keyframes gradient-dark {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-dark { background-size: 200% 200%; animation: gradient-dark 15s ease infinite; }
      `}</style>
    </div>
  );
}