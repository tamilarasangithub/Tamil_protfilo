const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const brokenSection = `  margin: 0 0 clamp(20px, 4vw, 30px) 0;
  backdrop-filter: blur(12px);
@tailwind base;`;

const repairedSection = `  margin: 0 0 clamp(20px, 4vw, 30px) 0;
  backdrop-filter: blur(12px);
  transition: transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 300ms ease, box-shadow 300ms ease;
}

.bento-inner::before, .bento-inner::after {
  content: ''; position: absolute; width: 20px; height: 20px;
  border: 2px solid transparent; pointer-events: none; transition: border-color 300ms ease;
}
.bento-inner::before { top: -2px; left: -2px; border-top-color: rgba(176, 38, 255, 0.5); border-left-color: rgba(176, 38, 255, 0.5); border-radius: 16px 0 0 0; }
.bento-inner::after { bottom: -2px; right: -2px; border-bottom-color: rgba(176, 38, 255, 0.5); border-right-color: rgba(176, 38, 255, 0.5); border-radius: 0 0 16px 0; }
.section.bento-inner:hover::before, .section.bento-inner:hover::after { border-color: rgba(176, 38, 255, 1); }

.section.bento-inner:hover {
  transform: scale(1.01) translateY(-4px);
  border-color: rgba(176, 38, 255, 0.7);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(176, 38, 255, 0.1);
}

@tailwind base;`;

css = css.replace(brokenSection, repairedSection);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Fixed CSS syntax error.');
