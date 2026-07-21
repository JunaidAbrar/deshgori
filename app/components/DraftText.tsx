'use client';

import type { ReactNode } from 'react';

// Constraint 4: any [VERIFY: …] marker must be VISIBLY draft, never plausible-but-
// wrong. We render the marker in a distinct amber "draft" pill so it can never be
// mistaken for shipped, vetted copy. Session C clears these.
export default function DraftText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[VERIFY:[^\]]*\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <span
        key={key++}
        className="mx-0.5 inline-block rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 align-middle text-[0.8em] font-semibold text-amber-700"
      >
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
