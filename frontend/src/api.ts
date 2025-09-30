export type PublicQuestion = { id: number; text: string; options: string[] };
export type Answer = { questionId: number; selectedIndex: number };

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchQuestions(): Promise<PublicQuestion[]> {
  const res = await fetch(`${API_BASE}/api/quiz`);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function submitAnswers(payload: {
  email: string;
  timeTakenSeconds: number;
  answers: { questionId: number; selectedIndex: number }[];
}) {
  const res = await fetch('http://localhost:4000/api/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Submit failed: ${res.statusText}`);
  }
  return res.json();
}

