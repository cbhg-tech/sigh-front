/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'on-boarding': "url('assets/onboarding.jpg')",
      },
      colors: {
        light: {
          'surface-tint': '#006C45',
          error: '#BA1A1A',
          'on-error': '#FFFFFF',
          'error-container': '#FFDAD6',
          'on-error-container': '#410002',
          warning: '#f3bf48',
          'on-warning': '#402d00',
          'warning-container': '#5c4300',
          'on-warning-container': '#ffdf9f',
          'on-tertiary-container': '#001F28',
          'on-tertiary': '#FFFFFF',
          'tertiary-container': '#B7EAFE',
          tertiary: '#326575',
          shadow: '#000000',
          outline: '#707972',
          'on-background': '#191C1A',
          background: '#FBFDF8',
          'inverse-on-surface': '#EFF1ED',
          'inverse-surface': '#2E312E',
          'on-surface-variant': '#404943',
          'on-surface': '#191C1A',
          'surface-variant': '#DCE5DC',
          surface: '#FBFDF8',
          'on-secondary-container': '#062013',
          'on-secondary': '#FFFFFF',
          'secondary-container': '#CCEAD5',
          secondary: '#4A6454',
          'inverse-primary': '#5BDE9E',
          'on-primary-container': '#002112',
          'on-primary': '#FFFFFF',
          'primary-container': '#79FBB8',
          primary: '#006C45',
          'surface-1': '#EEF6EF',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
