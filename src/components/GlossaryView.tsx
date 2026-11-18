import { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { FORENSIC_GLOSSARY, TOPICS_META } from '../data';

interface GlossaryViewProps {
  onSelectTopic: (topicId: number) => void;
}

export function GlossaryView({ onSelectTopic }: GlossaryViewProps) {
  const [query, setQuery] = useState('');

  const filteredGlossary = useMemo(() => {
    const q = query.trim();
    if (!q) return FORENSIC_GLOSSARY;
    return FORENSIC_GLOSSARY.filter(
      (entry) =>
        entry.term.includes(q) ||
        entry.lawOrSource.includes(q) ||
        entry.definition.includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="border-b border-[#E5E1D8] pb-6 dark:border-[#1E2E42]">
        <p className="text-xs font-semibold text-[#B45309] dark:text-[#F59E0B]">
          مرجع علمي وتشريعي مدمج للعمل بدون إنترنت
        </p>
        <h1 className="font-display-ar mt-2 text-2xl sm:text-3xl font-bold text-[#0F2942] dark:text-[#F1F5F9]">
          دليل القوانين والمصطلحات السودانية
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
          خلاصة المفاهيم المرجعية في القانون الجنائي السوداني ١٩٩١، قانون الإجراءات الجنائية، قانون الإثبات، قانون الطفل ٢٠١٠، وتطبيقات الطب النفسي الشرعي الميداني.
        </p>

        <div className="relative mt-5 max-w-md">
          <Search
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مصطلح أو مادة قانونية..."
            aria-label="البحث في دليل المصطلحات"
            className="w-full rounded-xl border border-[#E5E1D8] bg-white py-2.5 pr-10 pl-4 text-sm text-[#0F2942] placeholder:text-[#94A3B8] focus:border-[#0F2942] focus:outline-none dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] dark:focus:border-[#F59E0B]"
          />
        </div>
      </div>

      {/* Glossary Cards */}
      <section aria-label="المصطلحات المرجعية" className="mt-8 space-y-4">
        {filteredGlossary.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E1D8] bg-white p-8 text-center text-sm text-[#475569] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#CBD5E1]">
            لا توجد نتائج مطابقة لعبارة «{query}». جرّب كلمة بحث أخرى.
          </div>
        ) : (
          filteredGlossary.map((entry) => (
            <article
              key={entry.term}
              className="rounded-2xl border border-[#E5E1D8] bg-white p-5 sm:p-6 dark:border-[#1E2E42] dark:bg-[#121E2E]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0F2942] dark:text-[#F1F5F9]">
                  {entry.term}
                </h2>
                <span className="text-xs font-semibold text-[#B45309] dark:text-[#F59E0B]">
                  {entry.lawOrSource}
                </span>
              </div>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#334155] dark:text-[#CBD5E1]">
                {entry.definition}
              </p>
            </article>
          ))
        )}
      </section>

      {/* Curriculum Roadmap Quick Index */}
      <section aria-label="فهرس المرجعيات العلمية للفروع" className="mt-12 border-t border-[#E5E1D8] pt-8 dark:border-[#1E2E42]">
        <div className="flex items-center gap-2 text-[#0F2942] dark:text-[#F1F5F9]">
          <BookOpen className="h-5 w-5 shrink-0 text-[#B45309] dark:text-[#F59E0B]" aria-hidden="true" />
          <h2 className="text-lg sm:text-xl font-bold">
            خريطة المرجعيات القانونية والعلمية للفروع العشرين
          </h2>
        </div>
        <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
          {TOPICS_META.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              className="flex min-w-0 w-full items-start gap-3 rounded-xl border border-[#E5E1D8] bg-white p-4 text-right transition-colors hover:border-[#0F2942] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:hover:border-[#F59E0B] cursor-pointer"
            >
              <span className="shrink-0 tabular-nums text-base font-bold text-[#B45309] dark:text-[#F59E0B]">
                {topic.numberLabel}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#0F2942] dark:text-[#F1F5F9] break-words">
                  {topic.title}
                </div>
                <div className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8] break-words">
                  {topic.reference}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
