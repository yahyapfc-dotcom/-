import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  Search,
  Scale,
  AlertCircle,
} from 'lucide-react';
import { QUESTIONS_BY_TOPIC, TOPICS_META } from '../data';
import { UserProgress } from '../types/curriculum';
import { PWAInstallButton } from './PWAInstallButton';

type TopicFilter = 'all' | 'unstarted' | 'in_progress' | 'completed';

interface HomeViewProps {
  progress: UserProgress;
  answeredCount: number;
  correctCount: number;
  mistakesCount: number;
  onSelectTopic: (topicId: number) => void;
  onContinueStudy: () => void;
  onOpenExamSetup: () => void;
  onOpenMistakes: () => void;
  onOpenBookmarks: () => void;
  onResetAll: () => void;
}

export function HomeView({
  progress,
  answeredCount,
  correctCount,
  mistakesCount,
  onSelectTopic,
  onContinueStudy,
  onOpenExamSetup,
  onOpenMistakes,
  onOpenBookmarks,
  onResetAll,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TopicFilter>('all');
  const [imageFailed, setImageFailed] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const overallPercent = Math.round((answeredCount / 1000) * 100);

  const topicStats = useMemo(() => {
    return TOPICS_META.map((meta) => {
      const qs = QUESTIONS_BY_TOPIC[meta.id] ?? [];
      let answered = 0;
      let correct = 0;
      for (const q of qs) {
        const chosen = progress.answers[q.id];
        if (typeof chosen === 'number') {
          answered += 1;
          if (chosen === q.correctIndex) correct += 1;
        }
      }
      const total = qs.length;
      const status: Exclude<TopicFilter, 'all'> =
        answered === 0 ? 'unstarted' : answered >= total ? 'completed' : 'in_progress';
      const topicAccuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

      return {
        meta,
        total,
        answered,
        correct,
        topicAccuracy,
        status,
      };
    });
  }, [progress.answers]);

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim();
    return topicStats.filter(({ meta, status }) => {
      if (filter !== 'all' && status !== filter) return false;
      if (!q) return true;
      return (
        meta.title.includes(q) ||
        meta.subtitle.includes(q) ||
        meta.reference.includes(q) ||
        meta.summary.includes(q) ||
        meta.numberLabel.includes(q)
      );
    });
  }, [topicStats, filter, searchQuery]);

  const completedTopicsCount = topicStats.filter((t) => t.status === 'completed').length;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
      {/* Editorial Hero Split */}
      <section aria-label="نظرة عامة على المنهج" className="grid min-w-0 items-stretch gap-5 sm:gap-6 lg:grid-cols-12">
        <div className="min-w-0 flex flex-col justify-between rounded-2xl border border-[#E5E1D8] bg-white p-5 sm:p-8 dark:border-[#1E2E42] dark:bg-[#121E2E] lg:col-span-7">
          <div>
            <p className="text-xs font-semibold text-[#B45309] dark:text-[#F59E0B]">
              ٢٠ فرعاً · ١٠٠٠ سؤال · بدون إنترنت · إعداد: يحي سيكولوجي
            </p>
            <h1 className="font-display-ar mt-3 text-2xl font-bold leading-tight text-[#0F2942] dark:text-[#F1F5F9] sm:text-4xl [text-wrap:balance]">
              علم النفس الجنائي في السياق القانوني والاجتماعي السوداني
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
              برنامج دراسي متدرج من التأسيس النظري إلى التطبيق الميداني أمام المحاكم السودانية؛ كل فرع يضم ٥٠ سؤالاً متقناً مع التفسير العلمي والقانوني، ليخرج الدارس متمكناً بعد إتمام الألف سؤال.
            </p>
          </div>

          {/* Unboxed Progress Strip + Action Row */}
          <div className="mt-6 border-t border-[#E5E1D8] pt-5 dark:border-[#1E2E42]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] tabular-nums">
              <span>
                الإنجاز الكلي: <strong className="font-bold text-[#0F2942] dark:text-white">{answeredCount}</strong> من ١٠٠٠ سؤال ({overallPercent}٪)
              </span>
              <span>
                الفروع المكتملة: <strong className="font-bold text-[#0F2942] dark:text-white">{completedTopicsCount}</strong> / ٢٠ · الدقة: <strong className="font-bold text-[#0F2942] dark:text-white">{accuracy}٪</strong>
              </span>
            </div>
            <div
              className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EFECE5] dark:bg-[#1E2E42]"
              role="progressbar"
              aria-valuenow={overallPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="نسبة الإنجاز الكلية في المنهج"
            >
              <div
                className="h-full rounded-full bg-[#0F2942] dark:bg-[#F59E0B] transition-all duration-300"
                style={{ width: `${overallPercent}%` }}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onContinueStudy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2942] px-4 sm:px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{answeredCount > 0 ? 'متابعة الدراسة' : 'ابدأ من الفرع الأول'}</span>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenExamSetup}
                className="inline-flex items-center justify-center rounded-xl border border-[#0F2942]/25 bg-white px-4 py-3 text-sm font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942] hover:bg-[#F1EFEA] dark:border-[#334155] dark:bg-[#121E2E] dark:text-[#F1F5F9] dark:hover:border-[#F59E0B] dark:hover:bg-[#18263A] whitespace-nowrap shrink-0 cursor-pointer"
              >
                اختبار شامل
              </button>

              <PWAInstallButton />
            </div>
          </div>
        </div>

        {/* Hero Artwork Card */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E5E1D8] bg-[#EFECE5] dark:border-[#1E2E42] dark:bg-[#121E2E] lg:col-span-5 min-h-[210px] sm:min-h-[240px]">
          {!imageFailed ? (
            <img
              src="/src/assets/images/sudan_forensic_psychology_hero_1795001568176.jpg"
              alt="لوحة توضيحية تجسد ميزان العدالة ودراسة علم النفس الجنائي السوداني"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover dark:brightness-90"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-[#0F2942] p-8 text-center text-[#F8F7F4]">
              <Scale className="h-14 w-14 text-[#C59B5F]" aria-hidden="true" />
              <p className="font-display-ar mt-4 text-xl font-bold">
                العدالة والبصيرة النفسية
              </p>
              <p className="mt-2 text-sm text-[#CBD5E1]">
                ٢٠ مجالاً دراسياً · ١٠٠٠ سؤال تخصصي في القانون وعلم النفس الجنائي السوداني
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Review Actions */}
      {(mistakesCount > 0 || progress.bookmarks.length > 0 || answeredCount > 0) && (
        <section
          aria-label="أدوات المراجعة السريعة"
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E1D8] bg-white px-4 py-3.5 sm:px-5 sm:py-4 dark:border-[#1E2E42] dark:bg-[#121E2E]"
        >
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1]">
            {mistakesCount > 0 && (
              <button
                type="button"
                onClick={onOpenMistakes}
                className="inline-flex items-center gap-1.5 font-semibold text-[#991B1B] dark:text-rose-400 hover:underline cursor-pointer tabular-nums"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>مراجعة الأخطاء المسجلة ({mistakesCount} سؤال)</span>
              </button>
            )}
            {progress.bookmarks.length > 0 && (
              <button
                type="button"
                onClick={onOpenBookmarks}
                className="inline-flex items-center gap-1.5 font-semibold text-[#0F2942] dark:text-[#F1F5F9] hover:underline cursor-pointer tabular-nums"
              >
                <Bookmark className="h-4 w-4 shrink-0 text-[#B45309] dark:text-[#F59E0B]" aria-hidden="true" />
                <span>الأسئلة المحفوظة ({progress.bookmarks.length})</span>
              </button>
            )}
          </div>

          {answeredCount > 0 && (
            <div className="flex items-center gap-2">
              {!confirmResetAll ? (
                <button
                  type="button"
                  onClick={() => setConfirmResetAll(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#991B1B] dark:text-[#94A3B8] dark:hover:text-rose-400 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>تصفير التقدم</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#991B1B] dark:text-rose-400 font-semibold">مسح جميع الإجابات؟</span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setConfirmResetAll(false);
                    }}
                    className="rounded-lg bg-[#991B1B] px-2.5 py-1 font-semibold text-white cursor-pointer"
                  >
                    نعم، امسح
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmResetAll(false)}
                    className="rounded-lg border border-[#E5E1D8] px-2.5 py-1 font-semibold text-[#475569] dark:border-[#334155] dark:text-[#CBD5E1] cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 20 Topics Directory */}
      <section aria-label="الفروع الدراسية العشرون" className="mt-8 sm:mt-10">
        <div className="flex flex-col gap-4 border-b border-[#E5E1D8] pb-5 dark:border-[#1E2E42] lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="font-display-ar text-2xl font-bold text-[#0F2942] dark:text-[#F1F5F9]">
              الفروع والمجالات العشرون
            </h2>
            <p className="mt-1 text-sm text-[#475569] dark:text-[#94A3B8]">
              كل فرع يحتوي على ٥٠ سؤالاً متدرجة من الأساسي إلى المتوسط والمتقدم
            </p>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن فرع أو موضوع..."
                aria-label="البحث في الفروع العشرين"
                className="w-full rounded-xl border border-[#E5E1D8] bg-white py-2 pr-9 pl-3 text-sm text-[#0F2942] placeholder:text-[#94A3B8] focus:border-[#0F2942] focus:outline-none dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] dark:focus:border-[#F59E0B]"
              />
            </div>

            {/* Interactive Segmented Filter (fits 100% width on mobile without overflow) */}
            <div
              role="group"
              aria-label="تصفية الفروع حسب التقدم"
              className="grid w-full grid-cols-4 rounded-xl border border-[#E5E1D8] bg-white p-1 dark:border-[#1E2E42] dark:bg-[#121E2E] sm:inline-flex sm:w-auto"
            >
              {(
                [
                  { id: 'all', label: 'الكل' },
                  { id: 'unstarted', label: 'لم تبدأ' },
                  { id: 'in_progress', label: 'قيد الدراسة' },
                  { id: 'completed', label: 'مكتملة' },
                ] as const
              ).map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`rounded-lg px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-center whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0F2942] text-white dark:bg-[#F59E0B] dark:text-[#0B131E]'
                        : 'text-[#475569] hover:text-[#0F2942] dark:text-[#CBD5E1] dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#E5E1D8] bg-white p-8 text-center text-sm text-[#475569] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#CBD5E1]">
            لا توجد فروع تطابق خيارات البحث أو التصفية الحالية.
          </div>
        ) : (
          <div className="mt-6 grid min-w-0 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map(({ meta, total, answered, topicAccuracy, status }) => {
              const pct = Math.round((answered / total) * 100);
              const isDone = status === 'completed';

              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => onSelectTopic(meta.id)}
                  className="group flex w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E1D8] bg-white p-5 text-right transition-all hover:border-[#0F2942]/50 hover:shadow-sm dark:border-[#1E2E42] dark:bg-[#121E2E] dark:hover:border-[#F59E0B]/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F2942]/30 dark:focus:ring-[#F59E0B]/40"
                >
                  <div className="w-full min-w-0">
                    <div className="flex w-full min-w-0 items-baseline justify-between gap-3">
                      <span className="shrink-0 tabular-nums text-2xl font-bold text-[#B45309] dark:text-[#F59E0B]">
                        {meta.numberLabel}
                      </span>
                      <span className="min-w-0 truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {meta.reference}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-base sm:text-lg font-bold leading-snug text-[#0F2942] group-hover:text-[#17395B] dark:text-[#F1F5F9] dark:group-hover:text-white break-words">
                      {meta.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] break-words">
                      {meta.summary}
                    </p>
                  </div>

                  <div className="mt-5 w-full border-t border-[#F1EFEA] pt-4 dark:border-[#1E2E42]">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#475569] dark:text-[#CBD5E1] tabular-nums">
                      <span className="min-w-0 truncate">
                        {answered} / {total} سؤال
                        {answered > 0 ? ` · الدقة ${topicAccuracy}٪` : ''}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#0F2942] dark:text-[#F59E0B]">
                        {isDone && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                        )}
                        <span>
                          {isDone ? 'مراجعة' : answered > 0 ? 'متابعة' : 'ابدأ'}
                        </span>
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EFECE5] dark:bg-[#1E2E42]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-700 dark:bg-emerald-500'
                            : 'bg-[#0F2942] dark:bg-[#F59E0B]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
