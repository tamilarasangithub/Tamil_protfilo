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
            className="flex flex-row gap-10 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-8 pt-4 pl-6 pr-6"
          >
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-4.5rem)/3)] max-w-[calc((100%-4.5rem)/3)] flex-shrink-0 snap-start bg-[#040209] border border-white/5 rounded-2xl p-8 relative hover:border-[#a855f7] hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all duration-300 ease-out flex flex-col mt-2 ml-4"
              >
                {/* Vertical Timeline Track (Outside Card) */}
                <div className="absolute -top-4 -bottom-4 -left-8 w-[2px] bg-[#a855f7]/20 group-hover:bg-[#a855f7]/50 transition-colors duration-300"></div>
                {/* Glowing Timeline Node */}
                <div className="absolute top-10 -left-[37px] w-4 h-4 rounded-full bg-[#a855f7] border-[3px] border-[#040209] shadow-[0_0_10px_#a855f7] group-hover:bg-[#d8b4fe] group-hover:shadow-[0_0_15px_#d8b4fe] transition-all duration-300"></div>

                {/* Top Right Hover Target Icon */}
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[#a855f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                  <div className="w-2 h-2 rounded-full bg-[#a855f7]"></div>
                </div>

                <h3 className="text-xl md:text-2xl text-white uppercase font-bold tracking-wider font-['Rajdhani'] pr-12 mb-4 leading-snug">{project.title}</h3>
                
                <div className="inline-flex bg-[#130927] rounded-full px-5 py-2 text-sm text-slate-300 mb-6 w-fit font-['Outfit'] border border-[#a855f7]/20 shadow-inner shadow-white/5">
                  {project.category}
                </div>
                
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-['Outfit'] flex-grow mb-6" dangerouslySetInnerHTML={{ __html: project.description }} />
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
            className="flex flex-row gap-10 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-8 pt-4 pl-6 pr-6"
          >
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="group min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100%-4.5rem)/3)] max-w-[calc((100%-4.5rem)/3)] flex-shrink-0 snap-start bg-[#040209] border border-white/5 rounded-2xl p-8 relative hover:border-[#a855f7] hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all duration-300 ease-out flex flex-col mt-2 ml-4"
              >
                {/* Vertical Timeline Track (Outside Card) */}
                <div className="absolute -top-4 -bottom-4 -left-8 w-[2px] bg-[#a855f7]/20 group-hover:bg-[#a855f7]/50 transition-colors duration-300"></div>
                {/* Glowing Timeline Node */}
                <div className="absolute top-10 -left-[37px] w-4 h-4 rounded-full bg-[#a855f7] border-[3px] border-[#040209] shadow-[0_0_10px_#a855f7] group-hover:bg-[#d8b4fe] group-hover:shadow-[0_0_15px_#d8b4fe] transition-all duration-300"></div>

                {/* Top Right Hover Target Icon */}
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[#a855f7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.4)] z-20 bg-[#040209]">
                  <div className="w-2 h-2 rounded-full bg-[#a855f7]"></div>
                </div>

                <div className="w-full h-40 mb-6 overflow-hidden rounded-xl bg-black/40 flex items-center justify-center relative z-10 border border-white/5">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>

                <h3 className="text-xl md:text-2xl text-white uppercase font-bold tracking-wider font-['Rajdhani'] pr-12 mb-4 leading-snug">{cert.title}</h3>
                
                <div className="inline-flex bg-[#130927] rounded-full px-5 py-2 text-sm text-slate-300 mb-6 w-fit font-['Outfit'] border border-[#a855f7]/20 shadow-inner shadow-white/5">
                  {cert.issuer} • {cert.year}
                </div>
                
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-['Outfit'] flex-grow" dangerouslySetInnerHTML={{ __html: cert.description }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
