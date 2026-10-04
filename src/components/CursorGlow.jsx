import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CursorGlow = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    // Only disable custom cursor on very small pure mobile screens (< 640px without any fine pointer)
    const isPureMobile =
      window.innerWidth < 640 &&
      window.matchMedia('(any-pointer: coarse)').matches &&
      !window.matchMedia('(any-pointer: fine)').matches;

    if (isPureMobile) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    if (!dot || !ring || !aura) return;

    // Enable custom cursor class to hide standard browser cursor on desktop
    document.documentElement.classList.add('custom-cursor-active');

    // Ensure all 3 cursor elements are centered on the exact cursor coordinates
    gsap.set([dot, ring, aura], {
      xPercent: -50,
      yPercent: -50,
      force3D: true
    });

    // High performance quickTo setters
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.04, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.04, ease: 'power2.out' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3.out' });
    const setAuraX = gsap.quickTo(aura, 'x', { duration: 0.45, ease: 'power2.out' });
    const setAuraY = gsap.quickTo(aura, 'y', { duration: 0.45, ease: 'power2.out' });

    let hasMoved = false;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;

      if (!hasMoved) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
        gsap.to(aura, { opacity: 0.75, duration: 0.3 });
        hasMoved = true;
      }

      setDotX(clientX);
      setDotY(clientY);
      setRingX(clientX);
      setRingY(clientY);
      setAuraX(clientX);
      setAuraY(clientY);
    };

    // Hover effect over interactive elements
    const onMouseEnterInteractive = () => {
      gsap.to(dot, {
        scale: 1.8,
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0 0 15px #FFFFFF, 0 0 30px #FF1A1A, 0 0 55px #E50914, 0 0 85px #E50914',
        duration: 0.2
      });
      gsap.to(ring, {
        scale: 1.6,
        borderColor: '#FF1A1A',
        backgroundColor: 'rgba(229, 9, 20, 0.25)',
        boxShadow:
          '0 0 30px rgba(229, 9, 20, 0.95), 0 0 60px rgba(229, 9, 20, 0.5), inset 0 0 15px rgba(229, 9, 20, 0.5)',
        duration: 0.25
      });
      gsap.to(aura, { scale: 1.4, opacity: 0.95, duration: 0.3 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(dot, {
        scale: 1,
        backgroundColor: '#E50914',
        boxShadow:
          '0 0 10px #FF1A1A, 0 0 20px #E50914, 0 0 35px #E50914, 0 0 55px rgba(229, 9, 20, 0.85)',
        duration: 0.2
      });
      gsap.to(ring, {
        scale: 1,
        borderColor: '#E50914',
        backgroundColor: 'rgba(229, 9, 20, 0.05)',
        boxShadow:
          '0 0 18px rgba(229, 9, 20, 0.8), 0 0 35px rgba(229, 9, 20, 0.45), inset 0 0 10px rgba(229, 9, 20, 0.35)',
        duration: 0.25
      });
      gsap.to(aura, { scale: 1, opacity: 0.75, duration: 0.3 });
    };

    const onMouseLeaveWindow = () => {
      gsap.to([dot, ring, aura], { opacity: 0, duration: 0.25 });
      hasMoved = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);

    // Event delegation for interactive elements so dynamically loaded items always trigger hover
    const onMouseOverDelegated = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
      if (target) {
        onMouseEnterInteractive();
      } else {
        onMouseLeaveInteractive();
      }
    };

    document.addEventListener('mouseover', onMouseOverDelegated, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseover', onMouseOverDelegated);
    };
  }, []);

  return (
    <>
      {/* 1. Large Ambient Atmospheric Red Neon Aura with Rich Red Drop Shadow */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 w-[320px] h-[320px] rounded-full pointer-events-none z-[99990] opacity-0 blur-3xl transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(229, 9, 20, 0.45) 0%, rgba(229, 9, 20, 0.18) 40%, rgba(229, 9, 20, 0.04) 65%, transparent 75%)'
        }}
      />

      {/* 2. Outer Red Neon Ring with Deep Red Glow Shadow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 border-2 border-[#E50914] rounded-full pointer-events-none z-[99998] opacity-0 transition-colors duration-200"
        style={{
          boxShadow:
            '0 0 18px rgba(229, 9, 20, 0.8), 0 0 35px rgba(229, 9, 20, 0.45), inset 0 0 10px rgba(229, 9, 20, 0.35)'
        }}
      />

      {/* 3. Precision Laser Dot with Vivid Red Core & Multi-Layer Red Shadow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 bg-[#E50914] rounded-full pointer-events-none z-[99999] opacity-0"
        style={{
          boxShadow:
            '0 0 10px #FF1A1A, 0 0 20px #E50914, 0 0 35px #E50914, 0 0 55px rgba(229, 9, 20, 0.85)'
        }}
      />
    </>
  );
};

export default CursorGlow;
