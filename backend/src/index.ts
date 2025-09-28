import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRouter from './routes/quiz';
import adminRoutes from './routes/admin';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/quiz', quizRouter);
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));





