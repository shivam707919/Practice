// Spaceship Skins & Arsenal Specifications
export const SPACESHIP_SKINS = [
  {
    id: 'apex-vector',
    name: 'APEX VECTOR',
    rarity: 'COMMON',
    desc: 'Standard issue tactical interceptor equipped with dual plasma cannons.',
    price: 0,
    unlocked: true,
    stats: { speed: 70, firepower: 60, shield: 65, energy: 70 },
    ability: 'Plasma Overcharge (Dual Rapid Blasters)',
    color: '#00f3ff',
    glowColor: 'rgba(0, 243, 255, 0.6)',
    trailType: 'cyan',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);
      
      // Engine flame
      if (isEngineOn) {
        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-10, 25);
        ctx.lineTo(0, 45 + Math.random() * 10);
        ctx.lineTo(10, 25);
        ctx.closePath();
        ctx.fill();
      }

      // Main Hull
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#09152b';

      ctx.beginPath();
      ctx.moveTo(0, -35); // Nose tip
      ctx.lineTo(25, 20); // Right wing tip
      ctx.lineTo(12, 25);
      ctx.lineTo(10, 20);
      ctx.lineTo(0, 15);
      ctx.lineTo(-10, 20);
      ctx.lineTo(-12, 25);
      ctx.lineTo(-25, 20); // Left wing tip
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Canopy Glow
      ctx.fillStyle = '#00f3ff';
      ctx.beginPath();
      ctx.ellipse(0, -5, 6, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing Cannons
      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(-24, 0, 3, 15);
      ctx.fillRect(21, 0, 3, 15);

      ctx.restore();
    }
  },
  {
    id: 'cyber-phoenix',
    name: 'CYBER PHOENIX',
    rarity: 'RARE',
    desc: 'Thermal interceptor with sweeping solar wings and fiery spread cannons.',
    price: 150,
    unlocked: false,
    stats: { speed: 85, firepower: 80, shield: 55, energy: 75 },
    ability: 'Solar Spread (5-Way Plasma Cannon Spread)',
    color: '#ff6600',
    glowColor: 'rgba(255, 102, 0, 0.7)',
    trailType: 'orange',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#ff6600';
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(-14, 22);
        ctx.lineTo(0, 50 + Math.random() * 12);
        ctx.lineTo(14, 22);
        ctx.closePath();
        ctx.fill();
      }

      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#200b05';

      // Swept Phoenix Wings
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(35, 10);
      ctx.lineTo(28, 25);
      ctx.lineTo(14, 18);
      ctx.lineTo(0, 24);
      ctx.lineTo(-14, 18);
      ctx.lineTo(-28, 25);
      ctx.lineTo(-35, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wing accents
      ctx.strokeStyle = '#ff6600';
      ctx.beginPath();
      ctx.moveTo(0, -20); ctx.lineTo(25, 5);
      ctx.moveTo(0, -20); ctx.lineTo(-25, 5);
      ctx.stroke();

      // Glowing Core
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(0, -2, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'void-reaper',
    name: 'VOID REAPER',
    rarity: 'RARE',
    desc: 'Stealth assassin ship equipped with dark energy piercing laser beams.',
    price: 300,
    unlocked: false,
    stats: { speed: 90, firepower: 75, shield: 60, energy: 85 },
    ability: 'Void Piercer (Shield-Bypassing Beam)',
    color: '#9d00ff',
    glowColor: 'rgba(157, 0, 255, 0.7)',
    trailType: 'purple',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#9d00ff';
        ctx.shadowColor = '#9d00ff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(-8, 26); ctx.lineTo(0, 48 + Math.random() * 8); ctx.lineTo(8, 26);
        ctx.closePath(); ctx.fill();
      }

      ctx.shadowColor = '#9d00ff';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#9d00ff';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#120520';

      // Aggressive Blade Silhouette
      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.lineTo(8, -15);
      ctx.lineTo(32, 22);
      ctx.lineTo(20, 28);
      ctx.lineTo(5, 16);
      ctx.lineTo(0, 22);
      ctx.lineTo(-5, 16);
      ctx.lineTo(-20, 28);
      ctx.lineTo(-32, 22);
      ctx.lineTo(-8, -15);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Inner amethyst crystal glow
      ctx.fillStyle = '#e066ff';
      ctx.beginPath();
      ctx.moveTo(0, -18); ctx.lineTo(5, 0); ctx.lineTo(0, 10); ctx.lineTo(-5, 0);
      ctx.closePath(); ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'plasma-titan',
    name: 'PLASMA TITAN',
    rarity: 'EPIC',
    desc: 'Heavy dreadnought with dual shield generators and explosive plasma mortars.',
    price: 500,
    unlocked: false,
    stats: { speed: 55, firepower: 95, shield: 95, energy: 60 },
    ability: 'Heavy Fortress (Fortified Shield & Dual Blast)',
    color: '#ffe600',
    glowColor: 'rgba(255, 230, 0, 0.7)',
    trailType: 'gold',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 20;
        ctx.fillRect(-16, 26, 8, 20 + Math.random() * 8);
        ctx.fillRect(8, 26, 8, 20 + Math.random() * 8);
      }

      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#ffcf25';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#211d04';

      // Heavy Armored Bulkhead
      ctx.beginPath();
      ctx.moveTo(-15, -35); ctx.lineTo(15, -35);
      ctx.lineTo(30, -10); ctx.lineTo(35, 20);
      ctx.lineTo(20, 30); ctx.lineTo(0, 25);
      ctx.lineTo(-20, 30); ctx.lineTo(-35, 20);
      ctx.lineTo(-30, -10);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Front Cannon Barrels
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(-12, -45, 5, 15);
      ctx.fillRect(7, -45, 5, 15);

      // Core Power Node
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, -5, 16, 12);

      ctx.restore();
    }
  },
  {
    id: 'nebula-spectre',
    name: 'NEBULA SPECTRE',
    rarity: 'EPIC',
    desc: 'Agile speedster vessel armed with bio-plasma homing seekers.',
    price: 750,
    unlocked: false,
    stats: { speed: 98, firepower: 75, shield: 65, energy: 90 },
    ability: 'Homing Swarm (Seeking Bio-Missiles)',
    color: '#00ff66',
    glowColor: 'rgba(0, 255, 102, 0.7)',
    trailType: 'green',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#00ff66';
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(-6, 24); ctx.lineTo(0, 48 + Math.random() * 10); ctx.lineTo(6, 24);
        ctx.closePath(); ctx.fill();
      }

      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#041f11';

      // Fluid Organic Aerodynamic Design
      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.quadraticCurveTo(20, -10, 32, 15);
      ctx.lineTo(20, 25);
      ctx.quadraticCurveTo(0, 15, -20, 25);
      ctx.lineTo(-32, 15);
      ctx.quadraticCurveTo(-20, -10, 0, -42);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Bio Plasma Core
      ctx.fillStyle = '#66ffaa';
      ctx.beginPath();
      ctx.arc(0, -8, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'solar-aegis',
    name: 'SOLAR AEGIS',
    rarity: 'EPIC',
    desc: 'Defensive guardian vessel protected by revolving energy drone satellites.',
    price: 1000,
    unlocked: false,
    stats: { speed: 70, firepower: 85, shield: 90, energy: 80 },
    ability: 'Aegis Barrier (Automated Deflector Orbiters)',
    color: '#ffb700',
    glowColor: 'rgba(255, 183, 0, 0.7)',
    trailType: 'amber',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#ffb700';
        ctx.shadowColor = '#ffb700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-10, 24); ctx.lineTo(0, 44 + Math.random() * 8); ctx.lineTo(10, 24);
        ctx.closePath(); ctx.fill();
      }

      // Revolving Ring Element
      ctx.strokeStyle = 'rgba(255, 183, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 16, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Ship Body
      ctx.shadowColor = '#ffb700';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#ffcf25';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#1c1303';

      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.lineTo(24, 0); ctx.lineTo(16, 26);
      ctx.lineTo(0, 20); ctx.lineTo(-16, 26); ctx.lineTo(-24, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Satellite Orbs
      ctx.fillStyle = '#ffb700';
      ctx.beginPath(); ctx.arc(-36, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(36, 0, 4, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'vortex-valkyrie',
    name: 'VORTEX VALKYRIE',
    rarity: 'LEGENDARY',
    desc: 'Dimensional rift cruiser that collapses space-time to create vortex singularities.',
    price: 1500,
    unlocked: false,
    stats: { speed: 92, firepower: 95, shield: 80, energy: 95 },
    ability: 'Gravity Vortex (Screen-Clearing Singularity)',
    color: '#ff00aa',
    glowColor: 'rgba(255, 0, 170, 0.8)',
    trailType: 'magenta',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#ff00aa';
        ctx.shadowColor = '#ff00aa';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(-12, 22); ctx.lineTo(0, 52 + Math.random() * 12); ctx.lineTo(12, 22);
        ctx.closePath(); ctx.fill();
      }

      ctx.shadowColor = '#ff00aa';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#ff00aa';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#240316';

      // Twin Forward Forward Prongs
      ctx.beginPath();
      ctx.moveTo(-12, -44); ctx.lineTo(-6, -20); ctx.lineTo(0, -30); ctx.lineTo(6, -20); ctx.lineTo(12, -44);
      ctx.lineTo(28, 10); ctx.lineTo(18, 28); ctx.lineTo(0, 20); ctx.lineTo(-18, 28); ctx.lineTo(-28, 10);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Pulsing Vortex Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -5, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'hyperion-prime',
    name: 'HYPERION PRIME',
    rarity: 'LEGENDARY',
    desc: 'Ultimate flagship fitted with hyper-beam obliterators and prismatic aura shield.',
    price: 2500,
    unlocked: false,
    stats: { speed: 100, firepower: 100, shield: 100, energy: 100 },
    ability: 'Hyperion Beam (Obliterates Everything)',
    color: '#00f3ff',
    glowColor: 'rgba(255, 255, 255, 0.9)',
    trailType: 'rainbow',
    draw: (ctx, width, height, isEngineOn = true) => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      if (isEngineOn) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(-16, 25); ctx.lineTo(0, 60 + Math.random() * 15); ctx.lineTo(16, 25);
        ctx.closePath(); ctx.fill();
      }

      // Rainbow Prismatic Aura
      const grad = ctx.createLinearGradient(-40, 0, 40, 0);
      grad.addColorStop(0, '#ff0055');
      grad.addColorStop(0.3, '#ffe600');
      grad.addColorStop(0.6, '#00ff66');
      grad.addColorStop(1, '#00f3ff');

      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 25;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.5;
      ctx.fillStyle = '#061321';

      // Regal Flagship Crown Wings
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.lineTo(12, -20); ctx.lineTo(38, -5); ctx.lineTo(42, 20); ctx.lineTo(24, 30);
      ctx.lineTo(0, 24); ctx.lineTo(-24, 30); ctx.lineTo(-42, 20); ctx.lineTo(-38, -5); ctx.lineTo(-12, -20);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Center Crystal Eye
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, -10, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
];
