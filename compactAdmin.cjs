const fs = require('fs');
const path = require('path');

const cssTarget = path.join(__dirname, 'src', 'index.css');
const jsxTarget = path.join(__dirname, 'src', 'pages', 'AdminDashboard.jsx');

// Append CSS
const css = `
/* Admin Dashboard Compact Mode */
.admin-shell {
  max-width: 1700px !important;
  width: 96% !important;
}
.admin-shell h2 {
  font-size: 1.6rem !important;
}
.admin-shell h3 {
  font-size: 1.2rem !important;
}
.admin-shell h4 {
  font-size: 1.05rem !important;
}
.admin-shell p, .admin-shell input, .admin-shell textarea, .admin-shell .meta {
  font-size: 0.9rem !important;
}
.admin-shell .bento-inner {
  padding: 20px !important;
}
.admin-shell .project-card, .admin-shell .cert-card {
  padding: 20px !important;
}
.admin-shell .btn {
  padding: 10px 16px !important;
  font-size: 0.9rem !important;
}
.admin-shell .ghost-btn {
  padding: 6px 12px !important;
  font-size: 0.85rem !important;
}
`;
fs.appendFileSync(cssTarget, css, 'utf8');

// Update JSX inline styles
let jsx = fs.readFileSync(jsxTarget, 'utf8');
jsx = jsx.replace(/className="page-shell"/g, 'className="page-shell admin-shell"');
jsx = jsx.replace(
  /const sectionStyle = \{ position: 'relative', marginBottom: '60px', padding: '24px',/g,
  `const sectionStyle = { position: 'relative', marginBottom: '40px', padding: '20px',`
);
fs.writeFileSync(jsxTarget, jsx, 'utf8');

console.log('Admin dashboard is now wider and more compact!');
