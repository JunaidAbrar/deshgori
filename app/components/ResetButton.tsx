'use client';

import { useRouter } from 'next/navigation';
import { useLang } from '../lib/i18n';
import { resetProgress } from '../lib/progress';

// "নতুন শিক্ষার্থী" — visible reset for shared Android devices.
export default function ResetButton() {
  const { t } = useLang();
  const router = useRouter();

  function onReset() {
    if (window.confirm(t('reset_confirm'))) {
      resetProgress();
      router.push('/');
    }
  }

  return (
    <button
      type="button"
      onClick={onReset}
      className="rounded-full bg-cream-soft px-4 py-2 text-sm font-semibold text-muted active:scale-95"
    >
      ↺ {t('reset')}
    </button>
  );
}
