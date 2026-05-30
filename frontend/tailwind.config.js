/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070A',
          900: '#0A0D12',
          800: '#11151C',
          700: '#1A2030',
          500: '#2A3142'
        },
        gold: {
          50:  '#FBF6E9',
          100: '#F4E9C7',
          200: '#E9D58D',
          300: '#DEC062',
          400: '#CDA64A',
          500: '#B68A36',
          600: '#8E6826',
          700: '#5E4317'
        },
        lake: {
          50:  '#E8F4F8',
          100: '#BFE0EA',
          200: '#86C2D3',
          300: '#4F9FB7',
          400: '#2C7C95',
          500: '#1A5C73',
          600: '#0E3F52',
          700: '#062734'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        widest2: '0.32em'
      },
      backgroundImage: {
        'lux-radial':
          'radial-gradient(60% 50% at 50% 0%, rgba(205,166,74,0.18) 0%, rgba(10,13,18,0) 60%)',
        'lux-vignette':
          'radial-gradient(120% 90% at 50% 60%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)',
        'gold-line':
          'linear-gradient(90deg, rgba(205,166,74,0) 0%, rgba(205,166,74,0.9) 50%, rgba(205,166,74,0) 100%)'
      },
      boxShadow: {
        'glow-gold': '0 0 40px -10px rgba(205,166,74,0.45)',
        'glass': '0 30px 80px -30px rgba(0,0,0,0.6)'
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
        ripple: {
          '0%':   { transform: 'scale(0.6)', opacity: '.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' }
        }
      },
      animation: {
        floaty: 'floaty 9s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        ripple:  'ripple 4s ease-out infinite'
      }
    }
  },
  plugins: []
};
