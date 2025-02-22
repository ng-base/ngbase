/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}', './dist/mee/**/*.{html,ts,mjs}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        muted: 'rgb(var(--color-muted))',
        gy: 'rgb(var(--color-gray))',
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        'muted-background': 'rgb(var(--color-muted-background))',
        border: 'rgb(var(--color-border))',
        text: 'rgb(var(--color-text))',
        input: 'rgb(var(--color-input))',
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
