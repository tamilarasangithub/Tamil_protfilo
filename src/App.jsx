import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = e => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '8px', height: '8px',
          backgroundColor: '#9900ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px #9900ff'
        }}
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0 }}
      />
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '32px', height: '32px',
          border: '2px solid rgba(153, 0, 255, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: 'spring', mass: 0.05, stiffness: 400, damping: 25 }}
      />
    </>
  );
}

function AnimatedBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '20%', left: '30%',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(153,0,255,0.15) 0%, rgba(153,0,255,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}
      />
      <motion.div
        animate={{
          x: [0, -100, 0, 100, 0],
          y: [0, -50, -100, -50, 0],
          scale: [1, 0.8, 1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: '20%', right: '20%',
          width: '30vw', height: '30vw',
          background: 'radial-gradient(circle, rgba(0,251,255,0.1) 0%, rgba(0,251,255,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}
      />
    </div>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.15, boxShadow: '0 0 18px rgba(153,0,255,0.8)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-top-btn"
          style={{
            position: 'fixed',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'auto'
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}

import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Details from './pages/Details';

const STORAGE_KEY = 'tamilarasan-portfolio-state-v1';

import defaultState from './data.json';

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);
    
    // Inject the new hacking-focused about text to override old local storage values
    parsed.aboutIntro1 = defaultState.aboutIntro1;
    parsed.aboutIntro2 = defaultState.aboutIntro2;
    
    let loadedProjects = parsed.projects?.length ? parsed.projects : defaultState.projects;
    
    // Auto-inject the Git video project for the user without clearing local storage
    const hasGitVideo = loadedProjects.some(p => p.videoUrl === 'https://youtu.be/SDA-RRWBVwk');
    if (!hasGitVideo) {
      loadedProjects = [defaultState.projects[0], ...loadedProjects];
    }

    return {
      ...defaultState,
      ...parsed,
      projects: loadedProjects,
      certifications: parsed.certifications?.length ? parsed.certifications : defaultState.certifications,
      education: parsed.education?.length ? parsed.education : defaultState.education,
      experience: parsed.experience?.length ? parsed.experience : defaultState.experience,
      researchPapers: parsed.researchPapers || defaultState.researchPapers,
      tools: parsed.tools || defaultState.tools,
    };
  } catch (error) {
    console.warn('Could not load saved portfolio state.', error);
    return defaultState;
  }
}

function AnimatedRoutes({ state, setState }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Portfolio state={state} setState={setState} />} />
        <Route path="/login" element={<Login setState={setState} />} />
        <Route path="/admin" element={<AdminDashboard state={state} setState={setState} />} />
        <Route path="/project/:id" element={<Details type="project" state={state} />} />
        <Route path="/research/:id" element={<Details type="research" state={state} />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BrowserRouter>
      <CustomCursor />
      <AnimatedBackground />
      <ScrollToTop />
      <AnimatedRoutes state={state} setState={setState} />
    </BrowserRouter>
  );
}

export default App;
