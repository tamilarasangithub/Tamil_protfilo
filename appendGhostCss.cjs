const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src', 'index.css');

const css = `
/* Ghost Buttons (Navbar style) */
.ghost-btn {
  background: transparent !important;
  border: 1px solid transparent !important;
  color: rgba(255, 255, 255, 0.6) !important;
  box-shadow: none !important;
  padding: 8px 16px !important;
  width: auto !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}
.ghost-btn:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
`;

fs.appendFileSync(target, css, 'utf8');
console.log('Appended ghost-btn CSS');
