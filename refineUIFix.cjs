const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let portfolio = fs.readFileSync(portfolioPath, 'utf8');

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

if (!portfolio.includes('const AnimatedCounter =')) {
  portfolio = portfolio.replace('function Portfolio({ state, setState }) {', counterComponent + 'function Portfolio({ state, setState }) {');
  fs.writeFileSync(portfolioPath, portfolio, 'utf8');
  console.log('Fixed AnimatedCounter injection.');
} else {
  console.log('AnimatedCounter already exists.');
}
