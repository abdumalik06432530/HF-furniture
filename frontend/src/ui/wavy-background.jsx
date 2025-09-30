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

export default WavyBackground;
