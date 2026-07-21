'use client';

import { useLang } from '../lib/i18n';

// Session A: audio is not yet recorded (Session B). Per CLAUDE.md the 🔊 শুনুন
// button is visible but DISABLED with a "শীঘ্রই আসছে" tooltip. No TTS placeholder.
export default function AudioButton({ cardId }: { cardId: string }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      disabled
      title={t('audio_soon')}
      aria-label={`${t('listen')} — ${t('audio_soon')}`}
      data-card={cardId}
      className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-cream-soft px-4 py-2 text-sm font-semibold text-muted opacity-70"
    >
      <span aria-hidden>🔊</span>
      {t('listen')}
      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-muted">
        {t('audio_soon')}
      </span>
    </button>
  );
}
