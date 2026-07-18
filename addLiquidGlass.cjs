const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const liquidGlassCSS = `
/* Liquid Glass Effect */
.liquid-glass {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(24px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5) !important;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2), 
    inset 0 -2px 6px rgba(0, 0, 0, 0.4), 
    0 12px 32px 0 rgba(0, 0, 0, 0.4) !important;
  border-radius: 9999px !important;
  color: #fff !important;
  transition: all 0.3s ease !important;
}

.liquid-glass:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  box-shadow: 
    inset 0 2px 6px rgba(255, 255, 255, 0.3), 
    inset 0 -2px 6px rgba(0, 0, 0, 0.5), 
    0 16px 40px 0 rgba(0, 0, 0, 0.5) !important;
}
`;

if (!css.includes('.liquid-glass {')) {
  css += '\n' + liquidGlassCSS;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Liquid Glass CSS added.');
} else {
  console.log('Liquid Glass CSS already exists.');
}
