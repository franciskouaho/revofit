/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs RevoFit personnalisées
        'revo-primary': '#FFD700',
        'revo-bg': '#0A0A0A',
        'revo-surface': '#2A2A2A',
        'revo-text': '#FFFFFF',
        'revo-secondary': '#B0B0B0',
        
        // Couleurs fitness
        'fitness-cardio': '#FF6B6B',
        'fitness-strength': '#4ECDC4',
        'fitness-hiit': '#FFD93D',
        'fitness-yoga': '#B388FF',
        
        // Couleurs nutrition
        'nutrition-calories': '#FFD700',
        'nutrition-proteins': '#FF6B6B',
        'nutrition-carbs': '#4ECDC4',
        'nutrition-fats': '#FFA726',
      },
      fontFamily: {
        'poppins-bold': ['Poppins-Bold'],
        'inter-regular': ['Inter-Regular'],
        'inter-medium': ['Inter-Medium'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem',  // 352px pour bottom tabs
      }
    },
  },
  plugins: [],
}; 