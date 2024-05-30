/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--primary'),
        muted: withOpacity('--muted'),
        gy: withOpacity('--color-gray'),
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        border: withOpacity('--border'),
        lighter: withOpacity('--lighter'),
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
        b: 'var(--spacing-base)',
        'b/2': 'calc(var(--spacing-base) / 2)',
        'b/3': 'calc(var(--spacing-base) / 2.67)',
        'b/4': 'calc(var(--spacing-base) / 4)',
        b2: 'calc(var(--spacing-base) * 2)',
        b3: 'calc(var(--spacing-base) * 3)',
        h: 'calc(var(--spacing-base) / 2)',
      },
      borderRadius: {
        base: 'var(--radius)',
      },
    },
  },
  plugins: [],
};

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
