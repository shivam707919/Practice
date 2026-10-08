export class ParticleEngine {
  constructor() {
    this.particles = [];
    this.floatTexts = [];
  }

  createExplosion(x, y, color = '#00f3ff', count = 25, sizeMultiplier = 1) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 4 + 1) * sizeMultiplier;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: (Math.random() * 4 + 1) * sizeMultiplier,
        color: color,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.03 + 0.015,
        type: 'spark'
      });
    }

    // Shockwave Ring
    this.particles.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: 40 * sizeMultiplier,
      color: color,
      alpha: 1,
      decay: 0.04,
      type: 'ring'
    });
  }

  createThrusterParticle(x, y, color = '#00f3ff', angle = Math.PI / 2) {
    const spread = (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 3 + 2;
    this.particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle + spread + Math.PI) * speed,
      vy: Math.sin(angle + spread + Math.PI) * speed,
      size: Math.random() * 3 + 2,
      color: color,
      alpha: 0.9,
      life: 1,
      decay: Math.random() * 0.08 + 0.05,
      type: 'thruster'
    });
  }

  addFloatText(x, y, text, color = '#ffe600') {
    this.floatTexts.push({
      x: x,
      y: y,
      vy: -1.5,
      text: text,
      color: color,
      alpha: 1,
      decay: 0.02
    });
  }

  update() {
    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.type === 'spark' || p.type === 'thruster') {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.96;
        if (p.alpha <= 0 || p.size <= 0.2) {
          this.particles.splice(i, 1);
        }
      } else if (p.type === 'ring') {
        p.radius += (p.maxRadius - p.radius) * 0.25;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    // Update Floating Text
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y += ft.vy;
      ft.alpha -= ft.decay;
      if (ft.alpha <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (let p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      if (p.type === 'spark' || p.type === 'thruster') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Render Float Text
    for (let ft of this.floatTexts) {
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = 'bold 16px Orbitron, sans-serif';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.floatTexts = [];
  }
}
