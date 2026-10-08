import { ACHIEVEMENTS } from '../config/achievements.js';

export class HUD {
  constructor(game) {
    this.game = game;
    this.unlockedAchievements = JSON.parse(localStorage.getItem('starblast_achievements') || '[]');
  }

  update() {
    if (this.game.state !== 'PLAYING') return;

    // Score & Wave
    document.getElementById('hud-score').innerText = this.game.score.toString().padStart(6, '0');
    document.getElementById('hud-wave').innerText = this.game.wave.toString();
    document.getElementById('hud-highscore').innerText = this.game.highScore.toString().padStart(6, '0');

    // Combo Counter Display
    const comboContainer = document.getElementById('hud-combo-container');
    const comboVal = document.getElementById('hud-combo-val');
    if (this.game.combo > 1) {
      comboContainer.classList.remove('hidden');
      comboVal.innerText = `x${this.game.combo}`;
    } else {
      comboContainer.classList.add('hidden');
    }

    // Boss Health Bar
    const bossContainer = document.getElementById('hud-boss-bar-container');
    if (this.game.currentBoss && this.game.currentBoss.alive) {
      bossContainer.classList.remove('hidden');
      const boss = this.game.currentBoss;
      const pct = Math.max(0, Math.floor((boss.hp / boss.maxHp) * 100));
      document.getElementById('hud-boss-name').innerText = boss.name;
      document.getElementById('hud-boss-hp-text').innerText = `${pct}%`;
      document.getElementById('hud-boss-bar-fill').style.width = `${pct}%`;
    } else {
      bossContainer.classList.add('hidden');
    }

    // Player Hull/Shield Meter
    const hpPct = Math.max(0, Math.floor((this.game.player.hp / this.game.player.maxHp) * 100));
    document.getElementById('hud-hp-percent').innerText = `${hpPct}%`;
    document.getElementById('hud-hp-fill').style.width = `${hpPct}%`;

    // Ultimate Charge Meter
    const ultPct = Math.floor(this.game.player.ultimateCharge);
    const ultStatusEl = document.getElementById('hud-ult-status');
    const ultFillEl = document.getElementById('hud-ult-fill');
    ultFillEl.style.width = `${ultPct}%`;
    if (ultPct >= 100) {
      ultStatusEl.innerText = 'READY! PRESS [E]';
      ultStatusEl.style.color = '#ffe600';
    } else {
      ultStatusEl.innerText = `CHARGING ${ultPct}%`;
      ultStatusEl.style.color = '#8393b8';
    }

    // Check Achievements Progress
    this.checkAchievements();
  }

  checkAchievements() {
    const stats = {
      kills: this.game.kills,
      asteroidsShattered: this.game.asteroidsShattered,
      maxWave: this.game.wave,
      bossesKilled: this.game.bossesKilled,
      maxCombo: this.game.maxCombo,
      totalStardust: this.game.stardust
    };

    ACHIEVEMENTS.forEach(ach => {
      if (!this.unlockedAchievements.includes(ach.id) && ach.check(stats)) {
        this.unlockedAchievements.push(ach.id);
        localStorage.setItem('starblast_achievements', JSON.stringify(this.unlockedAchievements));

        // Reward Stardust
        this.game.stardust += ach.reward;
        this.game.saveStardust();

        // Show Toast
        this.showAchievementToast(ach);
      }
    });
  }

  showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'modal-card';
    toast.style.cssText = `
      position: absolute; bottom: 30px; right: 30px; width: 300px; padding: 16px;
      z-index: 1000; border-color: #ffe600; box-shadow: 0 0 20px rgba(255, 230, 0, 0.4);
    `;
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:2rem;">${ach.icon}</span>
        <div>
          <div style="font-family:Orbitron; font-size:0.75rem; color:#ffe600;">FEAT UNLOCKED!</div>
          <div style="font-family:Orbitron; font-weight:800;">${ach.title}</div>
          <div style="font-size:0.8rem; color:#ffcf25;">+${ach.reward} 💎 Crystals</div>
        </div>
      </div>
    `;

    document.getElementById('app').appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  renderAchievementsList() {
    const list = document.getElementById('achievements-list');
    if (!list) return;

    list.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = this.unlockedAchievements.includes(ach.id);
      const item = document.createElement('div');
      item.style.cssText = `
        display:flex; align-items:center; justify-content:space-between;
        padding:12px 16px; background:rgba(4,6,15,0.6); border:1px solid rgba(255,255,255,0.08);
        border-radius:8px; opacity: ${isUnlocked ? 1 : 0.6};
      `;
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:14px;">
          <span style="font-size:1.8rem;">${ach.icon}</span>
          <div>
            <div style="font-family:Orbitron; font-weight:700; color:${isUnlocked ? '#00f3ff' : '#fff'};">${ach.title}</div>
            <div style="font-size:0.85rem; color:#8393b8;">${ach.desc}</div>
          </div>
        </div>
        <div style="font-family:Orbitron; font-weight:700; color:#ffcf25;">${isUnlocked ? '✓ UNLOCKED' : `+${ach.reward} 💎`}</div>
      `;
      list.appendChild(item);
    });
  }
}
