import React, { useRef, useEffect, useState } from 'react';

const HeroGameInner = ({ onClose, onRestart }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const mouseXRef = useRef(0);
  
  useEffect(() => {
    const saved = localStorage.getItem('heroGameHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Game State
    let animationFrameId;
    let currentScore = 0;
    let currentLevel = 1;
    let isGameOver = false;
    let shakeAmount = 0;
    
    const player = {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      color: '#00f0ff'
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        player.y = canvas.height - 50;
        if (player.x === 0) player.x = canvas.width / 2;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bullets = [];
    const enemies = [];
    const rocks = [];
    const stars = [];
    const particles = [];
    
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random()
      });
    }

    let lastShootTime = 0;
    const shootDelay = 200; 
    let lastEnemyTime = 0;
    let lastRockTime = 0;

    const generateRockVertices = (size) => {
      const vertices = [];
      const numPoints = Math.floor(Math.random() * 4) + 5; 
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = size * (0.6 + Math.random() * 0.4); 
        vertices.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
      }
      return vertices;
    };

    const drawStars = () => {
      stars.forEach(star => {
        ctx.fillStyle = `rgba(176, 38, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        if (!isGameOver) {
          star.y += star.speed * (1 + currentLevel * 0.2); 
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }
        }
      });
    };

    const drawPlayer = () => {
      if (isGameOver) return;
      ctx.shadowBlur = 15;
      ctx.shadowColor = player.color;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 15);
      ctx.lineTo(player.x + 15, player.y + 15);
      ctx.lineTo(player.x + 5, player.y + 10);
      ctx.lineTo(player.x - 5, player.y + 10);
      ctx.lineTo(player.x - 15, player.y + 15);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 5);
      ctx.lineTo(player.x + 8, player.y + 12);
      ctx.lineTo(player.x - 8, player.y + 12);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff007f';
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.moveTo(player.x - 4, player.y + 12);
      ctx.lineTo(player.x + 4, player.y + 12);
      ctx.lineTo(player.x, player.y + 12 + Math.random() * 15 + 5);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
    };

    const drawBullets = () => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.fillStyle = '#00f0ff';
      bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, 4, 15);
      });
      ctx.shadowBlur = 0;
    };

    const drawEnemies = () => {
      enemies.forEach(e => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff26b9';
        ctx.fillStyle = '#b026ff';
        
        ctx.beginPath();
        ctx.moveTo(e.x, e.y + e.size/2); 
        ctx.lineTo(e.x + e.size/2, e.y - e.size/2); 
        ctx.lineTo(e.x, e.y - e.size/4); 
        ctx.lineTo(e.x - e.size/2, e.y - e.size/2); 
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ff26b9';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size/6, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const drawRocks = () => {
      rocks.forEach(r => {
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rotation);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff6b00';
        ctx.fillStyle = 'rgba(20, 10, 30, 0.8)';
        ctx.strokeStyle = `rgba(255, 107, 0, ${Math.max(0.2, r.hp / r.maxHp)})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(r.vertices[0].x, r.vertices[0].y);
        for(let i=1; i<r.vertices.length; i++) {
          ctx.lineTo(r.vertices[i].x, r.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
      });
      ctx.shadowBlur = 0;
    };

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    };

    const createExplosion = (x, y, color, amount = 15) => {
      for(let i=0; i<amount; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          size: Math.random() * 4 + 2,
          life: 1,
          color: color
        });
      }
    };

    const update = (time) => {
      if (isGameOver) return;

      currentLevel = Math.floor(currentScore / 100) + 1;
      setLevel(currentLevel);

      const speedMultiplier = 1 + (currentLevel * 0.15);
      const enemySpawnRate = Math.max(300, 1000 - (currentLevel * 100));
      const rockSpawnRate = Math.max(1500, 5000 - (currentLevel * 500));

      const targetX = mouseXRef.current;
      player.x += (targetX - player.x) * 0.2; 
      if (player.x - player.width/2 < 0) player.x = player.width/2;
      if (player.x + player.width/2 > canvas.width) player.x = canvas.width - player.width/2;

      const currentShootDelay = Math.max(100, shootDelay - (currentLevel * 10));
      if (time - lastShootTime > currentShootDelay) {
        bullets.push({ x: player.x, y: player.y - 15, speed: 12 });
        lastShootTime = time;
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < -20) bullets.splice(i, 1);
      }

      if (time - lastEnemyTime > enemySpawnRate) {
        const size = 30 + Math.random() * 10;
        enemies.push({
          x: size/2 + Math.random() * (canvas.width - size),
          y: -size,
          size: size,
          speed: (1.5 + Math.random() * 2) * speedMultiplier,
          hp: 1
        });
        lastEnemyTime = time;
      }

      if (time - lastRockTime > rockSpawnRate) {
        const size = 40 + Math.random() * 40;
        rocks.push({
          x: size + Math.random() * (canvas.width - size * 2),
          y: -size,
          size: size,
          speed: (0.8 + Math.random() * 1) * speedMultiplier,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          vertices: generateRockVertices(size/2),
          hp: 4 + currentLevel, 
          maxHp: 4 + currentLevel
        });
        lastRockTime = time;
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.y += enemy.speed;

        if (
          Math.abs(enemy.x - player.x) < (enemy.size/2 + player.width/2 - 10) &&
          Math.abs(enemy.y - player.y) < (enemy.size/2 + player.height/2 - 10)
        ) {
          triggerGameOver();
          break;
        }

        if (enemy.y > canvas.height + enemy.size) {
          enemies.splice(i, 1);
          continue;
        }

        for (let j = bullets.length - 1; j >= 0; j--) {
          let bullet = bullets[j];
          if (
            bullet.x > enemy.x - enemy.size/2 &&
            bullet.x < enemy.x + enemy.size/2 &&
            bullet.y < enemy.y + enemy.size/2 &&
            bullet.y > enemy.y - enemy.size/2
          ) {
            bullets.splice(j, 1);
            enemy.hp -= 1;
            if (enemy.hp <= 0) {
              createExplosion(enemy.x, enemy.y, '#b026ff');
              enemies.splice(i, 1);
              currentScore += 10;
              setScore(currentScore);
              break;
            }
          }
        }
      }

      for (let i = rocks.length - 1; i >= 0; i--) {
        let rock = rocks[i];
        rock.y += rock.speed;
        rock.rotation += rock.rotationSpeed;

        if (
          Math.abs(rock.x - player.x) < (rock.size/2 + player.width/2 - 10) &&
          Math.abs(rock.y - player.y) < (rock.size/2 + player.height/2 - 10)
        ) {
          triggerGameOver();
          break;
        }

        if (rock.y > canvas.height + rock.size) {
          rocks.splice(i, 1);
          continue;
        }

        for (let j = bullets.length - 1; j >= 0; j--) {
          let bullet = bullets[j];
          if (
            bullet.x > rock.x - rock.size/2 &&
            bullet.x < rock.x + rock.size/2 &&
            bullet.y < rock.y + rock.size/2 &&
            bullet.y > rock.y - rock.size/2
          ) {
            bullets.splice(j, 1);
            rock.hp -= 1;
            createExplosion(bullet.x, bullet.y, '#ff6b00', 3); 
            
            if (rock.hp <= 0) {
              shakeAmount = 15; 
              createExplosion(rock.x, rock.y, '#ff6b00', 30);
              rocks.splice(i, 1);
              currentScore += 50;
              setScore(currentScore);
              break;
            }
          }
        }
      }
    };

    const triggerGameOver = () => {
      createExplosion(player.x, player.y, '#00f0ff', 40);
      createExplosion(player.x, player.y, '#ff007f', 40);
      shakeAmount = 25; 
      isGameOver = true;
      setGameOver(true);
      
      const savedHigh = parseInt(localStorage.getItem('heroGameHighScore') || '0', 10);
      if (currentScore > savedHigh) {
        localStorage.setItem('heroGameHighScore', currentScore);
        setHighScore(currentScore);
      }
    };

    const render = (time) => {
      ctx.fillStyle = 'rgba(11, 7, 16, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (shakeAmount > 0) {
        ctx.translate((Math.random() - 0.5) * shakeAmount, (Math.random() - 0.5) * shakeAmount);
        shakeAmount *= 0.9; 
        if (shakeAmount < 0.5) shakeAmount = 0;
      }

      drawStars();

      if (!isGameOver) {
        update(time);
        drawPlayer();
        drawBullets();
        drawEnemies();
        drawRocks();
        drawParticles();
        ctx.restore(); 
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Game Over Rendering (Just background and explosions)
        drawRocks();
        drawParticles(); 
        ctx.restore(); 

        ctx.fillStyle = 'rgba(11, 7, 16, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (particles.length > 0 || shakeAmount > 0) {
           animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (canvasRef.current && !gameOver) {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
    }
  };

  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '16px', cursor: gameOver ? 'default' : 'none' }}
      onMouseMove={handleMouseMove}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
      
      {!gameOver && (
        <div style={{ position: 'absolute', top: 12, right: 16, textAlign: 'right' }}>
          <div style={{ color: '#b026ff', fontFamily: 'Rajdhani, sans-serif', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 0 8px rgba(176,38,255,0.8)' }}>
            SCORE: {score}
          </div>
          <div style={{ color: '#ff6b00', fontFamily: 'Rajdhani, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', textShadow: '0 0 5px rgba(255,107,0,0.8)' }}>
            HIGH: {highScore}
          </div>
        </div>
      )}
      
      {!gameOver && (
        <div style={{ position: 'absolute', top: 12, left: 16, color: '#00f0ff', fontFamily: 'Rajdhani, sans-serif', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 0 8px rgba(0,240,255,0.8)' }}>
          LEVEL: {level}
        </div>
      )}

      {/* HTML Game Over Overlay */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 10
        }}>
          <h2 style={{ color: '#ff007f', fontSize: '2.5rem', margin: 0, textShadow: '0 0 15px #ff007f' }}>SYSTEM BREACHED</h2>
          <p style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>FINAL SCORE: {score}</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button 
              onClick={onRestart}
              style={{
                padding: '12px 24px',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,240,255,0.5)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Play Again
            </button>
            <button 
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'rgba(176, 38, 255, 0.1)',
                border: '1px solid #b026ff',
                color: '#b026ff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(176, 38, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(176,38,255,0.5)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(176, 38, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const HeroGame = ({ onClose }) => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <HeroGameInner 
      key={resetKey} 
      onClose={onClose} 
      onRestart={() => setResetKey(k => k + 1)} 
    />
  );
};

export default HeroGame;
