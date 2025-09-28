import express from 'express';
import pool from '../db';
import { QuestionPublic, Answer } from '../types';
import scoreSubmission from '../scoring';

const router = express.Router();

// Start quiz: check email
router.post('/start', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  // check if user exists
  const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (userRes.rows.length > 0) {
    return res.json({ alreadyTaken: true, result: userRes.rows[0] });
  }

  // insert new user
  await pool.query('INSERT INTO users (name, email) VALUES ($1,$2)', [name, email]);
  res.json({ alreadyTaken: false });
});


router.get('/', async (req, res) => {
  const q = await pool.query('SELECT id, text, options FROM questions ORDER BY id');
  const rows = q.rows.map((r: any) => ({ id: r.id, text: r.text, options: r.options }));
  res.json(rows as QuestionPublic[]);
});


router.post('/submit', async (req, res) => {
  const { email, answers }: { email:string, answers: Answer[] } = req.body;
  if (!email || !Array.isArray(answers)) return res.status(400).json({ error: 'Email and answers required' });

  const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (userRes.rows.length === 0) return res.status(400).json({ error: 'User not found' });

  const q = await pool.query('SELECT id, text, options, correct_index FROM questions');
  const questions = q.rows;

  const result = scoreSubmission(
    answers,
    questions.map(r => ({ id: r.id, text: r.text, options: r.options, correct_index: r.correct_index }))
  );

  
  await pool.query(
    'UPDATE users SET score=$1, total=$2, details=$3 WHERE email=$4',
    [result.score, result.total, JSON.stringify(result.details), email]
  );

  res.json(result);
});

export default router;

