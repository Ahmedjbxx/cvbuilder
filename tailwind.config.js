/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Monaco', 'monospace'],
      },
      width: {
        'a4': '816px',
      },
      height: {
        'a4': '1056px',
      },
      maxWidth: {
        'a4': '816px',
      },
      maxHeight: {
        'a4': '1056px',
      },
      spacing: {
        'a4-margin': '48px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}; 