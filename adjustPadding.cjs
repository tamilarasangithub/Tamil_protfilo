const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

// Increase About section card padding
content = content.replace(/style={{ padding: '32px' }}/g, "style={{ padding: '40px' }}");
content = content.replace(/style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}/g, "style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}");

// Increase Resume section card padding
content = content.replace(/style={{ padding: '16px', border: '1px solid rgba\(255, 255, 255, 0.05\)' }}/g, "style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}");

fs.writeFileSync(portfolioPath, content, 'utf8');
console.log('Padding adjusted.');
