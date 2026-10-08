import { Game } from './engine/Game.js';
import { HangarUI } from './ui/HangarUI.js';
import { HUD } from './ui/HUD.js';
import { sound } from './engine/SoundEngine.js';

class App {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.game = new Game(this.canvas);
    this.hangar = new HangarUI(this.game);
    this.hud = new HUD(this.game);

    this.screens = {
      menu: document.getElementById('screen-menu'),
      hangar: document.getElementById('screen-hangar'),
      pause: document.getElementById('screen-pause'),
      gameover: document.getElementById('screen-gameover'),
      achievements: document.getElementById('screen-achievements')
    };

    this.hudLayer = document.getElementById('game-hud');

    this.initUI();
    this.bindEvents();
    this.startAppLoop();
  }

  initUI() {
    // Sync Stardust display
    this.updateStardustDisplay();

    // Check Mobile Touch Layer
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      const touchLayer = document.getElementById('touch-controls');
      if (touchLayer) touchLayer.classList.remove('hidden');
    }
  }

  updateStardustDisplay() {
    const el1 = document.getElementById('stardust-count');
    const el2 = document.getElementById('hangar-stardust');
    if (el1) el1.innerText = this.game.stardust.toString();
    if (el2) el2.innerText = this.game.stardust.toString();
  }

  showScreen(screenName) {
    Object.keys(this.screens).forEach((key) => {
      if (this.screens[key]) {
        this.screens[key].classList.toggle('active', key === screenName);
      }
    });

    if (screenName === 'playing') {
      this.hudLayer.classList.remove('hidden');
    } else if (screenName !== 'pause') {
      this.hudLayer.classList.add('hidden');
    }
  }

  bindEvents() {
    // Sound Toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        audioBtn.querySelector('.icon').innerText = isMuted ? '🔇' : '🔊';
      });
    }

    // Launch Game
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        sound.playClick();
        this.showScreen('playing');
        this.game.startNewGame(this.hangar.selectedSkinId);
      });
    }

    // Open Hangar
    const hangarBtn = document.getElementById('btn-open-hangar');
    if (hangarBtn) {
      hangarBtn.addEventListener('click', () => {
        sound.playClick();
        this.updateStardustDisplay();
        this.showScreen('hangar');
      });
    }

    const backHangarBtn = document.getElementById('btn-hangar-back');
    if (backHangarBtn) {
      backHangarBtn.addEventListener('click', () => {
        sound.playClick();
        this.showScreen('menu');
      });
    }

    // Achievements
    const achBtn = document.getElementById('btn-open-achievements');
    if (achBtn) {
      achBtn.addEventListener('click', () => {
        sound.playClick();
        this.hud.renderAchievementsList();
        this.screens.achievements.classList.add('active');
      });
    }

    const closeAchBtn = document.getElementById('btn-close-achievements');
    if (closeAchBtn) {
      closeAchBtn.addEventListener('click', () => {
        sound.playClick();
        this.screens.achievements.classList.remove('active');
      });
    }

    // Pause Controls
    const pauseBtn = document.getElementById('btn-pause-game');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        sound.playClick();
        this.game.setGameState('PAUSED');
      });
    }

    const resumeBtn = document.getElementById('btn-resume-game');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        sound.playClick();
        this.game.setGameState('PLAYING');
      });
    }

    const restartBtn = document.getElementById('btn-restart-game');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        sound.playClick();
        this.showScreen('playing');
        this.game.startNewGame(this.hangar.selectedSkinId);
      });
    }

    const quitBtn = document.getElementById('btn-quit-to-menu');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        sound.playClick();
        this.game.setGameState('MENU');
        this.showScreen('menu');
      });
    }

    // Game Over Actions
    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        sound.playClick();
        this.showScreen('playing');
        this.game.startNewGame(this.hangar.selectedSkinId);
      });
    }

    const goHangarBtn = document.getElementById('btn-gameover-hangar');
    if (goHangarBtn) {
      goHangarBtn.addEventListener('click', () => {
        sound.playClick();
        this.updateStardustDisplay();
        this.showScreen('hangar');
      });
    }

    // State Change Listener
    this.game.onStateChange = (state) => {
      if (state === 'PAUSED') {
        this.showScreen('pause');
      } else if (state === 'PLAYING') {
        this.showScreen('playing');
      } else if (state === 'GAMEOVER') {
        this.showScreen('gameover');
        this.updateGameOverStats();
      } else if (state === 'MENU') {
        this.showScreen('menu');
      }
    };
  }

  updateGameOverStats() {
    document.getElementById('summary-score').innerText = this.game.score.toLocaleString();
    document.getElementById('summary-wave').innerText = this.game.wave.toString();
    document.getElementById('summary-kills').innerText = this.game.kills.toString();
    const stardustEarned = Math.floor(this.game.score / 100);
    document.getElementById('summary-stardust').innerText = `+${stardustEarned} 💎`;

    this.game.stardust += stardustEarned;
    this.game.saveStardust();
    this.updateStardustDisplay();
  }

  startAppLoop() {
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      this.game.update(now, dt);
      this.game.draw();
      this.hud.update();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
