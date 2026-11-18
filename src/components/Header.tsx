import { useState } from 'react';
import { Scale, Menu, X, Moon, Sun } from 'lucide-react';

export type NavTab = 'home' | 'exam' | 'mistakes' | 'glossary';

interface HeaderProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onContinueStudy: () => void;
  hasProgress: boolean;
  mistakesCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({
  activeTab,
  onNavigate,
  onContinueStudy,
  hasProgress,
  mistakesCount,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'الفروع العشرون' },
    { id: 'exam', label: 'اختبار شامل' },
    {
      id: 'mistakes',
      label: mistakesCount > 0 ? `مراجعة الأخطاء (${mistakesCount})` : 'مراجعة الأخطاء',
    },
    { id: 'glossary', label: 'دليل القوانين' },
  ];

  const handleSelect = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E1D8] bg-[#F8F7F4]/95 backdrop-blur-sm dark:border-[#1E2E42] dark:bg-[#0B131E]/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="flex min-w-0 items-center gap-2 text-right cursor-pointer focus:outline-none"
        >
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F2942] text-[#F8F7F4] dark:bg-[#F59E0B] dark:text-[#0B131E]">
            <Scale className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </span>
          <span className="truncate text-xs sm:text-base font-bold tracking-tight text-[#0F2942] dark:text-[#F1F5F9]">
            علم النفس الجنائي السوداني
          </span>
        </button>

        {/* Zone 2: Primary Navigation (4 items, desktop single row) */}
        <nav aria-label="التنقل الرئيسي" className="hidden lg:flex items-center gap-6 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#0F2942] dark:text-[#F8FAFC]'
                    : 'text-[#475569] hover:text-[#0F2942] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9]'
                }`}
              >
                <span className="tabular-nums">{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-[#B45309] dark:bg-[#F59E0B]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Single Primary CTA + Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942]/40 hover:bg-[#F1EFEA] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#F1F5F9] dark:hover:border-[#F59E0B]/50 cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline whitespace-nowrap">
              {isDark ? 'نهاري' : 'ليلي'}
            </span>
          </button>

          <button
            type="button"
            onClick={onContinueStudy}
            className="rounded-xl bg-[#0F2942] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="sm:hidden">{hasProgress ? 'متابعة' : 'ابدأ'}</span>
            <span className="hidden sm:inline">
              {hasProgress ? 'متابعة الدراسة' : 'ابدأ الدراسة'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E1D8] bg-white text-[#0F2942] dark:border-[#1E2E42] dark:bg-[#121E2E] dark:text-[#F1F5F9] lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="قائمة الجوال"
          className="border-t border-[#E5E1D8] bg-white px-4 py-3 dark:border-[#1E2E42] dark:bg-[#121E2E] lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-right text-sm font-semibold tabular-nums cursor-pointer ${
                    isActive
                      ? 'bg-[#F1EFEA] text-[#0F2942] dark:bg-[#1E2E42] dark:text-[#F59E0B]'
                      : 'text-[#475569] hover:bg-[#F8F7F4] hover:text-[#0F2942] dark:text-[#CBD5E1] dark:hover:bg-[#18263A] dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
