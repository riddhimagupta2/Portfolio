import React, { useEffect, useRef, useState, useCallback } from 'react';
import { portfolioData } from '../data/portfolioData';
import SectionBadge from './shared/SectionBadge';
import SectionHeading from './shared/SectionHeading';
import SkillCard from './SkillCard';

const Skills = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardElementsRef = useRef([]);

  const categories = portfolioData.skills.categories;
  const totalCards = categories.length;

  const currentP = useRef(0);
  const targetP = useRef(0);
  const rafId = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartP = useRef(0);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, visible: false });

  const updateCards = useCallback(() => {
    if (!stageRef.current) return;
    const stageWidth = stageRef.current.clientWidth;
    const Rx = Math.max(180, Math.min(430, stageWidth * 0.36));
    const Ry = Math.max(35, Math.min(75, stageWidth * 0.07));

    categories.forEach((_, i) => {
      const el = cardElementsRef.current[i];
      if (!el) return;

      const theta = 90 - (i - currentP.current) * 90;
      const rad = (theta * Math.PI) / 180;
      const x = Rx * Math.cos(rad);
      const y = Ry * (1 - Math.sin(rad));
      const rotZ = (90 - theta) * 0.22;
      const sinVal = Math.sin(rad);
      const scale = 0.86 + 0.14 * Math.max(0, sinVal);
      const isVisible = theta >= -35 && theta <= 215;
      const opacity = isVisible ? Math.max(0.15, Math.min(1, sinVal * 1.1 + 0.2)) : 0;
      const zIndex = Math.round(10 + 40 * Math.max(0, sinVal));

      el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotZ}deg) scale(${scale})`;
      el.style.opacity = `${opacity}`;
      el.style.zIndex = `${zIndex}`;
      el.style.pointerEvents = isVisible && opacity > 0.4 ? 'auto' : 'none';
    });

    setActiveCardIndex(Math.max(0, Math.min(totalCards - 1, Math.round(currentP.current))));
  }, [categories, totalCards]);

  useEffect(() => {
    const loop = () => {
      const diff = targetP.current - currentP.current;
      if (Math.abs(diff) > 0.0005) {
        currentP.current += diff * 0.09;
        updateCards();
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    updateCards();

    window.addEventListener('resize', updateCards);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', updateCards);
    };
  }, [updateCards]);

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, visible: true });
    if (!isDragging.current) {
      targetP.current = Math.max(0, Math.min(1, x / rect.width)) * (totalCards - 1);
    }
  };

  const handleMouseLeave = () => setMousePos((prev) => ({ ...prev, visible: false }));

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    dragStartP.current = targetP.current;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !stageRef.current) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const delta = (dragStartX.current - clientX) / (stageRef.current.clientWidth * 0.45) * 1.2;
    targetP.current = Math.max(0, Math.min(totalCards - 1, dragStartP.current + delta));
  };

  const handlePointerUp = () => { isDragging.current = false; };

  const goToCard = (index) => { targetP.current = Math.max(0, Math.min(totalCards - 1, index)); };
  const handlePrev = () => { targetP.current = Math.max(0, targetP.current - 1); };
  const handleNext = () => { targetP.current = Math.min(totalCards - 1, targetP.current + 1); };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-8 select-none border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-1/4 -right-10 text-[18vw] font-display font-black text-white/[0.02] pointer-events-none tracking-tighter leading-none select-none z-0">
        EPISODE 03
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-[#E50914]/8 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-10">
        <div className="space-y-4 max-w-3xl">
          <SectionBadge label={portfolioData.skills.episode} />
          <SectionHeading
            line1={portfolioData.skills.headingLine1}
            line2={portfolioData.skills.headingLine2}
            subtitle={portfolioData.skills.subtitle}
          />
        </div>

        {/* Semicircle arc card stage */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handlePointerDown}
          onMouseMoveCapture={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="relative w-full h-[520px] sm:h-[550px] md:h-[580px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-visible"
        >
          {mousePos.visible && (
            <div
              className="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
              style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
            >
              <div className="relative flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-[#E50914] shadow-[0_0_16px_#E50914] animate-pulse" />
                <span className="absolute w-8 h-8 rounded-full border border-[#E50914]/40 animate-ping" />
              </div>
            </div>
          )}

          {categories.map((item, index) => (
            <div
              key={item.index}
              ref={(el) => { cardElementsRef.current[index] = el; }}
              onClick={() => goToCard(index)}
              className="absolute left-1/2 top-[52%] w-[290px] sm:w-[340px] md:w-[370px] transition-shadow duration-300 will-change-transform cursor-pointer"
              style={{ transformOrigin: '50% 50%' }}
            >
              <SkillCard item={item} isActive={index === activeCardIndex} />
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={activeCardIndex === 0}
              aria-label="Previous skill card"
              className="px-3.5 py-1.5 rounded-lg bg-[#111111] border border-white/15 text-white/70 hover:text-white hover:border-[#E50914] disabled:opacity-30 disabled:pointer-events-none transition-all font-mono text-xs"
            >
              ← PREV
            </button>

            <div className="flex items-center gap-1.5">
              {categories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToCard(i)}
                  aria-label={`Go to skill card ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeCardIndex
                      ? 'w-7 bg-[#E50914] shadow-[0_0_8px_#E50914]'
                      : 'w-2 bg-white/20 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeCardIndex === totalCards - 1}
              aria-label="Next skill card"
              className="px-3.5 py-1.5 rounded-lg bg-[#111111] border border-white/15 text-white/70 hover:text-white hover:border-[#E50914] disabled:opacity-30 disabled:pointer-events-none transition-all font-mono text-xs"
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;