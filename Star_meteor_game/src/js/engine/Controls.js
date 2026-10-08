export class Controls {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
    this.touchJoystick = { active: false, dx: 0, dy: 0 };
    this.isFiring = false;
    this.isUltPressed = false;
    this.listeners = {};

    this.initKeyboard();
    this.initMouse();
    this.initTouch();
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'Space') {
        this.isFiring = true;
      }
      if (e.code === 'KeyE') {
        this.emit('triggerUlt');
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        this.emit('pauseToggle');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;

      if (e.code === 'Space') {
        this.isFiring = false;
      }
    });
  }

  initMouse() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left click
        this.mouse.down = true;
        this.isFiring = true;
      } else if (e.button === 2) { // Right click
        e.preventDefault();
        this.emit('triggerUlt');
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouse.down = false;
        this.isFiring = false;
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initTouch() {
    const zone = document.getElementById('touch-joystick-zone');
    const knob = document.getElementById('touch-joystick-knob');
    const btnFire = document.getElementById('btn-touch-fire');
    const btnUlt = document.getElementById('btn-touch-ult');

    if (!zone || !knob) return;

    let touchId = null;
    let startX = 0, startY = 0;

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.targetTouches[0];
      touchId = touch.identifier;
      const rect = zone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      this.touchJoystick.active = true;
    });

    zone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.targetTouches.length; i++) {
        const touch = e.targetTouches[i];
        if (touch.identifier === touchId) {
          const dx = touch.clientX - startX;
          const dy = touch.clientY - startY;
          const dist = Math.min(45, Math.hypot(dx, dy));
          const angle = Math.atan2(dy, dx);

          knob.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
          this.touchJoystick.dx = (Math.cos(angle) * dist) / 45;
          this.touchJoystick.dy = (Math.sin(angle) * dist) / 45;
        }
      }
    });

    const resetTouch = (e) => {
      knob.style.transform = 'translate(0px, 0px)';
      this.touchJoystick.active = false;
      this.touchJoystick.dx = 0;
      this.touchJoystick.dy = 0;
    };

    zone.addEventListener('touchend', resetTouch);
    zone.addEventListener('touchcancel', resetTouch);

    if (btnFire) {
      btnFire.addEventListener('touchstart', (e) => { e.preventDefault(); this.isFiring = true; });
      btnFire.addEventListener('touchend', (e) => { e.preventDefault(); this.isFiring = false; });
    }

    if (btnUlt) {
      btnUlt.addEventListener('touchstart', (e) => { e.preventDefault(); this.emit('triggerUlt'); });
    }
  }

  getMovementVector() {
    let dx = 0;
    let dy = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (this.touchJoystick.active) {
      dx = this.touchJoystick.dx;
      dy = this.touchJoystick.dy;
    }

    return { dx, dy };
  }
}
