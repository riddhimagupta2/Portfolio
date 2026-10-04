import React from 'react';
import MouseSpotlight from './shared/MouseSpotlight';
import RedAccentLine from './shared/RedAccentLine';
import TechChip from './shared/TechChip';

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const ProjectCard = ({ project }) => (
  <div
    onMouseMove={handleMouseMove}
    className="group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0c0c0c] border border-white/10 hover:border-[#E50914] transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_0_45px_rgba(229,9,20,0.6),0_0_80px_rgba(229,9,20,0.25)] hover:-translate-y-1.5 hover:scale-[1.02] hover:brightness-110 flex flex-col justify-between overflow-hidden cursor-pointer w-full h-full min-h-[300px] sm:min-h-[320px] z-10 hover:z-30 select-none"
  >
    <MouseSpotlight radius={340} intensity={0.28} />
    <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#E50914]/0 group-hover:bg-[#E50914]/25 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />

    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#160607] border border-[#E50914]/50 group-hover:border-[#E50914] text-[#E50914] font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition-colors">
          {project.episode}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#E50914] tracking-wider group-hover:drop-shadow-[0_0_8px_#E50914]">
            {project.match}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 group-hover:bg-white/20 border border-white/20 text-[9.5px] font-mono font-bold text-white/90">
            {project.quality}
          </span>
        </div>
      </div>

      <div className="font-mono text-[10.5px] font-bold text-white/50 group-hover:text-white/80 tracking-[0.18em] uppercase transition-colors">
        {project.category}
      </div>

      <h3 className="font-display text-xl sm:text-2xl text-white tracking-wide uppercase leading-tight group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.7)] transition-all">
        {project.title}
      </h3>

      <p className="text-xs sm:text-[12.5px] text-white/70 group-hover:text-white/90 font-light leading-relaxed line-clamp-3 transition-colors">
        {project.description}
      </p>
    </div>

    <div className="pt-3 mt-3 relative z-10 space-y-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <TechChip key={tag} label={tag} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white/70 hover:text-[#E50914] tracking-widest uppercase transition-colors"
        >
          CODE ↗
        </a>
        <a
          href={project.liveUrl}
          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] group-hover:bg-[#E50914] group-hover:text-white font-mono text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_10px_rgba(229,9,20,0.2)] group-hover:shadow-[0_0_15px_#E50914]"
        >
          LIVE DEMO
        </a>
      </div>
    </div>

    <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#E50914] opacity-50 group-hover:opacity-100 group-hover:scale-150 group-hover:shadow-[0_0_10px_#E50914] transition-all duration-300" />
    <RedAccentLine />
  </div>
);

export default ProjectCard;
