window.POOP_TACTICS_BOOT = () => {
"use strict";

/* ══════════ 盤面 ══════════ */
const TS=24, COLS=14, ROWS=10, HSTEP=7, YOFF=30;
const CW=COLS*TS, CH=ROWS*TS+YOFF+22;
const CFG=window.POOPULATION_CONFIG.animation;
const MASTER=window.POOPULATION_CONFIG.tactics;
const CAMPAIGN=window.POOPULATION_CAMPAIGN;
let LOCAL_TUNING={};
try{ LOCAL_TUNING=JSON.parse(localStorage.getItem("poopulation-config")||"{}").tactics||{}; }catch{}
let LANG="ja";
try{ LANG=localStorage.getItem("poopulation-lang")==="en"?"en":"ja"; }catch{}
const EN_REPLACE=[
  ["出生候補に追加。空きがあれば今すぐ1匹加入","Added to the birth pool; joins now if there is room"],
  ["全員と、これから生まれる仲間の攻撃+4","+4 attack for every ally, now and future"],
  ["全員と、これから生まれる仲間の最大HP+18。現在HPも+18","+18 max HP for every ally, now and future (heals +18)"],
  ["全員と、これから生まれる仲間の最大MP+3","+3 max MP for every ally, now and future"],
  ["全員と、これから生まれる仲間の素早さ+3","+3 speed for every ally, now and future"],
  ["全員と未来の仲間の最大HP+12","+12 max HP for every ally, now and future"],
  ["全員と未来の仲間の最大MP+2","+2 max MP for every ally, now and future"],
  ["群れの腕力","Troop Strength"],["群れの生命","Troop Vitality"],["群れの魔力","Troop Magic"],
  ["群れの俊敏","Troop Agility"],["奥義鍛錬","Skill Drill"],
  ["強い胃袋","Iron Stomach"],["実を食べた時の回復が HP24・MP4 になる","Eating fruit restores HP 24 / MP 4"],
  ["森の呼吸","Forest Breath"],["自分のターン開始時、地形から得るMPがさらに+1","+1 extra MP from terrain at turn start"],
  ["奥義集中","Focused Arts"],["すべてのゴリラの、とくぎ消費MPが1減る","All gorilla skills cost 1 less MP"],
  [" 解放"," UNLOCKED"],[" 制圧"," SECURED"],
  ["到達ステージ","Stage reached"],["最終ラウンド","Final round"],["育てた森","Forest grown"],
  ["したうんち","Poops"],["きんのうんち","Golden poops"],["生まれた仲間","Allies born"],
  ["死んだ仲間","Allies lost"],["倒した人族","Humans defeated"],["獲得した戦果","Rewards taken"],
  ["訃報 — ","In memoriam — "],["にやられた"," took them down"],["力尽きた","fell exhausted"],
  ["ゴリラ全滅","The troop is gone"],["神は、群れを絶やした。","The god let the bloodline end."],
  ["森は残った","The forest stands"],
  ["ステージの襲撃をしのぎ、森は次の世代へ渡った。"," stages of raids survived — the forest passes to the next generation."],
  ["森が焼き尽くされた","The forest burned away"],["うんちの記憶まで灰になった。","Even the memory of poop turned to ash."],
  ["森を育てて、人族の襲撃をしのげ","Grow the forest and survive the human raids"],
  ["ドラッグで移動、そのあと行動をえらぶ","Drag to move, then choose an action"],
  ["実のある成木の上で使う","Stand on a fruiting tree"],
  ["前後左右 4マス","4 orthogonal tiles"],
  ["射程内の敵をえらぶ","Choose an enemy in range"],
  ["金色の敵をえらぶ","Choose a highlighted enemy"],
  ["行動をえらぶ","Choose an action"],
  ["その場にうんちをする","Poop on the current tile"],
  ["おなかに実が","Fruit needed:"],
  ["個ひつよう",""],
  ["ラウンド生存"," rounds to survive"],
  ["普通のゴリラ","Gorilla"],["モンキー","Monkey"],["ガーディアンゴリラ","Guardian Gorilla"],
  ["シルバーバック","Silverback"],["ウィザードゴリラ","Wizard Gorilla"],["チンパンジー","Chimpanzee"],
  ["ゴリラを殺すハゲ","Bald Hunter"],["ゴリラを殺す人","Hunter"],["ファイアーメン","Fireman"],["ゴリラジコン","Gorilla Drone"],
  ["草原生まれ","Grassland-born"],["硬木林生まれ","Hardwood-born"],["湿地生まれ","Wetland-born"],
  ["草原","Grassland"],["硬木林","Hardwood"],["湿地","Wetland"],["最大MP","Max MP"],["上限","Cap"],
  ["こうげき","Attack"],["すばやさ","Speed"],["いどう","Move"],["ジャンプ","Jump"],["いま の 高さ","Height"],
  ["ロケットうんち","Rocket Poop"],["かけぬけ","Dash"],["ふみけし","Stamp Out"],["じだんだ","Tantrum"],["めぐみの雨","Blessed Rain"],["いしつぶて","Stone Throw"],
  ["もう一度 移動できる","Move again"],
  ["射程3の指定マスへ、十字5マスを育てる でかうんち を飛ばす","Launch big poop up to range 3; grow a 5-tile cross"],
  ["まわり3x3の火を消す。自分は焼けない","Extinguish a 3x3 area; immune to fire"],
  ["隣接する敵ぜんぶに大ダメージ＋ノックバック","Heavy damage and knockback to adjacent enemies"],
  ["指定3x3すべてに雨。消火し、草木は1段成長、成木は実+1","Rain on a 3x3 area: extinguish, grow plants, add fruit"],
  ["射程4に強い一撃。高さの不利を無視する","Heavy range-4 hit; ignores height disadvantage"],
  ["おおぐらい","Glutton"],["こわがり","Timid"],["けんかっぱやい","Rash"],["ものまね","Mimic"],["べんぴ","Constipated"],["おやおもい","Devoted"],
  ["攻撃範囲","Attack range"],["実の強化","Fruit boosts"],["おなか","Belly"],["からっぽ","Empty"],
  ["3枠","3 slots"],["空き","Empty"],
  ["敵の行動中","Enemy turn"],["準備中","Stand by"],["森の成長","Forest growth"],["森の誕生","Forest birth"],["敵の増援","Enemy wave"],
  ["成木を","Protect a mature tree for "],["手守る"," turns"],["最短あと","Ready in "],
  ["黄","Y"],["赤","R"],["青","B"],["本"," trees"],["未解放","Locked"],
];
function L(ja,en){ return LANG==="en"?en:ja; }
function localize(value){
  let out=String(value??"");
  if(LANG!=="en") return out;
  for(const [ja,en] of EN_REPLACE) out=out.split(ja).join(en);
  return out.replace(/\s{2,}/g," ").trim();
}

const rnd=(a=1,b=0)=>b+Math.random()*(a-b); // 見た目の粒子・揺れだけ。ゲーム結果には使わない
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
function hash(x,y){let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return((h^(h>>16))>>>0)/4294967296;}
function sprite(w,h,rects){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");for(const r of rects){g.fillStyle=r[4];g.fillRect(r[0],r[1],r[2],r[3]);}return c;}

/* ══════════ データ ══════════ */
const BIOME={
  y:{jp:"草原",  rate:2.0, cap:3, flam:0.95, ground:"#5a4a20", wall:"#3d3214",
     grass:["#8f9a2c","#aab63a","#6f7a22"], trunk:"#6b5322", leaf:["#93a02e","#b0bd42"], berry:"#e8c33a"},
  r:{jp:"硬木林",rate:1.4, cap:2, flam:0.28, ground:"#43301f", wall:"#2c1f14",
     grass:["#4a6b2c","#5c7f36","#3a5522"], trunk:"#5a3421", leaf:["#2f5b31","#3f7340"], berry:"#d94436"},
  b:{jp:"湿地",  rate:0.9, cap:2, flam:0.00, ground:"#2c4247", wall:"#1d2c30",
     grass:["#3f7d7a","#57a0a2","#2f6165"], trunk:"#3d5a52", leaf:["#3e7f83","#59a8a4"], berry:"#68d0e0"},
};
const COLORS=["y","r","b"];
const GROW_GRASS=2, GROW_SAP=5, GROW_TREE=9;
const FRUIT_BUFF={
  r:{jp:"こうげき",gain:2},
  b:{jp:"最大MP",gain:2},
  y:{jp:"すばやさ",gain:2},
};
const FRUIT_STAT_MAX=99;
const BELLY_MAX=3;

const TRAITS={
  glut  :{jp:"おおぐらい",  d:"たべると 満腹2つぶん"},
  timid :{jp:"こわがり",    d:"火のマスから真っ先に逃げる。こうげき −25%"},
  rash  :{jp:"けんかっぱやい",d:"敵が射程にいると、勝手にこうげきしてしまう"},
  mimic :{jp:"ものまね",    d:"隣の仲間の特性をコピーする"},
  consti:{jp:"べんぴ",      d:"うんちの力み時間が長い"},
  filial:{jp:"おやおもい",  d:"仲間が死ぬと激怒。こうげき +50%"},
};
const TKEY=Object.keys(TRAITS);
const NAMES=["ゴロ","バナ","ドン","キバ","モモ","タロ","ウホ","ボン","ガル","ズン","ペコ","ノコ","ムク","ゲン","ラム","ポポ","デカ","チビ","ヌシ","マメ"];

// move=移動力 / jump=登れる段差 / rng=射程 / def=被ダメ倍率
const APE_BUILTIN={
  normal  :{jp:"普通のゴリラ",     from:"草原",  ...MASTER.allies.normal,
            behavior:"rocket",sk:{n:"ロケットうんち", c:5, d:"射程3の指定マスへ、十字5マスを育てる でかうんち を飛ばす"}, ab:"はこぶ"},
  monkey  :{jp:"モンキー",         from:"草原",  ...MASTER.allies.monkey,
            behavior:"dash",sk:{n:"かけぬけ",     c:3, d:"もう一度 移動できる"}, ab:"すばしっこい"},
  guardian:{jp:"ガーディアンゴリラ",from:"硬木林",...MASTER.allies.guardian,
            behavior:"stamp",tags:["fireproof"],sk:{n:"ふみけし",     c:4, d:"まわり3x3の火を消す。自分は焼けない"}, ab:"ひをけす"},
  silver  :{jp:"シルバーバック",   from:"硬木林",...MASTER.allies.silver,
            behavior:"stomp",sk:{n:"じだんだ",     c:6, d:"隣接する敵ぜんぶに大ダメージ＋ノックバック"}, ab:"びくともしない"},
  wizard  :{jp:"ウィザードゴリラ", from:"湿地",  ...MASTER.allies.wizard,
            behavior:"rain",sk:{n:"めぐみの雨",   c:8, d:"指定3x3すべてに雨。消火し、草木は1段成長、成木は実+1"}, ab:"めぐみの雨"},
  chimp   :{jp:"チンパンジー",     from:"湿地",  ...MASTER.allies.chimp,
            behavior:"stone",sk:{n:"いしつぶて",   c:4, d:"射程4に強い一撃。高さの不利を無視する"}, ab:"石を投げる"},
};
const FOE_BUILTIN={
  killer :{jp:"ゴリラを殺す人",  ...MASTER.enemies.killer,  ai:"hunter",act:"ゴリラを狙う"},
  bald   :{jp:"ゴリラを殺すハゲ",...MASTER.enemies.bald,    ai:"lumberjack",act:"木を伐り倒す"},
  fireman:{jp:"ファイアーメン",  ...MASTER.enemies.fireman, ai:"arsonist",act:"森を焼き払う"},
  jikon  :{jp:"ゴリラジコン",    ...MASTER.enemies.jikon,   ai:"jikon",act:"殺したゴリラを仲間にする"},
};
const CHARACTER_SET=window.POOPULATION_CHARACTERS;
const APE=CHARACTER_SET?Object.fromEntries(CHARACTER_SET.allies.map(c=>[c.id,{
  get jp(){return c.name[LANG]||c.name.ja;}, get from(){return c.from?.[LANG]||c.from?.ja||"森";},
  ...c.stats,...(LOCAL_TUNING.allies?.[c.id]||{}),sprite:c.sprite,behavior:c.skill.behavior,tags:c.tags||[],
  sk:{get n(){return c.skill.name[LANG]||c.skill.name.ja;},c:c.skill.cost,get d(){return c.skill.description[LANG]||c.skill.description.ja;}},ab:c.ability||"",
}])):APE_BUILTIN;
const FOE=CHARACTER_SET?Object.fromEntries(CHARACTER_SET.enemies.map(c=>[c.id,{
  get jp(){return c.name[LANG]||c.name.ja;},...c.stats,...(LOCAL_TUNING.enemies?.[c.id]||{}),sprite:c.sprite,ai:c.ai,
  get act(){return c.action?.[LANG]||c.action?.ja||"ゴリラを狙う";},
}])):FOE_BUILTIN;
const BORN={y:[],r:[],b:[]};
if(CHARACTER_SET) for(const c of CHARACTER_SET.allies) if(c.birth) BORN[c.birth.color].push([c.id,c.birth.weight]);
else Object.assign(BORN,{y:[["normal",7],["monkey",3]],r:[["guardian",9],["silver",1]],b:[["wizard",7],["chimp",3]]});
const UNLOCK_ORDER=CHARACTER_SET?[...CHARACTER_SET.allies].sort((a,b)=>(a.unlockOrder??99)-(b.unlockOrder??99)).map(c=>c.id):["guardian","wizard","silver","chimp","monkey","normal"];
const ABILITY_ORDER=[
  {key:"digestion",jp:"強い胃袋",d:"実を食べた時の回復が HP24・MP4 になる"},
  {key:"flow",jp:"森の呼吸",d:"自分のターン開始時、地形から得るMPがさらに+1"},
  {key:"focus",jp:"奥義集中",d:"すべてのゴリラの、とくぎ消費MPが1減る"},
];
const STAGES=CAMPAIGN.stages;
const STAGE_COUNT=STAGES.length;
const BIRTH_TREE_TURNS=clamp(Math.round(CAMPAIGN.difficulty.birthTreeTurns),1,30);
const MAX_APES=clamp(Math.round(CAMPAIGN.difficulty.maxApes),1,30);
function stageDef(n=G?.stage||1){ return STAGES[clamp(Math.round(n)-1,0,STAGES.length-1)]; }

const POOP={
  normal:{jp:"ふつうのうんち",fert:3, size:1.0, splash:0, shake:0},
  pellet:{jp:"ころころうんち",fert:2, size:0.8, splash:0, shake:0},
  big   :{jp:"でかうんち",    fert:6, size:1.7, splash:6, shake:5},
  gold  :{jp:"きんのうんち",  fert:9, size:1.2, splash:1, shake:3, boost:5},
};
const PCOL={
  y:{d:"#6e6420",m:"#8a7d2c",l:"#b3a63f"}, r:{d:"#5e2c1f",m:"#7a3d2b",l:"#a3583c"},
  b:{d:"#264c55",m:"#33616b",l:"#4a8792"}, gold:{d:"#9a6c14",m:"#e8b23c",l:"#ffe08a"},
};

/* ══════════ スプライト（提供SVGの忠実変換） ══════════ */
const GW=24, GH=26;
const ape=rects=>sprite(GW,GH,rects.map(r=>[r[0],r[1]+2,r[2],r[3],r[4]]));
const ARMOR=[[2,20,5,2],[10,10,4,4],[13,11,3,3],[10,16,3,3],[1,20,2,1],[14,20,2,1],[21,19,2,1],[10,21,6,2],[1,21,5,2],[17,20,6,2]];
function gorilla(p){
  const r=[[2,7,5,5,p.P],[17,9,6,13,p.A],[2,9,6,13,p.A],[12,1,9,8,p.KH||p.K],[4,8,18,11,p.K],
           [1,11,5,12,p.G],[15,6,5,3,p.F],[14,3,6,3,p.F],[11,5,3,4,p.F]];
  if(p.BIGEYE) r.push([19,4,1,2,p.E],[17,5,1,1,p.E],[17,6,3,1,p.M],[16,4,2,2,p.E]);
  else         r.push([19,5,1,1,p.E],[17,6,3,1,p.M],[16,5,1,1,p.E]);
  r.push([10,10,6,13,p.G],[1,8,5,5,p.P]);
  if(p.ARM) for(const a of ARMOR) r.push([a[0],a[1],a[2],a[3],p.ARM]);
  if(p.GEM) r.push([15,2,2,1,p.GEM],[16,1,1,1,p.GEM]);
  if(p.ANT) r.push([16,1,1,3,"#000"],[16,-1,1,2,"#000"],[16,-2,1,1,"#f52f2f"]);
  return r;
}
const GPAL={
  normal  :{K:"#000000",A:"#343434",G:"#494949",F:"#d9d9d9",E:"#000000",M:"#000000",P:"#fae1e1"},
  guardian:{K:"#49a013",A:"#27752f",G:"#72b24d",F:"#d9d9d9",E:"#ff3434",M:"#49a013",P:"#fae1e1",ARM:"#d9d9d9"},
  wizard  :{K:"#3f47a8",A:"#2c3178",G:"#6f80e0",F:"#d9d9d9",E:"#68d0e0",M:"#3f47a8",P:"#fae1e1",GEM:"#68d0e0"},
  silver  :{KH:"#adadad",K:"#b4b4b4",A:"#343434",G:"#494949",F:"#d9d9d9",E:"#000000",M:"#000000",P:"#fae1e1"},
  jikon   :{K:"#000000",A:"#343434",G:"#494949",F:"#d9d9d9",E:"#000000",M:"#000000",P:"#fae1e1",ANT:true,BIGEYE:true},
};
const CHIMP=(()=>{const K="#000",A="#343434",G="#494949",F="#d9d9d9",P="#fae1e1";
  return [[2,11,4,4,P],[17,9,2,14,A],[12,1,7,7,K],[3,10,4,4,K],[6,8,4,4,K],[9,7,4,4,K],[12,5,4,4,K],[14,4,5,4,K],
          [9,12,3,11,K],[6,13,3,10,K],[13,5,6,3,F],[13,3,5,2,F],[10,4,2,3,F],
          [17,3,1,1,K],[15,3,1,1,K],[16,6,3,1,K],[11,9,3,14,G],[1,11,4,4,P]];})();
const MONKEY=(()=>{const B="#c8881a",D="#86590a",L="#e0a43c",F="#ffe7d2",P="#fae1e1",E="#000";
  return [[8,13,2,2,P],[16,17,2,6,D],[9,17,2,6,D],[13,10,5,5,B],[7,14,10,6,B],
          [1,20,2,2,B],[2,18,2,2,B],[3,17,2,2,B],[4,16,2,2,B],[5,15,2,2,B],[6,14,2,1,B],
          [15,13,4,3,F],[15,11,3,1,F],[12,12,1,1,F],[17,12,1,1,E],[16,13,2,1,E],[14,12,1,1,E],
          [13,17,3,6,L],[7,17,3,6,L],[7,14,2,2,P]];})();

const SKIN="#f4cc6e", TIE="#ff0000";
function human(suit,head,eye,extra){
  const r=[[6,4,6,4,suit],[5,4,1,7,suit],[11,4,1,7,suit],[7,8,4,1,suit],[7,8,2,8,suit],[10,8,2,8,suit],
           [7,0,4,4,SKIN],...head,[7,2,3,1,eye],[7,4,4,4,"#fff"],[8,4,2,1,TIE],[8,5,1,3,TIE]];
  return extra? r.concat(extra) : r;
}
const SPR={};
for(const k in GPAL) SPR["u_"+k]=ape(gorilla(GPAL[k]));
SPR.u_chimp=ape(CHIMP); SPR.u_monkey=ape(MONKEY);
SPR.u_killer =sprite(16,16, human("#343434",[[7,0,4,1,"#000"]],"#000"));
SPR.u_bald   =sprite(16,16, human("#343434",[[7,0,1,1,"#000"],[10,0,1,1,"#000"]],"#000",
                     [[4,7,1,6,"#7a5a33"],[2,6,3,2,"#b9c0c6"],[2,6,1,2,"#8b939a"]]));
SPR.u_fireman=sprite(16,16, human("#ff1616",[[7,0,4,1,"#ff1616"]],"#ff1616",
                     [[0,8,6,1,"#343434"],[2,8,3,3,"#343434"],[5,9,1,2,"#343434"],[0,8,1,1,"#f2802b"]]));
for(const [id,s] of Object.entries(window.POOPULATION_SPRITES?.sprites||{})){
  const c=document.createElement("canvas"),g=c.getContext("2d");c.width=s.width;c.height=s.height;g.imageSmoothingEnabled=false;
  for(let y=0;y<s.height;y++)for(let x=0;x<s.width;x++){
    const col=s.palette[parseInt(s.pixels[y][x],16)];
    if(!col.endsWith("00")){g.fillStyle=col;g.fillRect(x,y,1,1);}
  }
  SPR["u_"+id]=c;
}

/* ══════════ 音 ══════════ */
let AC=null, snd=true, musicTimer=null, musicStep=0;
let SFXV=1, BGMV=1;
const SAVE_KEY="poopulation-save-v2";
const PTE=(k,d)=>{ try{ window.dispatchEvent(new CustomEvent("pt:"+k,{detail:d||{}})); }catch(e){} };
const THEME_LEAD=[
  330,0,392,440,392,330, 294,0,330,392,330,294,
  262,0,330,392,440,392, 330,294,262,0,247,0,
  330,0,392,440,494,440, 392,0,330,294,330,392,
  440,0,392,330,294,262, 247,262,294,0,262,0,
  392,0,440,523,494,440, 392,330,294,0,330,0,
  349,0,440,494,440,392, 330,294,262,0,247,0,
  330,392,440,0,392,330, 294,330,392,0,440,0,
  494,440,392,330,294,262, 247,262,294,0,330,0,
];
const THEME_BASS=[110,98,87,82,110,98,87,73];
function toneAt(f,when,dur,type="square",vol=.025){
  if(BGMV<=0) return;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,when);
  g.gain.setValueAtTime(vol*BGMV,when);g.gain.exponentialRampToValueAtTime(.0001,when+dur);
  o.connect(g);g.connect(AC.destination);o.start(when);o.stop(when+dur);
}
function beep(f,dur,type="square",vol=.06,slide=0){
  if(!snd||SFXV<=0) return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.setValueAtTime(f,AC.currentTime);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),AC.currentTime+dur);
    g.gain.setValueAtTime(vol*SFXV,AC.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+dur);
    o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+dur);
  }catch(e){}
}
function musicTick(){
  if(!snd||!AC) return;
  const i=musicStep++%THEME_LEAD.length, when=AC.currentTime+.02, lead=THEME_LEAD[i];
  if(i%6===0) toneAt(THEME_BASS[(i/6)%THEME_BASS.length],when,.66,"triangle",.022);
  if(i%3===0) toneAt(165,when,.18,"sine",.008);
  if(lead) toneAt(lead,when,.18,"square",.014);
}
function startMusic(){
  snd=true;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)(); AC.resume?.();
    clearInterval(musicTimer); musicStep=0; musicTick();
    musicTimer=setInterval(musicTick,Math.round(60000/82/3));
  }catch(e){}
}
function stopMusic(){ clearInterval(musicTimer); musicTimer=null; }
const SFX={
  step:()=>beep(300,.04,"square",.03), hit:()=>beep(130,.09,"square",.07,-50),
  crit:()=>{beep(200,.07,"square",.08);setTimeout(()=>beep(320,.12,"square",.08),70);},
  eat :()=>beep(520,.07,"square",.05,120), strain:()=>beep(180,.5,"sawtooth",.035,140),
  plop:()=>beep(260,.16,"triangle",.08,-190), fire:()=>beep(170,.22,"sawtooth",.05,-70),
  grow:()=>beep(680,.1,"sine",.05,300), rain:()=>beep(900,.25,"sine",.05,-380),
  die :()=>beep(150,.45,"sawtooth",.09,-100),
  born:()=>{beep(500,.09,"square",.06);setTimeout(()=>beep(660,.09,"square",.06),90);setTimeout(()=>beep(880,.15,"square",.06),180);},
  wave:()=>{beep(220,.16,"square",.07);setTimeout(()=>beep(180,.28,"square",.07),170);},
  gold:()=>{[660,880,1100,1320].forEach((f,i)=>setTimeout(()=>beep(f,.12,"square",.06),i*70));},
};

