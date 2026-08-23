/*
 * POOPULATION — ステージ定義の読みこみ・検証・解決。
 *
 * `stages.json` がキャンペーン唯一の元データです。このファイルは
 *   validate() … 書きかたの間違いを日本語で指摘する
 *   resolve()  … 難易度をかけ合わせて、エンジンがそのまま使える形にする
 *   load()     … ブラウザから stages.json を取ってきて上の2つを通す
 *   fallback() … stages.json が読めなかったときに poop-config.js から作る保険
 * を提供します。ブラウザでも Node（スモークテスト・CI）でも同じコードが動きます。
 *
 * 編集方法は STAGES.md を読んでください。書式を間違えても stages.html が
 * どの行がどう悪いかを教えてくれるので、まずそこで確認するのが早いです。
 */
(() => {
  "use strict";

  const ENEMY_KINDS = ["killer", "bald", "fireman", "jikon"];
  const ALLY_KINDS  = ["normal", "monkey", "guardian", "silver", "wizard", "chimp"];
  const OBJECTIVES  = ["survive", "wipe", "forest", "births"];
  const RIVERS      = ["none", "narrow", "wide"];
  const COLORS      = ["y", "r", "b"];
  const SKILLS      = ["rocket", "dash", "stamp", "stomp", "rain", "stone"];
  const ENEMY_AI    = ["hunter", "lumberjack", "arsonist", "jikon"];
  const SCHEMA_VERSION = 1;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const isObj = v => !!v && typeof v === "object" && !Array.isArray(v);
  const isNum = v => typeof v === "number" && Number.isFinite(v);
  const isInt = v => isNum(v) && Number.isInteger(v);
  const isText = v => typeof v === "string" && v.trim().length > 0;

  /* ざっくり比率をかけて、最低1は残す */
  const scaleCount = (n, mul) => Math.max(1, Math.round(n * mul));

  /* ---------- 既定値 ---------- */
  const DIFFICULTY_DEFAULTS = {
    enemyHp: 1, enemyAtk: 1, waveCount: 1, roundsScale: 1,
    stageScale: { hp: 0.06, atk: 0.035 },
    reinforceMax: 2, fireSpread: 1, birthTreeTurns: 5, maxApes: 10,
    allyBonus: { atk: 0, hp: 0, mp: 0, spd: 0 },
  };
  const STAGE_DEFAULTS = {
    objective: { type: "survive" },
    terrain: null,          // null = 前ステージの森をそのまま引き継ぐ
    waves: [],
    enemyScale: { hp: 1, atk: 1 },
    reinforce: { perForest: 20, max: 2 },
    fireSpread: 1,
    worldTicks: 20,
    camp: true,
    intro: null,
  };
  const TERRAIN_DEFAULTS = { seed: 1, hills: 2, hillRadius: 2, river: "narrow", groveTrees: 2 };

  /* ══════════ 検証 ══════════ */
  function validate(data, opts = {}) {
    const enemyKinds = opts.enemyKinds || ENEMY_KINDS;
    const allyKinds  = opts.allyKinds  || ALLY_KINDS;
    const errors = [], warnings = [];
    const err = (where, msg) => errors.push(`${where}: ${msg}`);
    const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

    if (!isObj(data)) {
      return { ok: false, errors: ["ルート: JSONオブジェクトではありません"], warnings };
    }
    if (data.version !== SCHEMA_VERSION) {
      err("version", `${SCHEMA_VERSION} である必要があります（今は ${JSON.stringify(data.version)}）`);
    }

    /* --- 難易度 --- */
    const diffs = Array.isArray(data.difficulties) ? data.difficulties : [];
    if (!diffs.length) err("difficulties", "最低1つの難易度が必要です");
    const diffIds = new Set();
    diffs.forEach((d, i) => {
      const w = `difficulties[${i}]`;
      if (!isObj(d)) return err(w, "オブジェクトではありません");
      if (!isText(d.id)) err(w + ".id", "文字列のIDが必要です");
      else if (diffIds.has(d.id)) err(w + ".id", `IDが重複しています: ${d.id}`);
      else diffIds.add(d.id);
      if (!isObj(d.name) || !isText(d.name.ja) || !isText(d.name.en)) err(w + ".name", "{ ja, en } の表示名が必要です");
      for (const key of ["enemyHp", "enemyAtk", "waveCount", "roundsScale", "fireSpread"]) {
        if (d[key] !== undefined && !(isNum(d[key]) && d[key] > 0)) err(`${w}.${key}`, "0より大きい数値にしてください");
      }
      for (const key of ["reinforceMax", "birthTreeTurns", "maxApes"]) {
        if (d[key] !== undefined && !(isInt(d[key]) && d[key] >= 0)) err(`${w}.${key}`, "0以上の整数にしてください");
      }
      if (d.allyBonus !== undefined && !isObj(d.allyBonus)) err(w + ".allyBonus", "{ atk, hp, mp, spd } のオブジェクトにしてください");
    });
    if (diffs.length && !diffIds.has(data.defaultDifficulty ?? "normal")) {
      err("defaultDifficulty", `difficulties に無いIDです: ${data.defaultDifficulty ?? "normal"}`);
    }

    /* --- キャンペーン --- */
    const camp = data.campaign;
    if (!isObj(camp)) return { ok: errors.length === 0, errors: errors.concat("campaign: オブジェクトが必要です"), warnings };
    if (camp.targetPlayHours !== undefined && !(isNum(camp.targetPlayHours) && camp.targetPlayHours > 0)) err("campaign.targetPlayHours", "0より大きい数値にしてください");
    if (camp.startRoster !== undefined) {
      if (!Array.isArray(camp.startRoster) || !camp.startRoster.length) err("campaign.startRoster", "1体以上の配列にしてください");
      else camp.startRoster.forEach((t, i) => {
        if (!allyKinds.includes(t)) err(`campaign.startRoster[${i}]`, `未知のゴリラです: ${t}（使えるのは ${allyKinds.join(" / ")}）`);
      });
    }

    const chapterIds = new Set();
    (Array.isArray(camp.chapters) ? camp.chapters : []).forEach((c, i) => {
      const w = `campaign.chapters[${i}]`;
      if (!isObj(c)) return err(w, "オブジェクトではありません");
      if (!isInt(c.id) || c.id < 1) err(w + ".id", "1以上の整数にしてください");
      else if (chapterIds.has(c.id)) err(w + ".id", `章IDが重複しています: ${c.id}`);
      else chapterIds.add(c.id);
      if (!isObj(c.name) || !isText(c.name.ja) || !isText(c.name.en)) err(w + ".name", "{ ja, en } の章名が必要です");
    });

    const stages = Array.isArray(camp.stages) ? camp.stages : [];
    if (!stages.length) err("campaign.stages", "最低1ステージが必要です");
    const stageIds = new Set();
    stages.forEach((s, i) => {
      const w = `campaign.stages[${i}]${isText(s && s.id) ? `(${s.id})` : ""}`;
      if (!isObj(s)) return err(w, "オブジェクトではありません");

      if (!isText(s.id)) err(w + ".id", "文字列のIDが必要です");
      else if (stageIds.has(s.id)) err(w + ".id", `IDが重複しています: ${s.id}`);
      else stageIds.add(s.id);

      if (!isObj(s.name) || !isText(s.name.ja) || !isText(s.name.en)) err(w + ".name", "{ ja, en } のステージ名が必要です");
      if (!isInt(s.rounds) || s.rounds < 1 || s.rounds > 99) err(w + ".rounds", "1〜99の整数にしてください");
      if (s.chapter !== undefined) {
        if (!isInt(s.chapter)) err(w + ".chapter", "整数の章IDにしてください");
        else if (chapterIds.size && !chapterIds.has(s.chapter)) err(w + ".chapter", `chapters に無い章です: ${s.chapter}`);
      }

      /* 目標 */
      if (s.objective !== undefined) {
        const o = s.objective;
        if (!isObj(o)) err(w + ".objective", "{ type, ... } のオブジェクトにしてください");
        else {
          if (!OBJECTIVES.includes(o.type)) err(w + ".objective.type", `使えるのは ${OBJECTIVES.join(" / ")} です（今は ${JSON.stringify(o.type)}）`);
          if ((o.type === "forest" || o.type === "births") && !(isNum(o.target) && o.target > 0)) {
            err(w + ".objective.target", `${o.type} には0より大きい target が必要です`);
          }
        }
      }

      /* 地形 */
      if (s.terrain !== undefined && s.terrain !== null && s.terrain !== "inherit") {
        const t = s.terrain;
        if (!isObj(t)) err(w + ".terrain", '"inherit"（引き継ぐ）か、地形オブジェクトにしてください');
        else {
          if (t.seed !== undefined && !isInt(t.seed)) err(w + ".terrain.seed", "整数にしてください（同じ数字なら毎回同じ地形）");
          if (t.hills !== undefined && !(isInt(t.hills) && t.hills >= 0 && t.hills <= 8)) err(w + ".terrain.hills", "0〜8の整数にしてください");
          if (t.hillRadius !== undefined && !(isInt(t.hillRadius) && t.hillRadius >= 1 && t.hillRadius <= 3)) err(w + ".terrain.hillRadius", "1〜3の整数にしてください");
          if (t.river !== undefined && !RIVERS.includes(t.river)) err(w + ".terrain.river", `使えるのは ${RIVERS.join(" / ")} です`);
          if (t.groveTrees !== undefined && !(isInt(t.groveTrees) && t.groveTrees >= 1 && t.groveTrees <= 6)) err(w + ".terrain.groveTrees", "1〜6の整数にしてください");
        }
      }

      /* 襲撃 */
      const waves = s.waves === undefined ? [] : s.waves;
      if (!Array.isArray(waves)) err(w + ".waves", "配列にしてください");
      else {
        waves.forEach((v, j) => {
          const wv = `${w}.waves[${j}]`;
          if (!isObj(v)) return err(wv, "オブジェクトではありません");
          if (!isInt(v.round) || v.round < 1) err(wv + ".round", "1以上の整数にしてください");
          else if (isInt(s.rounds) && v.round > s.rounds) warn(wv + ".round", `rounds(${s.rounds}) より後なので、この波は出ません`);
          if (!enemyKinds.includes(v.kind)) err(wv + ".kind", `未知の敵です: ${v.kind}（使えるのは ${enemyKinds.join(" / ")}）`);
          if (!isInt(v.count) || v.count < 1 || v.count > 20) err(wv + ".count", "1〜20の整数にしてください");
        });
        if (!waves.length && (!isObj(s.objective) || (s.objective.type ?? "survive") === "wipe")) {
          err(w + ".waves", "wipe（殲滅）の目標なのに敵が1体も出ません");
        }
        if (!waves.length) warn(w + ".waves", "敵が1体も出ないステージです。意図どおりか確認してください");
      }

      /* こまかい調整 */
      if (s.enemyScale !== undefined) {
        if (!isObj(s.enemyScale)) err(w + ".enemyScale", "{ hp, atk } にしてください");
        else for (const k of ["hp", "atk"]) {
          if (s.enemyScale[k] !== undefined && !(isNum(s.enemyScale[k]) && s.enemyScale[k] > 0)) err(`${w}.enemyScale.${k}`, "0より大きい数値にしてください");
        }
      }
      if (s.reinforce !== undefined) {
        if (!isObj(s.reinforce)) err(w + ".reinforce", "{ perForest, max } にしてください");
        else {
          if (s.reinforce.perForest !== undefined && !(isNum(s.reinforce.perForest) && s.reinforce.perForest > 0)) err(w + ".reinforce.perForest", "0より大きい数値にしてください");
          if (s.reinforce.max !== undefined && !(isInt(s.reinforce.max) && s.reinforce.max >= 0)) err(w + ".reinforce.max", "0以上の整数にしてください");
        }
      }
      if (s.fireSpread !== undefined && !(isNum(s.fireSpread) && s.fireSpread >= 0)) err(w + ".fireSpread", "0以上の数値にしてください");
      if (s.worldTicks !== undefined && !(isInt(s.worldTicks) && s.worldTicks >= 4 && s.worldTicks <= 100)) err(w + ".worldTicks", "4〜100の整数にしてください（大きいほど1ラウンドが長い）");
      if (s.camp !== undefined && typeof s.camp !== "boolean") err(w + ".camp", "true / false にしてください");
    });

    if (stages.length && stages[stages.length - 1].camp === true) {
      warn(`campaign.stages[${stages.length - 1}]`, "最終ステージの camp が true です。クリア後にキャンプへ行こうとします");
    }

    return { ok: errors.length === 0, errors, warnings };
  }

  function validateCharacters(data) {
    const errors=[], warnings=[], ids=new Set();
    const err=(where,msg)=>errors.push(`${where}: ${msg}`);
    if(!isObj(data)) return {ok:false,errors:["ルート: JSONオブジェクトではありません"],warnings};
    if(data.version!==1) err("version","1 である必要があります");
    for(const side of ["allies","enemies"]){
      const rows=Array.isArray(data[side])?data[side]:[];
      if(!rows.length) err(side,"最低1体必要です");
      rows.forEach((c,i)=>{
        const w=`${side}[${i}]`;
        if(!isObj(c)) return err(w,"オブジェクトではありません");
        if(!isText(c.id)) err(w+".id","文字列IDが必要です"); else if(ids.has(c.id)) err(w+".id",`IDが重複しています: ${c.id}`); else ids.add(c.id);
        if(!isObj(c.name)||!isText(c.name.ja)||!isText(c.name.en)) err(w+".name","{ ja, en } が必要です");
        if(!isText(c.sprite)) err(w+".sprite","既存キャラクターのsprite IDが必要です");
        const required=side==="allies"?["atk","hp","spd","move","jump","rng","def","mp"]:["atk","hp","spd","move","jump","rng","def"];
        if(!isObj(c.stats)) err(w+".stats","能力値オブジェクトが必要です"); else for(const key of required) if(!(isNum(c.stats[key])&&c.stats[key]>0)) err(`${w}.stats.${key}`,"0より大きい数値が必要です");
        if(side==="allies"){
          if(!isObj(c.from)||!isText(c.from.ja)||!isText(c.from.en)) err(w+".from","{ ja, en } が必要です");
          if(!isObj(c.skill)||!SKILLS.includes(c.skill.behavior)) err(w+".skill.behavior",`使えるのは ${SKILLS.join(" / ")} です`);
          if(!isObj(c.skill)||!isNum(c.skill.cost)||c.skill.cost<0) err(w+".skill.cost","0以上の数値が必要です");
          if(!isObj(c.skill?.name)||!isText(c.skill.name.ja)||!isText(c.skill.name.en)) err(w+".skill.name","{ ja, en } が必要です");
          if(!isObj(c.skill?.description)||!isText(c.skill.description.ja)||!isText(c.skill.description.en)) err(w+".skill.description","{ ja, en } が必要です");
          if(c.birth!==undefined&&(!isObj(c.birth)||!COLORS.includes(c.birth.color)||!isInt(c.birth.weight)||c.birth.weight<1)) err(w+".birth","{ color: y/r/b, weight: 1以上の整数 } にしてください");
        }else{
          if(!ENEMY_AI.includes(c.ai)) err(w+".ai",`使えるのは ${ENEMY_AI.join(" / ")} です`);
          if(!isObj(c.action)||!isText(c.action.ja)||!isText(c.action.en)) err(w+".action","{ ja, en } が必要です");
        }
      });
    }
    return {ok:errors.length===0,errors,warnings};
  }

  function validateSprites(data) {
    const errors=[], warnings=[];
    const err=(where,msg)=>errors.push(`${where}: ${msg}`);
    if(!isObj(data)) return {ok:false,errors:["ルート: JSONオブジェクトではありません"],warnings};
    if(data.version!==1) err("version","1 である必要があります");
    if(!isObj(data.sprites)) err("sprites","オブジェクトが必要です");
    else for(const [id,s] of Object.entries(data.sprites)){
      const w=`sprites.${id}`;
      if(!/^[a-z0-9_-]+$/.test(id)) err(w,"IDは半角英小文字・数字・_・-だけにしてください");
      if(!isObj(s)) {err(w,"オブジェクトではありません");continue;}
      if(!isInt(s.width)||s.width<1||s.width>64||!isInt(s.height)||s.height<1||s.height>64) err(w,"width / height は1〜64の整数にしてください");
      if(!Array.isArray(s.palette)||s.palette.length<1||s.palette.length>16||s.palette.some(c=>!/^#[0-9a-fA-F]{8}$/.test(c))) err(w+".palette","#RRGGBBAA形式を1〜16色指定してください");
      if(!Array.isArray(s.pixels)||s.pixels.length!==s.height) err(w+".pixels",`高さと同じ${s.height}行が必要です`);
      else s.pixels.forEach((row,y)=>{
        if(typeof row!=="string"||row.length!==s.width) err(`${w}.pixels[${y}]`,`幅と同じ文字数が必要です`);
        else for(const ch of row) if(!/[0-9a-f]/i.test(ch)||parseInt(ch,16)>=s.palette.length){err(`${w}.pixels[${y}]`,"paletteに無い色番号があります");break;}
      });
    }
    return {ok:errors.length===0,errors,warnings};
  }

  /* ══════════ 解決（難易度をかけ合わせる） ══════════ */
  function resolve(data, difficultyId) {
    const diffs = data.difficulties || [];
    const wantId = difficultyId ?? data.defaultDifficulty ?? "normal";
    const raw = diffs.find(d => d.id === wantId) || diffs.find(d => d.id === (data.defaultDifficulty ?? "normal")) || diffs[0] || {};
    const D = {
      ...DIFFICULTY_DEFAULTS, ...raw,
      stageScale: { ...DIFFICULTY_DEFAULTS.stageScale, ...(raw.stageScale || {}) },
      allyBonus:  { ...DIFFICULTY_DEFAULTS.allyBonus,  ...(raw.allyBonus  || {}) },
    };

    const camp = data.campaign || {};
    const chapters = (camp.chapters || []).map(c => ({ id: c.id, name: { ...c.name }, blurb: c.blurb ? { ...c.blurb } : null }));
    const chapterOf = id => chapters.find(c => c.id === id) || null;

    const stages = (camp.stages || []).map((s, i) => {
      const index = i + 1;
      const terrain = (s.terrain && s.terrain !== "inherit")
        ? { ...TERRAIN_DEFAULTS, ...s.terrain }
        : null;
      const enemyScale = { ...STAGE_DEFAULTS.enemyScale, ...(s.enemyScale || {}) };
      const reinforce  = { ...STAGE_DEFAULTS.reinforce,  ...(s.reinforce  || {}) };
      const ramp = { hp: 1 + (index - 1) * D.stageScale.hp, atk: 1 + (index - 1) * D.stageScale.atk };

      const waves = (s.waves || [])
        .map(v => ({ r: v.round, kind: v.kind, n: scaleCount(v.count, D.waveCount) }))
        .sort((a, b) => a.r - b.r);

      const rounds = clamp(Math.round((s.rounds || 1) * D.roundsScale), 1, 99);

      return {
        index,
        id: s.id,
        chapter: s.chapter ?? null,
        chapterName: chapterOf(s.chapter)?.name || null,
        name: { ...s.name },
        rounds,
        objective: { type: "survive", ...(s.objective || {}) },
        terrain,
        waves: waves.filter(v => v.r <= rounds),
        skippedWaves: waves.filter(v => v.r > rounds).length,
        enemyMul: { hp: enemyScale.hp * D.enemyHp * ramp.hp, atk: enemyScale.atk * D.enemyAtk * ramp.atk },
        reinforce: { perForest: reinforce.perForest, max: Math.min(reinforce.max, D.reinforceMax) },
        fireSpread: (s.fireSpread ?? STAGE_DEFAULTS.fireSpread) * D.fireSpread,
        worldTicks: s.worldTicks ?? STAGE_DEFAULTS.worldTicks,
        camp: s.camp ?? (i < (camp.stages || []).length - 1),
        intro: s.intro ? { ...s.intro } : null,
      };
    });

    return {
      campaignId: camp.id || "campaign",
      campaignName: camp.name ? { ...camp.name } : { ja: "キャンペーン", en: "Campaign" },
      targetPlayHours: camp.targetPlayHours || null,
      startRoster: camp.startRoster || null,
      difficulty: {
        id: raw.id || wantId,
        name: raw.name || { ja: wantId, en: wantId },
        blurb: raw.blurb || null,
        birthTreeTurns: D.birthTreeTurns,
        maxApes: D.maxApes,
        allyBonus: D.allyBonus,
      },
      difficulties: diffs.map(d => ({ id: d.id, name: d.name, blurb: d.blurb || null })),
      chapters,
      stages,
      totalRounds: stages.reduce((sum, s) => sum + s.rounds, 0),
    };
  }

  /* ══════════ stages.json が読めなかったときの保険 ══════════ */
  function fallback(master) {
    const m = master || {};
    const count = clamp(Math.round(m.stageCount || 1), 1, 20);
    const rounds = clamp(Math.round(m.lastRound || 20), 1, 99);
    const waves = (m.waves || []).map(w => ({ round: w.r, kind: w.kind, count: w.n }));
    return {
      version: SCHEMA_VERSION,
      defaultDifficulty: "normal",
      difficulties: [{ id: "normal", name: { ja: "ふつう", en: "Normal" } }],
      campaign: {
        id: "fallback",
        name: { ja: "予備キャンペーン", en: "Fallback Campaign" },
        chapters: [{ id: 1, name: { ja: "森", en: "Forest" } }],
        stages: Array.from({ length: count }, (_, i) => ({
          id: `f${i + 1}`, chapter: 1,
          name: { ja: `第${i + 1}森域`, en: `Forest Sector ${i + 1}` },
          rounds,
          terrain: i === 0 ? { seed: 1, hills: m.terrain?.hillCount ?? 2, hillRadius: m.terrain?.hillRadiusMax ?? 2,
                               river: "narrow", groveTrees: m.terrain?.groveTrees ?? 2 } : "inherit",
          waves,
          reinforce: { perForest: m.forestPerExtraEnemy ?? 20, max: m.maxExtraEnemies ?? 2 },
          camp: i < count - 1,
        })),
      },
    };
  }

  /* ══════════ ブラウザからの読みこみ ══════════ */
  async function load(url, opts = {}) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const report = validate(data, opts);
      return { data, report, source: url, error: null };
    } catch (e) {
      return { data: null, report: null, source: url, error: String(e && e.message || e) };
    }
  }

  async function loadCharacters(url) {
    try{
      const res=await fetch(url,{cache:"no-cache"});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data=await res.json(), report=validateCharacters(data);
      return {data,report,source:url,error:null};
    }catch(e){ return {data:null,report:null,source:url,error:String(e&&e.message||e)}; }
  }
  async function loadSprites(url) {
    try{
      const res=await fetch(url,{cache:"no-cache"});
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data=await res.json(), report=validateSprites(data);
      return {data,report,source:url,error:null};
    }catch(e){ return {data:null,report:null,source:url,error:String(e&&e.message||e)}; }
  }

  const API = { SCHEMA_VERSION, ENEMY_KINDS, ALLY_KINDS, OBJECTIVES, RIVERS,
                TERRAIN_DEFAULTS, validate, validateCharacters, validateSprites, resolve, fallback, load, loadCharacters, loadSprites };
  if (typeof globalThis !== "undefined") globalThis.POOPULATION_STAGES = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})();
