import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import SectionBadge from './shared/SectionBadge';
import SectionHeading from './shared/SectionHeading';
import MouseSpotlight from './shared/MouseSpotlight';
import TechChip from './shared/TechChip';
import RedAccentLine from './shared/RedAccentLine';

gsap.registerPlugin(ScrollTrigger);

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const Experience = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  const experienceList = portfolioData.experience.list;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const items = itemRefs.current.filter(Boolean);
    if (!section || !items.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('.exp-header-anim'),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );

      if (prefersReducedMotion) return;

      if (track) {
        gsap.fromTo(
          track,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 65%', end: 'bottom 85%', scrub: 0.5 }
          }
        );
      }

      items.forEach((item, index) => {
        const initialX = index % 2 === 0 ? -60 : 60;
        gsap.fromTo(
          item,
          { x: initialX, opacity: 0, scale: 0.92 },
          {
            x: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white py-28 sm:py-32 px-4 sm:px-6 lg:px-8 select-none border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-1/4 -left-10 text-[20vw] font-display font-black text-white/[0.025] pointer-events-none tracking-tighter leading-none select-none z-0">
        EPISODE 05
      </div>
      <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-[#E50914]/8 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16">
        <div className="exp-header-anim space-y-3 max-w-3xl">
          <SectionBadge label={portfolioData.experience.episode} />
          <SectionHeading
            line1={portfolioData.experience.headingLine1}
            line2={portfolioData.experience.headingLine2}
            subtitle={portfolioData.experience.subtitle}
            maxWidth="max-w-2xl"
          />
        </div>

        <div className="relative w-full pt-8 pb-12">
          {/* Vertical glowing timeline track */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/10">
            <div
              ref={trackRef}
              className="w-full h-full bg-gradient-to-b from-[#E50914] via-[#E50914] to-transparent shadow-[0_0_12px_#E50914]"
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {experienceList.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.role + index}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-8 z-20 flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-[#E50914] shadow-[0_0_14px_#E50914] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                    <span className="absolute w-8 h-8 rounded-full border border-[#E50914]/40 animate-ping pointer-events-none" />
                  </div>

                  <div className="hidden md:block w-1/2" />

                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div
                      onMouseMove={handleMouseMove}
                      className="group relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#0c0c0c] border border-white/10 hover:border-[#E50914] transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_0_45px_rgba(229,9,20,0.5),0_0_80px_rgba(229,9,20,0.2)] hover:-translate-y-1.5 hover:scale-[1.015] overflow-hidden cursor-default"
                    >
                      <MouseSpotlight />

                      <div className="space-y-4 relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#E50914] tracking-[0.18em] uppercase">
                            {item.period}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-[#160607] border border-[#E50914]/40 text-[#E50914] font-mono text-[10px] font-bold tracking-widest uppercase">
                            {item.location}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight">
                            {item.role}
                          </h3>
                          <p className="font-mono text-xs font-bold text-white/50 tracking-wider uppercase">
                            {item.company}
                          </p>
                        </div>

                        <p className="text-xs sm:text-[13px] text-white/70 font-light leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          {item.technologies.map((tech) => (
                            <TechChip key={tech} label={tech} />
                          ))}
                        </div>
                      </div>

                      <RedAccentLine />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
