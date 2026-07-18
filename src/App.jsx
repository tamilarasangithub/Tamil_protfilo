import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateMousePosition = e => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Check if iframe was focused
    window.addEventListener('blur', () => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        setIsVisible(false);
      }
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '8px', height: '8px',
          backgroundColor: '#b026ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px #b026ff',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease'
        }}
        animate={{ 
          x: mousePosition.x - 4, 
          y: mousePosition.y - 4,
          scale: isClicking ? 0.5 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '32px', height: '32px',
          border: '1px solid rgba(176, 38, 255, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease'
        }}
        animate={{ 
          x: mousePosition.x - 16, 
          y: mousePosition.y - 16,
          scale: isClicking ? 1.5 : 1
        }}
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
          background: 'radial-gradient(circle, rgba(176, 38, 255, 0.15) 0%, rgba(176, 38, 255, 0) 70%)',
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
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0) 70%)',
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
import Chatbot from './components/Chatbot';

import defaultState from './data.json';
import { db, auth } from './firebase';
import { doc, setDoc, onSnapshot, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  const [state, setState] = useState(defaultState);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setState(prevState => ({
        ...prevState,
        loggedIn: !!user
      }));
    });

    const docRef = doc(db, 'portfolio', 'main');

    // Track daily visit
    try {
      const today = new Date().toISOString().split('T')[0];
      setDoc(doc(db, 'portfolio', 'analytics'), {
        [today]: increment(1)
      }, { merge: true }).catch(() => {});
    } catch(e) {}

    const unsubscribeDb = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        setState(prevState => ({ 
          ...defaultState, 
          ...data,
          loggedIn: prevState.loggedIn 
        }));
      } else {
        try {
          await setDoc(docRef, defaultState);
        } catch(e) {
           console.error("Error seeding DB", e);
           setDbError("Permission Denied: Could not create database. Did you enable Firestore in Test Mode?");
        }
      }
    }, (error) => {
      console.error("Firebase Snapshot Error:", error);
      // We log the error but don't block the UI anymore, it will just use defaultState.
      setDbError(error.message);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  return (
    <BrowserRouter>
      <CustomCursor />
      <AnimatedBackground />
      <ScrollToTop />
      {dbError && (
        <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(255,0,0,0.8)', color: 'white', padding: '10px', borderRadius: '8px', zIndex: 9999, fontSize: '0.8rem', maxWidth: '300px' }}>
          Database Error: {dbError} <br/>
          (Showing local data instead)
        </div>
      )}
      <Chatbot state={state} />
      <AnimatedRoutes state={state} setState={setState} />
    </BrowserRouter>
  );
}

export default App;
