import { useCallback, useMemo, useState } from 'react';
import { ALL_QUESTIONS, TOPICS_META, getTopicQuestions } from './data';
import { ExamScope, ExamSetupView, SessionFeedbackMode } from './components/ExamSetupView';
import { GlossaryView } from './components/GlossaryView';
import { Header, NavTab } from './components/Header';
import { HomeView } from './components/HomeView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { StudySessionKind, StudySessionView } from './components/StudySessionView';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import { Question } from './types/curriculum';

type ActiveScreen =
  | { view: 'home' }
  | { view: 'exam_setup' }
  | { view: 'glossary' }
  | {
      view: 'session';
      kind: StudySessionKind;
      title: string;
      subtitle?: string;
      topicId?: number;
      questions: Question[];
      initialIndex: number;
      initialMode: SessionFeedbackMode;
    };

function shuffleQuestions(list: Question[]): Question[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const {
    progress,
    recordAnswer,
    toggleBookmark,
    setTopicPosition,
    resetTopicProgress,
    resetAllProgress,
  } = useProgress();
  const { isDark, toggleTheme } = useTheme();

  const [screen, setScreen] = useState<ActiveScreen>({ view: 'home' });

  const { answeredCount, correctCount, mistakesList, unansweredList } = useMemo(() => {
    let answered = 0;
    let correct = 0;
    const mistakes: Question[] = [];
    const unanswered: Question[] = [];

    for (const q of ALL_QUESTIONS) {
      const chosen = progress.answers[q.id];
      if (typeof chosen === 'number') {
        answered += 1;
        if (chosen === q.correctIndex) {
          correct += 1;
        } else {
          mistakes.push(q);
        }
      } else {
        unanswered.push(q);
      }
    }

    return {
      answeredCount: answered,
      correctCount: correct,
      mistakesList: mistakes,
      unansweredList: unanswered,
    };
  }, [progress.answers]);

  const openTopic = useCallback(
    (topicId: number) => {
      const meta = TOPICS_META.find((t) => t.id === topicId);
      const qs = getTopicQuestions(topicId);
      if (!meta || qs.length === 0) return;

      const savedIdx = progress.lastQuestionIndex[topicId] ?? 0;
      const firstUnanswered = qs.findIndex((q) => typeof progress.answers[q.id] !== 'number');
      const initialIndex =
        typeof progress.lastQuestionIndex[topicId] === 'number'
          ? savedIdx
          : firstUnanswered >= 0
          ? firstUnanswered
          : 0;

      setScreen({
        view: 'session',
        kind: 'topic',
        title: `الفرع ${meta.numberLabel}: ${meta.title}`,
        subtitle: meta.reference,
        topicId,
        questions: qs,
        initialIndex,
        initialMode: 'instant',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [progress.answers, progress.lastQuestionIndex]
  );

  const handleContinueStudy = useCallback(() => {
    if (progress.lastTopicId) {
      openTopic(progress.lastTopicId);
      return;
    }
    const firstIncomplete = TOPICS_META.find((meta) => {
      const qs = getTopicQuestions(meta.id);
      return qs.some((q) => typeof progress.answers[q.id] !== 'number');
    });
    openTopic(firstIncomplete ? firstIncomplete.id : 1);
  }, [openTopic, progress.answers, progress.lastTopicId]);

  const openMistakesSession = useCallback(() => {
    const snapshot = [...mistakesList];
    setScreen({
      view: 'session',
      kind: 'mistakes',
      title: 'مراجعة الأخطاء المسجلة',
      subtitle: 'أعد حل الأسئلة التي أخطأت فيها سابقاً لتثبيت المعلومة وتصحيح سجلك',
      questions: snapshot,
      initialIndex: 0,
      initialMode: 'instant',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mistakesList]);

  const openBookmarksSession = useCallback(() => {
    const bookmarkedSet = new Set(progress.bookmarks);
    const snapshot = ALL_QUESTIONS.filter((q) => bookmarkedSet.has(q.id));
    setScreen({
      view: 'session',
      kind: 'bookmarks',
      title: 'الأسئلة المحفوظة للمراجعة',
      subtitle: 'مختاراتك الشخصية من الفروع العشرين',
      questions: snapshot,
      initialIndex: 0,
      initialMode: 'instant',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [progress.bookmarks]);

  const handleStartExam = useCallback(
    (count: number, scope: ExamScope, mode: SessionFeedbackMode) => {
      let pool: Question[] = ALL_QUESTIONS;
      let scopeLabel = 'من جميع الفروع العشرين';

      if (scope === 'unanswered' && unansweredList.length > 0) {
        pool = unansweredList;
        scopeLabel = 'من الأسئلة غير المحلولة فقط';
      } else if (scope === 'advanced') {
        pool = ALL_QUESTIONS.filter((q) => q.level === 'متقدم');
        scopeLabel = 'من المستوى المتقدم';
      }

      const selected = shuffleQuestions(pool).slice(0, Math.min(count, pool.length));

      setScreen({
        view: 'session',
        kind: 'exam',
        title: `اختبار شامل (${selected.length} سؤالاً)`,
        subtitle: scopeLabel,
        questions: selected,
        initialIndex: 0,
        initialMode: mode,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [unansweredList]
  );

  const handleNavigateTab = useCallback(
    (tab: NavTab) => {
      if (tab === 'home') {
        setScreen({ view: 'home' });
      } else if (tab === 'exam') {
        setScreen({ view: 'exam_setup' });
      } else if (tab === 'mistakes') {
        openMistakesSession();
      } else if (tab === 'glossary') {
        setScreen({ view: 'glossary' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [openMistakesSession]
  );

  const activeNavTab: NavTab =
    screen.view === 'exam_setup'
      ? 'exam'
      : screen.view === 'glossary'
      ? 'glossary'
      : screen.view === 'session' && screen.kind === 'mistakes'
      ? 'mistakes'
      : screen.view === 'session' && screen.kind === 'exam'
      ? 'exam'
      : 'home';

  return (
    <div className="min-h-screen w-full overflow-x-clip flex flex-col bg-[#F8F7F4] text-[#0F2942] dark:bg-[#0B131E] dark:text-[#F1F5F9]">
      <OfflineIndicator />

      <Header
        activeTab={activeNavTab}
        onNavigate={handleNavigateTab}
        onContinueStudy={handleContinueStudy}
        hasProgress={answeredCount > 0}
        mistakesCount={mistakesList.length}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 w-full min-w-0">
        {screen.view === 'home' && (
          <HomeView
            progress={progress}
            answeredCount={answeredCount}
            correctCount={correctCount}
            mistakesCount={mistakesList.length}
            onSelectTopic={openTopic}
            onContinueStudy={handleContinueStudy}
            onOpenExamSetup={() => setScreen({ view: 'exam_setup' })}
            onOpenMistakes={openMistakesSession}
            onOpenBookmarks={openBookmarksSession}
            onResetAll={resetAllProgress}
          />
        )}

        {screen.view === 'exam_setup' && (
          <ExamSetupView
            unansweredCount={unansweredList.length}
            onStartExam={handleStartExam}
            onBack={() => setScreen({ view: 'home' })}
          />
        )}

        {screen.view === 'glossary' && <GlossaryView onSelectTopic={openTopic} />}

        {screen.view === 'session' && (
          <StudySessionView
            kind={screen.kind}
            title={screen.title}
            subtitle={screen.subtitle}
            topicId={screen.topicId}
            questions={screen.questions}
            initialIndex={screen.initialIndex}
            initialMode={screen.initialMode}
            savedAnswers={progress.answers}
            bookmarks={progress.bookmarks}
            onRecordAnswer={recordAnswer}
            onToggleBookmark={toggleBookmark}
            onPositionChange={setTopicPosition}
            onResetTopic={resetTopicProgress}
            onNextTopic={openTopic}
            onBack={() => setScreen({ view: 'home' })}
          />
        )}
      </main>

      <footer className="w-full border-t border-[#E5E1D8] bg-white/70 py-6 text-center text-xs text-[#64748B] dark:border-[#1E2E42] dark:bg-[#121E2E]/70 dark:text-[#94A3B8]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
          <span className="font-semibold text-[#0F2942] dark:text-[#F1F5F9]">
            إعداد: يحي سيكولوجي · منصة دراسة علم النفس الجنائي السوداني (١٠٠٠ سؤال)
          </span>
          <span className="tabular-nums">
            يعمل بالكامل بدون إنترنت · حفظ التقدم محلياً على جهازك
          </span>
        </div>
      </footer>
    </div>
  );
}
