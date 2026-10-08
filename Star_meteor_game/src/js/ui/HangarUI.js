import { SPACESHIP_SKINS } from '../config/skins.js';
import { sound } from '../engine/SoundEngine.js';

export class HangarUI {
  constructor(game) {
    this.game = game;
    this.selectedSkinId = localStorage.getItem('starblast_equipped_skin') || 'apex-vector';
    this.previewSkinId = this.selectedSkinId;
    this.unlockedSkins = JSON.parse(localStorage.getItem('starblast_unlocked_skins') || '["apex-vector"]');
    
    this.hangarCanvas = document.getElementById('hangar-ship-canvas');
    this.hangarCtx = this.hangarCanvas ? this.hangarCanvas.getContext('2d') : null;

    this.menuCanvas = document.getElementById('menu-ship-canvas');
    this.menuCtx = this.menuCanvas ? this.menuCanvas.getContext('2d') : null;

    this.animAngle = 0;
    this.initGrid();
    this.setupListeners();
    this.startPreviewAnimation();
  }

  initGrid() {
    const grid = document.getElementById('skins-grid');
    if (!grid) return;

    grid.innerHTML = '';
    SPACESHIP_SKINS.forEach((skin) => {
      const isUnlocked = this.unlockedSkins.includes(skin.id);
      const isEquipped = skin.id === this.selectedSkinId;

      const card = document.createElement('div');
      card.className = `skin-card ${isEquipped ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
      card.dataset.id = skin.id;

      card.innerHTML = `
        <canvas id="card-canvas-${skin.id}" width="70" height="70"></canvas>
        <span class="skin-card-name">${skin.name}</span>
        <span class="skin-card-status">${isUnlocked ? (isEquipped ? 'EQUIPPED' : 'UNLOCKED') : `💎 ${skin.price}`}</span>
      `;

      card.addEventListener('click', () => {
        sound.playClick();
        this.selectSkin(skin.id);
      });

      grid.appendChild(card);

      // Render thumbnail static canvas
      setTimeout(() => {
        const c = document.getElementById(`card-canvas-${skin.id}`);
        if (c) {
          const ctx = c.getContext('2d');
          ctx.clearRect(0, 0, 70, 70);
          skin.draw(ctx, 70, 70, false);
        }
      }, 50);
    });
  }

  selectSkin(skinId) {
    this.previewSkinId = skinId;
    const skin = SPACESHIP_SKINS.find(s => s.id === skinId);
    if (!skin) return;

    // Update Details View
    const nameEl = document.getElementById('hangar-ship-name');
    const rarityEl = document.getElementById('hangar-ship-rarity');
    const descEl = document.getElementById('hangar-ship-desc');
    const abilityEl = document.getElementById('hangar-ship-ability');
    const btnText = document.getElementById('equip-btn-text');
    const btnEquip = document.getElementById('btn-equip-ship');

    if (nameEl) nameEl.innerText = skin.name;
    if (rarityEl) {
      rarityEl.innerText = skin.rarity;
      rarityEl.className = `ship-badge ${skin.rarity}`;
    }
    if (descEl) descEl.innerText = skin.desc;
    if (abilityEl) abilityEl.innerText = skin.ability;

    // Update Stats Bars
    document.getElementById('stat-speed').style.width = `${skin.stats.speed}%`;
    document.getElementById('stat-firepower').style.width = `${skin.stats.firepower}%`;
    document.getElementById('stat-shield').style.width = `${skin.stats.shield}%`;
    document.getElementById('stat-energy').style.width = `${skin.stats.energy}%`;

    // Button status
    const isUnlocked = this.unlockedSkins.includes(skin.id);
    const isEquipped = skin.id === this.selectedSkinId;

    if (isEquipped) {
      if (btnText) btnText.innerText = 'CURRENTLY EQUIPPED';
      if (btnEquip) btnEquip.disabled = true;
    } else if (isUnlocked) {
      if (btnText) btnText.innerText = 'EQUIP SPACESHIP';
      if (btnEquip) btnEquip.disabled = false;
    } else {
      if (btnText) btnText.innerText = `UNLOCK FOR 💎 ${skin.price}`;
      if (btnEquip) btnEquip.disabled = false;
    }

    // Highlight card
    document.querySelectorAll('.skin-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.id === skinId);
    });
  }

  setupListeners() {
    const btnEquip = document.getElementById('btn-equip-ship');
    if (btnEquip) {
      btnEquip.addEventListener('click', () => {
        const skin = SPACESHIP_SKINS.find(s => s.id === this.previewSkinId);
        if (!skin) return;

        const isUnlocked = this.unlockedSkins.includes(skin.id);

        if (isUnlocked) {
          this.selectedSkinId = skin.id;
          localStorage.setItem('starblast_equipped_skin', skin.id);
          sound.playPowerup();
          this.initGrid();
          this.selectSkin(skin.id);
          this.updateMenuPreview();
        } else if (this.game.stardust >= skin.price) {
          this.game.stardust -= skin.price;
          this.game.saveStardust();
          this.unlockedSkins.push(skin.id);
          localStorage.setItem('starblast_unlocked_skins', JSON.stringify(this.unlockedSkins));
          this.selectedSkinId = skin.id;
          localStorage.setItem('starblast_equipped_skin', skin.id);

          sound.playPowerup();
          this.initGrid();
          this.selectSkin(skin.id);
          this.updateMenuPreview();

          // Refresh stardust headers
          document.getElementById('stardust-count').innerText = this.game.stardust.toString();
          document.getElementById('hangar-stardust').innerText = this.game.stardust.toString();
        } else {
          alert('Not enough Star Crystals! Play missions to earn more 💎');
        }
      });
    }

    this.selectSkin(this.selectedSkinId);
    this.updateMenuPreview();
  }

  updateMenuPreview() {
    const skin = SPACESHIP_SKINS.find(s => s.id === this.selectedSkinId);
    if (!skin) return;

    document.getElementById('menu-ship-name').innerText = skin.name;
    document.getElementById('menu-ship-desc').innerText = skin.desc;
    const rEl = document.getElementById('menu-ship-rarity');
    if (rEl) {
      rEl.innerText = skin.rarity;
      rEl.className = `ship-badge ${skin.rarity}`;
    }
  }

  startPreviewAnimation() {
    const render = () => {
      this.animAngle += 0.02;
      const bob = Math.sin(this.animAngle * 2) * 6;

      // Render Hangar Canvas Preview
      if (this.hangarCtx) {
        this.hangarCtx.clearRect(0, 0, 340, 340);
        const skin = SPACESHIP_SKINS.find(s => s.id === this.previewSkinId);
        if (skin) {
          this.hangarCtx.save();
          this.hangarCtx.translate(170, 170 + bob);
          skin.draw(this.hangarCtx, 120, 120, true);
          this.hangarCtx.restore();
        }
      }

      // Render Menu Canvas Preview
      if (this.menuCtx) {
        this.menuCtx.clearRect(0, 0, 220, 220);
        const skin = SPACESHIP_SKINS.find(s => s.id === this.selectedSkinId);
        if (skin) {
          this.menuCtx.save();
          this.menuCtx.translate(110, 110 + bob);
          skin.draw(this.menuCtx, 100, 100, true);
          this.menuCtx.restore();
        }
      }

      requestAnimationFrame(render);
    };

    render();
  }
}
