const fs = require('fs');
const path = require('path');

// 1. Update Portfolio.jsx
const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let portfolioCode = fs.readFileSync(portfolioPath, 'utf8');

// Insert refs and scroll function
if (!portfolioCode.includes('eduScrollRef')) {
  const insertIndex = portfolioCode.indexOf('return (');
  const scrollFunc = `
  const eduScrollRef = useRef(null);
  const expScrollRef = useRef(null);
  
  const scrollVertical = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      const scrollTo = direction === 'up' ? ref.current.scrollTop - scrollAmount : ref.current.scrollTop + scrollAmount;
      ref.current.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
  };

  `;
  portfolioCode = portfolioCode.slice(0, insertIndex) + scrollFunc + portfolioCode.slice(insertIndex);
}

// Replace Education header and container
const eduOld = `                  <h3 style={{ marginBottom: '24px' }}>Education</h3>
                  <div className="resume-scroll-container">`;
const eduNew = `                  <div className="flex justify-between items-center w-full mb-6">
                    <h3 style={{ margin: 0 }}>Education</h3>
                    <div className="flex gap-2">
                      <button onClick={() => scrollVertical(eduScrollRef, 'up')} className="w-8 h-8 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]">↑</button>
                      <button onClick={() => scrollVertical(eduScrollRef, 'down')} className="w-8 h-8 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]">↓</button>
                    </div>
                  </div>
                  <div className="resume-scroll-container" ref={eduScrollRef}>`;
portfolioCode = portfolioCode.replace(eduOld, eduNew);

// Replace Experience header and container
const expOld = `                  <h3 style={{ marginBottom: '24px' }}>Experience</h3>
                  <div className="resume-scroll-container">`;
const expNew = `                  <div className="flex justify-between items-center w-full mb-6">
                    <h3 style={{ margin: 0 }}>Experience</h3>
                    <div className="flex gap-2">
                      <button onClick={() => scrollVertical(expScrollRef, 'up')} className="w-8 h-8 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]">↑</button>
                      <button onClick={() => scrollVertical(expScrollRef, 'down')} className="w-8 h-8 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]">↓</button>
                    </div>
                  </div>
                  <div className="resume-scroll-container" ref={expScrollRef}>`;
portfolioCode = portfolioCode.replace(expOld, expNew);

fs.writeFileSync(portfolioPath, portfolioCode, 'utf8');

// 2. Update index.css to hide scrollbar and enable smooth scroll
const cssPath = path.join(__dirname, 'src', 'index.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const cssOld = '.resume-scroll-container { max-height: 500px; overflow-y: auto; padding-right: 12px; }';
const cssNew = '.resume-scroll-container { max-height: 500px; overflow-y: auto; padding-right: 12px; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }\n.resume-scroll-container::-webkit-scrollbar { display: none; }';
cssCode = cssCode.replace(cssOld, cssNew);

fs.writeFileSync(cssPath, cssCode, 'utf8');

console.log('Vertical slide completed.');
