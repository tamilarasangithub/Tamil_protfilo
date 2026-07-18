const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

const correctTop = `import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, BarChart2, User, Mail, FileText, Layers } from 'lucide-react';
import { FeaturedSection } from '../components/FeaturedSection';

function Portfolio({ state, setState }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [activeFilter, setActiveFilter] = useState('all');

  const eduScrollRef = useRef(null);
  const expScrollRef = useRef(null);
  
  const scrollVertical = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
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
  }, [activeFilter, state.projects]);`;

// find where "const handleLogout =" starts
const splitIndex = content.indexOf('  const handleLogout = () => {');
if (splitIndex !== -1) {
  content = correctTop + '\n\n' + content.slice(splitIndex);
  fs.writeFileSync(portfolioPath, content, 'utf8');
  console.log('Fixed Portfolio.jsx');
} else {
  console.log('Could not find handleLogout');
}
