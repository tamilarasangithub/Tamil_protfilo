const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Remove the entire <button> inside the Edit {title} header div
content = content.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' \}\}>\s*<h3 style=\{\{ margin: 0 \}\}>Edit \{title\}<\/h3>\s*<button[\s\S]*?<\/button>\s*<\/div>/g,
  `<div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Edit {title}</h3>
            </div>`
);

// 2. Remove the form-level Cancel buttons
content = content.replace(/\{editingId\.\w+ && <button type="button" onClick=\{[^}]+\} className="btn btn-secondary">Cancel<\/button>\}/g, '');

// 3. Change 'Update [Category]' to 'Update'
content = content.replace(
  /(editingId\.\w+ \? )'Update [^']+'( : 'Add [^']+')/g,
  `$1'Update'$2`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully applied button text updates and removed redundant close buttons.');
