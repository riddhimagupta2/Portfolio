import React from 'react';

const HeroButtons = ({ onViewProjects, onContactMe }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
      {/* Primary White Button: VIEW PROJECTS */}
      <a
        href="#projects"
        onClick={onViewProjects}
        className="group inline-flex items-center justify-center gap-2 px-[18px] sm:px-[25px] py-[11px] sm:py-[13px] rounded bg-white text-black font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#E50914] hover:text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(229,9,20,0.7)]"
      >
        <span className="text-[10px]">▶</span>
        <span>VIEW PROJECTS</span>
      </a>

      {/* Secondary Dark Button: CONTACT ME */}
      <a
        href="#contact"
        onClick={onContactMe}
        className="group inline-flex items-center justify-center gap-2 px-[18px] sm:px-[25px] py-[11px] sm:py-[13px] rounded bg-[#111111]/80 hover:bg-[#1c1c1c] text-white font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.1em] uppercase transition-all duration-300 border border-white/20 hover:border-white/50 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        <span className="text-[#E50914] text-xs">◉</span>
        <span>CONTACT ME</span>
      </a>
    </div>
  );
};

export default HeroButtons;
