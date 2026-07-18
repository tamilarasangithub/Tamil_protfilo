import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function Details({ type, state }) {
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find the item based on type
  const collection = type === 'project' ? state.projects : state.researchPapers;
  const item = collection?.find((i) => i.id === id);

  if (!item) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-shell">
        <section className="card section" style={{ textAlign: 'center' }}>
          <h2>{type === 'project' ? 'Project' : 'Research Paper'} not found.</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Back to Portfolio</button>
        </section>
      </motion.div>
    );
  }

  // Utility to handle YouTube embeds vs raw video
  const renderVideo = (videoUrl) => {
    if (!videoUrl) return null;
    
    // Check if it's a YouTube link
    let embedUrl = videoUrl;
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const isLinkedInEmbed = videoUrl.includes('linkedin.com/embed');
    const isLinkedInPost = videoUrl.includes('linkedin.com/');
    
    if (isYouTube) {
      // Extract video ID
      let videoId = '';
      if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      } else if (videoUrl.includes('watch?v=')) {
        videoId = videoUrl.split('watch?v=')[1].split('&')[0];
      }
      
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '20px', background: '#000' }}>
            <iframe 
              src={embedUrl} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              title={item.title}
            ></iframe>
          </div>
        );
      }
    } else if (isLinkedInEmbed) {
      return (
        <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '20px', background: '#000' }}>
          <iframe 
            src={videoUrl} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
            frameBorder="0" 
            allowFullScreen
            title={item.title}
          ></iframe>
        </div>
      );
    } else if (isLinkedInPost) {
       return (
        <div className="video-container" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '20px', background: 'rgba(255,255,255,0.05)' }}>
           <p style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.7)' }}>To watch this LinkedIn video, please view it directly on LinkedIn.</p>
           <a href={videoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">Watch on LinkedIn</a>
        </div>
       );
    }
    
    // Fallback to standard video tag for direct MP4 links
    return (
      <div className="video-container" style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
        <video controls style={{ width: '100%', display: 'block' }}>
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <>
      <nav className={`top-nav hide-on-mobile ${isScrolled ? 'scrolled' : ''}`} style={{ marginBottom: '2rem', justifyContent: 'flex-start' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', color: '#fff', textDecoration: 'none' }}>
          <span>←</span> Back to Portfolio
        </Link>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <Link to="/" className="mobile-nav-item">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
      </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="page-shell"
    >

      <section className="card section">
        <div className="section-heading">
          <p className="eyebrow">{type === 'project' ? item.category || 'Project' : item.conference || 'Research Paper'} {item.year ? `• ${item.year}` : ''}</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{item.title}</h2>
        </div>

        {/* Video Player */}
        {renderVideo(item.videoUrl)}

        {/* Image Display */}
        {type === 'project' && item.image && (
          <div style={{ marginTop: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
             <img src={item.image} alt={item.title} style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: '600px', background: '#000' }} />
          </div>
        )}

        {/* Description */}
        <div style={{ marginTop: '30px', fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
          <div 
            style={{ whiteSpace: 'pre-wrap' }} 
            dangerouslySetInnerHTML={{ __html: item.description }} 
          />
        </div>

        {/* Live Preview Iframe */}
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
        )}

        {/* External Links */}
        {(item.link || item.livePreviewUrl) && (
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {item.link && (
              <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                {type === 'project' ? 'View Repository' : 'Read Full Paper'}
              </a>
            )}
            {type === 'project' && item.livePreviewUrl && (
              <a href={item.livePreviewUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Visit Live Site
              </a>
            )}
          </div>
        )}
      </section>
    </motion.div>
    </>
  );
}

export default Details;
