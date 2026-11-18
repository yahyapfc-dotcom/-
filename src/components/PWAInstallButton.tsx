import { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <>
      {isInstallable ? (
        <button
          type="button"
          onClick={() => void install()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F2942]/25 bg-white px-4 py-3 text-sm font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942] hover:bg-[#F1EFEA] dark:border-[#334155] dark:bg-[#121E2E] dark:text-[#F1F5F9] dark:hover:border-[#F59E0B] dark:hover:bg-[#18263A] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>تثبيت للعمل بدون نت</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F2942]/25 bg-white px-4 py-3 text-sm font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942] hover:bg-[#F1EFEA] dark:border-[#334155] dark:bg-[#121E2E] dark:text-[#F1F5F9] dark:hover:border-[#F59E0B] dark:hover:bg-[#18263A] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>تثبيت على الآيفون</span>
        </button>
      )}

      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2942]/50 dark:bg-black/70 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-white p-6 text-right shadow-xl dark:border-[#1E2E42] dark:bg-[#121E2E]">
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E1D8] pb-4 dark:border-[#1E2E42]">
              <div>
                <h2 id="ios-install-title" className="text-lg font-bold text-[#0F2942] dark:text-[#F1F5F9]">
                  تثبيت التطبيق على أجهزة آبل
                </h2>
                <p className="mt-1 text-sm text-[#475569] dark:text-[#94A3B8]">
                  افتح المنهج الكامل بدون إنترنت من شاشتك الرئيسية
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="إغلاق النافذة"
                className="rounded-lg p-1.5 text-[#475569] hover:bg-[#F1EFEA] hover:text-[#0F2942] dark:text-[#94A3B8] dark:hover:bg-[#1E2E42] dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ol className="mt-5 space-y-4 text-sm text-[#1E293B] dark:text-[#E2E8F0]">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F2942] text-xs font-bold text-white dark:bg-[#F59E0B] dark:text-[#0B131E] tabular-nums">
                  ١
                </span>
                <div className="leading-relaxed">
                  اضغط على زر <strong className="font-semibold">المشاركة</strong>{' '}
                  <Share className="inline h-4 w-4 text-[#0F2942] dark:text-[#F59E0B]" aria-hidden="true" /> في شريط متصفح سفاري بالأسفل.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F2942] text-xs font-bold text-white dark:bg-[#F59E0B] dark:text-[#0B131E] tabular-nums">
                  ٢
                </span>
                <div className="leading-relaxed">
                  اختر <strong className="font-semibold">إضافة إلى الشاشة الرئيسية</strong>{' '}
                  <PlusSquare className="inline h-4 w-4 text-[#0F2942] dark:text-[#F59E0B]" aria-hidden="true" /> ثم اضغط إضافة.
                </div>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full rounded-xl bg-[#0F2942] py-2.5 text-sm font-semibold text-white hover:bg-[#17395B] dark:bg-[#F59E0B] dark:text-[#0B131E] dark:hover:bg-[#D97706] cursor-pointer"
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
}
