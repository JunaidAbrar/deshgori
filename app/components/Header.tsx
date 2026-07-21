'use client';

import Link from 'next/link';
import { useLang } from '../lib/i18n';
import LanguageToggle from './LanguageToggle';
import ResetButton from './ResetButton';

export default function Header({ showReset = true }: { showReset?: boolean }) {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-10 border-b border-cream-soft bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">🧭</span>
          <span className="text-xl font-bold text-teal-700">{t('app_name')}</span>
        </Link>
        <div className="flex items-center gap-2">
          {showReset && <ResetButton />}
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
