import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Grid,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { TOPICS_META } from '../data';
import { Question, QuestionLevel } from '../types/curriculum';
import { SessionFeedbackMode } from './ExamSetupView';

const OPTION_LETTERS = ['أ', 'ب', 'ج', 'د'] as const;

export type StudySessionKind = 'topic' | 'mistakes' | 'bookmarks' | 'exam';

interface StudySessionViewProps {
  kind: StudySessionKind;
  title: string;
  subtitle?: string;
  topicId?: number;
  questions: Question[];
  initialIndex?: number;
  initialMode?: SessionFeedbackMode;
  savedAnswers: Record<number, number>;
  bookmarks: number[];
  onRecordAnswer: (questionId: number, selectedIndex: number) => void;
  onToggleBookmark: (questionId: number) => void;
  onPositionChange?: (topicId: number, index: number) => void;
  onResetTopic?: (questionIds: number[], topicId: number) => void;
  onNextTopic?: (nextTopicId: number) => void;
  onBack: () => void;
}

export function StudySessionView({
  kind,
  title,
  subtitle,
  topicId,
  questions,
  initialIndex = 0,
  initialMode = 'instant',
  savedAnswers,
  bookmarks,
  onRecordAnswer,
  onToggleBookmark,
  onPositionChange,
  onResetTopic,
  onNextTopic,
  onBack,
}: StudySessionViewProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(Math.max(0, initialIndex), Math.max(0, questions.length - 1))
  );
  const [feedbackMode, setFeedbackMode] = useState<SessionFeedbackMode>(initialMode);
  const [localSessionAnswers, setLocalSessionAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [reviewWrongOnly, setReviewWrongOnly] = useState(false);

  useEffect(() => {
    setCurrentIndex(
      Math.min(Math.max(0, initialIndex), Math.max(0, questions.length - 1))
    );
    setFeedbackMode(initialMode);
    setLocalSessionAnswers({});
    setExamSubmitted(false);
    setShowSummary(false);
    setConfirmReset(false);
    setReviewWrongOnly(false);
  }, [kind, topicId, title, questions.length, initialIndex, initialMode]);

  const activeAnswers = useMemo(() => {
    if (kind === 'exam' || kind === 'mistakes') {
      return localSessionAnswers;
    }
    return savedAnswers;
  }, [kind, localSessionAnswers, savedAnswers]);

  const displayedQuestions = useMemo(() => {
    if (!reviewWrongOnly) return questions;
    const wrong = questions.filter((q) => {
      const ans = activeAnswers[q.id];
      return typeof ans === 'number' && ans !== q.correctIndex;
    });
    return wrong.length > 0 ? wrong : questions;
  }, [reviewWrongOnly, questions, activeAnswers]);

  const safeIndex = Math.min(currentIndex, Math.max(0, displayedQuestions.length - 1));
  const currentQuestion = displayedQuestions[safeIndex];

  useEffect(() => {
    if (kind === 'topic' && typeof topicId === 'number' && !reviewWrongOnly && onPositionChange) {
      onPositionChange(topicId, safeIndex);
    }
  }, [kind, topicId, safeIndex, reviewWrongOnly, onPositionChange]);

  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    const byLevel: Record<QuestionLevel, { total: number; correct: number; answered: number }> = {
      أساسي: { total: 0, correct: 0, answered: 0 },
      متوسط: { total: 0, correct: 0, answered: 0 },
      متقدم: { total: 0, correct: 0, answered: 0 },
    };

    for (const q of questions) {
      byLevel[q.level].total += 1;
      const ans = activeAnswers[q.id];
      if (typeof ans === 'number') {
        answered += 1;
        byLevel[q.level].answered += 1;
        if (ans === q.correctIndex) {
          correct += 1;
          byLevel[q.level].correct += 1;
        }
      }
    }

    const wrongCount = answered - correct;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { answered, correct, wrongCount, accuracy, byLevel };
  }, [questions, activeAnswers]);

  if (questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-[#E5E1D8] bg-white p-8 text-center dark:border-[#1E2E42] dark:bg-[#121E2E]">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <h1 className="font-display-ar mt-4 text-2xl font-bold text-[#0F2942] dark:text-[#F1F5F9]">
            {kind === 'mistakes'
              ? 'لا توجد أخطاء مسجلة حالياً'
              : 'لا توجد أسئلة محفوظة حالياً'}
          </h1>
          <p className="mt-2 text-sm text-[#475569] dark:text-[#CBD5E1]">
            {kind === 'mistakes'
              ? 'أداؤك ممتاز! كل ما أجبت عنه صحيح حتى الآن أو لم تبدأ بالحل بعد.'
              : 'اضغط على أيقونة الحفظ داخل أي سؤال لإضافته إلى قائمة مراجعتك الخاصة.'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] cursor-pointer"
          >
            العودة إلى الفروع
          </button>
        </div>
      </div>
    );
  }

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    const alreadyAnswered = typeof activeAnswers[currentQuestion.id] === 'number';
    if (feedbackMode === 'instant' && alreadyAnswered) {
      return;
    }
    if (feedbackMode === 'exam' && examSubmitted) {
      return;
    }

    if (kind === 'exam' || kind === 'mistakes') {
      setLocalSessionAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionIndex,
      }));
      if (feedbackMode === 'instant') {
        onRecordAnswer(currentQuestion.id, optionIndex);
      }
    } else {
      onRecordAnswer(currentQuestion.id, optionIndex);
    }
  };

  const handleFinishSession = () => {
    if ((kind === 'exam' || kind === 'mistakes') && feedbackMode === 'exam' && !examSubmitted) {
      for (const q of questions) {
        const chosen = localSessionAnswers[q.id];
        if (typeof chosen === 'number') {
          onRecordAnswer(q.id, chosen);
        }
      }
      setExamSubmitted(true);
    }
    setShowSummary(true);
  };

  const selectedOption = currentQuestion ? activeAnswers[currentQuestion.id] : undefined;
  const isAnswered = typeof selectedOption === 'number';
  const showFeedback =
    isAnswered && (feedbackMode === 'instant' || examSubmitted || showSummary);
  const isBookmarked = currentQuestion ? bookmarks.includes(currentQuestion.id) : false;

  const topicMeta =
    currentQuestion && TOPICS_META.find((t) => t.id === currentQuestion.topicId);

  if (showSummary) {
    const hasNextTopic =
      kind === 'topic' && typeof topicId === 'number' && topicId < 20 && !!onNextTopic;

    return (
      <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-[#E5E1D8] bg-white p-5 sm:p-8 dark:border-[#1E2E42] dark:bg-[#121E2E]">
          <p className="text-xs font-semibold text-[#B45309] dark:text-[#F59E0B]">
            ملخص الأداء العلمي
          </p>
          <h1 className="font-display-ar mt-2 text-2xl sm:text-3xl font-bold text-[#0F2942] dark:text-[#F1F5F9]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[#475569] dark:text-[#CBD5E1]">
            أجبت عن {stats.answered} من أصل {questions.length} سؤالاً
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 border-y border-[#E5E1D8] py-5 text-center dark:border-[#1E2E42] tabular-nums">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.correct}
              </div>
              <div className="mt-1 text-xs text-[#475569] dark:text-[#94A3B8]">إجابة صحيحة</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#991B1B] dark:text-rose-400">
                {stats.wrongCount}
              </div>
              <div className="mt-1 text-xs text-[#475569] dark:text-[#94A3B8]">إجابة خاطئة</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#0F2942] dark:text-white">
                {stats.accuracy}٪
              </div>
              <div className="mt-1 text-xs text-[#475569] dark:text-[#94A3B8]">نسبة الدقة</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">
              التوزيع حسب مستوى الصعوبة
            </h2>
            {(['أساسي', 'متوسط', 'متقدم'] as QuestionLevel[]).map((lvl) => {
              const row = stats.byLevel[lvl];
              if (row.total === 0) return null;
              const pct = row.answered > 0 ? Math.round((row.correct / row.answered) * 100) : 0;
              return (
                <div
                  key={lvl}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#E5E1D8] bg-[#F8F7F4] px-4 py-3 text-xs sm:text-sm dark:border-[#1E2E42] dark:bg-[#0B131E] tabular-nums"
                >
                  <span className="font-semibold text-[#0F2942] dark:text-[#F1F5F9]">
                    المستوى {lvl}
                  </span>
                  <span className="text-[#475569] dark:text-[#CBD5E1]">
                    {row.correct} صحيح من {row.total} ({pct}٪)
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {stats.wrongCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setReviewWrongOnly(true);
                  setCurrentIndex(0);
                  setShowSummary(false);
                }}
                className="rounded-xl bg-[#991B1B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1D1D] cursor-pointer"
              >
                مراجعة أخطاء هذه الجلسة ({stats.wrongCount})
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setReviewWrongOnly(false);
                setCurrentIndex(0);
                setShowSummary(false);
              }}
              className="rounded-xl border border-[#0F2942]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F2942] hover:bg-[#F1EFEA] dark:border-[#334155] dark:bg-[#0B131E] dark:text-[#F1F5F9] dark:hover:bg-[#18263A] cursor-pointer"
            >
              استعراض جميع الأسئلة
            </button>

            {hasNextTopic && (
              <button
                type="button"
                onClick={() => onNextTopic(topicId + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F2942] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] cursor-pointer"
              >
                <span>الانتقال للفرع التالي</span>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-[#E5E1D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#475569] hover:text-[#0F2942] dark:border-[#1E2E42] dark:bg-[#0B131E] dark:text-[#CBD5E1] dark:hover:text-white cursor-pointer"
            >
              العودة للفروع
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
      {/* Top Session Control Strip */}
      <div className="flex flex-col gap-3 border-b border-[#E5E1D8] pb-4 dark:border-[#1E2E42] md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#475569] hover:text-[#0F2942] dark:text-[#94A3B8] dark:hover:text-white cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>العودة للفروع العشرين</span>
          </button>
          <h1 className="mt-1.5 text-base sm:text-xl font-bold text-[#0F2942] dark:text-[#F1F5F9] break-words">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] break-words">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mode Toggle */}
          {kind !== 'exam' && (
            <div
              role="group"
              aria-label="أسلوب الدراسة"
              className="inline-flex rounded-xl border border-[#E5E1D8] bg-white p-1 dark:border-[#1E2E42] dark:bg-[#121E2E]"
            >
              <button
                type="button"
                onClick={() => setFeedbackMode('instant')}
                className={`rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  feedbackMode === 'instant'
                    ? 'bg-[#0F2942] text-white dark:bg-[#F59E0B] dark:text-[#0B131E]'
                    : 'text-[#475569] hover:text-[#0F2942] dark:text-[#CBD5E1] dark:hover:text-white'
                }`}
              >
                تعلم فوري
              </button>
              <button
                type="button"
                onClick={() => setFeedbackMode('exam')}
                className={`rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  feedbackMode === 'exam'
                    ? 'bg-[#0F2942] text-white dark:bg-[#F59E0B] dark:text-[#0B131E]'
                    : 'text-[#475569] hover:text-[#0F2942] dark:text-[#CBD5E1] dark:hover:text-white'
                }`}
              >
                وضع اختبار
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowMapOnMobile((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E1D8] bg-white px-3 py-2 text-xs font-semibold text-[#0F2942] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#F1F5F9] lg:hidden cursor-pointer"
          >
            <Grid className="h-4 w-4" aria-hidden="true" />
            <span>خريطة الأسئلة</span>
          </button>

          <button
            type="button"
            onClick={handleFinishSession}
            className="rounded-xl bg-[#0F2942] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] cursor-pointer"
          >
            {kind === 'exam' && feedbackMode === 'exam' && !examSubmitted
              ? 'تصحيح الاختبار'
              : 'عرض الملخص'}
          </button>
        </div>
      </div>

      {reviewWrongOnly && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E1D8] bg-[#FDF9EE] px-4 py-2.5 text-xs sm:text-sm text-[#78350F] dark:border-[#1E2E42] dark:bg-[#1E293B] dark:text-[#FDE68A]">
          <span>وضع مراجعة الأخطاء فقط لهذه الجلسة</span>
          <button
            type="button"
            onClick={() => {
              setReviewWrongOnly(false);
              setCurrentIndex(0);
            }}
            className="font-bold underline cursor-pointer"
          >
            العودة لكل الأسئلة
          </button>
        </div>
      )}

      {/* Main Split: Question Card + Navigator Grid */}
      <div className="mt-5 sm:mt-6 grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-12">
        {/* Question Area */}
        <div className="min-w-0 lg:col-span-8">
          {currentQuestion && (
            <div className="w-full min-w-0 rounded-2xl border border-[#E5E1D8] bg-white p-4 sm:p-8 dark:border-[#1E2E42] dark:bg-[#121E2E]">
              {/* Unboxed Question Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1EFEA] pb-4 dark:border-[#1E2E42]">
                <div className="min-w-0 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] tabular-nums break-words">
                  <span>
                    السؤال <strong className="text-[#0F2942] dark:text-white">{safeIndex + 1}</strong> من{' '}
                    {displayedQuestions.length}
                  </span>
                  <span className="mx-2 text-[#CBD5E1] dark:text-[#334155]">·</span>
                  <span>المستوى: {currentQuestion.level}</span>
                  {kind !== 'topic' && topicMeta && (
                    <>
                      <span className="mx-2 text-[#CBD5E1] dark:text-[#334155]">·</span>
                      <span>
                        الفرع {topicMeta.numberLabel}: {topicMeta.title}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(currentQuestion.id)}
                  aria-pressed={isBookmarked}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'border-[#B45309]/40 bg-[#FDF9EE] text-[#B45309] dark:border-[#F59E0B]/50 dark:bg-[#F59E0B]/15 dark:text-[#F59E0B]'
                      : 'border-[#E5E1D8] bg-white text-[#475569] hover:text-[#0F2942] dark:border-[#1E2E42] dark:bg-[#0B131E] dark:text-[#CBD5E1] dark:hover:text-white'
                  }`}
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{isBookmarked ? 'محفوظ' : 'حفظ'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <h2 className="mt-5 text-base sm:text-xl font-bold leading-relaxed text-[#0F2942] dark:text-[#F1F5F9] break-words">
                {currentQuestion.question}
              </h2>

              {/* Answer Options */}
              <div className="mt-5 sm:mt-6 space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = currentQuestion.correctIndex === idx;

                  let containerClasses =
                    'border-[#E5E1D8] bg-[#F8F7F4]/60 text-[#0F2942] hover:border-[#0F2942]/45 hover:bg-white dark:border-[#1E2E42] dark:bg-[#0B131E]/80 dark:text-[#F1F5F9] dark:hover:border-[#F59E0B]/60 dark:hover:bg-[#18263A]';
                  let letterClasses =
                    'border-[#CBD5E1] bg-white text-[#0F2942] dark:border-[#334155] dark:bg-[#121E2E] dark:text-[#F1F5F9]';
                  let statusLabel: 'correct' | 'wrong' | 'selected' | null = null;

                  if (showFeedback) {
                    if (isCorrectOption) {
                      containerClasses =
                        'border-emerald-700 bg-emerald-50/70 text-[#064E3B] dark:border-emerald-500/70 dark:bg-emerald-950/45 dark:text-emerald-200';
                      letterClasses =
                        'border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600';
                      statusLabel = 'correct';
                    } else if (isSelected && !isCorrectOption) {
                      containerClasses =
                        'border-[#991B1B] bg-rose-50/70 text-[#7F1D1D] dark:border-rose-500/70 dark:bg-rose-950/45 dark:text-rose-200';
                      letterClasses =
                        'border-[#991B1B] bg-[#991B1B] text-white dark:border-rose-500 dark:bg-rose-600';
                      statusLabel = 'wrong';
                    } else {
                      containerClasses =
                        'border-[#E5E1D8] bg-white/60 text-[#64748B] dark:border-[#1E2E42] dark:bg-[#0B131E]/40 dark:text-[#64748B]';
                      letterClasses =
                        'border-[#E5E1D8] bg-[#F8F7F4] text-[#94A3B8] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#64748B]';
                    }
                  } else if (isSelected) {
                    containerClasses =
                      'border-[#0F2942] bg-[#F1EFEA] text-[#0F2942] dark:border-[#F59E0B] dark:bg-[#18263A] dark:text-white';
                    letterClasses =
                      'border-[#0F2942] bg-[#0F2942] text-white dark:border-[#F59E0B] dark:bg-[#F59E0B] dark:text-[#0B131E]';
                    statusLabel = 'selected';
                  }

                  const isLocked =
                    (feedbackMode === 'instant' && isAnswered) ||
                    (feedbackMode === 'exam' && examSubmitted);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleSelectOption(idx)}
                      className={`flex w-full min-w-0 items-start gap-3 rounded-xl border p-3.5 sm:p-4 text-right transition-colors min-h-[54px] ${
                        isLocked ? 'cursor-default' : 'cursor-pointer'
                      } ${containerClasses}`}
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${letterClasses}`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>

                      <span className="min-w-0 flex-1 text-sm sm:text-base leading-relaxed font-medium break-words">
                        {opt}
                      </span>

                      {statusLabel === 'correct' && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">إجابة صحيحة</span>
                        </span>
                      )}
                      {statusLabel === 'wrong' && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#991B1B] dark:text-rose-300">
                          <XCircle className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">غير صحيحة</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scientific & Legal Explanation */}
              {showFeedback && (
                <div
                  role="region"
                  aria-label="التفسير العلمي والقانوني"
                  className="mt-6 rounded-xl border border-[#E5E1D8] bg-[#F8F7F4] p-4 sm:p-5 dark:border-[#1E2E42] dark:bg-[#0B131E]"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-800 dark:text-emerald-300">
                          إجابة صحيحة — التفسير العلمي والقانوني:
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 shrink-0 text-[#991B1B] dark:text-rose-400" aria-hidden="true" />
                        <span className="text-[#991B1B] dark:text-rose-300">
                          الإجابة الصحيحة هي ({OPTION_LETTERS[currentQuestion.correctIndex]}) — التفسير:
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#1E293B] dark:text-[#CBD5E1] break-words">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Prev / Next Controls */}
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#F1EFEA] pt-5 dark:border-[#1E2E42]">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  className={`inline-flex items-center gap-2 rounded-xl border border-[#E5E1D8] px-4 py-2.5 text-sm font-semibold dark:border-[#1E2E42] ${
                    safeIndex === 0
                      ? 'bg-[#F8F7F4] text-[#94A3B8] dark:bg-[#0B131E] dark:text-[#475569] cursor-not-allowed'
                      : 'bg-white text-[#0F2942] hover:border-[#0F2942] dark:bg-[#0B131E] dark:text-[#F1F5F9] dark:hover:border-[#F59E0B] cursor-pointer'
                  }`}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span>السابق</span>
                </button>

                {safeIndex < displayedQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((i) =>
                        Math.min(displayedQuestions.length - 1, i + 1)
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0F2942] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] cursor-pointer"
                  >
                    <span>السؤال التالي</span>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishSession}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#B45309] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#92400E] dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer"
                  >
                    <span>إنهاء وعرض النتيجة</span>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Question Navigator Sidebar */}
        <aside
          aria-label="خريطة أسئلة الجلسة"
          className={`min-w-0 lg:col-span-4 ${showMapOnMobile ? 'block' : 'hidden lg:block'}`}
        >
          <div className="rounded-2xl border border-[#E5E1D8] bg-white p-4 sm:p-5 dark:border-[#1E2E42] dark:bg-[#121E2E]">
            <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 dark:border-[#1E2E42]">
              <h2 className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">
                خريطة الأسئلة
              </h2>
              <span className="text-xs text-[#475569] dark:text-[#94A3B8] tabular-nums">
                {stats.answered} / {questions.length} محلول
              </span>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2 tabular-nums">
              {displayedQuestions.map((q, idx) => {
                const ans = activeAnswers[q.id];
                const answered = typeof ans === 'number';
                const isCurrent = idx === safeIndex;
                const canShowColor =
                  answered && (feedbackMode === 'instant' || examSubmitted || showSummary);

                let btnClass =
                  'border-[#E5E1D8] bg-[#F8F7F4] text-[#334155] hover:border-[#0F2942] dark:border-[#1E2E42] dark:bg-[#0B131E] dark:text-[#CBD5E1] dark:hover:border-[#F59E0B]';
                if (canShowColor) {
                  btnClass =
                    ans === q.correctIndex
                      ? 'border-emerald-700/40 bg-emerald-50 text-emerald-900 font-bold dark:border-emerald-500/50 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-[#991B1B]/40 bg-rose-50 text-[#991B1B] font-bold dark:border-rose-500/50 dark:bg-rose-950/60 dark:text-rose-300';
                } else if (answered) {
                  btnClass =
                    'border-[#0F2942] bg-[#0F2942]/10 text-[#0F2942] font-bold dark:border-[#F59E0B] dark:bg-[#F59E0B]/15 dark:text-[#F59E0B]';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMapOnMobile(false);
                    }}
                    aria-label={`الانتقال إلى السؤال ${idx + 1}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`relative flex h-10 items-center justify-center rounded-lg border text-xs transition-colors cursor-pointer ${btnClass} ${
                      isCurrent
                        ? 'ring-2 ring-[#0F2942] ring-offset-1 dark:ring-[#F59E0B] dark:ring-offset-[#121E2E]'
                        : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {bookmarks.includes(q.id) && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-[#B45309] dark:bg-[#F59E0B]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Session Stats & Reset */}
            <div className="mt-5 border-t border-[#F1EFEA] pt-4 text-xs text-[#475569] dark:border-[#1E2E42] dark:text-[#94A3B8] tabular-nums space-y-2">
              <div className="flex justify-between">
                <span>الصحيحة:</span>
                <strong className="text-emerald-800 dark:text-emerald-400">{stats.correct}</strong>
              </div>
              <div className="flex justify-between">
                <span>الخاطئة:</span>
                <strong className="text-[#991B1B] dark:text-rose-400">{stats.wrongCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>الدقة الحالية:</span>
                <strong className="text-[#0F2942] dark:text-[#F1F5F9]">{stats.accuracy}٪</strong>
              </div>
            </div>

            {kind === 'topic' && typeof topicId === 'number' && onResetTopic && stats.answered > 0 && (
              <div className="mt-4 border-t border-[#F1EFEA] pt-4 dark:border-[#1E2E42]">
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E5E1D8] py-2 text-xs font-semibold text-[#475569] hover:border-[#991B1B] hover:text-[#991B1B] dark:border-[#1E2E42] dark:text-[#CBD5E1] dark:hover:border-rose-500 dark:hover:text-rose-400 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>إعادة ضبط أسئلة هذا الفرع</span>
                  </button>
                ) : (
                  <div className="space-y-2 text-center">
                    <p className="text-xs font-semibold text-[#991B1B] dark:text-rose-400">
                      هل تريد مسح إجابات هذا الفرع والبدء من جديد؟
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onResetTopic(
                            questions.map((q) => q.id),
                            topicId
                          );
                          setCurrentIndex(0);
                          setConfirmReset(false);
                        }}
                        className="flex-1 rounded-lg bg-[#991B1B] py-1.5 text-xs font-semibold text-white cursor-pointer"
                      >
                        تأكيد
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="flex-1 rounded-lg border border-[#E5E1D8] py-1.5 text-xs font-semibold text-[#475569] dark:border-[#334155] dark:text-[#CBD5E1] cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
