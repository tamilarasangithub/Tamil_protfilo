import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

function ProjectCarousel({ title, items, type = 'project' }) {
  const [xPos, setXPos] = useState(0);
  const controls = useAnimation();
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  // Recalculate if window resizes to prevent dragging past limits
  useEffect(() => {
    const handleResize = () => {
      setXPos(0);
      controls.start({ x: 0 });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [controls]);

  const slide = (direction) => {
    if (!trackRef.current || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const cardElement = trackRef.current.children[0];
    const shift = cardElement ? cardElement.offsetWidth + 24 : 350; 

    // Calculate maximum scroll boundary
    const maxScroll = trackRef.current.scrollWidth - containerWidth;
    if (maxScroll <= 0) return;

    let newX = xPos + (direction === 'left' ? shift : -shift);
    if (newX > 0) newX = 0;
    if (newX < -maxScroll) newX = -maxScroll;

    setXPos(newX);
    controls.start({ x: newX, transition: { type: 'spring', stiffness: 200, damping: 25 } });
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
      
      <div ref={containerRef} style={{ overflow: 'hidden', width: '100%', padding: '24px 8px', margin: '-24px -8px' }}>
        <motion.div 
          ref={trackRef}
          className="premium-card-list" 
          animate={controls}
          initial={{ x: 0 }}
          style={{ display: 'flex', gap: '24px', width: 'max-content' }}
        >
          {items.map((item, index) => (
            <motion.article 
              key={item.id} 
              className="premium-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 0 30px rgba(168,85,247,0.15)',
                borderColor: 'rgba(168,85,247,0.4)'
              }}
            >
              {type === 'cert' && item.image && (
                <div className="cert-image-container">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              {type === 'project' && <div className="pill-tag premium-badge">{item.category?.toLowerCase() || 'project'}</div>}
              <h4>{item.title}</h4>
              
              {type === 'cert' && <p className="meta">{item.issuer}{item.year ? ` • ${item.year}` : ''}</p>}
              
              <div className="premium-desc" dangerouslySetInnerHTML={{ __html: item.description }} />
              
              <Link to={`/${type === 'project' ? 'project' : 'cert'}/${item.id}`} className="premium-link">
                View details
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectCarousel;
