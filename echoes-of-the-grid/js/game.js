"use strict";
// ===================== Echoes of the Grid =====================

// ---------- Constantes ----------
const W = 800, H = 640, OY = 40, T = 40, COLS = 20, ROWS = 15;
const LOOP_TICKS = 900;              // 15 s à 60 ticks/s
const SPEED = 3, HALF = 11, MAX_GHOSTS = 6;
const UP = 1, DOWN = 2, LEFT = 4, RIGHT = 8;
const COLORS = { a: "#ffd23f", b: "#3dff8c", c: "#ff8a3d", d: "#b57bff" };
const FONT = "'Courier New', Courier, monospace";

// ---------- Textes ----------
const I18N = {
  en: {
    tagline: "Cooperate with your own past", play: "PLAY", cont: "CONTINUE", levels: "LEVEL SELECT",
    sound: "SOUND", on: "ON", off: "OFF", language: "LANGUAGE", langName: "ENGLISH", back: "BACK",
    level: "LEVEL", loop: "LOOP", clones: "CLONES", start: "START", resume: "RESUME", restart: "RESTART",
    menu: "MENU", paused: "PAUSED", complete: "SYSTEM INFILTRATED", loopsUsed: "Loops used", best: "Best",
    next: "NEXT LEVEL", dead: "SIGNAL LOST", ad: "ADVERTISEMENT", adWait: "The game resumes shortly…",
    endTitle: "MISSION ACCOMPLISHED", endText: "You infiltrated the whole grid. Thanks for playing!",
    locked: "LOCKED", loopBtn: "LOOP",
    keys: "WASD / ZQSD / ARROWS: move   ·   SPACE: end loop   ·   R: restart   ·   P: pause",
    touch: "Left pad: move   ·   LOOP button: end the loop and send your clone",
    how: "Your clone replays your last run. Plates hold doors open. Don't let clones die!",
    enter: "Press ENTER or tap START",
  },
  fr: {
    tagline: "Coopère avec ton propre passé", play: "JOUER", cont: "CONTINUER", levels: "CHOIX DU NIVEAU",
    sound: "SON", on: "OUI", off: "NON", language: "LANGUE", langName: "FRANÇAIS", back: "RETOUR",
    level: "NIVEAU", loop: "BOUCLE", clones: "CLONES", start: "COMMENCER", resume: "REPRENDRE", restart: "RECOMMENCER",
    menu: "MENU", paused: "PAUSE", complete: "SYSTÈME INFILTRÉ", loopsUsed: "Boucles utilisées", best: "Record",
    next: "NIVEAU SUIVANT", dead: "SIGNAL PERDU", ad: "PUBLICITÉ", adWait: "Le jeu reprend dans un instant…",
    endTitle: "MISSION ACCOMPLIE", endText: "Tu as infiltré toute la grille. Merci d'avoir joué !",
    locked: "VERROUILLÉ", loopBtn: "BOUCLE",
    keys: "ZQSD / WASD / FLÈCHES : bouger   ·   ESPACE : finir la boucle   ·   R : recommencer   ·   P : pause",
    touch: "Croix à gauche : bouger   ·   Bouton BOUCLE : finir la boucle et envoyer ton clone",
    how: "Ton clone rejoue ta dernière boucle. Les plaques gardent les portes ouvertes. Ne laisse pas mourir tes clones !",
    enter: "Appuie sur ENTRÉE ou touche COMMENCER",
  },
};

// ---------- Sauvegarde + SDK CrazyGames (sans effet hors CrazyGames) ----------
const CG = {
  ready: false, playing: false,
  get sdk() { return window.CrazyGames && window.CrazyGames.SDK; },
  async init() {
    try { if (this.sdk) { await this.sdk.init(); this.ready = true; } } catch (e) { console.warn("CrazyGames SDK unavailable", e); }
  },
  call(fn) { if (this.ready) { try { return fn(this.sdk); } catch (e) { console.warn(e); } } },
  loading(on) { this.call(s => on ? s.game.loadingStart() : s.game.loadingStop()); },
  gameplay(on) {
    if (on === this.playing) return;
    this.playing = on;
    this.call(s => on ? s.game.gameplayStart() : s.game.gameplayStop());
  },
  happy() { this.call(s => s.game.happytime()); },
  save(k, v) { try { this.call(s => s.data.setItem(k, v)); } catch (e) {} try { localStorage.setItem(k, v); } catch (e) {} },
  load(k) {
    try { const v = this.call(s => s.data.getItem(k)); if (v !== null && v !== undefined) return v; } catch (e) {}
    try { return localStorage.getItem(k); } catch (e) { return null; }
  },
  midgame(done) {
    if (!this.ready) return done();
    let finished = false;
    const end = () => { if (!finished) { finished = true; Snd.setSuspended(false); done(); } };
    try {
      this.sdk.ad.requestAd("midgame", {
        adStarted() { Snd.setSuspended(true); },
        adFinished: end, adError: end,
      });
    } catch (e) { end(); }
  },
};

