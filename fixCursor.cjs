const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// The old CustomCursor component
const oldCursorStart = "function CustomCursor() {";
const oldCursorEnd = "  );\n}";

const newCursor = `function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateMousePosition = e => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Check if iframe was focused
    window.addEventListener('blur', () => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        setIsVisible(false);
      }
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '8px', height: '8px',
          backgroundColor: '#b026ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px #b026ff',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease'
        }}
        animate={{ 
          x: mousePosition.x - 4, 
          y: mousePosition.y - 4,
          scale: isClicking ? 0.5 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      <motion.div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '32px', height: '32px',
          border: '1px solid rgba(176, 38, 255, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease'
        }}
        animate={{ 
          x: mousePosition.x - 16, 
          y: mousePosition.y - 16,
          scale: isClicking ? 1.5 : 1
        }}
        transition={{ type: 'spring', mass: 0.05, stiffness: 400, damping: 25 }}
      />
    </>
  );
}`;

let startIdx = content.indexOf(oldCursorStart);
let endIdx = content.indexOf(oldCursorEnd, startIdx) + oldCursorEnd.length;

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + newCursor + content.slice(endIdx);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('App.jsx cursor updated');
} else {
  console.log('Could not find cursor component');
}
