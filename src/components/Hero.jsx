import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { portfolioData } from '../data/portfolioData';

// Safely load local developer photo (strictly picture.png, never jpeg), fallback to placeholder avatar
const localPng = import.meta.glob('../assets/Portfolio/picture.png', { eager: true, query: '?url', import: 'default' });
const pictureImg = localPng['../assets/Portfolio/picture.png'] || '/avatar.svg';

// Modular Sub-Components
import SeriesBadge from './hero/SeriesBadge';
import HeroTitle from './hero/HeroTitle';
import TechStack from './hero/TechStack';
import ProfileCard from './hero/ProfileCard';
import AchievementCard from './hero/AchievementCard';
import HeroButtons from './hero/HeroButtons';

const Hero = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const awardCardRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.fromTo(
          content.querySelectorAll('.hero-anim-item'),
          { y: 30, opacity: 0, filter: 'blur(5px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 }
        )
          .fromTo(
            cardRef.current,
            { scale: 0.88, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' },
            '-=0.7'
          )
          .fromTo(
            awardCardRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
            '-=0.4'
          );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 80;
      const elPos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: elPos, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] text-white flex flex-col justify-between pt-28 pb-8 px-6 md:px-12 select-none overflow-hidden"
    >
      {/* 1. CONTINUOUS BACKGROUND PASSING MARQUEE ("in bg riddhima should pass") */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none select-none z-0 opacity-80">
        <div className="animate-marquee font-display font-black text-[22vw] tracking-tighter uppercase text-[#E50914]/[0.06] whitespace-nowrap leading-none flex items-center">
          <span className="mx-8">{portfolioData.personal.name || 'DEVELOPER'}</span>
          <span className="mx-8 text-white/[0.03]">•</span>
          <span className="mx-8">DEVELOPER</span>
          <span className="mx-8 text-white/[0.03]">•</span>
          <span className="mx-8">{portfolioData.personal.name || 'DEVELOPER'}</span>
          <span className="mx-8 text-white/[0.03]">•</span>
          <span className="mx-8">DEVELOPER</span>
          <span className="mx-8 text-white/[0.03]">•</span>
          <span className="mx-8">{portfolioData.personal.name || 'DEVELOPER'}</span>
          <span className="mx-8 text-white/[0.03]">•</span>
          <span className="mx-8">DEVELOPER</span>
          <span className="mx-8 text-white/[0.03]">•</span>
        </div>
      </div>

      {/* 2. ATMOSPHERIC RED STAGE LIGHTING */}
      <div className="absolute top-1/3 left-1/3 w-[650px] h-[650px] bg-[#E50914]/14 rounded-full blur-[190px] pointer-events-none animate-red-pulse"></div>
      <div className="absolute bottom-12 right-12 w-[550px] h-[550px] bg-[#990000]/15 rounded-full blur-[170px] pointer-events-none"></div>

      {/* 3. MAIN HERO VIEWPORT CONTAINER */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto w-full my-auto flex flex-col justify-center space-y-8 lg:space-y-10"
      >
        {/* TOP HERO SERIES BADGE (DEVELOPER SERIES in red text & rectangle rounded box) */}
        <div className="hero-anim-item w-full pt-1">
          <SeriesBadge
            seriesPill={portfolioData.hero.seriesPill}
            sideBadges={portfolioData.hero.sideBadges}
          />
        </div>

        {/* HERO COMPOSITION: 3-COLUMN LAYOUT (LEFT: INFO, CENTER: 360° IMAGE, RIGHT: CORE STACK CARD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT SIDE: MAIN HEADLINE, STACK, DESCRIPTION & BUTTONS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col space-y-4 text-left order-1 justify-center">
            
            {/* NAME & ROLE BADGE */}
            <div className="hero-anim-item">
              <HeroTitle
                rankBadge={portfolioData.personal.rankBadge}
                roleTag={portfolioData.personal.roleTag}
                titleLine1={portfolioData.personal.titleLine1}
                titleLine2={portfolioData.personal.titleLine2}
              />
            </div>

            {/* TECH STACK LINE WITH FLUTTER & DJANGO REST API IN RED (REDUCED SIZE) */}
            <div className="hero-anim-item pt-0.5">
              <TechStack
                uptimePill="99.9% Uptime"
                stackLine={portfolioData.hero.techStackLine}
              />
            </div>

            {/* DESCRIPTION (REDUCED SIZE) */}
            <div className="hero-anim-item">
              <p className="font-sans font-light text-[12.5px] sm:text-[13.5px] text-white/70 max-w-[460px] leading-relaxed">
                {portfolioData.hero.description}
              </p>
            </div>

            {/* ACTION BUTTONS (VIEW PROJECTS & CONTACT ME) */}
            <div className="hero-anim-item pt-1">
              <HeroButtons
                onViewProjects={(e) => scrollToSection(e, 'projects')}
                onContactMe={(e) => scrollToSection(e, 'contact')}
              />
            </div>

          </div>

          {/* CENTER: PROFILE CARD MOVING 360 DEGREES (4 COLS - flex justify-center) */}
          <div className="lg:col-span-4 flex justify-center items-center relative order-2 my-4 lg:my-0">
            <ProfileCard
              imageSrc={pictureImg}
              altText={portfolioData.personal.profilePhotoAlt}
              season={portfolioData.personal.season}
              cardRef={cardRef}
            />
          </div>

          {/* RIGHT: CORE STACK CARD IN RIGHT (3 COLS - flex justify-center lg:justify-end) */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end items-center order-3 mt-4 lg:mt-0">
            <AchievementCard
              cardRef={awardCardRef}
              label={portfolioData.hero.awardsCard.label}
              text={portfolioData.hero.awardsCard.text}
              achievement={portfolioData.hero.awardsCard.achievement}
            />
          </div>

        </div>

        {/* BOTTOM HERO METADATA TICKER */}
        <div className="hero-anim-item flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t border-white/10 font-mono text-xs text-white/40 tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2">
            <span className="text-[#E50914] font-bold">●</span>
            <span>{portfolioData.personal.tickerLeft}</span>
          </div>
          <div>[ {portfolioData.personal.portfolioVersion} ]</div>
        </div>

      </div>
    </section>
  );
};

export default Hero;