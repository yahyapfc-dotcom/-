export type QuestionLevel = 'أساسي' | 'متوسط' | 'متقدم';

export interface Question {
  id: number;
  topicId: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  level: QuestionLevel;
}

export interface TopicMeta {
  id: number;
  numberLabel: string;
  title: string;
  subtitle: string;
  reference: string;
  summary: string;
}

export interface GlossaryEntry {
  term: string;
  lawOrSource: string;
  definition: string;
}

export interface UserProgress {
  answers: Record<number, number>;
  bookmarks: number[];
  lastTopicId: number | null;
  lastQuestionIndex: Record<number, number>;
}
