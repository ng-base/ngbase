/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}', './dist/mee/**/*.{html,ts,mjs}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--color-primary))',
        muted: 'rgba(var(--color-muted))',
        gy: 'rgba(var(--color-gray))',
        background: 'rgba(var(--color-background))',
        foreground: 'rgba(var(--color-foreground))',
        'muted-background': 'rgba(var(--color-muted-background))',
        border: 'rgba(var(--color-border))',
        text: 'rgba(var(--color-text))',
        input: 'rgba(var(--color-input))',
      },
      fontFamily: {
        body: ['Inter'],
        code: ['Geist Mono'],
        'dm-mono': [`"DM Mono", monospace`],
      },
      borderWidth: {
        'b0.5': 'calc(var(--spacing-base) * 0.5)',
      },
      zIndex: {
        p: 599,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
