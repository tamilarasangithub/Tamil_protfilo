import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { Home, Briefcase, BarChart2, User, Mail, FileText, Layers } from 'lucide-react';
import { FeaturedSection } from '../components/FeaturedSection';
import HeroGame from '../components/HeroGame';


const AnimatedCounter = ({ from, to, duration = 2, prefix = "", suffix = "" }) => {
  const nodeRef = React.useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-10px" });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            const progress = to === 0 ? 1 : value / to;
            let displayValue = Math.round(value).toString();
            // Cyber scrambling effect
            if (progress < 0.95 && Math.random() > 0.3) {
              const chars = '01';
              displayValue = displayValue.split('').map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
            } else if (progress >= 0.95) {
              displayValue = Math.round(to).toString();
            }
            nodeRef.current.textContent = `${prefix}${displayValue}${suffix}`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView, prefix, suffix]);

  return <span ref={nodeRef} style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>{prefix}{from}{suffix}</span>;
};

function Portfolio({ state, setState }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const eduScrollRef = useRef(null);
  const expScrollRef = useRef(null);
  
  const scrollVertical = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 190;
      const scrollTo = direction === 'up' ? ref.current.scrollTop - scrollAmount : ref.current.scrollTop + scrollAmount;
      ref.current.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Section tracking for bottom nav
      const sections = ['about', 'resume', 'portfolio', 'insights', 'contact'];
      let currentSection = 'about';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return state.projects;
    return state.projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, state.projects]);

  const handleLogout = () => {
    setState((prev) => ({ ...prev, loggedIn: false }));
  };

  const socialLinks = {
    github: 'https://github.com/tamilarasangithub',
    linkedin: 'https://linkedin.openinapp.co/u5hpx',
    leetcode: 'https://leetcode.com/u/tamilarasangithub'
  };

  const [liveStats, setLiveStats] = useState({ github: 0, leetcode: 0, topLanguages: [], leetcodeDetails: [], githubDetails: [], loading: true });
  const [formStatus, setFormStatus] = useState(null);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const [userRes, reposRes, lcRes] = await Promise.all([
          fetch('https://api.github.com/users/tamilarasangithub').catch(() => null),
          fetch('https://api.github.com/users/tamilarasangithub/repos?per_page=100').catch(() => null),
          fetch('https://leetcode-api-faisalshohag.vercel.app/tamilarasangithub').catch(() => null)
        ]);
        
        const defaultTopLanguages = [
          { name: 'Python', count: 12 },
          { name: 'Jupyter Notebook', count: 6 },
          { name: 'HTML', count: 2 },
          { name: 'JavaScript', count: 1 }
        ];
        
        const defaultLeetcodeDetails = [
          { name: 'Easy Problems', count: 5, color: '#00b8a3' },
          { name: 'Medium Problems', count: 0, color: '#ffc01e' },
          { name: 'Hard Problems', count: 0, color: '#ff375f' }
        ];

        let githubCount = 21;
        let leetcodeCount = 5;
        let topLanguages = defaultTopLanguages;
        let leetcodeDetails = defaultLeetcodeDetails;

        let githubDetails = [
          { name: 'Followers', count: 0, color: '#9900ff' },
          { name: 'Following', count: 0, color: '#00b8a3' },
          { name: 'Public Repos', count: 21, color: '#ffc01e' }
        ];

        if (userRes && userRes.ok) {
          const ghData = await userRes.json();
          githubCount = ghData.public_repos || 21;
          githubDetails = [
            { name: 'Followers', count: ghData.followers || 0, color: '#9900ff' },
            { name: 'Following', count: ghData.following || 0, color: '#00b8a3' },
            { name: 'Public Repos', count: ghData.public_repos || 21, color: '#ffc01e' }
          ];
        }

        if (reposRes && reposRes.ok) {
          const reposData = await reposRes.json();
          if (Array.isArray(reposData)) {
            const langCounts = {};
            reposData.forEach(repo => {
              if (repo.language) {
                langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
              }
            });
            const sorted = Object.entries(langCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name, count]) => ({ name, count }));
            if (sorted.length > 0) topLanguages = sorted;
          }
        }

        if (lcRes && lcRes.ok) {
          const lcData = await lcRes.json();
          if (lcData && (lcData.totalSolved !== undefined || lcData.solvedProblem !== undefined)) {
            leetcodeCount = lcData.totalSolved || lcData.solvedProblem || 5;
            leetcodeDetails = [
              { name: 'Easy Problems', count: lcData.easySolved || 0, color: '#00b8a3' },
              { name: 'Medium Problems', count: lcData.mediumSolved || 0, color: '#ffc01e' },
              { name: 'Hard Problems', count: lcData.hardSolved || 0, color: '#ff375f' }
            ];
          }
        }

        setLiveStats({ github: githubCount, leetcode: leetcodeCount, topLanguages, leetcodeDetails, githubDetails, loading: false });
      } catch (error) {
        console.error("Error fetching live stats", error);
        setLiveStats({ 
          github: 21, 
          leetcode: 5, 
          topLanguages: [
            { name: 'Python', count: 12 },
            { name: 'Jupyter Notebook', count: 6 },
            { name: 'HTML', count: 2 },
            { name: 'JavaScript', count: 1 }
          ], 
          leetcodeDetails: [
            { name: 'Easy Problems', count: 5, color: '#00b8a3' },
            { name: 'Medium Problems', count: 0, color: '#ffc01e' },
            { name: 'Hard Problems', count: 0, color: '#ff375f' }
          ], 
          githubDetails: [
            { name: 'Followers', count: 0, color: '#9900ff' },
            { name: 'Following', count: 0, color: '#00b8a3' },
            { name: 'Public Repos', count: 21, color: '#ffc01e' }
          ],
          loading: false 
        });
      }
    }
    fetchStats();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    const form = e.target;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/tamilarasanss.dev@gmail.com", {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <>
      <nav className={`top-nav hide-on-mobile ${isScrolled ? 'scrolled' : ''}`}>
        <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ cursor: 'pointer' }}>
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </div>
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
          <a href="#about">About</a>
          <a href="#resume">Resume</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#insights">Insights</a>
          <a href="#contact">Contact</a>
          {state.loggedIn ? (
            <>
              <Link className="nav-cta" to="/admin">Admin</Link>
              <button type="button" className="nav-cta" onClick={(e) => { e.stopPropagation(); handleLogout(); }} style={{marginLeft: '10px'}}>Logout</button>
            </>
          ) : (
            <Link className="nav-cta" to="/login">Login</Link>
          )}
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="page-shell admin-shell"
      >
      <header className="hero" style={{ position: 'relative' }}>
        <div className="hero-content">

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <motion.div 
              animate={{ opacity: [1, 0.4, 1, 0.8, 1, 1, 0.2, 1] }} 
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2, 0.3, 0.4, 0.8, 0.9, 1] }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#b026ff', boxShadow: '0 0 8px #b026ff' }} 
            />
            <span style={{ color: '#b026ff', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textShadow: '0 0 5px rgba(176, 38, 255, 0.5)' }}>SYSTEM STATUS: ONLINE</span>
          </div>
          <p className="eyebrow">Ethical Hacker • IoT Engineer • Web Developer</p>
          <h1 style={{ background: 'linear-gradient(135deg, #fff 0%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Hi, I’m Tamilarasan S.</h1>
          <p className="hero-text">
            I am a dedicated Penetration Tester, a Full-Stack Web Developer, and an IoT Engineer—bridging the gap between building systems and breaking them.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Let’s connect</a>
            <a className="btn btn-secondary" href="#portfolio">See projects</a>
          </div>
          


          <div className="hero-highlights">
            <div className="hero-highlight-card bento-inner" style={{ background: 'transparent' }}>
              <div className="highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div><strong>Ethical Hacking:</strong> <span style={{color: 'rgba(255,255,255,0.7)'}}>Penetration testing & vulnerability assessment</span></div>
            </div>
            <div className="hero-highlight-card bento-inner" style={{ background: 'transparent' }}>
              <div className="highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><polyline points="8 13 6 15 8 17"></polyline><polyline points="16 17 18 15 16 13"></polyline><line x1="10" y1="18" x2="14" y2="12"></line></svg>
              </div>
              <div><strong>Web Development:</strong> <span style={{color: 'rgba(255,255,255,0.7)'}}>Secure, modern full-stack web applications</span></div>
            </div>
            <div className="hero-highlight-card bento-inner" style={{ background: 'transparent' }}>
              <div className="highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              </div>
              <div><strong>IoT Engineering:</strong> <span style={{color: 'rgba(255,255,255,0.7)'}}>Smart hardware with a focus on IoT Hacking</span></div>
            </div>
          </div>
        </div>

        <aside 
          className="hero-card bento-inner"
          style={{ padding: isHeroHovered ? 0 : '24px', overflow: 'hidden', transition: 'padding 0.3s ease' }}
        >
          <AnimatePresence mode="wait">
            {!isHeroHovered ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'center' }}
              >
                <div><div className="pill">Hacking • Web Dev • IoT</div></div>
                <h2 style={{ marginBottom: 0 }}>Building systems, writing code, and mastering hardware security.</h2>
                
                <div className="social-links" style={{ display: 'flex', gap: '20px', marginTop: '10px', marginBottom: '5px' }}>
                  <motion.a href={socialLinks.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15, color: '#9900ff', filter: 'drop-shadow(0px 0px 8px #9900ff80)' }} style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s ease' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  </motion.a>
                  <motion.a href={socialLinks.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15, color: '#9900ff', filter: 'drop-shadow(0px 0px 8px #9900ff80)' }} style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s ease' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </motion.a>
                  <motion.a href={socialLinks.leetcode} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15, color: '#9900ff', filter: 'drop-shadow(0px 0px 8px #9900ff80)' }} style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s ease' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114l4.282-4.587c.278-.298.665-.453 1.06-.453.395 0 .782.155 1.06.453l8.033 8.604a1.383 1.383 0 0 0 1.951.013 1.378 1.378 0 0 0-.013-1.951L14.453.454A1.374 1.374 0 0 0 13.483 0zM21.5 13.9c-.773 0-1.4.627-1.4 1.4 0 .773.627 1.4 1.4 1.4.773 0 1.4-.627 1.4-1.4 0-.773-.627-1.4-1.4-1.4z"/></svg>
                  </motion.a>
                </div>

                <div className="contact-mini" style={{ marginTop: 'auto' }}>
                  <p><strong>Email:</strong> tamilarasanss.dev@gmail.com</p>
                  <p><strong>Location:</strong> Namakkal, Tamil Nadu, India</p>
                  <p><strong>Focus:</strong> Pen Testing, Web Apps, IoT Hacking</p>
                </div>
                <div 
                  onMouseEnter={() => setIsHeroHovered(true)}
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'rgba(176, 38, 255, 0.1)',
                    border: '1px dashed rgba(176, 38, 255, 0.5)',
                    borderRadius: '12px',
                    color: '#b026ff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'crosshair',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(176, 38, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(176,38,255,0.4)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(176, 38, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Play Games
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%', minHeight: '300px' }}
              >
                <HeroGame onClose={() => setIsHeroHovered(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </header>



      <main className="main-stack">
        
        <section id="about" className="section bento-inner">
          <div className="section-heading">
            <p className="eyebrow">About me</p>
            <h2>A hardcore Ethical Hacker with a passion for secure Web & IoT systems.</h2>
          </div>
          <motion.div 
              className="about-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants} className="bento-inner" style={{ padding: '40px', minHeight: '550px' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--accent)', fontSize: '2rem' }}>Who I Am</h3>
                <p style={{ fontSize: '1.5rem', lineHeight: '1.8', marginBottom: '16px' }}>{state.aboutIntro1}</p>
                <p style={{ fontSize: '1.5rem', lineHeight: '1.8' }}>{state.aboutIntro2}</p>
                
                <div style={{ marginTop: '48px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '1.2rem', color: 'var(--accent)' }}>Core Technologies</h4>
                  <div className="skill-tags" style={{ fontSize: '1.1rem' }}>
                    {state.skills.map((skill, index) => (
                      <motion.span 
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: index * 0.08, 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 15 
                        }}
                        whileHover={{ scale: 1.1, y: -2, backgroundColor: 'rgba(217, 70, 239, 0.4)' }}
                        style={{ color: '#ffffff' }}
                      >{skill}</motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bento-inner" style={{ padding: '40px', display: 'flex', flexDirection: 'column', minHeight: '550px', background: 'transparent' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '2rem', color: 'var(--accent)' }}>Expertise</h3>
                <div className="stats-grid">
                  <div className="stat-card"><strong><AnimatedCounter from={0} to={4} suffix="+" /></strong><span>years of learning and building</span></div>
                  <div className="stat-card"><strong><AnimatedCounter from={0} to={10} suffix="+" /></strong><span>security and web projects</span></div>
                  <div className="stat-card bento-inner" style={{ background: 'transparent' }}><strong>AI</strong><span>automation + model workflows</span></div>
                  <div className="stat-card bento-inner" style={{ background: 'transparent' }}><strong>IoT</strong><span>embedded & real-time systems</span></div>
                </div>
              </motion.div>
            </motion.div>
        </section>

        <section id="resume" className="section bento-inner">
          <div className="section-heading">
            <p className="eyebrow">Resume</p>
            <h2>Education, experience, and technical strengths.</h2>
          </div>
          <motion.div 
                className="resume-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div variants={itemVariants}>
                  <h3 style={{ marginBottom: '24px' }}>Education</h3>
                  <div className="resume-scroll-container">
                    <div className="timeline-track">
                      {state.education.map((item) => (
                        <motion.article 
                          key={item.id} 
                          className="timeline-card"
                          style={{ background: 'transparent', padding: 0, border: 'none', boxShadow: 'none' }}
                          whileHover={{ scale: 1.01, y: -4 }}
                        >
                          <div className="bento-inner" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <h4 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text)' }}>{item.title}</h4>
                            <p className="meta" style={{ fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '12px' }}>{item.school} • {item.year}</p>
                            <p style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>{item.description}</p>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <h3 style={{ marginBottom: '24px' }}>Experience</h3>
                  <div className="resume-scroll-container">
                    <div className="timeline-track">
                      {state.experience.map((item) => (
                        <motion.article 
                          key={item.id} 
                          className="timeline-card"
                          style={{ background: 'transparent', padding: 0, border: 'none', boxShadow: 'none' }}
                          whileHover={{ scale: 1.01, y: -4 }}
                        >
                          <div className="bento-inner" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <h4 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text)' }}>{item.title}</h4>
                            <p className="meta" style={{ fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '12px' }}>{item.year}</p>
                            <p style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>{item.description}</p>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
        </section>

        <section id="insights" className="section bento-inner">
          <div className="section-heading">
            <p className="eyebrow">Dashboard</p>
            <h2>Live Coding Insights</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            
            {/* GITHUB CARD (Purple & Pink Theme) */}
            <div className="bento-inner" style={{ background: 'transparent', padding: '32px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <h3 style={{ margin: 0, background: 'linear-gradient(90deg, #9900ff, #ff26b9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', fontSize: '1.8rem' }}>GitHub Analytics</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="githubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9900ff" />
                      <stop offset="100%" stopColor="#ff26b9" />
                    </linearGradient>
                  </defs>
                  <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                  {!liveStats.loading && (
                    <motion.circle 
                      cx="75" cy="75" r="60" 
                      stroke="#9900ff" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      whileInView={{ strokeDashoffset: (2 * Math.PI * 60) - (Math.min((liveStats.github / 50) * 100, 100) / 100) * (2 * Math.PI * 60) }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                      style={{ filter: 'drop-shadow(0 0 12px rgba(153, 0, 255, 0.6))' }}
                    />
                  )}
                  <text x="75" y="85" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {liveStats.loading ? '...' : liveStats.github}
                  </text>
                </svg>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Projects</span>
              </div>

              {!liveStats.loading && liveStats.topLanguages && liveStats.topLanguages.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.1rem' }}>Top Languages</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {liveStats.topLanguages.map((lang, idx) => {
                      const maxCount = liveStats.topLanguages[0].count;
                      const percentage = (lang.count / maxCount) * 100;
                      return (
                        <div key={lang.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text)' }}>{lang.name}</span>
                            <span style={{ color: '#ff26b9' }}>{lang.count}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #9900ff, #ff26b9)', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!liveStats.loading && liveStats.githubDetails && liveStats.githubDetails.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.1rem' }}>Profile Stats</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {liveStats.githubDetails.map((detail, idx) => {
                      const maxCount = Math.max(...liveStats.githubDetails.map(d => d.count), 1);
                      const percentage = (detail.count / maxCount) * 100;
                      return (
                        <div key={detail.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text)' }}>{detail.name}</span>
                            <span style={{ color: '#9900ff' }}>{detail.count}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #9900ff, #ff26b9)', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* LEETCODE CARD (Yellow & Orange Theme) */}
            <div className="bento-inner" style={{ background: 'transparent', padding: '32px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <h3 style={{ margin: 0, background: 'linear-gradient(90deg, #FFA116, #FF6B00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', fontSize: '1.8rem' }}>LeetCode Analytics</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="leetcodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFA116" />
                      <stop offset="100%" stopColor="#FF6B00" />
                    </linearGradient>
                  </defs>
                  <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                  {!liveStats.loading && (
                    <motion.circle 
                      cx="75" cy="75" r="60" 
                      stroke="url(#leetcodeGradient)" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      whileInView={{ strokeDashoffset: (2 * Math.PI * 60) - (Math.min((liveStats.leetcode / 100) * 100, 100) / 100) * (2 * Math.PI * 60) }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                      style={{ filter: 'drop-shadow(0 0 12px rgba(255, 161, 22, 0.6))' }}
                    />
                  )}
                  <text x="75" y="85" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {liveStats.loading ? '...' : liveStats.leetcode}
                  </text>
                </svg>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Problems Solved</span>
              </div>

              {!liveStats.loading && liveStats.leetcodeDetails && liveStats.leetcodeDetails.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.1rem' }}>Difficulty Breakdown</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {liveStats.leetcodeDetails.map((detail, idx) => {
                      const maxCount = Math.max(...liveStats.leetcodeDetails.map(d => d.count), 1);
                      const percentage = (detail.count / maxCount) * 100;
                      return (
                        <div key={detail.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text)' }}>{detail.name}</span>
                            <span style={{ color: '#FFA116' }}>{detail.count}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #FFA116, #FF6B00)', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        <section id="portfolio" className="section bento-inner">
          <div className="section-heading">
            <p className="eyebrow">Portfolio</p>
            <h2>Featured projects and certifications.</h2>
          </div>

          <div className="filter-row">
            {['all', 'AI & ML', 'Prompt Engineering', 'IoT Projects', 'Ethical Hacking', 'Cybersecurity', 'Web Development', 'Frontend'].map((filter) => (
              <button key={filter} className={`filter-chip ${activeFilter === filter ? 'active' : ''}`} type="button" onClick={() => setActiveFilter(filter)}>{filter === 'all' ? 'All' : filter}</button>
            ))}
          </div>

          <div className="w-full">
            <FeaturedSection projects={filteredProjects} certifications={state.certifications} />
          </div>
        </section>

        {state.researchPapers && state.researchPapers.length > 0 && (
          <section id="research" className="section bento-inner">
            <div className="section-heading">
              <p className="eyebrow">Publications</p>
              <h2>Research Papers & Articles.</h2>
            </div>
            <div className="card-list" style={{ marginTop: '20px' }}>
              {state.researchPapers.map((paper) => (
                <article 
                  key={paper.id} 
                  className="project-card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{paper.title}</h4>
                    <Link to={`/research/${paper.id}`} style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', padding: '4px 10px', background: 'rgba(124, 58, 237, 0.2)', borderRadius: '999px', textDecoration: 'none' }}>View Details</Link>
                  </div>
                  <p className="meta" style={{ margin: 0 }}>{paper.conference} {paper.year ? `• ${paper.year}` : ''}</p>
                  <p style={{ margin: 0, marginTop: '8px' }}>{paper.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="section bento-inner">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Let’s discuss security work, web builds, or collaborative ideas.</h2>
          </div>
          <div className="contact-grid">
            <div className="map-card">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.982745918602!2d80.02158887481073!3d13.324410606040638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba967ab37b30647%3A0xe71bc597ec0cc43d!2sVeppada!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                style={{ width: '100%', height: '100%', minHeight: '400px', border: 0, borderRadius: '12px', filter: 'invert(100%) grayscale(100%) contrast(110%) opacity(0.8)' }}
              />
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="name" placeholder="Full name" required />
              <input type="email" name="email" placeholder="Email address" required />
              <textarea name="message" rows="5" placeholder="Your message" required />
              <button type="submit" disabled={formStatus === 'submitting'} className="btn btn-primary" style={{ cursor: formStatus === 'submitting' ? 'not-allowed' : 'none', opacity: formStatus === 'submitting' ? 0.7 : 1 }}>
                {formStatus === 'submitting' ? 'Sending...' : 'Send message'}
              </button>
              {formStatus === 'success' && <p style={{ color: '#00b8a3', textAlign: 'center', marginTop: '10px' }}>Thank you! Your message has been sent successfully.</p>}
              {formStatus === 'error' && <p style={{ color: '#ff375f', textAlign: 'center', marginTop: '10px' }}>Oops! Something went wrong. Please try again.</p>}
            </form>
          </div>
        </section>
      </main>
      <footer className="footer section">
        <p style={{ textAlign: 'center' }}>© 2026 Tamilarasan S. All rights reserved.</p>
      </footer>
    </motion.div>
    <div className="mobile-bottom-nav">
        <a 
          href="#about" 
          onClick={() => setActiveSection('about')} 
          className={`mobile-nav-item ${activeSection === 'about' ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>Home</span>
        </a>
        <a 
          href="#resume" 
          onClick={() => setActiveSection('resume')} 
          className={`mobile-nav-item ${activeSection === 'resume' ? 'active' : ''}`}
        >
          <FileText size={20} />
          <span>Work</span>
        </a>
        <a 
          href="#insights" 
          onClick={() => setActiveSection('insights')} 
          className={`mobile-nav-item ${activeSection === 'insights' ? 'active' : ''}`}
        >
          <BarChart2 size={20} />
          <span>Stats</span>
        </a>
        <a 
          href="#portfolio" 
          onClick={() => setActiveSection('portfolio')} 
          className={`mobile-nav-item ${activeSection === 'portfolio' ? 'active' : ''}`}
        >
          <Layers size={20} />
          <span>Portfolio</span>
        </a>
        <Link 
          to={state.loggedIn ? "/admin" : "/login"}
          className={`mobile-nav-item`}
        >
          <User size={20} />
          <span>{state.loggedIn ? "Admin" : "Profile"}</span>
        </Link>
      </div>
    </>
  );
}

export default Portfolio;
