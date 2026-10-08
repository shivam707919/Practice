export class Bullet {
  constructor(x, y, angle, speed = 14, color = '#00f3ff', isEnemy = false, type = 'normal') {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.isEnemy = isEnemy;
    this.type = type; // normal, plasma, piercing, homing, laserBeam, ultimate
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = type === 'laserBeam' ? 8 : (type === 'ultimate' ? 16 : 4);
    this.damage = isEnemy ? 12 : (type === 'piercing' ? 25 : (type === 'ultimate' ? 60 : 15));
    this.alive = true;
    this.life = type === 'ultimate' ? 120 : 80;
  }

  update(dt = 16, target = null) {
    if (this.type === 'homing' && target && target.alive) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const targetAngle = Math.atan2(dy, dx);
      let diff = targetAngle - this.angle;

      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      this.angle += diff * 0.12;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.life--;
    if (this.life <= 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;

    if (this.type === 'ultimate') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'laserBeam') {
      ctx.fillRect(-15, -4, 30, 8);
    } else {
      ctx.fillRect(-8, -2.5, 16, 5);
    }

    ctx.restore();
  }
}
