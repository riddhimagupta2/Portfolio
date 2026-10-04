import React from 'react';

const SeriesBadge = ({ seriesPill = "DEVELOPER SERIES | SEASON 2024-2026", sideBadges = [] }) => {
  // Parse seriesPill to display "DEVELOPER SERIES" in red and the season in white
  const parts = seriesPill.split('|');
  const mainTitle = parts[0]?.trim() || "DEVELOPER SERIES";
  const seasonText = parts[1]?.trim() || "SEASON 2024-2026";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Left Rectangle Rounded Box with Red Text for Developer Series */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#111111]/90 border border-[#E50914]/50 shadow-[0_0_15px_rgba(229,9,20,0.25)]">
        <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-ping"></span>
        <span className="font-mono text-[11px] sm:text-[12px] tracking-[0.14em] uppercase flex items-center gap-2">
          <span className="text-[#E50914] font-bold drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">
            {mainTitle}
          </span>
          {seasonText && (
            <>
              <span className="text-white/30 font-light">|</span>
              <span className="text-white/90 font-medium">{seasonText}</span>
            </>
          )}
        </span>
      </div>

      {/* Right Outlined Badges: FLUTTER DEVELOPER & GSSOC 2026 CONTRIBUTOR */}
      {sideBadges.length > 0 && (
        <div className="hidden sm:flex items-center gap-2.5">
          {sideBadges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 rounded bg-[#0d0d0d]/80 border border-white/15 text-[10px] font-mono tracking-widest text-white/75 uppercase"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeriesBadge;