/* ══════════ 状態 ══════════ */
const cv=document.getElementById("cv"), ctx=cv.getContext("2d");
ctx.imageSmoothingEnabled=false;
let G, vt=0;
let PAUSED=false, PIXEL_PERFECT=false;

const idx=(x,y)=>y*COLS+x;
const at=(x,y)=>(x<0||y<0||x>=COLS||y>=ROWS)?null:G.map[idx(x,y)];
const unitAt=(x,y)=>G.units.find(u=>u.alive&&u.tx===x&&u.ty===y);
const hasAbility=key=>!!G?.progress?.abilities.includes(key);
const skillCost=u=>Math.max(1,APE[u.type].sk.c-(hasAbility("focus")?1:0));
function enemyStageStats(st){
  const mul=stageDef().enemyMul;
  return {...st,hp:Math.round(st.hp*mul.hp),atk:Math.round(st.atk*mul.atk)};
}
const S=u=>{
  const st=u.side==="ape"?APE[u.type]:FOE[u.type];
  if(u.side!=="ape"||!u.buffs) return enemyStageStats(st);
  const b=G.progress?.bonus||{atk:0,spd:0};
  return {...st,atk:Math.min(FRUIT_STAT_MAX,st.atk+u.buffs.r+b.atk),spd:Math.min(FRUIT_STAT_MAX,st.spd+u.buffs.y+b.spd)};
};
const unitSprite=u=>SPR["u_"+u.type]||SPR["u_"+S(u).sprite]||SPR.u_normal;
let INTENT_ON=true;

/* スプライトを任意のcanvasへ等倍で焼く。拡大はCSS側（image-rendering:pixelated）に任せる */
function paintSprite(cv,spr){
  if(!cv||!spr) return;
  cv.width=spr.width; cv.height=spr.height;
  const g=cv.getContext("2d"); g.imageSmoothingEnabled=false;
  g.clearRect(0,0,cv.width,cv.height);
  g.drawImage(spr,0,0);
}
function spriteEl(spr,cssHeight){
  const c=document.createElement("canvas");
  paintSprite(c,spr);
  c.style.height=cssHeight+"px"; c.style.width="auto"; c.style.display="block";
  return c;
}
/* うんちアイコン。盤面の drawPoop と同じ形をUI用に起こしたもの */
function poopIcon(cv,kind,c){
  if(!cv) return;
  const K=POOP[kind]||POOP.normal, C=PCOL[kind==="gold"?"gold":(c||"y")];
  const sz=K.size, W=20, H=16;
  cv.width=W; cv.height=H;
  const g=cv.getContext("2d"); g.imageSmoothingEnabled=false;
  g.clearRect(0,0,W,H);
  const ox=W/2, oy=H-2;
  const R=(w,h,col,dx,dy)=>{ g.fillStyle=col; g.fillRect(Math.round(ox+dx*sz),Math.round(oy+dy*sz),Math.max(1,Math.round(w*sz)),Math.max(1,Math.round(h*sz))); };
  if(kind==="pellet"){ R(2,2,C.m,-3,-2);R(2,2,C.d,0,-3);R(2,2,C.m,1,-1);R(1,1,C.l,-3,-2); }
  else if(kind==="big"){ R(8,2,C.d,-4,-1);R(6,2,C.m,-3,-3);R(4,2,C.m,-2,-5);R(2,1,C.l,-1,-6);R(3,1,C.l,-3,-3); }
  else if(kind==="gold"){ R(6,2,C.d,-3,-1);R(4,2,C.m,-2,-3);R(2,1,C.l,-1,-4);R(1,1,"#fff9d6",-4,-5);R(1,1,"#fff9d6",3,-3); }
  else { R(6,2,C.d,-3,-1);R(4,2,C.m,-2,-3);R(2,1,C.l,-1,-4); }
}
/* 腹の中 → 次に出るうんち。「あと1色できんのうんち」までここで出す */
function bellyPlan(u){
  const kind=poopKind(u);
  const c=u.belly.length?u.belly[0]:(at(u.tx,u.ty)?.c||"y");
  const K=POOP[kind];
  const have=new Set(u.belly), missing=COLORS.filter(x=>!have.has(x));
  let hint="";
  if(kind==="gold") hint=L("3色そろった → きんのうんち","three colours ready → GOLDEN");
  else if(missing.length===1&&u.belly.length>=BELLY_MAX-1)
    hint=L(`${BIOME[missing[0]].jp}であと1つ → きん`,`one more ${missing[0].toUpperCase()} → GOLDEN`);
  else if(!u.belly.length) hint=L("実を食べると出せる","eat fruit to poop");
  const name=kind==="gold"?L("きんのうんち","Golden poop"):L(`${BIOME[c].jp}のうんち`,`${c.toUpperCase()} poop`);
  const desc=kind==="gold"
    ? L(`肥料+${K.fert}・全能力+${K.boost||0}`,`fertiliser +${K.fert} · all stats +${K.boost||0}`)
    : L(`足元1マスに 肥料+${K.fert}　${BIOME[c].jp}が育つ`,`fertiliser +${K.fert} underfoot · grows ${BIOME[c].jp}`);
  return {kind,c,name,desc,hint,fert:K.fert};
}
function forestStats(){
  let mature=0,young=0,burning=0;
  for(const t of G.map){
    if(t.fire>0){ burning++; continue; }
    if(t.v===3) mature++; else if(t.v>=1) young++;
  }
  return {mature,young,burning,value:Math.round(forestValue())};
}
function fruitStat(u,c){ return c==="r"?S(u).atk:c==="y"?S(u).spd:u.maxmp; }

function newMap(settings=stageDef().terrain){
  const terrain=settings||{seed:1,hills:MASTER.terrain.hillCount,hillRadius:MASTER.terrain.hillRadiusMax,river:"narrow",groveTrees:MASTER.terrain.groveTrees};
  const seed=Math.round(terrain.seed||1), hills=clamp(Math.round(terrain.hills),0,8), radius=clamp(Math.round(terrain.hillRadius),1,3);
  const m=[];
  for(let i=0;i<COLS*ROWS;i++) m.push({h:0,water:false,c:null,v:0,grow:0,fruit:0,fert:0,fire:0,ash:0,treeAge:0});
  // 固定シード相当の座標ハッシュで、毎回同じ地形を作る
  for(let k=0;k<hills;k++){
    const cx=2+Math.floor(hash(k+31+seed,7+seed)*(COLS-4));
    const cy=2+Math.floor(hash(k+71+seed,13+seed)*(ROWS-4));
    const rad=1+Math.floor(hash(k+101+seed,19+seed)*radius);
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const d=Math.max(Math.abs(x-cx),Math.abs(y-cy));
      if(d<=rad) m[idx(x,y)].h=Math.max(m[idx(x,y)].h, d===rad?1:2);
      else if(d===rad+1 && hash(x+k*17+seed,y+k*23+seed)<.5) m[idx(x,y)].h=Math.max(m[idx(x,y)].h,1);
    }
  }
  // 川（湿地）＝ 天然の防火帯
  let rx=1+Math.floor(hash(47+seed,89+seed)*(COLS-2));
  for(let y=0;terrain.river!=="none"&&y<ROWS;y++){
    const width=terrain.river==="wide"?2:1;
    for(let w=0;w<width;w++){
      const t=rx+w<COLS?m[idx(rx+w,y)]:null; if(t){ t.water=true; t.h=0; t.c="b"; t.v=1; t.grow=GROW_GRASS; }
    }
    rx=clamp(rx+Math.floor(hash(y+seed,197+seed)*3)-1,1,COLS-1-width);
  }
  return m;
}
function plantGroves(settings=stageDef().terrain){
  const groveTrees=clamp(Math.round(settings?.groveTrees??MASTER.terrain.groveTrees),1,6);
  const seed=Math.round(settings?.seed||1);
  const used=[];
  for(const [ci,c] of COLORS.entries()){
    const candidates=[];
    for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++) if(!at(x,y).water) candidates.push([x,y]);
    candidates.sort((a,b)=>hash(a[0]+ci*41+seed,a[1]+ci*67+seed)-hash(b[0]+ci*41+seed,b[1]+ci*67+seed));
    const [x,y]=candidates.find(([x,y])=>used.every(s=>Math.abs(s.x-x)+Math.abs(s.y-y)>4))||candidates[0];
    used.push({x,y});
    const cells=[[0,0],[1,0],[0,1],[-1,0],[0,-1],[1,1]];
    cells.forEach(([dx,dy],i)=>{
      const t=at(x+dx,y+dy); if(!t||t.water) return;
      t.c=c;
      if(i<groveTrees){ t.v=3; t.grow=GROW_TREE; t.fruit=BIOME[c].cap; }
      else { t.v=1; t.grow=GROW_GRASS; }
    });
  }
}

let nextId=1;
function makeUnit(side,type,tx,ty){
  const stats=side==="ape"?APE[type]:FOE[type];
  const st=side==="ape"?stats:enemyStageStats(stats);
  const bonus=G.progress?.bonus||{hp:0,mp:0};
  const maxhp=st.hp+(side==="ape"?bonus.hp:0), maxmp=(st.mp||0)+(side==="ape"?bonus.mp:0);
  const used=new Set(G.units.map(u=>u.name));
  const serial=nextId++;
  const base=NAMES[(serial-1)%NAMES.length];
  const nm=side==="ape"?(used.has(base)?base+(1+Math.floor((serial-1)/NAMES.length)):base):st.jp;
  const tr=side==="ape"?[TKEY[(serial*2-2)%TKEY.length],TKEY[(serial*2-1)%TKEY.length]]:[];
  const u={
    id:serial, side, type, name:nm, tx, ty, hp:maxhp, maxhp,
    mp:side==="ape"?Math.round(maxmp*.4):0, maxmp,
    ct:(serial*13)%45, dir:side==="ape"?1:-1, traits:tr,
    belly:[], buffs:{y:0,r:0,b:0}, alive:true, squat:0, squatMax:1, relief:0, anim:0, rage:0, extraMove:false,
    px:tx*TS+TS/2, py:0,
  };
  u.py=unitY(u);
  G.units.push(u);
  return u;
}
function unitY(u){ const t=at(u.tx,u.ty); return u.ty*TS+YOFF-(t?t.h:0)*HSTEP+TS; }
function unitX(u){ return u.tx*TS+TS/2; }

const STAGE_SNAPSHOT_KEYS=["map","units","stage","round","acts","waveIx","born","stageBorn","dead","kills","obits","log","seenPoop","pooCount","goldCount","bornByColor","finalRound","progress"];
function captureStageStart(){
  const snap={};
  for(const key of STAGE_SNAPSHOT_KEYS) snap[key]=structuredClone(G[key]);
  G.stageStart=snap;
}
function restartStage(){
  if(!G.stageStart) return;
  const snap=structuredClone(G.stageStart);
  for(const key of STAGE_SNAPSHOT_KEYS) G[key]=snap[key];
  Object.assign(G,{active:null,phase:"idle",mode:null,moveSet:null,rangeSet:null,targetSet:null,kbPos:null,over:null,anim:null,queue:[],fx:[],poops:[],floats:[],shake:4,sel:null,intermission:false,rewardOptions:[]});
  nextId=Math.max(0,...G.units.map(u=>u.id))+1;
  $("scTitle").hidden=true; $("scEnd").hidden=true; $("scCamp").hidden=true;
  syncOrder(); syncActs(); fit();
  logMsg("#e8b23c",L(`ステージ ${G.stage} を最初から再開した`,`Restarted stage ${G.stage}`));
  setTimeout(nextTurn,180);
}

function newGame(run=true){
  const roster=(CAMPAIGN.startRoster||MASTER.startRoster).filter(type=>APE[type]).slice(0,8);
  const starters=roster.length?roster:["normal"];
  G={ map:[], units:[], stage:1, round:1, acts:0, active:null, phase:"idle", mode:null,
      moveSet:null, rangeSet:null, targetSet:null, over:null, anim:null, queue:[], fx:[], poops:[], floats:[],
      shake:0, sel:null, waveIx:0, born:0, dead:0, kills:0, obits:[], log:[], startPos:null,
      seenPoop:false, pooCount:0, goldCount:0,
      bornByColor:{y:0,r:0,b:0}, stageBorn:0, intermission:false, finalRound:false, rewardOptions:[],
      progress:{unlocked:[...new Set(starters)],abilities:[],bonus:{...CAMPAIGN.difficulty.allyBonus},picks:[]} };
  nextId=1;
  G.map=newMap(stageDef(1).terrain);
  plantGroves(stageDef(1).terrain);
  // 最初の3匹
  const spots=[];
  for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){ const t=at(x,y); if(t&&!t.water) spots.push([x,y]); }
  for(const type of starters){
    const available=spots.filter(([x,y])=>!unitAt(x,y));
    available.sort((a,b)=>(Math.abs(a[0]-COLS/2)+Math.abs(a[1]-ROWS/2))-(Math.abs(b[0]-COLS/2)+Math.abs(b[1]-ROWS/2)) || idx(a[0],a[1])-idx(b[0],b[1]));
    const s=available[0];
    makeUnit("ape",type,s[0],s[1]);
  }
  spawnDueWaves();
  syncOrder(); logMsg("#e8b23c",stageDef(1).intro?.[LANG]||"森を育てて、人族の襲撃をしのげ"); captureStageStart();
  if(run) nextTurn();
}

