import type { Config } from 'tailwindcss';

// Light, trustworthy identity — soft sky-blue/teal on a warm off-white.
// Deliberately NOT government/form-like: no navy, no seals, no hard borders.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white surfaces
        cream: {
          DEFAULT: '#FBF8F1',
          card: '#FFFFFF',
          soft: '#F3EFE6',
        },
        // Sky-blue / teal brand
        teal: {
          50: '#EBFAFB',
          100: '#D2F3F5',
          200: '#A7E7EC',
          300: '#6FD5DD',
          400: '#33BCC8',
          500: '#149EAC',
          600: '#0E7E8A',
          700: '#0F6370',
          800: '#124F5A',
          900: '#123F49',
        },
        sky: {
          400: '#5BB8F0',
          500: '#2F9BE0',
          600: '#1E7FC2',
        },
        ink: '#1F2A33',
        muted: '#5B6B75',
      },
      fontFamily: {
        bangla: ['var(--font-bangla)', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(18, 79, 90, 0.18)',
        card: '0 2px 14px -6px rgba(18, 79, 90, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
