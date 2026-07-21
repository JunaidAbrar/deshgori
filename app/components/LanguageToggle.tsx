'use client';

import { useLang } from '../lib/i18n';

export default function LanguageToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
      className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-card active:scale-95"
    >
      {lang === 'bn' ? 'EN' : 'বাংলা'}
    </button>
  );
}