/* ══════════ 経路・射程 ══════════ */
function passable(t,u){ return t && !(t.fire>0 && u.side==="ape" && !S(u).tags?.includes("fireproof")); }
function moveCost(t){ return t.water?2:1; }
function reachable(u){
  const st=S(u), maxc=st.move, set=new Map();
  const start=idx(u.tx,u.ty);
  set.set(start,{c:0,from:null});
  const q=[[u.tx,u.ty,0]];
  while(q.length){
    const [x,y,c]=q.shift();
    const here=at(x,y);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy, t=at(nx,ny);
      if(!t) continue;
      if(Math.abs(t.h-here.h)>st.jump) continue;
      if(t.fire>0 && !(u.side==="ape"&&S(u).tags?.includes("fireproof"))) continue;
      const occ=unitAt(nx,ny);
      if(occ && occ!==u) continue;
      const nc=c+moveCost(t);
      if(nc>maxc) continue;
      const k=idx(nx,ny);
      if(!set.has(k) || set.get(k).c>nc){ set.set(k,{c:nc,from:idx(x,y)}); q.push([nx,ny,nc]); }
    }
  }
  set.delete(start);
  return set;
}
function pathTo(u,set,tx,ty){
  const out=[]; let k=idx(tx,ty);
  while(k!=null && k!==idx(u.tx,u.ty)){ out.unshift([k%COLS,(k/COLS)|0]); k=set.get(k)?.from; if(k==null) break; }
  return out;
}
function inRange(ax,ay,bx,by,r){ return Math.abs(ax-bx)+Math.abs(ay-by)<=r; }
function tilesInRange(x,y,r){
  const out=[];
  for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    if(Math.abs(dx)+Math.abs(dy)>r || (!dx&&!dy)) continue;
    const t=at(x+dx,y+dy); if(t) out.push([x+dx,y+dy]);
  }
  return out;
}
function attackRangeText(r){
  return r===1 ? "前後左右 4マス" : `ひし形 ${2*r*(r+1)}マス（距離${r}）`;
}

/* ══════════ 戦闘 ══════════ */
function damage(a,d){
  const sa=S(a), sd=S(d);
  const ha=at(a.tx,a.ty).h, hd=at(d.tx,d.ty).h;
  let m=1;
  if(!(a.side==="ape"&&a.type==="chimp"&&a.usingSkill))
    m *= clamp(1+0.25*(ha-hd), 0.5, 1.5);                 // 高さの有利／不利
  const back = (d.dir>0 && a.tx>d.tx) || (d.dir<0 && a.tx<d.tx);
  const side = a.ty!==d.ty && a.tx===d.tx;
  const fm = back?1.5 : side?1.2 : 1.0;                   // 背面／側面
  m *= fm;
  if(a.traits?.includes("timid")) m*=0.75;
  if(a.rage>0) m*=1.5;
  const dmg = Math.round(sa.atk * m * (sd.def??1));
  return {dmg, back, high:ha>hd, low:ha<hd};
}
function hitUnit(a,d,mult=1,label){
  const r=damage(a,d);
  const dmg=Math.max(1,Math.round(r.dmg*mult));
  d.hp-=dmg;
  const col = r.back?"#e8b23c" : r.high?"#fff2c9" : "#ffffff";
  float(unitX(d), unitY(d)-30, (label?label+" ":"")+dmg, col, 1.3);
  if(r.back) float(unitX(d), unitY(d)-42, "背面！", "#e8b23c", 1.4);
  else if(r.high) float(unitX(d), unitY(d)-42, "高所！", "#9fd8e0", 1.2);
  puff(unitX(d),unitY(d)-12,"#ffd34d",5);
  G.shake=Math.max(G.shake,r.back?4:2);
  r.back?SFX.crit():SFX.hit();
  PTE("hit",{side:d.side,dmg,back:r.back});
  if(d.hp<=0) killUnit(d,a);
  return dmg;
}
function killUnit(d,killer){
  d.alive=false; d.hp=0; PTE("kill",{side:d.side,name:d.name});
  puff(unitX(d),unitY(d)-12,"#c9452e",14);
  SFX.die();
  if(d.side==="ape"){
    G.dead++;
    G.obits.push({name:d.name,type:d.type,traits:d.traits.slice(),
      cause:killer?`${killer.side==="ape"?"":""}${S(killer).jp}にやられた`:"力尽きた"});
    logMsg("#c9452e",`${d.name} が死んだ`);
    for(const u of G.units) if(u.alive&&u.side==="ape"&&u.traits.includes("filial")) u.rage=3;
    // ゴリラジコンに殺されると、寄生されて敵になる
    if(killer && FOE[killer.type]?.ai==="jikon" && G.units.filter(u=>u.alive&&FOE[u.type]?.ai==="jikon").length<6){
      const nu=makeUnit("human","jikon",d.tx,d.ty);
      nu.name=d.name+"（ジコン）";
      nu.ct=0;
      G.shake=8; beep(70,.55,"sawtooth",.09,190);
      float(unitX(nu),unitY(nu)-34,"ゴリラジコン化","#f52f2f",2.4);
      logMsg("#f52f2f",`${d.name} が ゴリラジコン にされた`);
    }
  } else {
    G.kills++;
    logMsg("#7fae2f",`${S(d).jp} を倒した`);
  }
  syncOrder();
}

/* ══════════ うんち ══════════ */
function poopKind(u){
  if(new Set(u.belly).size>=3) return "gold";
  return "normal";
}
function dropPoop(u,kind,c,tx=u.tx,ty=u.ty){
  const K=POOP[kind];
  const thrown=tx!==u.tx||ty!==u.ty;
  G.poops.push({x:thrown?tx*TS+12:unitX(u)-u.dir*10,y:thrown?tileTop(tx,ty)+TS-6:unitY(u)-6,
    fromX:unitX(u)-u.dir*10,fromY:unitY(u)-6,thrown,dir:u.dir,tx,ty,c,kind,t:0,land:thrown?.62:.34,life:5});
  G.shake=Math.max(G.shake,1.5*CFG.impactShake);
  puff(unitX(u)-u.dir*8,unitY(u)-8,PCOL[kind==="gold"?"gold":c].l,8);
  SFX.plop();
  float(unitX(u), unitY(u)-34, K.jp, PCOL[kind==="gold"?"gold":c].l, 1.8);
  G.pooCount++;
  if(kind==="gold"){ G.goldCount++; SFX.gold(); PTE("gold"); logMsg(PCOL.gold.m,"きんのうんち！ 土が一気に育つ"); }
  if(!G.seenPoop){ G.seenPoop=true; logMsg(PCOL[c].m,"うんちの色が、生える森の色になる"); }
  // 土に効かせる
  soak(tx,ty,c,K.fert,K);
  if(K.splash>0) for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) soak(tx+dx,ty+dy,c,K.splash,K);
}
function soak(x,y,c,amt,K){
  const t=at(x,y); if(!t||t.fire>0) return;
  if(t.v===0||t.c===c) t.c=c;
  else if(t.v===1){ t.c=c; t.grow=GROW_GRASS; }
  else if(t.v>=2) return;
  t.fert=Math.min(12,t.fert+amt);
  if(t.ash>0) t.ash=0;
  if(K&&K.boost){ t.grow+=K.boost; for(let i=0;i<8;i++) G.fx.push({x:x*TS+12+rnd(8,-8),y:tileTop(x,y)+12,vx:rnd(20,-20),vy:rnd(-24,-52),col:PCOL.gold.l,life:rnd(1,.5)}); }
}

/* ══════════ 行動 ══════════ */
function tileTop(x,y){ const t=at(x,y); return y*TS+YOFF-(t?t.h:0)*HSTEP; }

function beginAct(u){
  // ターン開始：マナ、状態、火
  const t=at(u.tx,u.ty);
  if(u.side==="ape"){
    let gain=0;
    if(t.fert>0) gain=3;                                  // 肥えた土 ＝ うんちの上
    else if(t.v>=2) gain=2;
    else if(t.v>=1) gain=1;
    if(hasAbility("flow")) gain++;
    if(gain){ u.mp=Math.min(u.maxmp,u.mp+gain); float(unitX(u),unitY(u)-34,"MP+"+gain,"#68d0e0",1.1); }
    if(u.rage>0) u.rage--;
    if(u.traits.includes("mimic")){
      const nb=G.units.find(o=>o.alive&&o!==u&&o.side==="ape"&&Math.abs(o.tx-u.tx)+Math.abs(o.ty-u.ty)<=1);
      if(nb){ const cand=nb.traits.find(k=>!u.traits.includes(k)); if(cand){ u.traits[1]=cand; } }
    }
  }
  if(t.fire>0 && !(u.side==="ape"&&S(u).tags?.includes("fireproof"))){
    const dmg=Math.round(22*(S(u).def??1));
    u.hp-=dmg; float(unitX(u),unitY(u)-30,dmg+"","#f2802b",1.2);
    if(u.hp<=0){ killUnit(u,null); return false; }
  }
  return true;
}

function doMove(u,path,after){
  if(!path.length){ after&&after(); return; }
  G.anim={kind:"walk",u,path,i:0,t:0,dur:.13,after};
}
function finishMove(u){
  u.tx=u.pathEndX ?? u.tx; u.ty=u.pathEndY ?? u.ty;
}

function actionAttack(u,tx,ty){
  const d=unitAt(tx,ty); if(!d) return;
  u.dir = tx>u.tx?1:tx<u.tx?-1:u.dir;
  G.anim={kind:"strike",u,d,t:0,dur:.42,after:()=>{
    hitUnit(u,d);
    endAct(u);
  }};
}
function actionEat(u){
  const t=at(u.tx,u.ty);
  if(!(t&&t.v===3&&t.fruit>=1)) return;
  const slots=BELLY_MAX-u.belly.length;
  if(slots<=0){ hint(L("おなかが満杯。うんちをして空きを作ろう","Belly full. Poop to free a slot")); return; }
  const glut=u.traits.includes("glut");
  let eaten=1, boost=0;
  t.fruit-=1;
  if(glut&&slots>=2&&t.fruit>=1){ t.fruit-=1; eaten++; }
  u.belly=[...u.belly,...Array(eaten).fill(t.c)];
  u.buffs={...u.buffs};
  for(let i=0;i<eaten;i++){
    const add=Math.min(FRUIT_BUFF[t.c].gain,Math.max(0,FRUIT_STAT_MAX-fruitStat(u,t.c)));
    u.buffs[t.c]+=add; boost+=add;
    if(t.c==="b") u.maxmp+=add;
  }
  u.hp=Math.min(u.maxhp,u.hp+(hasAbility("digestion")?24:12));
  u.mp=Math.min(u.maxmp,u.mp+(hasAbility("digestion")?4:2));
  SFX.eat(); puff(unitX(u),unitY(u)-20,BIOME[t.c].berry,6);
  const F=FRUIT_BUFF[t.c];
  float(unitX(u),unitY(u)-34,`${F.jp} ${boost?"+"+boost:"上限"}`,BIOME[t.c].berry,1.6);
  logMsg(BIOME[t.c].berry,`${u.name}が${BIOME[t.c].jp}の実を食べた — ${F.jp} ${boost?"+"+boost:"は上限"}`);
  endAct(u);
}
function poopNeed(){ return 1; }
function actionPoop(u,forced,tx=u.tx,ty=u.ty){
  const consti=u.traits.includes("consti");
  const kind = forced || poopKind(u);
  const c = u.belly.length?u.belly[0]:(at(u.tx,u.ty).c||"y");
  const dur=consti||kind==="big"?CFG.tacticsBigStrain:CFG.tacticsStrain;
  u.squatMax=dur;
  G.anim={kind:"squat",u,t:0,dur,fired:false,pk:kind,pc:c,tx,ty,after:()=>{
    if(kind==="gold"){
      for(const color of COLORS){
        const i=u.belly.indexOf(color);
        if(i>=0) u.belly.splice(i,1);
      }
    } else if(u.belly.length) u.belly.shift();
    endAct(u);
  }};
  SFX.strain();
}
function actionSkill(u,tx,ty){
  const sk=APE[u.type].sk;
  const cost=skillCost(u);
  const T=APE[u.type].behavior||u.type;
  if(u.mp<cost) return false;
  if(T==="rocket"&&u.belly.length<poopNeed(u)){
    hint(`${sk.n}には実が ${poopNeed(u)} 個ひつよう`);
    return false;
  }
  u.mp-=cost;
  if(T==="rocket"){
    u.dir=tx>u.tx?1:tx<u.tx?-1:u.dir;
    actionPoop(u,"big",tx,ty);
    return;
  }
  if(T==="dash"){
    float(unitX(u),unitY(u)-34,"かけぬけ！","#e8b23c",1.4);
    u.extraMove=true; beep(880,.1,"square",.05,220);
    startMovePhase(u); return;
  }
  if(T==="stamp"){
    let n=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const t=at(u.tx+dx,u.ty+dy);
      if(t&&t.fire>0){ t.fire=0; t.v=Math.max(1,t.v-1); n++; puff((u.tx+dx)*TS+12,tileTop(u.tx+dx,u.ty+dy)+12,"#9fb0bd",6); }
    }
    float(unitX(u),unitY(u)-34,n?`火を ${n} 消した`:"ふみけし","#9fd8e0",1.6);
    SFX.grow(); endAct(u); return;
  }
  if(T==="stomp"){
    G.anim={kind:"stomp",u,t:0,dur:.5,after:()=>{
      G.shake=9;
      for(const d of G.units.filter(o=>o.alive&&o.side!=="ape"&&Math.abs(o.tx-u.tx)+Math.abs(o.ty-u.ty)<=1)){
        hitUnit(u,d,1.25,"");
        if(d.alive){ // ノックバック
          const dx=Math.sign(d.tx-u.tx), dy=Math.sign(d.ty-u.ty);
          const nt=at(d.tx+dx,d.ty+dy);
          if(nt && !unitAt(d.tx+dx,d.ty+dy) && Math.abs(nt.h-at(d.tx,d.ty).h)<=2){ d.tx+=dx; d.ty+=dy; d.px=unitX(d); d.py=unitY(d); }
        }
      }
      endAct(u);
    }};
    return;
  }
  if(T==="rain"){
    G.anim={kind:"rain",u,tx,ty,t:0,dur:1.4,after:()=>{
      let grown=0, fruited=0, quenched=0, full=0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const t=at(tx+dx,ty+dy); if(!t) continue;
        const px=(tx+dx)*TS+12, py=tileTop(tx+dx,ty+dy)+8;
        puff(px,py,"#68d0e0",3);
        if(t.fire>0){ t.fire=0; quenched++; puff(px,py,"#d8f5f7",6); }
        if(t.ash>0) t.ash=0;
        if(!t.c) continue;
        t.fert=Math.max(t.fert,1);
        if(t.v<3){
          t.v++;
          t.grow=Math.max(t.grow,[0,GROW_GRASS,GROW_SAP,GROW_TREE][t.v]);
          grown++; puff((tx+dx)*TS+12,tileTop(tx+dx,ty+dy)+8,BIOME[t.c].berry,7);
        }else if(t.fruit<BIOME[t.c].cap){ t.fruit++; fruited++; puff((tx+dx)*TS+12,tileTop(tx+dx,ty+dy)+4,BIOME[t.c].berry,5); }
        else full++;
      }
      float(tx*TS+12,tileTop(tx,ty)-8,`成長${grown} 実+${fruited} 消火${quenched}`,"#9fd8e0",2);
      logMsg("#68d0e0",`${u.name}の雨 — 草木${grown}マス成長、成木${fruited}本に実、${quenched}マス消火${full?`、満杯${full}`:""}`);
      SFX.rain(); endAct(u);
    }};
    return;
  }
  if(T==="stone"){
    const d=unitAt(tx,ty);
    u.dir=tx>u.tx?1:-1;
    u.usingSkill=true;
    G.anim={kind:"throw",u,tx,ty,t:0,dur:.5,after:()=>{
      if(d&&d.alive) hitUnit(u,d,1.4,"");
      u.usingSkill=false; endAct(u);
    }};
    return;
  }
  endAct(u);
}

function endAct(u){
  G.mode=null; G.moveSet=null; G.rangeSet=null; G.targetSet=null;
  u.acted=true;
  G.phase="idle";
  setTimeout(()=>{ if(!G.over&&!G.intermission) nextTurn(); }, 120);
}

/* ══════════ ターン ══════════ */
function tickCT(){
  // 誰かが 100 に達するまで時計を進める
  let guard=0;
  while(guard++<4000){
    const ready=G.units.filter(u=>u.alive&&u.ct>=100);
    if(ready.length) return ready.sort((a,b)=>b.ct-a.ct)[0];
    for(const u of G.units) if(u.alive) u.ct += S(u).spd/4;
    G.clockTicks=(G.clockTicks||0)+1;
    if(G.clockTicks%stageDef().worldTicks===0) advanceWorld();
    if(G.over||G.intermission) return null;
  }
  return null;
}
function nextTurn(){
  if(G.over||G.intermission) return;
  if(!G.units.some(u=>u.alive&&u.side==="ape")) return finish(false,"ゴリラ全滅","神は、群れを絶やした。");
  if(clearStageIfReady()) return;
  const u=tickCT();
  if(!u||G.over) return;
  u.ct-=100;
  G.active=u; G.sel=u.id;
  if(!beginAct(u)){ G.active=null; setTimeout(nextTurn,150); return; }
  syncOrder(); showCard(u,true); PTE("turn",{side:u.side,name:u.name,type:u.type});
  if(u.side==="ape"){ startMovePhase(u); }
  else { G.phase="foe"; setTimeout(()=>foeTurn(u),380); }
}
function startMovePhase(u){
  G.phase="move"; G.mode=null; G.rangeSet=null; G.targetSet=null;
  G.moveSet=reachable(u);
  G.kbPos=[u.tx,u.ty];
  G.startPos={x:u.tx,y:u.ty};
  showTileHint(u.tx,u.ty);
  syncActs(); hint(L("ドラッグ、または矢印キーで選んでスペースキーで移動","Drag, or pick a tile with the arrows and press Space"));
}

