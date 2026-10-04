import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import CursorGlow from './components/CursorGlow';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-[#050505] min-h-screen text-white relative selection:bg-[#E50914] selection:text-white overflow-x-clip">
      {/* 1. Cinematic Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* 2. Global Red Glowing Custom Cursor (Desktop Only) */}
      <CursorGlow />

      {/* 3. Sticky / Fixed Top Navigation Bar */}
      <Navbar />

      {/* 4. Portfolio Cinematic Sections */}
      <main>
        <Hero />
        <About />
        <Expertise />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* 5. Cinematic Footer */}
      <Footer />
    </div>
  );
}

export default App;