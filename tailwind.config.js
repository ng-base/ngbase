/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}', './dist/mee/**/*.{html,ts,mjs}'],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--primary'),
        muted: withOpacity('--muted'),
        gy: withOpacity('--color-gray'),
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        'muted-background': withOpacity('--muted-background'),
        border: withOpacity('--border'),
        text: withOpacity('--text'),
        input: withOpacity('--input'),
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        },
      },
      fontFamily: {
        body: ['Nunito'],
      },
      spacing: {
        'b0.5': 'calc(var(--spacing-base) * 0.5)',
        b: 'var(--spacing-base)',
        'b1.5': 'calc(var(--spacing-base) * 1.5)',
        b2: 'calc(var(--spacing-base) * 2)',
        b3: 'calc(var(--spacing-base) * 3)',
        b4: 'calc(var(--spacing-base) * 4)',
        b5: 'calc(var(--spacing-base) * 5)',
        b6: 'calc(var(--spacing-base) * 6)',
        b7: 'calc(var(--spacing-base) * 7)',
        b8: 'calc(var(--spacing-base) * 8)',
        b9: 'calc(var(--spacing-base) * 9)',
        b10: 'calc(var(--spacing-base) * 10)',
        b11: 'calc(var(--spacing-base) * 11)',
      },
      borderRadius: {
        base: 'var(--radius)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
