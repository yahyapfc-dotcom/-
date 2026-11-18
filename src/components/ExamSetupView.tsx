import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';

export type ExamScope = 'all' | 'unanswered' | 'advanced';
export type SessionFeedbackMode = 'instant' | 'exam';

interface ExamSetupViewProps {
  unansweredCount: number;
  onStartExam: (count: number, scope: ExamScope, mode: SessionFeedbackMode) => void;
  onBack: () => void;
}

export function ExamSetupView({
  unansweredCount,
  onStartExam,
  onBack,
}: ExamSetupViewProps) {
  const [count, setCount] = useState<number>(50);
  const [scope, setScope] = useState<ExamScope>('all');
  const [mode, setMode] = useState<SessionFeedbackMode>('exam');

  const effectiveUnansweredDisabled = unansweredCount === 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#0F2942] dark:text-[#94A3B8] dark:hover:text-white cursor-pointer"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        <span>العودة إلى الفروع</span>
      </button>

      <div className="mt-5 rounded-2xl border border-[#E5E1D8] bg-white p-5 sm:p-8 dark:border-[#1E2E42] dark:bg-[#121E2E]">
        <p className="text-xs font-semibold text-[#B45309] dark:text-[#F59E0B]">
          تقييم شامل من بنك الألف سؤال · يعمل بدون إنترنت
        </p>
        <h1 className="font-display-ar mt-2 text-2xl sm:text-3xl font-bold text-[#0F2942] dark:text-[#F1F5F9]">
          إعداد اختبار شامل مخصص
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
          اختبر تمكنك في علم النفس الجنائي السوداني عبر أسئلة عشوائية منتقاة من الفروع العشرين، مع حفظ نتائجك في سجلك الدراسي المحلي.
        </p>

        <div className="mt-7 space-y-6">
          {/* Question Count */}
          <div>
            <label className="block text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">
              ١. عدد أسئلة الاختبار
            </label>
            <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:gap-3">
              {[25, 50, 100].map((val) => {
                const active = count === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCount(val)}
                    className={`rounded-xl border py-3 text-xs sm:text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                      active
                        ? 'border-[#0F2942] bg-[#0F2942] text-white dark:border-[#F59E0B] dark:bg-[#F59E0B] dark:text-[#0B131E]'
                        : 'border-[#E5E1D8] bg-[#F8F7F4] text-[#0F2942] hover:border-[#0F2942]/40 dark:border-[#1E2E42] dark:bg-[#0B131E] dark:text-[#F1F5F9] dark:hover:border-[#F59E0B]/50'
                    }`}
                  >
                    {val} سؤالاً
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope */}
          <div>
            <label className="block text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">
              ٢. نطاق الأسئلة
            </label>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`rounded-xl border p-3.5 text-right transition-colors cursor-pointer ${
                  scope === 'all'
                    ? 'border-[#0F2942] bg-[#F1EFEA] dark:border-[#F59E0B] dark:bg-[#18263A]'
                    : 'border-[#E5E1D8] bg-white hover:border-[#0F2942]/40 dark:border-[#1E2E42] dark:bg-[#0B131E] dark:hover:border-[#F59E0B]/50'
                }`}
              >
                <div className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">جميع الفروع</div>
                <div className="mt-1 text-xs text-[#475569] dark:text-[#94A3B8]">
                  تغطية شاملة للمجالات العشرين
                </div>
              </button>

              <button
                type="button"
                disabled={effectiveUnansweredDisabled}
                onClick={() => setScope('unanswered')}
                className={`rounded-xl border p-3.5 text-right transition-colors ${
                  effectiveUnansweredDisabled
                    ? 'border-[#E5E1D8] bg-[#F8F7F4] opacity-50 dark:border-[#1E2E42] dark:bg-[#0B131E] cursor-not-allowed'
                    : scope === 'unanswered'
                    ? 'border-[#0F2942] bg-[#F1EFEA] dark:border-[#F59E0B] dark:bg-[#18263A] cursor-pointer'
                    : 'border-[#E5E1D8] bg-white hover:border-[#0F2942]/40 dark:border-[#1E2E42] dark:bg-[#0B131E] dark:hover:border-[#F59E0B]/50 cursor-pointer'
                }`}
              >
                <div className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">أسئلة جديدة فقط</div>
                <div className="mt-1 text-xs text-[#475569] dark:text-[#94A3B8] tabular-nums">
                  متاح {unansweredCount} سؤال غير محلول
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope('advanced')}
                className={`rounded-xl border p-3.5 text-right transition-colors cursor-pointer ${
                  scope === 'advanced'
                    ? 'border-[#0F2942] bg-[#F1EFEA] dark:border-[#F59E0B] dark:bg-[#18263A]'
                    : 'border-[#E5E1D8] bg-white hover:border-[#0F2942]/40 dark:border-[#1E2E42] dark:bg-[#0B131E] dark:hover:border-[#F59E0B]/50'
                }`}
              >
                <div className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">المستوى المتقدم</div>
                <div className="mt-1 text-xs text-[#475569] dark:text-[#94A3B8]">
                  تحديات سريرية وقضائية دقيقة
                </div>
              </button>
            </div>
          </div>

          {/* Feedback Mode */}
          <div>
            <label className="block text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">
              ٣. أسلوب التصحيح
            </label>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode('exam')}
                className={`rounded-xl border p-4 text-right transition-colors cursor-pointer ${
                  mode === 'exam'
                    ? 'border-[#0F2942] bg-[#F1EFEA] dark:border-[#F59E0B] dark:bg-[#18263A]'
                    : 'border-[#E5E1D8] bg-white hover:border-[#0F2942]/40 dark:border-[#1E2E42] dark:bg-[#0B131E] dark:hover:border-[#F59E0B]/50'
                }`}
              >
                <div className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">وضع الاختبار الفعلي</div>
                <div className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                  أجب عن جميع الأسئلة أولاً ثم تظهر النتيجة والتفسيرات عند التسليم.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('instant')}
                className={`rounded-xl border p-4 text-right transition-colors cursor-pointer ${
                  mode === 'instant'
                    ? 'border-[#0F2942] bg-[#F1EFEA] dark:border-[#F59E0B] dark:bg-[#18263A]'
                    : 'border-[#E5E1D8] bg-white hover:border-[#0F2942]/40 dark:border-[#1E2E42] dark:bg-[#0B131E] dark:hover:border-[#F59E0B]/50'
                }`}
              >
                <div className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9]">وضع التعلم الفوري</div>
                <div className="mt-1 text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                  تظهر صحة الإجابة والتعليل القانوني والنفسي مباشرة بعد كل اختيار.
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-[#E5E1D8] pt-5 dark:border-[#1E2E42]">
            <button
              type="button"
              onClick={() => onStartExam(count, scope, mode)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0F2942] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] cursor-pointer"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>بدء الاختبار الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
