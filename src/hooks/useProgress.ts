import { useCallback, useEffect, useState } from 'react';
import { UserProgress } from '../types/curriculum';

const STORAGE_KEY = 'sudan_criminal_psychology_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  answers: {},
  bookmarks: [],
  lastTopicId: null,
  lastQuestionIndex: {},
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      lastTopicId: typeof parsed.lastTopicId === 'number' ? parsed.lastTopicId : null,
      lastQuestionIndex:
        parsed.lastQuestionIndex && typeof parsed.lastQuestionIndex === 'object'
          ? parsed.lastQuestionIndex
          : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [progress]);

  const recordAnswer = useCallback((questionId: number, selectedIndex: number) => {
    setProgress((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: selectedIndex,
      },
    }));
  }, []);

  const toggleBookmark = useCallback((questionId: number) => {
    setProgress((prev) => {
      const exists = prev.bookmarks.includes(questionId);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter((id) => id !== questionId)
          : [...prev.bookmarks, questionId],
      };
    });
  }, []);

  const setTopicPosition = useCallback((topicId: number, questionIndex: number) => {
    setProgress((prev) => ({
      ...prev,
      lastTopicId: topicId,
      lastQuestionIndex: {
        ...prev.lastQuestionIndex,
        [topicId]: questionIndex,
      },
    }));
  }, []);

  const resetTopicProgress = useCallback((questionIds: number[], topicId: number) => {
    setProgress((prev) => {
      const nextAnswers = { ...prev.answers };
      for (const id of questionIds) {
        delete nextAnswers[id];
      }
      return {
        ...prev,
        answers: nextAnswers,
        lastQuestionIndex: {
          ...prev.lastQuestionIndex,
          [topicId]: 0,
        },
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    recordAnswer,
    toggleBookmark,
    setTopicPosition,
    resetTopicProgress,
    resetAllProgress,
  };
}
