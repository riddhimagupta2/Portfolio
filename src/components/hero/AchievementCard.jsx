import React from 'react';

const AchievementCard = ({ label = "CORE STACK & AWARDS", text, achievement, cardRef }) => {
  return (
    <div
      ref={cardRef}
      className="hero-award-card z-30 p-4 sm:p-5 bg-black/85 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.95)] w-[240px] sm:w-[260px] transition-all duration-300 hover:border-[#E50914]/60 group select-none relative overflow-hidden"
    >
      {/* Red Ambient Beacon in top-right corner matching reference image */}
      <div className="absolute top-2 right-2 w-7 h-7 bg-[#E50914]/20 rounded-full blur-md group-hover:bg-[#E50914]/40 transition-colors pointer-events-none"></div>

      <div className="space-y-2">
        <h3 className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-[0.18em] text-[#E50914] font-bold">
          {label}
        </h3>
        <p className="text-[11px] sm:text-[11.5px] text-white/75 leading-relaxed font-light">
          {text}
        </p>
        {achievement && (
          <div className="pt-2 border-t border-white/10 text-[10px] sm:text-[10.5px] font-mono text-white/90 font-medium">
            <span className="text-[#E50914] mr-1.5">●</span>
            {achievement}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
