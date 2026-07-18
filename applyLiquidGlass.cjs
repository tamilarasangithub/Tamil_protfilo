const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

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
  fs.writeFileSync(cssPath, css, 'utf8');
}

// Now update Chatbot.jsx to use liquid-glass
const chatbotPath = path.join(__dirname, 'src', 'components', 'Chatbot.jsx');
let chatbot = fs.readFileSync(chatbotPath, 'utf8');

// Inject liquid-glass to Chatbot window
chatbot = chatbot.replace(
  /className="mb-4 w-\[340px\] h-\[480px\] bg-\[rgba\(20,10,30,0\.4\)\] border border-\[rgba\(176,38,255,0\.4\)\] rounded-\[20px\] shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.5\),inset_0_1px_1px_rgba\(176,38,255,0\.2\)\] flex flex-col overflow-hidden backdrop-blur-\[20px\] backdrop-saturate-\[180\%\]"/g,
  'className="mb-4 w-[340px] h-[480px] liquid-glass rounded-[24px] flex flex-col overflow-hidden"'
);

// Inject liquid-glass to Chatbot toggle button
chatbot = chatbot.replace(
  /className="w-14 h-14 rounded-full bg-\[rgba\(20,10,30,0\.4\)\] backdrop-blur-\[20px\] backdrop-saturate-\[180\%\] border border-\[rgba\(176,38,255,0\.4\)\] text-white flex items-center justify-center shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.5\),inset_0_1px_1px_rgba\(176,38,255,0\.2\)\] cursor-pointer hover:shadow-\[0_8px_32px_0_rgba\(176,38,255,0\.3\),inset_0_1px_1px_rgba\(176,38,255,0\.4\)\] transition-all"/g,
  'className="w-14 h-14 rounded-full liquid-glass text-white flex items-center justify-center cursor-pointer transition-all"'
);

// Make the chatbot header transparent so the glass shines through
chatbot = chatbot.replace(
  /className="flex items-center justify-between p-4 bg-transparent border-b border-white\/10"/g,
  'className="flex items-center justify-between p-4 border-b border-white/20"'
);

fs.writeFileSync(chatbotPath, chatbot, 'utf8');
console.log('Liquid glass applied everywhere.');
