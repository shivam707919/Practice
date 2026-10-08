import { Background } from './Background.js';
import { ParticleEngine } from './Particles.js';
import { Controls } from './Controls.js';
import { sound } from './SoundEngine.js';
import { Player } from '../entities/Player.js';
import { Asteroid } from '../entities/Asteroid.js';
import { Enemy } from '../entities/Enemy.js';
import { Bullet } from '../entities/Bullet.js';
import { PowerUp } from '../entities/PowerUp.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.background = new Background(this.width, this.height);
    this.particles = new ParticleEngine();
    this.controls = new Controls(this.canvas);
    this.player = new Player(this.width / 2, this.height * 0.85);

    this.asteroids = [];
    this.enemies = [];
    this.bullets = [];
    this.powerups = [];

    this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('starblast_highscore') || '0', 10);
    this.stardust = parseInt(localStorage.getItem('starblast_stardust') || '0', 10);
    this.wave = 1;
    this.combo = 0;
    this.comboTimer = 0;
    this.maxCombo = 0;
    this.kills = 0;
    this.asteroidsShattered = 0;
    this.bossesKilled = 0;

    this.screenShake = 0;
    this.waveSpawnTimer = 0;
    this.currentBoss = null;

    this.bindControls();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (this.background) this.background.resize(this.width, this.height);
  }

  bindControls() {
    this.controls.on('triggerUlt', () => {
      if (this.state === 'PLAYING') {
        const ultBullets = this.player.triggerUltimate();
        if (ultBullets) {
          sound.playUltimate();
          this.bullets.push(...ultBullets);
          this.addScreenShake(15);
        }
      }
    });

    this.controls.on('pauseToggle', () => {
      if (this.state === 'PLAYING') {
        this.setGameState('PAUSED');
      } else if (this.state === 'PAUSED') {
        this.setGameState('PLAYING');
      }
    });
  }

  setGameState(newState) {
    this.state = newState;
    if (this.onStateChange) this.onStateChange(newState);
  }

  startNewGame(equippedSkinId) {
    this.score = 0;
    this.wave = 1;
    this.combo = 0;
    this.kills = 0;
    this.asteroidsShattered = 0;
    this.bossesKilled = 0;
    this.currentBoss = null;

    this.player = new Player(this.width / 2, this.height * 0.8, equippedSkinId);
    this.asteroids = [];
    this.enemies = [];
    this.bullets = [];
    this.powerups = [];
    this.particles.clear();

    this.spawnWave();
    this.setGameState('PLAYING');
  }

  addScreenShake(amount) {
    this.screenShake = Math.max(this.screenShake, amount);
  }

  spawnWave() {
    // Spawn Asteroids
    const asteroidCount = 3 + Math.floor(this.wave * 1.5);
    for (let i = 0; i < asteroidCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * (this.height * 0.4);
      this.asteroids.push(new Asteroid(x, y, 'large'));
    }

    // Spawn Enemy Squadron
    const enemyCount = 2 + Math.floor(this.wave * 1.2);
    for (let i = 0; i < enemyCount; i++) {
      const x = Math.random() * this.width;
      const y = -50 - (i * 40);
      const type = (i % 2 === 0) ? 'drone' : 'fighter';
      this.enemies.push(new Enemy(x, y, type));
    }

    // Boss Every 5 Waves
    if (this.wave % 5 === 0) {
      this.currentBoss = new Enemy(this.width / 2, -100, 'boss');
      this.enemies.push(this.currentBoss);
    }
  }

  update(now, dt) {
    this.background.update(dt);
    this.particles.update();

    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.5) this.screenShake = 0;
    }

    if (this.state !== 'PLAYING') return;

    // Combo Timer Decay
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    // Update Player
    const moveVec = this.controls.getMovementVector();
    this.player.update(moveVec, this.controls.mouse, { width: this.width, height: this.height }, this.particles);

    // Player Firing
    if (this.controls.isFiring) {
      const newBullets = this.player.shoot(now);
      if (newBullets.length > 0) {
        sound.playLaser(this.player.skin.trailType);
        this.bullets.push(...newBullets);
      }
    }

    // Update Asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const ast = this.asteroids[i];
      ast.update({ width: this.width, height: this.height });
    }

    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const enemyBullets = enemy.update(this.player, now);
      if (enemyBullets.length > 0) {
        this.bullets.push(...enemyBullets);
      }
    }

    // Update Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update(dt, this.findClosestTarget(b));
      if (!b.alive || b.x < 0 || b.x > this.width || b.y < 0 || b.y > this.height) {
        this.bullets.splice(i, 1);
      }
    }

    // Update Powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.update(this.player);
      if (!p.alive) this.powerups.splice(i, 1);
    }

    // Check Collisions
    this.checkCollisions();

    // Wave Completion Check
    if (this.asteroids.length === 0 && this.enemies.length === 0) {
      this.wave++;
      this.particles.addFloatText(this.width / 2 - 60, this.height / 2, `WAVE ${this.wave} INCOMING!`, '#00f3ff');
      this.spawnWave();
    }

    // Check Game Over
    if (!this.player.alive) {
      this.handleGameOver();
    }
  }

  findClosestTarget(bullet) {
    let closest = null;
    let minDist = 99999;
    const targets = [...this.enemies, ...this.asteroids];
    for (let t of targets) {
      if (t.alive) {
        const dist = Math.hypot(t.x - bullet.x, t.y - bullet.y);
        if (dist < minDist) {
          minDist = dist;
          closest = t;
        }
      }
    }
    return closest;
  }

  checkCollisions() {
    // Player Bullets -> Enemies & Asteroids
    for (let b of this.bullets) {
      if (b.isEnemy || !b.alive) continue;

      // Bullet vs Asteroid
      for (let a of this.asteroids) {
        if (!a.alive) continue;
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist < b.radius + a.radius) {
          b.alive = false;
          a.takeDamage(b.damage);
          this.particles.createExplosion(b.x, b.y, '#00f3ff', 8);

          if (!a.alive) {
            this.asteroidsShattered++;
            this.addScore(a.stardustReward * 10);
            this.particles.createExplosion(a.x, a.y, '#8393b8', 18);
            sound.playExplosion('medium');

            // Split Asteroid
            const newSplits = a.split();
            if (newSplits.length > 0) this.asteroids.push(...newSplits);

            // Stardust Drop
            this.powerups.push(new PowerUp(a.x, a.y, 'stardust'));
          }
        }
      }

      // Bullet vs Enemy
      for (let e of this.enemies) {
        if (!e.alive) continue;
        const dist = Math.hypot(b.x - e.x, b.y - e.y);
        if (dist < b.radius + e.radius) {
          if (b.type !== 'piercing') b.alive = false;
          e.takeDamage(b.damage);
          this.particles.createExplosion(b.x, b.y, e.color, 10);

          if (!e.alive) {
            this.kills++;
            if (e.type === 'boss') {
              this.bossesKilled++;
              this.currentBoss = null;
              this.addScreenShake(25);
              sound.playExplosion('large');
            } else {
              sound.playExplosion('medium');
            }
            this.addScore(e.scoreReward);
            this.increaseCombo();
            this.player.chargeUltimate(15);
            this.particles.createExplosion(e.x, e.y, e.color, 30, 1.2);

            // Drop PowerUp chance
            if (Math.random() < 0.4) {
              this.powerups.push(new PowerUp(e.x, e.y));
            }
          }
        }
      }
    }

    // Enemy Bullets -> Player
    for (let b of this.bullets) {
      if (!b.isEnemy || !b.alive) continue;
      const dist = Math.hypot(b.x - this.player.x, b.y - this.player.y);
      if (dist < b.radius + this.player.radius) {
        b.alive = false;
        this.player.takeDamage(b.damage, this.particles);
        this.addScreenShake(8);
      }
    }

    // Player vs Powerups
    for (let p of this.powerups) {
      if (!p.alive) continue;
      const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
      if (dist < p.radius + this.player.radius) {
        p.alive = false;
        sound.playPowerup();

        if (p.type === 'shield') {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
          this.particles.addFloatText(this.player.x, this.player.y - 20, '+SHIELD', '#00f3ff');
        } else if (p.type === 'quad') {
          this.player.quadDamageTime = 300;
          this.particles.addFloatText(this.player.x, this.player.y - 20, 'QUAD DAMAGE!', '#ff0055');
        } else if (p.type === 'magnet') {
          this.player.magnetTime = 400;
          this.particles.addFloatText(this.player.x, this.player.y - 20, 'MAGNET!', '#00ff66');
        } else if (p.type === 'stardust') {
          this.stardust += 5;
          this.saveStardust();
          this.particles.addFloatText(this.player.x, this.player.y - 20, '+5 💎', '#ffcf25');
        } else if (p.type === 'nuke') {
          this.enemies.forEach(e => e.takeDamage(200));
          this.addScreenShake(20);
          sound.playExplosion('large');
          this.particles.addFloatText(this.player.x, this.player.y - 20, 'SUPER NUKE!', '#ffe600');
        }
      }
    }

    // Clean dead entities
    this.asteroids = this.asteroids.filter(a => a.alive);
    this.enemies = this.enemies.filter(e => e.alive);
  }

  increaseCombo() {
    this.combo++;
    this.comboTimer = 2500; // 2.5 sec reset
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
  }

  addScore(amount) {
    const multiplier = Math.max(1, Math.floor(this.combo / 3));
    this.score += amount * multiplier;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('starblast_highscore', this.highScore.toString());
    }
  }

  saveStardust() {
    localStorage.setItem('starblast_stardust', this.stardust.toString());
  }

  handleGameOver() {
    this.setGameState('GAMEOVER');
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
    if (this.screenShake > 0) {
      const rx = (Math.random() - 0.5) * this.screenShake;
      const ry = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(rx, ry);
    }

    this.background.draw(this.ctx);

    // Draw Asteroids
    for (let a of this.asteroids) a.draw(this.ctx);

    // Draw Enemies
    for (let e of this.enemies) e.draw(this.ctx);

    // Draw Bullets
    for (let b of this.bullets) b.draw(this.ctx);

    // Draw Powerups
    for (let p of this.powerups) p.draw(this.ctx);

    // Draw Player
    this.player.draw(this.ctx);

    // Draw Particles & Floating Combat Text
    this.particles.draw(this.ctx);

    this.ctx.restore();
  }
}
