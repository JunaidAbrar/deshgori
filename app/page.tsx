'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from './lib/i18n';
import { setOnboarding, type Purpose } from './lib/progress';
import Header from './components/Header';
import Footer from './components/Footer';
import LanguageToggle from './components/LanguageToggle';

type Stage = 'welcome' | 'q1' | 'q2';

const ROUTE: Record<Purpose, string> = {
  work: '/track/worker',
  study: '/track/student',
  travel: '/track/tourist',
};

export default function Home() {
  const { t } = useLang();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('welcome');
  const [firstTrip, setFirstTrip] = useState<boolean | null>(null);

  function pickPurpose(p: Purpose) {
    // Anonymous, local-only. No account, no server (Hard Constraint 1).
    setOnboarding(firstTrip ?? true, p);
    router.push(ROUTE[p]);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {stage === 'welcome' ? <WelcomeBar /> : <Header showReset={false} />}

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-8">
        {stage === 'welcome' && (
          <section className="text-center">
            <div className="mb-6 text-7xl" aria-hidden>🧭</div>
            <h1 className="mb-2 text-4xl font-extrabold text-teal-700">{t('app_name')}</h1>
            <p className="mb-1 text-xl text-ink">{t('tagline')}</p>
            <p className="mb-8 text-sm font-semibold uppercase tracking-wide text-muted">
              {t('free_open')}
            </p>
            <button
              type="button"
              onClick={() => setStage('q1')}
              className="w-full rounded-3xl bg-teal-500 px-6 py-5 text-xl font-bold text-white shadow-soft active:scale-[0.99]"
            >
              {t('start')} →
            </button>

            {/* Emergency-links hub — one tap to /joruri, offline, gold-outlined.
                Kept directly under শুরু করুন so it's above the fold on 360×640. */}
            <a
              href="/joruri/"
              className="mt-4 flex items-center gap-3 rounded-3xl border-2 border-[#C8971B] bg-white px-5 py-4 text-left shadow-card active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDF3D6] text-2xl" aria-hidden>☎️</span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-[#8a6a12]">{t('joruri_home_title')}</span>
                <span className="block text-sm text-muted">{t('joruri_home_sub')}</span>
              </span>
              <span aria-hidden className="text-xl font-bold text-[#C8971B]">→</span>
            </a>
          </section>
        )}

        {stage === 'q1' && (
          <Question
            title={t('q1')}
            options={[
              { label: t('yes'), onClick: () => { setFirstTrip(true); setStage('q2'); } },
              { label: t('no'), onClick: () => { setFirstTrip(false); setStage('q2'); } },
            ]}
            step={1}
          />
        )}

        {stage === 'q2' && (
          <Question
            title={t('q2')}
            options={[
              { label: `💼 ${t('purpose_work')}`, onClick: () => pickPurpose('work') },
              { label: `🎓 ${t('purpose_study')}`, onClick: () => pickPurpose('study') },
              { label: `✈️ ${t('purpose_travel')}`, onClick: () => pickPurpose('travel') },
            ]}
            step={2}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

function WelcomeBar() {
  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-end px-4 py-3">
      <LanguageToggle />
    </div>
  );
}

function Question({
  title,
  options,
  step,
}: {
  title: string;
  options: { label: string; onClick: () => void }[];
  step: number;
}) {
  return (
    <section>
      <div className="mb-6 flex justify-center gap-2" aria-hidden>
        <span className={'h-2 w-8 rounded-full ' + (step >= 1 ? 'bg-teal-500' : 'bg-cream-soft')} />
        <span className={'h-2 w-8 rounded-full ' + (step >= 2 ? 'bg-teal-500' : 'bg-cream-soft')} />
      </div>
      <h2 className="mb-8 text-center text-2xl font-bold text-ink">{title}</h2>
      <div className="flex flex-col gap-4">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={o.onClick}
            className="w-full rounded-3xl border border-cream-soft bg-cream-card px-6 py-6 text-xl font-semibold text-ink shadow-card transition hover:border-teal-200 active:scale-[0.99]"
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
