import React from 'react';

/**
 * RedAccentLine - Bottom red laser accent line placed inside cards.
 * Add `relative overflow-hidden` to the parent card.
 */
const RedAccentLine = ({ groupHover = true }) => (
  <div
    className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${
      groupHover
        ? 'via-[#E50914]/30 to-transparent group-hover:via-[#E50914] transition-all duration-500'
        : 'via-[#E50914] to-transparent'
    }`}
  />
);

export default RedAccentLine;
