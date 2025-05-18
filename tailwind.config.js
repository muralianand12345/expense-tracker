/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Custom colors if needed
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                // Custom shadows if needed
            },
            animation: {
                // Custom animations if needed
            },
            keyframes: {
                // Custom keyframes if needed
            },
            typography: {
                // Adjust typography for dark mode
                DEFAULT: { css: {} },
                dark: { css: {} },
            },
        },
    },
    plugins: [],
}