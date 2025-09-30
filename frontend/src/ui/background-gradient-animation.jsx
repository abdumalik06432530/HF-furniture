import React from 'react';

export function BackgroundGradientAnimation({ children, className = '' }) {
  return (
    <div className={`${className} bg-gradient-anim relative overflow-hidden`}>
      {children}
      {/* larger, softer decorative moving elements for stronger visual impact */}
      <div className="anim-first absolute -left-1/3 -top-1/4 w-[36rem] h-[36rem] bg-gradient-to-br from-[#ff9a9e] via-[#fad0c4] to-[#a18cd1] opacity-40 rounded-full filter blur-4xl pointer-events-none transform-gpu"></div>
      <div className="anim-second absolute right-0 top-1/3 w-[28rem] h-[28rem] bg-gradient-to-tr from-[#fbc2eb] via-[#a6c1ee] to-[#f6d365] opacity-30 rounded-full filter blur-3xl pointer-events-none transform-gpu"></div>
    </div>
  );
}

export default BackgroundGradientAnimation;
