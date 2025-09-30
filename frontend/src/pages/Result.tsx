import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result({ result, onRestart }: { result: any; onRestart: () => void }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  if (!result) return null;

  return (
    <div
      className={`min-h-screen w-full fixed top-0 left-0 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 animate-gradient-dark'
          : 'bg-gradient-to-br from-teal-50 via-indigo-50 to-cyan-100 animate-gradient-light'
      } flex justify-center items-start py-12 px-4 overflow-auto`}
    >
      {/* Top-right dark mode toggle */}
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

      {/* Main scrollable card */}
      <div
        className={`w-full max-w-5xl p-10 ${
          darkMode
            ? 'bg-gray-800/70 border-gray-700 backdrop-blur-md'
            : 'bg-white/60 border-gray-300 backdrop-blur-md'
        } shadow-2xl rounded-3xl text-gray-600 overflow-auto`}
        style={{ maxHeight: '80vh', minWidth: '800px' }}
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-600">
          Your score: {result.score} / {result.total}
        </h2>
        <h3 className="text-lg mb-6 text-center text-gray-500">
          Total time taken: {result.timeTakenSeconds ?? 0} sec
        </h3>

        {result.details && (
          <div className="flex flex-col space-y-4">
            {result.details.map((d: any, idx: number) => (
              <div
                key={idx}
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
                <div className="font-semibold mb-2">
                  Q{idx + 1}: {d.text}
                </div>
                <ul className="list-disc pl-5">
                  {d.options.map((opt: string, i: number) => (
                    <li
                      key={i}
                      className={`${
                        i === d.selectedIndex
                          ? darkMode
                            ? 'text-yellow-300 font-semibold'
                            : 'text-yellow-800 font-semibold'
                          : ''
                      } ${
                        i === d.correctIndex
                          ? darkMode
                            ? 'text-green-400 font-semibold'
                            : 'text-green-900 font-semibold'
                          : ''
                      }`}
                    >
                      {opt} {i === d.correctIndex ? '✔️' : ''} {i === d.selectedIndex ? '(Your choice)' : ''}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-sm">{d.correct ? '✅ Correct' : '❌ Incorrect'}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onRestart}
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
