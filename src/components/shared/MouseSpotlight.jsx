import React from 'react';

/**
 * MouseSpotlight - Radial red glow that follows mouse within a card.
 * Parent must set --mouse-x and --mouse-y via onMouseMove.
 */
const MouseSpotlight = ({ radius = 350, intensity = 0.18, className = '' }) => (
  <div
    className={`pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit] ${className}`}
    style={{
      background: `radial-gradient(${radius}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(229,9,20,${intensity}), transparent 70%)`
    }}
  />
);

export default MouseSpotlight;
