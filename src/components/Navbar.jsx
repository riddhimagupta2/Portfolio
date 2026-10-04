import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section on scroll
      const sections = ['home', 'about', 'expertise', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-md py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="w-full px-6 md:px-10 lg:px-12 flex items-center justify-between">
        
        {/* Top Left: Brand Logo in bold modern sans-serif */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="group flex items-center gap-2 focus:outline-none"
        >
          <span className="font-sans text-[20px] sm:text-[22px] md:text-[25px] font-black text-[#E50914] tracking-tight drop-shadow-[0_2px_15px_rgba(229,9,20,0.7)] group-hover:scale-[1.02] transition-transform flex items-center gap-1.5 uppercase">
            {portfolioData.personal.name || 'DEVELOPER'}
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] inline-block"></span>
          </span>
        </a>

        {/* Center: Desktop Navigation Links (reduced size per user request) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {portfolioData.navLinks.map((link) => {
            const sectionKey = link.href.replace('#', '');
            const isActive = activeSection === sectionKey;

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-[10px] lg:text-[11px] font-sans font-medium tracking-[0.14em] uppercase transition-all duration-200 py-1 ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.name}
                {/* Active Red Indicator Bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E50914] shadow-[0_0_8px_#E50914]"></span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: HIRE ME Button (Desktop) & Hamburger (Mobile) */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-[4px] bg-[#E50914] hover:bg-[#FF1A1A] text-white font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:shadow-[0_0_24px_rgba(255,26,26,0.8)] hover:scale-105 active:scale-95 border border-red-500/30"
          >
            HIRE ME
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded border border-white/10 bg-[#111111]/80 text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span
              className={`w-5 h-[2px] bg-white transition-transform duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-1.5 bg-[#E50914]' : ''
              }`}
            ></span>
            <span
              className={`w-5 h-[2px] bg-white my-1 transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`w-5 h-[2px] bg-white transition-transform duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-1.5 bg-[#E50914]' : ''
              }`}
            ></span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-red-600/30 px-6 py-5 transition-all duration-300">
          <nav className="flex flex-col gap-3">
            {portfolioData.navLinks.map((link) => {
              const sectionKey = link.href.replace('#', '');
              const isActive = activeSection === sectionKey;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between text-xs font-sans tracking-[0.12em] uppercase py-2 border-b border-white/5 ${
                    isActive ? 'text-[#E50914] font-bold' : 'text-white/80'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></span>}
                </a>
              );
            })}

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-3 w-full text-center py-2.5 rounded-[5px] bg-[#E50914] text-white font-sans text-xs font-bold tracking-[0.12em] uppercase shadow-[0_0_18px_rgba(229,9,20,0.55)]"
            >
              HIRE ME
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