const save = { unlocked: 0, best: {}, lang: null, muted: false };
function loadSave() {
  try {
    const raw = CG.load("ecg_save");
    if (raw) Object.assign(save, JSON.parse(raw));
  } catch (e) {}
  if (!save.lang) save.lang = (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
  save.unlocked = Math.max(0, Math.min(save.unlocked | 0, LEVELS.length - 1));
  Snd.setMuted(!!save.muted);
}
function writeSave() { CG.save("ecg_save", JSON.stringify(save)); }
const t = k => I18N[save.lang][k];
const loc = o => o[save.lang];

// ---------- État ----------
const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
let L = null, lvlIdx = 0;
let walls, plates, doors, startPos, exitPos, plateTotals;
const G = {
  _status: "menu",   // menu | levels | intro | play | dying | paused | complete | ad | end
  tick: 0, loops: 1, ghosts: [], rec: [],
  player: null, chasers: [], patrols: [], active: {}, enemyPos: [],
  dyingTimer: 0, shake: 0, flash: 0,
  get status() { return this._status; },
  set status(v) {
    this._status = v; focusIdx = 0;
    if (v === "play" || v === "dying") CG.gameplay(true); else CG.gameplay(false);
  },
};
let keyMask = 0, padMask = 0, testMask = null;
let particles = [], frame = 0, touchMode = false, focusIdx = 0, usingKeyboard = false;
let buttons = [], nextButtons = [];
const mouse = { x: -1, y: -1 };

function loadLevel(i) {
  lvlIdx = i; L = LEVELS[i];
  walls = []; plates = []; doors = []; plateTotals = {};
  for (let y = 0; y < ROWS; y++) {
    walls[y] = [];
    for (let x = 0; x < COLS; x++) {
      const ch = L.map[y][x];
      walls[y][x] = ch === "#";
      if (ch === "S") startPos = { x: x * T + T / 2, y: y * T + T / 2 };
      if (ch === "E") exitPos = { x: x * T + T / 2, y: y * T + T / 2 };
      if (ch >= "a" && ch <= "d") { plates.push({ id: ch, tx: x, ty: y, on: false }); plateTotals[ch] = (plateTotals[ch] || 0) + 1; }
      if (ch >= "A" && ch <= "D") doors.push({ id: ch.toLowerCase(), tx: x, ty: y });
    }
  }
  G.ghosts = []; G.loops = 1;
  startLoop();
}

function startLoop() {
  G.tick = 0; G.rec = [];
  G.player = { x: startPos.x, y: startPos.y, alive: true };
  G.ghosts.forEach(g => { g.x = startPos.x; g.y = startPos.y; g.alive = true; });
  G.patrols = L.enemies.filter(e => e.type === "patrol");
  G.chasers = L.enemies.filter(e => e.type === "chaser").map(e => ({ x: e.x, y: e.y, hx: e.x, hy: e.y, target: null }));
  G.active = {}; plates.forEach(p => { p.on = false; });
  G.enemyPos = [...G.patrols.map(p => patrolPos(p, 0)), ...G.chasers];
  G.dyingTimer = 0;
}

function startLevel(i) { loadLevel(i); G.status = "intro"; }

// ---------- Simulation ----------
const doorClosed = id => !G.active[id];

function tileSolid(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
  if (walls[ty][tx]) return true;
  for (const d of doors) if (d.tx === tx && d.ty === ty && doorClosed(d.id)) return true;
  return false;
}
function boxHits(x, y, half, pred) {
  const x0 = Math.floor((x - half) / T), x1 = Math.floor((x + half - 0.001) / T);
  const y0 = Math.floor((y - half) / T), y1 = Math.floor((y + half - 0.001) / T);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (pred(tx, ty)) return true;
  return false;
}
function moveEntity(e, dx, dy, half) {
  if (dx && !boxHits(e.x + dx, e.y, half, tileSolid)) e.x += dx;
  if (dy && !boxHits(e.x, e.y + dy, half, tileSolid)) e.y += dy;
}
function applyInput(e, mask) {
  let dx = (mask & RIGHT ? 1 : 0) - (mask & LEFT ? 1 : 0);
  let dy = (mask & DOWN ? 1 : 0) - (mask & UP ? 1 : 0);
  if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
  moveEntity(e, dx * SPEED, dy * SPEED, HALF);
}
function patrolPos(p, tick) {
  const len = Math.hypot(p.x2 - p.x1, p.y2 - p.y1);
  const m = (p.speed * (tick + (p.phase || 0))) % (2 * len);
  const f = (m < len ? m : 2 * len - m) / len;
  return { x: p.x1 + (p.x2 - p.x1) * f, y: p.y1 + (p.y2 - p.y1) * f };
}
function livingEntities() {
  const r = G.ghosts.filter(g => g.alive);
  if (G.player.alive) r.push(G.player);
  return r;
}
function kill(e) {
  if (!e.alive) return;
  e.alive = false;
  const isP = e === G.player;
  burst(e.x, e.y + OY, isP ? "#00f0ff" : "#ff3df2");
  Snd.play(isP ? "death" : "ghostDie");
  G.shake = 8;
}

function step() {
  const ents = livingEntities();

  // plaques (une porte s'ouvre quand toutes ses plaques sont tenues)
  const pressed = {};
  for (const p of plates) {
    const on = ents.some(e => Math.floor(e.x / T) === p.tx && Math.floor(e.y / T) === p.ty);
    if (on !== p.on) Snd.play(on ? "plateOn" : "plateOff");
    p.on = on;
    if (on) pressed[p.id] = (pressed[p.id] || 0) + 1;
  }
  const prev = G.active; G.active = {};
  for (const id in plateTotals) {
    G.active[id] = pressed[id] === plateTotals[id];
    if (G.active[id] !== !!prev[id] && G.tick > 0) Snd.play(G.active[id] ? "doorOpen" : "doorClose");
  }

  // les portes laser tuent ceux qu'elles surprennent en se refermant
  for (const e of ents) {
    if (boxHits(e.x, e.y, HALF, (tx, ty) => doors.some(d => d.tx === tx && d.ty === ty && doorClosed(d.id)))) kill(e);
  }

  // déplacements
  const mask = testMask !== null ? testMask : (keyMask | padMask);
  if (G.player.alive) { applyInput(G.player, mask); G.rec.push(mask); }
  for (const g of G.ghosts) if (g.alive) applyInput(g, g.inputs[G.tick] || 0);

  // ennemis
  const enemies = G.patrols.map(p => patrolPos(p, G.tick));
  for (const c of G.chasers) {
    const alive = livingEntities();
    let best = null, bd = 1e9;
    for (const e of alive) { const d = Math.hypot(e.x - c.x, e.y - c.y); if (d < bd) { bd = d; best = e; } }
    if (c.target && (!c.target.alive || Math.hypot(c.target.x - c.x, c.target.y - c.y) > 330)) c.target = null;
    if (!c.target && best && bd < 120) c.target = best;
    const tx = c.target ? c.target.x : c.hx, ty = c.target ? c.target.y : c.hy;
    const d = Math.hypot(tx - c.x, ty - c.y);
    if (d > 1.5) moveEntity(c, (tx - c.x) / d * 1.5, (ty - c.y) / d * 1.5, 10);
    enemies.push(c);
  }
  G.enemyPos = enemies;
  for (const en of enemies) for (const e of livingEntities()) {
    if (Math.hypot(en.x - e.x, en.y - e.y) < 20) kill(e);
  }

  // sortie
  if (G.player.alive && Math.hypot(G.player.x - exitPos.x, G.player.y - exitPos.y) < 16) {
    levelComplete();
    return;
  }

  G.tick++;
  if (!G.player.alive) { G.status = "dying"; G.dyingTimer = 45; return; }
  if (G.tick >= LOOP_TICKS) endLoop();
}

function endLoop() {
  if (G.rec.length > 2) {
    G.ghosts.push({ inputs: G.rec.slice(), x: 0, y: 0, alive: true });
    if (G.ghosts.length > MAX_GHOSTS) G.ghosts.shift();
  }
  G.loops++; G.flash = 1;
  Snd.play("loop");
  startLoop();
  G.status = "play";
}

function levelComplete() {
  G.status = "complete";
  burst(exitPos.x, exitPos.y + OY, "#3dff8c", 40);
  Snd.play("win");
  CG.happy();
  const prevBest = save.best[lvlIdx];
  if (!prevBest || G.loops < prevBest) save.best[lvlIdx] = G.loops;
  save.unlocked = Math.max(save.unlocked, Math.min(lvlIdx + 1, LEVELS.length - 1));
  writeSave();
}

function nextLevel() {
  const next = lvlIdx + 1;
  G.status = "ad";
  CG.midgame(() => { if (next < LEVELS.length) startLevel(next); else G.status = "end"; });
}

// ---------- Effets ----------
function burst(x, y, color, n = 24) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 3;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 30 + Math.random() * 20, color });
  }
}

