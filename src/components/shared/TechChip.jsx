import React from 'react';

/**
 * TechChip - Consistent technology badge pill used across all sections.
 */
const TechChip = ({ label, hoverable = true }) => (
  <span
    className={`px-2.5 py-1 rounded-md bg-[#141414] border border-white/10 font-mono text-[10px] sm:text-[10.5px] text-white/85 tracking-wider uppercase
      ${hoverable ? 'transition-colors hover:border-[#E50914]/50 hover:text-white cursor-default' : ''}`}
  >
    {label}
  </span>
);

export default TechChip;
