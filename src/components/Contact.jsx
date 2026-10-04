import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import SectionBadge from './shared/SectionBadge';
import SectionHeading from './shared/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const formCardRef = useRef(null);
  const telemetryCardRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    permission: true
  });

  const [status, setStatus] = useState({ type: '', message: '', activationPending: false });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeLatency, setActiveLatency] = useState(21);

  // 3D Tilt State for Cards
  const [formTilt, setFormTilt] = useState({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0 });
  const [telemetryTilt, setTelemetryTilt] = useState({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0 });

  // Live fluctuating latency for tactical radar realism
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLatency(Math.floor(Math.random() * 8) + 18); // 18ms - 25ms
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    const section = sectionRef.current;
    const formCard = formCardRef.current;
    const telemetryCard = telemetryCardRef.current;

    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        section.querySelector('.contact-header-anim'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      if (prefersReducedMotion) return;

      // Form Card Slide In from Left with spring
      if (formCard) {
        gsap.fromTo(
          formCard,
          { x: -60, opacity: 0, scale: 0.94 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formCard,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Telemetry Card Slide In from Right with spring
      if (telemetryCard) {
        gsap.fromTo(
          telemetryCard,
          { x: 60, opacity: 0, scale: 0.94 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: telemetryCard,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Mouse Move Tilt Handlers
  const handleMouseMoveForm = (e) => {
    const rect = formCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8; // subtle +/- 4 deg
    const rotateX = -((y / rect.height) - 0.5) * 8;
    setFormTilt({ rotateX, rotateY, mouseX: x, mouseY: y });
  };

  const handleMouseLeaveForm = () => {
    setFormTilt({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0 });
  };

  const handleMouseMoveTelemetry = (e) => {
    const rect = telemetryCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = -((y / rect.height) - 0.5) * 8;
    setTelemetryTilt({ rotateX, rotateY, mouseX: x, mouseY: y });
  };

  const handleMouseLeaveTelemetry = () => {
    setTelemetryTilt({ rotateX: 0, rotateY: 0, mouseX: 0, mouseY: 0 });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const recipientEmail = portfolioData.personal.email || 'developer@example.com';
  const recipientName = portfolioData.personal.name || 'DEVELOPER';

  // Direct Gmail Compose URL generator
  const getGmailComposeUrl = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Portfolio Visitor';
    const subject = encodeURIComponent(`Portfolio Inquiry from ${fullName}`);
    const bodyContent = encodeURIComponent(
      `Hi ${recipientName},\n\n${formData.message || 'I would like to connect with you regarding an opportunity.'}\n\n--\nSender: ${fullName}\nEmail: ${formData.email || 'Not provided'}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${bodyContent}`;
  };

  // Direct Mailto URL generator
  const getMailtoUrl = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Portfolio Visitor';
    const subject = encodeURIComponent(`Portfolio Inquiry from ${fullName}`);
    const bodyContent = encodeURIComponent(
      `Hi ${recipientName},\n\n${formData.message || 'I would like to connect with you regarding an opportunity.'}\n\n--\nSender: ${fullName}\nEmail: ${formData.email || 'Not provided'}`
    );
    return `mailto:${recipientEmail}?subject=${subject}&body=${bodyContent}`;
  };

  // Multi-tier reliable submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please provide both your email address and message payload.', activationPending: false });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '', activationPending: false });
    setLoadingStep(1);

    const stepTimer1 = setTimeout(() => setLoadingStep(2), 600);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 1200);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Portfolio Visitor';

    try {
      // POST directly to formsubmit.co for recipient email
      const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio Transmission from ${fullName} [${formData.email}]`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      // Check if activation is required
      const msgText = String(result?.message || '').toLowerCase();
      const isActivationNeeded = msgText.includes('activation') || msgText.includes('activate');

      if (isActivationNeeded) {
        setStatus({
          type: 'warning',
          activationPending: true,
          message:
            `⚡ 1-STEP ACTIVATION REQUIRED: FormSubmit has dispatched an 'Activate Form' verification link to ${recipientEmail}. Please check your Inbox or Spam folder and click 'Activate Form' once to enable instant automatic forwarding! In the meantime, you can also send directly using the 1-click Gmail button below.`
        });
      } else if (response.ok && (result.success === 'true' || result.success === true)) {
        setStatus({
          type: 'success',
          activationPending: false,
          message:
            `SIGNAL TRANSMITTED // Message successfully delivered to ${recipientEmail}. I will review and reply within 24 hours!`
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: '',
          permission: true
        });
      } else {
        throw new Error(result?.message || 'Dispatch error');
      }
    } catch (error) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      // Fallback: Give user instant 1-click options
      setStatus({
        type: 'fallback',
        activationPending: false,
        message:
          `API UPLINK BUSY // Your message has been prepared for direct delivery to ${recipientEmail}. Click the button below to send instantly via Gmail or your mail app!`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(recipientEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2800);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white py-28 sm:py-32 px-4 sm:px-6 lg:px-8 select-none border-t border-white/5 overflow-hidden"
    >
      {/* Background Watermark & Red Glow Atmosphere */}
      <div className="absolute top-1/4 -right-10 text-[20vw] font-display font-black text-white/[0.02] pointer-events-none tracking-tighter leading-none select-none z-0">
        EPISODE 06
      </div>
      <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-[#E50914]/12 rounded-full blur-[200px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#E50914]/8 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* SECTION HEADER */}
        <div className="contact-header-anim space-y-3 max-w-3xl">
          <SectionBadge label={portfolioData.contact.episode} />
          <SectionHeading
            line1={portfolioData.contact.headingLine1}
            line2={portfolioData.contact.headingLine2}
            line3={portfolioData.contact.headingLine3}
            subtitle={portfolioData.contact.subtitle}
          />
        </div>

        {/* TWO-COLUMN CONTACT WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: INTERACTIVE FORM (7 COLS) */}
          <div
            ref={formCardRef}
            onMouseMove={handleMouseMoveForm}
            onMouseLeave={handleMouseLeaveForm}
            style={{
              transform: `perspective(1000px) rotateX(${formTilt.rotateX}deg) rotateY(${formTilt.rotateY}deg)`,
              transition: formTilt.rotateX === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out'
            }}
            className="lg:col-span-7 bg-[#0c0c0c] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl relative overflow-hidden group hover:border-[#E50914]/40 transition-colors"
          >
            {/* Top Red Laser Accent with dynamic scanline */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-[2px] bg-white animate-laser-scan blur-[1px]"></div>

            {/* Dynamic cursor spotlight glow */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(500px circle at ${formTilt.mouseX}px ${formTilt.mouseY}px, rgba(229,9,20,0.14), transparent 60%)`
              }}
            ></div>

            {/* HUD Status Header */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse"></span>
                <span className="font-mono text-[11px] text-white/70 tracking-widest uppercase">
                  DIRECT TRANSMISSION CONSOLE
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SYSTEM ONLINE</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group/input">
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/60 tracking-widest uppercase">
                    <label className="group-focus-within/input:text-[#E50914] transition-colors">
                      First Name
                    </label>
                    <span className="text-white/20 group-focus-within/input:text-[#E50914]/60 text-[10px]">
                      [01]
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Alex"
                      className="w-full bg-white/[0.02] border border-white/15 focus:border-[#E50914] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-white/20 focus:shadow-[0_0_20px_rgba(229,9,20,0.25)] focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/input">
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/60 tracking-widest uppercase">
                    <label className="group-focus-within/input:text-[#E50914] transition-colors">
                      Last Name
                    </label>
                    <span className="text-white/20 group-focus-within/input:text-[#E50914]/60 text-[10px]">
                      [02]
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Vance"
                      className="w-full bg-white/[0.02] border border-white/15 focus:border-[#E50914] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-white/20 focus:shadow-[0_0_20px_rgba(229,9,20,0.25)] focus:bg-white/[0.04]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="space-y-2 group/input">
                <div className="flex items-center justify-between font-mono text-[11px] text-white/60 tracking-widest uppercase">
                  <label className="group-focus-within/input:text-[#E50914] transition-colors">
                    Sender Email Address *
                  </label>
                  <span className="text-white/20 group-focus-within/input:text-[#E50914]/60 text-[10px]">
                    [REPLY UPLINK]
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full bg-white/[0.02] border border-white/15 focus:border-[#E50914] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-white/20 focus:shadow-[0_0_20px_rgba(229,9,20,0.25)] focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="space-y-2 group/input">
                <div className="flex items-center justify-between font-mono text-[11px] text-white/60 tracking-widest uppercase">
                  <label className="group-focus-within/input:text-[#E50914] transition-colors">
                    Transmission Message *
                  </label>
                  <span className="text-white/30 text-[10px] font-mono">
                    {formData.message.length} CHARS
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Outline your project scope, inquiry, hiring opportunity, or software collaboration..."
                    className="w-full bg-white/[0.02] border border-white/15 focus:border-[#E50914] rounded-xl p-4 text-white text-sm focus:outline-none transition-all resize-none placeholder:text-white/20 focus:shadow-[0_0_20px_rgba(229,9,20,0.25)] focus:bg-white/[0.04]"
                  ></textarea>
                </div>
              </div>

              {/* Row 4: Permission Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="permission"
                  name="permission"
                  checked={formData.permission}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-black/60 border-white/30 text-[#E50914] focus:ring-[#E50914] accent-[#E50914] cursor-pointer"
                />
                <label htmlFor="permission" className="text-xs font-mono text-white/70 cursor-pointer select-none">
                  I give permission to contact me regarding engineering opportunities.
                </label>
              </div>

              {/* Transmission Telemetry Loading Sequence Animation */}
              {isLoading && (
                <div className="p-4 rounded-xl bg-black/70 border border-[#E50914]/50 space-y-3 shadow-[0_0_30px_rgba(229,9,20,0.3)]">
                  <div className="flex items-center justify-between font-mono text-xs text-[#E50914] font-bold">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping"></span>
                      <span className="uppercase">DISPATCHING SIGNAL TO {recipientEmail}...</span>
                    </span>
                    <span>STEP 0{loadingStep}/03</span>
                  </div>

                  {/* High-tech Loading Bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#E50914] to-red-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${loadingStep * 33.3}%` }}
                    ></div>
                  </div>

                  <div className="font-mono text-[10px] text-white/60">
                    {loadingStep === 1 && '>>> [01] Encrypting message payload with 256-bit envelope...'}
                    {loadingStep === 2 && `>>> [02] Establishing direct uplink to ${recipientEmail}...`}
                    {loadingStep === 3 && '>>> [03] Awaiting delivery receipt acknowledgement...'}
                  </div>
                </div>
              )}

              {/* Dynamic Feedback Banner */}
              {status.message && (
                <div
                  className={`p-4 rounded-xl font-mono text-xs leading-relaxed tracking-wide border transition-all duration-300 space-y-3 ${
                    status.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                      : status.type === 'warning'
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                      : 'bg-red-950/60 border-red-500/60 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none">
                      {status.type === 'success' ? '✓' : status.type === 'warning' ? '⚡' : '⚠'}
                    </span>
                    <span>{status.message}</span>
                  </div>

                  {/* Instant 1-Click Action Buttons in Alert */}
                  {(status.activationPending || status.type === 'fallback' || status.type === 'error') && (
                    <div className="pt-2 flex flex-wrap gap-2 border-t border-white/10">
                      <a
                        href={getGmailComposeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-[11px] font-bold tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        <span>SEND DIRECTLY VIA GMAIL</span>
                        <span>→</span>
                      </a>
                      <a
                        href={getMailtoUrl()}
                        className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>DEFAULT MAIL CLIENT</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ACTION BUTTONS DUAL-GRID */}
              <div className="space-y-3 pt-2">
                {/* Primary Button: Transmit Signal */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full py-4 rounded-xl bg-[#E50914] hover:bg-[#FF1A1A] disabled:opacity-50 text-white font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(229,9,20,0.6)] hover:shadow-[0_0_40px_rgba(255,26,26,0.9)] hover:scale-[1.01] active:scale-[0.99] border border-red-500/50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>TRANSMITTING SIGNAL...</span>
                    </span>
                  ) : (
                    <>
                      <span className="uppercase">TRANSMIT MESSAGE TO {recipientName}</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </>
                  )}
                </button>

                {/* Secondary Fast Action: Direct Gmail Compose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getGmailComposeUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#E50914]/50 text-white/80 hover:text-white font-mono text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group/gmail cursor-pointer text-center"
                  >
                    <svg className="w-4 h-4 text-[#E50914] group-hover/gmail:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span>ONE-CLICK GMAIL COMPOSE</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#E50914]/50 text-white/80 hover:text-white font-mono text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group/copy cursor-pointer text-center"
                  >
                    <span className="text-[#E50914] group-hover/copy:scale-110 transition-transform">📋</span>
                    <span>{copied ? '✓ COPIED TO CLIPBOARD!' : 'COPY EMAIL ADDRESS'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: SIGNAL TELEMETRY & TACTICAL RADAR (5 COLS) */}
          <div
            ref={telemetryCardRef}
            onMouseMove={handleMouseMoveTelemetry}
            onMouseLeave={handleMouseLeaveTelemetry}
            style={{
              transform: `perspective(1000px) rotateX(${telemetryTilt.rotateX}deg) rotateY(${telemetryTilt.rotateY}deg)`,
              transition: telemetryTilt.rotateX === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out'
            }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Live Telemetry Card with Radar Glow & Tactical Radar Animation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] group hover:border-[#E50914]/40 transition-colors">
              {/* Dynamic cursor spotlight glow */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at ${telemetryTilt.mouseX}px ${telemetryTilt.mouseY}px, rgba(229,9,20,0.15), transparent 60%)`
                }}
              ></div>

              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
                <span className="font-mono text-xs text-[#E50914] font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping"></span>
                  // RADAR TELEMETRY
                </span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[10.5px] font-bold text-emerald-400 tracking-widest uppercase">
                    {portfolioData.personal.availability}
                  </span>
                </div>
              </div>

              {/* TACTICAL ROTATING RADAR ANIMATION DISPLAY */}
              <div className="relative w-full h-44 rounded-2xl bg-[#080808] border border-white/10 flex items-center justify-center overflow-hidden">
                {/* Tactical Radar Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Concentric Radar Rings */}
                <div className="absolute w-36 h-36 rounded-full border border-[#E50914]/20"></div>
                <div className="absolute w-24 h-24 rounded-full border border-[#E50914]/30"></div>
                <div className="absolute w-12 h-12 rounded-full border border-[#E50914]/40"></div>

                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-white/10"></div>
                <div className="absolute h-full w-[1px] bg-white/10"></div>

                {/* Sweeping 360-degree Radar Beam Animation */}
                <div
                  className="absolute w-36 h-36 rounded-full animate-radar-sweep pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(229,9,20,0.55) 0deg, rgba(229,9,20,0.15) 30deg, transparent 60deg)'
                  }}
                ></div>

                {/* Blinking Radar Target Blips */}
                <div className="absolute top-10 right-14 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <div className="absolute top-10 right-14 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>

                <div className="absolute bottom-12 left-16 w-2 h-2 rounded-full bg-[#E50914] animate-ping" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-12 left-16 w-1.5 h-1.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]"></div>

                {/* Center Core Beacon */}
                <div className="relative z-10 w-3 h-3 rounded-full bg-[#E50914] shadow-[0_0_15px_#E50914] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                </div>

                {/* Radar HUD Corner Tags */}
                <span className="absolute top-2 left-3 font-mono text-[9px] text-white/40 tracking-wider">
                  SAT_UPLINK: ACTIVE
                </span>
                <span className="absolute top-2 right-3 font-mono text-[9px] text-[#E50914] tracking-wider">
                  {activeLatency}ms LATENCY
                </span>
                <span className="absolute bottom-2 left-3 font-mono text-[9px] text-white/40 tracking-wider">
                  COORD: 28.6139° N, 77.2090° E
                </span>
                <span className="absolute bottom-2 right-3 font-mono text-[9px] text-emerald-400 tracking-wider">
                  UPLINK 100%
                </span>
              </div>

              {/* Direct Transmission Details */}
              <div className="space-y-2 relative z-10">
                <h4 className="font-display text-2xl text-white uppercase tracking-wider">
                  DIRECT FREQUENCY
                </h4>
                <p className="text-white/70 text-xs sm:text-[13px] font-light leading-relaxed">
                  Inquiries dispatched from this portfolio reach my primary inbox in real time.
                </p>
              </div>

              {/* Direct Email Box with Click to Copy */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2 group/box hover:border-[#E50914]/60 transition-all relative z-10 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></span>
                    PRIMARY TARGET
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="font-mono text-[10.5px] text-[#E50914] hover:text-white hover:underline uppercase tracking-wider cursor-pointer font-bold transition-colors"
                  >
                    {copied ? '✓ COPIED!' : 'COPY EMAIL'}
                  </button>
                </div>
                <a
                  href={`mailto:${recipientEmail}`}
                  className="font-mono text-sm sm:text-base text-white hover:text-[#E50914] transition-colors break-all block font-bold"
                >
                  {recipientEmail}
                </a>
              </div>

              {/* Frequency Audio Equalizer & SLA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[11px] text-white/60 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-white/40">FREQ:</span>
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 bg-[#E50914] rounded-full animate-equalizer-1"></span>
                    <span className="w-1 bg-[#E50914] rounded-full animate-equalizer-2"></span>
                    <span className="w-1 bg-white rounded-full animate-equalizer-3"></span>
                    <span className="w-1 bg-[#E50914] rounded-full animate-equalizer-4"></span>
                    <span className="w-1 bg-[#E50914] rounded-full animate-equalizer-5"></span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-white/50 text-[10.5px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{portfolioData.contact.responseSla}</span>
                </div>
              </div>
            </div>

            {/* Encrypted Communication Security Badge */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80"></span>
                ENCRYPTED COMMUNICATION PROTOCOL
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                {portfolioData.contact.securityNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;