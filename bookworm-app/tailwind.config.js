/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // IBM Carbon is square: every radius utility resolves to 0.
    // `full` is kept only for the allowed circles (cart badge, author avatar, success check).
    borderRadius: {
      none: '0',
      sm: '0',
      DEFAULT: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '9999px',
    },
    extend: {
      colors: {
        // Carbon g100 tokens (see architecture.md section 4)
        surface: {
          DEFAULT: '#161616', // $background
          raised: '#262626', // $layer-01
          overlay: '#393939', // $layer-02
        },
        accent: {
          blue: '#0f62fe', // $interactive-01
          'blue-hover': '#0353e9', // $hover-primary
        },
        link: '#78a9ff', // $link-primary (g100)
        muted: '#c6c6c6', // $text-secondary
        helper: '#8d8d8d', // $text-helper
        border: '#393939', // $border-subtle
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
