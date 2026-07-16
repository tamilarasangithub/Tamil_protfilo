import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AdminDashboard({ state, setState }) {
  const navigate = useNavigate();

  // If not logged in, redirect to login
  useEffect(() => {
    if (!state.loggedIn) {
      navigate('/login');
    }
  }, [state.loggedIn, navigate]);

  const [feedback, setFeedback] = useState('');
  const [adminForms, setAdminForms] = useState({
    about1: state.aboutIntro1 || '',
    about2: state.aboutIntro2 || '',
    skills: state.skills ? state.skills.join(', ') : ''
  });
  
  const [eduForm, setEduForm] = useState({ title: '', school: '', year: '', description: '' });
  const [expForm, setExpForm] = useState({ title: '', year: '', description: '' });
  const [projectForm, setProjectForm] = useState({ title: '', category: '', link: '', videoUrl: '', description: '' });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', year: '', category: '', image: '', description: '' });
  const [researchForm, setResearchForm] = useState({ title: '', conference: '', year: '', category: '', link: '', videoUrl: '', description: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // GitHub Sync State
  const [githubToken, setGithubToken] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  const handleGithubSync = async () => {
    if (!githubToken.trim()) {
      setSyncStatus('Please enter a GitHub Personal Access Token.');
      return;
    }
    
    setSyncStatus('Syncing to GitHub...');
    setIsSubmitting(true);
    
    try {
      // 1. Prepare data (exclude loggedIn and lastUpdate)
      const { loggedIn, lastUpdate, ...dataToSave } = state;
      const jsonString = JSON.stringify(dataToSave, null, 2);
      const base64Content = window.btoa(unescape(encodeURIComponent(jsonString)));
      
      const repoUrl = 'https://api.github.com/repos/tamilarasangithub/Tamil_protfilo/contents/src/data.json';
      const headers = {
        'Authorization': `Bearer ${githubToken.trim()}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      // 2. Get current SHA
      const getRes = await fetch(repoUrl, { headers });
      if (!getRes.ok) throw new Error('Failed to fetch file info. Check your token.');
      const getResData = await getRes.json();
      const sha = getResData.sha;

      // 3. Put new file
      const putRes = await fetch(repoUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Auto-sync: update portfolio data from Admin Dashboard',
          content: base64Content,
          sha: sha,
          branch: 'main'
        })
      });

      if (!putRes.ok) throw new Error('Failed to push update to GitHub. Token needs "repo" scope.');
      
      setSyncStatus('Successfully synced to GitHub! Vercel will now deploy your changes (takes ~1 minute).');
      setFeedback('Permanent save successful.');
      setGithubToken(''); // clear token for security
    } catch (err) {
      setSyncStatus(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(''), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleLogout = () => {
    setState((prev) => ({ ...prev, loggedIn: false }));
    navigate('/');
  };

  const handleAboutSave = (event) => {
    event.preventDefault();
    if (!adminForms.about1.trim() || !adminForms.about2.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        aboutIntro1: adminForms.about1.trim(),
        aboutIntro2: adminForms.about2.trim(),
        lastUpdate: 'About section updated'
      }));
      setFeedback('About section updated.');
      setIsSubmitting(false);
    }, 180);
  };

  const handleSkillsSave = (event) => {
    event.preventDefault();
    if (!adminForms.skills.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        skills: adminForms.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        lastUpdate: 'Core skills updated'
      }));
      setFeedback('Skills updated.');
      setIsSubmitting(false);
    }, 180);
  };

  const handleEduAdd = (event) => {
    event.preventDefault();
    if (!eduForm.title.trim() || !eduForm.school.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        education: [{
          id: crypto.randomUUID(),
          title: eduForm.title.trim(),
          school: eduForm.school.trim(),
          year: eduForm.year.trim(),
          description: eduForm.description.trim()
        }, ...(prev.education || [])],
        lastUpdate: `Education added: ${eduForm.title.trim()}`
      }));
      setEduForm({ title: '', school: '', year: '', description: '' });
      setFeedback('Education added successfully.');
      setIsSubmitting(false);
    }, 180);
  };

  const handleExpAdd = (event) => {
    event.preventDefault();
    if (!expForm.title.trim() || !expForm.year.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        experience: [{
          id: crypto.randomUUID(),
          title: expForm.title.trim(),
          year: expForm.year.trim(),
          description: expForm.description.trim()
        }, ...(prev.experience || [])],
        lastUpdate: `Experience added: ${expForm.title.trim()}`
      }));
      setExpForm({ title: '', year: '', description: '' });
      setFeedback('Experience added successfully.');
      setIsSubmitting(false);
    }, 180);
  };

  const handleProjectAdd = (event) => {
    event.preventDefault();
    if (!projectForm.title.trim() || !projectForm.category.trim() || !projectForm.description.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        projects: [{
          id: crypto.randomUUID(),
          title: projectForm.title.trim(),
          category: projectForm.category.trim(),
          link: projectForm.link.trim(),
          videoUrl: projectForm.videoUrl.trim(),
          description: projectForm.description.trim()
        }, ...prev.projects],
        lastUpdate: `Project added: ${projectForm.title.trim()}`
      }));
      setProjectForm({ title: '', category: '', link: '', videoUrl: '', description: '' });
      setFeedback('Project added successfully.');
      setIsSubmitting(false);
    }, 180);
  };

  // --- Image Compressor ---
  const handleImageUpload = (e, setFormState, formStateKey) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to tiny WebP/JPEG to save localStorage space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setFormState((prev) => ({ ...prev, [formStateKey]: dataUrl }));
      };
    };
  };

  const handleCertAdd = (event) => {
    event.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim() || !certForm.description.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        certifications: [{
          id: crypto.randomUUID(),
          title: certForm.title.trim(),
          issuer: certForm.issuer.trim(),
          year: certForm.year.trim(),
          category: certForm.category.trim(),
          image: certForm.image,
          description: certForm.description.trim()
        }, ...prev.certifications],
        lastUpdate: `Certification added: ${certForm.title.trim()}`
      }));
      setCertForm({ title: '', issuer: '', year: '', category: '', image: '', description: '' });
      setFeedback('Certification added successfully.');
      setIsSubmitting(false);
    }, 180);
  };

  const handleResearchAdd = (event) => {
    event.preventDefault();
    if (!researchForm.title.trim() || !researchForm.conference.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        researchPapers: [{
          id: crypto.randomUUID(),
          title: researchForm.title.trim(),
          conference: researchForm.conference.trim(),
          year: researchForm.year.trim(),
          category: researchForm.category.trim(),
          link: researchForm.link.trim(),
          videoUrl: researchForm.videoUrl.trim(),
          description: researchForm.description.trim()
        }, ...(prev.researchPapers || [])],
        lastUpdate: `Research paper added: ${researchForm.title.trim()}`
      }));
      setResearchForm({ title: '', conference: '', year: '', category: '', link: '', videoUrl: '', description: '' });
      setFeedback('Research paper added successfully.');
      setIsSubmitting(false);
    }, 180);
  };

  const removeItem = (type, id) => {
    setState((prev) => ({ ...prev, [type]: prev[type].filter((item) => item.id !== id) }));
    setFeedback(`Item removed from ${type}.`);
  };

  const handleRemoveItem = (key, id) => {
    setState((prev) => ({ ...prev, [key]: prev[key].filter((item) => item.id !== id) }));
    setFeedback(`Item removed from ${key}.`);
  };

  if (!state.loggedIn) {
    return null; // Will redirect
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="page-shell"
    >
      <nav className="top-nav card" style={{ marginBottom: '2rem' }}>
        <Link to="/">View Portfolio</Link>
        <button type="button" className="nav-cta" onClick={handleLogout}>Logout</button>
      </nav>

      <section className="card section">
        <div className="section-heading">
          <p className="eyebrow">Admin Dashboard</p>
          <h2>Manage your portfolio content</h2>
        </div>

        {feedback ? <div className="success-message">{feedback}</div> : null}
        
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Edit About</h3>
            <form className="stack-form" onSubmit={handleAboutSave}>
              <textarea rows="3" value={adminForms.about1} onChange={(event) => setAdminForms({ ...adminForms, about1: event.target.value })} placeholder="About intro line 1" />
              <textarea rows="3" value={adminForms.about2} onChange={(event) => setAdminForms({ ...adminForms, about2: event.target.value })} placeholder="About intro line 2" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save About'}</button>
            </form>
          </div>
          
          <div className="admin-card">
            <h3>Edit Skills</h3>
            <form className="stack-form" onSubmit={handleSkillsSave}>
              <textarea rows="3" value={adminForms.skills} onChange={(event) => setAdminForms({ ...adminForms, skills: event.target.value })} placeholder="Skills separated by commas" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Skills'}</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Add Education</h3>
            <form className="stack-form" onSubmit={handleEduAdd}>
              <input value={eduForm.title} onChange={(event) => setEduForm({ ...eduForm, title: event.target.value })} placeholder="Degree / Title" required />
              <input value={eduForm.school} onChange={(event) => setEduForm({ ...eduForm, school: event.target.value })} placeholder="School / Institution" required />
              <input value={eduForm.year} onChange={(event) => setEduForm({ ...eduForm, year: event.target.value })} placeholder="Year (e.g., 2022-2026)" />
              <textarea rows="2" value={eduForm.description} onChange={(event) => setEduForm({ ...eduForm, description: event.target.value })} placeholder="Education summary" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Add Education'}</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Add Experience</h3>
            <form className="stack-form" onSubmit={handleExpAdd}>
              <input value={expForm.title} onChange={(event) => setExpForm({ ...expForm, title: event.target.value })} placeholder="Role / Job Title" required />
              <input value={expForm.year} onChange={(event) => setExpForm({ ...expForm, year: event.target.value })} placeholder="Year (e.g., 2024 - Present)" required />
              <textarea rows="2" value={expForm.description} onChange={(event) => setExpForm({ ...expForm, description: event.target.value })} placeholder="Experience summary" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Add Experience'}</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Add Project</h3>
            <form className="stack-form" onSubmit={handleProjectAdd}>
              <input value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} placeholder="Project title" required />
              <input value={projectForm.category} onChange={(event) => setProjectForm({ ...projectForm, category: event.target.value })} placeholder="Category" required />
              <input value={projectForm.link} onChange={(event) => setProjectForm({ ...projectForm, link: event.target.value })} placeholder="Project URL (e.g., GitHub, Live Site)" />
              <input value={projectForm.videoUrl} onChange={(event) => setProjectForm({ ...projectForm, videoUrl: event.target.value })} placeholder="Video URL (YouTube or .mp4 link)" />
              <textarea rows="3" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} placeholder="Project description" required />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Add Project'}</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Add Certification</h3>
            <form className="stack-form" onSubmit={handleCertAdd}>
              <input value={certForm.title} onChange={(event) => setCertForm({ ...certForm, title: event.target.value })} placeholder="Certification title" required />
              <input value={certForm.issuer} onChange={(event) => setCertForm({ ...certForm, issuer: event.target.value })} placeholder="Issuer" required />
              <input value={certForm.year} onChange={(event) => setCertForm({ ...certForm, year: event.target.value })} placeholder="Year" />
              <input value={certForm.category} onChange={(event) => setCertForm({ ...certForm, category: event.target.value })} placeholder="Category (optional)" />
              
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '-5px' }}>Upload Image (Auto-compressed):</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCertForm, 'image')} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)' }} />
              {certForm.image && <img src={certForm.image} alt="Preview" style={{ width: '100px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} />}

              <textarea rows="3" value={certForm.description} onChange={(event) => setCertForm({ ...certForm, description: event.target.value })} placeholder="Description" required />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Add Certification'}</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Add Research Paper</h3>
            <form className="stack-form" onSubmit={handleResearchAdd}>
              <input value={researchForm.title} onChange={(event) => setResearchForm({ ...researchForm, title: event.target.value })} placeholder="Paper title" required />
              <input value={researchForm.conference} onChange={(event) => setResearchForm({ ...researchForm, conference: event.target.value })} placeholder="Conference / Journal" required />
              <input value={researchForm.year} onChange={(event) => setResearchForm({ ...researchForm, year: event.target.value })} placeholder="Year" />
              <input value={researchForm.category} onChange={(event) => setResearchForm({ ...researchForm, category: event.target.value })} placeholder="Category (optional)" />
              
              <input value={researchForm.link} onChange={(event) => setResearchForm({ ...researchForm, link: event.target.value })} placeholder="Document URL (PDF link)" />
              <input value={researchForm.videoUrl} onChange={(event) => setResearchForm({ ...researchForm, videoUrl: event.target.value })} placeholder="Video URL (YouTube or .mp4 link)" />
              <textarea rows="2" value={researchForm.description} onChange={(event) => setResearchForm({ ...researchForm, description: event.target.value })} placeholder="Abstract / Summary" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Add Paper'}</button>
            </form>
          </div>
        </div>

        <div className="portfolio-grid" style={{ marginTop: '40px' }}>
          <div>
            <h3>Manage Education</h3>
            <div className="card-list">
              {(state.education || []).map((item) => (
                <article key={item.id} className="project-card">
                  <h4>{item.title}</h4>
                  <p className="meta">{item.school} • {item.year}</p>
                  <p>{item.description}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => handleRemoveItem('education', item.id)} style={{marginTop: '10px'}}>Remove</button>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3>Manage Experience</h3>
            <div className="card-list">
              {(state.experience || []).map((item) => (
                <article key={item.id} className="project-card">
                  <h4>{item.title}</h4>
                  <p className="meta">{item.year}</p>
                  <p>{item.description}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => handleRemoveItem('experience', item.id)} style={{marginTop: '10px'}}>Remove</button>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="portfolio-grid" style={{ marginTop: '40px' }}>
          <div>
            <h3>Manage Projects</h3>
            <div className="card-list">
              {state.projects.map((project) => (
                <article key={project.id} className="project-card">
                  <div className="pill-tag">{project.category}</div>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => handleRemoveItem('projects', project.id)} style={{marginTop: '10px'}}>Remove</button>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3>Manage Certifications</h3>
            <div className="card-list">
              {state.certifications.map((cert) => (
                <article key={cert.id} className="cert-card">
                  <h4>{cert.title}</h4>
                  <p className="meta">{cert.issuer}{cert.year ? ` • ${cert.year}` : ''}</p>
                  <p>{cert.description}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => handleRemoveItem('certifications', cert.id)} style={{marginTop: '10px'}}>Remove</button>
                </article>
              ))}
            </div>
          </div>
        </div>
        
        <div className="portfolio-grid" style={{ marginTop: '40px' }}>
          <div>
            <h3>Manage Research Papers</h3>
            <div className="card-list">
              {(state.researchPapers || []).map((paper) => (
                <article key={paper.id} className="project-card">
                  <h4>{paper.title}</h4>
                  <p className="meta">{paper.conference}{paper.year ? ` • ${paper.year}` : ''}</p>
                  <p>{paper.description}</p>
                  <button type="button" className="btn btn-secondary" onClick={() => handleRemoveItem('researchPapers', paper.id)} style={{marginTop: '10px'}}>Remove</button>
                </article>
              ))}
            </div>
            </div>
          </div>
        </div>
        
        <div className="section-heading" style={{ marginTop: '60px' }}>
          <h2>Permanent Save (GitHub Sync)</h2>
          <p>Sync your local changes directly to your GitHub repository so Vercel can rebuild the site with your new data.</p>
        </div>
        
        <div className="card admin-form-card" style={{ border: '2px solid rgba(0, 251, 255, 0.4)', background: 'rgba(0, 251, 255, 0.05)' }}>
          <div className="form-group">
            <label>GitHub Personal Access Token (PAT) <span style={{fontSize: '0.8rem', color: '#FFA116'}}>(Needs 'repo' scope)</span></label>
            <input 
              type="password" 
              value={githubToken} 
              onChange={(e) => setGithubToken(e.target.value)} 
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
              style={{ background: 'rgba(0,0,0,0.5)' }}
            />
          </div>
          {syncStatus && (
            <div style={{ marginBottom: '15px', color: syncStatus.includes('Error') ? '#ff4444' : '#00fbff', fontWeight: '500' }}>
              {syncStatus}
            </div>
          )}
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleGithubSync} 
            disabled={isSubmitting}
            style={{ width: '100%', background: 'linear-gradient(135deg, #00fbff, #9900ff)' }}
          >
            {isSubmitting ? 'Syncing...' : 'Sync to GitHub & Vercel'}
          </button>
        </div>
      </section>
    </motion.div>
  );
}

export default AdminDashboard;
