export const ACHIEVEMENTS = [
  {
    id: 'first_blood',
    title: 'FIRST BLOOD',
    desc: 'Eliminate your first enemy ship',
    icon: '🎯',
    reward: 50,
    check: (stats) => stats.kills >= 1
  },
  {
    id: 'asteroid_breaker',
    title: 'ASTEROID CRUSHER',
    desc: 'Shatter 50 space rocks',
    icon: '☄️',
    reward: 100,
    check: (stats) => stats.asteroidsShattered >= 50
  },
  {
    id: 'wave_survivor',
    title: 'WAVE MASTER',
    desc: 'Reach Wave 5 in arcade survival',
    icon: '🌊',
    reward: 150,
    check: (stats) => stats.maxWave >= 5
  },
  {
    id: 'boss_slayer',
    title: 'COSMIC OVERLORD DEFEATER',
    desc: 'Vanquish a Boss entity',
    icon: '👾',
    reward: 300,
    check: (stats) => stats.bossesKilled >= 1
  },
  {
    id: 'combo_god',
    title: 'COMBO KING',
    desc: 'Achieve a 10x Combo Multiplier',
    icon: '⚡',
    reward: 200,
    check: (stats) => stats.maxCombo >= 10
  },
  {
    id: 'stardust_hoarder',
    title: 'STARDUST MAGNATE',
    desc: 'Collect 1,000 total Star Crystals',
    icon: '💎',
    reward: 400,
    check: (stats) => stats.totalStardust >= 1000
  }
];
