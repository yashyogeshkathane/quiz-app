import { Answer, SubmissionResult, QuestionRow } from './types';

export function scoreSubmission(answers: Answer[], questions: QuestionRow[]): SubmissionResult {
  const map = new Map<number, QuestionRow>();
  for (const q of questions) map.set(q.id, q);

  let correct = 0;
  const details: SubmissionResult['details'] = [];

  for (const ans of answers) {
    const q = map.get(ans.questionId);
    if (!q) continue;
    const isCorrect = ans.selectedIndex === q.correct_index;
    if (isCorrect) correct++;
    details.push({ questionId: q.id, correctIndex: q.correct_index, selectedIndex: ans.selectedIndex, correct: isCorrect });
  }

  return { score: correct, total: questions.length, details };
}

export default scoreSubmission;