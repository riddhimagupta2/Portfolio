import React from 'react';
import { portfolioData } from '../data/portfolioData';

const Footer = () => {
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 80;
      const elPos = element.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: elPos, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050505] text-white py-16 px-6 md:px-12 border-t border-white/10 select-none relative z-10 overflow-hidden">
      {/* Background Soft Red Radial Glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#E50914]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col space-y-12 relative z-10">
        
        {/* Top Section: Brand & Quick Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-white/10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-black text-[#E50914] tracking-wider drop-shadow-[0_2px_15px_rgba(229,9,20,0.8)]">
                {portfolioData.personal.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] inline-block"></span>
            </div>
            <p className="text-xs font-mono text-white/50 tracking-[0.2em] uppercase">
              DEVELOPER SERIES &bull; {portfolioData.personal.season}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav className="flex flex-wrap gap-6 md:gap-8 text-xs font-mono uppercase tracking-[0.2em] text-white/70">
            {portfolioData.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="hover:text-[#E50914] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

        </div>

        {/* Middle Section: Socials & Location Telemetry */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs font-mono text-white/60">
          <div className="flex flex-wrap items-center gap-6">
            {portfolioData.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E50914] transition-colors uppercase tracking-wider"
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="text-white/40 tracking-widest uppercase">
            LOCATION: {portfolioData.personal.location}
          </div>
        </div>

        {/* Bottom Copyright & Cinematic Tagline */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 text-[11px] font-mono text-white/40 uppercase tracking-widest text-center md:text-left">
          <p>
            &copy; {new Date().getFullYear()} {portfolioData.personal.fullName}. All Rights Reserved.
          </p>
          <p className="text-[#E50914]/80">
            STREAMING WORLDWIDE &bull; BUILT WITH REACT & GSAP
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;