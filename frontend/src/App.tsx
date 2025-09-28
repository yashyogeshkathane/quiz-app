import React, { useState } from 'react'
import Start from './pages/Start'
import QuizPage from './pages/QuizPage'
import Result from './pages/Result'
import type { PublicQuestion } from './api'

export default function App() {
  const [stage, setStage] = useState<'start'|'quiz'|'result'>('start');
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState<string|null>(null);

  return (
    <div className="app-container max-w-2xl mx-auto mt-6">
      {stage === 'start' &&
        <Start onStart={(qs, email) => { setQuestions(qs); setEmail(email!); setStage('quiz'); }} />}
      {stage === 'quiz' &&
        <QuizPage questions={questions} email={email!} onFinish={(res)=>{ setResult(res); setStage('result'); }} />}
      {stage === 'result' &&
        <Result result={result} onRestart={()=>{ setStage('start'); setResult(null); setQuestions([]); setEmail(null); }} />}
    </div>
  )
}
