import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Start from './pages/Start';
import QuizPage from './pages/QuizPage';
import Result from './pages/Result';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import type { PublicQuestion } from './api';

function AppRoutes() {
  const [stage, setStage] = useState<'start' | 'quiz' | 'result'>('start');
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleAdminLogin(token: string) {
    setAdminToken(token);
    // ✅ Redirect to dashboard after successful login
    navigate('/admin/dashboard');
  }

  return (
    <Routes>
      {/* User quiz routes */}
      <Route
        path="/"
        element={
          stage === 'start' ? (
            <Start
              onStart={(qs, email) => {
                setQuestions(qs);
                setEmail(email!);
                setStage('quiz');
              }}
            />
          ) : stage === 'quiz' ? (
            <QuizPage
              questions={questions}
              email={email!}
              onFinish={(res) => {
                setResult(res);
                setStage('result');
              }}
            />
          ) : (
            <Result
              result={result}
              onRestart={() => {
                setStage('start');
                setResult(null);
                setQuestions([]);
                setEmail(null);
              }}
            />
          )
        }
      />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
      <Route
        path="/admin/dashboard"
        element={
          adminToken ? (
            <AdminDashboard token={adminToken} />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container max-w-2xl mx-auto mt-6">
        <AppRoutes />
      </div>
    </Router>
  );
}