function stageName(n){ const s=stageDef(n); return s?.name?.[LANG]||s?.name?.ja||L(`第${n}森域`,`Forest Sector ${n}`); }
function chapterName(n){ const c=stageDef(n)?.chapterName; return c?(c[LANG]||c.ja||""):""; }
function freeApeSpot(){
  const spots=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const t=at(x,y); if(t&&!t.water&&t.fire<=0&&!unitAt(x,y)) spots.push([x,y]);
  }
  spots.sort((a,b)=>(Math.abs(a[0]-COLS/2)+Math.abs(a[1]-ROWS/2))-(Math.abs(b[0]-COLS/2)+Math.abs(b[1]-ROWS/2))||idx(a[0],a[1])-idx(b[0],b[1]));
  return spots[0];
}
function addRunBonus(key,amount){
  G.progress.bonus[key]+=amount;
  if(key==="hp") for(const u of G.units.filter(u=>u.alive&&u.side==="ape")){ u.maxhp+=amount; u.hp+=amount; }
  if(key==="mp") for(const u of G.units.filter(u=>u.alive&&u.side==="ape")){ u.maxmp+=amount; u.mp=Math.min(u.maxmp,u.mp+amount); }
}
function stageRewards(){
  const locked=UNLOCK_ORDER.find(type=>!G.progress.unlocked.includes(type));
  const ability=ABILITY_ORDER.find(a=>!G.progress.abilities.includes(a.key));
  const upgrades=[
    {key:"atk",amount:4,title:"群れの腕力",desc:"全員と、これから生まれる仲間の攻撃+4",unit:"ATK"},
    {key:"hp",amount:18,title:"群れの生命",desc:"全員と、これから生まれる仲間の最大HP+18。現在HPも+18",unit:"MAX HP"},
    {key:"mp",amount:3,title:"群れの魔力",desc:"全員と、これから生まれる仲間の最大MP+3",unit:"MAX MP"},
    {key:"spd",amount:3,title:"群れの俊敏",desc:"全員と、これから生まれる仲間の素早さ+3",unit:"SPD"},
  ];
  const up=upgrades[(G.stage-1)%upgrades.length];
  const gorilla = locked
    ? {kind:"NEW GORILLA",type:"gorilla",ape:locked,title:`${APE[locked].jp} 解放`,name:APE[locked].jp,
       sub:"解放＋この場で1匹加入",desc:`とくぎ ${APE[locked].sk.n}（MP${APE[locked].sk.c}）　${APE[locked].sk.d}`,
       apply:()=>{
         G.progress.unlocked.push(locked);
         const s=G.units.filter(u=>u.alive&&u.side==="ape").length<MAX_APES&&freeApeSpot();
         if(s) makeUnit("ape",locked,s[0],s[1]);
       }}
    : {kind:"NEW GORILLA",type:"upgrade",amount:12,unit:"MAX HP",title:"群れの生命",name:"群れの生命",
       sub:"現在の全員＋今後生まれる仲間",desc:"全員と未来の仲間の最大HP+12",apply:()=>addRunBonus("hp",12)};
  const herd = ability
    ? {kind:"HERD ABILITY",type:"ability",key:ability.key,title:`${ability.jp} 解放`,name:ability.jp,
       sub:"群れ全体・永続",desc:ability.d,apply:()=>G.progress.abilities.push(ability.key)}
    : {kind:"HERD ABILITY",type:"upgrade",amount:2,unit:"MAX MP",title:"奥義鍛錬",name:"奥義鍛錬",
       sub:"現在の全員＋今後生まれる仲間",desc:"全員と未来の仲間の最大MP+2",apply:()=>addRunBonus("mp",2)};
  return [gorilla,herd,
    {kind:"PERMANENT BUFF",type:"upgrade",amount:up.amount,unit:up.unit,title:up.title,name:up.title,
     sub:"現在の全員＋今後生まれる仲間",desc:up.desc,apply:()=>addRunBonus(up.key,up.amount)}];
}
function renderInventory(){
  const p=G.progress, chips=[];
  for(const type of Object.keys(APE)) chips.push(`<span class="inv-chip${p.unlocked.includes(type)?" on":""}">${localize(APE[type].jp)}</span>`);
  for(const a of ABILITY_ORDER.filter(a=>p.abilities.includes(a.key))) chips.push(`<span class="inv-chip on">${localize(a.jp)}</span>`);
  const b=p.bonus;
  if(b.atk||b.hp||b.mp||b.spd) chips.push(`<span class="inv-chip on">${L("攻","ATK")}+${b.atk} HP+${b.hp} MP+${b.mp} ${L("速","SPD")}+${b.spd}</span>`);
  $("inventory").innerHTML=chips.join("");
}
function openCamp(){
  G.intermission=true; G.active=null; G.phase="camp"; G.mode=null; G.moveSet=null; G.rangeSet=null; G.targetSet=null;
  G.intent=new Map();
  G.rewardOptions=stageRewards();
  const s=stageDef(), fs=forestStats();
  const alive=G.units.filter(u=>u.alive&&u.side==="ape");
  $("campStageId").textContent=s.id||String(G.stage);
  $("campTitle").textContent=L(`${stageName(G.stage)}　を守りきった`,`${stageName(G.stage)} held`);

  $("campSummary").innerHTML=
    `<div><span>ROUNDS</span><b>${Math.min(G.round,s.rounds)}</b></div>`+
    `<div><span>BIRTHS</span><b style="color:#7fae2f">${G.stageBorn||0}</b></div>`+
    `<div><span>FOREST</span><b>${fs.value}</b></div>`+
    `<div><span>FALLEN</span><b style="color:#c9452e">${G.dead}</b></div>`;

  const box=$("rewardBox");
  box.innerHTML="";
  const letters=["A","B","C"];
  G.rewardFocus=0;
  G.rewardOptions.forEach((r,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="reward"+(i===0?" lead":"");
    const head=document.createElement("div");
    head.className="rhd";
    head.innerHTML=`<span>${r.kind}</span><span>${letters[i]}</span>`;
    const body=document.createElement("div");
    body.className="rbody";
    const art=document.createElement("div");
    art.className="rart";
    if(r.type==="gorilla"&&SPR["u_"+r.ape]) art.appendChild(spriteEl(SPR["u_"+r.ape],118));
    else if(r.type==="upgrade") art.innerHTML=`<b>+${r.amount}</b><span>${r.unit}</span>`;
    else art.innerHTML=`<b style="color:#68d0e0">★</b><span>ABILITY</span>`;
    const meta=document.createElement("div");
    meta.innerHTML=`<div class="rname">${localize(r.name)}</div><div class="rsub">${localize(r.sub)}</div>`;
    body.append(art,meta);
    b.append(head,body);

    if(r.type==="gorilla"){
      const st=APE[r.ape], grid=document.createElement("div");
      grid.className="rstats";
      grid.innerHTML=`<div><span>HP</span><b>${st.hp}</b></div><div><span>ATK</span><b>${st.atk}</b></div>`+
                     `<div><span>MOVE</span><b>${st.move}</b></div><div><span>DEF</span><b>×${st.def}</b></div>`;
      b.appendChild(grid);
    } else if(r.type==="ability"){
      const chain=document.createElement("div");
      chain.className="rchain";
      chain.innerHTML=ABILITY_ORDER.map(a=>{
        const done=G.progress.abilities.includes(a.key);
        const now=a.key===r.key;
        return `<span class="${done?"done":now?"now":""}">${localize(a.jp)}</span>`;
      }).join("");
      b.appendChild(chain);
    } else {
      const who=document.createElement("div");
      who.className="rchain";
      who.style.alignItems="center";
      const lab=document.createElement("span");
      lab.style.border="0"; lab.style.color="#a49070"; lab.style.padding="0";
      lab.textContent=L("今の群れ全員に適用","applies to the whole herd");
      who.appendChild(lab);
      for(const o of alive.slice(0,6)) who.appendChild(spriteEl(unitSprite(o),28));
      b.appendChild(who);
    }

    const p=document.createElement("p");
    p.className="rdesc";
    p.textContent=localize(r.desc);
    b.appendChild(p);
    b.onmouseenter=()=>focusReward(i);
    b.onfocus=()=>focusReward(i);
    b.onclick=()=>chooseReward(i);
    box.appendChild(b);
  });

  const herd=$("campHerd");
  if(herd&&herd.replaceChildren){
    herd.replaceChildren();
    for(const o of alive){
      const chip=document.createElement("div");
      chip.className="herd-chip";
      chip.appendChild(spriteEl(unitSprite(o),37));
      const info=document.createElement("div");
      const pct=Math.round(clamp(o.hp/o.maxhp,0,1)*100);
      info.innerHTML=`<div class="hn">${o.name}</div><span class="hb"><i style="width:${pct}%;background:${pct<=40?"#c9452e":pct<=75?"#e8b23c":"#7fae2f"}"></i></span>`;
      chip.appendChild(info);
      herd.appendChild(chip);
    }
  }
  $("campHerdLabel").textContent=`HERD — ${alive.length} / ${MAX_APES}`;

  const next=stageDef(G.stage+1);
  $("campNextTitle").textContent=`NEXT — ${next.id||G.stage+1} ${stageName(G.stage+1)}`;
  const o=next.objective;
  const objText=o.type==="wipe"?L("増援をすべて倒す","Defeat every raider")
    :o.type==="forest"?L(`森を ${o.target} まで育てる`,`Grow the forest to ${o.target}`)
    :o.type==="births"?L(`仲間を ${o.target} 匹産む`,`Birth ${o.target} allies`)
    :L(`${next.rounds}ラウンド生存する`,`Survive ${next.rounds} rounds`);
  const byKind=new Map();
  for(const w of next.waves) byKind.set(w.kind,(byKind.get(w.kind)||0)+w.n);
  const waveText=byKind.size
    ? [...byKind].map(([kind,n])=>`${localize(FOE[kind].jp)} ×${n}`).join(L("／"," / "))
    : L("襲撃なし","no raids");
  const hpUp=Math.round((next.enemyMul.hp/stageDef().enemyMul.hp-1)*100);
  const atkUp=Math.round((next.enemyMul.atk/stageDef().enemyMul.atk-1)*100);
  $("campNextBody").innerHTML=
    `<span style="color:#6d5a42">${L("地形","Terrain")}</span><b style="font-weight:400">${next.terrain?L("新しい森域に移る","a new sector"):L("前ステージの森を引き継ぐ","carries this forest forward")}</b>`+
    `<span style="color:#6d5a42">${L("ラウンド","Rounds")}</span><b style="font-weight:400">${next.rounds}</b>`+
    `<span style="color:#6d5a42">${L("クリア条件","Objective")}</span><b style="font-weight:400">${objText}</b>`+
    `<span style="color:#6d5a42">${L("襲撃","Raids")}</span><b style="font-weight:400;color:#c9452e">${waveText}</b>`+
    `<span style="color:#6d5a42">${L("敵の強化","Foe scaling")}</span><b style="font-weight:400">HP+${hpUp}% / ATK+${atkUp}%</b>`;

  renderInventory(); PTE("camp"); $("scCamp").hidden=false; focusReward(0); syncActs(); fit(); SFX.born();
}
/* いま選ばれている戦果を1枚だけ強調する */
function focusReward(i){
  if(!G.intermission) return;
  G.rewardFocus=clamp(i,0,(G.rewardOptions||[]).length-1);
  const cards=[...$("rewardBox").children];
  cards.forEach((el,k)=>el.classList.toggle("lead",k===G.rewardFocus));
  const r=G.rewardOptions[G.rewardFocus];
  const go=$("bCampGo");
  if(go&&r) go.textContent=L(`「${localize(r.name)}」で進む　ENT`,`Take "${localize(r.name)}" — ENT`);
}
addEventListener("keydown",e=>{
  if(typeof G==="undefined"||!G||!G.intermission||$("scCamp").hidden) return;
  const n=(G.rewardOptions||[]).length;
  if(!n) return;
  if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
    e.preventDefault();
    focusReward(((G.rewardFocus??0)+(e.key==="ArrowRight"?1:-1)+n)%n);
    beep(520,.03,"square",.02);
    return;
  }
  const direct={"1":0,"2":1,"3":2,a:0,b:1,c:2,A:0,B:1,C:2}[e.key];
  if(direct!==undefined&&direct<n){ e.preventDefault(); chooseReward(direct); return; }
  if(e.key==="Enter"||e.key===" "||e.code==="Space"){ e.preventDefault(); chooseReward(G.rewardFocus??0); }
});
function chooseReward(i){
  if(!G.intermission) return;
  const r=G.rewardOptions[i]; r.apply(); G.progress.picks.push(r.title);
  G.intermission=false; $("scCamp").hidden=true;
  nextStage(); captureStageStart(); syncOrder(); fit(); setTimeout(nextTurn,250);
}
function clearStageIfReady(){
  if(G.over||G.intermission) return false;
  const s=stageDef(), foes=G.units.some(u=>u.alive&&u.side!=="ape"), o=s.objective;
  const ready=o.type==="wipe" ? G.waveIx>=s.waves.length&&!foes
    : o.type==="forest" ? forestValue()>=o.target
    : o.type==="births" ? G.stageBorn>=o.target
    : G.finalRound;
  if(!ready) return false;
  if(G.stage<STAGE_COUNT&&s.camp) openCamp();
  else if(G.stage<STAGE_COUNT){ nextStage(); captureStageStart(); syncOrder(); fit(); setTimeout(nextTurn,250); }
  else finish(true,"森は残った",`${STAGE_COUNT}ステージの襲撃をしのぎ、森は次の世代へ渡った。`);
  return true;
}
function nextStage(){
  G.stage++; G.round=1; G.waveIx=0; G.clockTicks=0; G.finalRound=false; G.stageBorn=0;
  G.units=G.units.filter(u=>u.alive&&u.side==="ape");
  const s=stageDef();
  if(s.terrain){
    G.map=newMap(s.terrain); plantGroves(s.terrain);
    const spots=[];
    for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){ const t=at(x,y); if(t&&!t.water) spots.push([x,y]); }
    spots.sort((a,b)=>(Math.abs(a[0]-COLS/2)+Math.abs(a[1]-ROWS/2))-(Math.abs(b[0]-COLS/2)+Math.abs(b[1]-ROWS/2))||idx(a[0],a[1])-idx(b[0],b[1]));
    G.units.forEach((u,i)=>{ const p=spots[i]; u.tx=p[0];u.ty=p[1];u.px=unitX(u);u.py=unitY(u); });
  }
  G.active=null; G.mode=null; G.moveSet=null; G.rangeSet=null; G.targetSet=null;
  G.shake=7; SFX.born();
  logMsg("#e8b23c",`ステージ ${G.stage}「${stageName(G.stage)}」— 森・仲間・強化を引き継いだ`);
  if(s.intro) logMsg("#d5c4a3",s.intro[LANG]||s.intro.ja);
  spawnDueWaves();
  float(CW/2,CH/2-18,`STAGE ${G.stage} ${stageName(G.stage)}`,"#ffe08a",2.5);
}

function advanceWorld(){
  const s=stageDef();
  G.round=Math.min(s.rounds,G.round+1);
  PTE("round",{round:G.round});
  if(G.round>=s.rounds) G.finalRound=true;
  // 火
  const lit=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){ const t=at(x,y); if(t.fire>0) lit.push([x,y]); }
  for(const [x,y] of lit){
    const t=at(x,y);
    t.fire--;
    if(t.fire<=0){ t.v=0; t.grow=0; t.fruit=0; t.fert=0; t.treeAge=0; t.ash=3; puff(x*TS+12,tileTop(x,y)+12,"#463c31",5); }
  }
  for(const [x,y] of lit){
    const here=at(x,y);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const n=at(x+dx,y+dy);
      if(!n||n.water||n.v<1||n.fire>0||!n.c) continue;
      const up = n.h>here.h, down = n.h<here.h;
      const p = BIOME[n.c].flam * s.fireSpread * (up?1.7:down?0.35:1);    // 火は坂を駆け上がる
      if(hash(x+dx+G.round*17,y+dy+G.stage*101)<p){ n.fire=2; n.treeAge=0; puff((x+dx)*TS+12,tileTop(x+dx,y+dy)+12,"#f2802b",4); }
    }
  }
  // 成長
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const t=at(x,y);
    if(t.fire>0) continue;
    if(t.ash>0){ t.ash--; if(t.ash<=0&&t.c) t.fert=Math.max(t.fert,1); continue; }
    if(!t.c) continue;
    const B=BIOME[t.c];
    if(t.v<3){
      if(t.fert>0){
        t.grow += B.rate;
        t.fert = Math.max(0,t.fert-1);
        const was=t.v;
        t.v = t.grow>=GROW_TREE?3 : t.grow>=GROW_SAP?2 : t.grow>=GROW_GRASS?1 : 0;
        if(t.v>was){ SFX.grow(); if(t.v===3) puff(x*TS+12,tileTop(x,y)+8,B.berry,6); }
      }
    } else {
      if(t.fruit<B.cap && (t.fert>0 || G.round%2===0)){ t.fruit++; if(t.fert>0) t.fert=Math.max(0,t.fert-1); }
    }
  }
  // 成木として無事に残ったターン数が、そのまま出生条件になる
  for(const t of G.map){
    if(t.v===3&&t.fire<=0) t.treeAge++;
    else t.treeAge=0;
  }
  tryBirth();
  spawnDueWaves();
  if(clearStageIfReady()){ syncRail(); return; }
  const veg=forestValue();
  if(G.round>4 && veg<1) finish(false,"森が焼き尽くされた","うんちの記憶まで灰になった。");
  syncRail();
}
function spawnDueWaves(){
  const s=stageDef();
  while(G.waveIx<s.waves.length&&s.waves[G.waveIx].r<=G.round){
    const w=s.waves[G.waveIx++], extra=Math.min(s.reinforce.max,Math.floor(forestValue()/Math.max(1,s.reinforce.perForest)));
    const n=w.n+(FOE[w.kind].ai==="jikon"?0:extra);
    for(let i=0;i<n;i++) spawnFoe(w.kind);
    SFX.wave();
    logMsg("#c9452e",`第${G.waveIx}波 ${FOE[w.kind].jp} ×${n} — ${FOE[w.kind].act}`);
  }
}
function forestValue(){
  let v=0;
  for(const t of G.map){ if(t.fire>0) continue; v += t.v===3?3 : t.v===2?1.2 : t.v===1?0.3 : 0; }
  return v;
}
function matureTrees(c){ return G.map.filter(t=>t.v===3&&t.c===c&&t.fire<=0); }
function nextBirthType(c){
  const table=BORN[c].filter(([type])=>G.progress.unlocked.includes(type));
  if(!table.length) return null;
  const total=table.reduce((sum,row)=>sum+row[1],0);
  let cursor=G.bornByColor[c]%total;
  for(const [type,count] of table){
    if(cursor<count) return type;
    cursor-=count;
  }
  return table[0][0];
}
function tryBirth(){
  const apes=G.units.filter(u=>u.alive&&u.side==="ape").length;
  if(apes>=MAX_APES) return;
  const ready=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const t=at(x,y);
    if(t.v===3&&t.c&&t.fire<=0&&t.treeAge>=BIRTH_TREE_TURNS) ready.push({x,y,t});
  }
  ready.sort((a,b)=>b.t.treeAge-a.t.treeAge||idx(a.x,a.y)-idx(b.x,b.y));
  const parent=ready.find(({x,y,t:tree})=>nextBirthType(tree.c)&&[[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{
    const t=at(x+dx,y+dy); return t&&!t.water&&t.fire<=0&&!unitAt(x+dx,y+dy);
  }));
  if(!parent) return;
  const c=parent.t.c, spots=[];
  for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){
    const t=at(parent.x+dx,parent.y+dy);
    if(t&&!t.water&&t.fire<=0&&!unitAt(parent.x+dx,parent.y+dy)) spots.push([parent.x+dx,parent.y+dy]);
  }
  const type=nextBirthType(c);
  spots.sort((a,b)=>idx(a[0],a[1])-idx(b[0],b[1]));
  const s=spots[G.bornByColor[c]%spots.length];
  const u=makeUnit("ape",type,s[0],s[1]);
  parent.t.treeAge=0;
  G.bornByColor[c]++;
  G.born++; G.stageBorn++; SFX.born(); PTE("birth",{name:u.name});
  float(unitX(u),unitY(u)-34,APE[type].jp,BIOME[c].berry,2.4);
  logMsg(BIOME[c].berry,`${BIOME[c].jp}から ${u.name}（${APE[type].jp}）が生まれた`);
  for(let i=0;i<12;i++) G.fx.push({x:unitX(u)+rnd(9,-9),y:unitY(u),vx:rnd(22,-22),vy:rnd(-20,-52),col:BIOME[c].berry,life:rnd(1,.5)});
  syncOrder();
}
function spawnFoe(kind){
  const cands=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(x>1&&x<COLS-2&&y>1&&y<ROWS-2) continue;
    const t=at(x,y);
    if(t&&!t.water&&t.fire<=0&&!unitAt(x,y)) cands.push([x,y]);
  }
  if(!cands.length) return;
  const s=cands[(G.stage*31+G.waveIx*7+nextId)%cands.length];
  makeUnit("human",kind,s[0],s[1]);
  syncOrder();
}

