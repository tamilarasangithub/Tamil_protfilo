const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src', 'index.css');

const css = `
/* Slide Control Buttons */
.slide-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.slide-btn:hover:not(:disabled) {
  color: #fff;
  transform: scale(1.2);
}

.slide-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}
`;

fs.appendFileSync(target, css, 'utf8');
console.log('Appended slide-btn CSS to index.css');
