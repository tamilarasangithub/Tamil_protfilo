const fs = require('fs');
const cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Normalize line endings to LF for precise matching
css = css.replace(/\r\n/g, '\n');

const bentoOld = `.bento-inner {
  position: relative;
  background: radial-gradient(circle at top left, rgba(176, 38, 255, 0.05), rgba(0, 0, 0, 0.8) 80%);
  border: 1px solid rgba(176, 38, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(176, 38, 255, 0.05);
  margin: 0 0 clamp(20px, 4vw, 30px) 0;
  backdrop-filter: blur(12px);
  transition: transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 300ms ease, box-shadow 300ms ease;
}
.bento-inner::before, .bento-inner::after {
  content: ''; position: absolute; width: 20px; height: 20px;
  border: 2px solid transparent; pointer-events: none; transition: border-color 300ms ease;
}
.bento-inner::before { top: -2px; left: -2px; border-top-color: rgba(176, 38, 255, 0.5); border-left-color: rgba(176, 38, 255, 0.5); border-radius: 16px 0 0 0; }
.bento-inner::after { bottom: -2px; right: -2px; border-bottom-color: rgba(176, 38, 255, 0.5); border-right-color: rgba(176, 38, 255, 0.5); border-radius: 0 0 16px 0; }
.bento-inner:hover::before, .bento-inner:hover::after { border-color: rgba(176, 38, 255, 1); }
.bento-inner:hover {
  transform: scale(1.01) translateY(-4px);
  border-color: rgba(176, 38, 255, 0.7);
  box-shadow: 0 0 20px rgba(176, 38, 255, 0.3), inset 0 0 15px rgba(176, 38, 255, 0.15);
}
.section.bento-inner:hover::before, .section.bento-inner:hover::after { border-color: rgba(176, 38, 255, 1); }
.section.bento-inner:hover {
  transform: scale(1.01) translateY(-4px);
  border-color: rgba(176, 38, 255, 0.7);
  box-shadow: 0 0 20px rgba(176, 38, 255, 0.3), inset 0 0 15px rgba(176, 38, 255, 0.15);
}
.bento-inner:not(.section):hover {
  border-color: #a855f7 !important;
  box-shadow: 0 0 0 2px #a855f7, 0 4px 12px rgba(168, 85, 247, 0.2) !important;
}
.bento-inner:not(.section):hover::before, .bento-inner:not(.section):hover::after {
  border-color: rgba(176, 38, 255, 1);
}`;

const bentoNew = `.bento-inner {
  position: relative;
  background: radial-gradient(circle at top left, rgba(176, 38, 255, 0.05), rgba(0, 0, 0, 0.8) 80%);
  border: 1px solid rgba(176, 38, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(176, 38, 255, 0.05);
  margin: 0 0 clamp(20px, 4vw, 30px) 0;
  backdrop-filter: blur(12px);
  transition: transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 300ms ease, box-shadow 300ms ease;
}
.section.bento-inner::before, .section.bento-inner::after {
  content: ''; position: absolute; width: 20px; height: 20px;
  border: 2px solid transparent; pointer-events: none; transition: border-color 300ms ease;
}
.section.bento-inner::before { top: -2px; left: -2px; border-top-color: rgba(176, 38, 255, 0.5); border-left-color: rgba(176, 38, 255, 0.5); border-radius: 16px 0 0 0; }
.section.bento-inner::after { bottom: -2px; right: -2px; border-bottom-color: rgba(176, 38, 255, 0.5); border-right-color: rgba(176, 38, 255, 0.5); border-radius: 0 0 16px 0; }
.section.bento-inner:hover::before, .section.bento-inner:hover::after { border-color: rgba(176, 38, 255, 1); }
.section.bento-inner:hover {
  transform: scale(1.01) translateY(-4px);
  border-color: rgba(176, 38, 255, 0.7);
  box-shadow: 0 0 20px rgba(176, 38, 255, 0.3), inset 0 0 15px rgba(176, 38, 255, 0.15);
}
.bento-inner:not(.section):hover {
  transform: scale(1.01) !important;
  border-color: #a855f7 !important;
  box-shadow: 0 0 0 2px #a855f7, 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2) !important;
  z-index: 10 !important;
  background: #040209 !important;
}`;

if(css.includes(bentoOld)) {
   css = css.replace(bentoOld, bentoNew);
   console.log('Successfully replaced bento-inner blocks!');
} else {
   console.log('bentoOld string not found in file!');
}

fs.writeFileSync(cssPath, css, 'utf8');
