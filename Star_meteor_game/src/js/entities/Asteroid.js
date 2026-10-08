export class Asteroid {
  constructor(x, y, size = 'large', vx = null, vy = null) {
    this.x = x;
    this.y = y;
    this.size = size; // large, medium, small
    
    if (size === 'large') {
      this.radius = 35;
      this.hp = 50;
      this.speed = Math.random() * 1.5 + 0.8;
      this.stardustReward = 15;
    } else if (size === 'medium') {
      this.radius = 20;
      this.hp = 25;
      this.speed = Math.random() * 2.5 + 1.5;
      this.stardustReward = 8;
    } else {
      this.radius = 12;
      this.hp = 10;
      this.speed = Math.random() * 3.5 + 2;
      this.stardustReward = 4;
    }

    const angle = Math.random() * Math.PI * 2;
    this.vx = vx !== null ? vx : Math.cos(angle) * this.speed;
    this.vy = vy !== null ? vy : Math.sin(angle) * this.speed;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;

    this.verts = [];
    const numVerts = Math.floor(Math.random() * 4) + 7;
    for (let i = 0; i < numVerts; i++) {
      const vertAngle = (Math.PI * 2 / numVerts) * i;
      const offset = (Math.random() * 0.35 + 0.8) * this.radius;
      this.verts.push({
        x: Math.cos(vertAngle) * offset,
        y: Math.sin(vertAngle) * offset
      });
    }

    this.alive = true;
  }

  update(bounds) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;

    // Wrap around screen edges
    if (this.x < -this.radius) this.x = bounds.width + this.radius;
    if (this.x > bounds.width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = bounds.height + this.radius;
    if (this.y > bounds.height + this.radius) this.y = -this.radius;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
    }
  }

  split() {
    if (this.size === 'large') {
      return [
        new Asteroid(this.x, this.y, 'medium', this.vx + 1, this.vy - 0.5),
        new Asteroid(this.x, this.y, 'medium', this.vx - 1, this.vy + 0.5)
      ];
    } else if (this.size === 'medium') {
      return [
        new Asteroid(this.x, this.y, 'small', this.vx + 1.5, this.vy - 1),
        new Asteroid(this.x, this.y, 'small', this.vx - 1.5, this.vy + 1)
      ];
    }
    return [];
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.strokeStyle = '#8393b8';
    ctx.shadowColor = 'rgba(0, 243, 255, 0.3)';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2;
    ctx.fillStyle = '#0f1424';

    ctx.beginPath();
    ctx.moveTo(this.verts[0].x, this.verts[0].y);
    for (let i = 1; i < this.verts.length; i++) {
      ctx.lineTo(this.verts[i].x, this.verts[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
