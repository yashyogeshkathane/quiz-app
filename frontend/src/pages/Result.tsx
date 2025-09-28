import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result({ result, onRestart }: { result: any; onRestart: () => void }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  if (!result) return null;

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
      </div>

      {/* Main card */}
      <div className="flex flex-col items-center w-full py-24 px-4">
        <div
          className={`w-full max-w-xl p-10 ${
            darkMode
              ? 'bg-gray-800/70 border-gray-700 backdrop-blur-md'
              : 'bg-white/60 border-gray-300 backdrop-blur-md'
          } shadow-2xl rounded-3xl text-gray-600`}
        >
          <h2 className={`text-3xl font-bold mb-6 text-center text-gray-600`}>
            Your score: {result.score} / {result.total}
          </h2>

          {result.details && (
            <div className="space-y-4 mb-6">
              {result.details.map((d: any) => (
                <div
                  key={d.questionId}
                  className={`p-4 rounded-lg ${
                    d.correct
                      ? darkMode
                        ? 'bg-green-900/50 text-green-300 border border-green-700'
                        : 'bg-green-100 text-green-800 border border-green-300'
                      : darkMode
                      ? 'bg-red-900/50 text-red-300 border border-red-700'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  <div className="font-semibold">
                    Q{d.questionId}: {d.correct ? '✔️ Correct' : '❌ Incorrect'}
                  </div>
                  {!d.correct && (
                    <div className="text-sm mt-2">
                      Your answer: {d.selectedIndex + 1}, Correct answer: {d.correctIndex + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1 ${
                darkMode
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
              }`}
            >
              Home
            </button>
          </div>
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