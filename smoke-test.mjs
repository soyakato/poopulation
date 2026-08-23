import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

for (const file of ["index.html", "realtime.html", "tactics.html", "studio.html"]) {
  const html = fs.readFileSync(new URL(file, import.meta.url), "utf8");
  assert.match(html, /^<!doctype html>/i, `${file}: standards mode`);
  for (const [, code] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (code.trim()) new Function(code);
  }
}

const realtime = fs.readFileSync(new URL("realtime.html", import.meta.url), "utf8");
const tactics = fs.readFileSync(new URL("tactics.html", import.meta.url), "utf8");
assert.ok(!realtime.includes("GSIZE"), "removed undefined realtime sprite constant");
assert.match(tactics, /newGame\(false\)/, "title screen must not advance turns");
assert.match(tactics, /POOPULATION_CONFIG\.tactics/, "tactics reads shared master data");
assert.match(tactics, /d\.dir>0 && a\.tx>d\.tx/, "back attack follows the corrected facing rule");
assert.match(tactics, /function nextStage\(\)/, "stage transition carries the live map forward");
assert.match(tactics, /function openCamp\(\)/, "stage clear opens a reward camp");
assert.match(tactics, /function chooseReward\(i\)/, "one reward advances to the next stage");
assert.match(tactics, /function clearStageIfReady\(\)/, "round survival uses one shared stage-clear check");
assert.match(tactics, /G\.round=Math\.min\(LAST_ROUND,G\.round\+1\)/, "round counter never displays beyond its configured limit");
assert.match(tactics, /if\(clearStageIfReady\(\)\) return;/, "defeating the final enemy clears without another world tick");
assert.ok(!tactics.includes("G.round>LAST_ROUND"), "stage clear no longer waits for an extra round");
assert.match(tactics, /locked\?\{kind:"GORILLA"/, "camp can unlock and recruit a gorilla type");
assert.match(tactics, /kind:"ABILITY"/, "camp can unlock a herd ability");
assert.match(tactics, /kind:"UPGRADE"/, "camp can grant a permanent stat upgrade");
assert.match(tactics, /BORN\[c\]\.filter\(\(\[type\]\)=>G\.progress\.unlocked\.includes\(type\)\)/, "birth pool respects unlocked gorillas");
assert.match(tactics, /if\(G\.stage<STAGE_COUNT\) openCamp\(\)/, "intermission happens before every non-final stage");
assert.match(tactics, /enemyStageStats/, "enemy stats scale by stage");
assert.match(tactics, /progress:\{unlocked:/, "run inventory is initialized with the starting roster");
assert.equal((tactics.match(/Math\.random/g)||[]).length,1,"randomness is cosmetic only");
assert.match(tactics, /T==="normal"&&u\.belly\.length<poopNeed\(u\)/,"strong poop requires eaten fruit");
assert.match(tactics, /if\(t\.v<3\)\{\s*t\.v\+\+/,"wizard rain advances vegetation immediately");
assert.match(tactics, /if\(t\.fire>0\)\{ t\.fire=0; quenched\+\+;/,"wizard rain extinguishes without undoing its own growth");
assert.match(tactics, /r:\{jp:"こうげき",gain:2\}/,"red fruit raises attack");
assert.match(tactics, /b:\{jp:"最大MP",gain:2\}/,"blue fruit raises max MP");
assert.match(tactics, /y:\{jp:"すばやさ",gain:2\}/,"yellow fruit raises speed");
assert.ok(!tactics.includes("FRUIT_BUFF_CAP"),"fruit upgrades have no per-fruit count limit");
assert.match(tactics, /FRUIT_STAT_MAX=99/,"fruit-upgraded stats have a shared maximum");
assert.match(tactics, /Math\.min\(FRUIT_BUFF\[t\.c\]\.gain,Math\.max\(0,FRUIT_STAT_MAX-fruitStat\(u,t\.c\)\)\)/,"fruit upgrades clamp before applying");
assert.match(tactics, /if\(t\.c==="b"\) u\.maxmp\+=add/,"blue fruit updates the unit MP cap by the clamped amount");
assert.match(tactics, /big\s+:\{jp:"でかうんち",\s+fert:6, size:1\.7, splash:6/,"big poop fertilizes all five cross tiles equally");
assert.ok(!tactics.includes("wild"),"initial and poop-grown vegetation use the same rules");
assert.match(tactics, /treeAge:0/,"each tree tracks its own survival time");
assert.match(tactics, /if\(t\.v===3&&t\.fire<=0\) t\.treeAge\+\+;/,"surviving mature trees age with world growth");
assert.match(tactics, /t\.treeAge>=BIRTH_TREE_TURNS/,"birth comes directly from a long-surviving tree");
assert.match(tactics, /parent\.t\.treeAge=0/,"a parent tree restarts its birth timer after birth");
assert.match(tactics, /for\(let dy=-1;dy<=1;dy\+\+\)for\(let dx=-1;dx<=1;dx\+\+\)\{\s+const t=at\(A\.tx\+dx,A\.ty\+dy\)/,"rain animation covers every tile in its 3x3 area");
assert.match(tactics, /r===1 \? "前後左右 4マス"/,"range 1 is explained as four orthogonal tiles");
assert.match(tactics, /setRange\(range\)/,"the whole attack range is previewed");
assert.ok(!tactics.includes('.like'),"tactics has no favorite-fruit exception");
assert.ok(!realtime.includes('.like'),"realtime has no favorite-fruit exception");
assert.ok(!/return ["']wet["']/.test(tactics+realtime),"blue fruit no longer creates wet poop");
assert.match(tactics, /new Set\(u\.belly\)\.size>=3\) return "gold"/,"three colors still create gold poop in tactics");
assert.match(realtime, /new Set\(\[c,\.\.\.g\.belly\]\)\.size>=3\) return "gold"/,"three colors create gold poop in realtime");
assert.match(tactics, /12\+Math\.round\(K\.size\*6\)/,"poop landing has an amplified particle burst");
assert.match(realtime, /since<0\.45/,"poop landing draws a visible shockwave");

const sandbox = { window:{}, localStorage:{ getItem:()=>null } };
const configSource=fs.readFileSync(new URL("poop-config.js", import.meta.url), "utf8");
vm.runInNewContext(configSource, sandbox);
const master=sandbox.window.POOPULATION_CONFIG.tactics;
assert.ok(master.enemies.killer.atk < master.allies.normal.atk, "default killer is weaker than a normal gorilla");
assert.ok(master.startRoster.length>0 && master.waves.length>0, "playable roster and waves");
assert.ok(master.stageCount>=2, "multi-stage run enabled");
assert.ok(master.stageCount>=4, "default campaign has several reward decisions");
assert.ok(master.enemyHpGrowth>0 && master.enemyAtkGrowth>0, "later stages scale enemy stats");
assert.equal(master.allies.normal.rng,1,"normal gorilla attacks the four adjacent tiles");
assert.ok(master.birthTreeTurns>=1,"tree survival turns are master data");
assert.ok(master.waves.every(w=>w.r<=master.lastRound), "waves fit inside the configured run");
const oldSandbox={window:{},localStorage:{getItem:()=>JSON.stringify({version:4,tactics:{stageCount:2}})}};
vm.runInNewContext(configSource,oldSandbox);
assert.equal(oldSandbox.window.POOPULATION_CONFIG.tactics.stageCount,4,"old two-stage saves migrate to the campaign baseline once");
console.log("POOPULATION smoke test: OK");
