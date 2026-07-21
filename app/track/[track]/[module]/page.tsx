import { notFound } from 'next/navigation';
import { loadDeck } from '../../../lib/content';
import Deck from '../../../components/Deck';
import Header from '../../../components/Header';
import { getTrack, TRACKS, TRACK_IDS } from '../../../lib/tracks';

// Build one static page per (track, module) pair. The shared যাত্রার দিন module
// is NOT here — it lives at /jatra as the terminal step of every track.
export function generateStaticParams() {
  const params: { track: string; module: string }[] = [];
  for (const id of TRACK_IDS) {
    for (const m of TRACKS[id].modules) params.push({ track: id, module: m.slug });
  }
  return params;
}

export default function ModulePage({ params }: { params: { track: string; module: string } }) {
  const track = getTrack(params.track);
  if (!track) notFound();
  const idx = track.modules.findIndex((m) => m.slug === params.module);
  if (idx === -1) notFound();

  const deck = loadDeck(params.module);
  const isLastModule = idx === track.modules.length - 1;
  // Last track module hands off to the shared terminal module (যাত্রার দিন).
  const nextHref = isLastModule ? '/jatra' : `${track.route}/${track.modules[idx + 1].slug}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Deck deck={deck} nav={{ nextHref, trackRoute: track.route }} />
    </div>
  );
}
