import React, { useEffect, useState, useRef } from 'react';
import Button from '../components/Button';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import { PublicQuestion, submitAnswers } from '../api';
import { useNavigate } from 'react-router-dom';

export default function QuizPage({
  questions,
  email,
  onFinish,
}: {
  questions: PublicQuestion[];
  email: string;
  onFinish: (res: any) => void;
}) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number>((questions?.length ?? 0) * 30);
  const [timePerQuestion, setTimePerQuestion] = useState<Map<number, number>>(new Map());
  const currentTimeRef = useRef<number>(0);

  // Guard if no questions
  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No questions available.</p>
      </div>
    );
  }

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        currentTimeRef.current += 1;
        setTimePerQuestion((prevMap) => {
          const newMap = new Map(prevMap);
          const prevTime = newMap.get(index) || 0;
          newMap.set(index, prevTime + 1);
          return newMap;
        });
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function selectAnswer(qid: number, idx: number) {
    setAnswers((prev) => new Map(prev).set(qid, idx));
  }

  function goNext() {
    if (index < questions.length - 1) setIndex(index + 1);
  }
  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  async function handleSubmit() {
    const payload = questions.map((q, i) => ({
      questionId: q.id,
      selectedIndex: answers.get(q.id) ?? -1,
      timeTakenSeconds: timePerQuestion.get(i) || 0,
    }));

    try {
      const res = await submitAnswers(email, payload);
      onFinish(res);
    } catch (e: any) {
      alert('Submit failed: ' + e.message);
    }
  }

  const q = questions[index];
  const selected = answers.get(q.id) ?? null;

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
          <h1 className={`text-3xl font-bold mb-6 text-center text-gray-600`}>
            Quiz
          </h1>

          <Timer timeLeft={timeLeft} />

          <QuestionCard question={q} selected={selected} onSelect={(i) => selectAnswer(q.id, i)} />

          <div className="flex justify-between mt-4">
            <button
              onClick={goPrev}
              disabled={index === 0}
              className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1 ${
                darkMode 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed' 
                  : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed'
              } ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            {index < questions.length - 1 ? (
              <button
                onClick={goNext}
                className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
                    : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
                    : 'bg-cyan-400 hover:bg-cyan-300 text-gray-900'
                }`}
              >
                Submit
              </button>
            )}
          </div>

          <div className="mt-4 text-center text-gray-600">
            Question {index + 1} of {questions.length}
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