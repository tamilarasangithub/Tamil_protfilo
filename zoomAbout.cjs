const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

// Add minHeight to About cards
content = content.replace(
  /className="bento-inner" style={{ padding: '40px' }}/g, 
  "className=\"bento-inner\" style={{ padding: '40px', minHeight: '550px' }}"
);
content = content.replace(
  /className="bento-inner" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}/g, 
  "className=\"bento-inner\" style={{ padding: '40px', display: 'flex', flexDirection: 'column', minHeight: '550px' }}"
);

// Increase font size of <p> in About section
content = content.replace(/<p>{state\.aboutIntro1}<\/p>/g, "<p style={{ fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '16px' }}>{state.aboutIntro1}</p>");
content = content.replace(/<p>{state\.aboutIntro2}<\/p>/g, "<p style={{ fontSize: '1.15rem', lineHeight: '1.7' }}>{state.aboutIntro2}</p>");

// Increase font size of Who I am and Expertise headings
content = content.replace(/<h3 style={{ marginBottom: '16px', color: 'var\(--accent\)' }}>Who I Am<\/h3>/g, "<h3 style={{ marginBottom: '16px', color: 'var(--accent)', fontSize: '2rem' }}>Who I Am</h3>");
content = content.replace(/<h3 style={{ marginBottom: '24px' }}>Expertise<\/h3>/g, "<h3 style={{ marginBottom: '24px', fontSize: '2rem' }}>Expertise</h3>");

// Increase font size of skill tags
content = content.replace(
  /className="skill-tags"/g, 
  "className=\"skill-tags\" style={{ fontSize: '1.1rem' }}"
);

fs.writeFileSync(portfolioPath, content, 'utf8');
console.log('About section zoomed and height increased.');
