import express from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Admin signup (requires master key)
router.post('/signup', async (req, res) => {
  const masterKey = req.headers['x-admin-secret'];
  if (masterKey !== process.env.ADMIN_MASTER_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid master key' });
  }

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO admins(email, password_hash) VALUES($1,$2) RETURNING id,email',
      [email, hash]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

  const admin = result.rows[0];
  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Middleware to protect routes
function authMiddleware(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any;
    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


// router.get('/attempts', authMiddleware, async (req, res) => {
//   const result = await pool.query(
//     `SELECT a.id as attempt_id, u.name as "userName", u.email as "userEmail",
//             a.score, a.total, a.started_at as "startedAt", a.submitted_at as "submittedAt",
//             json_agg(json_build_object(
//               'questionText', q.text,
//               'selectedIndex', ans.selected_index,
//               'correctIndex', q.correct_index,
//               'correct', ans.correct
//             )) as answers
//      FROM attempts a
//      JOIN users u ON u.id = a.user_id
//      JOIN answers ans ON ans.attempt_id = a.id
//      JOIN questions q ON q.id = ans.question_id
//      GROUP BY a.id, u.name, u.email`
//   );

//   res.json(result.rows);
// });

router.get('/attempts', authMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT a.id as attempt_id, u.name as "userName", u.email as "userEmail",
            a.score, a.total, a.started_at as "startedAt", a.submitted_at as "submittedAt",
            json_agg(json_build_object(
              'questionText', q.text,
              'options', q.options,   -- include options here
              'selectedIndex', ans.selected_index,
              'correctIndex', q.correct_index,
              'correct', ans.correct
            )) as answers
     FROM attempts a
     JOIN users u ON u.id = a.user_id
     JOIN answers ans ON ans.attempt_id = a.id
     JOIN questions q ON q.id = ans.question_id
     GROUP BY a.id, u.name, u.email`
  );

  res.json(result.rows);
});


export default router;
