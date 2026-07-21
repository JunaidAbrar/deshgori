'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '../lib/i18n';
import { getProgress } from '../lib/progress';
import { SHARED_JD, trackSequence, type TrackMeta } from '../lib/tracks';
import Header from './Header';
import Footer from './Footer';

// Module list for a track. All modules ship in v1 — no locks, no "শীঘ্রই আসছে".
export default function TrackHome({ track }: { track: TrackMeta }) {
  const { t, lang } = useLang();
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const p = getProgress();
    const map: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(p.modules)) map[k] = v.completed;
    setDone(map);
  }, []);

  const sequence = trackSequence(track);
  const allComplete = sequence.every((m) => done[m.slug]);

  function href(slug: string) {
    return slug === SHARED_JD.slug ? '/jatra' : `${track.route}/${slug}`;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold text-teal-700">{track[lang]}</h1>
        <p className="mb-6 text-muted">{lang === 'bn' ? track.intro.bn : track.intro.en}</p>

        {allComplete && (
          <Link
            href="/jatra"
            className="mb-6 flex items-center justify-between rounded-3xl bg-teal-500 px-5 py-4 font-bold text-white shadow-soft"
          >
            <span>🎓 {t('all_done_banner')}</span>
            <span aria-hidden>→</span>
          </Link>
        )}

        <div className="flex flex-col gap-3">
          {track.modules.map((m) => {
            const complete = done[m.slug];
            return (
              <Link key={m.slug} href={href(m.slug)}>
                <div className="flex items-center gap-4 rounded-3xl border border-cream-soft bg-cream-card p-4 shadow-card">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
                    <span aria-hidden>{m.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted">{m.code}</div>
                    <div className="truncate text-lg font-bold text-ink">{lang === 'bn' ? m.bn : m.en}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-white">
                    {complete ? `✓ ${t('review_module')}` : t('start_module')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Shared terminal module — যাত্রার দিন → ends at the certificate */}
        <h2 className="mb-3 mt-8 text-lg font-bold text-teal-700">
          {lang === 'bn' ? 'শেষ ধাপ · সবার জন্য' : 'Final step · for everyone'}
        </h2>
        <Link href="/jatra">
          <div className="flex items-center gap-4 rounded-3xl border border-cream-soft bg-cream-card p-4 shadow-card">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-400/15 text-3xl">
              <span aria-hidden>{SHARED_JD.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold text-ink">{t('jatra_title')}</div>
              <div className="truncate text-sm text-muted">{t('jatra_sub')}</div>
            </div>
            <span className="shrink-0 rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-white">
              {done[SHARED_JD.slug] ? `✓ ${t('review_module')}` : t('start_module')}
            </span>
          </div>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
