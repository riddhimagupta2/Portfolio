import React from 'react';
import MouseSpotlight from './shared/MouseSpotlight';
import RedAccentLine from './shared/RedAccentLine';
import TechChip from './shared/TechChip';

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const SkillCard = ({ item, isActive = false }) => (
  <div
    onMouseMove={handleMouseMove}
    className={`card-spotlight group relative p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border flex flex-col justify-between overflow-hidden transition-all duration-300 select-none w-full h-full min-h-[380px] sm:min-h-[410px] ${
      isActive
        ? 'border-[#E50914]/75 shadow-[0_20px_50px_rgba(229,9,20,0.35)]'
        : 'border-white/12 hover:border-[#E50914]/40 shadow-[0_20px_45px_rgba(0,0,0,0.85)]'
    }`}
  >
    <MouseSpotlight radius={320} intensity={0.25} />
    <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${isActive ? 'bg-[#E50914]/30' : 'bg-[#E50914]/10 group-hover:bg-[#E50914]/20'}`} />

    <div className="space-y-5 relative z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#160607] border border-[#E50914]/50 text-[#E50914] font-mono text-[10.5px] font-bold tracking-[0.16em] uppercase">
          {item.tag}
        </div>
        <span className="font-mono text-xs font-semibold text-white/40 tracking-[0.2em]">
          [ {item.index} ]
        </span>
      </div>

      <h3 className="font-display text-2xl sm:text-3xl md:text-[32px] text-white tracking-wide uppercase leading-tight pt-1">
        {item.title}
      </h3>

      <p className="text-xs sm:text-[13px] text-white/70 font-light leading-relaxed">
        {item.desc}
      </p>
    </div>

    <div className="pt-4 border-t border-white/10 mt-4 relative z-10">
      <div className="flex flex-wrap items-center gap-2">
        {item.skills.map((skill) => (
          <TechChip key={skill} label={skill} />
        ))}
      </div>
    </div>

    <div className={`absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#E50914] transition-all duration-300 ${isActive ? 'opacity-100 scale-125 shadow-[0_0_8px_#E50914]' : 'opacity-40 group-hover:opacity-100'}`} />
    <RedAccentLine />
  </div>
);

export default SkillCard;
