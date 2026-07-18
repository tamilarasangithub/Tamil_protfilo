const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Font fixes
css = css.replace(/font-family: 'Rajdhani', sans-serif;/g, "font-family: 'Outfit', sans-serif;");
if (!css.includes("h1, h2, h3, h4, h5, h6, .brand-text")) {
  css += "\nh1, h2, h3, h4, h5, h6, .brand-text { font-family: 'Rajdhani', sans-serif !important; }\n";
  css += "input, textarea, button, select { font-family: 'Outfit', sans-serif; }\n";
}

// 2. Fix stat-card strong
css = css.replace(
  /\.stat-card strong \{ font-size: 1\.8rem; color: #fff; line-height: 1; font-weight: 700; \}/g,
  ".stat-card strong { font-size: 1.8rem; color: var(--accent); line-height: 1; font-weight: 700; }"
);

// 3. Fix scrollbar line
css = css.replace(
  /\.cyber-scrollbar-x::-webkit-scrollbar \{ height: 4px; \}/g,
  ".cyber-scrollbar-x { scrollbar-width: none; -ms-overflow-style: none; }\n.cyber-scrollbar-x::-webkit-scrollbar { display: none; }"
);

// 4. Fix skill-tags to match image
const oldSkillTagsRegex = /\.skill-tags span, \.meta, \.pill-tag \{ color: var\(--accent\); background: rgba\(124, 58, 237, 0\.1\); padding: 7px 10px; border-radius: 999px; font-size: 0\.9rem; \}/;
const newSkillTags = `.meta, .pill-tag { color: var(--accent); background: rgba(124, 58, 237, 0.1); padding: 7px 10px; border-radius: 999px; font-size: 0.9rem; }
.skill-tags span { display: inline-block; padding: 10px 24px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 9999px; color: #fff; font-size: 1.1rem; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all 0.3s ease; cursor: pointer; }
.skill-tags span:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.4); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }`;
css = css.replace(oldSkillTagsRegex, newSkillTags);

// 5. Add Liquid Glass
const liquidGlassCSS = `
/* Liquid Glass Effect */
.liquid-glass, .top-nav, .mobile-bottom-nav {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(24px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5) !important;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2), 
    inset 0 -2px 6px rgba(0, 0, 0, 0.4), 
    0 12px 32px 0 rgba(0, 0, 0, 0.4) !important;
  color: #fff !important;
  transition: all 0.3s ease !important;
}
.top-nav { border-radius: 9999px !important; }
.liquid-glass:hover, .top-nav:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  box-shadow: 
    inset 0 2px 6px rgba(255, 255, 255, 0.3), 
    inset 0 -2px 6px rgba(0, 0, 0, 0.5), 
    0 16px 40px 0 rgba(0, 0, 0, 0.5) !important;
}
`;
if (!css.includes('.liquid-glass')) {
  css += '\n' + liquidGlassCSS;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Restoration complete!');