// ---------- Rendu : helpers ----------
function glow(c, b = 12) { ctx.shadowColor = c; ctx.shadowBlur = b; }
function noGlow() { ctx.shadowBlur = 0; }
function text(str, x, y, size, color, align = "center", glowC = null, bold = true) {
  ctx.font = `${bold ? "bold " : ""}${size}px ${FONT}`;
  ctx.textAlign = align; ctx.textBaseline = "middle";
  if (glowC) glow(glowC, 14);
  ctx.fillStyle = color; ctx.fillText(str, x, y);
  noGlow();
}
function wrap(str, x, y, maxW, lh, size, color) {
  ctx.font = `${size}px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = color;
  const words = str.split(" "); let line = "", n = 0;
  for (const w of words) {
    const tt = line ? line + " " + w : w;
    if (ctx.measureText(tt).width > maxW && line) { ctx.fillText(line, x, y + n * lh); n++; line = w; } else line = tt;
  }
  ctx.fillText(line, x, y + n * lh);
  return (n + 1) * lh;
}
function rrect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// Bouton "immediate mode" : dessiné et enregistré à chaque frame
function button(label, x, y, w, h, fn, opt = {}) {
  const idx = nextButtons.length;
  nextButtons.push({ x, y, w, h, fn, disabled: !!opt.disabled });
  const hover = mouse.x >= x && mouse.x <= x + w && mouse.y >= y && mouse.y <= y + h;
  const focused = usingKeyboard && idx === focusIdx;
  const c = opt.color || "#00f0ff";
  rrect(x, y, w, h, 10);
  ctx.fillStyle = hover || focused ? c + "33" : "rgba(10,14,34,.9)"; ctx.fill();
  glow(c, hover || focused ? 18 : 8);
  ctx.strokeStyle = opt.disabled ? "#3a4366" : c; ctx.lineWidth = 2; ctx.stroke(); noGlow();
  if (opt.render) opt.render(x, y, w, h);
  else text(label, x + w / 2, y + h / 2, opt.size || 20, opt.disabled ? "#56608a" : "#e6f2ff");
}

// ---------- Rendu : monde ----------
function drawWorld() {
  ctx.fillStyle = "#070914"; ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (G.shake > 0) { ctx.translate((Math.random() - .5) * G.shake, (Math.random() - .5) * G.shake); G.shake *= 0.85; if (G.shake < .5) G.shake = 0; }
  ctx.translate(0, OY);

  ctx.strokeStyle = "rgba(60,90,160,.12)"; ctx.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * T, 0); ctx.lineTo(x * T, ROWS * T); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * T); ctx.lineTo(W, y * T); ctx.stroke(); }

  glow("#3b6cff", 8);
  ctx.fillStyle = "#101a3d"; ctx.strokeStyle = "#3b6cff"; ctx.lineWidth = 1.5;
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (walls[y][x]) {
    ctx.fillRect(x * T, y * T, T, T); ctx.strokeRect(x * T + .75, y * T + .75, T - 1.5, T - 1.5);
  }
  noGlow();

  const pulse = 0.6 + 0.4 * Math.sin(frame / 12);
  glow("#3dff8c", 18);
  ctx.strokeStyle = `rgba(61,255,140,${pulse})`; ctx.lineWidth = 3;
  ctx.strokeRect(exitPos.x - 14, exitPos.y - 14, 28, 28);
  ctx.fillStyle = `rgba(61,255,140,${pulse * .25})`; ctx.fillRect(exitPos.x - 14, exitPos.y - 14, 28, 28);
  noGlow();

  for (const p of plates) {
    const c = COLORS[p.id], cx = p.tx * T + T / 2, cy = p.ty * T + T / 2;
    glow(c, p.on ? 22 : 8);
    ctx.strokeStyle = c; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.stroke();
    ctx.fillStyle = p.on ? c : "rgba(255,255,255,.06)";
    ctx.beginPath(); ctx.arc(cx, cy, p.on ? 10 : 6, 0, 7); ctx.fill();
    noGlow();
  }

  for (const d of doors) {
    const c = COLORS[d.id], closed = doorClosed(d.id), cx = d.tx * T + T / 2, y0 = d.ty * T;
    if (closed) {
      glow(c, 16);
      ctx.fillStyle = c + "33"; ctx.fillRect(d.tx * T, y0, T, T);
      ctx.strokeStyle = c; ctx.lineWidth = 2 + Math.random();
      for (const o of [-8, 0, 8]) {
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.beginPath(); ctx.moveTo(cx + o, y0); ctx.lineTo(cx + o, y0 + T); ctx.stroke();
      }
      ctx.globalAlpha = 1; noGlow();
    } else {
      ctx.fillStyle = c; ctx.globalAlpha = .5;
      ctx.fillRect(cx - 2, y0 + 2, 4, 4); ctx.fillRect(cx - 2, y0 + T - 6, 4, 4);
      ctx.globalAlpha = 1;
    }
  }

  for (const en of G.enemyPos) {
    glow("#ff4d4d", 14); ctx.fillStyle = "#ff4d4d";
    ctx.beginPath(); const r = 10;
    ctx.moveTo(en.x, en.y - r); ctx.lineTo(en.x + r, en.y); ctx.lineTo(en.x, en.y + r); ctx.lineTo(en.x - r, en.y);
    ctx.closePath(); ctx.fill(); noGlow();
  }

  for (const g of G.ghosts) if (g.alive) {
    glow("#ff3df2", 14);
    ctx.fillStyle = "rgba(255,61,242,.55)"; ctx.strokeStyle = "#ff3df2"; ctx.lineWidth = 2;
    ctx.fillRect(g.x - HALF, g.y - HALF, HALF * 2, HALF * 2);
    ctx.strokeRect(g.x - HALF, g.y - HALF, HALF * 2, HALF * 2);
    noGlow();
  }
  if (G.player.alive) {
    glow("#00f0ff", 20); ctx.fillStyle = "#00f0ff";
    ctx.fillRect(G.player.x - HALF, G.player.y - HALF, HALF * 2, HALF * 2); noGlow();
  }

  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / 50); ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.life > 0);
  ctx.restore();

  if (G.flash > 0) { ctx.fillStyle = `rgba(0,240,255,${G.flash * 0.35})`; ctx.fillRect(0, OY, W, H - OY); G.flash = Math.max(0, G.flash - 0.06); }
}

function iconPause(x, y) { ctx.fillStyle = "#cfe3ff"; ctx.fillRect(x - 6, y - 7, 4, 14); ctx.fillRect(x + 2, y - 7, 4, 14); }
function iconSound(x, y, on) {
  ctx.strokeStyle = "#cfe3ff"; ctx.fillStyle = "#cfe3ff"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 8, y - 3); ctx.lineTo(x - 4, y - 3); ctx.lineTo(x + 1, y - 8); ctx.lineTo(x + 1, y + 8); ctx.lineTo(x - 4, y + 3); ctx.lineTo(x - 8, y + 3); ctx.closePath(); ctx.fill();
  if (on) { ctx.beginPath(); ctx.arc(x + 1, y, 6, -0.9, 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 1, y, 10, -0.9, 0.9); ctx.stroke(); }
  else { ctx.strokeStyle = "#ff4d4d"; ctx.beginPath(); ctx.moveTo(x + 4, y - 5); ctx.lineTo(x + 12, y + 5); ctx.moveTo(x + 12, y - 5); ctx.lineTo(x + 4, y + 5); ctx.stroke(); }
}

function toggleSound() { save.muted = !save.muted; Snd.setMuted(save.muted); writeSave(); }
function pauseGame() { if (G.status === "play") { G.status = "paused"; } }

function drawHUD(interactive) {
  ctx.fillStyle = "#0a0d1f"; ctx.fillRect(0, 0, W, OY);
  text(`${t("level")} ${lvlIdx + 1} · ${loc(L.name)}`, 12, OY / 2, 12, "#00f0ff", "left", "#00f0ff");
  const frac = 1 - G.tick / LOOP_TICKS, bx = 300, bw = 110;
  ctx.strokeStyle = "#2a3a6a"; ctx.lineWidth = 1; ctx.strokeRect(bx, OY / 2 - 6, bw, 12);
  ctx.fillStyle = frac > .25 ? "#00f0ff" : "#ff4d4d"; ctx.fillRect(bx + 1, OY / 2 - 5, (bw - 2) * frac, 10);
  text((Math.max(0, LOOP_TICKS - G.tick) / 60).toFixed(1) + "s", bx + bw + 8, OY / 2, 13, "#cfe3ff", "left");
  text(`${t("loop")} ${G.loops} · ${t("clones")} ${G.ghosts.length}`, 640, OY / 2, 12, "#ff3df2", "right");
  if (!interactive) return;   // boutons actifs seulement pendant la partie
  button("", 656, 6, 56, 28, () => { Snd.play("click"); toggleSound(); }, { render: (x, y, w, h) => iconSound(x + w / 2 - 2, y + h / 2, !save.muted) });
  button("", 722, 6, 56, 28, () => { Snd.play("click"); pauseGame(); }, { render: (x, y, w, h) => iconPause(x + w / 2, y + h / 2) });
}

// ---------- Rendu : contrôles tactiles ----------
const PAD = { x: 100, y: H - 100, r: 78 }, LOOPBTN = { x: W - 100, y: H - 100, r: 52 };
const padPointers = new Map();
function recomputePad() {
  padMask = 0;
  for (const p of padPointers.values()) {
    const dx = p.x - PAD.x, dy = p.y - PAD.y, len = Math.hypot(dx, dy);
    if (len < 18) continue;
    if (dx / len > 0.38) padMask |= RIGHT; if (dx / len < -0.38) padMask |= LEFT;
    if (dy / len > 0.38) padMask |= DOWN; if (dy / len < -0.38) padMask |= UP;
  }
}
function drawTouchControls() {
  ctx.globalAlpha = 0.55;
  glow("#00f0ff", 10); ctx.strokeStyle = "#00f0ff"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(PAD.x, PAD.y, PAD.r, 0, 7); ctx.stroke(); noGlow();
  ctx.fillStyle = "#00f0ff";
  for (const [dx, dy, bit] of [[0, -1, UP], [0, 1, DOWN], [-1, 0, LEFT], [1, 0, RIGHT]]) {
    ctx.globalAlpha = padMask & bit ? 0.95 : 0.4;
    ctx.beginPath(); ctx.moveTo(PAD.x + dx * 52 - dy * 14 + dx * 10 * 0, PAD.y + dy * 52 - dx * 14);
    ctx.lineTo(PAD.x + dx * 52 + dy * 14, PAD.y + dy * 52 + dx * 14);
    ctx.lineTo(PAD.x + dx * 30, PAD.y + dy * 30); ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 0.55;
  glow("#ff3df2", 10); ctx.strokeStyle = "#ff3df2";
  ctx.beginPath(); ctx.arc(LOOPBTN.x, LOOPBTN.y, LOOPBTN.r, 0, 7); ctx.stroke(); noGlow();
  ctx.globalAlpha = 0.9; text(t("loopBtn"), LOOPBTN.x, LOOPBTN.y, 16, "#ff3df2");
  ctx.globalAlpha = 1;
}

// ---------- Rendu : écrans ----------
function dim() { ctx.fillStyle = "rgba(4,5,12,.84)"; ctx.fillRect(0, OY, W, H - OY); }

function drawMenuBackdrop() {
  ctx.fillStyle = "#070914"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(60,90,160,.16)"; ctx.lineWidth = 1;
  const off = (frame * 0.4) % T;
  for (let x = -T + off; x <= W; x += T) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = -T + off; y <= H; y += T) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // clones qui dérivent
  for (let i = 0; i < 6; i++) {
    const x = (frame * (0.6 + i * 0.13) + i * 170) % (W + 80) - 40;
    const y = 90 + i * 95 + Math.sin(frame / 40 + i) * 20;
    ctx.globalAlpha = 0.12 + i * 0.03; glow(i === 5 ? "#00f0ff" : "#ff3df2", 16);
    ctx.fillStyle = i === 5 ? "#00f0ff" : "#ff3df2"; ctx.fillRect(x - 11, y - 11, 22, 22); noGlow();
  }
  ctx.globalAlpha = 1;
}

function screenMenu() {
  drawMenuBackdrop();
  text("ECHOES", W / 2, 120, 64, "#00f0ff", "center", "#00f0ff");
  text("OF THE GRID", W / 2, 182, 44, "#ff3df2", "center", "#ff3df2");
  text(t("tagline"), W / 2, 228, 16, "#9fb4e8", "center", null, false);
  const bw = 300, bx = W / 2 - bw / 2;
  button(save.unlocked > 0 ? t("cont") : t("play"), bx, 270, bw, 52, () => { Snd.init(); Snd.play("click"); startLevel(save.unlocked); }, { size: 24 });
  button(t("levels"), bx, 336, bw, 46, () => { Snd.play("click"); G.status = "levels"; }, { color: "#ff3df2" });
  button(`${t("sound")}: ${save.muted ? t("off") : t("on")}`, bx, 396, bw, 44, () => { toggleSound(); Snd.play("click"); }, { color: "#8a8fff", size: 18 });
  button(`${t("language")}: ${t("langName")}`, bx, 454, bw, 44, () => { save.lang = save.lang === "en" ? "fr" : "en"; writeSave(); Snd.play("click"); }, { color: "#8a8fff", size: 18 });
  text(touchMode ? t("touch") : t("keys"), W / 2, 590, 11, "#6f82b8", "center", null, false);
}

function screenLevels() {
  drawMenuBackdrop();
  text(t("levels"), W / 2, 70, 36, "#00f0ff", "center", "#00f0ff");
  const cw = 160, ch = 118, gap = 16, x0 = (W - (4 * cw + 3 * gap)) / 2, y0 = 130;
  LEVELS.forEach((lv, i) => {
    const x = x0 + (i % 4) * (cw + gap), y = y0 + ((i / 4) | 0) * (ch + gap);
    const locked = i > save.unlocked;
    button("", x, y, cw, ch, () => { if (!locked) { Snd.init(); Snd.play("click"); startLevel(i); } }, {
      disabled: locked, color: locked ? "#3a4366" : "#00f0ff",
      render: (bx, by) => {
        text(String(i + 1), bx + cw / 2, by + 34, 34, locked ? "#56608a" : "#00f0ff", "center", locked ? null : "#00f0ff");
        const nm = loc(lv.name);
        ctx.font = `bold 11px ${FONT}`;
        wrap(nm, bx + cw / 2, by + 70, cw - 16, 13, 11, locked ? "#56608a" : "#cfe3ff");
        const best = save.best[i];
        text(locked ? t("locked") : (best ? `${t("best")}: ${best}` : ""), bx + cw / 2, by + ch - 14, 11, locked ? "#56608a" : "#3dff8c", "center", null, false);
      },
    });
  });
  button(t("back"), W / 2 - 110, 560, 220, 46, () => { Snd.play("click"); G.status = "menu"; }, { color: "#ff3df2" });
}

function panelTitle(title, color, y = 170) { text(title, W / 2, y, 40, color, "center", color); }

function overlayScreens() {
  const st = G.status;
  if (st === "intro") {
    dim();
    panelTitle(`${t("level")} ${lvlIdx + 1}`, "#00f0ff", 150);
    text(loc(L.name), W / 2, 205, 24, "#ff3df2", "center", "#ff3df2");
    let y = 262;
    y += wrap(loc(L.hint), W / 2, y, 560, 24, 17, "#e6f2ff") + 16;
    if (lvlIdx === 0) y += wrap(t("how"), W / 2, y, 560, 22, 14, "#9fb4e8") + 10;
    wrap(touchMode ? t("touch") : t("keys"), W / 2, y + 6, 640, 20, 12, "#6f82b8");
    button(t("start"), W / 2 - 120, 470, 240, 54, () => { Snd.init(); Snd.play("click"); G.status = "play"; }, { size: 24 });
    if (!touchMode) text(t("enter"), W / 2, 550, 13, "#6f82b8", "center", null, false);
  } else if (st === "paused") {
    dim(); panelTitle(t("paused"), "#00f0ff", 190);
    button(t("resume"), W / 2 - 130, 250, 260, 50, () => { Snd.play("click"); G.status = "play"; }, { size: 22 });
    button(t("restart"), W / 2 - 130, 314, 260, 46, () => { Snd.play("click"); startLevel(lvlIdx); G.status = "play"; }, { color: "#ff3df2" });
    button(`${t("sound")}: ${save.muted ? t("off") : t("on")}`, W / 2 - 130, 374, 260, 42, () => { toggleSound(); Snd.play("click"); }, { color: "#8a8fff", size: 17 });
    button(t("menu"), W / 2 - 130, 430, 260, 42, () => { Snd.play("click"); G.status = "menu"; }, { color: "#8a8fff", size: 17 });
  } else if (st === "complete") {
    dim(); panelTitle(t("complete"), "#3dff8c", 190);
    text(`${t("loopsUsed")}: ${G.loops}   ·   ${t("best")}: ${save.best[lvlIdx]}`, W / 2, 260, 18, "#cfe3ff");
    button(lvlIdx + 1 < LEVELS.length ? t("next") : t("next"), W / 2 - 140, 320, 280, 54, () => { Snd.play("click"); nextLevel(); }, { size: 22, color: "#3dff8c" });
    button(t("restart"), W / 2 - 140, 390, 280, 44, () => { Snd.play("click"); startLevel(lvlIdx); G.status = "play"; }, { color: "#ff3df2", size: 17 });
    button(t("menu"), W / 2 - 140, 446, 280, 44, () => { Snd.play("click"); G.status = "menu"; }, { color: "#8a8fff", size: 17 });
  } else if (st === "ad") {
    dim(); panelTitle(t("ad"), "#8a8fff", 260); text(t("adWait"), W / 2, 330, 16, "#cfe3ff", "center", null, false);
  } else if (st === "end") {
    dim(); panelTitle(t("endTitle"), "#ff3df2", 200);
    wrap(t("endText"), W / 2, 270, 560, 26, 18, "#e6f2ff");
    button(t("menu"), W / 2 - 120, 380, 240, 52, () => { Snd.play("click"); G.status = "menu"; }, { size: 22 });
  } else if (st === "dying") {
    text(t("dead"), W / 2, H / 2, 30, "#ff4d4d", "center", "#ff4d4d");
  }
}

function render() {
  frame++;
  nextButtons = [];
  const st = G.status;
  if (st === "menu") screenMenu();
  else if (st === "levels") screenLevels();
  else {
    drawWorld();
    drawHUD(st === "play" || st === "dying");
    if ((st === "play" || st === "dying") && touchMode) drawTouchControls();
    overlayScreens();
  }
  buttons = nextButtons;
  if (focusIdx >= buttons.length) focusIdx = Math.max(0, buttons.length - 1);
}

// ---------- Boucle principale ----------
let last = performance.now(), acc = 0;
function frameLoop(now) {
  acc += Math.min(100, now - last); last = now;
  while (acc >= 1000 / 60) {
    acc -= 1000 / 60;
    if (G.status === "play") step();
    else if (G.status === "dying" && --G.dyingTimer <= 0) endLoop();
  }
  render();
  requestAnimationFrame(frameLoop);
}

// ---------- Entrées ----------
const KEYMAP = { z: UP, w: UP, arrowup: UP, s: DOWN, arrowdown: DOWN, q: LEFT, a: LEFT, arrowleft: LEFT, d: RIGHT, arrowright: RIGHT };
function activate() { const b = buttons[focusIdx]; if (b && !b.disabled) { b.fn(); return true; } return false; }

addEventListener("keydown", e => {
  usingKeyboard = true; Snd.init();
  const k = e.key.toLowerCase(), st = G.status;
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
  if (k === "m") { toggleSound(); return; }
  if (st === "play" || st === "dying") {
    if (KEYMAP[k]) keyMask |= KEYMAP[k];
    else if (k === " " && st === "play" && !e.repeat) endLoop();
    else if (k === "r" && !e.repeat) { startLevel(lvlIdx); G.status = "play"; }
    else if (k === "p" || k === "escape") pauseGame();
    return;
  }
  if (st === "paused" && (k === "p" || k === "escape")) { G.status = "play"; return; }
  if (st === "levels" && k === "escape") { G.status = "menu"; return; }
  if (st === "ad") return;
  if (k === "arrowdown" || k === "arrowright" || k === "s" || k === "d") focusIdx = (focusIdx + 1) % Math.max(1, buttons.length);
  else if (k === "arrowup" || k === "arrowleft" || k === "w" || k === "z" || k === "q" || k === "a") focusIdx = (focusIdx - 1 + buttons.length) % Math.max(1, buttons.length);
  else if (k === "enter" || k === " ") activate();
});
addEventListener("keyup", e => { const m = KEYMAP[e.key.toLowerCase()]; if (m) keyMask &= ~m; });
addEventListener("blur", () => { keyMask = 0; padMask = 0; padPointers.clear(); pauseGame(); });
document.addEventListener("visibilitychange", () => { if (document.hidden) pauseGame(); });
addEventListener("contextmenu", e => e.preventDefault());

function toCanvas(e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
}
cv.addEventListener("pointerdown", e => {
  Snd.init();
  if (e.pointerType === "touch") touchMode = true; else usingKeyboard = false;
  const p = toCanvas(e); mouse.x = p.x; mouse.y = p.y;
  const st = G.status;
  const hit = buttons.findIndex(b => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h);
  if (hit >= 0) { focusIdx = hit; if (!buttons[hit].disabled) buttons[hit].fn(); return; }
  if ((st === "play" || st === "dying") && touchMode) {
    if (Math.hypot(p.x - LOOPBTN.x, p.y - LOOPBTN.y) < LOOPBTN.r + 14) { if (st === "play") endLoop(); return; }
    if (Math.hypot(p.x - PAD.x, p.y - PAD.y) < PAD.r + 40) {
      padPointers.set(e.pointerId, p); recomputePad(); try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }
});
cv.addEventListener("pointermove", e => {
  const p = toCanvas(e); mouse.x = p.x; mouse.y = p.y;
  if (padPointers.has(e.pointerId)) { padPointers.set(e.pointerId, p); recomputePad(); }
});
const endPointer = e => { if (padPointers.delete(e.pointerId)) recomputePad(); };
cv.addEventListener("pointerup", endPointer);
cv.addEventListener("pointercancel", endPointer);
cv.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1; });

// ---------- Hook de test ----------
window.__ecg = {
  get G() { return G; }, get save() { return save; },
  level: () => L, start: i => { startLevel(i); G.status = "play"; },
  step, endLoop, setMask(m) { testMask = m; },
  setStatus(s) { G.status = s; },
};

// ---------- Démarrage ----------
loadSave();
loadLevel(0);
requestAnimationFrame(frameLoop);
CG.init().then(() => {
  CG.loading(true);
  loadSave();
  CG.loading(false);
});
