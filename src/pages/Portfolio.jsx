import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
function Portfolio({ state, setState }) {
  const projectsRef = React.useRef(null);
  const certsRef = React.useRef(null);
  const pubsRef = React.useRef(null);
  const navRef = React.useRef(null);
  const [navWidth, setNavWidth] = useState(580);

  React.useEffect(() => {
    const setupDrag = (slider) => {
      if (!slider) return () => {};
      let isDown = false;
      let startX;
      let scrollLeft;

      const down = (e) => {
        if (e.pointerType !== 'mouse') return;
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };
      const leave = (e) => {
        if (e.pointerType !== 'mouse') return;
        isDown = false;
      };
      const up = (e) => {
        if (e.pointerType !== 'mouse') return;
        isDown = false;
      };
      const move = (e) => {
        if (!isDown || e.pointerType !== 'mouse') return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2.5;
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.addEventListener('pointerdown', down);
      slider.addEventListener('pointerleave', leave);
      slider.addEventListener('pointerup', up);
      slider.addEventListener('pointermove', move);

      return () => {
        slider.removeEventListener('pointerdown', down);
        slider.removeEventListener('pointerleave', leave);
        slider.removeEventListener('pointerup', up);
        slider.removeEventListener('pointermove', move);
      };
    };

    const cleanupProjects = setupDrag(projectsRef.current);
    const cleanupCerts = setupDrag(certsRef.current);
    const cleanupPubs = setupDrag(pubsRef.current);

    return () => {
      cleanupProjects();
      cleanupCerts();
      cleanupPubs();
    };
  }, []);

  React.useEffect(() => {
    if (navRef.current) {
      setNavWidth(navRef.current.offsetWidth + 24); 
    }
  }, [state.loggedIn]);

  const [activeFilter, setActiveFilter] = useState('all');

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="page-shell"
    >


      <nav ref={navRef} className="top-nav card">
        <div className="mobile-menu-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#resume">Resume</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#insights">Insights</a>
          <a href="#contact">Contact</a>
          {state.loggedIn ? (
            <>
              <Link className="nav-cta" to="/admin">Admin</Link>
              <button type="button" className="nav-cta" onClick={handleLogout} style={{marginLeft: '10px'}}>Logout</button>
            </>
          ) : (
            <Link className="nav-cta" to="/login">Login</Link>
          )}
        </div>
      </nav>

      <header className="hero card" style={{ position: 'relative' }}>
        <div className="hero-cutout" style={{ '--nav-width': `${navWidth}px` }}></div>
        <div className="hero-content">

          <p className="eyebrow">Ethical Hacker • IoT Engineer • Web Developer</p>
          <h1 style={{ background: 'linear-gradient(135deg, #fff 0%, #d8b4fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Hi, I’m Tamilarasan S.</h1>
          <p className="hero-text">
            I am a dedicated Penetration Tester, a Full-Stack Web Developer, and an IoT Engineer—bridging the gap between building systems and breaking them.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Let’s connect</a>
            <a className="btn btn-secondary" href="#portfolio">See projects</a>
          </div>
          
          <div className="social-links" style={{ display: 'flex', gap: '20px', marginTop: '25px' }}>
            <motion.a 
              href={socialLinks.github} 
              target="_blank" 
              rel="noreferrer"
              whileHover={{ scale: 1.15, color: '#9900ff', filter: 'drop-shadow(0px 0px 8px #9900ff80)' }}
              style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s ease' }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </motion.a>
            <motion.a 
              href={socialLinks.linkedin} 
              target="_blank" 
              rel="noreferrer"
              whileHover={{ scale: 1.15, color: '#9900ff', filter: 'drop-shadow(0px 0px 8px #9900ff80)' }}
              style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s ease' }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </motion.a>
            <motion.a 
              href={socialLinks.leetcode} 
              target="_blank" 
              rel="noreferrer"
              whileHover={{ scale: 1.15, color: '#9900ff', filter: 'drop-shadow(0px 0px 8px #9900ff80)' }}
              style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.3s ease' }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114l4.282-4.587c.278-.298.665-.453 1.06-.453.395 0 .782.155 1.06.453l8.033 8.604a1.383 1.383 0 0 0 1.951.013 1.378 1.378 0 0 0-.013-1.951L14.453.454A1.374 1.374 0 0 0 13.483 0zM21.5 13.9c-.773 0-1.4.627-1.4 1.4 0 .773.627 1.4 1.4 1.4.773 0 1.4-.627 1.4-1.4 0-.773-.627-1.4-1.4-1.4z"/></svg>
            </motion.a>
          </div>

          <div className="hero-highlights">
            <div className="hero-highlight-card">
              <div className="highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div><strong>Ethical Hacking:</strong> <span style={{color: 'rgba(255,255,255,0.7)'}}>Penetration testing & vulnerability assessment</span></div>
            </div>
            <div className="hero-highlight-card">
              <div className="highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><polyline points="8 13 6 15 8 17"></polyline><polyline points="16 17 18 15 16 13"></polyline><line x1="10" y1="18" x2="14" y2="12"></line></svg>
              </div>
              <div><strong>Web Development:</strong> <span style={{color: 'rgba(255,255,255,0.7)'}}>Secure, modern full-stack web applications</span></div>
            </div>
            <div className="hero-highlight-card">
              <div className="highlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              </div>
              <div><strong>IoT Engineering:</strong> <span style={{color: 'rgba(255,255,255,0.7)'}}>Smart hardware with a focus on IoT Hacking</span></div>
            </div>
          </div>
        </div>

        <aside className="hero-card">
          <div className="pill">Hacking • Web Dev • IoT</div>
          <h2>Building systems, writing code, and mastering hardware security.</h2>
          <div className="contact-mini">
            <p><strong>Email:</strong> tamilarasanss.dev@gmail.com</p>
            <p><strong>Location:</strong> Namakkal, Tamil Nadu, India</p>
            <p><strong>Focus:</strong> Pen Testing, Web Apps, IoT Hacking</p>
          </div>
        </aside>
      </header>



      <main className="main-stack">
        
        <section id="about" className="card section">
          <div className="section-heading">
            <p className="eyebrow">About me</p>
            <h2>A hardcore Ethical Hacker with a passion for secure Web & IoT systems.</h2>
          </div>
          <div className="about-grid">
            <div>
              <p>{state.aboutIntro1}</p>
              <p>{state.aboutIntro2}</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><strong>4+</strong><span>years of learning and building</span></div>
              <div className="stat-card"><strong>10+</strong><span>security and web projects</span></div>
              <div className="stat-card"><strong>AI</strong><span>automation + model workflows</span></div>
              <div className="stat-card"><strong>IoT</strong><span>embedded & real-time systems</span></div>
            </div>
          </div>
          <div className="skills-wrap" style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Core skills</h3>
            <div className="marquee-wrapper">
              <div className="marquee-content">
                {[...state.skills, ...state.skills, ...state.skills, ...state.skills].map((skill, index) => (
                  <span key={index} style={{
                    color: '#fff', 
                    background: 'rgba(124, 58, 237, 0.4)', 
                    padding: '10px 20px', 
                    borderRadius: '999px', 
                    fontSize: '1rem',
                    fontWeight: '500',
                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    whiteSpace: 'nowrap'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="resume" className="card section">
          <div className="section-heading">
            <p className="eyebrow">Resume</p>
            <h2>Education, experience, and technical strengths.</h2>
          </div>
          <div className="resume-grid">
            <div>
              <h3>Education</h3>
              <div className="resume-scroll-container">
                <div className="timeline-track">
                  {(state.education || []).map((edu) => (
                    <div key={edu.id} className="timeline-card">
                      <h4>{edu.title}</h4>
                      <p className="meta">{edu.school} {edu.year ? `• ${edu.year}` : ''}</p>
                      <p>{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3>Experience</h3>
              <div className="resume-scroll-container">
                <div className="timeline-track">
                  {(state.experience || []).map((exp) => (
                    <div key={exp.id} className="timeline-card">
                      <h4>{exp.title}</h4>
                      <p className="meta">{exp.year}</p>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="card section">
          <div className="section-heading">
            <p className="eyebrow">Dashboard</p>
            <h2>Live Coding Insights</h2>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem', marginTop: '3rem', marginBottom: '2rem' }}>
            
            {[
              { label: 'GitHub Projects', count: liveStats.github, color: '#9900ff', max: 50 },
              { label: 'LeetCode Solved', count: liveStats.leetcode, color: '#FFA116', max: 100 }
            ].map((stat, index) => {
              const radius = 60;
              const circumference = 2 * Math.PI * radius;
              // Scale the stroke offset based on a nominal max value so the circle fills partially.
              // If the count exceeds max, cap the visual fill at 100% (or let it stay at max).
              const percent = Math.min((stat.count / stat.max) * 100, 100);
              const strokeDashoffset = circumference - (percent / 100) * circumference;

              return (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 120, damping: 15, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', width: '250px' }}
                >
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle cx="75" cy="75" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                    {!liveStats.loading && (
                      <motion.circle 
                        cx="75" cy="75" r={radius} 
                        stroke={stat.color} 
                        strokeWidth="10" 
                        fill="none" 
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 + (index * 0.15) }}
                        strokeLinecap="round"
                        transform="rotate(-90 75 75)"
                        style={{ filter: `drop-shadow(0 0 10px ${stat.color}80)` }}
                      />
                    )}
                    <text x="75" y="85" textAnchor="middle" fill="#000" fontSize="36" fontWeight="bold">
                      {liveStats.loading ? '...' : stat.count}
                    </text>
                  </svg>
                  <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', textAlign: 'center' }}>{stat.label}</h4>
                </motion.div>
              );
            })}

          </div>

          {!liveStats.loading && liveStats.topLanguages && liveStats.topLanguages.length > 0 && (
            <div style={{ padding: '0 2rem', maxWidth: '800px', margin: '0 auto 2rem auto', width: '100%' }}>
              <h3 style={{ marginBottom: '2rem', color: '#9900ff', textAlign: 'center' }}>Top Languages by GitHub Projects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {liveStats.topLanguages.map((lang, idx) => {
                  const maxCount = liveStats.topLanguages[0].count;
                  const percentage = (lang.count / maxCount) * 100;
                  return (
                    <motion.div 
                      key={lang.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 120, damping: 15, delay: idx * 0.08 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{lang.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{lang.count} {lang.count === 1 ? 'project' : 'projects'}</span>
                      </div>
                      <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, #9900ff, #FFA116)', borderRadius: '6px' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {!liveStats.loading && liveStats.githubDetails && liveStats.githubDetails.length > 0 && (
            <div style={{ padding: '0 2rem', maxWidth: '800px', margin: '2rem auto 0 auto', width: '100%' }}>
              <h3 style={{ marginBottom: '2rem', color: '#00b8a3', textAlign: 'center' }}>GitHub Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {liveStats.githubDetails.map((detail, idx) => {
                  const maxCount = Math.max(...liveStats.githubDetails.map(d => d.count), 1);
                  const percentage = (detail.count / maxCount) * 100;
                  return (
                    <motion.div 
                      key={detail.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 120, damping: 15, delay: idx * 0.08 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{detail.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{detail.count}</span>
                      </div>
                      <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                          style={{ height: '100%', background: detail.color, borderRadius: '6px' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {!liveStats.loading && liveStats.leetcodeDetails && liveStats.leetcodeDetails.length > 0 && (
            <div style={{ padding: '0 2rem', maxWidth: '800px', margin: '2rem auto 3rem auto', width: '100%' }}>
              <h3 style={{ marginBottom: '2rem', color: '#FFA116', textAlign: 'center' }}>LeetCode Problems Solved</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {liveStats.leetcodeDetails.map((detail, idx) => {
                  const maxCount = Math.max(...liveStats.leetcodeDetails.map(d => d.count), 1);
                  const percentage = (detail.count / maxCount) * 100;
                  return (
                    <motion.div 
                      key={detail.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 120, damping: 15, delay: idx * 0.08 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{detail.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{detail.count} {detail.count === 1 ? 'problem' : 'problems'}</span>
                      </div>
                      <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                          style={{ height: '100%', background: detail.color, borderRadius: '6px' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        <section id="portfolio" className="card section">
          <div className="section-heading">
            <p className="eyebrow">Portfolio</p>
            <h2>Featured projects and certifications.</h2>
          </div>

          <div className="filter-row">
            {['all', 'AI & ML', 'Prompt Engineering', 'IoT Projects', 'Ethical Hacking', 'Cybersecurity', 'Web Development', 'Frontend'].map((filter) => (
              <button key={filter} className={`filter-chip ${activeFilter === filter ? 'active' : ''}`} type="button" onClick={() => setActiveFilter(filter)}>{filter === 'all' ? 'All' : filter}</button>
            ))}
          </div>

          <div className="portfolio-grid">
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Projects</h3>
                <div className="slider-nav">
                  <button onClick={() => projectsRef.current.scrollBy({ left: -300, behavior: 'smooth' })} className="slider-btn">←</button>
                  <button onClick={() => projectsRef.current.scrollBy({ left: 300, behavior: 'smooth' })} className="slider-btn">→</button>
                </div>
              </div>
              <div className="card-list" ref={projectsRef}>
                {filteredProjects.map((project) => (
                  <article 
                    key={project.id} 
                    className="project-card"
                  >
                    <div className="pill-tag">{project.category}</div>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <Link to={`/project/${project.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>View details</Link>
                  </article>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Certifications</h3>
                <div className="slider-nav">
                  <button onClick={() => certsRef.current.scrollBy({ left: -300, behavior: 'smooth' })} className="slider-btn">←</button>
                  <button onClick={() => certsRef.current.scrollBy({ left: 300, behavior: 'smooth' })} className="slider-btn">→</button>
                </div>
              </div>
              <div className="card-list" ref={certsRef}>
                {state.certifications.map((cert) => (
                  <article 
                    key={cert.id} 
                    className="cert-card"
                  >
                    {cert.image && (
                      <div className="cert-image-container">
                        <img src={cert.image} alt={cert.title} />
                      </div>
                    )}
                    <h4>{cert.title}</h4>
                    <p className="meta">{cert.issuer}{cert.year ? ` • ${cert.year}` : ''}</p>
                    <p>{cert.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {state.researchPapers && state.researchPapers.length > 0 && (
          <section id="research" className="card section">
            <div className="section-heading">
              <p className="eyebrow">Publications</p>
              <h2>Research Papers & Articles.</h2>
            </div>
            <div className="card-list" ref={pubsRef} style={{ marginTop: '20px' }}>
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

        <section id="contact" className="card section">
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
    </motion.div>
  );
}

export default Portfolio;
