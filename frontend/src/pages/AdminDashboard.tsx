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
  timeTakenSeconds: number;
  examGivenAt: string; // from created_at in backend
  answers: AnswerDetail[];
};

export default function AdminDashboard({ token }: { token: string }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [attempts, setAttempts] = useState<AttemptData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptData | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
          timeTakenSeconds: a.timeTakenSeconds,
          examGivenAt: a.submittedAt, // backend should alias created_at as examGivenAt
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAttempts = attempts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(attempts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    const cardElement = document.querySelector('.main-card');
    if (cardElement) {
      cardElement.scrollTop = 0;
    }
  };

  function handleLogout() {
    navigate('/admin/login');
  }

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div
        className={`flex justify-center items-center space-x-2 mt-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : darkMode
              ? 'border-gray-400 hover:bg-gray-700'
              : 'border-gray-600 hover:bg-gray-200'
          } transition`}
        >
          «
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : darkMode
              ? 'border-gray-400 hover:bg-gray-700'
              : 'border-gray-600 hover:bg-gray-200'
          } transition`}
        >
          ‹
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded-lg font-semibold border transition ${
              currentPage === number
                ? darkMode
                  ? 'bg-cyan-600 border-cyan-600 text-white'
                  : 'bg-cyan-400 border-cyan-400 text-gray-900'
                : darkMode
                ? 'border-gray-400 hover:bg-gray-700'
                : 'border-gray-600 hover:bg-gray-200'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : darkMode
              ? 'border-gray-400 hover:bg-gray-700'
              : 'border-gray-600 hover:bg-gray-200'
          } transition`}
        >
          ›
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg font-semibold border ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : darkMode
              ? 'border-gray-400 hover:bg-gray-700'
              : 'border-gray-600 hover:bg-gray-200'
          } transition`}
        >
          »
        </button>
      </div>
    );
  };

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

      <div className="flex flex-col items-center w-full py-20 px-4 mt-12">
        <div
          className={`main-card w-full max-w-6xl p-6 max-h-[75vh] overflow-y-auto ${
            darkMode
              ? 'bg-gray-800/70 border-gray-700 backdrop-blur-md'
              : 'bg-white/60 border-gray-300 backdrop-blur-md'
          } shadow-2xl rounded-3xl text-gray-600`}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-600">
            Admin Dashboard
          </h1>

          {loading && <p className="text-center text-gray-400">Loading attempts...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {selectedAttempt ? (
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
                Quiz Taken: {new Date(selectedAttempt.examGivenAt).toLocaleString()} | Time Taken:{' '}
                {selectedAttempt.timeTakenSeconds} seconds
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
                    <div className="font-semibold mb-4 text-gray-600">
                      {idx + 1}. {ans.questionText}
                    </div>
                    <div className="space-y-3">
                      {ans.options.map((opt, i) => {
                        const isSelected = i === ans.selectedIndex;
                        const isCorrect = i === ans.correctIndex;
                        let bgClass = '';
                        let borderClass = '';
                        let textClass = 'text-gray-600';

                        if (isSelected && ans.correct) {
                          bgClass = darkMode ? 'bg-green-900/50' : 'bg-green-100';
                          borderClass = darkMode
                            ? 'border border-green-600'
                            : 'border border-green-400';
                        } else if (isSelected && !ans.correct) {
                          bgClass = darkMode ? 'bg-red-900/50' : 'bg-red-100';
                          borderClass = darkMode
                            ? 'border border-red-600'
                            : 'border border-red-400';
                        } else if (!isSelected && isCorrect) {
                          borderClass = darkMode
                            ? 'border-2 border-green-600'
                            : 'border-2 border-green-400';
                        }

                        return (
                          <div
                            key={i}
                            className={`px-4 py-3 rounded-lg flex justify-between items-center ${bgClass} ${borderClass} ${textClass}`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span
                                className={`font-bold ${
                                  ans.correct ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {ans.correct ? '✔' : '✖'}
                              </span>
                            )}
                            {!isSelected && isCorrect && (
                              <span className="text-green-600 font-bold">✔</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className={`${
                        darkMode
                          ? 'bg-gray-700/50 text-gray-300'
                          : 'bg-gray-200/50 text-gray-700'
                      } backdrop-blur-md sticky top-0`}
                    >
                      <th className="border border-gray-500 px-6 py-4 text-left">Name</th>
                      <th className="border border-gray-500 px-6 py-4 text-left">Email</th>
                      <th className="border border-gray-500 px-6 py-4 text-left">Score</th>
                      <th className="border border-gray-500 px-6 py-4 text-left">Exam Given</th>
                      <th className="border border-gray-500 px-6 py-4 text-left">Time Taken (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAttempts.map((attempt, idx) => (
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
                        <td className="border border-gray-500 px-6 py-4">
                          {attempt.score} / {attempt.total}
                        </td>
                        <td className="border border-gray-500 px-6 py-4">
                          {new Date(attempt.examGivenAt).toLocaleString()}
                        </td>
                        <td className="border border-gray-500 px-6 py-4">
                          {attempt.timeTakenSeconds}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {attempts.length > 0 && (
                <div className="mt-4">
                  <div
                    className={`text-center mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Showing {indexOfFirstItem + 1} to{' '}
                    {Math.min(indexOfLastItem, attempts.length)} of {attempts.length} attempts
                  </div>
                  <Pagination />
                </div>
              )}
            </>
          )}
        </div>
      </div>

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

        .main-card::-webkit-scrollbar {
          width: 8px;
        }
        .main-card::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .main-card::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .main-card::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
