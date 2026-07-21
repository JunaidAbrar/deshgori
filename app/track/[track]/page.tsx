import { notFound } from 'next/navigation';
import TrackHome from '../../components/TrackHome';
import { getTrack, TRACK_IDS } from '../../lib/tracks';

export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track }));
}

export default function TrackPage({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  if (!track) notFound();
  return <TrackHome track={track} />;
}
