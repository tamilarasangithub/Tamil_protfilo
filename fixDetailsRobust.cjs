const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Details.jsx');
let lines = fs.readFileSync(targetPath, 'utf8').split('\n');

// 1. Add icons to import
let importIndex = lines.findIndex(line => line.includes("import { ArrowLeft } from 'lucide-react';"));
if (importIndex !== -1) {
  lines[importIndex] = "import { ArrowLeft, Monitor, Tablet, Smartphone } from 'lucide-react';";
}

// 2. Add state
let navIndex = lines.findIndex(line => line.includes("const navigate = useNavigate();"));
if (navIndex !== -1) {
  lines.splice(navIndex + 1, 0, 
    "  const [previewMode, setPreviewMode] = useState('desktop');\n" +
    "  const getPreviewWidth = () => {\n" +
    "    if (previewMode === 'mobile') return '375px';\n" +
    "    if (previewMode === 'tablet') return '768px';\n" +
    "    return '100%';\n" +
    "  };"
  );
}

// 3. Add admin-shell class
let shellIndex = lines.findIndex(line => line.includes('className="page-shell"'));
while(shellIndex !== -1) {
  lines[shellIndex] = lines[shellIndex].replace('className="page-shell"', 'className="page-shell admin-shell"');
  shellIndex = lines.findIndex(line => line.includes('className="page-shell"'));
}

// 4. Find the iframe block
let iframeStart = lines.findIndex(line => line.includes("{/* Live Preview Iframe */}"));
let iframeEnd = lines.findIndex((line, index) => index > iframeStart && line.includes("{/* External Links */}"));

if (iframeStart !== -1 && iframeEnd !== -1) {
  const newBlock = 
`        {/* Live Preview Iframe */}
        {type === 'project' && item.livePreviewUrl && (
          <div style={{ marginTop: '40px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(176, 38, 255, 0.3)', background: 'rgba(255,255,255,0.02)', height: '700px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 20px', background: 'rgba(20, 10, 30, 0.6)', borderBottom: '1px solid rgba(176, 38, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              
              <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Live Preview: {item.livePreviewUrl}
              </span>

              <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  style={{ background: previewMode === 'desktop' ? 'rgba(176, 38, 255, 0.4)' : 'transparent', border: 'none', padding: '6px', borderRadius: '6px', color: previewMode === 'desktop' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex', cursor: 'pointer', zIndex: 100 }}
                >
                  <Monitor size={16} />
                </button>
                <button 
                  onClick={() => setPreviewMode('tablet')}
                  style={{ background: previewMode === 'tablet' ? 'rgba(176, 38, 255, 0.4)' : 'transparent', border: 'none', padding: '6px', borderRadius: '6px', color: previewMode === 'tablet' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex', cursor: 'pointer', zIndex: 100 }}
                >
                  <Tablet size={16} />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  style={{ background: previewMode === 'mobile' ? 'rgba(176, 38, 255, 0.4)' : 'transparent', border: 'none', padding: '6px', borderRadius: '6px', color: previewMode === 'mobile' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex', cursor: 'pointer', zIndex: 100 }}
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnD12T//IylmYEzGqAHRfIIMR1T5H0kBAORqCw+e72XoAAAAAElFTkSuQmCC) repeat', backgroundColor: '#0a0a0a', position: 'relative' }}>
              <div style={{ width: getPreviewWidth(), height: '100%', transition: 'width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)', background: '#fff', borderLeft: '1px solid #333', borderRight: '1px solid #333', boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
                <iframe 
                  src={item.livePreviewUrl} 
                  style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                  title="Live Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
`;

  lines.splice(iframeStart, iframeEnd - iframeStart, newBlock);
}

fs.writeFileSync(targetPath, lines.join('\n'), 'utf8');
console.log('Successfully updated Details.jsx!');
