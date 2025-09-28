import pool from './db';

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_index INTEGER NOT NULL
    );
  `);

  await pool.query('TRUNCATE questions RESTART IDENTITY');

  const sample = [
    { text: 'What is 2 + 2?', options: ['3', '4', '22', '5'], correct_index: 1 },
    { text: 'Which planet is known as the Red Planet?', options: ['Earth', 'Venus', 'Mars', 'Jupiter'], correct_index: 2 },
    { text: 'What is the capital of France?', options: ['Berlin', 'Paris', 'Rome', 'Madrid'], correct_index: 1 }
  ];

  for (const s of sample) {
    await pool.query('INSERT INTO questions (text, options, correct_index) VALUES ($1, $2, $3)', [s.text, JSON.stringify(s.options), s.correct_index]);
  }

  console.log('Seeded questions');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});