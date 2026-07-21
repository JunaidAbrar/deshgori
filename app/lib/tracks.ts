// Track configuration — pure data (no Node imports) so client components can use
// it. Deck card copy is loaded separately from /content at build time.

export type TrackId = 'worker' | 'student' | 'tourist';

export type ModuleMeta = {
  slug: string; // content file slug + route segment, e.g. 'w2'
  code: string; // short display code, e.g. 'W2' ('' for the shared module)
  icon: string;
  bn: string;
  en: string;
};

export type TrackMeta = {
  id: TrackId;
  bn: string; // track name — printed on the certificate
  en: string;
  route: string;
  intro: { bn: string; en: string };
  modules: ModuleMeta[]; // ordered; excludes the shared যাত্রার দিন module
};

// Shared module — the terminal step of every track. Lives at /jatra.
export const SHARED_JD: ModuleMeta = {
  slug: 'jd',
  code: '',
  icon: '🛫',
  bn: 'যাত্রার দিন',
  en: 'Day of travel',
};

export const TRACKS: Record<TrackId, TrackMeta> = {
  worker: {
    id: 'worker',
    bn: 'কর্মী কোর্স',
    en: 'Worker course',
    route: '/track/worker',
    intro: { bn: 'ধাপে ধাপে শিখুন — নিজেকে সুরক্ষিত রাখুন।', en: 'Learn step by step — keep yourself safe.' },
    modules: [
      { slug: 'w1', code: 'W1', icon: '🛡️', bn: 'টাকা দেওয়ার আগে যাচাই করুন', en: 'Verify before you pay' },
      { slug: 'w2', code: 'W2', icon: '💰', bn: 'আসল খরচ', en: 'The real cost' },
      { slug: 'w3', code: 'W3', icon: '📄', bn: 'চুক্তি ও পাসপোর্ট', en: 'Contract & passport' },
      { slug: 'w4', code: 'W4', icon: '🩺', bn: 'মেডিকেল ও সরকারি ধাপ', en: 'Medical & official steps' },
      { slug: 'w5', code: 'W5', icon: '🏦', bn: 'টাকা পাঠানো', en: 'Sending money home' },
      { slug: 'w6', code: 'W6', icon: '🆘', bn: 'বিপদে করণীয়', en: 'If things go wrong' },
    ],
  },
  student: {
    id: 'student',
    bn: 'শিক্ষার্থী কোর্স',
    en: 'Student course',
    route: '/track/student',
    intro: { bn: 'অফার থেকে পৌঁছানো পর্যন্ত — যাচাই করে এগোন।', en: 'From offer to arrival — verify as you go.' },
    modules: [
      { slug: 's1', code: 'S1', icon: '📧', bn: 'অফার ও এজেন্ট যাচাই', en: 'Verify offer & agent' },
      { slug: 's2', code: 'S2', icon: '🏦', bn: 'টাকা ও পেমেন্ট', en: 'Money & payment' },
      { slug: 's3', code: 'S3', icon: '🛬', bn: 'পৌঁছে প্রথম সপ্তাহ', en: 'Your first week' },
    ],
  },
  tourist: {
    id: 'tourist',
    bn: 'ভ্রমণ কোর্স',
    en: 'Tourist course',
    route: '/track/tourist',
    intro: { bn: 'যাচাই নিজে, কনফার্মেশন সাথে।', en: 'Verify yourself, keep confirmations.' },
    modules: [
      { slug: 't1', code: 'T1', icon: '🌐', bn: 'ভিসা ও কাগজ যাচাই', en: 'Verify visa & documents' },
    ],
  },
};

export const TRACK_IDS: TrackId[] = ['worker', 'student', 'tourist'];

export const PURPOSE_TRACK: Record<'work' | 'study' | 'travel', TrackId> = {
  work: 'worker',
  study: 'student',
  travel: 'tourist',
};

// Full ordered sequence for a track, including the shared যাত্রার দিন terminal.
export function trackSequence(t: TrackMeta): ModuleMeta[] {
  return [...t.modules, SHARED_JD];
}

export function getTrack(id: string): TrackMeta | undefined {
  return (TRACKS as Record<string, TrackMeta>)[id];
}
