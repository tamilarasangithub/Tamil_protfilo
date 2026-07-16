import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ADMIN_EMAIL = 'tamilarasanss.dev@gmail.com';
const ADMIN_PASSWORD = 'Tamil@2003##';

function Login({ setState }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedOutUntil, setLockedOutUntil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    
    if (lockedOutUntil && Date.now() < lockedOutUntil) {
      setError(`Security lockout: Try again in ${Math.ceil((lockedOutUntil - Date.now()) / 1000)} seconds.`);
      return;
    }

    setIsLoading(true);
    
    // Simulated network delay to prevent brute-forcing
    setTimeout(() => {
      setIsLoading(false);
      if (loginForm.email.trim().toLowerCase() === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
        setState((prev) => ({ ...prev, loggedIn: true }));
        setError('');
        setAttempts(0);
        navigate('/admin');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          setLockedOutUntil(Date.now() + 30000); // 30s lockout
          setError('Too many failed attempts. Form locked for 30 seconds.');
        } else {
          setError('Incorrect credentials. Access denied.');
        }
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="page-shell"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <section className="card section login-card" style={{ maxWidth: '450px', width: '100%', margin: 'auto' }}>
        <div className="section-heading" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Admin access</p>
          <h2>Secure login for the admin dashboard</h2>
        </div>
        <div className="login-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="login-panel" style={{ width: '100%' }}>
            <form onSubmit={handleLogin} className="stack-form">
              <input 
                type="email" 
                placeholder="Email" 
                value={loginForm.email} 
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} 
                required 
                disabled={isLoading || (lockedOutUntil && Date.now() < lockedOutUntil)}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={loginForm.password} 
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} 
                required 
                disabled={isLoading || (lockedOutUntil && Date.now() < lockedOutUntil)}
              />
              <button type="submit" className="btn btn-primary" disabled={isLoading || (lockedOutUntil && Date.now() < lockedOutUntil)}>
                {isLoading ? 'Verifying...' : 'Login'}
              </button>
            </form>
            {error ? <p className="error-text" style={{textAlign: 'center', marginTop: '10px'}}>{error}</p> : null}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/" className="btn btn-secondary" style={{ width: '100%' }}>Back to Portfolio</Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Login;
