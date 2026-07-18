const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const anchor = `.stat-card { display: flex; flex-direction: column; gap: 8px; justify-content: center; }`;

const restoreBlock = `
.stat-card strong { font-size: 1.5rem; color: #fff; line-height: 1; font-weight: 700; }
.stat-card span { font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.4; }
.stat-card:hover, .service-card:hover, .timeline-card:hover, .admin-card:hover, .project-card:hover, .cert-card:hover, .card:hover { transform: scale(1.01); border-color: #a855f7; box-shadow: 0 0 0 2px #a855f7, 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2); z-index: 10; background: #040209; }

.cert-image-container { overflow: hidden; border-radius: 12px; height: 180px; margin-bottom: 16px; width: 100%; }
.cert-image-container img { width: 100%; height: 100%; object-fit: cover; display: block; }

.timeline-track { position: relative; margin-top: 14px; }
.timeline-track .timeline-card { position: relative; margin-bottom: 20px; margin-top: 0; }
.timeline-track .timeline-card:last-child { margin-bottom: 0; }

.resume-scroll-container { max-height: 500px; overflow-y: auto; padding-right: 12px; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
.resume-scroll-container::-webkit-scrollbar { display: none; }
`;

const replaceIdx = css.indexOf(anchor);
if (replaceIdx !== -1) {
  css = css.slice(0, replaceIdx + anchor.length) + restoreBlock + css.slice(replaceIdx + anchor.length);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Restored css lines');
} else {
  console.log('Anchor not found');
}
