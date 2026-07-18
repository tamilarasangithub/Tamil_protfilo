const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

// Revert inner stat-cards to solid
content = content.replace(
  /<div className="stat-card" style={{ background: 'transparent' }}>/g,
  '<div className="stat-card">'
);

// Make the main Outside cards transparent
content = content.replace(
  /className="bento-inner" style={{ padding: '40px', minHeight: '550px' }}/g,
  "className=\"bento-inner\" style={{ padding: '40px', minHeight: '550px', background: 'transparent' }}"
);
content = content.replace(
  /className="bento-inner" style={{ padding: '40px', display: 'flex', flexDirection: 'column', minHeight: '550px' }}/g,
  "className=\"bento-inner\" style={{ padding: '40px', display: 'flex', flexDirection: 'column', minHeight: '550px', background: 'transparent' }}"
);

fs.writeFileSync(portfolioPath, content, 'utf8');
console.log('Outside cards made transparent, inner cards reverted to solid.');
