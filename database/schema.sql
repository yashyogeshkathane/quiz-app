-- Users who take quiz
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    score INT,
    total INT,
    details JSONB,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0, -- total time taken for quiz in seconds
    created_at TIMESTAMP DEFAULT NOW()
);


-- Quiz questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    options TEXT[] NOT NULL,       -- Array of choices
    correct_index INT NOT NULL     -- Index of correct answer
);


-- User answers for each question
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    selected_index INTEGER NOT NULL,
    correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- bcrypt hashed
    created_at TIMESTAMP DEFAULT NOW()
);