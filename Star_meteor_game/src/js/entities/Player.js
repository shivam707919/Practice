import { SPACESHIP_SKINS } from '../config/skins.js';
import { Bullet } from './Bullet.js';

export class Player {
  constructor(x, y, skinId = 'apex-vector') {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 22;
    this.angle = -Math.PI / 2; // Pointing upwards
    this.skin = SPACESHIP_SKINS.find(s => s.id === skinId) || SPACESHIP_SKINS[0];

    // Stats calculated from skin
    this.maxHp = 100 + (this.skin.stats.shield - 50) * 0.8;
    this.hp = this.maxHp;
    this.shield = this.maxHp;
    this.speed = 5 + (this.skin.stats.speed - 50) * 0.05;
    this.fireRate = 180 - (this.skin.stats.firepower - 50) * 1.2; // Cooldown ms

    this.lastShotTime = 0;
    this.ultimateCharge = 0; // 0 to 100
    this.alive = true;

    // Buffs & Power-ups
    this.quadDamageTime = 0;
    this.shieldBoostTime = 0;
    this.magnetTime = 0;
  }

  setSkin(skinId) {
    const newSkin = SPACESHIP_SKINS.find(s => s.id === skinId);
    if (newSkin) {
      this.skin = newSkin;
      this.maxHp = 100 + (this.skin.stats.shield - 50) * 0.8;
      this.hp = this.maxHp;
      this.speed = 5 + (this.skin.stats.speed - 50) * 0.05;
      this.fireRate = 180 - (this.skin.stats.firepower - 50) * 1.2;
    }
  }

  update(moveVec, mousePos, canvasBounds, particleEngine) {
    if (!this.alive) return;

    // Apply movement physics with damping
    this.vx = moveVec.dx * this.speed;
    this.vy = moveVec.dy * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    // Constrain within Canvas Boundary
    this.x = Math.max(this.radius, Math.min(canvasBounds.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(canvasBounds.height - this.radius, this.y));

    // Aim toward mouse cursor or movement direction
    if (mousePos && (mousePos.x !== this.x || mousePos.y !== this.y)) {
      this.angle = Math.atan2(mousePos.y - this.y, mousePos.x - this.x);
    } else if (moveVec.dx !== 0 || moveVec.dy !== 0) {
      this.angle = Math.atan2(moveVec.dy, moveVec.dx);
    }

    // Spawn engine thruster particles
    if (moveVec.dx !== 0 || moveVec.dy !== 0) {
      particleEngine.createThrusterParticle(
        this.x - Math.cos(this.angle) * 15,
        this.y - Math.sin(this.angle) * 15,
        this.skin.color,
        this.angle
      );
    }

    // Update active buffs countdown
    if (this.quadDamageTime > 0) this.quadDamageTime--;
    if (this.shieldBoostTime > 0) this.shieldBoostTime--;
    if (this.magnetTime > 0) this.magnetTime--;

    // Passive slow shield regeneration
    if (this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + 0.02);
    }
  }

  shoot(now) {
    if (!this.alive) return [];
    if (now - this.lastShotTime < this.fireRate) return [];

    this.lastShotTime = now;
    const bullets = [];
    const isQuad = this.quadDamageTime > 0;
    const bulletColor = isQuad ? '#ff0055' : this.skin.color;

    if (this.skin.id === 'cyber-phoenix') {
      // 5-way spread shot
      const angles = [-0.3, -0.15, 0, 0.15, 0.3];
      angles.forEach(a => {
        bullets.push(new Bullet(this.x, this.y, this.angle + a, 14, bulletColor));
      });
    } else if (this.skin.id === 'void-reaper') {
      // Piercing Beam Laser
      bullets.push(new Bullet(this.x, this.y, this.angle, 18, bulletColor, false, 'piercing'));
    } else if (this.skin.id === 'nebula-spectre') {
      // Dual Homing Missiles
      bullets.push(new Bullet(this.x - 12, this.y, this.angle - 0.1, 12, bulletColor, false, 'homing'));
      bullets.push(new Bullet(this.x + 12, this.y, this.angle + 0.1, 12, bulletColor, false, 'homing'));
    } else if (this.skin.id === 'hyperion-prime') {
      // Triple Laser Beams
      bullets.push(new Bullet(this.x, this.y, this.angle, 16, bulletColor, false, 'laserBeam'));
      bullets.push(new Bullet(this.x, this.y, this.angle - 0.15, 14, bulletColor));
      bullets.push(new Bullet(this.x, this.y, this.angle + 0.15, 14, bulletColor));
    } else {
      // Dual Standard Cannons
      const offsetX = Math.cos(this.angle + Math.PI / 2) * 10;
      const offsetY = Math.sin(this.angle + Math.PI / 2) * 10;
      bullets.push(new Bullet(this.x + offsetX, this.y + offsetY, this.angle, 14, bulletColor));
      bullets.push(new Bullet(this.x - offsetX, this.y - offsetY, this.angle, 14, bulletColor));
    }

    return bullets;
  }

  triggerUltimate() {
    if (this.ultimateCharge < 100 || !this.alive) return null;
    this.ultimateCharge = 0;

    const bullets = [];
    // 16-bullet 360 Nova Burst
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      bullets.push(new Bullet(this.x, this.y, angle, 12, '#ffe600', false, 'ultimate'));
    }
    return bullets;
  }

  takeDamage(amount, particleEngine) {
    if (!this.alive) return;
    if (this.shieldBoostTime > 0) amount *= 0.3; // 70% damage resistance

    this.hp -= amount;
    particleEngine.createExplosion(this.x, this.y, '#ff0055', 10, 0.6);

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      particleEngine.createExplosion(this.x, this.y, this.skin.color, 45, 1.5);
    }
  }

  chargeUltimate(amount) {
    this.ultimateCharge = Math.min(100, this.ultimateCharge + amount);
  }

  draw(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2); // Vector skin default points up

    // Shield Aura Graphic if buffed
    if (this.shieldBoostTime > 0) {
      ctx.strokeStyle = '#ffe600';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Render Spaceship Skin via definition renderer
    this.skin.draw(ctx, 70, 70, true);

    ctx.restore();
  }
}
