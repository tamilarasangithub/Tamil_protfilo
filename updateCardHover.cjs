const fs = require('fs');

const cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Remove outline from hero-highlight-card
const heroOld = `.hero-highlight-card { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4); padding: 12px 16px; border-radius: 14px; display: flex; align-items: center; gap: 14px; transition: transform 300ms ease, background 300ms ease, border-color 300ms ease, box-shadow 300ms ease; font-size: 0.95rem; }`;
const heroNew = `.hero-highlight-card { background: rgba(0, 0, 0, 0.3); border: none; box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4); padding: 12px 16px; border-radius: 14px; display: flex; align-items: center; gap: 14px; transition: transform 300ms ease, background 300ms ease, box-shadow 300ms ease; font-size: 0.95rem; }`;
css = css.replace(heroOld, heroNew);

const heroHoverOld = `.hero-highlight-card:hover { background: rgba(20, 10, 30, 0.6); transform: translateX(6px); border-color: rgba(176, 38, 255, 0.3); box-shadow: inset 0 1px 1px rgba(176, 38, 255, 0.2), 0 8px 20px rgba(176, 38, 255, 0.15); }`;
const heroHoverNew = `.hero-highlight-card:hover { background: rgba(20, 10, 30, 0.6); transform: translateX(6px); box-shadow: inset 0 1px 1px rgba(176, 38, 255, 0.2), 0 8px 20px rgba(176, 38, 255, 0.15); }`;
css = css.replace(heroHoverOld, heroHoverNew);

// 2. Update bento-inner brackets and hover logic
const bentoOld = `.bento-inner::before, .bento-inner::after {
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

const bentoNew = `.section.bento-inner::before, .section.bento-inner::after {
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
css = css.replace(bentoOld, bentoNew);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS card tweaks applied successfully.');
