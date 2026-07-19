import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

// Master Portfolio Section Container
export const FeaturedSection = ({ projects, certifications }) => {
  const projectScrollRef = useRef(null);
  const certScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        
        {/* SECTION 1: PROJECTS */}
        <div className="mb-12">
          <div className="flex justify-between items-center w-full mb-6">
            <h3 style={{ margin: 0 }}>Projects</h3>
            {/* Slide Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(projectScrollRef, 'left')}
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_0_2px_#a855f7]"
              >
                ←
              </button>
              <button 
                onClick={() => scroll(projectScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_0_2px_#a855f7]"
              >
                →
              </button>
            </div>
          </div>

          {/* Bound Viewport Wrapper */}
          <div className="-my-6 -mx-2">
            <div 
              ref={projectScrollRef}
              className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth cyber-scrollbar-x py-6 px-4"
            >
              {projects.map((project, index) => (
                <article 
                  key={index}
                  className="project-card bento-inner group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start flex flex-col relative"
                  style={{ background: 'transparent' }}
                >
                  {(() => {
                    let previewContent = null;
                    let targetLink = project.livePreviewUrl || project.link || `/project/${project.id}`;
                    
                    if (project.image) {
                      previewContent = <img src={project.image} alt={project.title} className="w-full h-full object-cover blur-[4px] group-hover/preview:blur-sm transition-all duration-300" />;
                    } else if (project.videoUrl) {
                      let videoSrc = project.videoUrl;
                      if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                        let videoId = '';
                        if (videoSrc.includes('youtu.be/')) videoId = videoSrc.split('youtu.be/')[1].split('?')[0];
                        else if (videoSrc.includes('watch?v=')) videoId = videoSrc.split('watch?v=')[1].split('&')[0];
                        if (videoId) videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&showinfo=0&rel=0`;
                      }
                      previewContent = <iframe src={videoSrc} className="w-full h-full pointer-events-none blur-[4px] group-hover/preview:blur-sm transition-all duration-300" style={{ border: 'none' }} title="Video Preview" tabIndex="-1" />;
                      targetLink = project.videoUrl;
                    } else if (project.livePreviewUrl) {
                      previewContent = <iframe src={project.livePreviewUrl} className="w-full h-full pointer-events-none blur-[4px] group-hover/preview:blur-sm transition-all duration-300" style={{ border: 'none' }} title="Live Preview" tabIndex="-1" />;
                      targetLink = project.livePreviewUrl;
                    }

                    if (!previewContent) return null;

                    return (
                      <a 
                        href={targetLink} 
                        target={targetLink.startsWith('/') ? "_self" : "_blank"} 
                        rel={targetLink.startsWith('/') ? "" : "noopener noreferrer"} 
                        className="block w-full aspect-video mb-4 rounded-lg overflow-hidden border border-[#a855f7]/30 bg-black/20 relative group/preview cursor-pointer flex-shrink-0"
                      >
                        {previewContent}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/preview:bg-black/10 transition-all duration-300">
                          <div className="w-12 h-12 rounded-full bg-[#a855f7]/80 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover/preview:scale-110 transition-transform duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </div>
                        </div>
                      </a>
                    );
                  })()}
                  <h4>{project.title}</h4>
                  
                  <div className="pill-tag" style={{ width: 'fit-content', marginBottom: '16px' }}>
                    {project.category}
                  </div>
                  
                  {project.cardDescription ? (
                    <p style={{ flexGrow: 1, marginBottom: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>{project.cardDescription}</p>
                  ) : (
                    <p style={{ flexGrow: 1, marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: project.description }} />
                  )}
                  
                  <div className="flex gap-4 mt-auto pt-4">
                    <Link 
                      to={`/project/${project.id}`} 
                      className="text-[#a855f7] hover:text-[#b026ff] flex items-center gap-1 font-semibold transition-colors inline-block group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                    >
                      View Details <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: CERTIFICATIONS */}
        <div>
          <div className="flex justify-between items-center w-full mb-6">
            <h3 style={{ margin: 0 }}>Certifications</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(certScrollRef, 'left')}
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_0_2px_#a855f7]"
              >
                ←
              </button>
              <button 
                onClick={() => scroll(certScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_0_2px_#a855f7]"
              >
                →
              </button>
            </div>
          </div>
          
          <div className="-my-6 -mx-2">
            <div 
              ref={certScrollRef}
              className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth cyber-scrollbar-x py-6 px-4"
            >
              {certifications.map((cert, index) => (
                <article 
                  key={index}
                  className={`bento-inner group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start flex flex-col relative ${cert.isActive ? 'border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.2)]' : ''}`}
                  style={{ background: 'transparent' }}
                >
                  {/* Image Container */}
                  <div className="w-full mb-4 flex justify-center items-center rounded-lg overflow-hidden border border-[#a855f7]/30 bg-black/20 p-2">
                    <img 
                      src={cert.image} 
                      alt={cert.title}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ aspectRatio: '11 / 8.5' }}
                    />
                  </div>

                  {/* Content Details */}
                  <div className="flex flex-col flex-grow">
                    <h4 style={{ marginBottom: '16px' }}>{cert.title}</h4>
                    
                    <div className="pill-tag" style={{ width: 'fit-content', marginBottom: '16px' }}>
                      {cert.badge || `${cert.issuer} • ${cert.year}`}
                    </div>
                    
                    {cert.description && typeof cert.description === 'string' && cert.description.includes('<') ? (
                      <p style={{ flexGrow: 1, marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: cert.description }} />
                    ) : (
                      <p style={{ flexGrow: 1, marginBottom: 0 }}>{cert.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
