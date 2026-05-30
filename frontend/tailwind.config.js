/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        // Warm ivory / cream backgrounds
        cream: {
          50:  '#FFFDFA',
          100: '#FCFAF5',
          200: '#F7F1E7',
          300: '#F0E7D7',
          400: '#E7DAC4'
        },
        // Champagne gold — primary accent
        gold: {
          50:  '#FBF4E2',
          100: '#F4E6C3',
          200: '#E9D199',
          300: '#DDBA6E',
          400: '#CDA24B',
          500: '#BB8E3C',
          600: '#9A722E',
          700: '#6E5121'
        },
        // Eucalyptus / sage — secondary accent
        sage: {
          50:  '#F1F4ED',
          100: '#DEE6D4',
          200: '#C2D0B1',
          300: '#A0B389',
          400: '#7E9367',
          500: '#647656',
          600: '#4C5B42',
          700: '#363F30'
        },
        // Soft blush — tertiary warm tone
        blush: {
          50:  '#FBF1EE',
          100: '#F4DED7',
          200: '#E7C2B6',
          300: '#D8A593',
          400: '#C58772'
        },
        // Lake teal — subtle nod to the venue
        lake: {
          50:  '#EAF2F3',
          100: '#C9DEE1',
          200: '#9CC1C7',
          300: '#6B9CA6',
          400: '#4B7E89',
          500: '#3A646E'
        },
        // Ink — text tones
        ink: {
          900: '#241F19',
          800: '#332C24',
          700: '#4A4239',
          600: '#6A6155',
          500: '#8A8175',
          400: '#A9A092'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive']
      },
      letterSpacing: {
        widest2: '0.34em',
        widest3: '0.5em'
      },
      backgroundImage: {
        'gold-line':
          'linear-gradient(90deg, rgba(205,162,75,0) 0%, rgba(205,162,75,0.85) 50%, rgba(205,162,75,0) 100%)',
        'gold-grad':
          'linear-gradient(120deg, #BB8E3C 0%, #E9D199 45%, #BB8E3C 100%)',
        'cream-fade':
          'linear-gradient(180deg, #FFFDFA 0%, #F7F1E7 100%)',
        'soft-radial':
          'radial-gradient(60% 50% at 50% 0%, rgba(205,162,75,0.12) 0%, rgba(255,253,250,0) 70%)'
      },
      boxShadow: {
        'soft': '0 18px 50px -24px rgba(94, 75, 35, 0.28)',
        'card': '0 30px 70px -40px rgba(60, 47, 22, 0.45)',
        'glow-gold': '0 0 0 1px rgba(205,162,75,0.25), 0 20px 50px -20px rgba(205,162,75,0.45)',
        'lift': '0 40px 90px -50px rgba(40, 30, 12, 0.5)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-14px)' }
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'draw-ring': {
          '0%':   { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' }
        },
        'ken-burns': {
          '0%':   { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.12) translate(-1.5%, -1.5%)' }
        }
      },
      animation: {
        floaty: 'floaty 9s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'spin-slow': 'spin-slow 24s linear infinite',
        'ken-burns': 'ken-burns 18s ease-out forwards'
      }
    }
  },
  plugins: []
};
