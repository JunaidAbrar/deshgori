'use client';

import { useState } from 'react';
import type { QuizStep } from '../lib/types';
import { useLang } from '../lib/i18n';
import DraftText from './DraftText';

// 1 question · 3 tappable options · retriable. Wrong → one-line explanation, retry.
// Correct → advance (parent calls onCorrect).
export default function Quiz({ step, onCorrect }: { step: QuizStep; onCorrect: () => void }) {
  const { lang, t } = useLang();
  const [picked, setPicked] = useState<number | null>(null);

  const chosen = picked === null ? null : step.options[picked];
  const isWrong = chosen !== null && !chosen.correct;

  function choose(i: number) {
    const opt = step.options[i];
    setPicked(i);
    if (opt.correct) {
      // brief "correct" beat, then advance
      window.setTimeout(onCorrect, 650);
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Explicit cue: quizzes have no Next button — you tap an answer to proceed. */}
      <span className="mb-4 rounded-full bg-sky-400/15 px-4 py-1.5 text-sm font-bold text-sky-600">
        ❓ {t('quiz_label')} · {t('quiz_hint')}
      </span>
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-400/15 text-4xl">
        <span aria-hidden>{step.icon}</span>
      </div>
      <p className="mb-6 text-xl font-semibold leading-relaxed text-ink">
        {lang === 'bn' ? step.question.bn : step.question.en}
      </p>

      <div className="flex w-full flex-col gap-3">
        {step.options.map((opt, i) => {
          const active = picked === i;
          const state = active ? (opt.correct ? 'correct' : 'wrong') : 'idle';
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={chosen?.correct === true}
              className={
                'w-full rounded-2xl border px-5 py-4 text-left text-lg font-medium transition active:scale-[0.99] ' +
                (state === 'correct'
                  ? 'border-teal-400 bg-teal-50 text-teal-800'
                  : state === 'wrong'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-cream-soft bg-white text-ink hover:border-teal-200')
              }
            >
              {lang === 'bn' ? opt.bn : opt.en}
            </button>
          );
        })}
      </div>

      {chosen?.correct && (
        <p className="mt-5 text-lg font-semibold text-teal-600">✓ {t('correct')}</p>
      )}

      {isWrong && (
        <div className="mt-5 w-full rounded-2xl bg-amber-50 px-4 py-3 text-left text-base leading-relaxed text-amber-800">
          {(() => {
            // Per-option explanation wins; otherwise fall back to the quiz-level one.
            const ex = chosen.explain ?? step.explain;
            return ex ? <DraftText text={lang === 'bn' ? ex.bn : ex.en} /> : null;
          })()}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-700"
          >
            ↺ {t('try_again')}
          </button>
        </div>
      )}
    </div>
  );
}
