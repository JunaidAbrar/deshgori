#!/usr/bin/env node
// Deshgori v2 — build-time static-HTML generator.
// Reads data/links.json (the single source of truth) and writes framework-free
// HTML into ./out AFTER `next build`. No government URL is hardcoded in any
// tracked HTML file — every link renders from the registry here (CLAUDE §0.2, T1).
//
// Pages produced this phase: /joruri (the emergency-links hub, T2).
// Also: robots.txt, sitemap.xml, llms.txt (expanded in T6).

import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const ROOT = process.cwd();
const OUT = process.env.OUT_DIR || path.join(ROOT, 'out');
const SITE = 'https://deshgori.com';

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'links.json'), 'utf8'));

// ---------- helpers ----------------------------------------------------------
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const BN_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

const toBnDigits = (s) => String(s).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);

function toBnDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${toBnDigits(d)} ${BN_MONTHS[m - 1]} ${toBnDigits(y)}`;
}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// action = "tel:16135" | "url:https://..." → { kind, href }
function parseAction(action) {
  if (action.startsWith('tel:')) return { kind: 'tel', href: action };
  if (action.startsWith('url:')) return { kind: 'url', href: action.slice(4) };
  return { kind: 'url', href: action };
}

function writeFile(rel, html) {
  const abs = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html);
  return rel;
}

// ---------- inline icons (no icon font) --------------------------------------
const ICONS = {
  call: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.24 1z"/></svg>',
  verify: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="m8.5 11 2 2 3-3.5"/></svg>',
  service: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></svg>',
  help: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/><path d="M12 8v4M12 15h.01"/></svg>',
  ext: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" class="ext"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

const DISCLAIMER = 'দেশগড়ি একটি স্বাধীন শিক্ষামূলক উদ্যোগ। এটি কোনো সরকারি সেবা নয় এবং কোনো সরকারি ছাড়পত্র দেয় না।';

// ---------- shared CSS (inline, small) ---------------------------------------
const CSS = `
:root{--cream:#FBF8F1;--card:#fff;--soft:#F3EFE6;--ink:#1F2A33;--muted:#5B6B75;
--teal:#0E7E8A;--teal-d:#124F5A;--gold:#C8971B;--rose:#B4413C}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--cream);color:var(--ink);
font-family:'Noto Sans Bengali','Hind Siliguri',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
line-height:1.5;font-size:17px}
.wrap{max-width:560px;margin:0 auto;padding:16px}
a{color:inherit;text-decoration:none}
.top{display:flex;align-items:center;gap:8px;padding:6px 0 14px}
.top .mark{font-weight:800;color:var(--teal);font-size:20px}
h1{font-size:26px;margin:.2em 0 .3em;color:var(--teal-d)}
.banner{background:#FFF7E0;border:1px solid #F0D98A;border-radius:14px;
padding:12px 14px;font-size:15px;color:#6b571b;margin-bottom:18px}
.banner b{color:#4d3f12}
.group{margin:22px 0 8px;font-size:15px;font-weight:700;color:var(--muted);
letter-spacing:.02em;text-transform:none}
.tile{display:flex;align-items:center;gap:14px;background:var(--card);
border:1px solid var(--soft);border-radius:18px;padding:14px 16px;margin:10px 0;
min-height:64px;box-shadow:0 2px 10px -6px rgba(18,79,90,.18)}
.tile:active{transform:scale(.995)}
.tile .ic{flex:0 0 auto;width:40px;height:40px;display:grid;place-items:center;
border-radius:12px;background:#EBFAFB;color:var(--teal)}
.tile .ic svg{width:24px;height:24px}
.tile .ic svg[fill="none"]{fill:none}
.tile .bd{min-width:0;flex:1}
.tile .lab{font-weight:600;font-size:20px;color:var(--ink);line-height:1.25}
.tile .desc{font-size:14px;color:var(--muted);margin-top:2px}
.badge{display:inline-block;margin-top:6px;font-size:13px;color:var(--teal-d);
background:var(--soft);border-radius:8px;padding:2px 8px;
font-family:ui-monospace,'Cascadia Code',Menlo,Consolas,monospace}
.ext{width:20px;height:20px;color:var(--muted);flex:0 0 auto}
/* call buttons */
.tile.call{background:var(--teal-d);border-color:var(--teal-d);color:#fff}
.tile.call .ic{background:rgba(255,255,255,.15);color:#fff}
.tile.call .lab{color:#fff}
.tile.call .num{font-size:26px;font-weight:800;letter-spacing:.5px}
.tile.call .desc{color:#CDE9EC}
.tile.call .src{font-size:12px;color:#9fcfd4;margin-top:4px}
.pill{display:inline-flex;gap:8px;align-items:center;justify-content:center;
width:100%;background:var(--soft);color:var(--teal-d);border:1px solid #E4DcC9;
border-radius:14px;padding:14px;font-weight:700;font-size:16px;margin:18px 0 6px}
footer{margin:26px 0 40px;font-size:13px;color:var(--muted);
background:var(--soft);border-radius:14px;padding:12px 14px;text-align:center}
.back{display:inline-block;margin:14px 0;color:var(--teal);font-weight:600}
@media(min-width:420px){.tile .lab{font-size:21px}}
`;

// Base document with a custom CSS block; used by the hub, print sheet and poster.
function htmlDoc({ title, description, canonical, css, body, bodyClass = '' }) {
  return `<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#149EAC">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icons/icon.svg">
<link rel="apple-touch-icon" href="/icons/icon.svg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="দেশগড়ি · Deshgori">
<meta property="og:locale" content="bn_BD">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/icons/og-cover.png">
<meta name="twitter:card" content="summary_large_image">
<style>${css}</style>
</head>
<body class="${bodyClass}">
${body}
</body>
</html>`;
}

// Hub layout: base doc + hub CSS + shared chrome (top wordmark, footer disclaimer).
function layout({ title, description, canonical, body, bodyClass = '' }) {
  return htmlDoc({
    title, description, canonical, css: CSS, bodyClass,
    body: `<div class="wrap">
<div class="top"><span aria-hidden="true">🧭</span><a class="mark" href="/">দেশগড়ি</a></div>
${body}
<footer>${esc(DISCLAIMER)}</footer>
</div>`,
  });
}

// ---------- /joruri hub (T2) -------------------------------------------------
function tileCall(l) {
  const { href } = parseAction(l.action);
  return `<a class="tile call" href="${esc(href)}">
<span class="ic">${ICONS.call}</span>
<span class="bd">
<span class="lab">${esc(l.bn_label)}</span>
<span class="num">${esc(l.display)}</span>
<span class="desc">${esc(l.bn_desc)}</span>
<span class="src">উৎস: ${esc(l.official_domain)}</span>
</span></a>`;
}

function tileLink(l, icon) {
  const { href } = parseAction(l.action);
  return `<a class="tile" href="${esc(href)}" target="_blank" rel="noopener noreferrer">
<span class="ic">${icon}</span>
<span class="bd">
<span class="lab">${esc(l.bn_label)}</span>
<span class="desc">${esc(l.bn_desc)}</span>
<span class="badge">সরকারি ঠিকানা: ${esc(l.display)}</span>
</span>
${ICONS.ext}</a>`;
}

function renderHub() {
  const groups = [...registry.groups].sort((a, b) => a.order - b.order);
  const verified = toBnDate(registry._meta.verified_on);
  const banner = `<div class="banner">এই পাতার প্রতিটি লিংক সরকারি ওয়েবসাইটের। শেষবার যাচাই: ${verified}।<br>মনে রাখুন — বাংলাদেশ সরকারি সাইট শেষ হয় <b>.gov.bd</b> দিয়ে।</div>`;

  let sections = '';
  for (const g of groups) {
    const links = registry.links.filter((l) => l.group === g.id);
    const icon = ICONS[g.id] || ICONS.service;
    const tiles = links.map((l) => (g.id === 'call' ? tileCall(l) : tileLink(l, icon))).join('\n');
    sections += `<h2 class="group">${esc(g.bn)}</h2>\n${tiles}\n`;
  }

  const print = `<a class="pill" href="/joruri/print/">📄 ছাপার কাগজ — ফ্রিজে বা মসজিদে লাগান</a>`;

  const body = `<h1>জরুরি লিংক ও নম্বর</h1>\n${banner}\n${sections}\n${print}\n<a class="back" href="/">← হোমে ফিরুন</a>`;

  return layout({
    title: 'জরুরি লিংক ও নম্বর — দেশগড়ি',
    description: 'প্রবাসীদের জরুরি হটলাইন ও সরকারি যাচাই লিংক এক পাতায় — ১৬১৩৫, ভিসা চেক, বিএমইটি, অভিযোগ। প্রতিটি সরকারি ঠিকানাসহ।',
    canonical: `${SITE}/joruri/`,
    body,
  });
}

// ---------- /joruri/print — B&W single-A4 fridge/mosque sheet (T3) -----------
const byId = (id) => registry.links.find((l) => l.id === id);
// Top-5 self-verify/complaint links for the printed sheet (URLs still come from
// the registry via byId — no hardcoded government URL here).
const PRINT_TOP5 = ['verify_agency', 'verify_saudi_visa', 'verify_bmet', 'verify_wafid', 'help_complain'];

function renderPrint() {
  const verified = toBnDate(registry._meta.verified_on);
  const calls = registry.links.filter((l) => l.group === 'call');
  const top5 = PRINT_TOP5.map(byId).filter(Boolean);

  const css = `
*{box-sizing:border-box}
body{margin:0;background:#f4f4f4;color:#000;font-family:'Noto Sans Bengali','Hind Siliguri',system-ui,sans-serif;line-height:1.4}
.sheet{max-width:190mm;margin:12px auto;background:#fff;border:2px solid #000;padding:10mm}
h1{font-size:30px;margin:0 0 2px;text-align:center}
.sub{text-align:center;font-size:15px;margin:0 0 10px}
.rule{border:0;border-top:2px solid #000;margin:10px 0}
.sec{font-size:17px;font-weight:800;margin:12px 0 6px;text-transform:none}
.call{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px dashed #000;padding:7px 0}
.call .l{font-size:18px;font-weight:700}
.call .l small{font-weight:400;font-size:13px}
.call .n{font-size:26px;font-weight:900;letter-spacing:1px;white-space:nowrap}
.lnk{padding:6px 0;border-bottom:1px dashed #000;font-size:16px}
.lnk b{font-size:17px}
.lnk .d{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700}
.tip{margin-top:12px;font-size:16px;font-weight:700;text-align:center;border:2px solid #000;padding:8px;border-radius:6px}
.foot{margin-top:10px;font-size:12px;text-align:center}
.btn{display:block;width:100%;max-width:190mm;margin:10px auto;padding:12px;font-size:16px;font-weight:700;background:#000;color:#fff;border:0;border-radius:8px;cursor:pointer}
@media print{@page{size:A4;margin:12mm}.no-print{display:none}body{background:#fff}.sheet{border:2px solid #000;margin:0;max-width:100%;padding:0}}
`;

  const callRows = calls.map((c) =>
    `<div class="call"><span class="l">${esc(c.bn_label)} <small>${esc(c.bn_desc)}</small></span><span class="n">${esc(c.display)}</span></div>`,
  ).join('\n');
  const linkRows = top5.map((l, i) =>
    `<div class="lnk"><b>${toBnDigits(i + 1)}. ${esc(l.bn_label)}</b> — <span class="d">${esc(l.display)}</span><br><small>${esc(l.bn_desc)}</small></div>`,
  ).join('\n');

  const body = `<button class="btn no-print" onclick="window.print()">🖨️ এই কাগজটি ছাপুন</button>
<div class="sheet">
<h1>দেশগড়ি — জরুরি নম্বর ও লিংক</h1>
<p class="sub">বিদেশগামী প্রবাসীদের জন্য · শেষ যাচাই: ${verified}</p>
<hr class="rule">
<div class="sec">☎️ এখনই বিপদে? কল করুন</div>
${callRows}
<div class="sec">🔎 নিজে যাচাই করুন (সরকারি সাইট)</div>
${linkRows}
<p class="tip">মনে রাখুন — বাংলাদেশ সরকারি সাইট শেষ হয় <u>.gov.bd</u> দিয়ে।<br>টাকা চাইলেই বুঝবেন ভুয়া।</p>
<p class="foot">${esc(DISCLAIMER)}<br>deshgori.com/joruri</p>
</div>`;

  return htmlDoc({
    title: 'ছাপার কাগজ — জরুরি নম্বর ও লিংক · দেশগড়ি',
    description: 'প্রবাসীদের জরুরি হটলাইন ও সরকারি যাচাই লিংকের ছাপযোগ্য এক পাতা — ফ্রিজে বা মসজিদে লাগানোর জন্য।',
    canonical: `${SITE}/joruri/print/`,
    css, body,
  });
}

// ---------- /poster — A4 QR poster for mosques/tea-stalls (T3, §6) ------------
async function renderPoster() {
  const calls = registry.links.filter((l) => l.group === 'call');
  const qrSvg = await QRCode.toString(`${SITE}/joruri/`, {
    type: 'svg', margin: 1, errorCorrectionLevel: 'M',
    color: { dark: '#124F5A', light: '#ffffff' },
  });

  const css = `
*{box-sizing:border-box}
body{margin:0;background:#eceae4;font-family:'Noto Sans Bengali','Hind Siliguri',system-ui,sans-serif;color:#124F5A}
.poster{max-width:190mm;margin:12px auto;background:#FBF8F1;border:3px solid #0E7E8A;border-radius:18px;padding:14mm;text-align:center}
.logo{width:96px;height:96px;margin:0 auto 6px}
.name{font-size:44px;font-weight:900;color:#0E7E8A;margin:0}
.tag{font-size:20px;margin:2px 0 14px;color:#124F5A}
.calls{display:grid;gap:8px;margin:10px 0 16px}
.c{display:flex;justify-content:space-between;align-items:center;background:#124F5A;color:#fff;border-radius:12px;padding:10px 16px}
.c .l{font-size:18px;font-weight:700;text-align:left}
.c .n{font-size:26px;font-weight:900}
.qrbox{background:#fff;border:2px solid #0E7E8A;border-radius:14px;padding:10px;display:inline-block}
.qrbox svg{width:180px;height:180px;display:block}
.scan{font-size:22px;font-weight:800;margin:10px 0 2px}
.url{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:18px;font-weight:700;color:#0E7E8A}
.foot{margin-top:14px;font-size:12px;color:#5B6B75}
.btn{display:block;width:100%;max-width:190mm;margin:10px auto;padding:12px;font-size:16px;font-weight:700;background:#0E7E8A;color:#fff;border:0;border-radius:8px;cursor:pointer}
@media print{@page{size:A4;margin:10mm}.no-print{display:none}body{background:#fff}.poster{margin:0;max-width:100%}}
`;

  const callRows = calls.map((c) => {
    const { href } = parseAction(c.action);
    return `<div class="c"><span class="l">${esc(c.bn_label)}</span><span class="n">${esc(c.display)}</span></div>`;
  }).join('\n');

  const body = `<button class="btn no-print" onclick="window.print()">🖨️ পোস্টার ছাপুন (A4)</button>
<div class="poster">
<img class="logo" src="/icons/icon.svg" alt="দেশগড়ি" width="96" height="96">
<h1 class="name">দেশগড়ি</h1>
<p class="tag">বিদেশ যাওয়ার আগে জেনে নিন — বিনামূল্যে</p>
<div class="calls">${callRows}</div>
<div class="qrbox">${qrSvg}</div>
<p class="scan">স্ক্যান করে সব জরুরি লিংক পান</p>
<p class="url">deshgori.com/joruri</p>
<p class="foot">${esc(DISCLAIMER)}</p>
</div>`;

  return htmlDoc({
    title: 'পোস্টার — দেশগড়ি জরুরি লিংক (QR)',
    description: 'মসজিদ, চায়ের দোকান বা ডেমো অফিসে লাগানোর জন্য দেশগড়ির QR পোস্টার — প্রবাসীদের জরুরি নম্বর ও সরকারি যাচাই লিংক।',
    canonical: `${SITE}/poster/`,
    css, body,
  });
}

// ---------- SEO plumbing (basics now; expanded in T6) ------------------------
function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

function renderSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.map((r) => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderLlms() {
  return `# দেশগড়ি (Deshgori)

> Free, open-source, Bangla-first pre-departure education for Bangladeshis going
> abroad. Independent educational project — NOT a government service, issues no
> official document. ${SITE}

## Emergency links hub
- ${SITE}/joruri/ — every official hotline and self-verification portal on one
  offline page, each shown with its official government domain.

## Verified official sources (from data/links.json, verified ${registry._meta.verified_on})
${registry.links.map((l) => `- ${l.bn_label}: ${l.display}`).join('\n')}
`;
}

// ---------- main -------------------------------------------------------------
async function main() {
  if (!fs.existsSync(OUT)) {
    console.error(`[gen-v2] OUT dir "${OUT}" missing — run \`next build\` first.`);
    process.exit(1);
  }
  const written = [];
  written.push(writeFile('joruri/index.html', renderHub()));
  written.push(writeFile('joruri/print/index.html', renderPrint()));
  written.push(writeFile('poster/index.html', await renderPoster()));

  const routes = ['/', '/joruri/', '/joruri/print/', '/poster/', '/jatra/',
    '/track/worker/', '/track/student/', '/track/tourist/'];
  written.push(writeFile('sitemap.xml', renderSitemap(routes)));
  written.push(writeFile('robots.txt', renderRobots()));
  written.push(writeFile('llms.txt', renderLlms()));

  console.log(`[gen-v2] wrote ${written.length} files into ${path.relative(ROOT, OUT)}/:`);
  for (const w of written) console.log('  •', w);
}

main();
