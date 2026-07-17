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
    <div className="w-full bg-black text-white py-16 px-4 md:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: PROJECTS */}
        <div className="mb-16">
          <div className="flex justify-between items-center w-full mb-6">
            <h2 className="text-2xl font-bold tracking-wider uppercase text-white">Projects</h2>
            {/* Slide Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(projectScrollRef, 'left')}
                className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center hover:bg-purple-500/20 text-white transition-all duration-300 cursor-pointer z-10"
              >
                ←
              </button>
              <button 
                onClick={() => scroll(projectScrollRef, 'right')}
                className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center hover:bg-purple-500/20 text-white transition-all duration-300 cursor-pointer z-10"
              >
                →
              </button>
            </div>
          </div>

          {/* Bound Viewport Wrapper */}
          <div 
            ref={projectScrollRef}
            className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
          >
            {projects.map((project, index) => (
              <div 
                key={index}
                className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start bg-[#0a0516] border border-purple-500/20 rounded-2xl p-6 relative hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 ease-out"
              >
                <span className="text-xs text-purple-400 uppercase tracking-widest">{project.category}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{project.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: project.description }} />
                <a href={project.link || '#'} className="text-purple-400 hover:text-purple-300 text-sm font-semibold absolute bottom-6 left-6">View details</a>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CERTIFICATIONS (Education Card Style) */}
        <div>
          <div className="flex justify-between items-center w-full mb-6">
            <h2 className="text-2xl font-bold tracking-wider uppercase text-white">Certifications</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(certScrollRef, 'left')}
                className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center hover:bg-purple-500/20 text-white transition-all duration-300 cursor-pointer z-10"
              >
                ←
              </button>
              <button 
                onClick={() => scroll(certScrollRef, 'right')}
                className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center hover:bg-purple-500/20 text-white transition-all duration-300 cursor-pointer z-10"
              >
                →
              </button>
            </div>
          </div>

          {/* Bound Viewport Wrapper */}
          <div 
            ref={certScrollRef}
            className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
          >
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start bg-[#0a0516] border border-purple-500/20 rounded-2xl p-6 border-l-4 border-l-purple-500 hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-black/40 flex items-center justify-center">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">{cert.title}</h3>
                <div className="inline-block bg-purple-950/40 border border-purple-500/30 rounded-full px-3 py-1 text-xs text-purple-300 my-2">
                  {cert.issuer} • {cert.year}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: cert.description }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
