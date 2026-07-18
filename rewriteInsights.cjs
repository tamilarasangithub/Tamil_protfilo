const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'src', 'pages', 'Portfolio.jsx');
let content = fs.readFileSync(portfolioPath, 'utf8');

const startTag = '<section id="insights" className="section bento-inner">';
const endTag = '</section>';

const startIndex = content.indexOf(startTag);
const sectionPart = content.slice(startIndex);
const endIndex = sectionPart.indexOf(endTag) + endTag.length + startIndex;

const newInsights = `<section id="insights" className="section bento-inner">
          <div className="section-heading">
            <p className="eyebrow">Dashboard</p>
            <h2>Live Coding Insights</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            
            {/* GITHUB CARD (Purple & Pink Theme) */}
            <div className="bento-inner" style={{ background: 'transparent', padding: '32px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <h3 style={{ margin: 0, background: 'linear-gradient(90deg, #9900ff, #ff26b9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', fontSize: '1.8rem' }}>GitHub Analytics</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="githubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9900ff" />
                      <stop offset="100%" stopColor="#ff26b9" />
                    </linearGradient>
                  </defs>
                  <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                  {!liveStats.loading && (
                    <motion.circle 
                      cx="75" cy="75" r="60" 
                      stroke="url(#githubGradient)" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      whileInView={{ strokeDashoffset: (2 * Math.PI * 60) - (Math.min((liveStats.github / 50) * 100, 100) / 100) * (2 * Math.PI * 60) }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                      style={{ filter: 'drop-shadow(0 0 12px rgba(255, 38, 185, 0.6))' }}
                    />
                  )}
                  <text x="75" y="85" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {liveStats.loading ? '...' : liveStats.github}
                  </text>
                </svg>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Projects</span>
              </div>

              {!liveStats.loading && liveStats.topLanguages && liveStats.topLanguages.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.1rem' }}>Top Languages</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {liveStats.topLanguages.map((lang, idx) => {
                      const maxCount = liveStats.topLanguages[0].count;
                      const percentage = (lang.count / maxCount) * 100;
                      return (
                        <div key={lang.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text)' }}>{lang.name}</span>
                            <span style={{ color: '#ff26b9' }}>{lang.count}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: \`\${percentage}%\` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #9900ff, #ff26b9)', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!liveStats.loading && liveStats.githubDetails && liveStats.githubDetails.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.1rem' }}>Profile Stats</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {liveStats.githubDetails.map((detail, idx) => {
                      const maxCount = Math.max(...liveStats.githubDetails.map(d => d.count), 1);
                      const percentage = (detail.count / maxCount) * 100;
                      return (
                        <div key={detail.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text)' }}>{detail.name}</span>
                            <span style={{ color: '#9900ff' }}>{detail.count}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: \`\${percentage}%\` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #9900ff, #ff26b9)', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* LEETCODE CARD (Yellow & Orange Theme) */}
            <div className="bento-inner" style={{ background: 'transparent', padding: '32px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <h3 style={{ margin: 0, background: 'linear-gradient(90deg, #FFA116, #FF6B00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', fontSize: '1.8rem' }}>LeetCode Analytics</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="leetcodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFA116" />
                      <stop offset="100%" stopColor="#FF6B00" />
                    </linearGradient>
                  </defs>
                  <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                  {!liveStats.loading && (
                    <motion.circle 
                      cx="75" cy="75" r="60" 
                      stroke="url(#leetcodeGradient)" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      whileInView={{ strokeDashoffset: (2 * Math.PI * 60) - (Math.min((liveStats.leetcode / 100) * 100, 100) / 100) * (2 * Math.PI * 60) }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                      style={{ filter: 'drop-shadow(0 0 12px rgba(255, 161, 22, 0.6))' }}
                    />
                  )}
                  <text x="75" y="85" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                    {liveStats.loading ? '...' : liveStats.leetcode}
                  </text>
                </svg>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Problems Solved</span>
              </div>

              {!liveStats.loading && liveStats.leetcodeDetails && liveStats.leetcodeDetails.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.1rem' }}>Difficulty Breakdown</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {liveStats.leetcodeDetails.map((detail, idx) => {
                      const maxCount = Math.max(...liveStats.leetcodeDetails.map(d => d.count), 1);
                      const percentage = (detail.count / maxCount) * 100;
                      return (
                        <div key={detail.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text)' }}>{detail.name}</span>
                            <span style={{ color: '#FFA116' }}>{detail.count}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: \`\${percentage}%\` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #FFA116, #FF6B00)', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>`;

content = content.slice(0, startIndex) + newInsights + content.slice(endIndex);

fs.writeFileSync(portfolioPath, content, 'utf8');
console.log('Insights section rewritten.');
