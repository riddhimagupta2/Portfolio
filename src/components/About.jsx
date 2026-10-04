import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import SectionBadge from './shared/SectionBadge';
import SectionHeading from './shared/SectionHeading';
import MouseSpotlight from './shared/MouseSpotlight';
import TechChip from './shared/TechChip';

gsap.registerPlugin(ScrollTrigger);

const CARD_BASE =
  'card-spotlight group p-6 sm:p-7 rounded-2xl bg-[#0c0c0c]/90 border border-white/10 hover:border-[#E50914]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)] min-h-[330px]';

const GhostNumber = ({ number }) => (
  <span className="absolute top-4 right-5 font-display font-black text-5xl sm:text-6xl text-white/[0.04] select-none pointer-events-none group-hover:text-[#E50914]/[0.08] transition-colors">
    {number}
  </span>
);

const AmbientGlow = () => (
  <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#E50914]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E50914]/15 transition-all" />
);

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const About = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('.about-header-anim'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' }
        }
      );

      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.about-bento-grid'),
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const onMouseMove = (e) => {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', onMouseMove);
    }, section);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  const { castCard, milestonesCard, techStackCard } = portfolioData.about;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white py-24 sm:py-28 px-6 md:px-12 select-none overflow-hidden"
    >
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-[#E50914]/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#E50914]/6 rounded-full blur-[190px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10">
        <div className="about-header-anim space-y-3 text-left">
          <SectionBadge label={`${portfolioData.about.episode} | ${portfolioData.about.episodeSubtitle}`} />
          <SectionHeading
            line1={portfolioData.about.headingLine1}
            line2={portfolioData.about.headingLine2}
          />
        </div>

        <div className="about-bento-grid space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Card 01: Cast & Background */}
            <div ref={addToRefs} onMouseMove={handleMouseMove} className={CARD_BASE}>
              <MouseSpotlight />
              <GhostNumber number={castCard.number} />
              <div className="space-y-4 relative z-10">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#E50914] font-bold tracking-[0.2em] uppercase block">
                  {castCard.label}
                </span>
                <h3 className="text-[14px] sm:text-[15.5px] md:text-[16.5px] font-sans text-white/95 leading-snug">
                  <span className="text-white/60 font-light">{castCard.leadIntro} </span>
                  <span className="font-bold text-white">{castCard.leadName}</span>
                  <span className="text-white/75">, {castCard.leadDegree}</span>
                </h3>
                <p className="text-[12px] sm:text-[12.5px] text-white/60 font-light leading-relaxed">
                  {castCard.narrative}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-5 relative z-10">
                {castCard.tags.map((tag) => <TechChip key={tag} label={tag} />)}
              </div>
              <AmbientGlow />
            </div>

            {/* Card 02: Milestones */}
            <div ref={addToRefs} onMouseMove={handleMouseMove} className={CARD_BASE}>
              <MouseSpotlight />
              <GhostNumber number={milestonesCard.number} />
              <div className="space-y-4 relative z-10">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#E50914] font-bold tracking-[0.2em] uppercase block">
                  {milestonesCard.label}
                </span>
                <ul className="space-y-2.5 pt-1">
                  {milestonesCard.milestones.map((item, idx) => (
                    <li key={idx} className="flex items-start text-[12px] sm:text-[12.5px] text-white/80 leading-relaxed font-light">
                      <span className="text-[#E50914] font-bold text-xs mr-2.5 flex-shrink-0">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-5 relative z-10 font-mono text-[9.5px] sm:text-[10px] text-white/40 tracking-[0.18em] uppercase">
                {milestonesCard.footerTag}
              </div>
              <AmbientGlow />
            </div>
          </div>

          {/* Card 03: Tech Stack – full width */}
          <div ref={addToRefs} onMouseMove={handleMouseMove} className="card-spotlight group p-6 sm:p-7 rounded-2xl bg-[#0c0c0c]/90 border border-white/10 hover:border-[#E50914]/40 transition-all duration-300 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <MouseSpotlight />
            <span className="font-mono text-[10px] sm:text-[11px] text-[#E50914] font-bold tracking-[0.2em] uppercase block mb-3">
              {techStackCard.label}
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-5">
                <p className="text-white font-sans font-bold text-[15px] sm:text-[17px] md:text-[19px] leading-snug">
                  {techStackCard.headline}
                </p>
              </div>
              <div className="lg:col-span-7 flex flex-wrap items-center gap-2 relative">
                <div className="absolute -top-3 left-1/3 w-5 h-5 bg-[#E50914] rounded-full blur-md opacity-70 animate-ping pointer-events-none" />
                {techStackCard.skills.map((skill) => <TechChip key={skill} label={skill} />)}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E50914]/12 transition-all" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;