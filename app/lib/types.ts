// Shared deck types. No Node imports here so client components can import freely.

export type Localized = { bn: string; en: string };

export type CardStep = {
  type: 'card';
  // 'teach' = normal teaching card, 'recap' = end-of-module summary (styled).
  variant?: 'teach' | 'recap';
  id: string;
  icon: string;
  bn: string;
  en: string;
};

export type QuizOption = {
  bn: string;
  en: string;
  correct: boolean;
  explain?: Localized;
};

export type QuizStep = {
  type: 'quiz';
  id: string;
  icon: string;
  question: Localized;
  options: QuizOption[];
  // Shown on any wrong answer (research decks carry one explanation per quiz).
  explain?: Localized;
};

export type DeckStep = CardStep | QuizStep;

export type Deck = {
  id: string;
  module: string;
  title: Localized;
  steps: DeckStep[];
};
