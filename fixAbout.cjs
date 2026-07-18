const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

// 1. Fix uneven text size in AnimatedCounter
// It currently returns <span ref={nodeRef}>{prefix}{from}{suffix}</span>
// But .stat-card span has font-size: 1rem, which overrides the <strong>.
// We will change it to return <span ref={nodeRef} style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
content = content.replace(
  /<span ref={nodeRef}>{prefix}{from}{suffix}<\/span>/g,
  '<span ref={nodeRef} style={{ fontSize: \'inherit\', fontWeight: \'inherit\', color: \'inherit\' }}>{prefix}{from}{suffix}</span>'
);

// 2. Increase the intro text size further
content = content.replace(/fontSize: '1\.15rem'/g, "fontSize: '1.25rem'");

// 3. Revert stat cards back to solid design
content = content.replace(
  /<div className="stat-card bento-inner" style={{ background: 'transparent' }}>/g,
  '<div className="stat-card">'
);

fs.writeFileSync(portfolioPath, content, 'utf8');
console.log('About section fixes applied.');
