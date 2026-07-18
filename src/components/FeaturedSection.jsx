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
          <div 
            ref={projectScrollRef}
            className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
          >
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start flex flex-col relative font-outfit bg-white text-slate-800 p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-500 hover:outline hover:outline-2 hover:outline-purple-500/50 hover:outline-offset-2"
              >

                <h3 className="font-bold text-xl md:text-2xl tracking-tight text-slate-900 mb-2 uppercase font-rajdhani">{project.title}</h3>
                
                <div className="inline-flex bg-purple-50 rounded-full px-4 py-1.5 text-xs text-purple-700 mb-4 w-fit font-outfit border border-purple-200 font-medium">
                  {project.category}
                </div>
                
                <p className="font-inter text-sm md:text-base leading-relaxed text-slate-600 flex-grow mb-6" dangerouslySetInnerHTML={{ __html: project.description }} />
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
          <div 
            ref={certScrollRef}
            className="flex flex-row gap-6 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
          >
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-3rem)/3)] max-w-[calc((100%-3rem)/3)] flex-shrink-0 snap-start flex flex-col relative font-outfit bg-white text-slate-800 p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-purple-500 hover:outline hover:outline-2 hover:outline-purple-500/50 hover:outline-offset-2"
              >
                <div className="w-full h-40 mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center relative z-10 border border-slate-200">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>

                <h3 className="font-bold text-xl md:text-2xl tracking-tight text-slate-900 mb-2 uppercase font-rajdhani">{cert.title}</h3>
                
                <div className="inline-flex bg-purple-50 rounded-full px-4 py-1.5 text-xs text-purple-700 mb-4 w-fit font-outfit border border-purple-200 font-medium">
                  {cert.issuer} • {cert.year}
                </div>
                
                <p className="font-inter text-sm md:text-base leading-relaxed text-slate-600 flex-grow" dangerouslySetInnerHTML={{ __html: cert.description }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
