import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

function ProjectCarousel({ title, items, type = 'project' }) {
  const [xPos, setXPos] = useState(0);
  const controls = useAnimation();
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  const slide = (direction) => {
    if (!containerRef.current) return;
    const shift = 380; 
    containerRef.current.scrollBy({ left: direction === 'left' ? -shift : shift, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', width: '100%' }}>
        <h3>{title}</h3>
        <div className="slider-nav">
          <button type="button" className="slider-btn" onClick={() => slide('left')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button type="button" className="slider-btn" onClick={() => slide('right')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="carousel-native-wrapper" style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '10px 4px' }}>
        <motion.div 
          ref={trackRef}
          className="premium-card-list" 
          style={{ display: 'flex', gap: '24px', width: 'max-content' }}
        >
          {items.map((item, index) => {
            const isCert = type === 'cert';
            const cardClass = isCert ? 'cert-card-v2' : 'premium-card';
            return (
            <motion.article 
              key={item.id} 
              className={cardClass}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={!isCert ? { 
                scale: 1.02, 
                boxShadow: '0 0 30px rgba(168,85,247,0.15)',
                borderColor: 'rgba(168,85,247,0.4)'
              } : { scale: 1.02, borderColor: 'rgba(168,85,247,0.8)' }}
            >
              {isCert ? (
                <>
                  {item.image && <img src={item.image} alt={item.title} className="cert-image" />}
                  <h4>{item.title}</h4>
                  <div className="meta-pill">{item.issuer}{item.year ? ` • ${item.year}` : ''}</div>
                  <div className="premium-desc" dangerouslySetInnerHTML={{ __html: item.description }} />
                  <Link to={`/cert/${item.id}`} className="premium-link">View details</Link>
                </>
              ) : (
                <>
                  <div className="pill-tag premium-badge">{item.category?.toLowerCase() || 'project'}</div>
                  <h4>{item.title}</h4>
                  <div className="premium-desc" dangerouslySetInnerHTML={{ __html: item.description }} />
                  <Link to={`/project/${item.id}`} className="premium-link">View details</Link>
                </>
              )}
            </motion.article>
          )})}
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectCarousel;
