import { Bullet } from './Bullet.js';

export class Enemy {
  constructor(x, y, type = 'drone') {
    this.x = x;
    this.y = y;
    this.type = type; // drone, fighter, cruiser, boss
    this.alive = true;
    this.lastShotTime = 0;

    if (type === 'drone') {
      this.radius = 16;
      this.hp = 20;
      this.maxHp = 20;
      this.speed = 3;
      this.color = '#ff0055';
      this.scoreReward = 100;
      this.fireRate = 1800;
    } else if (type === 'fighter') {
      this.radius = 22;
      this.hp = 45;
      this.maxHp = 45;
      this.speed = 2.2;
      this.color = '#ff6600';
      this.scoreReward = 250;
      this.fireRate = 1200;
    } else if (type === 'cruiser') {
      this.radius = 32;
      this.hp = 120;
      this.maxHp = 120;
      this.speed = 1.2;
      this.color = '#9d00ff';
      this.scoreReward = 600;
      this.fireRate = 800;
    } else if (type === 'boss') {
      this.radius = 55;
      this.hp = 800;
      this.maxHp = 800;
      this.speed = 0.8;
      this.color = '#ff0055';
      this.scoreReward = 3000;
      this.fireRate = 400;
      this.bossPhase = 1;
      this.name = 'COSMIC OVERLORD';
    }

    this.angle = Math.PI / 2;
  }

  update(player, now) {
    if (!this.alive) return [];

    // Aim toward player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    this.angle = Math.atan2(dy, dx);

    // Movement AI
    if (this.type === 'drone') {
      // Kamikaze / Chaser
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    } else if (this.type === 'fighter') {
      // Strafe keeping distance
      const dist = Math.hypot(dx, dy);
      if (dist > 250) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
      } else {
        this.x += Math.cos(this.angle + Math.PI / 2) * this.speed;
        this.y += Math.sin(this.angle + Math.PI / 2) * this.speed;
      }
    } else if (this.type === 'cruiser' || this.type === 'boss') {
      // Slow march downward / tracking
      this.x += Math.cos(this.angle) * this.speed * 0.5;
      this.y += Math.sin(this.angle) * this.speed * 0.5;
    }

    // Shooting logic
    const enemyBullets = [];
    if (now - this.lastShotTime > this.fireRate) {
      this.lastShotTime = now;

      if (this.type === 'fighter') {
        enemyBullets.push(new Bullet(this.x, this.y, this.angle, 8, this.color, true));
      } else if (this.type === 'cruiser') {
        enemyBullets.push(new Bullet(this.x, this.y, this.angle - 0.2, 9, this.color, true));
        enemyBullets.push(new Bullet(this.x, this.y, this.angle + 0.2, 9, this.color, true));
      } else if (this.type === 'boss') {
        // Multi-bullet phase attacks
        if (this.hp < this.maxHp * 0.4) {
          // Phase 2: 8-way Bullet Hell Ring
          for (let i = 0; i < 8; i++) {
            const a = (Math.PI * 2 / 8) * i + now * 0.002;
            enemyBullets.push(new Bullet(this.x, this.y, a, 7, '#ff0055', true));
          }
        } else {
          // Phase 1: Triple burst
          enemyBullets.push(new Bullet(this.x, this.y, this.angle - 0.25, 8, this.color, true));
          enemyBullets.push(new Bullet(this.x, this.y, this.angle, 10, this.color, true));
          enemyBullets.push(new Bullet(this.x, this.y, this.angle + 0.25, 8, this.color, true));
        }
      }
    }

    return enemyBullets;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2.5;
    ctx.fillStyle = '#1c050c';

    if (this.type === 'drone') {
      ctx.beginPath();
      ctx.moveTo(16, 0); ctx.lineTo(-12, -12); ctx.lineTo(-6, 0); ctx.lineTo(-12, 12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (this.type === 'fighter') {
      ctx.beginPath();
      ctx.moveTo(22, 0); ctx.lineTo(-15, -18); ctx.lineTo(-8, 0); ctx.lineTo(-15, 18);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (this.type === 'cruiser') {
      ctx.beginPath();
      ctx.moveTo(32, 0); ctx.lineTo(10, -25); ctx.lineTo(-25, -25); ctx.lineTo(-15, 0); ctx.lineTo(-25, 25); ctx.lineTo(10, 25);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (this.type === 'boss') {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(55, 0); ctx.lineTo(20, -45); ctx.lineTo(-40, -50); ctx.lineTo(-30, 0); ctx.lineTo(-40, 50); ctx.lineTo(20, 45);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Glowing Eye Core
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.beginPath(); ctx.arc(10, 0, 12, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }
}
