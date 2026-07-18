const fs = require('fs');
const { execSync } = require('child_process');

console.log('Resetting index.css...');
execSync('git checkout src/index.css');

const scripts = [
    'appendCss.cjs',
    'appendBtnCss.cjs',
    'appendGhostCss.cjs',
    'fixCssCrash.cjs',
    'refineUI.cjs',
    'refineUIFix.cjs',
    'addLiquidGlass.cjs'
];

for (const script of scripts) {
  console.log('Running ' + script);
  execSync('node ' + script);
}

// Append compactAdmin CSS
let css = fs.readFileSync('src/index.css', 'utf8');
css += `
/* Admin Dashboard Compact Mode */
.admin-shell { max-width: 1700px !important; width: 96% !important; }
.admin-shell h2 { font-size: 1.6rem !important; }
.admin-shell h3 { font-size: 1.2rem !important; }
.admin-shell h4 { font-size: 1.05rem !important; }
.admin-shell p, .admin-shell input, .admin-shell textarea, .admin-shell .meta { font-size: 0.9rem !important; }
.admin-shell .bento-inner { padding: 20px !important; }
.admin-shell .project-card, .admin-shell .cert-card { padding: 20px !important; }
.admin-shell .btn { padding: 10px 16px !important; font-size: 0.9rem !important; }
.admin-shell .ghost-btn { padding: 6px 12px !important; font-size: 0.85rem !important; }
`;
fs.writeFileSync('src/index.css', css, 'utf8');

console.log('Applying manual edits from transcript...');
const transcriptPath = 'C:\\Users\\tamil\\.gemini\\antigravity\\brain\\86757859-adb9-4c62-af4b-5e822698ca62\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

for (const line of lines) {
  if (line.includes('"TargetFile":"\\"c:\\\\\\\\Users\\\\\\\\tamil\\\\\\\\Downloads\\\\\\\\new protfilo\\\\\\\\src\\\\\\\\index.css\\""')) {
    try {
      const parsed = JSON.parse(line);
      const toolCalls = parsed.tool_calls || [];
      for (const call of toolCalls) {
        if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
          if (call.args.TargetFile.includes('index.css')) {
            const desc = call.args.Description;
            
            // Stop parsing if we hit the bad update
            if (desc === 'Update skill tags styling to match reference image' || desc === 'Fix unclosed CSS block') {
                console.log('Reached post-12:51 edits. Stopping parsing.');
                process.exit(0);
            }

            console.log('Applying: ' + desc);
            const chunks = JSON.parse(call.args.ReplacementChunks);
            let currentCss = fs.readFileSync('src/index.css', 'utf8');
            for (const chunk of chunks) {
               currentCss = currentCss.replace(chunk.TargetContent, chunk.ReplacementContent);
            }
            fs.writeFileSync('src/index.css', currentCss, 'utf8');
            
            if (desc === 'Hide visible slide line in Portfolio section') {
                 console.log('Finished applying up to exactly 12:51 AM!');
                 process.exit(0);
            }
          }
        }
      }
    } catch (e) {}
  }
}
