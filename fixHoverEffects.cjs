const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'components', 'FeaturedSection.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Projects preview content blur
const oldPreviewContent = 
`                    if (project.image) {
                      previewContent = <img src={project.image} alt={project.title} className="w-full h-full object-cover blur-[4px] group-hover/preview:blur-sm transition-all duration-300" />;
                    } else if (project.videoUrl) {
                      let videoSrc = project.videoUrl;
                      if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                        let videoId = '';
                        if (videoSrc.includes('youtu.be/')) videoId = videoSrc.split('youtu.be/')[1].split('?')[0];
                        else if (videoSrc.includes('watch?v=')) videoId = videoSrc.split('watch?v=')[1].split('&')[0];
                        if (videoId) videoSrc = \`https://www.youtube.com/embed/\${videoId}?autoplay=0&controls=0&showinfo=0&rel=0\`;
                      }
                      previewContent = <iframe src={videoSrc} className="w-full h-full pointer-events-none blur-[4px] group-hover/preview:blur-sm transition-all duration-300" style={{ border: 'none' }} title="Video Preview" tabIndex="-1" />;
                      targetLink = project.videoUrl;
                    } else if (project.livePreviewUrl) {
                      previewContent = <iframe src={project.livePreviewUrl} className="w-full h-full pointer-events-none blur-[4px] group-hover/preview:blur-sm transition-all duration-300" style={{ border: 'none' }} title="Live Preview" tabIndex="-1" />;
                      targetLink = project.livePreviewUrl;
                    }`;

const newPreviewContent = 
`                    if (project.image) {
                      previewContent = <img src={project.image} alt={project.title} className="w-full h-full object-cover blur-0 group-hover/preview:blur-[6px] transition-all duration-300" />;
                    } else if (project.videoUrl) {
                      let videoSrc = project.videoUrl;
                      if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                        let videoId = '';
                        if (videoSrc.includes('youtu.be/')) videoId = videoSrc.split('youtu.be/')[1].split('?')[0];
                        else if (videoSrc.includes('watch?v=')) videoId = videoSrc.split('watch?v=')[1].split('&')[0];
                        if (videoId) videoSrc = \`https://www.youtube.com/embed/\${videoId}?autoplay=0&controls=0&showinfo=0&rel=0\`;
                      }
                      previewContent = <iframe src={videoSrc} className="w-full h-full pointer-events-none blur-0 group-hover/preview:blur-[6px] transition-all duration-300" style={{ border: 'none' }} title="Video Preview" tabIndex="-1" />;
                      targetLink = project.videoUrl;
                    } else if (project.livePreviewUrl) {
                      previewContent = <iframe src={project.livePreviewUrl} className="w-full h-full pointer-events-none blur-0 group-hover/preview:blur-[6px] transition-all duration-300" style={{ border: 'none' }} title="Live Preview" tabIndex="-1" />;
                      targetLink = project.livePreviewUrl;
                    }`;

content = content.replace(oldPreviewContent, newPreviewContent);

// 2. Projects eye icon container
const oldEyeIcon = 
`                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/preview:bg-black/10 transition-all duration-300">
                          <div className="w-12 h-12 rounded-full bg-[#a855f7]/80 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover/preview:scale-110 transition-transform duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </div>
                        </div>`;

const newEyeIcon = 
`                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/preview:bg-black/30 opacity-0 group-hover/preview:opacity-100 transition-all duration-300">
                          <div className="w-12 h-12 rounded-full bg-[#a855f7]/80 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-75 group-hover/preview:scale-110 transition-transform duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </div>
                        </div>`;

content = content.replace(oldEyeIcon, newEyeIcon);

// 3. Certifications image
const oldCertImage = 
`                  <div className="cert-image-container relative z-10" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <img src={cert.image} alt={cert.title} style={{ objectFit: 'contain' }} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>`;

const newCertImage = 
`                  <div className="cert-image-container relative z-10 w-full h-40 mb-4 rounded-lg overflow-hidden border border-[#a855f7]/30 bg-black/20 group/preview cursor-pointer" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <img src={cert.image} alt={cert.title} style={{ objectFit: 'cover' }} className="w-full h-full blur-0 group-hover/preview:blur-[6px] group-hover/preview:scale-105 transition-all duration-500" />
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/preview:bg-black/30 opacity-0 group-hover/preview:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#a855f7]/80 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-75 group-hover/preview:scale-110 transition-transform duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </div>
                    </div>
                  </div>`;

content = content.replace(oldCertImage, newCertImage);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated hover effects in FeaturedSection.jsx');
