import fs from 'node:fs';
import path from 'node:path';
import type { Deck } from './types';

// Server-only. Runs at build time during static export.
// The deck is the fenced ```json block inside /content/<slug>.md so the prose
// file stays human-editable while the app gets a bulletproof JSON parse.
export function loadDeck(slug: string): Deck {
  const file = path.join(process.cwd(), 'content', `${slug}.md`);
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/```json\s*([\s\S]*?)```/);
  if (!match) {
    throw new Error(`No \`\`\`json deck block found in content/${slug}.md`);
  }
  return JSON.parse(match[1]) as Deck;
}
