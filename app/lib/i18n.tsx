'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Bangla-first. English is the secondary toggle (Hard Constraint 7).
export type Lang = 'bn' | 'en';

const LANG_KEY = 'dg.v1.lang';

type Dict = Record<string, { bn: string; en: string }>;

// UI strings. Card/quiz copy lives in /content, not here.
const STRINGS: Dict = {
  app_name: { bn: 'দেশগড়ি', en: 'Deshgori' },
  tagline: { bn: 'বিদেশ যাত্রার আগে জেনে নিন', en: 'Know before you go abroad' },
  free_open: { bn: 'বিনামূল্যে · ওপেন সোর্স', en: 'Free · open source' },
  start: { bn: 'শুরু করুন', en: 'Get started' },
  next: { bn: 'পরবর্তী', en: 'Next' },
  back: { bn: 'পূর্ববর্তী', en: 'Back' },
  continue: { bn: 'চালিয়ে যান', en: 'Continue' },

  // Onboarding
  q1: { bn: 'এটা কি আপনার প্রথম বিদেশ যাত্রা?', en: 'Is this your first trip abroad?' },
  yes: { bn: 'হ্যাঁ', en: 'Yes' },
  no: { bn: 'না', en: 'No' },
  q2: { bn: 'যাওয়ার উদ্দেশ্য কী?', en: 'What is the purpose of travel?' },
  purpose_work: { bn: 'কাজ', en: 'Work' },
  purpose_study: { bn: 'উচ্চশিক্ষা', en: 'Higher study' },
  purpose_travel: { bn: 'ভ্রমণ', en: 'Travel' },

  // Reset (shared devices)
  reset: { bn: 'নতুন শিক্ষার্থী', en: 'New learner' },
  reset_confirm: { bn: 'সব অগ্রগতি মুছে নতুন করে শুরু করবেন?', en: 'Erase all progress and start fresh?' },

  // Audio
  listen: { bn: 'শুনুন', en: 'Listen' },
  audio_soon: { bn: 'শীঘ্রই আসছে', en: 'Coming soon' },

  // Tracks
  worker_track: { bn: 'কর্মী কোর্স', en: 'Worker course' },
  student_track: { bn: 'শিক্ষার্থী কোর্স', en: 'Student course' },
  tourist_track: { bn: 'ভ্রমণ কোর্স', en: 'Tourist course' },
  coming_soon: { bn: 'শীঘ্রই আসছে', en: 'Coming soon' },
  locked: { bn: 'তালাবদ্ধ', en: 'Locked' },
  start_module: { bn: 'শুরু করুন', en: 'Start' },
  next_module: { bn: 'পরবর্তী মডিউল', en: 'Next module' },
  resume_module: { bn: 'চালিয়ে যান', en: 'Resume' },
  all_done_banner: { bn: 'কোর্স সম্পন্ন! সনদ নিন', en: 'Course complete! Get your certificate' },
  get_certificate: { bn: 'সনদ নিন', en: 'Get certificate' },
  review_module: { bn: 'আবার দেখুন', en: 'Review' },
  done_label: { bn: 'সম্পন্ন', en: 'Done' },

  // Shared module
  jatra_title: { bn: 'যাত্রার দিন', en: 'Day of travel' },
  jatra_sub: { bn: 'বিমানবন্দর, লাগেজ ও ট্রানজিট', en: 'Airport, luggage & transit' },

  // Quiz
  correct: { bn: 'সঠিক!', en: 'Correct!' },
  try_again: { bn: 'আবার চেষ্টা করুন', en: 'Try again' },
  quiz_label: { bn: 'কুইজ', en: 'Quiz' },
  quiz_hint: { bn: 'সঠিক উত্তরটি বেছে নিন', en: 'Choose the correct answer' },
  quiz_footer_hint: { bn: '👆 উত্তর দিলেই পরের কার্ডে যাবেন', en: '👆 Answer to continue' },

  // Completion + certificate
  module_done: { bn: 'অভিনন্দন! মডিউল সম্পন্ন', en: 'Congratulations! Module complete' },
  course_done_sub: { bn: 'আপনি প্রথম ধাপ শেষ করেছেন।', en: 'You have finished the first step.' },
  name_prompt: { bn: 'সনদে যে নাম লিখতে চান', en: 'The name to print on your certificate' },
  name_placeholder: { bn: 'আপনার নাম', en: 'Your name' },
  make_cert: { bn: 'সনদ তৈরি করুন', en: 'Create certificate' },
  download_cert: { bn: 'সনদ ডাউনলোড করুন', en: 'Download certificate' },
  cert_note: {
    bn: 'নাম শুধু আপনার ফোনেই থাকে — কোথাও পাঠানো হয় না।',
    en: 'The name stays on your phone only — it is never sent anywhere.',
  },
  back_home: { bn: 'হোমে ফিরুন', en: 'Back to home' },

  // Mandatory certificate disclaimer (Hard Constraint 3) — never edit the bn.
  cert_disclaimer: {
    bn: 'এটি একটি শিক্ষামূলক সনদ — কোনো সরকারি কাগজ নয়।',
    en: 'This is an educational certificate — not a government document.',
  },
  cert_course_line: { bn: 'সম্পন্ন করেছেন', en: 'has completed' },

  // Footer / trust
  not_official: {
    bn: 'দেশগড়ি একটি স্বাধীন শিক্ষামূলক উদ্যোগ। এটি কোনো সরকারি সেবা নয় এবং কোনো সরকারি ছাড়পত্র দেয় না।',
    en: 'Deshgori is an independent educational project. It is not a government service and issues no official clearance.',
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: keyof typeof STRINGS) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bn');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === 'bn' || saved === 'en') setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setLang(lang === 'bn' ? 'en' : 'bn'), [lang, setLang]);

  const t = useCallback((key: keyof typeof STRINGS) => STRINGS[key]?.[lang] ?? String(key), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>{children}</LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