/* ══════════ 敵AI ══════════ */
/* 副作用なしで「この人族が次に何をするか」を出す。盤面テレグラフと実行の両方が使う */
function foePlan(u){
  const st=S(u);
  const set=reachable(u);
  const apes=G.units.filter(o=>o.alive&&o.side==="ape");
  let goal=null, want="attack";

  if(st.ai==="lumberjack" && apes.length){
    // 隣にゴリラがいなければ木を伐る
    const near=apes.find(o=>inRange(u.tx,u.ty,o.tx,o.ty,1));
    if(!near){
      let best=null,bd=99;
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
        const t=at(x,y); if(t.v<2) continue;
        const d=Math.abs(x-u.tx)+Math.abs(y-u.ty);
        if(d<bd){bd=d;best=[x,y];}
      }
      if(best){ goal=best; want="chop"; }
    }
  }
  if(st.ai==="arsonist"){
    let best=null,bd=99;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const t=at(x,y); if(t.v<1||t.water||!t.c||BIOME[t.c].flam<=0||t.fire>0) continue;
      let v=0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){ const n=at(x+dx,y+dy); if(n) v+=n.v; }
      const d=Math.abs(x-u.tx)+Math.abs(y-u.ty) - v;
      if(d<bd){bd=d;best=[x,y];}
    }
    if(best){ goal=best; want="burn"; }
  }
  if(!goal && apes.length){
    let best=null,bd=1e9;
    for(const o of apes){ const d=Math.abs(o.tx-u.tx)+Math.abs(o.ty-u.ty); if(d<bd){bd=d;best=o;} }
    goal=[best.tx,best.ty]; want="attack";
  }
  if(!goal) return null;

  // 目標に一番近づける到達マスへ
  let bestK=null, bestScore=1e9;
  const consider=(k,c)=>{
    const x=k%COLS, y=(k/COLS)|0;
    const d=Math.abs(x-goal[0])+Math.abs(y-goal[1]);
    const h=at(x,y).h;
    const score=d*10 - h*2 + c*0.4;                  // 高いところを好む
    if(score<bestScore){ bestScore=score; bestK=k; }
  };
  consider(idx(u.tx,u.ty),0);
  for(const [k,v] of set) consider(k,v.c);
  return {want,goal,set,bestK,dest:[bestK%COLS,(bestK/COLS)|0]};
}
/* 予告に出すマス。狙われている場所そのものを返す */
function foeIntentTiles(u,plan){
  const st=S(u), [dx,dy]=plan.dest, out=[];
  if(plan.want==="attack"){
    for(const o of G.units) if(o.alive&&o.side==="ape"&&inRange(dx,dy,o.tx,o.ty,st.rng)) out.push([o.tx,o.ty,true]);
    if(!out.length) out.push([plan.goal[0],plan.goal[1],false]);
  } else if(plan.want==="chop"){
    out.push([plan.goal[0],plan.goal[1],inRange(dx,dy,plan.goal[0],plan.goal[1],1)]);
  } else if(plan.want==="burn"){
    const cand=[plan.goal,...tilesInRange(dx,dy,st.rng)];
    const spot=cand.find(([x,y])=>{ const t=at(x,y); return t&&t.v>=1&&t.c&&BIOME[t.c].flam>0&&t.fire<=0&&inRange(dx,dy,x,y,st.rng); });
    out.push(spot?[spot[0],spot[1],true]:[plan.goal[0],plan.goal[1],false]);
  }
  return out;
}
const INTENT_JA={attack:"ゴリラを狙っている",chop:"木を伐ろうとしている",burn:"火を放とうとしている"};
const INTENT_EN={attack:"closing on a gorilla",chop:"about to fell a tree",burn:"about to set a fire"};
function recomputeIntent(){
  if(typeof G==="undefined"||!G||!G.map) return;
  const m=new Map();
  if(INTENT_ON) for(const u of G.units){
    if(!u.alive||u.side==="ape") continue;
    let plan=null;
    try{ plan=foePlan(u); }catch(e){ plan=null; }
    if(!plan) continue;
    for(const [x,y,reach] of foeIntentTiles(u,plan)){
      const k=idx(x,y), prev=m.get(k);
      if(!prev||(reach&&!prev.reach)) m.set(k,{kind:plan.want,name:u.name,reach});
    }
  }
  G.intent=m;
}
function foeTurn(u){
  const plan=foePlan(u);
  if(!plan){ endAct(u); return; }
  const st=S(u), {want,goal,set,bestK}=plan;
  const path = bestK===idx(u.tx,u.ty) ? [] : pathTo(u,set,bestK%COLS,(bestK/COLS)|0);

  doMove(u,path,()=>{
    const target = want==="attack" ? G.units.find(o=>o.alive&&o.side==="ape"&&inRange(u.tx,u.ty,o.tx,o.ty,st.rng)) : null;
    if(target){ actionAttack(u,target.tx,target.ty); return; }
    if(want==="chop"){
      const t=at(goal[0],goal[1]);
      if(inRange(u.tx,u.ty,goal[0],goal[1],1)&&t&&t.v>=2){
        G.anim={kind:"strike",u,d:null,t:0,dur:.4,after:()=>{
          t.v=0;t.grow=0;t.fruit=0;t.treeAge=0;t.fert=Math.max(0,t.fert-2);
          puff(goal[0]*TS+12,tileTop(goal[0],goal[1])+12,"#6b5322",8);
          float(goal[0]*TS+12,tileTop(goal[0],goal[1]),"木が倒された","#c9452e",1.5);
          beep(90,.12,"square",.05,-30); endAct(u);
        }};
        return;
      }
    }
    if(want==="burn"){
      const cand=[[goal[0],goal[1]],...tilesInRange(u.tx,u.ty,st.rng)];
      const spot=cand.find(([x,y])=>{ const t=at(x,y); return t&&t.v>=1&&t.c&&BIOME[t.c].flam>0&&t.fire<=0&&inRange(u.tx,u.ty,x,y,st.rng); });
      if(spot){
        u.dir=spot[0]>u.tx?1:-1;
        G.anim={kind:"flame",u,tx:spot[0],ty:spot[1],t:0,dur:.6,after:()=>{
          const t=at(spot[0],spot[1]);
          if(t&&t.v>=1&&BIOME[t.c].flam>0){ t.fire=2; t.treeAge=0; SFX.fire(); float(spot[0]*TS+12,tileTop(spot[0],spot[1]),"着火","#f2802b",1.4); }
          endAct(u);
        }};
        return;
      }
    }
    endAct(u);
  });
}

/* ══════════ 演出 ══════════ */
function puff(x,y,col,n){ for(let i=0;i<n;i++) G.fx.push({x,y,vx:rnd(26,-26),vy:rnd(-8,-36),col,life:rnd(.7,.3)}); }
function float(x,y,text,col,life){ G.floats.push({x,y,text,col,life,max:life}); }
function logMsg(col,msg){
  G.log.push({col,msg,life:5});
  if(G.log.length>4) G.log.shift();
  renderLog();
}

/* ══════════ 描画 ══════════ */
function drawTile(x,y){
  const t=at(x,y), sx=x*TS, top=tileTop(x,y), h=hash(x,y);
  const B=t.c?BIOME[t.c]:null;
  // 側面
  const wallH=t.h*HSTEP+6;
  if(wallH>0){
    ctx.fillStyle = t.water?"#20343a" : (B?B.wall:"#33261a");
    ctx.fillRect(sx,top+TS,TS,wallH);
    ctx.fillStyle="#00000040";
    ctx.fillRect(sx,top+TS+wallH-2,TS,2);
    for(let i=0;i<3;i++){ if(hash(x*3+i,y*5)>.6){ ctx.fillStyle="#ffffff10"; ctx.fillRect(sx+2+i*7,top+TS+2,2,Math.max(1,wallH-4)); } }
  }
  // 上面
  let g = t.water?"#3c6b70" : (B&&(t.v>0||t.fert>0)?B.ground:"#4a3623");
  if(t.ash>0) g="#2f2820";
  ctx.fillStyle=g; ctx.fillRect(sx,top,TS,TS);
  // 高さの陰影
  ctx.fillStyle = t.h>=2?"#ffffff12" : t.h===1?"#ffffff08" : "#00000010";
  ctx.fillRect(sx,top,TS,TS);
  ctx.fillStyle="#00000022"; ctx.fillRect(sx,top,TS,1); ctx.fillRect(sx,top,1,TS);
  // ディザ
  if(h<.35){ ctx.fillStyle="#00000022"; ctx.fillRect(sx+((h*29)|0)%18,top+((h*13)|0)%18,3,2); }
  if(h>.75){ ctx.fillStyle="#ffffff10"; ctx.fillRect(sx+((h*17)|0)%18,top+((h*7)|0)%18,2,2); }
  if(t.water){
    ctx.fillStyle="#68d0e033";
    const w=Math.sin(vt*2+x*.8+y*.5)>0?1:0;
    ctx.fillRect(sx+2+w,top+6,8,1); ctx.fillRect(sx+12-w,top+14,8,1);
  }
  if(t.ash>0){ ctx.fillStyle="#1c1712"; ctx.fillRect(sx+4,top+6,4,3); ctx.fillRect(sx+13,top+13,3,3); }
  if(t.fert>0&&t.v===0&&t.ash<=0&&t.c){
    ctx.fillStyle=PCOL[t.c].m;
    ctx.fillRect(sx+7,top+9,3,3); ctx.fillRect(sx+13,top+13,2,2);
  }
  // 植生
  if(t.v>0&&B) drawVeg(x,y,t,B,sx,top);
}
function drawVeg(x,y,t,B,sx,top){
  const h=hash(x,y), sway=Math.sin(vt*1.4+x*.7+y*.4)>0?1:0;
  if(t.v===1){
    ctx.fillStyle=B.grass[0];
    ctx.fillRect(sx+4+((h*7)|0)%3,top+13,3,6); ctx.fillRect(sx+11,top+16,3,4);
    ctx.fillStyle=B.grass[1]; ctx.fillRect(sx+16,top+12+((h*5)|0)%2,3,7);
  } else if(t.v===2){
    ctx.fillStyle=B.trunk; ctx.fillRect(sx+11,top+12,3,8);
    ctx.fillStyle=B.leaf[0]; ctx.fillRect(sx+6+sway,top+7,12,6);
    ctx.fillStyle=B.leaf[1]; ctx.fillRect(sx+9,top+4,6,4);
  } else {
    ctx.fillStyle="#00000038"; ctx.fillRect(sx+4,top+18,16,3);
    ctx.fillStyle=B.trunk; ctx.fillRect(sx+10,top+11,4,10);
    ctx.fillStyle=B.leaf[0]; ctx.fillRect(sx+2+sway,top+1,20,11);
    ctx.fillStyle=B.leaf[1]; ctx.fillRect(sx+6+sway,top-2,12,6);
    ctx.fillStyle="#00000030"; ctx.fillRect(sx+2+sway,top+10,20,2);
    for(let i=0;i<(t.fruit|0);i++){
      ctx.fillStyle=B.berry;
      ctx.fillRect(sx+5+sway+i*6,top+4+((i*5+((h*9)|0))%4),3,3);
      ctx.fillStyle="#ffffff70"; ctx.fillRect(sx+5+sway+i*6,top+4+((i*5+((h*9)|0))%4),1,1);
    }
  }
}
function drawFire(x,y){
  const t=at(x,y); if(t.fire<=0) return;
  const sx=x*TS, top=tileTop(x,y), k=Math.floor(vt*12);
  for(let i=0;i<8;i++){
    const h2=hash(x*7+i+k,y*3+k);
    ctx.fillStyle=h2>.66?"#ffd34d":h2>.3?"#f2802b":"#c33a1e";
    ctx.fillRect(sx+2+((h2*18)|0),top+2+((h2*17)|0),3,4);
  }
  ctx.fillStyle="#ffd34d30"; ctx.fillRect(sx+2,top+2,20,20);
}
function drawUnit(u){
  const st=S(u);
  const s=unitSprite(u);
  const squat=u.squat>0;
  const strain=squat?clamp(1-u.squat/Math.max(.01,u.squatMax),0,1):0;
  const A=G.anim;
  let ox=0, oy=0;
  if(A&&A.u===u){
    if(A.kind==="strike"){ const k=Math.sin(Math.min(1,A.t/A.dur)*Math.PI); ox=u.dir*k*9; }
    if(A.kind==="stomp"){ oy=-Math.sin(Math.min(1,A.t/A.dur)*Math.PI)*7; }
  }
  const shake = squat?Math.round(Math.sin(vt*(28+strain*24))*(.5+strain*1.5)):0;
  const drop  = squat?Math.round(Math.sin(strain*Math.PI)*4):0;
  oy += u.relief>0 ? -Math.round(Math.sin((u.relief/.5)*Math.PI)*7) : 0;
  const x=Math.round(u.px-s.width/2+ox+shake), y=Math.round(u.py-s.height+1+oy+drop);
  // 影
  ctx.fillStyle="#00000048";
  ctx.fillRect(Math.round(u.px-6),Math.round(u.py-2),12,3);
  // 選択・行動中リング
  if(G.active===u&&u.alive){
    const col=u.side==="ape"?"#ffe08a":"#ff6047";
    ctx.fillStyle=col;
    const bob=Math.sin(vt*5)>0?0:1;
    ctx.fillRect(Math.round(u.px)-3,Math.round(u.py-s.height-6-bob),6,2);
    ctx.fillRect(Math.round(u.px)-1,Math.round(u.py-s.height-4-bob),2,2);
  }
  if(u.rage>0&&Math.sin(vt*13)>0){ ctx.fillStyle="#c9452e55"; ctx.fillRect(x,y,s.width,s.height); }
  ctx.save();
  if(u.dir<0){ ctx.translate(x+s.width,y); ctx.scale(-1,1); ctx.drawImage(s,0,0); }
  else ctx.drawImage(s,x,y);
  ctx.restore();
  // 力み
  if(squat){
    const k=Math.sin(vt*26)>0?1:0;
    ctx.fillStyle="#ffffffcc"; ctx.fillRect(x+s.width-3+k,y-4,2,2);
    ctx.fillStyle="#e8b23c"; ctx.fillRect(x+2-k,y-3,3,1); ctx.fillRect(x+s.width-8+k,y-6,3,1);
    if(strain>.72){ // 出かかっている
      const gsz=Math.max(1,Math.round((strain-.72)*12));
      ctx.fillStyle=PCOL[G.anim?.pk==="gold"?"gold":(u.belly[0]||"y")].m;
      ctx.fillRect(Math.round(u.px-u.dir*10-gsz/2), Math.round(u.py-6-gsz/2), gsz, Math.max(1,Math.round(gsz*.7)));
    }
  }
  // HP / MP
  const bw=s.width-4;
  {
    ctx.fillStyle="#0b0805"; ctx.fillRect(x+2,y-3,bw,2);
    ctx.fillStyle=u.side==="ape"?(u.hp>u.maxhp*.4?"#7fae2f":"#c9452e"):"#c9452e";
    ctx.fillRect(x+2,y-3,Math.max(1,Math.round(bw*u.hp/u.maxhp)),2);
  }
  if(u.side==="ape"&&u.maxmp){
    ctx.fillStyle="#0b0805"; ctx.fillRect(x+2,y-6,bw,2);
    ctx.fillStyle="#68d0e0"; ctx.fillRect(x+2,y-6,Math.max(0,Math.round(bw*u.mp/u.maxmp)),2);
  }
  // お腹の中の実：3枠を盤面上に常時表示（左から、次に出る順）
  if(u.side==="ape") for(let i=0;i<3;i++){
    const sx=x+2+i*5, sy=y-11;
    ctx.fillStyle="#0b0805"; ctx.fillRect(sx,sy,4,4);
    ctx.fillStyle="#4a3823"; ctx.fillRect(sx,sy,4,1); ctx.fillRect(sx,sy,1,4);
    const c=u.belly[i]; if(!c) continue;
    ctx.fillStyle=BIOME[c].berry; ctx.fillRect(sx+1,sy+1,3,3);
    ctx.fillStyle="#ffffff90"; ctx.fillRect(sx+1,sy+1,1,1);
  }
}
function drawPoop(p){
  const K=POOP[p.kind], C=PCOL[p.kind==="gold"?"gold":p.c];
  const air=clamp(1-p.t/p.land,0,1), fall=air*CFG.arc, s=K.size;
  let sq=1; const since=p.t-p.land;
  if(since>=0&&since<.22) sq=1-CFG.squash*Math.sin((1-since/.22)*Math.PI*.5);
  const flight=1-air;
  const x=(p.thrown?p.fromX+(p.x-p.fromX)*flight:p.x+p.dir*air*7)|0;
  const y=(p.thrown?p.fromY+(p.y-p.fromY)*flight-Math.sin(flight*Math.PI)*CFG.arc*1.4:p.y-fall)|0;
  const R=(w,h,col,ox,oy)=>{ctx.fillStyle=col;ctx.fillRect((x+ox*s)|0,(y+oy*s*sq)|0,Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*sq*s)));};
  if(p.kind==="pellet"){ R(2,2,C.m,-3,-2);R(2,2,C.d,0,-3);R(2,2,C.m,1,-1);R(1,1,C.l,-3,-2); }
  else if(p.kind==="big"){ R(8,2,C.d,-4,-1);R(6,2,C.m,-3,-3);R(4,2,C.m,-2,-5);R(2,1,C.l,-1,-6);R(3,1,C.l,-3,-3); }
  else if(p.kind==="gold"){
    R(6,2,C.d,-3,-1);R(4,2,C.m,-2,-3);R(2,1,C.l,-1,-4);
    if(Math.sin(vt*9)>0){ R(1,1,"#fff9d6",-4,-5); R(1,1,"#fff9d6",3,-3); }
  } else { R(6,2,C.d,-3,-1);R(4,2,C.m,-2,-3);R(2,1,C.l,-1,-4); }
  if(since>=0&&since<.45){
    const q=since/.45, rad=Math.round(5+q*(12+K.size*5)), rh=Math.max(2,Math.round(rad*.45));
    ctx.globalAlpha=(1-q)*.9; ctx.fillStyle=C.l;
    ctx.fillRect(x-rad,y-rh,rad*2,2); ctx.fillRect(x-rad,y+rh-2,rad*2,2);
    ctx.fillRect(x-rad,y-rh,2,rh*2); ctx.fillRect(x+rad-2,y-rh,2,rh*2);
    ctx.globalAlpha=1;
  }
  if(since>0&&since<CFG.steam){
    ctx.fillStyle="#ffffff33";
    const k=since*7;
    ctx.fillRect((x-2+Math.sin(k)*2)|0,(y-6-since*5)|0,1,2);
    ctx.fillRect((x+2+Math.sin(k+2)*2)|0,(y-8-since*4)|0,1,2);
  }
}

