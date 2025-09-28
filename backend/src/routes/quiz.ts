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


// router.post('/submit', async (req, res) => {
//   const { email, answers }: { email:string, answers: Answer[] } = req.body;
//   if (!email || !Array.isArray(answers)) return res.status(400).json({ error: 'Email and answers required' });

//   const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
//   if (userRes.rows.length === 0) return res.status(400).json({ error: 'User not found' });

//   const q = await pool.query('SELECT id, text, options, correct_index FROM questions');
//   const questions = q.rows;

//   const result = scoreSubmission(
//     answers,
//     questions.map(r => ({ id: r.id, text: r.text, options: r.options, correct_index: r.correct_index }))
//   );

  
//   await pool.query(
//     'UPDATE users SET score=$1, total=$2, details=$3 WHERE email=$4',
//     [result.score, result.total, JSON.stringify(result.details), email]
//   );

//   res.json(result);
// });

router.post('/submit', async (req, res) => {
  const { email, answers }: { email: string; answers: Answer[] } = req.body;
  if (!email || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Email and answers required' });
  }

  // 1. Get the user
  const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (userRes.rows.length === 0) {
    return res.status(400).json({ error: 'User not found' });
  }
  const user = userRes.rows[0];

  // 2. Get all questions
  const q = await pool.query('SELECT id, text, options, correct_index FROM questions');
  const questions = q.rows;

  // 3. Score the submission
  const result = scoreSubmission(
    answers,
    questions.map(r => ({
      id: r.id,
      text: r.text,
      options: r.options,
      correct_index: r.correct_index,
    }))
  );

  // Use transaction to ensure consistency
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 4. Insert into attempts table
    const attemptRes = await client.query(
      `INSERT INTO attempts (user_id, score, total, started_at, submitted_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id`,
      [user.id, result.score, result.total]
    );
    const attemptId = attemptRes.rows[0].id;

    const details = result.details ?? [];

    // 5. Insert each answer into answers table
    for (const ans of details) {
      await client.query(
        `INSERT INTO answers (attempt_id, question_id, selected_index, correct, time_taken_seconds)
         VALUES ($1, $2, $3, $4, $5)`,
        [attemptId, ans.questionId, ans.selectedIndex, ans.correct, (ans as any).timeTakenSeconds ?? 0]
      );
    }

    // 6. (Optional) Update user table for latest score
    await client.query(
      `UPDATE users SET score=$1, total=$2, details=$3 WHERE id=$4`,
      [result.score, result.total, JSON.stringify(result.details), user.id]
    );

    await client.query('COMMIT');
    res.json({ attemptId, ...result });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Submit error:', err.message);
    res.status(500).json({ error: 'Submission failed', details: err.message });
  } finally {
    client.release();
  }
});


export default router;

