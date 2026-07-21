import { loadDeck } from '../lib/content';
import Deck from '../components/Deck';
import Header from '../components/Header';

// যাত্রার দিন — the shared terminal module for every track. On completion it ends
// the track at the certificate (track name resolved from the learner's onboarding
// choice). Reached from worker/student/tourist alike.
export default function JatraPage() {
  const deck = loadDeck('jd');
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Deck deck={deck} nav={{ terminal: true }} />
    </div>
  );
}
