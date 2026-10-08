export class PowerUp {
  constructor(x, y, type = null) {
    this.x = x;
    this.y = y;
    
    const types = ['shield', 'quad', 'time_slow', 'magnet', 'nuke', 'stardust'];
    this.type = type || types[Math.floor(Math.random() * types.length)];
    this.radius = this.type === 'stardust' ? 8 : 14;
    this.alive = true;
    this.life = 600; // 10 seconds before despawn

    this.vy = Math.random() * 0.5 + 0.3;
    this.pulse = 0;

    if (this.type === 'shield') {
      this.color = '#00f3ff'; this.icon = '🛡️';
    } else if (this.type === 'quad') {
      this.color = '#ff0055'; this.icon = '⚡';
    } else if (this.type === 'time_slow') {
      this.color = '#9d00ff'; this.icon = '⏳';
    } else if (this.type === 'magnet') {
      this.color = '#00ff66'; this.icon = '🧲';
    } else if (this.type === 'nuke') {
      this.color = '#ffe600'; this.icon = '💣';
    } else { // stardust crystal
      this.color = '#ffcf25'; this.icon = '💎';
    }
  }

  update(player) {
    this.pulse += 0.05;

    // Magnet attraction towards player
    if (player && (player.magnetTime > 0 || this.type === 'stardust')) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 220) {
        this.x += (dx / dist) * 6;
        this.y += (dy / dist) * 6;
      } else {
        this.y += this.vy;
      }
    } else {
      this.y += this.vy;
    }

    this.life--;
    if (this.life <= 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const scale = 1 + Math.sin(this.pulse) * 0.12;
    ctx.scale(scale, scale);

    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;

    if (this.type === 'stardust') {
      // Diamond crystal shape
      ctx.beginPath();
      ctx.moveTo(0, -this.radius);
      ctx.lineTo(this.radius, 0);
      ctx.lineTo(0, this.radius);
      ctx.lineTo(-this.radius, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      // Orb with icon
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.icon, 0, 1);
    }

    ctx.restore();
  }
}
