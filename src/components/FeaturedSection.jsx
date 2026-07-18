import React, { useRef } from 'react';

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
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                ←
              </button>
              <button 
                onClick={() => scroll(projectScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                →
              </button>
            </div>
          </div>

          {/* Bound Viewport Wrapper */}
          <div className="-my-6 -mx-2">
            <div 
              ref={projectScrollRef}
              className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-6 px-4"
            >
              {projects.map((project, index) => (
                <article 
                  key={index}
                  className="project-card group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start flex flex-col relative"
                >
                  <h4>{project.title}</h4>
                  
                  <div className="pill-tag" style={{ width: 'fit-content', marginBottom: '16px' }}>
                    {project.category}
                  </div>
                  
                  <p style={{ flexGrow: 1, marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: project.description }} />
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
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                ←
              </button>
              <button 
                onClick={() => scroll(certScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-[#a855f7]/30 bg-transparent text-white flex items-center justify-center transition-all duration-300 ease-out cursor-pointer z-10 hover:border-[#a855f7] hover:bg-[#a855f7]/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                →
              </button>
            </div>
          </div>

          {/* Bound Viewport Wrapper */}
          <div className="-my-6 -mx-2">
            <div 
              ref={certScrollRef}
              className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-6 px-4"
            >
              {certifications.map((cert, index) => (
                <article 
                  key={index}
                  className="cert-card group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start flex flex-col relative"
                >
                  <div className="cert-image-container relative z-10" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <img src={cert.image} alt={cert.title} style={{ objectFit: 'contain' }} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <h4>{cert.title}</h4>
                  
                  <div className="pill-tag" style={{ width: 'fit-content', marginBottom: '16px' }}>
                    {cert.issuer} • {cert.year}
                  </div>
                  
                  <p style={{ flexGrow: 1, marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: cert.description }} />
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
