/**
 * Night Sky Particle System — Mirror Mirror on the Wall
 * Super-Slow Meditative Starfield & Deep Space Physics
 */

class NightSkyParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.stars = [];
    this.particles = [];
    this.shootingStars = [];
    
    this.numStars = 220;
    this.numParticles = 65;
    
    this.width = 0;
    this.height = 0;
    this.mouse = { x: null, y: null, radius: 140 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createStars();
    this.createParticles();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Rare, slow shooting stars
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.spawnShootingStar();
      }
    }, 7000);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.6 + 0.15,
        twinkleSpeed: Math.random() * 0.012 + 0.003, // Super-slow twinkle
        twinklePhase: Math.random() * Math.PI * 2,
        isColor: Math.random() > 0.85,
        hue: Math.random() * 60 + 190
      });
    }
  }

  createParticles() {
    this.particles = [];
    const colors = [
      'rgba(255, 112, 166, ',
      'rgba(255, 209, 102, ',
      'rgba(6, 214, 160, ',
      'rgba(17, 138, 178, ',
      'rgba(155, 93, 229, ',
      'rgba(255, 255, 255, '
    ];

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.2 + 0.8,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.12, // Super-slow drift
        vy: -Math.random() * 0.14 - 0.04, // Very gentle upward float
        floatAngle: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.006 + 0.002,
        pulseSpeed: Math.random() * 0.01 + 0.004,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  spawnShootingStar() {
    this.shootingStars.push({
      x: Math.random() * this.width * 0.85 + this.width * 0.05,
      y: Math.random() * this.height * 0.35,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 4 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      opacity: 0.8,
      decay: Math.random() * 0.008 + 0.006
    });
  }

  animate() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Twinkling Stars (Slow breathing)
    for (let star of this.stars) {
      star.twinklePhase += star.twinkleSpeed;
      const alpha = Math.max(0.08, Math.min(0.9, star.baseAlpha + Math.sin(star.twinklePhase) * 0.35));
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      if (star.isColor) {
        this.ctx.fillStyle = `hsla(${star.hue}, 85%, 85%, ${alpha})`;
      } else {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      }
      this.ctx.fill();

      if (star.size > 1.3 && alpha > 0.6) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
        this.ctx.fill();
      }
    }

    // 2. Cosmic Floating Particles (Slow meditative motion)
    for (let p of this.particles) {
      p.floatAngle += p.floatSpeed;
      p.pulsePhase += p.pulseSpeed;

      p.x += p.vx + Math.sin(p.floatAngle) * 0.15;
      p.y += p.vy;

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius && dist > 0) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }
      }

      if (p.y < -15) {
        p.y = this.height + 15;
        p.x = Math.random() * this.width;
      }
      if (p.x < -15) p.x = this.width + 15;
      if (p.x > this.width + 15) p.x = -15;

      const dynamicAlpha = Math.max(0.06, Math.min(0.7, p.baseAlpha + Math.sin(p.pulsePhase) * 0.15));

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorPrefix}${dynamicAlpha})`;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorPrefix}${dynamicAlpha * 0.18})`;
      this.ctx.fill();
    }

    // 3. Shooting Stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= s.decay;

      if (s.opacity <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const gradient = this.ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
      gradient.addColorStop(0.3, `rgba(180, 220, 255, ${s.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1.4;
      this.ctx.stroke();
    }

    requestAnimationFrame(this.animate);
  }
}

window.NightSkyParticles = NightSkyParticles;
