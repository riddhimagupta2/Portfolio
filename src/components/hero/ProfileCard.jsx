import React, { useRef, useState, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';

const ProfileCard = ({ imageSrc, altText, season = "SEASON 2026", cardRef }) => {
  const containerRef = useRef(null);
  const cardInnerRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [glareState, setGlareState] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    let animId;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetTransX = 0;
    let targetTransY = 0;

    let curRotX = 0;
    let curRotY = 0;
    let curTransX = 0;
    let curTransY = 0;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // Distance from mouse to card center
      const deltaX = e.clientX - cardCenterX;
      const deltaY = e.clientY - cardCenterY;

      // Normalization factor across the viewport (-1 to 1)
      const rangeX = Math.max(window.innerWidth * 0.45, 300);
      const rangeY = Math.max(window.innerHeight * 0.45, 300);

      const normX = Math.max(-1, Math.min(1, deltaX / rangeX));
      const normY = Math.max(-1, Math.min(1, deltaY / rangeY));

      // Degrees of 3D tilt in all directions with cursor
      const maxTilt = 32;
      targetRotY = normX * maxTilt;
      targetRotX = -normY * maxTilt;

      // 3D translation following cursor in all directions (parallax float)
      targetTransX = normX * 18;
      targetTransY = normY * 18;

      // Glare reflection on card surface
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlareState({
        x: Math.max(0, Math.min(100, glareX)),
        y: Math.max(0, Math.min(100, glareY)),
        opacity: Math.hypot(normX, normY) > 0.08 ? 0.45 : 0.15
      });
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetTransX = 0;
      targetTransY = 0;
      setGlareState((prev) => ({ ...prev, opacity: 0 }));
    };

    let idleTime = 0;
    const animate = () => {
      idleTime += 0.02;

      // Smooth linear interpolation (lerp)
      curRotX += (targetRotX - curRotX) * 0.08;
      curRotY += (targetRotY - curRotY) * 0.08;
      curTransX += (targetTransX - curTransX) * 0.08;
      curTransY += (targetTransY - curTransY) * 0.08;

      // Subtle ambient hover wave
      const ambientY = Math.sin(idleTime) * 3;

      if (cardInnerRef.current) {
        const flipRot = isFlipped ? 180 : 0;
        cardInnerRef.current.style.transform = `perspective(1200px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${(curRotY + flipRot).toFixed(2)}deg) translate3d(${curTransX.toFixed(2)}px, ${(curTransY + ambientY).toFixed(2)}px, 20px)`;
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isFlipped]);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (cardRef) {
          if (typeof cardRef === "function") cardRef(el);
          else cardRef.current = el;
        }
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative flex justify-center items-center select-none cursor-pointer group"
      style={{ perspective: '1200px' }}
      title="Click to flip card"
    >
      {/* Cinematic Red Neon Ambient Glow Behind Card */}
      <div className="absolute w-[280px] sm:w-[320px] h-[400px] bg-[#E50914]/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

      {/* 3D TILT & ROTATION CONTAINER (FOLLOWS CURSOR IN ALL DIRECTIONS) */}
      <div
        ref={cardInnerRef}
        className="relative w-[250px] sm:w-[280px] md:w-[300px] h-[360px] sm:h-[400px] md:h-[420px] transition-shadow duration-300"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        
        {/* --- FRONT SIDE: FEATURED DEV PORTRAIT --- */}
        <div
          className="absolute inset-0 w-full h-full p-3 bg-[#121212]/95 backdrop-blur-2xl rounded-2xl border-2 border-[#E50914]/70 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(229,9,20,0.45)] overflow-hidden flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Dynamic Glare Reflection following cursor */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-40"
            style={{
              background: `radial-gradient(circle 220px at ${glareState.x}% ${glareState.y}%, rgba(255,255,255,0.22), transparent 70%)`,
              opacity: glareState.opacity
            }}
          />

          {/* FEATURED DEV Badge */}
          <div className="absolute top-4 left-4 z-30 px-2.5 py-0.5 bg-[#E50914] text-white font-mono text-[9px] sm:text-[10px] font-bold tracking-widest rounded shadow-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            FEATURED DEV
          </div>

          {/* Profile Image */}
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-[300px] sm:h-[340px] md:h-[360px] object-cover rounded-xl filter contrast-110 brightness-105"
          />

          {/* Bottom Card Ribbon */}
          <div className="mt-1.5 px-1 flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono text-white/60 uppercase">
            <span>{season}</span>
            <span className="text-[#E50914] font-bold tracking-wider">4K STREAM</span>
          </div>
        </div>

        {/* --- BACK SIDE: ORIGINAL DEV CARD --- */}
        <div
          className="absolute inset-0 w-full h-full p-6 bg-gradient-to-br from-[#161616] via-[#0d0d0d] to-[#1a0a0c] backdrop-blur-2xl rounded-2xl border-2 border-[#E50914]/70 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(229,9,20,0.45)] overflow-hidden flex flex-col justify-between"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {/* Dynamic Glare Reflection for back face */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-40"
            style={{
              background: `radial-gradient(circle 220px at ${glareState.x}% ${glareState.y}%, rgba(229,9,20,0.18), transparent 70%)`,
              opacity: glareState.opacity
            }}
          />

          {/* Top Back Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-[10px] text-[#E50914] font-bold tracking-widest uppercase">
              ORIGINAL SERIES
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping"></span>
          </div>

          {/* Center Emblem & Identity */}
          <div className="text-center space-y-3 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-black/80 border border-[#E50914]/50 flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.5)]">
              <span className="font-display text-4xl text-[#E50914] font-black uppercase">
                {portfolioData.personal.initials?.[0] || portfolioData.personal.name?.[0] || 'D'}
              </span>
            </div>
            <div>
              <h3 className="font-display text-3xl font-black text-white tracking-wider uppercase">
                {portfolioData.personal.fullName || portfolioData.personal.name || 'DEVELOPER'}
              </h3>
              <p className="font-mono text-[11px] text-[#E50914] tracking-widest uppercase mt-0.5">
                {portfolioData.personal.roleTag || 'SOFTWARE ENGINEER'}
              </p>
            </div>
            <p className="font-mono text-[10px] text-white/60 tracking-wider">
              CSE &bull; MOBILE &bull; REST APIs &bull; AI
            </p>
          </div>

          {/* Bottom Back Ribbon */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-white/50 uppercase">
            <span>SEASON 2024-2026</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;
