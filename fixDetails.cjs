const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Details.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace(/className="page-shell"/g, 'className="page-shell admin-shell"');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated Details.jsx!');
