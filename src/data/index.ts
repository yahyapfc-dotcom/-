import { Question } from '../types/curriculum';
import { FORENSIC_GLOSSARY, TOPICS_META } from './topicsMeta';
import { TOPIC_01_QUESTIONS } from './topics/topic01';
import { TOPIC_02_QUESTIONS } from './topics/topic02';
import { TOPIC_03_QUESTIONS } from './topics/topic03';
import { TOPIC_04_QUESTIONS } from './topics/topic04';
import { TOPIC_05_QUESTIONS } from './topics/topic05';
import { TOPIC_06_QUESTIONS } from './topics/topic06';
import { TOPIC_07_QUESTIONS } from './topics/topic07';
import { TOPIC_08_QUESTIONS } from './topics/topic08';
import { TOPIC_09_QUESTIONS } from './topics/topic09';
import { TOPIC_10_QUESTIONS } from './topics/topic10';
import { TOPIC_11_QUESTIONS } from './topics/topic11';
import { TOPIC_12_QUESTIONS } from './topics/topic12';
import { TOPIC_13_QUESTIONS } from './topics/topic13';
import { TOPIC_14_QUESTIONS } from './topics/topic14';
import { TOPIC_15_QUESTIONS } from './topics/topic15';
import { TOPIC_16_QUESTIONS } from './topics/topic16';
import { TOPIC_17_QUESTIONS } from './topics/topic17';
import { TOPIC_18_QUESTIONS } from './topics/topic18';
import { TOPIC_19_QUESTIONS } from './topics/topic19';
import { TOPIC_20_QUESTIONS } from './topics/topic20';

export const QUESTIONS_BY_TOPIC: Record<number, Question[]> = {
  1: TOPIC_01_QUESTIONS,
  2: TOPIC_02_QUESTIONS,
  3: TOPIC_03_QUESTIONS,
  4: TOPIC_04_QUESTIONS,
  5: TOPIC_05_QUESTIONS,
  6: TOPIC_06_QUESTIONS,
  7: TOPIC_07_QUESTIONS,
  8: TOPIC_08_QUESTIONS,
  9: TOPIC_09_QUESTIONS,
  10: TOPIC_10_QUESTIONS,
  11: TOPIC_11_QUESTIONS,
  12: TOPIC_12_QUESTIONS,
  13: TOPIC_13_QUESTIONS,
  14: TOPIC_14_QUESTIONS,
  15: TOPIC_15_QUESTIONS,
  16: TOPIC_16_QUESTIONS,
  17: TOPIC_17_QUESTIONS,
  18: TOPIC_18_QUESTIONS,
  19: TOPIC_19_QUESTIONS,
  20: TOPIC_20_QUESTIONS,
};

export const ALL_QUESTIONS: Question[] = [
  ...TOPIC_01_QUESTIONS,
  ...TOPIC_02_QUESTIONS,
  ...TOPIC_03_QUESTIONS,
  ...TOPIC_04_QUESTIONS,
  ...TOPIC_05_QUESTIONS,
  ...TOPIC_06_QUESTIONS,
  ...TOPIC_07_QUESTIONS,
  ...TOPIC_08_QUESTIONS,
  ...TOPIC_09_QUESTIONS,
  ...TOPIC_10_QUESTIONS,
  ...TOPIC_11_QUESTIONS,
  ...TOPIC_12_QUESTIONS,
  ...TOPIC_13_QUESTIONS,
  ...TOPIC_14_QUESTIONS,
  ...TOPIC_15_QUESTIONS,
  ...TOPIC_16_QUESTIONS,
  ...TOPIC_17_QUESTIONS,
  ...TOPIC_18_QUESTIONS,
  ...TOPIC_19_QUESTIONS,
  ...TOPIC_20_QUESTIONS,
];

export function getTopicQuestions(topicId: number): Question[] {
  return QUESTIONS_BY_TOPIC[topicId] ?? [];
}

export function getQuestionById(questionId: number): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === questionId);
}

export { TOPICS_META, FORENSIC_GLOSSARY };
