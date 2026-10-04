import React from 'react';

const SectionBadge = ({ label }) => (
  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#111111] border border-[#E50914]/40 shadow-[0_0_10px_rgba(229,9,20,0.15)]">
    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
    <span className="font-mono text-[10px] sm:text-[10.5px] text-[#E50914] font-bold tracking-[0.18em] uppercase">
      {label}
    </span>
  </div>
);

export default SectionBadge;
