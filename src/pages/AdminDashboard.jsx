import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAnalyticsData = [
  { name: 'Mon', visitors: 400 },
  { name: 'Tue', visitors: 300 },
  { name: 'Wed', visitors: 550 },
  { name: 'Thu', visitors: 450 },
  { name: 'Fri', visitors: 700 },
  { name: 'Sat', visitors: 850 },
  { name: 'Sun', visitors: 1100 }
];

function AdminDashboard({ state, setState }) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  
  const [editingId, setEditingId] = useState({
    education: null,
    experience: null,
    projects: null,
    certifications: null,
    researchPapers: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const docRef = doc(db, 'portfolio', 'main');

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(''), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // state.loggedIn is updated automatically via onAuthStateChanged in App.jsx
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const handleAboutSave = async (event) => {
    event.preventDefault();
    if (!adminForms.about1.trim() || !adminForms.about2.trim()) return;
    setIsSubmitting(true);
    try {
      await setDoc(docRef, {
        aboutIntro1: adminForms.about1.trim(),
        aboutIntro2: adminForms.about2.trim(),
        lastUpdate: 'About section updated'
      }, { merge: true });
      setFeedback('About section updated.');
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleSkillsSave = async (event) => {
    event.preventDefault();
    if (!adminForms.skills.trim()) return;
    setIsSubmitting(true);
    try {
      await setDoc(docRef, {
        skills: adminForms.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        lastUpdate: 'Core skills updated'
      }, { merge: true });
      setFeedback('Skills updated.');
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleEduSubmit = async (event) => {
    event.preventDefault();
    if (!eduForm.title.trim() || !eduForm.school.trim()) return;
    setIsSubmitting(true);
    try {
      let newList = [...(state.education || [])];
      if (editingId.education) {
        newList = newList.map(item => item.id === editingId.education ? { ...item, ...eduForm } : item);
      } else {
        newList = [{ id: crypto.randomUUID(), ...eduForm }, ...newList];
      }
      await setDoc(docRef, {
        education: newList,
        lastUpdate: `Education ${editingId.education ? 'updated' : 'added'}: ${eduForm.title.trim()}`
      }, { merge: true });
      setEduForm({ title: '', school: '', year: '', description: '' });
      setEditingId(prev => ({ ...prev, education: null }));
      setFeedback(`Education ${editingId.education ? 'updated' : 'added'} successfully.`);
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleExpSubmit = async (event) => {
    event.preventDefault();
    if (!expForm.title.trim() || !expForm.year.trim()) return;
    setIsSubmitting(true);
    try {
      let newList = [...(state.experience || [])];
      if (editingId.experience) {
        newList = newList.map(item => item.id === editingId.experience ? { ...item, ...expForm } : item);
      } else {
        newList = [{ id: crypto.randomUUID(), ...expForm }, ...newList];
      }
      await setDoc(docRef, {
        experience: newList,
        lastUpdate: `Experience ${editingId.experience ? 'updated' : 'added'}: ${expForm.title.trim()}`
      }, { merge: true });
      setExpForm({ title: '', year: '', description: '' });
      setEditingId(prev => ({ ...prev, experience: null }));
      setFeedback(`Experience ${editingId.experience ? 'updated' : 'added'} successfully.`);
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    if (!projectForm.title.trim() || !projectForm.category.trim()) return;
    setIsSubmitting(true);
    try {
      let newList = [...(state.projects || [])];
      if (editingId.projects) {
        newList = newList.map(item => item.id === editingId.projects ? { ...item, ...projectForm } : item);
      } else {
        newList = [{ id: crypto.randomUUID(), ...projectForm }, ...newList];
      }
      await setDoc(docRef, {
        projects: newList,
        lastUpdate: `Project ${editingId.projects ? 'updated' : 'added'}: ${projectForm.title.trim()}`
      }, { merge: true });
      setProjectForm({ title: '', category: '', link: '', videoUrl: '', description: '' });
      setEditingId(prev => ({ ...prev, projects: null }));
      setFeedback(`Project ${editingId.projects ? 'updated' : 'added'} successfully.`);
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setFormState((prev) => ({ ...prev, [formStateKey]: dataUrl }));
      };
    };
  };

  const handleCertSubmit = async (event) => {
    event.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim() || !certForm.description.trim()) return;
    setIsSubmitting(true);
    try {
      let newList = [...(state.certifications || [])];
      if (editingId.certifications) {
        newList = newList.map(item => item.id === editingId.certifications ? { ...item, ...certForm } : item);
      } else {
        newList = [{ id: crypto.randomUUID(), ...certForm }, ...newList];
      }
      await setDoc(docRef, {
        certifications: newList,
        lastUpdate: `Certification ${editingId.certifications ? 'updated' : 'added'}: ${certForm.title.trim()}`
      }, { merge: true });
      setCertForm({ title: '', issuer: '', year: '', category: '', image: '', description: '' });
      setEditingId(prev => ({ ...prev, certifications: null }));
      setFeedback(`Certification ${editingId.certifications ? 'updated' : 'added'} successfully.`);
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleResearchSubmit = async (event) => {
    event.preventDefault();
    if (!researchForm.title.trim() || !researchForm.conference.trim()) return;
    setIsSubmitting(true);
    try {
      let newList = [...(state.researchPapers || [])];
      if (editingId.researchPapers) {
        newList = newList.map(item => item.id === editingId.researchPapers ? { ...item, ...researchForm } : item);
      } else {
        newList = [{ id: crypto.randomUUID(), ...researchForm }, ...newList];
      }
      await setDoc(docRef, {
        researchPapers: newList,
        lastUpdate: `Research paper ${editingId.researchPapers ? 'updated' : 'added'}: ${researchForm.title.trim()}`
      }, { merge: true });
      setResearchForm({ title: '', conference: '', year: '', category: '', link: '', videoUrl: '', description: '' });
      setEditingId(prev => ({ ...prev, researchPapers: null }));
      setFeedback(`Research paper ${editingId.researchPapers ? 'updated' : 'added'} successfully.`);
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleRemoveItem = async (key, id) => {
    try {
      await setDoc(docRef, {
        [key]: state[key].filter((item) => item.id !== id)
      }, { merge: true });
      setFeedback(`Item removed from ${key}.`);
    } catch(e) {
      setFeedback('Error: ' + e.message);
    }
  };

  const handleReorder = async (key, index, direction) => {
    const list = [...(state[key] || [])];
    if (direction === 'up' && index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index + 1], list[index]] = [list[index], list[index + 1]];
    } else {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await setDoc(docRef, { [key]: list }, { merge: true });
    } catch (e) {
      setFeedback('Error reordering: ' + e.message);
    }
    setIsSubmitting(false);
  };

  const handleEditItem = (key, item) => {
    if (key === 'education') { setEduForm(item); setEditingId(prev => ({ ...prev, education: item.id })); }
    if (key === 'experience') { setExpForm(item); setEditingId(prev => ({ ...prev, experience: item.id })); }
    if (key === 'projects') { setProjectForm(item); setEditingId(prev => ({ ...prev, projects: item.id })); }
    if (key === 'certifications') { setCertForm(item); setEditingId(prev => ({ ...prev, certifications: item.id })); }
    if (key === 'researchPapers') { setResearchForm(item); setEditingId(prev => ({ ...prev, researchPapers: item.id })); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = (key) => {
    if (key === 'education') { setEduForm({ title: '', school: '', year: '', description: '' }); setEditingId(prev => ({ ...prev, education: null })); }
    if (key === 'experience') { setExpForm({ title: '', year: '', description: '' }); setEditingId(prev => ({ ...prev, experience: null })); }
    if (key === 'projects') { setProjectForm({ title: '', category: '', link: '', videoUrl: '', description: '' }); setEditingId(prev => ({ ...prev, projects: null })); }
    if (key === 'certifications') { setCertForm({ title: '', issuer: '', year: '', category: '', image: '', description: '' }); setEditingId(prev => ({ ...prev, certifications: null })); }
    if (key === 'researchPapers') { setResearchForm({ title: '', conference: '', year: '', category: '', link: '', videoUrl: '', description: '' }); setEditingId(prev => ({ ...prev, researchPapers: null })); }
  };

  if (!state.loggedIn) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="page-shell"
    >
      <nav className={`top-nav hide-on-mobile ${isScrolled ? 'scrolled' : ''}`} style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ padding: '8px 16px', borderRadius: '999px', color: '#fff', textDecoration: 'none' }}>View Portfolio</Link>
        <button type="button" className="nav-cta" onClick={handleLogout} style={{ marginLeft: '12px' }}>Logout</button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <Link to="/" className="mobile-nav-item">
          <Home size={20} />
          <span>Portfolio</span>
        </Link>
        <button onClick={handleLogout} className="mobile-nav-item" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <section className="card section">
        <div className="section-heading">
          <p className="eyebrow">Admin Dashboard</p>
          <h2>Manage your portfolio content</h2>
        </div>

        <div className="bento-inner" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Visitor Analytics (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={mockAnalyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b026ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#b026ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(176,38,255,0.3)', color: '#fff' }} />
                <Area type="monotone" dataKey="visitors" stroke="#b026ff" fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {feedback ? <div className="success-message">{feedback}</div> : null}
        
        <div className="admin-grid">
          <div className="bento-inner" style={{ padding: '24px' }}>
            <h3>Edit About</h3>
            <form className="stack-form" onSubmit={handleAboutSave}>
              <textarea rows="3" value={adminForms.about1} onChange={(event) => setAdminForms({ ...adminForms, about1: event.target.value })} placeholder="About intro line 1" />
              <textarea rows="3" value={adminForms.about2} onChange={(event) => setAdminForms({ ...adminForms, about2: event.target.value })} placeholder="About intro line 2" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save About'}</button>
            </form>
          </div>
          
          <div className="bento-inner" style={{ padding: '24px' }}>
            <h3>Edit Skills</h3>
            <form className="stack-form" onSubmit={handleSkillsSave}>
              <textarea rows="3" value={adminForms.skills} onChange={(event) => setAdminForms({ ...adminForms, skills: event.target.value })} placeholder="Skills separated by commas" />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Skills'}</button>
            </form>
          </div>

          <div className="bento-inner" style={{ padding: '24px' }}>
            <h3>{editingId.education ? 'Edit Education' : 'Add Education'}</h3>
            <form className="stack-form" onSubmit={handleEduSubmit}>
              <input value={eduForm.title} onChange={(event) => setEduForm({ ...eduForm, title: event.target.value })} placeholder="Degree / Title" required />
              <input value={eduForm.school} onChange={(event) => setEduForm({ ...eduForm, school: event.target.value })} placeholder="School / Institution" required />
              <input value={eduForm.year} onChange={(event) => setEduForm({ ...eduForm, year: event.target.value })} placeholder="Year (e.g., 2022-2026)" />
              <textarea rows="2" value={eduForm.description} onChange={(event) => setEduForm({ ...eduForm, description: event.target.value })} placeholder="Education summary" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>{isSubmitting ? 'Saving...' : editingId.education ? 'Update Education' : 'Add Education'}</button>
                {editingId.education && <button type="button" onClick={() => cancelEdit('education')} className="btn btn-secondary">Cancel</button>}
              </div>
            </form>
          </div>

          <div className="bento-inner" style={{ padding: '24px' }}>
            <h3>{editingId.experience ? 'Edit Experience' : 'Add Experience'}</h3>
            <form className="stack-form" onSubmit={handleExpSubmit}>
              <input value={expForm.title} onChange={(event) => setExpForm({ ...expForm, title: event.target.value })} placeholder="Role / Job Title" required />
              <input value={expForm.year} onChange={(event) => setExpForm({ ...expForm, year: event.target.value })} placeholder="Year (e.g., 2024 - Present)" required />
              <textarea rows="2" value={expForm.description} onChange={(event) => setExpForm({ ...expForm, description: event.target.value })} placeholder="Experience summary" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>{isSubmitting ? 'Saving...' : editingId.experience ? 'Update Experience' : 'Add Experience'}</button>
                {editingId.experience && <button type="button" onClick={() => cancelEdit('experience')} className="btn btn-secondary">Cancel</button>}
              </div>
            </form>
          </div>

          <div className="bento-inner" style={{ padding: '24px', gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingId.projects ? 'Edit Project' : 'Add New Project'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <form className="stack-form" onSubmit={handleProjectSubmit}>
                <input value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} placeholder="Project title" required />
                <input value={projectForm.category} onChange={(event) => setProjectForm({ ...projectForm, category: event.target.value })} placeholder="Category" required />
                <input value={projectForm.link} onChange={(event) => setProjectForm({ ...projectForm, link: event.target.value })} placeholder="Project URL (e.g., GitHub, Live Site)" />
                <input value={projectForm.videoUrl} onChange={(event) => setProjectForm({ ...projectForm, videoUrl: event.target.value })} placeholder="Video URL (YouTube or .mp4 link)" />
                <div style={{ background: '#fff', color: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                  <ReactQuill theme="snow" value={projectForm.description} onChange={(val) => setProjectForm({ ...projectForm, description: val })} placeholder="Project description" />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>{isSubmitting ? 'Saving...' : editingId.projects ? 'Update Project' : 'Add Project'}</button>
                  {editingId.projects && <button type="button" onClick={() => cancelEdit('projects')} className="btn btn-secondary">Cancel</button>}
                </div>
              </form>
              
              <div className="preview-container">
                <h4 style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>Live Preview</h4>
                <article className="project-card" style={{ height: 'fit-content' }}>
                  <div className="pill-tag">{projectForm.category || 'Category'}</div>
                  <h4 style={{ marginTop: '12px' }}>{projectForm.title || 'Project Title'}</h4>
                  <div dangerouslySetInnerHTML={{ __html: (!projectForm.description || projectForm.description === '<p><br></p>') ? '<p>Project description will appear here...</p>' : projectForm.description }} />
                  <span style={{ color: 'var(--accent)', fontWeight: '600', marginTop: '10px', display: 'inline-block' }}>View details</span>
                </article>
              </div>
            </div>
          </div>

          <div className="bento-inner" style={{ padding: '24px' }}>
            <h3>{editingId.certifications ? 'Edit Certification' : 'Add Certification'}</h3>
            <form className="stack-form" onSubmit={handleCertSubmit}>
              <input value={certForm.title} onChange={(event) => setCertForm({ ...certForm, title: event.target.value })} placeholder="Certification title" required />
              <input value={certForm.issuer} onChange={(event) => setCertForm({ ...certForm, issuer: event.target.value })} placeholder="Issuer" required />
              <input value={certForm.year} onChange={(event) => setCertForm({ ...certForm, year: event.target.value })} placeholder="Year" />
              <input value={certForm.category} onChange={(event) => setCertForm({ ...certForm, category: event.target.value })} placeholder="Category (optional)" />
              
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '-5px' }}>Upload Image (Auto-compressed):</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCertForm, 'image')} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)' }} />
              {certForm.image && <img src={certForm.image} alt="Preview" style={{ width: '100px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} />}

              <textarea rows="3" value={certForm.description} onChange={(event) => setCertForm({ ...certForm, description: event.target.value })} placeholder="Description" required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>{isSubmitting ? 'Saving...' : editingId.certifications ? 'Update Certification' : 'Add Certification'}</button>
                {editingId.certifications && <button type="button" onClick={() => cancelEdit('certifications')} className="btn btn-secondary">Cancel</button>}
              </div>
            </form>
          </div>

          <div className="bento-inner" style={{ padding: '24px' }}>
            <h3>{editingId.researchPapers ? 'Edit Research Paper' : 'Add Research Paper'}</h3>
            <form className="stack-form" onSubmit={handleResearchSubmit}>
              <input value={researchForm.title} onChange={(event) => setResearchForm({ ...researchForm, title: event.target.value })} placeholder="Paper title" required />
              <input value={researchForm.conference} onChange={(event) => setResearchForm({ ...researchForm, conference: event.target.value })} placeholder="Conference / Journal" required />
              <input value={researchForm.year} onChange={(event) => setResearchForm({ ...researchForm, year: event.target.value })} placeholder="Year" />
              <input value={researchForm.category} onChange={(event) => setResearchForm({ ...researchForm, category: event.target.value })} placeholder="Category (optional)" />
              
              <input value={researchForm.link} onChange={(event) => setResearchForm({ ...researchForm, link: event.target.value })} placeholder="Document URL (PDF link)" />
              <input value={researchForm.videoUrl} onChange={(event) => setResearchForm({ ...researchForm, videoUrl: event.target.value })} placeholder="Video URL (YouTube or .mp4 link)" />
              <textarea rows="2" value={researchForm.description} onChange={(event) => setResearchForm({ ...researchForm, description: event.target.value })} placeholder="Abstract / Summary" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>{isSubmitting ? 'Saving...' : editingId.researchPapers ? 'Update Paper' : 'Add Paper'}</button>
                {editingId.researchPapers && <button type="button" onClick={() => cancelEdit('researchPapers')} className="btn btn-secondary">Cancel</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="portfolio-grid" style={{ marginTop: '40px' }}>
          <div>
            <h3>Manage Education</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {(state.education || []).map((item, index) => (
                <article key={item.id} className="project-card">
                  <h4>{item.title}</h4>
                  <p className="meta">{item.school} • {item.year}</p>
                  <p>{item.description}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleEditItem('education', item)}>Edit</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('education', index, 'up')} disabled={index === 0}>↑</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('education', index, 'down')} disabled={index === (state.education || []).length - 1}>↓</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleRemoveItem('education', item.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3>Manage Experience</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {(state.experience || []).map((item, index) => (
                <article key={item.id} className="project-card">
                  <h4>{item.title}</h4>
                  <p className="meta">{item.year}</p>
                  <p>{item.description}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleEditItem('experience', item)}>Edit</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('experience', index, 'up')} disabled={index === 0}>↑</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('experience', index, 'down')} disabled={index === (state.experience || []).length - 1}>↓</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleRemoveItem('experience', item.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="portfolio-grid" style={{ marginTop: '40px' }}>
          <div>
            <h3>Manage Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {(state.projects || []).map((project, index) => (
                <article key={project.id} className="project-card">
                  <div className="pill-tag">{project.category}</div>
                  <h4>{project.title}</h4>
                  <div dangerouslySetInnerHTML={{ __html: project.description }} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleEditItem('projects', project)}>Edit</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('projects', index, 'up')} disabled={index === 0}>↑</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('projects', index, 'down')} disabled={index === (state.projects || []).length - 1}>↓</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleRemoveItem('projects', project.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3>Manage Certifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {(state.certifications || []).map((cert, index) => (
                <article key={cert.id} className="cert-card">
                  <h4>{cert.title}</h4>
                  <p className="meta">{cert.issuer}{cert.year ? ` • ${cert.year}` : ''}</p>
                  <p>{cert.description}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleEditItem('certifications', cert)}>Edit</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('certifications', index, 'up')} disabled={index === 0}>↑</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('certifications', index, 'down')} disabled={index === (state.certifications || []).length - 1}>↓</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleRemoveItem('certifications', cert.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        
        <div className="portfolio-grid" style={{ marginTop: '40px' }}>
          <div>
            <h3>Manage Research Papers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {(state.researchPapers || []).map((paper, index) => (
                <article key={paper.id} className="project-card">
                  <h4>{paper.title}</h4>
                  <p className="meta">{paper.conference}{paper.year ? ` • ${paper.year}` : ''}</p>
                  <p>{paper.description}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleEditItem('researchPapers', paper)}>Edit</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('researchPapers', index, 'up')} disabled={index === 0}>↑</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleReorder('researchPapers', index, 'down')} disabled={index === (state.researchPapers || []).length - 1}>↓</button>
                    <button type="button" className="btn btn-secondary ghost-btn" onClick={() => handleRemoveItem('researchPapers', paper.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bento-inner" style={{ padding: '24px', marginTop: '60px', borderColor: 'rgba(176, 38, 255, 0.4)' }}>
          <div className="section-heading" style={{ marginBottom: '24px' }}>
            <h2>Manual Database Sync</h2>
            <p>Your changes are saved to the database automatically when you click 'Add' or 'Save'. However, you can click the button below to force a full synchronization of all data across all devices.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={async () => {
              setIsSubmitting(true);
              setFeedback('Syncing to database...');
              try {
                const { loggedIn, ...dataToSave } = state;
                await setDoc(docRef, dataToSave, { merge: true });
                setFeedback('Successfully synced all data to the database!');
              } catch(e) {
                setFeedback('Error syncing: ' + e.message);
              }
              setIsSubmitting(false);
            }} 
            disabled={isSubmitting}
            style={{ width: '100%', background: 'linear-gradient(135deg, #00fbff, #9900ff)' }}
          >
            {isSubmitting ? 'Syncing...' : 'Force Save All Changes to Database'}
          </button>
        </div>
      </section>
    </motion.div>
  );
}

export default AdminDashboard;