function draw(){
  ctx.clearRect(0,0,CW,CH);
  ctx.save();
  if(G.shake>.2) ctx.translate(Math.round(rnd(G.shake,-G.shake)),Math.round(rnd(G.shake,-G.shake)));

  // 移動範囲 / 射程のハイライト（地面の上）
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++) drawTile(x,y);
    // ハイライト
    for(let x=0;x<COLS;x++){
      const k=idx(x,y), top=tileTop(x,y);
      if(G.phase==="move"&&!G.mode&&G.moveSet&&G.moveSet.has(k)){
        ctx.fillStyle="#68d0e030"; ctx.fillRect(x*TS,top,TS,TS);
        ctx.fillStyle="#68d0e090";
        ctx.fillRect(x*TS,top,TS,1); ctx.fillRect(x*TS,top+TS-1,TS,1);
        ctx.fillRect(x*TS,top,1,TS); ctx.fillRect(x*TS+TS-1,top,1,TS);
      }
      if(G.rangeSet&&G.rangeSet.has(k)){
        ctx.fillStyle="#c9452e2d"; ctx.fillRect(x*TS,top,TS,TS);
        ctx.fillStyle="#c9452eaa";
        ctx.fillRect(x*TS,top,TS,1); ctx.fillRect(x*TS,top+TS-1,TS,1);
        ctx.fillRect(x*TS,top,1,TS); ctx.fillRect(x*TS+TS-1,top,1,TS);
      }
      if(G.targetSet&&G.targetSet.has(k)){
        const pulse=Math.sin(vt*6)>0?"#e8b23c55":"#e8b23c33";
        ctx.fillStyle=pulse; ctx.fillRect(x*TS,top,TS,TS);
        ctx.fillStyle="#e8b23c"; ctx.fillRect(x*TS,top,TS,1); ctx.fillRect(x*TS,top+TS-1,TS,1);
      }
      if(G.intent&&G.intent.has(k)&&!(G.targetSet&&G.targetSet.has(k))){
        const it=G.intent.get(k), lit=Math.sin(vt*4)>-.35;
        ctx.fillStyle=it.reach?"#ff604726":"#ff604714"; ctx.fillRect(x*TS,top,TS,TS);
        ctx.fillStyle=lit?"#ff6047":"#ff604780";
        const b=Math.max(3,(TS/4)|0);                       // 四隅のかぎかっこ
        ctx.fillRect(x*TS,top,b,2);           ctx.fillRect(x*TS,top,2,b);
        ctx.fillRect(x*TS+TS-b,top,b,2);      ctx.fillRect(x*TS+TS-2,top,2,b);
        ctx.fillRect(x*TS,top+TS-2,b,2);      ctx.fillRect(x*TS,top+TS-b,2,b);
        ctx.fillRect(x*TS+TS-b,top+TS-2,b,2); ctx.fillRect(x*TS+TS-2,top+TS-b,2,b);
      }
      if(G.kbPos&&G.kbPos[0]===x&&G.kbPos[1]===y){
        const pulse=Math.sin(vt*8)>0?2:1;
        ctx.fillStyle="#ffe08a";
        ctx.fillRect(x*TS+2,top+2,TS-4,pulse); ctx.fillRect(x*TS+2,top+TS-2-pulse,TS-4,pulse);
        ctx.fillRect(x*TS+2,top+2,pulse,TS-4); ctx.fillRect(x*TS+TS-2-pulse,top+2,pulse,TS-4);
      }
      if(G.active?.alive&&G.active.tx===x&&G.active.ty===y){
        const col=G.active.side==="ape"?"#ffe08a":"#ff6047";
        const p=Math.sin(vt*7)>0?1:0, sx=x*TS+p, sy=top+p, n=7;
        ctx.fillStyle=G.active.side==="ape"?"#e8b23c22":"#c9452e22";
        ctx.fillRect(x*TS,top,TS,TS);
        ctx.fillStyle=col;
        ctx.fillRect(sx,sy,n,2); ctx.fillRect(sx,sy,2,n);
        ctx.fillRect(sx+TS-n-2,sy,n,2); ctx.fillRect(sx+TS-4,sy,2,n);
        ctx.fillRect(sx,sy+TS-4,n,2); ctx.fillRect(sx,sy+TS-n-2,2,n);
        ctx.fillRect(sx+TS-n-2,sy+TS-4,n,2); ctx.fillRect(sx+TS-4,sy+TS-n-2,2,n);
      }
    }
    // この行に立つユニット・うんち
    for(const p of G.poops) if(p.ty===y) drawPoop(p);
    for(const u of G.units) if(u.alive&&u.ty===y&&u!==G.dragging) drawUnit(u);
    for(let x=0;x<COLS;x++) drawFire(x,y);
  }
  // ユニットが立っている射程マスも、枠線だけは手前に出して見失わせない
  if(G.rangeSet){
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const k=idx(x,y); if(!G.rangeSet.has(k)) continue;
      const top=tileTop(x,y), col=G.targetSet?.has(k)?"#e8b23c":"#c9452e";
      ctx.fillStyle=col;
      ctx.fillRect(x*TS,top,TS,2); ctx.fillRect(x*TS,top+TS-2,TS,2);
      ctx.fillRect(x*TS,top,2,TS); ctx.fillRect(x*TS+TS-2,top,2,TS);
    }
  }
  if(G.dragging) drawUnit(G.dragging);

  // 雨・投擲
  const A=G.anim;
  if(A&&A.kind==="rain"){
    const k=A.t/A.dur;
    ctx.globalAlpha=.6*(k<.2?k/.2:k>.8?(1-k)/.2:1);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const t=at(A.tx+dx,A.ty+dy); if(!t) continue;
      const sx=(A.tx+dx)*TS, top=tileTop(A.tx+dx,A.ty+dy);
      ctx.fillStyle="#68d0e022"; ctx.fillRect(sx,top,TS,TS);
      ctx.fillStyle="#68d0e0";
      for(let i=0;i<4;i++){
        const h2=hash((A.tx+dx)*17+i*13+((A.t*9)|0),(A.ty+dy)*19+i*7);
        const x=sx+2+h2*(TS-4), y=top-12+((h2*100+A.t*150+i*9)%(TS+18));
        ctx.fillRect(x|0,y|0,1,4);
      }
    }
    ctx.globalAlpha=1;
  }
  if(A&&(A.kind==="throw"||A.kind==="flame")){
    const k=Math.min(1,A.t/A.dur);
    const x0=A.u.px, y0=A.u.py-14, x1=A.tx*TS+12, y1=tileTop(A.tx,A.ty)+12;
    if(A.kind==="throw"){
      const x=x0+(x1-x0)*k, y=y0+(y1-y0)*k-Math.sin(k*Math.PI)*22;
      ctx.fillStyle="#9a9a9a"; ctx.fillRect(x|0,y|0,4,4);
      ctx.fillStyle="#cfcfcf"; ctx.fillRect(x|0,y|0,2,2);
    } else {
      for(let i=0;i<8;i++){
        const q=k*(.3+i*.1); if(q>1) continue;
        const x=x0+(x1-x0)*q+rnd(3,-3), y=y0+(y1-y0)*q+rnd(3,-3);
        ctx.fillStyle=i>5?"#c33a1e":i>3?"#f2802b":"#ffd34d";
        ctx.fillRect(x|0,y|0,4,4);
      }
    }
  }
  // 粒子・数字
  for(const f of G.fx){ ctx.fillStyle=f.col; ctx.fillRect(f.x|0,f.y|0,2,2); }
  ctx.font='8px "DotGothic16", monospace';
  ctx.textAlign="center";
  for(const f of G.floats){
    const k=1-f.life/f.max;
    ctx.globalAlpha=f.life<.4?f.life/.4:1;
    ctx.fillStyle="#000000c0"; ctx.fillText(f.text,(f.x)|0,(f.y-k*16+1)|0);
    ctx.fillStyle=f.col;       ctx.fillText(f.text,(f.x)|0,(f.y-k*16)|0);
    ctx.globalAlpha=1;
  }
  ctx.textAlign="left";
  ctx.restore();
}

/* ══════════ 更新 ══════════ */
function update(dt){
  vt+=dt;
  G.shake=Math.max(0,G.shake-dt*14);
  G.fx=G.fx.filter(f=>(f.life-=dt)>0);
  for(const f of G.fx){ f.x+=f.vx*dt; f.y+=f.vy*dt; f.vy+=42*dt; }
  G.floats=G.floats.filter(f=>(f.life-=dt)>0);
  G.poops=G.poops.filter(p=>{
    const wasAir=p.t<p.land;
    p.t+=dt; p.life-=dt;
    if(wasAir&&p.t>=p.land){
      const K=POOP[p.kind], col=PCOL[p.kind==="gold"?"gold":p.c].l;
      puff(p.x,p.y+2,col,12+Math.round(K.size*6));
      puff(p.x,p.y,"#f2e6cf",4);
      G.shake=Math.max(G.shake,(2+K.shake)*CFG.impactShake);
      beep(p.kind==="big"?75:120,.12,"triangle",.07,-70);
    }
    return p.life>0;
  });
  for(const u of G.units){
    if(!u.alive) continue;
    u.anim+=dt*6;
    if(u!==G.dragging && !(G.anim&&G.anim.kind==="walk"&&G.anim.u===u)){
      u.px += (unitX(u)-u.px)*Math.min(1,dt*12);
      u.py += (unitY(u)-u.py)*Math.min(1,dt*12);
    }
    if(u.squat>0) u.squat-=dt;
    u.relief=Math.max(0,u.relief-dt);
  }
  const A=G.anim;
  if(A){
    A.t+=dt;
    if(A.kind==="walk"){
      const seg=A.t/A.dur;
      if(seg>=1){
        A.t=0; const [nx,ny]=A.path[A.i];
        A.u.dir = nx>A.u.tx?1: nx<A.u.tx?-1: A.u.dir;
        A.u.tx=nx; A.u.ty=ny; A.u.px=unitX(A.u); A.u.py=unitY(A.u);
        SFX.step(); A.i++;
        if(A.i>=A.path.length){ const f=A.after; G.anim=null; f&&f(); return; }
      } else {
        const [nx,ny]=A.path[A.i];
        const sx=A.u.tx*TS+TS/2, sy=unitY(A.u);
        const ex=nx*TS+TS/2, ey=ny*TS+YOFF-at(nx,ny).h*HSTEP+TS;
        A.u.px=sx+(ex-sx)*seg; A.u.py=sy+(ey-sy)*seg-Math.sin(seg*Math.PI)*4;
      }
    } else if(A.kind==="squat"){
      A.u.squat=Math.max(A.u.squat,.5);
      A.u.squat=A.dur-A.t;
      G.shake=Math.max(G.shake,Math.max(0,A.t/A.dur-.5)*3);
      if(!A.fired && A.t>=A.dur-0.25){ A.fired=true; dropPoop(A.u,A.pk,A.pc,A.tx,A.ty); A.u.relief=.5; }
      if(A.t>=A.dur){ A.u.squat=0; const f=A.after; G.anim=null; f&&f(); return; }
    } else if(A.t>=A.dur){
      const f=A.after; G.anim=null; f&&f(); return;
    }
  }
}

/* ══════════ 入力 ══════════ */
function toWorld(ev){
  const r=cv.getBoundingClientRect();
  return {x:(ev.clientX-r.left)/r.width*CW, y:(ev.clientY-r.top)/r.height*CH};
}
function tileFromPoint(p){
  // 高さを考慮：下の行から見て、点が乗っている上面を探す
  for(let y=ROWS-1;y>=0;y--){
    for(let x=0;x<COLS;x++){
      const top=tileTop(x,y);
      if(p.x>=x*TS&&p.x<x*TS+TS&&p.y>=top&&p.y<top+TS) return [x,y];
    }
  }
  const gx=clamp(Math.floor(p.x/TS),0,COLS-1), gy=clamp(Math.floor((p.y-YOFF)/TS),0,ROWS-1);
  return [gx,gy];
}
function showTileHint(x,y){
  const t=at(x,y); if(!t) return;
  const u=unitAt(x,y), veg=[L("裸地","Bare"),L("草","Grass"),L("若木","Sapling"),L("成木","Mature tree")][t.v]||"—";
  const terrain=t.water?L("水辺","Water"):localize(BIOME[t.c]?.jp||L("土","Soil"));
  const states=[];
  if(t.fruit>0) states.push(L(`実 ${t.fruit}`,`Fruit ${t.fruit}`));
  if(t.fire>0) states.push(L(`火 ${t.fire}`,`Fire ${t.fire}`));
  if(t.ash>0) states.push(L("灰","Ash"));
  $("tileHintTitle").textContent=L("マス詳細","TILE INFO");
  $("tileHint").dataset.x=x; $("tileHint").dataset.y=y;
  $("tileHintCoord").textContent=`X${x+1} Y${y+1}`;
  $("tileHintBody").innerHTML=`
    <span>${L("地形","TERRAIN")}</span><b>${terrain}</b>
    <span>${L("高さ","HEIGHT")}</span><b>${t.h}</b>
    <span>${L("草木","GROWTH")}</span><b>${veg}</b>
    <span>${L("状態","STATE")}</span><b>${states.join(" / ")||L("平常","Clear")}</b>
    <span>${L("肥沃度","FERTILITY")}</span><b>${Math.max(0,Math.round(t.fert||0))}</b>
    <span>${L("ユニット","UNIT")}</span><b>${u?`${u.name} · ${localize(S(u).jp)}`:L("なし","None")}</b>`;
  $("tileHint").hidden=false;
}
cv.addEventListener("pointerdown",ev=>{
  if(G.over) return;
  cv.setPointerCapture(ev.pointerId);
  const p=toWorld(ev), [x,y]=tileFromPoint(p);
  if(G.mode&&G.targetSet){          // 対象を選ぶ
    if(G.targetSet.has(idx(x,y))) confirmTarget(x,y);
    return;
  }
  if(G.phase==="move"&&G.active&&G.moveSet?.has(idx(x,y))&&!unitAt(x,y)){
    const u=G.active, path=pathTo(u,G.moveSet,x,y);
    G.phase="idle"; G.kbPos=null;
    doMove(u,path,()=>{ G.phase="act"; G.moveSet=null; syncActs(); hint("行動をえらぶ"); });
    return;
  }
  const u=unitAt(x,y);
  if(G.phase==="move"&&u===G.active){ G.dragging=u; G.dragFrom=[u.tx,u.ty]; return; }
  if(u){ showCard(u); G.sel=u.id; }
});
cv.addEventListener("pointermove",ev=>{
  const p=toWorld(ev);
  const [x,y]=tileFromPoint(p); showTileHint(x,y);
  if(!G.dragging) return;
  G.dragging.px=clamp(p.x,8,CW-8); G.dragging.py=clamp(p.y,14,CH-4);
});
cv.addEventListener("pointerleave",()=>{ if(G.phase!=="move") $("tileHint").hidden=true; });
function dropUnit(){
  const u=G.dragging; if(!u) return;
  G.dragging=null;
  const p={x:u.px,y:u.py-8};
  const [x,y]=tileFromPoint(p);
  const k=idx(x,y);
  if(G.moveSet&&G.moveSet.has(k)&&!unitAt(x,y)){
    const path=pathTo(u,G.moveSet,x,y);
    G.phase="idle"; G.kbPos=null;
    doMove(u,path,()=>{ G.phase="act"; G.moveSet=null; syncActs(); hint("行動をえらぶ"); });
  } else {
    u.px=unitX(u); u.py=unitY(u);
    if(k!==idx(u.tx,u.ty)) beep(120,.08,"square",.04,-40);
  }
}
cv.addEventListener("pointerup",dropUnit);
cv.addEventListener("pointercancel",dropUnit);

