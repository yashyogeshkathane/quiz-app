export type QuestionRow = {
  id: number;
  text: string;
  options: string[];
  correct_index: number;
};

export type QuestionPublic = {
  id: number;
  text: string;
  options: string[];
};

export type Answer = {
  questionId: number;
  selectedIndex: number;
};

export type SubmissionResult = {
  score: number;
  total: number;
  details?: { questionId: number; correctIndex: number; selectedIndex: number; correct: boolean }[];
};