'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/i18n';

// Hard Constraint 3: client-rendered PNG certificate, EDUCATIONAL ONLY.
// - The mandatory Bangla disclaimer below is drawn on the card itself, always in
//   Bangla, regardless of UI language. Do not remove or translate away.
// - No emblem, no QR code, no "clearance/pass" wording — must not resemble a
//   BMET/government document.
// - The name is rendered locally and never transmitted or stored server-side.
const MANDATORY_DISCLAIMER_BN = 'এটি একটি শিক্ষামূলক সনদ — কোনো সরকারি কাগজ নয়।';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function Certificate({
  name,
  courseTitle,
}: {
  name: string;
  courseTitle: string;
}) {
  const { t, lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const W = 1080;
    const H = 760;

    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      // Use the same Bangla font family the page loaded, so canvas shapes Bengali.
      const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
      try {
        await document.fonts?.ready;
      } catch {
        /* ignore */
      }
      if (cancelled) return;

      // Warm off-white background
      ctx.fillStyle = '#FBF8F1';
      ctx.fillRect(0, 0, W, H);

      // Soft teal rounded frame (friendly, not a formal border)
      roundRect(ctx, 30, 30, W - 60, H - 60, 40);
      ctx.strokeStyle = '#6FD5DD';
      ctx.lineWidth = 8;
      ctx.stroke();

      roundRect(ctx, 48, 48, W - 96, H - 96, 30);
      ctx.strokeStyle = '#EBFAFB';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'center';

      // Wordmark
      ctx.fillStyle = '#0E7E8A';
      ctx.font = `700 48px ${family}`;
      ctx.fillText('🧭 দেশগড়ি', W / 2, 150);

      ctx.fillStyle = '#5B6B75';
      ctx.font = `500 24px ${family}`;
      ctx.fillText(lang === 'bn' ? 'শিক্ষামূলক সনদ' : 'Educational certificate', W / 2, 196);

      // "has completed"
      ctx.fillStyle = '#5B6B75';
      ctx.font = `400 26px ${family}`;
      ctx.fillText(t('cert_course_line'), W / 2, 300);

      // Name (truncate defensively)
      const shownName = (name || t('name_placeholder')).slice(0, 40);
      ctx.fillStyle = '#1F2A33';
      ctx.font = `700 60px ${family}`;
      ctx.fillText(shownName, W / 2, 380);

      // Course title
      ctx.fillStyle = '#0E7E8A';
      ctx.font = `600 34px ${family}`;
      ctx.fillText(courseTitle, W / 2, 448);

      // Date
      const now = new Date();
      const date = now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      ctx.fillStyle = '#5B6B75';
      ctx.font = `400 24px ${family}`;
      ctx.fillText(date, W / 2, 512);

      // Mandatory Bangla disclaimer band (always Bangla)
      roundRect(ctx, 90, H - 170, W - 180, 88, 22);
      ctx.fillStyle = '#F3EFE6';
      ctx.fill();
      ctx.fillStyle = '#124F5A';
      ctx.font = `600 26px ${family}`;
      ctx.fillText(MANDATORY_DISCLAIMER_BN, W / 2, H - 118);

      setReady(true);
    }

    void draw();
    return () => {
      cancelled = true;
    };
  }, [name, courseTitle, lang, t]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deshgori-certificate.png';
    a.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="w-full rounded-3xl shadow-soft"
        style={{ aspectRatio: `${W_RATIO}` }}
        aria-label="Educational certificate preview"
      />
      <button
        type="button"
        onClick={download}
        disabled={!ready}
        className="w-full rounded-2xl bg-teal-500 px-6 py-4 text-lg font-bold text-white shadow-soft active:scale-[0.99] disabled:opacity-60"
      >
        ⬇ {t('download_cert')}
      </button>
      <p className="text-center text-sm text-muted">{t('cert_note')}</p>
    </div>
  );
}

const W_RATIO = '1080 / 760';
