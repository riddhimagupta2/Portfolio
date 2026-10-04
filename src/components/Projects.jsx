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

  // Non-desktop circular orbit refs
  const orbitStageRef = useRef(null);
  const orbitCardRefs = useRef([]);
  const orbitAngle = useRef(0);
  const orbitRaf = useRef(null);
  const isDraggingOrbit = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

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

  // NON-DESKTOP: Circular Orbit Animation around center Archive Slot
  const updateCircularOrbit = useCallback(() => {
    if (!orbitStageRef.current) return;
    const stageWidth = orbitStageRef.current.clientWidth;
    const stageHeight = orbitStageRef.current.clientHeight;

    const Rx = Math.min(340, Math.max(180, stageWidth * 0.4));
    const Ry = Math.min(220, Math.max(130, stageHeight * 0.32));

    const total = allProjects.length;

    allProjects.forEach((_, i) => {
      const el = orbitCardRefs.current[i];
      if (!el) return;

      // Calculate angle for card i along the 360° circle
      const angle = orbitAngle.current + i * (360 / total);
      const rad = (angle * Math.PI) / 180;

      const x = Rx * Math.cos(rad);
      const y = Ry * Math.sin(rad);

      // Depth layering: sin(rad) > 0 is in front of center archive slot, < 0 is behind
      const sinVal = Math.sin(rad);
      const scale = 0.84 + 0.16 * Math.max(0, (sinVal + 1) / 2);
      const opacity = 0.45 + 0.55 * Math.max(0, (sinVal + 1) / 2);
      const zIndex = Math.round(20 + 25 * sinVal);

      el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
      el.style.opacity = `${opacity}`;
      el.style.zIndex = `${zIndex}`;
      el.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none';
    });
  }, [allProjects]);

  useEffect(() => {
    if (isDesktop) return;

    let isHovered = false;

    const loop = () => {
      if (!isDraggingOrbit.current && !isHovered) {
        // Continuous slow circular orbital motion
        orbitAngle.current = (orbitAngle.current + 0.22) % 360;
        updateCircularOrbit();
      }
      orbitRaf.current = requestAnimationFrame(loop);
    };

    orbitRaf.current = requestAnimationFrame(loop);
    updateCircularOrbit();

    const stageEl = orbitStageRef.current;
    const onEnter = () => {
      isHovered = true;
    };
    const onLeave = () => {
      isHovered = false;
    };

    if (stageEl) {
      stageEl.addEventListener('mouseenter', onEnter);
      stageEl.addEventListener('mouseleave', onLeave);
    }

    return () => {
      if (orbitRaf.current) cancelAnimationFrame(orbitRaf.current);
      if (stageEl) {
        stageEl.removeEventListener('mouseenter', onEnter);
        stageEl.removeEventListener('mouseleave', onLeave);
      }
    };
  }, [isDesktop, updateCircularOrbit]);

  // Orbit Pointer Drag / Swipe Handlers (Mobile & Tablet)
  const handleOrbitPointerDown = (e) => {
    isDraggingOrbit.current = true;
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartAngle.current = orbitAngle.current;
  };

  const handleOrbitPointerMove = (e) => {
    if (!isDraggingOrbit.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX.current;
    orbitAngle.current = dragStartAngle.current + deltaX * 0.4;
    updateCircularOrbit();
  };

  const handleOrbitPointerUp = () => {
    isDraggingOrbit.current = false;
  };

  const rotateOrbitStep = (direction) => {
    orbitAngle.current += direction * 45;
    updateCircularOrbit();
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

          {/* CATEGORY FILTER TABS (Desktop) */}
          {isDesktop && (
            <div className="flex flex-wrap items-center gap-2">
              {portfolioData.projects.filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.6)] scale-105 border border-red-500'
                      : 'bg-[#111111] text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
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
          /* 2. NON-DESKTOP (TABLET & MOBILE): ARCHIVE SLOT IN CENTER + 360° CIRCULAR ORBITING CARDS */
          <div className="space-y-6">
            <div
              ref={orbitStageRef}
              onMouseDown={handleOrbitPointerDown}
              onMouseMove={handleOrbitPointerMove}
              onMouseUp={handleOrbitPointerUp}
              onTouchStart={handleOrbitPointerDown}
              onTouchMove={handleOrbitPointerMove}
              onTouchEnd={handleOrbitPointerUp}
              className="relative w-full h-[540px] sm:h-[600px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-visible select-none"
            >
              {/* Central ARCHIVE_SLOTS Card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[240px] min-h-[250px] sm:min-h-[280px] p-5 rounded-2xl sm:rounded-3xl bg-[#0c0c0c] border border-[#E50914]/60 shadow-[0_0_40px_rgba(229,9,20,0.25)] flex flex-col items-center justify-center z-25 pointer-events-auto select-none">
                {/* Top Folder Tab */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#161616] border-t border-x border-white/15 rounded-t-lg"></div>

                {/* Radar Dot */}
                <div className="relative flex items-center justify-center mb-3">
                  <span className="w-9 h-9 rounded-full border border-[#E50914]/60 flex items-center justify-center bg-[#E50914]/15 shadow-[0_0_15px_#E50914] animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]"></span>
                  </span>
                  <span className="absolute w-12 h-12 rounded-full border border-[#E50914]/30 animate-ping"></span>
                </div>

                <h3 className="font-mono text-base sm:text-lg font-black text-[#E50914] tracking-[0.22em] uppercase drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                  ARCHIVE_SLOTS
                </h3>
                <span className="font-mono text-[9px] text-white/40 tracking-[0.18em] block uppercase mt-0.5">
                  REPOSITORY_VAULT
                </span>

                <div className="w-20 h-0.5 rounded-full bg-white/10 my-3"></div>

                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#111111] border border-white/10 text-white/70 font-mono text-[9px] tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>08 IN ORBIT</span>
                </div>
              </div>

              {/* Surrounding Orbiting Project Cards */}
              {allProjects.map((project, i) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    orbitCardRefs.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2 w-[240px] sm:w-[280px] min-h-[280px] sm:min-h-[300px] will-change-transform cursor-pointer transition-shadow"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* Orbit Navigation Controls for Touch / Tablet */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10.5px] text-white/50 tracking-wider uppercase">
                SWIPE OR DRAG TO ROTATE
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => rotateOrbitStep(1)}
                  aria-label="Rotate orbit left"
                  className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/15 text-white/80 hover:text-white hover:border-[#E50914] transition-all font-mono text-xs"
                >
                  ↺ ROTATE
                </button>
                <button
                  onClick={() => rotateOrbitStep(-1)}
                  aria-label="Rotate orbit right"
                  className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/15 text-white/80 hover:text-white hover:border-[#E50914] transition-all font-mono text-xs"
                >
                  ROTATE ↻
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;