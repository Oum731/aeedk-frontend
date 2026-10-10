"use strict";
// Sons et musique synthétisés (WebAudio) : aucun fichier audio à charger.
const Snd = {
  ctx: null, master: null, music: null, muted: false, suspended: false,
  nextNote: 0, noteIdx: 0, timer: null,

  init() {
    if (this.ctx) { this.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.music.gain.value = 0.32;
      this.music.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyGain();
      this.nextNote = this.ctx.currentTime + 0.1;
      this.timer = setInterval(() => this.schedule(), 60);
    } catch (e) { this.ctx = null; }
  },
  resume() { if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {}); },
  applyGain() { if (this.master) this.master.gain.value = (this.muted || this.suspended) ? 0 : 1; },
  setMuted(m) { this.muted = m; this.applyGain(); },
  setSuspended(s) { this.suspended = s; this.applyGain(); },

  tone(freq, dur, type = "square", vol = 0.1, slideTo = null, delay = 0, dest = null) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.master);
    o.start(t); o.stop(t + dur + 0.02);
  },
  noise(dur, vol = 0.12) {
    if (!this.ctx) return;
    const n = Math.floor(this.ctx.sampleRate * dur), buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = buf; g.gain.value = vol; s.connect(g); g.connect(this.master); s.start();
  },
  play(name) {
    if (!this.ctx) return;
    switch (name) {
      case "click": this.tone(520, 0.06, "square", 0.06); break;
      case "plateOn": this.tone(520, 0.08, "square", 0.08); this.tone(780, 0.1, "square", 0.08, null, 0.06); break;
      case "plateOff": this.tone(420, 0.1, "square", 0.06, 260); break;
      case "doorOpen": this.tone(220, 0.35, "sawtooth", 0.07, 880); break;
      case "doorClose": this.tone(700, 0.3, "sawtooth", 0.07, 160); break;
      case "death": this.noise(0.35, 0.14); this.tone(300, 0.4, "sawtooth", 0.1, 50); break;
      case "ghostDie": this.noise(0.25, 0.1); this.tone(520, 0.3, "triangle", 0.08, 90); break;
      case "loop": this.tone(900, 0.35, "sawtooth", 0.07, 160); this.tone(450, 0.35, "triangle", 0.06, 80, 0.05); break;
      case "win": [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.25, "square", 0.08, null, i * 0.1)); break;
    }
  },
  // Musique : basse + arpège en la mineur, 16 pas en boucle
  schedule() {
    if (!this.ctx || this.ctx.state !== "running") return;
    const step = 0.16, bass = [55, 55, 55, 55, 65.4, 65.4, 49, 49];
    const arp = [220, 262, 330, 262, 220, 262, 392, 330, 262, 330, 392, 330, 247, 294, 370, 294];
    while (this.nextNote < this.ctx.currentTime + 0.25) {
      const i = this.noteIdx % 16;
      if (i % 2 === 0) this.tone(bass[(i / 2) | 0], step * 1.8, "triangle", 0.5, null, this.nextNote - this.ctx.currentTime, this.music);
      this.tone(arp[i], step * 0.9, "square", 0.12, null, this.nextNote - this.ctx.currentTime, this.music);
      this.nextNote += step; this.noteIdx++;
    }
  },
};
