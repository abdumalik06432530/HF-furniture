import React from "react";

// Minimal placeholder WavyBackground to satisfy imports and render children
// Keeps same API as the more advanced version: accepts children, className, transparent
const WavyBackground = ({ children, className = "", transparent = false }) => {
	const bgStyle = transparent
		? { background: "transparent" }
		: { background: "linear-gradient(135deg, rgba(240,240,245,0.6), rgba(220,230,255,0.6))" };

	return (
		<div className={className} style={{ ...bgStyle }} aria-hidden={true}>
			{children}
		</div>
	);
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};
export default WavyBackground;
