'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Deck as DeckType } from '../lib/types';
import { useLang } from '../lib/i18n';
import { completeModule, getModule, getProgress, setModuleStep } from '../lib/progress';
import { PURPOSE_TRACK, TRACKS } from '../lib/tracks';
import Card from './Card';
import Quiz from './Quiz';
import Certificate from './Certificate';
import ProgressDots from './ProgressDots';

type DeckNav = {
  // Non-terminal modules point to the next step in the track sequence.
  nextHref?: string;
  // The terminal module (যাত্রার দিন) ends the track → certificate.
  terminal?: boolean;
  // Where "back" links to; for the terminal module it is derived from the
  // learner's chosen track (stored at onboarding).
  trackRoute?: string;
};

export default function Deck({ deck, nav = {} }: { deck: DeckType; nav?: DeckNav }) {
  const { t, lang } = useLang();
  const total = deck.steps.length;
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState('');
  const [showCert, setShowCert] = useState(false);

  // For the terminal module, resolve the track from stored onboarding purpose.
  const resolvedTrack = useMemo(() => {
    if (!nav.terminal) return null;
    const purpose = getProgress().onboarding?.purpose;
    const trackId = purpose ? PURPOSE_TRACK[purpose] : 'worker';
    return TRACKS[trackId];
  }, [nav.terminal]);

  const backRoute = nav.trackRoute ?? resolvedTrack?.route ?? '/track/worker';
  const backLabel = resolvedTrack?.[lang] ?? t('worker_track');

  // Restore furthest position from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    const m = getModule(deck.id);
    if (m.completed) {
      setFinished(true);
    } else if (m.step > 0 && m.step < total) {
      setIndex(m.step);
    }
  }, [deck.id, total]);

  // Keep the current card in view on small screens after each step change.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  function advance() {
    const next = index + 1;
    if (next >= total) {
      completeModule(deck.id);
      setFinished(true);
      return;
    }
    setModuleStep(deck.id, next);
    setIndex(next);
  }

  function back() {
    if (index > 0) setIndex(index - 1);
  }

  const title = lang === 'bn' ? deck.title.bn : deck.title.en;

  // ---- Completion ----
  if (finished) {
    // Terminal module → certificate for the whole track.
    if (nav.terminal && resolvedTrack) {
      const trackName = resolvedTrack[lang];
      return (
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-8 text-center">
          <div className="mb-4 text-6xl" aria-hidden>🎉</div>
          <h1 className="mb-1 text-2xl font-bold text-teal-700">{t('module_done')}</h1>
          <p className="mb-8 text-muted">{trackName} · {t('course_done_sub')}</p>

          {!showCert ? (
            <div className="w-full rounded-3xl bg-cream-card p-6 shadow-card">
              <label htmlFor="cert-name" className="mb-2 block text-left font-semibold text-ink">
                {t('name_prompt')}
              </label>
              <input
                id="cert-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name.trim().length > 0) setShowCert(true);
                }}
                placeholder={t('name_placeholder')}
                autoComplete="off"
                className="mb-4 w-full rounded-2xl border border-cream-soft bg-cream px-5 py-4 text-lg text-ink outline-none focus:border-teal-300"
              />
              <button
                type="button"
                onClick={() => setShowCert(true)}
                disabled={name.trim().length === 0}
                className="w-full rounded-2xl bg-teal-500 px-6 py-4 text-lg font-bold text-white shadow-soft active:scale-[0.99] disabled:opacity-50"
              >
                {t('make_cert')}
              </button>
              <p className="mt-3 text-xs text-muted">{t('cert_note')}</p>
            </div>
          ) : (
            <Certificate name={name.trim()} courseTitle={trackName} />
          )}

          <Link href={backRoute} className="mt-8 rounded-full bg-cream-soft px-6 py-3 font-semibold text-muted">
            ← {backLabel}
          </Link>
        </div>
      );
    }

    // Non-terminal module → celebrate, then move to the next module.
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10 text-center">
        <div className="mb-4 text-6xl" aria-hidden>✅</div>
        <h1 className="mb-1 text-2xl font-bold text-teal-700">{t('module_done')}</h1>
        <p className="mb-8 text-muted">{title}</p>
        <div className="flex w-full flex-col gap-3">
          {nav.nextHref && (
            <Link
              href={nav.nextHref}
              className="w-full rounded-2xl bg-teal-500 px-6 py-4 text-lg font-bold text-white shadow-soft active:scale-[0.99]"
            >
              {t('next_module')} →
            </Link>
          )}
          <Link href={backRoute} className="w-full rounded-2xl bg-cream-soft px-6 py-4 font-semibold text-muted">
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  // ---- Card / quiz flow ----
  const step = deck.steps[index];
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col px-4 py-6">
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <Link href={backRoute} className="font-semibold text-teal-600">← {title}</Link>
        <span>{index + 1} / {total}</span>
      </div>

      <div className="mb-6">
        <ProgressDots total={total} current={index} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full rounded-3xl bg-cream-card p-6 shadow-card sm:p-8">
          {/* key={step.id} forces a fresh mount per step so a Quiz's internal
              "picked" state never bleeds into the next (adjacent) quiz. */}
          {step.type === 'card' ? (
            <Card key={step.id} step={step} />
          ) : (
            <Quiz key={step.id} step={step} onCorrect={advance} />
          )}
        </div>
      </div>

      {/* Cards use an explicit Next; quizzes advance themselves on a correct answer.
          On a quiz we keep a visible hint where the Next button would be, so the
          missing button never reads as "stuck". */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={back}
          disabled={index === 0}
          className="rounded-2xl bg-cream-soft px-5 py-4 font-semibold text-muted disabled:opacity-40"
        >
          {t('back')}
        </button>
        {step.type === 'card' ? (
          <button
            type="button"
            onClick={advance}
            className="flex-1 rounded-2xl bg-teal-500 px-6 py-4 text-lg font-bold text-white shadow-soft active:scale-[0.99]"
          >
            {t('next')} →
          </button>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-sky-400/40 px-4 py-4 text-center text-sm font-semibold text-sky-600">
            {t('quiz_footer_hint')}
          </div>
        )}
      </div>
    </div>
  );
}
