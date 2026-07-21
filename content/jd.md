# যাত্রার দিন — shared module (all tracks)

Terminal module for every track (worker / student / tourist). SCRIPT-LOCKED from
`01-CLAUDE-fabble-research.md` (Part B). Protective-first: airport touts and fake
"government fees", what no one may lawfully take from you, never carrying others'
packages, reading your ticket, and transit navigation. Verified in Part A: the
BMET card is required at airport immigration for workers; there are no cash
"fees" at immigration.

```json
{
  "id": "jd",
  "module": "যাত্রার দিন",
  "title": { "bn": "যাত্রার দিন", "en": "Day of travel" },
  "steps": [
    {
      "type": "card",
      "variant": "teach",
      "id": "jdc01",
      "icon": "💸",
      "bn": "এয়ারপোর্টে 'সরকারি ফি' বলে টাকা চাওয়া লোকটা সরকারি নয়। ইমিগ্রেশনে কোনো নগদ ফি নেই।",
      "en": "The man demanding a 'government fee' at the airport isn't the government. Immigration has no cash fees."
    },
    {
      "type": "card",
      "variant": "teach",
      "id": "jdc02",
      "icon": "🛂",
      "bn": "ইমিগ্রেশনে লাগবে: পাসপোর্ট, ভিসা, টিকিট — আর কর্মীদের বিএমইটি কার্ড। ব্যস।",
      "en": "Immigration needs passport, visa, ticket — and the BMET card for workers. That's all."
    },
    {
      "type": "card",
      "variant": "teach",
      "id": "jdc03",
      "icon": "🔒",
      "bn": "কেউ আপনার পাসপোর্ট বা টাকা 'জমা' নিতে পারে না। ইমিগ্রেশন শুধু দেখে, ফেরত দেয়।",
      "en": "Nobody may 'hold' your passport or money. Immigration only checks and returns."
    },
    {
      "type": "card",
      "variant": "teach",
      "id": "jdc04",
      "icon": "📦",
      "bn": "অন্যের দেওয়া কোনো প্যাকেট ব্যাগে নেবেন না। ভেতরে কী আছে না জানলেও দায় আপনার — জেল পর্যন্ত হয়।",
      "en": "Never carry anyone else's package. You bear the liability even unknowingly — it can mean prison."
    },
    {
      "type": "card",
      "variant": "teach",
      "id": "jdc05",
      "icon": "🎫",
      "bn": "টিকিটে তিনটা জিনিস মেলান: নাম (পাসপোর্টের বানানে), তারিখ, ফ্লাইট নম্বর।",
      "en": "Match three things on the ticket: name (passport spelling), date, flight number."
    },
    {
      "type": "card",
      "variant": "teach",
      "id": "jdc06",
      "icon": "🔀",
      "bn": "ট্রানজিটে হারিয়ে গেলে: 'Transfer' সাইন ধরে হাঁটুন, নিজের এয়ারলাইনের ডেস্ক খুঁজুন। বোর্ডিং পাস কাউকে দেবেন না।",
      "en": "Lost in transit? Follow 'Transfer' signs, find your airline's desk. Hand your boarding pass to no one."
    },
    {
      "type": "quiz",
      "id": "jdc07",
      "icon": "❓",
      "question": { "bn": "অচেনা লোক বলল, 'দ্রুত পার করে দেব, ফি ২ হাজার।' কী করবেন?", "en": "A stranger says 'I'll fast-track you, fee 2,000.' What do you do?" },
      "options": [
        { "bn": "দেব না — ইমিগ্রেশনের কোনো নগদ ফি নেই", "en": "Refuse — immigration has no cash fee", "correct": true },
        { "bn": "দিয়ে দেব, ঝামেলা কমুক", "en": "Pay to avoid hassle", "correct": false },
        { "bn": "দরদাম করব", "en": "Haggle over the price", "correct": false }
      ],
      "explain": { "bn": "লাইনটা ধোঁকা নয়, 'শর্টকাট'টা ধোঁকা।", "en": "The queue isn't the scam — the 'shortcut' is." }
    },
    {
      "type": "card",
      "variant": "recap",
      "id": "jdc08",
      "icon": "✅",
      "bn": "কাগজ নিজের হাতে, প্যাকেট কারও না, ফি কাউকে নয়।",
      "en": "Papers in your own hand, packages from no one, fees to no one."
    }
  ]
}
```
