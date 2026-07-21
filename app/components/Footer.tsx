'use client';

import { useLang } from '../lib/i18n';

// Always-visible trust line: Deshgori is not a government service (positioning).
export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mx-auto max-w-xl px-4 pb-10 pt-8">
      <p className="rounded-2xl bg-cream-soft px-4 py-3 text-center text-xs leading-relaxed text-muted">
        {t('not_official')}
      </p>
    </footer>
  );
}
