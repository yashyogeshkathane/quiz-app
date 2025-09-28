import { scoreSubmission } from '../src/scoring';

const questions = [
  { id: 1, text: 'a', options: ['x','y'], correct_index: 0 },
  { id: 2, text: 'b', options: ['x','y'], correct_index: 1 }
];

test('scores correctly', () => {
  const answers = [ { questionId: 1, selectedIndex: 0 }, { questionId: 2, selectedIndex: 1 } ];
  const res = scoreSubmission(answers as any, questions as any);
  expect(res.score).toBe(2);
  expect(res.total).toBe(2);
});

test('partial scores', () => {
  const answers = [ { questionId: 1, selectedIndex: 1 }, { questionId: 2, selectedIndex: 1 } ];
  const res = scoreSubmission(answers as any, questions as any);
  expect(res.score).toBe(1);
});