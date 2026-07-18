const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update page-shell to include admin-shell
content = content.replace(
  '        className="page-shell"',
  '        className="page-shell admin-shell"'
);

// 2. Center the copyright text
content = content.replace(
  '<p>© 2026 Tamilarasan S. All rights reserved.</p>',
  '<p style={{ textAlign: \'center\' }}>© 2026 Tamilarasan S. All rights reserved.</p>'
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated Portfolio.jsx!');
