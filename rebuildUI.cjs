const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting full UI rebuild to 12:51 AM state...');

try {
  // 1. Reset file to baseline
  execSync('git checkout src/index.css');
  console.log('Git checkout successful.');

  // 2. Run all CSS modification scripts in exact chronological order
  const scriptsToRun = [
    'appendCss.cjs',
    'appendBtnCss.cjs',
    'appendGhostCss.cjs',
    'fixCssCrash.cjs',
    'refineUI.cjs',
    'refineUIFix.cjs',
    'addLiquidGlass.cjs'
  ];

  for (const script of scriptsToRun) {
    if (fs.existsSync(script)) {
      console.log(`Running ${script}...`);
      execSync(`node ${script}`);
    } else {
      console.log(`Warning: ${script} not found!`);
    }
  }

  // 3. Apply the 12:51 AM scrollbar fix
  const cssPath = 'src/index.css';
  let css = fs.readFileSync(cssPath, 'utf8');
  
  css = css.replace(
    /\.cyber-scrollbar-x::-webkit-scrollbar \{ height: 4px; \}/g,
    ".cyber-scrollbar-x { scrollbar-width: none; -ms-overflow-style: none; }\n.cyber-scrollbar-x::-webkit-scrollbar { display: none; }"
  );
  
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Scrollbar fix applied.');

  console.log('UI perfectly restored to 12:51 AM state!');
} catch (e) {
  console.error('Error during rebuild:', e.message);
}
