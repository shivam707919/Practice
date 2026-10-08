export class Background {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stars = [];
    this.nebulae = [];
    this.speedMultiplier = 1;
    this.warpMode = false;
    this.initStars();
    this.initNebulae();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.initStars();
  }

  initStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 3000);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.3,
        layer: Math.floor(Math.random() * 3), // 0: distant, 1: mid, 2: foreground
        color: this.getRandomStarColor(),
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  }

  getRandomStarColor() {
    const colors = ['#ffffff', '#00f3ff', '#9d00ff', '#ffe600', '#ff0055'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  initNebulae() {
    this.nebulae = [
      { x: this.width * 0.2, y: this.height * 0.3, radius: 250, color: 'rgba(0, 243, 255, 0.06)' },
      { x: this.width * 0.8, y: this.height * 0.7, radius: 300, color: 'rgba(157, 0, 255, 0.07)' },
      { x: this.width * 0.5, y: this.height * 0.1, radius: 200, color: 'rgba(255, 0, 85, 0.05)' }
    ];
  }

  setWarpMode(active) {
    this.warpMode = active;
    this.speedMultiplier = active ? 8 : 1;
  }

  update(dt = 16) {
    const baseSpeed = 1.2 * (dt / 16) * this.speedMultiplier;
    
    for (let star of this.stars) {
      star.y += star.speed * baseSpeed * (star.layer + 1);
      if (star.y > this.height) {
        star.y = -5;
        star.x = Math.random() * this.width;
      }
    }
  }

  draw(ctx) {
    // Deep Space Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#04060f');
    bgGrad.addColorStop(0.5, '#090d1c');
    bgGrad.addColorStop(1, '#04060f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Render Nebulae
    for (let n of this.nebulae) {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Stars
    for (let star of this.stars) {
      ctx.save();
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.color;

      if (this.warpMode) {
        // Render Star Warp Streak Lines
        ctx.strokeStyle = star.color;
        ctx.lineWidth = star.size;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x, star.y - star.speed * 25);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
