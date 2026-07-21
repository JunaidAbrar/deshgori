'use client';

import type { CardStep } from '../lib/types';
import { useLang } from '../lib/i18n';
import AudioButton from './AudioButton';
import DraftText from './DraftText';

export default function Card({ step }: { step: CardStep }) {
  const { lang } = useLang();
  const body = lang === 'bn' ? step.bn : step.en;
  const isRecap = step.variant === 'recap';
  return (
    <div className="flex flex-col items-center text-center">
      {isRecap && (
        <span className="mb-4 rounded-full bg-teal-100 px-4 py-1 text-sm font-bold text-teal-700">
          {lang === 'bn' ? 'মনে রাখুন' : 'Remember'}
        </span>
      )}
      <div
        className={
          'mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-5xl ' +
          (isRecap ? 'bg-teal-100' : 'bg-teal-50')
        }
      >
        <span aria-hidden>{step.icon}</span>
      </div>
      <p className="mb-6 text-xl leading-relaxed text-ink sm:text-2xl">
        <DraftText text={body} />
      </p>
      <AudioButton cardId={step.id} />
    </div>
  );
}
