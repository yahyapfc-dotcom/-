import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b border-[#E5E1D8] bg-[#FDF9EE] px-4 py-2 text-center text-xs sm:text-sm text-[#78350F] dark:border-[#1E2E42] dark:bg-[#1E293B] dark:text-[#FDE68A]"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          أنت الآن في وضع عدم الاتصال — تعمل جميع الأسئلة الألف والشروحات والتقدم الدراسي بالكامل بدون إنترنت.
        </span>
      </div>
    </div>
  );
}
