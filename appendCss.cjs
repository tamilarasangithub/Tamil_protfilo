const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src', 'index.css');

const css = `
/* Modal Editing Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #0d0d12;
  border: 1px solid rgba(176, 38, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-content.large {
  max-width: 900px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px;
}

.modal-close:hover {
  color: #fff;
}

/* Custom scrollbar for modal */
.modal-content::-webkit-scrollbar {
  width: 6px;
}
.modal-content::-webkit-scrollbar-track {
  background: transparent;
}
.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(176, 38, 255, 0.3);
  border-radius: 10px;
}
.modal-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(176, 38, 255, 0.6);
}
`;

fs.appendFileSync(target, css, 'utf8');
console.log('Appended CSS to index.css');
