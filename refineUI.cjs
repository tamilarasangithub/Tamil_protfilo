const fs = require('fs');
const path = require('path');

// 1. Update index.css
const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Change body font to Outfit
css = css.replace(/font-family: 'Rajdhani', sans-serif;/g, function(match, offset, string) {
  // Only replace the one inside the html, body block
  if (string.substring(Math.max(0, offset - 100), offset).includes('html, body {')) {
    return "font-family: 'Outfit', sans-serif;";
  }
  return match;
});

// Add input/button font rule if not present
if (!css.includes('button, input, textarea { font-family: \'Outfit\', sans-serif; }')) {
  css += '\nbutton, input, textarea { font-family: \'Outfit\', sans-serif; }\n';
}
fs.writeFileSync(cssPath, css, 'utf8');

// 2. Update Portfolio.jsx
const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let portfolio = fs.readFileSync(portfolioPath, 'utf8');

// Update imports
if (!portfolio.includes('useInView') || !portfolio.includes('animate')) {
  portfolio = portfolio.replace(/import { motion, AnimatePresence } from 'framer-motion';/, "import { motion, AnimatePresence, useInView, animate } from 'framer-motion';");
}

// Inject AnimatedCounter component
const counterComponent = `
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
            nodeRef.current.textContent = \`\${prefix}\${Math.round(value)}\${suffix}\`;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
};
`;

if (!portfolio.includes('AnimatedCounter =')) {
  portfolio = portfolio.replace('export const Portfolio = () => {', counterComponent + '\nexport const Portfolio = () => {');
}

// Update Hero Highlight Cards to bento-inner
portfolio = portfolio.replace(/className="hero-highlight-card"/g, 'className="hero-highlight-card bento-inner" style={{ background: \'transparent\' }}');

// Update Stat Cards to bento-inner and add animations
portfolio = portfolio.replace(
  /<div className="stat-card"><strong>4\+<\/strong>/,
  '<div className="stat-card bento-inner" style={{ background: \'transparent\' }}><strong><AnimatedCounter from={0} to={4} suffix="+" /></strong>'
);
portfolio = portfolio.replace(
  /<div className="stat-card"><strong>10\+<\/strong>/,
  '<div className="stat-card bento-inner" style={{ background: \'transparent\' }}><strong><AnimatedCounter from={0} to={10} suffix="+" /></strong>'
);

// Catch remaining non-animated stat cards to make them bento-inner
portfolio = portfolio.replace(/<div className="stat-card"><strong>AI<\/strong>/g, '<div className="stat-card bento-inner" style={{ background: \'transparent\' }}><strong>AI</strong>');
portfolio = portfolio.replace(/<div className="stat-card"><strong>IoT<\/strong>/g, '<div className="stat-card bento-inner" style={{ background: \'transparent\' }}><strong>IoT</strong>');

fs.writeFileSync(portfolioPath, portfolio, 'utf8');
console.log('UI refined and animations added.');
