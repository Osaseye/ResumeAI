/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            primary: "#111827", // Almost black for primary actions
            secondary: "#4B5563", // Gray for secondary text
            accent: "#3B82F6", // Subtle blue accent
            "background-light": "#ffffff",
            "background-soft": "#f9fafb",
            "surface-light": "#FFFFFF",
            "text-light": "#111827",
            "text-muted": "#6B7280",
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Playfair Display', 'serif'],
        },
        borderRadius: {
            'xl': '1rem',
            '2xl': '1.5rem',
            '3xl': '2rem',
        },
        boxShadow: {
            'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
            'glow': '0 0 20px rgba(59, 130, 246, 0.15)'
        },
        animation: {
            'float': 'float 6s ease-in-out infinite',
            'marquee': 'marquee 40s linear infinite',
            'scan': 'scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        },
        keyframes: {
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            },
            marquee: {
                '0%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(-50%)' }
            },
            scan: {
                '0%': { top: '0%', opacity: '0' },
                '10%': { opacity: '1' },
                '90%': { opacity: '1' },
                '100%': { top: '100%', opacity: '0' }
            }
        }
      },
    },
    plugins: [],
  }

