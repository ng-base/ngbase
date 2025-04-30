/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}', './dist/mee/**/*.{html,ts,mjs}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary))',
        'primary-foreground': 'hsl(var(--color-primary-foreground))',
        secondary: 'hsl(var(--color-secondary))',
        'secondary-foreground': 'hsl(var(--color-secondary-foreground))',
        gy: 'rgba(var(--color-gray))',
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        'muted-foreground': 'hsl(var(--color-muted-foreground))',
        muted: 'hsl(var(--color-muted))',
        card: 'hsl(var(--color-card))',
        'card-foreground': 'hsl(var(--color-card-foreground))',
        popover: 'hsl(var(--color-popover))',
        'popover-foreground': 'hsl(var(--color-popover-foreground))',
        accent: 'hsl(var(--color-accent))',
        'accent-foreground': 'hsl(var(--color-accent-foreground))',
        destructive: 'hsl(var(--color-destructive))',
        'destructive-foreground': 'hsl(var(--color-destructive-foreground))',
        border: 'hsl(var(--color-border))',
        text: 'rgba(var(--color-text))',
        input: 'hsl(var(--color-input))',
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
