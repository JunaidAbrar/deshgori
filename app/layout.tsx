import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './lib/i18n';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';

// Self-hosted at build time by next/font — no runtime third-party request
// (Hard Constraint 1: no third-party SDKs / calls).
const bangla = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-bangla',
});

const SITE_URL = 'https://deshgori.com';
const TITLE = 'দেশগড়ি — বিদেশ যাত্রার আগে জেনে নিন';
const DESCRIPTION =
  'Deshgori: free, open-source, Bangla-first pre-departure education for Bangladeshis going abroad. An independent educational project — not a government service.';

export const metadata: Metadata = {
  // Absolute base so canonical/OG/manifest URLs resolve to the real domain.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  manifest: '/manifest.webmanifest',
  applicationName: 'Deshgori',
  appleWebApp: { capable: true, title: 'Deshgori', statusBarStyle: 'default' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'দেশগড়ি · Deshgori',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#149EAC',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={bangla.variable}>
      <body className="min-h-screen font-bangla">
        <LanguageProvider>{children}</LanguageProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
