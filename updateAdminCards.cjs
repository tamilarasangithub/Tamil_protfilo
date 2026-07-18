const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(adminPath, 'utf8');

content = content.replace(/className="project-card">/g, 'className="project-card bento-inner" style={{ background: \'transparent\' }}>');
content = content.replace(/className="cert-card">/g, 'className="cert-card bento-inner" style={{ background: \'transparent\' }}>');

content = content.replace(/className="project-card" style={{ height: 'fit-content' }}>/g, 'className="project-card bento-inner" style={{ height: \'fit-content\', background: \'transparent\' }}>');
content = content.replace(/className="cert-card" style={{ height: 'fit-content' }}>/g, 'className="cert-card bento-inner" style={{ height: \'fit-content\', background: \'transparent\' }}>');

fs.writeFileSync(adminPath, content, 'utf8');
console.log('Updated AdminDashboard.jsx cards');
