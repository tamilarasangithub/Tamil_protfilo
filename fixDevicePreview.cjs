const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'Details.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update imports
content = content.replace(
  "import { ArrowLeft } from 'lucide-react';",
  "import { ArrowLeft, Monitor, Tablet, Smartphone } from 'lucide-react';"
);

// 2. Add state for preview mode
content = content.replace(
  "  const navigate = useNavigate();",
  "  const navigate = useNavigate();\n  const [previewMode, setPreviewMode] = useState('desktop');\n\n  const getPreviewWidth = () => {\n    if (previewMode === 'mobile') return '375px';\n    if (previewMode === 'tablet') return '768px';\n    return '100%';\n  };"
);

// 3. Update the Live Preview block
const oldPreviewBlock = 
`        {/* Live Preview Iframe */}
        {type === 'project' && item.livePreviewUrl && (
          <div style={{ marginTop: '40px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(176, 38, 255, 0.3)', background: 'rgba(255,255,255,0.02)', height: '600px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '12px 20px', background: 'rgba(20, 10, 30, 0.6)', borderBottom: '1px solid rgba(176, 38, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>Live Preview: {item.livePreviewUrl}</span>
            </div>
            <iframe 
              src={item.livePreviewUrl} 
              style={{ width: '100%', height: 'calc(100% - 45px)', border: 'none' }}
              title="Live Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}`;

const newPreviewBlock = 
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
                  style={{ background: previewMode === 'desktop' ? 'rgba(176, 38, 255, 0.4)' : 'transparent', border: 'none', padding: '6px', borderRadius: '6px', color: previewMode === 'desktop' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex' }}
                >
                  <Monitor size={16} />
                </button>
                <button 
                  onClick={() => setPreviewMode('tablet')}
                  style={{ background: previewMode === 'tablet' ? 'rgba(176, 38, 255, 0.4)' : 'transparent', border: 'none', padding: '6px', borderRadius: '6px', color: previewMode === 'tablet' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex' }}
                >
                  <Tablet size={16} />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  style={{ background: previewMode === 'mobile' ? 'rgba(176, 38, 255, 0.4)' : 'transparent', border: 'none', padding: '6px', borderRadius: '6px', color: previewMode === 'mobile' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', display: 'flex' }}
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnD12T//IylmYEzGqAHRfIIMR1T5H0kBAORqCw+e72XoAAAAAElFTkSuQmCC) repeat', backgroundColor: '#0a0a0a' }}>
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
        )}`;

content = content.replace(oldPreviewBlock, newPreviewBlock);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated Live Preview functionality!');
