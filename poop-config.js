/*
 * POOPULATION shared tuning values.
 * Edit these defaults in git, or open studio.html to tune them visually and
 * export a replacement file. Browser-only previews are stored in localStorage.
 */
(() => {
  const defaults = {
    version: 5,
    animation: {
      realtimeStrain: 1.05,
      realtimeBigStrain: 1.85,
      tacticsStrain: 1.9,
      tacticsBigStrain: 2.8,
      arc: 20,
      squash: 0.65,
      steam: 2.2,
      impactShake: 1.35
    },
    tactics: {
      stageCount: 4,
      lastRound: 20,
      worldTicks: 20,
      enemyHpGrowth: 15,
      enemyAtkGrowth: 8,
      forestPerExtraEnemy: 20,
      maxExtraEnemies: 2,
      birthTreeTurns: 5,
      maxApes: 10,
      startRoster: ["normal", "normal", "monkey"],
      terrain: {
        hillCount: 2,
        hillRadiusMax: 2,
        riverExtraWidthChance: 0.25,
        groveTrees: 2
      },
      allies: {
        normal:   { atk:26, hp:100, spd:24, move:4, jump:2, rng:1, def:1,    mp:10 },
        monkey:   { atk:15, hp:44,  spd:46, move:7, jump:3, rng:1, def:1,    mp:8 },
        guardian: { atk:34, hp:170, spd:20, move:3, jump:2, rng:1, def:0.5,  mp:12 },
        silver:   { atk:44, hp:240, spd:16, move:2, jump:1, rng:1, def:0.34, mp:10 },
        wizard:   { atk:22, hp:92,  spd:28, move:4, jump:2, rng:2, def:1,    mp:18 },
        chimp:    { atk:20, hp:74,  spd:32, move:5, jump:3, rng:3, def:1,    mp:12 }
      },
      enemies: {
        killer:  { atk:20, hp:62,  spd:21, move:3, jump:1, rng:1, def:1 },
        bald:    { atk:18, hp:90,  spd:16, move:3, jump:1, rng:1, def:1 },
        fireman: { atk:12, hp:55,  spd:21, move:3, jump:1, rng:2, def:1 },
        jikon:   { atk:28, hp:115, spd:22, move:3, jump:2, rng:1, def:0.8 }
      },
      waves: [
        { r:3,  kind:"killer",  n:2 },
        { r:6,  kind:"bald",    n:2 },
        { r:9,  kind:"fireman", n:2 },
        { r:12, kind:"killer",  n:2 },
        { r:14, kind:"jikon",   n:1 },
        { r:17, kind:"fireman", n:3 }
      ]
    }
  };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("poopulation-config") || "{}"); } catch {}
  if((saved.version||0)<5) saved={...saved,version:5,tactics:{...(saved.tactics||{}),stageCount:Math.max(4,Number(saved.tactics?.stageCount)||0)}};
  const tactics = saved.tactics || {};
  const mergeUnits = (base, overrides={}) => Object.fromEntries(
    Object.entries(base).map(([key, stats]) => [key, { ...stats, ...(overrides[key] || {}) }])
  );
  window.POOPULATION_CONFIG = {
    ...defaults,
    ...saved,
    animation: { ...defaults.animation, ...(saved.animation || {}) },
    tactics: {
      ...defaults.tactics,
      ...tactics,
      terrain: { ...defaults.tactics.terrain, ...(tactics.terrain || {}) },
      allies: mergeUnits(defaults.tactics.allies, tactics.allies),
      enemies: mergeUnits(defaults.tactics.enemies, tactics.enemies),
      startRoster: Array.isArray(tactics.startRoster) && tactics.startRoster.length ? tactics.startRoster : defaults.tactics.startRoster,
      waves: Array.isArray(tactics.waves) && tactics.waves.length ? tactics.waves : defaults.tactics.waves
    }
  };
})();
