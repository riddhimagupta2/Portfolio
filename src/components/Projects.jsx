import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import ProjectCard from './ProjectCard';
import SectionBadge from './shared/SectionBadge';
import SectionHeading from './shared/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const archiveSlotRef = useRef(null);
  const flashRef = useRef(null);
  const neonRingRef = useRef(null);
  const cardElementsRef = useRef([]);

  // Mobile carousel & view states
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileView, setMobileView] = useState('slider'); // 'slider' | 'grid'
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const allProjects = portfolioData.projects.list;

  // Track window resize for desktop vs mobile/tablet orbit mode
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter projects based on activeTab
  const filteredProjects =
    activeTab === 'ALL'
      ? allProjects
      : allProjects.filter((project) => project.filterCategory === activeTab);

  // DESKTOP: Setup GSAP animation (Cards start inside archive slot, burst out dancing with bright light, then gently float)
  useEffect(() => {
    if (!isDesktop) return;

    const section = sectionRef.current;
    const archiveSlot = archiveSlotRef.current;
    const flashEl = flashRef.current;
    const neonRingEl = neonRingRef.current;
    const cards = cardElementsRef.current.filter(Boolean);

    if (!section || !archiveSlot || !cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        section.querySelector('.projects-header-anim'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      if (prefersReducedMotion) return;

      // Function to calculate offsets from each card to the center archive slot
      const calculateOffsets = () => {
        const centerRect = archiveSlot.getBoundingClientRect();
        const centerCenterX = centerRect.left + centerRect.width / 2;
        const centerCenterY = centerRect.top + centerRect.height / 2;

        return cards.map((card) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;

          return {
            dx: centerCenterX - cardCenterX,
            dy: centerCenterY - cardCenterY
          };
        });
      };

      // Set initial state: all cards strictly inside the archive slot, scaled down, rotated
      const offsets = calculateOffsets();
      cards.forEach((card, i) => {
        const offset = offsets[i] || { dx: 0, dy: 0 };
        gsap.set(card, {
          x: offset.dx,
          y: offset.dy,
          scale: 0.05,
          opacity: 0,
          rotation: i % 2 === 0 ? -14 : 14,
          zIndex: 5
        });
      });

      // Main Burst-Out Timeline triggered when user enters the projects section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        }
      });

      // 1. Archive slot pulses with building red energy
      tl.fromTo(
        archiveSlot,
        { scale: 0.93, borderColor: 'rgba(229, 9, 20, 0.4)' },
        {
          scale: 1.03,
          borderColor: 'rgba(229, 9, 20, 1)',
          boxShadow: '0 0 70px rgba(229, 9, 20, 0.7)',
          duration: 0.45,
          ease: 'power2.inOut'
        }
      );

      // 2. Bright Light Flash & Neon Ring blast from the archive slot
      if (flashEl) {
        tl.fromTo(
          flashEl,
          { opacity: 0.95, scale: 0.7 },
          { opacity: 0, scale: 1.5, duration: 0.55, ease: 'power2.out' },
          '-=0.15'
        );
      }
      if (neonRingEl) {
        tl.fromTo(
          neonRingEl,
          { opacity: 1, scale: 0.8 },
          { opacity: 0, scale: 2.1, duration: 0.75, ease: 'power3.out' },
          '-=0.45'
        );
      }

      // Settle archive slot back to normal
      tl.to(
        archiveSlot,
        { scale: 1, boxShadow: '0 0 35px rgba(229, 9, 20, 0.18)', duration: 0.4 },
        '-=0.3'
      );

      // 3. Cards come dancing out of the archive slot with playful rotation and bouncy spring landing
      tl.to(
        cards,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.1,
          stagger: {
            each: 0.08,
            from: 'center'
          },
          ease: 'back.out(1.8)',
          clearProps: 'zIndex'
        },
        '-=0.5'
      );

      // 4. Once cards are out, initiate continuous subtle floating dancing motion ("move little bit")
      tl.add(() => {
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: i % 2 === 0 ? -6 : -4,
            rotation: i % 2 === 0 ? 0.8 : -0.8,
            duration: 2.3 + (i % 3) * 0.45,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.12
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, [activeTab, isDesktop]);

  // Mobile swipe & navigation handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileIndex(0);
  };

  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (listLength) => {
    if (!listLength) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (diff > threshold) {
      // Swiped left -> next project
      setMobileIndex((prev) => (prev + 1) % listLength);
    } else if (diff < -threshold) {
      // Swiped right -> prev project
      setMobileIndex((prev) => (prev - 1 + listLength) % listLength);
    }
  };

  const handleNextProject = (listLength) => {
    if (!listLength) return;
    setMobileIndex((prev) => (prev + 1) % listLength);
  };

  const handlePrevProject = (listLength) => {
    if (!listLength) return;
    setMobileIndex((prev) => (prev - 1 + listLength) % listLength);
  };

  // Render 3x3 Desktop Grid Items
  const renderDesktopGridItems = () => {
    if (activeTab !== 'ALL') {
      return filteredProjects.map((project) => (
        <div key={project.id} className="relative w-full h-full">
          <ProjectCard project={project} />
        </div>
      ));
    }

    const items = [
      { type: 'project', data: allProjects[0], key: allProjects[0]?.id || 'p0' },
      { type: 'project', data: allProjects[1], key: allProjects[1]?.id || 'p1' },
      { type: 'project', data: allProjects[2], key: allProjects[2]?.id || 'p2' },
      { type: 'project', data: allProjects[3], key: allProjects[3]?.id || 'p3' },
      { type: 'archive', key: 'archive_slots_center' },
      { type: 'project', data: allProjects[4], key: allProjects[4]?.id || 'p4' },
      { type: 'project', data: allProjects[5], key: allProjects[5]?.id || 'p5' },
      { type: 'project', data: allProjects[6], key: allProjects[6]?.id || 'p6' },
      { type: 'project', data: allProjects[7], key: allProjects[7]?.id || 'p7' }
    ];

    let projectIndex = 0;

    return items.map((item) => {
      if (item.type === 'archive') {
        return (
          <div
            key={item.key}
            ref={archiveSlotRef}
            className="group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0b0b0b] border border-[#E50914]/50 shadow-[0_0_35px_rgba(229,9,20,0.18)] hover:shadow-[0_0_55px_rgba(229,9,20,0.35)] flex flex-col items-center justify-center min-h-[300px] sm:min-h-[320px] overflow-hidden select-none z-20 transition-all duration-300"
          >
            {/* Folder Tab on top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-[#141414] border-t border-x border-white/15 rounded-t-lg"></div>

            {/* Bright Light Flash & Neon Ring blast elements */}
            <div
              ref={flashRef}
              className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl pointer-events-none opacity-0 z-30"
            />
            <div
              ref={neonRingRef}
              className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-[#E50914] pointer-events-none opacity-0 scale-75 z-30 shadow-[0_0_80px_#E50914]"
            />

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-radial from-[#E50914]/15 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center">
              {/* Pulsing Red Radar Scanner Dot */}
              <div className="relative flex items-center justify-center">
                <span className="w-10 h-10 rounded-full border border-[#E50914]/50 flex items-center justify-center bg-[#E50914]/10 shadow-[0_0_18px_#E50914] animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]"></span>
                </span>
                <span className="absolute w-14 h-14 rounded-full border border-[#E50914]/30 animate-ping"></span>
              </div>

              {/* Title from Reference Image */}
              <div className="space-y-1">
                <h3 className="font-mono text-lg sm:text-xl font-black text-[#E50914] tracking-[0.24em] uppercase drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]">
                  ARCHIVE_SLOTS
                </h3>
                <span className="font-mono text-[9.5px] text-white/40 tracking-[0.2em] block uppercase">
                  REPOSITORY_VAULT
                </span>
              </div>

              {/* Center Vault Slot Indicator Line */}
              <div className="w-24 h-1 rounded-full bg-white/10 border border-white/5"></div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#111111] border border-white/10 text-white/60 font-mono text-[9.5px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>08 SLOTS ACTIVE</span>
              </div>
            </div>

            {/* Bottom Border Red Neon Highlight */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent"></div>
          </div>
        );
      }

      if (!item.data) return null;

      const currentIndex = projectIndex++;
      return (
        <div
          key={item.key}
          ref={(el) => {
            cardElementsRef.current[currentIndex] = el;
          }}
          className="relative w-full h-full will-change-transform"
        >
          <ProjectCard project={item.data} />
        </div>
      );
    });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white py-24 sm:py-28 px-4 sm:px-6 lg:px-8 select-none border-t border-white/5 overflow-hidden"
    >
      {/* 1. GIANT OVERSIZED ORIGINALS WATERMARK */}
      <div className="absolute top-1/4 -right-10 text-[22vw] font-display font-black text-white/[0.025] pointer-events-none tracking-tighter leading-none select-none z-0">
        {portfolioData.projects.watermark}
      </div>

      {/* Atmospheric Red Ambient Glow */}
      <div className="absolute top-1/2 left-10 w-[600px] h-[600px] bg-[#E50914]/10 rounded-full blur-[200px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-10">
        {/* SECTION HEADER & FILTER TABS (Clean without divider) */}
        <div className="projects-header-anim flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <SectionBadge label={portfolioData.projects.episode} />
            <SectionHeading
              line1={portfolioData.projects.headingLine1}
              line2={portfolioData.projects.headingLine2}
              subtitle={portfolioData.projects.subtitle}
              maxWidth="max-w-2xl"
            />
          </div>

          {/* CATEGORY FILTER TABS (Responsive for both Desktop & Mobile) */}
          <div className="flex flex-wrap items-center gap-2">
            {portfolioData.projects.filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full font-mono text-[11px] sm:text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105 border border-red-500'
                    : 'bg-[#111111] text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 1. FULL DESKTOP VIEW: 3x3 GRID WITH BURST-OUT ANIMATION */}
        {isDesktop ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 relative"
          >
            {renderDesktopGridItems()}
          </div>
        ) : (
          /* 2. NON-DESKTOP (MOBILE & TABLET): ZERO-OVERLAP CAROUSEL & GRID MODES */
          <div className="space-y-6">
            {/* Mobile Top Control Bar */}
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0c0c0c] border border-white/10 shadow-lg">
              {/* Vault Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]"></span>
                </span>
                <span className="font-mono text-[11px] text-white/80 font-bold tracking-wider uppercase">
                  {mobileView === 'slider'
                    ? `RECORD [ 0${Math.min(mobileIndex + 1, filteredProjects.length)} / 0${filteredProjects.length} ]`
                    : `VAULT [ ${filteredProjects.length} TOTAL ]`}
                </span>
              </div>

              {/* View Mode Toggle: SLIDER vs ALL */}
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 font-mono text-[10.5px]">
                <button
                  onClick={() => setMobileView('slider')}
                  className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                    mobileView === 'slider'
                      ? 'bg-[#E50914] text-white shadow-[0_0_10px_#E50914]'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  SLIDER
                </button>
                <button
                  onClick={() => setMobileView('grid')}
                  className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                    mobileView === 'grid'
                      ? 'bg-[#E50914] text-white shadow-[0_0_10px_#E50914]'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  ALL
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-white/40 border border-white/10 rounded-2xl bg-[#0c0c0c]">
                NO PROJECTS FOUND IN THIS CATEGORY.
              </div>
            ) : mobileView === 'slider' ? (
              /* SLIDER MODE: SINGLE ACTIVE CARD WITH ZERO OVERLAP */
              <div className="space-y-5">
                <div
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(filteredProjects.length)}
                  className="w-full max-w-sm sm:max-w-md mx-auto transition-transform duration-300"
                >
                  {filteredProjects[mobileIndex % filteredProjects.length] && (
                    <ProjectCard
                      project={filteredProjects[mobileIndex % filteredProjects.length]}
                    />
                  )}
                </div>

                {/* Slider Controls */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  <div className="flex items-center justify-between w-full max-w-sm sm:max-w-md px-1">
                    <button
                      onClick={() => handlePrevProject(filteredProjects.length)}
                      aria-label="Previous project"
                      className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-white/15 hover:border-[#E50914] text-white/90 hover:text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>←</span>
                      <span>PREV</span>
                    </button>

                    {/* Dot Indicators */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[180px]">
                      {filteredProjects.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setMobileIndex(dotIdx)}
                          aria-label={`Jump to project ${dotIdx + 1}`}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            dotIdx === (mobileIndex % filteredProjects.length)
                              ? 'w-6 bg-[#E50914] shadow-[0_0_8px_#E50914]'
                              : 'w-2 bg-white/20 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleNextProject(filteredProjects.length)}
                      aria-label="Next project"
                      className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-white/15 hover:border-[#E50914] text-white/90 hover:text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>NEXT</span>
                      <span>→</span>
                    </button>
                  </div>

                  <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                    SWIPE OR USE BUTTONS TO NAVIGATE
                  </span>
                </div>
              </div>
            ) : (
              /* GRID MODE: CLEAN RESPONSIVE STACK (ZERO OVERLAP) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="w-full">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;