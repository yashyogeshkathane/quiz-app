import React, { useState } from 'react'
import { fetchQuestions, PublicQuestion } from '../api'
import Button from '../components/Button'
import Card from '../components/Card'

export default function Start({ onStart }: { onStart: (qs: PublicQuestion[], email?: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function start() {
    if(!name || !email) { setError('Name and Email required'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/quiz/start', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email })
      }).then(r=>r.json());

      if(res.alreadyTaken){
        alert(`You have already taken the quiz.\nScore: ${res.result.score}/${res.result.total}`);
      } else {
        const qs = await fetchQuestions();
        onStart(qs, email);
      }
    } catch(e:any){
      setError(e.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Quiz</h1>
      <div className="mb-2">
        <input type="text" placeholder="Name" className="w-full p-2 mb-2 border rounded" value={name} onChange={e=>setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Button onClick={start} disabled={loading}>{loading?'Loading...':'Start Quiz'}</Button>
    </Card>
  )
}
