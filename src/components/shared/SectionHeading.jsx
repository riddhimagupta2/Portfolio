import React from 'react';

const SectionHeading = ({ line1, line2, line3, subtitle, maxWidth = 'max-w-3xl' }) => (
  <div className={`space-y-3 ${maxWidth}`}>
    <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase">
      {line1 && <span className="block text-white">{line1}</span>}
      {line2 && (
        <span className={`block ${line3 ? 'text-white/90' : 'text-[#E50914] drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]'}`}>
          {line2}
        </span>
      )}
      {line3 && (
        <span className="block text-[#E50914] drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]">
          {line3}
        </span>
      )}
    </h2>
    {subtitle && (
      <p className="text-white/70 font-light text-xs sm:text-base">{subtitle}</p>
    )}
  </div>
);

export default SectionHeading;