/* ══════════ 行動ボタン ══════════ */
const STUB=document.createElement("div");
const $=id=>document.getElementById(id)||STUB;
const bAtk=$("aAttack"), bSk=$("aSkill"), bEat=$("aEat"), bPoop=$("aPoop"), bWait=$("aWait"), bCancel=$("aCancel");
function hint(s){ $("hint").textContent=localize(s); }
function canAct(){ return G.active && G.active.side==="ape" && (G.phase==="move"||G.phase==="act"); }
function syncActs(){
  const u=G.active, ok=canAct();
  const st=ok?S(u):null;
  const setBtn=(b,label,sub)=>{
    if(!b||!b.querySelector) return;
    const cl=b.querySelector(".cl"), sm=b.querySelector("small");
    if(cl) cl.textContent=label;
    if(sm) sm.textContent=sub;
  };
  setBtn(bAtk,L("こうげき","ATTACK"),"1");
  setBtn(bSk,L("とくぎ","SKILL"),"2");
  setBtn(bEat,L("たべる","EAT"),"3");
  setBtn(bPoop,L("うんち","POOP"),"4");
  setBtn(bWait,L("まつ","WAIT"),"5");
  setBtn(bCancel,L("やめる","CANCEL"),"ESC");
  bAtk.disabled=!ok; bSk.disabled=!ok; bEat.disabled=!ok; bPoop.disabled=!ok; bWait.disabled=!ok;
  bCancel.hidden=!G.mode;
  [bAtk,bSk,bEat,bPoop].forEach(b=>b.classList&&b.classList.remove("on"));
  const skIcon=bSk.querySelector&&bSk.querySelector(".ico canvas");
  const poopIco=bPoop.querySelector&&bPoop.querySelector(".ico canvas");
  if(!ok){
    if(skIcon) poopIcon(skIcon,"big","y");
    if(poopIco) poopIcon(poopIco,"normal","y");
    return;
  }

  bAtk.title = localize(`攻撃範囲：${attackRangeText(st.rng)}`);

  const cost=skillCost(u);
  setBtn(bSk,localize(st.sk.n),`2 · MP ${cost}`);
  if(skIcon) poopIcon(skIcon,st.behavior==="rocket"?"big":"pellet",u.belly[0]||"y");
  const skillNeedsFruit=st.behavior==="rocket"&&u.belly.length<poopNeed(u);
  bSk.disabled = u.mp<cost||skillNeedsFruit;
  bSk.title = localize(skillNeedsFruit ? `${st.sk.n} — 実が ${poopNeed(u)} 個ひつよう` : `${st.sk.n} — ${st.sk.d}`);

  const t=at(u.tx,u.ty);
  bEat.disabled = !(t.v===3&&t.fruit>=1)||u.belly.length>=BELLY_MAX;
  const fruitDot=bEat.querySelector&&bEat.querySelector(".sh-fruit");
  if(fruitDot) fruitDot.style.background=(t.v===3&&t.c)?BIOME[t.c].berry:"#4a3823";
  if(!bEat.disabled) setBtn(bEat,L("たべる","EAT"),`3 · ${localize(FRUIT_BUFF[t.c].jp)}+${FRUIT_BUFF[t.c].gain}`);
  if(u.belly.length>=BELLY_MAX) bEat.title=L("おなかが満杯。うんちをして空きを作る","Belly full. Poop to free a slot");
  else if(bEat.disabled) bEat.title=localize("実のある成木の上で使う");
  else {
    const add=Math.min(FRUIT_BUFF[t.c].gain,Math.max(0,FRUIT_STAT_MAX-fruitStat(u,t.c)));
    bEat.title=localize(add?`${FRUIT_BUFF[t.c].jp}+${add}（現在 ${fruitStat(u,t.c)}/${FRUIT_STAT_MAX}）`:`${FRUIT_BUFF[t.c].jp}は最大（実はおなかに入る）`);
  }

  const need=poopNeed(u), plan=bellyPlan(u);
  bPoop.disabled = u.belly.length<need;
  if(poopIco) poopIcon(poopIco,plan.kind,plan.c);
  setBtn(bPoop,bPoop.disabled?L("うんち","POOP"):plan.name,bPoop.disabled?"4":`4 · ${L("肥料","FERT")}+${plan.fert}`);
  bPoop.title = localize(u.belly.length<need ? `おなかに実が ${need} 個ひつよう` : plan.desc);

  if(G.mode==="attack") bAtk.classList.add("on");
  if(G.mode==="skill") bSk.classList.add("on");
}
function applyLanguage(refresh=true){
  document.documentElement.lang=LANG;
  $("bLang").textContent=LANG==="ja"?"JP / EN":"EN / JP";
  $("lStage").textContent=L("ステージ","STAGE"); $("lRound").textContent=L("ラウンド","ROUND");
  $("lApes").textContent=L("ゴリラ","GORILLAS"); $("lFoes").textContent=L("人族","HUMANS"); $("lObjective").textContent=L("クリア条件","OBJECTIVE");
  $("lGrowth").textContent=L("成長・誕生予報","GROWTH & BIRTH"); $("lLog").textContent=L("戦況記録","BATTLE LOG"); $("lCamp").textContent=L("戦線野営","WAR CAMP");
  $("campCopy").innerHTML=L("<b>達成後：</b>実の強化／次代の編成／森の記録","<b>AFTER CLEAR:</b> fruit boosts / roster / forest record");
  const titleMeta=saveMeta(), titleStage=titleMeta?titleMeta.stage:1;
  $("scTitle").querySelector(".chapter .chapter-name").textContent=chapterName(titleStage)||L("第一章　うんちの目覚め","Chapter I — Poop Awakens");
  $("scTitle").querySelector(".maxim").textContent=L("糞は土となり、森は兵を生む。","Poop becomes soil; the forest raises an army.");
  $("scTitle").querySelector(".title-hint").textContent=L(
    `実を食べ、うんちで土を肥やし、成木を${BIRTH_TREE_TURNS}ターン守れば仲間が生まれる。人族は木を伐り、森を焼く。`,
    `Eat fruit, fertilise the soil with poop, and hold a mature tree for ${BIRTH_TREE_TURNS} turns to gain an ally. The humans fell trees and burn the forest.`);
  const startLabel=$("bStart").querySelector("span")||$("bStart");
  startLabel.textContent=L("あたらしくはじめる","NEW RUN"); $("bStartSilent").textContent=L("音なしではじめる","START SILENTLY");
  $("bAgain").textContent=L("もういちど","TRY AGAIN"); $("bReset").textContent=L("ステージ再開","RESTART STAGE");
  $("scCamp").querySelector(".sub").textContent=L("戦果をひとつ選んで、群れを次のステージへ。","Choose one reward, then lead the troop to the next stage.");
  if(refresh&&typeof G!=="undefined"){
    syncActs(); syncRail(); renderLog();
    const ol=$("order").querySelector(".olab"); if(ol) ol.textContent=L("行動順","TURN ORDER");
    if(G.active) showCard(G.active,!$("card").hidden);
    const th=$("tileHint"); if(!th.hidden) showTileHint(Number(th.dataset.x),Number(th.dataset.y));
    if(G.phase==="move"&&G.active) hint(`${G.active.name} — ${L("矢印キーで移動先を選び、スペースキーで移動","Choose a tile with the arrows, press Space to move")}`);
  }
}
function setTargets(list){
  G.targetSet=new Set(list.map(([x,y])=>idx(x,y)));
}
function primeTarget(){
  if(G.targetSet&&G.targetSet.size&&G.active){
    const u=G.active;
    const list=[...G.targetSet].map(k=>[k%COLS,(k/COLS)|0])
      .sort((a,b)=>(Math.abs(a[0]-u.tx)+Math.abs(a[1]-u.ty))-(Math.abs(b[0]-u.tx)+Math.abs(b[1]-u.ty)));
    G.kbPos=list[0];
    showTileHint(G.kbPos[0],G.kbPos[1]);
  } else G.kbPos=null;
}
function setRange(list){
  G.rangeSet=new Set(list.map(([x,y])=>idx(x,y)));
}
bAtk.onclick=()=>{
  const u=G.active; if(!canAct()) return;
  G.mode="attack";
  const st=APE[u.type];
  const range=tilesInRange(u.tx,u.ty,st.rng);
  setRange(range);
  setTargets(range.filter(([x,y])=>{const o=unitAt(x,y);return o&&o.side!==u.side;}));
  primeTarget(); syncActs();
  hint(`攻撃範囲：${attackRangeText(st.rng)}${G.targetSet.size?" — 金色の敵をえらぶ":" — 今は敵なし"}`);
};
bSk.onclick=()=>{
  const u=G.active; if(!canAct()) return;
  const st=APE[u.type];
  if(["dash","stamp","stomp"].includes(st.behavior)){
    G.mode=null; G.rangeSet=null; G.targetSet=null; G.phase="idle"; actionSkill(u); return;
  }
  G.mode="skill";
  if(st.behavior==="rocket"){
    const range=tilesInRange(u.tx,u.ty,3).concat([[u.tx,u.ty]]);
    setRange(range); setTargets(range);
  }
  if(st.behavior==="rain"){
    const range=tilesInRange(u.tx,u.ty,3).concat([[u.tx,u.ty]]);
    setRange(range); setTargets(range);
  }
  if(st.behavior==="stone"){
    const range=tilesInRange(u.tx,u.ty,4);
    setRange(range);
    setTargets(range.filter(([x,y])=>{const o=unitAt(x,y);return o&&o.side!==u.side;}));
  }
  primeTarget(); syncActs(); hint(st.sk.n+" — "+st.sk.d);
};
bEat.onclick=()=>{ if(!canAct())return; G.phase="idle"; G.mode=null; G.rangeSet=null; G.targetSet=null; actionEat(G.active); };
bPoop.onclick=()=>{ if(!canAct())return; G.phase="idle"; G.mode=null; G.rangeSet=null; G.targetSet=null; syncActs(); actionPoop(G.active); };
bWait.onclick=()=>{ if(!canAct())return; G.phase="idle"; endAct(G.active); };
bCancel.onclick=()=>{ G.mode=null; G.rangeSet=null; G.targetSet=null; G.kbPos=null; syncActs(); hint("行動をえらぶ"); };
function confirmTarget(x,y){
  const u=G.active, m=G.mode;
  G.mode=null; G.rangeSet=null; G.targetSet=null; G.phase="idle"; syncActs();
  if(m==="attack") actionAttack(u,x,y);
  else if(m==="skill") actionSkill(u,x,y);
}
addEventListener("keydown",e=>{
  if(!canAct()) return;
  const arrows={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  // スペースキー（Enterも可）で、いま選んでいるマスを決定する
  const confirmKey = e.key===" "||e.code==="Space"||e.key==="Spacebar"||e.key==="Enter";
  if(G.phase==="move"&&!G.mode&&arrows[e.key]){
    e.preventDefault();
    const u=G.active, [dx,dy]=arrows[e.key], [x,y]=G.kbPos||[u.tx,u.ty];
    const nx=x+dx, ny=y+dy, home=nx===u.tx&&ny===u.ty;
    if((home||G.moveSet?.has(idx(nx,ny)))&&(!unitAt(nx,ny)||home)){
      G.kbPos=[nx,ny]; showTileHint(nx,ny); hint(L("矢印キーで移動先を選び、スペースキーで移動","Choose a tile with the arrows, press Space to move"));
    } else beep(120,.05,"square",.025,-30);
    return;
  }
  if(G.phase==="move"&&!G.mode&&confirmKey){
    e.preventDefault();
    const u=G.active, [x,y]=G.kbPos||[u.tx,u.ty];
    const path=x===u.tx&&y===u.ty?[]:pathTo(u,G.moveSet,x,y);
    G.phase="idle"; G.kbPos=null;
    doMove(u,path,()=>{ G.phase="act"; G.moveSet=null; syncActs(); hint("行動をえらぶ"); });
    return;
  }
  if(G.mode&&G.targetSet&&G.targetSet.size){
    const list=[...G.targetSet].map(k=>[k%COLS,(k/COLS)|0]);
    if(arrows[e.key]){
      e.preventDefault();
      const [dx,dy]=arrows[e.key];
      const cur=G.kbPos&&G.targetSet.has(idx(G.kbPos[0],G.kbPos[1]))?G.kbPos:null;
      const from=cur||[G.active.tx,G.active.ty];
      let best=null,bs=1e9;
      for(const [x,y] of list){
        if(cur&&x===cur[0]&&y===cur[1]) continue;
        const vx=x-from[0], vy=y-from[1], along=vx*dx+vy*dy;
        if(along<=0) continue;
        const s=along+Math.abs(vx*dy-vy*dx)*3;
        if(s<bs){ bs=s; best=[x,y]; }
      }
      if(!best) best=list[0];
      G.kbPos=best; showTileHint(best[0],best[1]);
      hint(L("矢印キーで対象を選び、スペースキーで決定","Pick a target with the arrows, Space to confirm"));
      beep(520,.03,"square",.02);
      return;
    }
    if(confirmKey){
      e.preventDefault();
      const p=G.kbPos&&G.targetSet.has(idx(G.kbPos[0],G.kbPos[1]))?G.kbPos:list[0];
      G.kbPos=null; confirmTarget(p[0],p[1]);
      return;
    }
  }
  const hot={"1":bAtk,"2":bSk,"3":bEat,"4":bPoop,"5":bWait}[e.key];
  if(hot&&!hot.disabled){ e.preventDefault(); hot.click(); return; }
  if(confirmKey){ e.preventDefault(); bWait.click(); }
  if(e.key==="Escape") bCancel.click();
});

/* ══════════ HUD ══════════ */
function syncRail(){
  const s=stageDef(), o=s.objective, fs=forestStats();
  const idText=s.id||`${G.stage}`;
  $("tStage").textContent=idText;
  $("tStageName").textContent=stageName(G.stage);
  $("tStage").title=`${chapterName(G.stage)} ${stageName(G.stage)}`.trim();
  const r=Math.min(G.round,s.rounds);
  $("tRound").textContent=`ROUND ${r} / ${s.rounds}`;
  const pips=$("roundPips");
  if(pips&&pips.childElementCount!==s.rounds){
    pips.innerHTML=""; for(let i=0;i<s.rounds;i++) pips.appendChild(document.createElement("i"));
  }
  if(pips) [...pips.children].forEach((el,i)=>el.className=i<r?"on":"");
  $("tObjective").textContent=o.type==="wipe"?L("人族をすべて倒す","Eliminate every raider")
    :o.type==="forest"?L(`森を ${o.target} まで育てる（今 ${fs.value}）`,`Grow the forest to ${o.target} (now ${fs.value})`)
    :o.type==="births"?L(`この面で ${o.target} 匹産む（今 ${G.stageBorn}）`,`Birth ${o.target} allies here (now ${G.stageBorn})`)
    :L(`${s.rounds}ラウンド生存する`,`Survive ${s.rounds} rounds`);
  $("tApes").textContent=G.units.filter(u=>u.alive&&u.side==="ape").length;
  $("tFoes").textContent=G.units.filter(u=>u.alive&&u.side!=="ape").length;
  $("tForest").textContent=fs.value;

  const u=G.active?.alive?G.active:null;
  $("turnName").textContent=u?u.name:L("準備中","STAND BY");
  $("turnType").textContent=u?(u.side==="ape"?localize(S(u).jp):L(`人族 — ${localize(S(u).act)}`,`HUMAN — ${localize(S(u).act)}`)):"—";
  paintSprite($("activePic"),u?unitSprite(u):SPR.u_normal);
  $("activePic").style.opacity=u?"1":".3";
  $("turnHp").textContent=u?`${Math.max(0,Math.ceil(u.hp))}`:"—";
  $("turnHp").innerHTML=u?`${Math.max(0,Math.ceil(u.hp))}<span style="color:#6d5a42">/${u.maxhp}</span>`:"—";
  $("turnHpBar").style.cssText=`width:${u?Math.round(clamp(u.hp/u.maxhp,0,1)*100):0}%;background:${u&&u.hp<=u.maxhp*.4?"#c9452e":"#7fae2f"}`;
  $("turnMp").innerHTML=u?.side==="ape"?`${u.mp}<span style="color:#6d5a42">/${u.maxmp}</span>`:"—";
  $("turnMpBar").style.cssText=`width:${u?.side==="ape"?Math.round(clamp(u.mp/u.maxmp,0,1)*100):0}%;background:#68d0e0`;

  const row=$("bellyRow");
  if(row){
    row.innerHTML="";
    if(u&&u.side==="ape"){
      for(let i=0;i<BELLY_MAX;i++){
        const c=u.belly[i], el=document.createElement("i");
        el.style.background=c?BIOME[c].berry:"#0b0805";
        el.style.boxShadow=`0 0 0 2px ${i===0&&c?"#e8b23c":"#3a2c1c"}`;
        row.appendChild(el);
      }
    }
  }
  $("bellyHint").textContent=u&&u.side==="ape"?bellyPlan(u).hint:"";

  $("mapActiveName").textContent=u?L(`${u.name}　行動中`,`${u.name} ACTIVE`):L("準備中","STAND BY");
  $("activeKind").textContent=u?(u.side==="ape"?L("ユニット詳細","Unit detail"):L("人族","Human")):L("ユニット詳細","Unit detail");

  const banner=$("intentBanner");
  if(banner&&banner.style){
    const n=G.intent?G.intent.size:0;
    // 記法の説明バナー。脅威が現れた直後だけ出して、あとは盤面の赤枠にまかせる
    if(n&&!G.intentSeen){ G.intentSeen=true; G.intentBannerUntil=performance.now()+6500; }
    if(!n) G.intentSeen=false;
    banner.hidden=!(INTENT_ON&&n>0&&!G.over&&!G.intermission&&performance.now()<(G.intentBannerUntil||0));
    if(n){
      const kinds=new Set([...G.intent.values()].map(v=>v.kind));
      const list=[...kinds].map(k=>LANG==="en"?INTENT_EN[k]:INTENT_JA[k]).join(LANG==="en"?" / ":"・");
      $("intentText").textContent=L(`赤枠のマスが狙われている — ${list}`,`Red frames are targeted — ${list}`);
    }
  }
  syncBirth();
}
function syncBirth(){
  const apes=G.units.filter(u=>u.alive&&u.side==="ape").length;
  const rows=[];
  for(const c of COLORS){
    const trees=matureTrees(c);
    const age=trees.length?Math.max(...trees.map(t=>t.treeAge)):0;
    const type=nextBirthType(c);
    const left=Math.max(0,BIRTH_TREE_TURNS-age);
    rows.push({c,trees:trees.length,age,left,type,best:trees.length?trees.reduce((a,b)=>a.treeAge>=b.treeAge?a:b):null});
  }
  rows.sort((a,b)=>(a.trees?0:1)-(b.trees?0:1)||a.left-b.left);
  const box=$("birthHud");
  if(box&&box.replaceChildren){
    box.replaceChildren();
    for(const r of rows.slice(0,2)){
      const row=document.createElement("div");
      row.className="birth-row"+(r===rows[0]&&r.trees?"":" dim");
      const label=document.createElement("span");
      const where=L(`${BIOME[r.c].jp}の成木`,`${BIOME[r.c].jp} tree`);
      if(!r.type) label.textContent=`${where} — ${L("未解放","locked")}`;
      else if(!r.trees) label.textContent=`${where} — ${L("成木が必要","needs a mature tree")}`;
      else if(apes>=MAX_APES) label.textContent=`${where} — ${L(`仲間上限 ${MAX_APES}匹`,`ally cap ${MAX_APES}`)}`;
      else if(r.left<=0) label.innerHTML=`${where} <em>${L("次ラウンド","next round")}</em>`;
      else label.textContent=`${where} ${r.left}${L("ターン"," turns")}`;
      row.appendChild(label);
      if(r.type) row.appendChild(spriteEl(SPR["u_"+r.type]||SPR.u_normal,r===rows[0]&&r.trees?34:28));
      box.appendChild(row);
    }
  }
  const fs=forestStats();
  const meta=$("herdMeta");
  if(meta&&meta.replaceChildren){
    meta.replaceChildren();
    const a=document.createElement("span"); a.textContent=L(`群れ ${apes}/${MAX_APES}`,`HERD ${apes}/${MAX_APES}`);
    const sep=document.createElement("span"); sep.style.color="#4a3823"; sep.textContent="|";
    const b=document.createElement("span");
    b.textContent=fs.burning?L(`火 ${fs.burning}マス`,`FIRE ${fs.burning}`):L(`成木 ${fs.mature}本`,`${fs.mature} MATURE`);
    if(fs.burning) b.style.color="#c9452e";
    meta.append(a,sep,b);
    const wave=stageDef().waves[G.waveIx];
    if(wave){
      const sep2=document.createElement("span"); sep2.style.color="#4a3823"; sep2.textContent="|";
      const w=document.createElement("span"); w.style.color="#ff8a72";
      const inRounds=Math.max(0,wave.r-G.round);
      w.textContent=inRounds
        ? L(`${inRounds}R後 ${localize(FOE[wave.kind].jp)}×${wave.n}`,`+${inRounds}R ${localize(FOE[wave.kind].jp)}×${wave.n}`)
        : L(`増援 ${localize(FOE[wave.kind].jp)}×${wave.n}`,`WAVE ${localize(FOE[wave.kind].jp)}×${wave.n}`);
      meta.append(sep2,w);
    }
  }
  $("nextEventName").textContent=L("森の成長","FOREST GROWTH");
  $("nextEventMeta").textContent=L(`成木を${BIRTH_TREE_TURNS}手守る`,`PROTECT TREE ${BIRTH_TREE_TURNS} TURNS`);
}
function syncOrder(){
  recomputeIntent();
  const box=$("order");
  const sim=G.units.filter(u=>u.alive).map(u=>({u,ct:u.ct}));
  const out=[];
  for(let g=0;g<600&&out.length<5;g++){
    const rdy=sim.filter(s=>s.ct>=100).sort((a,b)=>b.ct-a.ct);
    if(rdy.length){ out.push(rdy[0].u); rdy[0].ct-=100; }
    else for(const s of sim) s.ct+=S(s.u).spd/4;
  }
  if(box&&box.replaceChildren){
    box.replaceChildren();
    out.forEach((u,i)=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="oc"+(i===0?" now":"")+(u.side!=="ape"?" foe":"");
      b.style.opacity=String(i===0?1:Math.max(.4,1-i*.16));
      const nm=document.createElement("span"); nm.textContent=u.name;
      const cell=document.createElement("div");
      cell.appendChild(spriteEl(unitSprite(u),i===0?41:26));
      b.append(nm,cell);
      b.title=u.name;
      b.onclick=()=>openCardFor(u);
      box.appendChild(b);
    });
  }
  syncRail();
}
function pb(v,col){ return `<span class="pb"><i style="width:${Math.round(clamp(v,0,1)*100)}%;background:${col}"></i></span>`; }
function showCard(u,open=true){
  if(!u||!u.alive) return;
  G.cardUnit=u.id;
  paintSprite($("cPic"),unitSprite(u));
  const st=S(u), t=at(u.tx,u.ty);
  $("cName").textContent=u.name;
  $("cType").textContent = u.side==="ape"
    ? L(`${localize(st.jp)}／${localize(st.from)}生まれ`,`${localize(st.jp)} / ${localize(st.from)}-born`)
    : L(`人族 — ${localize(st.act)}`,`Human — ${localize(st.act)}`);
  $("cHp").innerHTML=`${Math.max(0,Math.ceil(u.hp))}<span style="color:#6d5a42">/${u.maxhp}</span>`;
  $("cHpBar").style.width=Math.round(clamp(u.hp/u.maxhp,0,1)*100)+"%";
  const hasMp=u.side==="ape"&&u.maxmp>0;
  $("cMp").innerHTML=hasMp?`${u.mp}<span style="color:#6d5a42">/${u.maxmp}</span>`:"—";
  $("cMpBar").style.width=hasMp?Math.round(clamp(u.mp/u.maxmp,0,1)*100)+"%":"0";

  $("cBars").innerHTML=
    `<div><span>MOVE ${L("移動","MOVE")}</span><b>${st.move}</b></div>`+
    `<div><span>JUMP ${L("段差","STEP")}</span><b>${st.jump}</b></div>`+
    `<div><span>RANGE ${L("射程","RANGE")}</span><b>${st.rng}</b></div>`+
    `<div><span>${L("いま の 高さ","HEIGHT")}</span><b>${t?t.h:0}</b></div>`;

  const growth=$("cGrowth"), wrap=$("cGrowthWrap");
  if(u.side==="ape"){
    if(wrap&&wrap.style) wrap.style.display="";
    $("cGrowthLabel").textContent=L(`FRUIT GROWTH — 実による強化（上限${FRUIT_STAT_MAX}）`,`FRUIT GROWTH — cap ${FRUIT_STAT_MAX}`);
    const rows=[
      {c:"r",label:L("こうげき","Attack"),value:st.atk},
      {c:"b",label:L("最大MP","Max MP"),value:u.maxmp},
      {c:"y",label:L("すばやさ","Speed"),value:st.spd},
    ];
    growth.innerHTML=rows.map(r=>{
      const pct=Math.round(clamp(r.value/FRUIT_STAT_MAX,0,1)*100);
      return `<div class="growth"><i class="sw" style="background:${BIOME[r.c].berry}"></i>`+
        `<span class="gl">${r.label}</span>`+
        `<span class="gbar"><i style="width:${pct}%;background:${PCOL[r.c].l}"></i></span>`+
        `<b>${r.value}<small>/${FRUIT_STAT_MAX}</small></b>`+
        `<span class="gain">${L(`${BIOME[r.c].jp}の実 +${FRUIT_BUFF[r.c].gain}`,`${r.c.toUpperCase()} fruit +${FRUIT_BUFF[r.c].gain}`)}</span></div>`;
    }).join("");
  } else { if(wrap&&wrap.style) wrap.style.display="none"; if(growth) growth.innerHTML=""; }

  const skillBox=$("cSkillBox");
  if(u.side==="ape"){
    if(skillBox&&skillBox.style) skillBox.style.display="";
    $("cSkillLabel").textContent="SKILL";
    $("cSkillCost").textContent=`MP ${skillCost(u)}`;
    $("cSkillName").textContent=localize(st.sk.n);
    $("cAb").textContent=localize(st.sk.d);
  } else {
    if(skillBox&&skillBox.style) skillBox.style.display="";
    $("cSkillLabel").textContent=L("この人族の行動","BEHAVIOUR");
    $("cSkillCost").textContent=L(`射程 ${st.rng}`,`RANGE ${st.rng}`);
    $("cSkillName").textContent=localize(st.act);
    let plan=null; try{ plan=foePlan(u); }catch(e){}
    $("cAb").textContent=plan
      ? L(`次の行動：${INTENT_JA[plan.want]}（${plan.dest[0]},${plan.dest[1]} へ移動）`,`Next: ${INTENT_EN[plan.want]} (moves to ${plan.dest[0]},${plan.dest[1]})`)
      : L("次の行動：待機","Next: hold position");
  }

  const bellyBox=$("cBellyBox");
  if(u.side==="ape"){
    if(bellyBox&&bellyBox.style) bellyBox.style.display="";
    $("cBellyLabel").textContent=L("BELLY — 左から出る","BELLY — first out on the left");
    const slots=[];
    for(let i=0;i<BELLY_MAX;i++){
      const c=u.belly[i];
      slots.push(c
        ? `<div class="belly-slot${i===0?" first":""}"><i style="background:${BIOME[c].berry}"></i></div>`
        : `<div class="belly-slot empty"></div>`);
    }
    $("cBelly").innerHTML=slots.join("");
    const plan=bellyPlan(u);
    poopIcon($("cNextPoop"),plan.kind,plan.c);
    $("cNextPoopName").textContent=L(`次は ${plan.name}`,`Next: ${plan.name}`);
    $("cNextPoopDesc").textContent=plan.desc;
  } else { if(bellyBox&&bellyBox.style) bellyBox.style.display="none"; $("cBelly").innerHTML=""; }

  const traits = u.side==="ape"
    ? (u.traits.length?u.traits.map(k=>`<em style="font-style:normal;color:#e8b23c">${TRAITS[k].jp}</em>　${TRAITS[k].d}`).join("<br>"):L("特性なし","No traits"))
    : `<em style="font-style:normal;color:#c9452e">${localize(st.act)}</em>　${L(`攻撃範囲 ${attackRangeText(st.rng)}`,`Range ${attackRangeText(st.rng)}`)}`;
  $("cTr").innerHTML=localize(traits);

  const herd=$("cHerd");
  if(herd&&herd.replaceChildren){
    herd.replaceChildren();
    for(const o of cardCycleList()){
      const d=document.createElement("button");
      d.type="button";
      d.className="herd-pick"+(o.id===u.id?" on":"");
      d.title=o.name;
      d.appendChild(spriteEl(unitSprite(o),30));
      d.onclick=()=>openCardFor(o);
      herd.appendChild(d);
    }
  }
}
/* 行動順や群れアイコンから開くとき用 */
function openCardFor(u){
  showCard(u,false);
  const UI=window.POOPTACT_UI;
  if(UI&&UI.state&&UI.state.ui!=="details") UI.setState({ui:"details"});
}
/* 詳細オーバーレイの Q・E 用。味方を先に、そのあと人族 */
function cardCycleList(){
  const apes=G.units.filter(u=>u.alive&&u.side==="ape");
  const foes=G.units.filter(u=>u.alive&&u.side!=="ape");
  return [...apes,...foes];
}
function cycleCard(dir){
  const list=cardCycleList();
  if(!list.length) return;
  const i=list.findIndex(u=>u.id===G.cardUnit);
  const next=list[((i<0?0:i+dir)%list.length+list.length)%list.length];
  showCard(next,false);
  SFX.hit&&beep(520,.03,"square",.02);
}
function renderLog(){
  const box=$("log"); box.innerHTML="";
  for(const l of G.log){
    const d=document.createElement("div"); d.className="lg";
    d.innerHTML=`<i style="background:${l.col}"></i>`;
    d.appendChild(document.createTextNode(localize(l.msg)));
    box.appendChild(d);
  }
}

