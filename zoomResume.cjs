const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

// Update Education text
content = content.replace(
  /<h4>{item\.title}<\/h4>\s*<p className="meta">{item\.school} • {item\.year}<\/p>\s*<p>{item\.description}<\/p>/g,
  `<h4 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text)' }}>{item.title}</h4>
                            <p className="meta" style={{ fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '12px' }}>{item.school} • {item.year}</p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.7' }}>{item.description}</p>`
);

// Update Experience text
content = content.replace(
  /<h4>{item\.title}<\/h4>\s*<p className="meta">{item\.year}<\/p>\s*<p>{item\.description}<\/p>/g,
  `<h4 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text)' }}>{item.title}</h4>
                            <p className="meta" style={{ fontSize: '1.05rem', color: 'var(--accent)', marginBottom: '12px' }}>{item.year}</p>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.7' }}>{item.description}</p>`
);

fs.writeFileSync(portfolioPath, content, 'utf8');
console.log('Resume text zoomed.');
