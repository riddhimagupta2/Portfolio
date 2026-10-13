import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import SectionBadge from './shared/SectionBadge';
import MouseSpotlight from './shared/MouseSpotlight';
import TechChip from './shared/TechChip';
import RedAccentLine from './shared/RedAccentLine';

gsap.registerPlugin(ScrollTrigger);

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const Expertise = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const capabilities = portfolioData.expertise.capabilities;

  return (
    <section
      id="expertise"
      ref={containerRef}
      className="relative w-full bg-[#050505] text-white pt-20 sm:pt-24 pb-24 px-4 sm:px-6 lg:px-8 select-none border-t border-white/5 overflow-visible"
    >
      <div className="absolute top-1/4 -left-10 text-[18vw] font-display font-black text-white/[0.02] pointer-events-none tracking-tighter leading-none select-none z-0">
        EPISODE 02
      </div>
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#E50914]/8 rounded-full blur-[190px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-3 text-left pb-8 mb-10 sm:mb-12 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionBadge label={portfolioData.expertise.episode} />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[0.92] tracking-tight uppercase">
              <span className="block text-white">{portfolioData.expertise.headingWhite}</span>
              <span className="block text-[#E50914] drop-shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                {portfolioData.expertise.headingRed}
              </span>
            </h2>
            <p className="text-white/60 font-light text-xs sm:text-[13px] max-w-md md:text-right leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-[#E50914] pl-3 md:pl-0 md:pr-3">
              &ldquo;{portfolioData.expertise.subtitle}&rdquo;
            </p>
          </div>
        </div>

        <div className="relative w-full space-y-6 sm:space-y-8">
          {capabilities.map((item, index) => (
            <div
              key={item.number}
              ref={(el) => { cardRefs.current[index] = el; }}
              onMouseMove={handleMouseMove}
              className={`group relative w-full p-6 sm:p-8 md:p-9 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${item.gradient} border border-white/12 hover:border-[#E50914]/50 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_50px_rgba(229,9,20,0.25)] hover:-translate-y-1 backdrop-blur-xl flex flex-col justify-between overflow-hidden cursor-default`}
            >
              <MouseSpotlight />

              <div className="flex items-center justify-between pb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]" />
                  <span className="font-mono text-[10px] sm:text-[11px] text-[#E50914] font-bold tracking-[0.2em] uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black text-white/20 group-hover:text-white/40 transition-colors">
                  {item.number}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4 sm:py-5 items-center relative z-10">
                <div className="md:col-span-5">
                  <h3 className="font-display text-2xl sm:text-3xl md:text-[34px] text-white tracking-wide uppercase leading-tight">
                    {item.title}
                  </h3>
                </div>
                <div className="md:col-span-7 space-y-4">
                  <p className="text-white/80 font-light text-xs sm:text-[13.5px] leading-relaxed">
                    {item.text}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.tech.map((t) => <TechChip key={t} label={t} />)}
                  </div>
                </div>
              </div>

              <RedAccentLine />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;