/* ══════════ 終了 ══════════ */
function finish(win,title,sub){
  if(G.over) return;
  G.over=win?"win":"lose";
  clearSave(); PTE("end",{win});
  const et=$("endTitle");
  et.textContent=win?"CLEAR":"GAME OVER";
  et.className="big "+(win?"win":"lose");
  $("endSub").innerHTML=`<em>${localize(title)}</em><br>${localize(sub)}`;
  $("endTally").innerHTML=localize(`
    <span>到達ステージ</span><b>${G.stage}/${STAGE_COUNT}</b>
    <span>最終ラウンド</span><b>${Math.min(G.round,stageDef().rounds)}</b>
    <span>育てた森</span><b>${Math.round(forestValue())}</b>
    <span>したうんち</span><b>${G.pooCount}</b>
    <span>きんのうんち</span><b>${G.goldCount}</b>
    <span>生まれた仲間</span><b>${G.born}</b>
    <span>死んだ仲間</span><b>${G.dead}</b>
    <span>倒した人族</span><b>${G.kills}</b>`);
  $("endTally").innerHTML+=localize(`<span>獲得した戦果</span><b>${G.progress.picks.length}</b>`);
  $("endObit").textContent = G.obits.length
    ? localize("訃報 — " + G.obits.slice(-3).map(o=>`${o.name}（${TRAITS[o.traits[0]].jp}）${o.cause}`).join(" ／ "))
    : "";
  $("scEnd").hidden=false;
  fit();
  win?SFX.born():SFX.die();
}

/* ══════════ 起動 ══════════ */
(function rules(){
  const box=$("ruleBox");
  const list=[
    {spr:"u_normal", b:"実で強化", t:"赤:攻撃　青:最大MP<br>黄:素早さ／3色で金"},
    {spr:"u_guardian",b:"成木が命をつなぐ", t:`成木が${BIRTH_TREE_TURNS}ターン残ると<br>同色の仲間が生まれる`},
    {spr:"u_jikon",  b:"ゴリラジコン", t:"殺されたゴリラは<br>敵になる"},
  ];
  for(const r of list){
    const d=document.createElement("div"); d.className="rule";
    const c=document.createElement("canvas"); c.width=24;c.height=26;
    const g=c.getContext("2d"); g.imageSmoothingEnabled=false;
    const s=SPR[r.spr]; g.drawImage(s,((24-s.width)/2)|0,((26-s.height)/2)|0);
    const p=document.createElement("div"); p.innerHTML=`<b>${r.b}</b>${r.t}`;
    d.append(c,p); box.appendChild(d);
  }
})();
function fit(){
  const st=document.getElementById("frameArea")||$("battlePanel"), fr=$("frame");
  const aw=st.clientWidth, ah=st.clientHeight;
  if(!aw||!ah) return;
  let s=Math.min(aw/CW,ah/CH);
  if(PIXEL_PERFECT) s=Math.max(1,Math.floor(s));
  const w=Math.round(CW*s), h=Math.round(CH*s);
  cv.style.width=w+"px"; cv.style.height=h+"px";
  fr.style.width=w+"px"; fr.style.height=h+"px";
  fr.style.transform="none";
}
function hideScreens(){ $("scTitle").hidden=true; $("scEnd").hidden=true; $("scCamp").hidden=true; }
function clearSave(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} }
function hasSave(){ return !!saveMeta(); }
function saveRun(){
  try{
    if(!G||G.over||G.intermission) return false;
    const d={v:2,campaign:CAMPAIGN.campaignId,difficulty:CAMPAIGN.difficulty.id,nextId,clockTicks:G.clockTicks||0,keys:{}};
    for(const k of STAGE_SNAPSHOT_KEYS) d.keys[k]=G[k];
    localStorage.setItem(SAVE_KEY,JSON.stringify(d));
    return true;
  }catch(e){ return false; }
}
function saveMeta(){
  try{
    const d=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");
    if(!d||d.v!==2||d.campaign!==CAMPAIGN.campaignId||d.difficulty!==CAMPAIGN.difficulty.id) return null;
    const k=d.keys||{};
    return {stage:k.stage||1,round:k.round||1,stageName:stageName(k.stage||1),
      apes:(k.units||[]).filter(u=>u.alive&&u.side==="ape").length};
  }catch(e){ return null; }
}
function loadRun(){
  try{
    const d=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");
    if(!d||d.v!==2||d.campaign!==CAMPAIGN.campaignId||d.difficulty!==CAMPAIGN.difficulty.id) return false;
    newGame(false);
    for(const k of STAGE_SNAPSHOT_KEYS) if(k in d.keys) G[k]=d.keys[k];
    G.clockTicks=d.clockTicks||0;
    nextId=Math.max(1,d.nextId||1,...(G.units||[]).map(u=>u.id+1));
    Object.assign(G,{active:null,phase:"idle",mode:null,moveSet:null,rangeSet:null,targetSet:null,kbPos:null,
      over:null,anim:null,queue:[],fx:[],poops:[],floats:[],shake:0,sel:null,dragging:null,intermission:false,rewardOptions:[]});
    for(const u of G.units){ u.px=unitX(u); u.py=unitY(u); u.acted=false; }
    captureStageStart(); hideScreens(); syncOrder(); syncActs(); renderLog(); fit();
    logMsg("#e8b23c",L("記録から再開した","Run restored"));
    setTimeout(nextTurn,220);
    return true;
  }catch(e){ return false; }
}
addEventListener("resize",fit);
function start(){
  $("scTitle").hidden=true; $("scEnd").hidden=true; $("scCamp").hidden=true;
  newGame(); syncActs(); fit();
}
$("bStart").onclick=()=>{ startMusic(); $("bSound").textContent="♪ ON"; start(); };
$("bStartSilent").onclick=()=>{ snd=false; stopMusic(); $("bSound").textContent="♪ OFF"; start(); };
$("bAgain").onclick=()=>{ start(); if(snd&&!musicTimer) startMusic(); };
let resetArmed=false, resetTimer=0;
$("bReset").onclick=()=>{
  if(!resetArmed){
    resetArmed=true; $("bReset").textContent=L("もう一度押す","PRESS AGAIN");
    hint(L("もう一度押すと、獲得済みの解放を残して現在ステージを再開","Press again to restart this stage; unlocks are kept"));
    clearTimeout(resetTimer); resetTimer=setTimeout(()=>{resetArmed=false;$("bReset").textContent=L("ステージ再開","RESTART STAGE");},2400);
    return;
  }
  resetArmed=false; clearTimeout(resetTimer); restartStage();
};
$("bLang").onclick=()=>{
  LANG=LANG==="ja"?"en":"ja";
  try{ localStorage.setItem("poopulation-lang",LANG); }catch{}
  applyLanguage();
};
$("bCampGo").onclick=()=>{ if(G&&G.intermission) chooseReward(G.rewardFocus??0); };
$("bSound").onclick=ev=>{
  snd=!snd; ev.currentTarget.textContent=snd?"♪ ON":"♪ OFF";
  if(snd){ startMusic(); beep(660,.06); } else stopMusic();
};

window.POOPTACT={ get state(){return G;}, get campaign(){return CAMPAIGN;}, start, SPR, APE, FOE, nextTurn, fit, saveRun, loadRun, hasSave, clearSave, saveMeta,
  get lang(){return LANG;},
  cycleCard, openCardFor,
  setIntentVisible(v){ INTENT_ON=v!==false; recomputeIntent(); syncRail(); },
  paintTitleArt(){
    const crest=document.getElementById("titleCrest");
    if(crest) poopIcon(crest,"gold","y");
    const cv=document.getElementById("titleCv");
    if(cv&&typeof G!=="undefined"&&G&&G.map){
      const g=cv.getContext("2d"); g.imageSmoothingEnabled=false;
      g.drawImage(document.getElementById("cv"),0,0);
    }
  },
  get paused(){return PAUSED;},
  setPaused(v){
    PAUSED=!!v;
    if(PAUSED) stopMusic();
    else if(snd&&BGMV>0&&G&&!G.over&&$("scTitle").hidden) startMusic();
  },
  setVolumes(o){
    if(o.sfx!=null) SFXV=Math.max(0,Math.min(1,o.sfx));
    if(o.bgm!=null){
      BGMV=Math.max(0,Math.min(1,o.bgm));
      if(BGMV<=0) stopMusic(); else if(snd&&!musicTimer&&G&&!G.over) startMusic();
    }
    snd=SFXV>0||BGMV>0;
    $("bSound").textContent=snd?"\u266a ON":"\u266a OFF";
  },
  setPixelPerfect(v){ PIXEL_PERFECT=!!v; fit(); },
  restartStage,
  previewCamp(){ if($("scTitle").hidden===false) start(); openCamp(); },
  previewPoop(kind="normal"){
    if($("scTitle").hidden===false) start();
    const u=G.units.find(v=>v.alive&&v.side==="ape"); if(!u)return;
    G.active=u; G.phase="idle"; u.belly=kind==="gold"?["y","r","b"]:["y"]; actionPoop(u,kind);
  },
  auto(n){ // 動作確認：n手ぶん、味方も自動で動かす
    for(let k=0;k<n&&!G.over;k++){
      const u=G.active;
      if(!u){ nextTurn(); continue; }
      if(u.side!=="ape"){ return "foe-turn"; }
      const st=APE[u.type], t=at(u.tx,u.ty);
      const foe=G.units.find(o=>o.alive&&o.side!=="ape"&&inRange(u.tx,u.ty,o.tx,o.ty,st.rng));
      if(foe) actionAttack(u,foe.tx,foe.ty);
      else if(t.v===3&&t.fruit>=1) actionEat(u);
      else if(u.belly.length>=poopNeed(u)) actionPoop(u);
      else endAct(u);
      return "acted";
    }
    return "done";
  }
};

applyLanguage(false);
newGame(false);
applyLanguage();
let last=performance.now();
const titleCv=document.getElementById("titleCv");
const titleCtx=titleCv?titleCv.getContext("2d"):null;
if(titleCtx) titleCtx.imageSmoothingEnabled=false;
poopIcon(document.getElementById("titleCrest"),"gold","y");
function frame(now){
  const dt=Math.min(.05,(now-last)/1000); last=now;
  if(!PAUSED) update(dt);
  draw();
  if(titleCtx&&!$("scTitle").hidden) titleCtx.drawImage(cv,0,0);   // タイトルの背景＝実際の戦場
  const ib=$("intentBanner");
  if(ib&&!ib.hidden&&performance.now()>=(G?.intentBannerUntil||0)) ib.hidden=true;
  requestAnimationFrame(frame);
}
fit(); requestAnimationFrame(frame);
document.addEventListener("visibilitychange",()=>{ last=performance.now(); });
};
