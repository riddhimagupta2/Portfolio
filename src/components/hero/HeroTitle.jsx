import React from 'react';

const HeroTitle = ({ rankBadge, roleTag, titleLine1, titleLine2 }) => {
  return (
    <div className="space-y-4 text-left">
      {/* Top Role Badge Row (matches the TOP 1% pill in reference image) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {rankBadge && (
          <span className="px-2 py-0.5 rounded bg-[#E50914] text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(229,9,20,0.5)]">
            {rankBadge}
          </span>
        )}
        {roleTag && (
          <span className="font-mono text-[10.5px] sm:text-[11.5px] text-white/70 tracking-[0.16em] uppercase">
            {roleTag}
          </span>
        )}
      </div>

      {/* Main Headline (matches font-display Bebas Neue, scale, and red neon drop-shadow of reference image) */}
      <h1 className="font-display font-black leading-[0.88] tracking-tight uppercase select-none text-[clamp(44px,5.8vw,86px)]">
        <span className="block text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]">
          {titleLine1}
        </span>
        <span className="block text-[#E50914] drop-shadow-[0_0_30px_rgba(229,9,20,0.7)]">
          {titleLine2}
        </span>
      </h1>
    </div>
  );
};

export default HeroTitle;
