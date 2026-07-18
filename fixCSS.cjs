const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Repair the bento-inner damage
const brokenRegex = /backdrop-filter: blur\(12px\);\n@tailwind base;[\s\S]*?\.section\.bento-inner:hover \{/m;
const repaired = `backdrop-filter: blur(12px);
  transition: transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 300ms ease, box-shadow 300ms ease;
}
.bento-inner::before, .bento-inner::after {
  content: ''; position: absolute; width: 20px; height: 20px;
  border: 2px solid transparent; pointer-events: none; transition: border-color 300ms ease;
}
.bento-inner::before { top: -2px; left: -2px; border-top-color: rgba(176, 38, 255, 0.5); border-left-color: rgba(176, 38, 255, 0.5); border-radius: 16px 0 0 0; }
.bento-inner::after { bottom: -2px; right: -2px; border-bottom-color: rgba(176, 38, 255, 0.5); border-right-color: rgba(176, 38, 255, 0.5); border-radius: 0 0 16px 0; }
.section.bento-inner:hover::before, .section.bento-inner:hover::after { border-color: rgba(176, 38, 255, 1); }
.section.bento-inner:hover {`;
css = css.replace(brokenRegex, repaired);

// 2. Update .skill-tags span to match reference image (Dark Pill)
const oldSkillTagsRegex = /\.skill-tags span, \.meta, \.pill-tag \{ color: var\(--accent\); background: rgba\(124, 58, 237, 0\.1\); padding: 7px 10px; border-radius: 999px; font-size: 0\.9rem; \}/;
const newSkillTags = `.meta, .pill-tag { color: var(--accent); background: rgba(124, 58, 237, 0.1); padding: 7px 10px; border-radius: 999px; font-size: 0.9rem; }
.skill-tags span { display: inline-block; padding: 10px 24px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 9999px; color: #fff; font-size: 1.1rem; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all 0.3s ease; cursor: pointer; }
.skill-tags span:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.4); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }`;
css = css.replace(oldSkillTagsRegex, newSkillTags);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS fixed and skill tags updated.');
