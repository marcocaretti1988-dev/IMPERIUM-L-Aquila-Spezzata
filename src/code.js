// ================= THEME: 4 layout grafici, icone disegnate, difficoltà =================
const SET_KEY = 'imperium_settings';
let SET = { theme: 'pergamena', diff: 'normale' };
try { const j = JSON.parse(localStorage.getItem(SET_KEY) || 'null'); if (j) SET = Object.assign(SET, j); } catch (e) { }
function saveSet() { try { localStorage.setItem(SET_KEY, JSON.stringify(SET)); } catch (e) { } }

// ---- difficoltà ----
const DIFFS = {
  facile: { n: 'Facile', d: 'Tregua di 15 min, notti ogni 14 min, nemici più deboli, +30% produzione e bottino più ricco.', truce: 900, night: 840, prod: 1.3, loot: 1.25, ehp: 0.75, edmg: 0.75, raid: 0.6, def: 0.7, col: '#3f7a2e' },
  normale: { n: 'Normale', d: 'L\'esperienza bilanciata: tregua di 10 min e una razzia ogni 10 minuti.', truce: 600, night: 600, prod: 1, loot: 1, ehp: 1, edmg: 1, raid: 1, def: 1, col: '#b45309' },
  difficile: { n: 'Difficile', d: 'Tregua di 6 min, notti ogni 7 min, nemici più numerosi e resistenti, risorse più scarse.', truce: 360, night: 420, prod: 0.85, loot: 0.9, ehp: 1.3, edmg: 1.25, raid: 1.4, def: 1.35, col: '#8f1d1d' },
};
function DF() { return DIFFS[SET.diff] || DIFFS.normale; }

// ---- temi ----
const THEMES = {
  pergamena: { n: 'Pergamena', d: 'Legno, pergamena e cera rossa. Lo stile classico di IMPERIUM.', fh: 'Cinzel', fb: 'Lora', sw: ['#f3e6c4', '#2f271f', '#8f1d1d', '#d9b25a'],
    ico: { O: '#3a2410', w: 1.5, H: 'rgba(255,255,255,.45)' }, cf: 'bold 12px Cinzel, serif', bub: ['rgba(253,246,227,0.95)', '#5c3a25'] },
  miniatura: { n: 'Miniatura', d: 'Codice miniato: pergamena chiara, blu lapislazzuli e foglia d\'oro.', fh: 'Cormorant SC', fb: 'EB Garamond', sw: ['#f7efd9', '#1f3a8a', '#c99a2e', '#b3261e'],
    ico: { O: '#16306e', w: 1.6, H: '#fff7d0', gold: 1 }, cf: '700 14px "Cormorant SC", serif', bub: ['rgba(247,239,217,0.97)', '#c99a2e'] },
  pietra: { n: 'Pietra e Ferro', d: 'Ardesia scura, ferro battuto e braci. Stile da fortezza.', fh: 'IM Fell English SC', fb: 'Alegreya Sans', sw: ['#2b2f33', '#8d959c', '#e07a2f', '#d7dadc'],
    ico: { O: '#15171a', w: 1.5, H: 'rgba(255,255,255,.55)', mono: 1 }, cf: '13px "IM Fell English SC", serif', bub: ['rgba(43,47,51,0.95)', '#8d959c'] },
  araldica: { n: 'Araldica', d: 'Smalti piatti come uno stemma: rosso, azzurro e oro su argento.', fh: 'Grenze Gotisch', fb: 'Alegreya', sw: ['#f4f1ea', '#1d4aa0', '#b3201f', '#e8b923'],
    ico: { O: '#111', w: 2.1, H: null, flat: 1 }, cf: '700 14px "Grenze Gotisch", serif', bub: ['#f4f1ea', '#111'] },
};
function THM() { return THEMES[SET.theme] || THEMES.pergamena; }

// ---- icone disegnate (SVG) ----
// colori naturali [A, B] e versione araldica (smalti piatti)
const ICOL = {
  gear: [['#b9c0c6', '#6d4b2a'], ['#f4f1ea', '#b3201f']], sound: [['#d9c39a', '#c8382c'], ['#f4f1ea', '#e8b923']],
  cibo: [['#e3b445', '#a8761f'], ['#e8b923', '#8b5a2b']], legno: [['#9c6a3a', '#dcb27a'], ['#b5651d', '#f4f1ea']],
  oro: [['#f2c23a', '#b98516'], ['#e8b923', '#b3201f']], pietra: [['#9b968e', '#c9c4bb'], ['#9aa0a6', '#f4f1ea']],
  ferro: [['#69737c', '#aeb7bf'], ['#c9ced3', '#1d4aa0']], pelli: [['#94663a', '#c99a62'], ['#b5651d', '#e8b923']],
  favore: [['#f2c94c', '#c0392b'], ['#e8b923', '#b3201f']], build: [['#7d8790', '#8b5a2b'], ['#2b2b2b', '#b5651d']],
  army: [['#d3dae0', '#8b5a2b'], ['#f4f1ea', '#e8b923']], castle: [['#a9a39a', '#2f4f8f'], ['#f4f1ea', '#1d4aa0']],
  map: [['#ead7a7', '#3d7a3a'], ['#f4f1ea', '#2f8a3a']], scroll: [['#ecd9a8', '#c49a5a'], ['#f4f1ea', '#e8b923']],
  pop: [['#c98b5a', '#2f4f8f'], ['#b3201f', '#1d4aa0']], moon: [['#f2e2a0', '#f7f0c8'], ['#f4f1ea', '#e8b923']],
  truce: [['#f4f1e8', '#8b5a2b'], ['#f4f1ea', '#b5651d']], hammer: [['#7d8790', '#8b5a2b'], ['#2b2b2b', '#b5651d']],
  star: [['#f2c23a', '#b98516'], ['#e8b923', '#b3201f']], skull: [['#efe6d2', '#3a2410'], ['#f4f1ea', '#111']],
};
const IDRAW = {
  gear: P => { let t = ''; for (let i = 0; i < 8; i++) t += `<rect x="14" y="2.2" width="4" height="6" rx="1" fill="${P.A}" transform="rotate(${i * 45} 16 16)"/>`; return `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round">${t}<circle cx="16" cy="16" r="9.6" fill="${P.A}"/><circle cx="16" cy="16" r="4" fill="${P.B}"/></g>`; },
  sound: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M4 12h6l7-6v20l-7-6H4z" fill="${P.A}"/><path d="M21 11q3 5 0 10M24.5 8q5.5 8 0 16" fill="none" stroke="${P.B}" stroke-width="${P.w + 1}" stroke-linecap="round"/></g>`,
  cibo: P => { const ear = a => { let g = `<g transform="rotate(${a} 16 29)"><path d="M16 29V11" fill="none" stroke="${P.B}" stroke-width="${P.w + 0.8}" stroke-linecap="round"/>`; for (let i = 0; i < 3; i++) { const y = 6 + i * 3.4; g += `<ellipse cx="13.9" cy="${y + 1.6}" rx="1.9" ry="2.7" transform="rotate(-28 13.9 ${y + 1.6})"/><ellipse cx="18.1" cy="${y + 1.6}" rx="1.9" ry="2.7" transform="rotate(28 18.1 ${y + 1.6})"/>`; } return g + `<ellipse cx="16" cy="4.6" rx="1.8" ry="2.8"/></g>`; };
    return `<g fill="${P.A}" stroke="${P.O}" stroke-width="${P.w}">${ear(-30)}${ear(30)}${ear(0)}</g><path d="M11 23.5h10" stroke="${P.O}" stroke-width="${P.w + 1.2}" stroke-linecap="round"/>`; },
  legno: P => { const log = (x, y) => `<circle cx="${x}" cy="${y}" r="6.2" fill="${P.A}"/><circle cx="${x}" cy="${y}" r="4.2" fill="${P.B}" stroke-width="${P.w * 0.7}"/><circle cx="${x}" cy="${y}" r="2" fill="none" stroke-width="${P.w * 0.6}"/>`;
    return `<g stroke="${P.O}" stroke-width="${P.w}">${log(9.5, 22.5)}${log(22.5, 22.5)}${log(16, 11.5)}</g>`; },
  oro: P => `<g stroke="${P.O}" stroke-width="${P.w}"><circle cx="16" cy="16" r="12.3" fill="${P.A}"/><circle cx="16" cy="16" r="8.6" fill="none" stroke="${P.B}" stroke-width="${P.w + 0.4}"/><path d="M16 9.5v13M10.8 14.5h10.4" fill="none" stroke="${P.B}" stroke-width="${P.w + 1.1}" stroke-linecap="round"/></g>${P.H ? `<path d="M8 11a9.5 9.5 0 0 1 6-5" fill="none" stroke="${P.H}" stroke-width="1.8" stroke-linecap="round"/>` : ''}`,
  pietra: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M5 22 8.5 11.5 16 6.5 24.5 9.5 27.5 19 22 26.5 11.5 27z" fill="${P.A}"/><path d="M15 16 27.5 19 22 26.5z" fill="${P.B}"/><path d="M16 6.5 15 16 8.5 11.5M15 16 11.5 27" fill="none"/></g>`,
  ferro: P => { const ing = (x, y) => `<path d="M${x} ${y}l2.5-5.5h9l2.5 5.5z" fill="${P.A}"/><path d="M${x + 2.5} ${y - 5.5}l1.2-2.3h6.6l1.2 2.3z" fill="${P.B}"/>`;
    return `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round">${ing(2, 27)}${ing(16, 27)}${ing(9, 19)}</g>`; },
  pelli: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M16 4c3 0 5 2 5 4l5-1c1 3-1 5-3 6 1 4 1 7 0 9l4 3c-2 3-5 2-7 1-2 2-6 2-8 0-2 1-5 2-7-1l4-3c-1-2-1-5 0-9-2-1-4-3-3-6l5 1c0-2 2-4 5-4z" fill="${P.A}"/><ellipse cx="16" cy="16.5" rx="4.2" ry="6.5" fill="${P.B}" stroke="none" opacity=".8"/></g>`,
  favore: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M5 23 3.8 10l6.4 6L16 7l5.8 9 6.4-6L27 23z" fill="${P.A}"/><rect x="4.6" y="22" width="22.8" height="5.5" rx="1.2" fill="${P.A}"/><circle cx="3.8" cy="10" r="1.9" fill="${P.A}"/><circle cx="16" cy="7" r="1.9" fill="${P.A}"/><circle cx="28.2" cy="10" r="1.9" fill="${P.A}"/><circle cx="10.5" cy="24.7" r="1.6" fill="${P.B}"/><circle cx="16" cy="24.7" r="1.6" fill="${P.B}"/><circle cx="21.5" cy="24.7" r="1.6" fill="${P.B}"/></g>`,
  hammer: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round" transform="rotate(-40 16 16)"><rect x="14.2" y="11" width="3.6" height="18.5" rx="1.6" fill="${P.B}"/><path d="M7 5.5h15l3.2 2.6v3.4L22 14H7z" fill="${P.A}"/></g>`,
  build: P => IDRAW.hammer(P),
  army: P => { const sw = a => `<g transform="rotate(${a} 16 16)"><path d="M16 2.5l2 3.2V20h-4V5.7z" fill="${P.A}"/><rect x="10" y="20" width="12" height="2.6" rx="1" fill="${P.B}"/><rect x="14.8" y="22.6" width="2.4" height="5" fill="${P.B}"/><circle cx="16" cy="29" r="1.9" fill="${P.B}"/></g>`;
    return `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round">${sw(40)}${sw(-40)}</g>`; },
  castle: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M16 8.5V2.5" fill="none"/><path d="M16 2.5l7 2-7 2z" fill="${P.B}"/><path d="M7 29V9h4v3h3V9h4v3h3V9h4v20z" fill="${P.A}"/><path d="M13 29v-5.5a3 3 0 0 1 6 0V29z" fill="${P.O}"/><rect x="15" y="14" width="2" height="4" fill="${P.O}"/></g>`,
  map: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M3.5 8 11.5 5l9 3 8-3v19l-8 3-9-3-8 3z" fill="${P.A}"/><path d="M11.5 5v19M20.5 8v19" fill="none" stroke-width="${P.w * 0.7}"/><path d="M7 21q5-7 9-4t9-7" fill="none" stroke="${P.B}" stroke-width="${P.w + 0.5}" stroke-dasharray="2 2"/><path d="M23 8l4 4m0-4-4 4" stroke="${P.B}" stroke-width="${P.w + 0.6}"/></g>`,
  scroll: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><rect x="8" y="6" width="16" height="20" fill="${P.A}"/><rect x="5" y="3.5" width="22" height="5" rx="2.5" fill="${P.B}"/><rect x="5" y="23.5" width="22" height="5" rx="2.5" fill="${P.B}"/><path d="M11 12h10M11 15h10M11 18h7" fill="none" stroke-width="${P.w * 0.8}"/></g>`,
  pop: P => `<g stroke="${P.O}" stroke-width="${P.w}"><circle cx="21" cy="10" r="4" fill="${P.B}"/><path d="M14 27a7 8 0 0 1 14 0z" fill="${P.B}"/><circle cx="12" cy="12.5" r="4.6" fill="${P.A}"/><path d="M3.5 29a8.5 9 0 0 1 17 0z" fill="${P.A}"/></g>`,
  moon: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M19 3.5A12.5 12.5 0 1 0 28.5 22 10 10 0 1 1 19 3.5z" fill="${P.A}"/><path d="M25 6l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" fill="${P.B}" stroke-width="${P.w * 0.6}"/></g>`,
  truce: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M9 3.5V29" stroke="${P.B}" stroke-width="${P.w + 1.4}" stroke-linecap="round"/><path d="M10 6c5-3 9 3 15 0v11c-6 3-10-3-15 0z" fill="${P.A}"/></g>`,
  star: P => `<path d="M16 3l3.8 8.2 8.9 1-6.6 6.1 1.8 8.8L16 22.7l-7.9 4.4 1.8-8.8-6.6-6.1 8.9-1z" fill="${P.A}" stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"/>`,
  skull: P => `<g stroke="${P.O}" stroke-width="${P.w}" stroke-linejoin="round"><path d="M16 4c6.5 0 10.5 4.3 10.5 10 0 3.2-1.5 5.4-3.5 6.7V25h-3v2h-3v-2h-2v2h-3v-2H9v-4.3C7 19.4 5.5 17.2 5.5 14 5.5 8.3 9.5 4 16 4z" fill="${P.A}"/><circle cx="11.6" cy="14.6" r="2.8" fill="${P.B}"/><circle cx="20.4" cy="14.6" r="2.8" fill="${P.B}"/><path d="M16 18.2l-1.6 3h3.2z" fill="${P.B}"/></g>`,
};
let ICOURL = {}, ICOIMG = {};
function icoPalette(k) {
  const t = THM().ico, nat = ICOL[k] || [['#999', '#666'], ['#999', '#666']];
  let A = nat[0][0], B = nat[0][1];
  if (t.flat) { A = nat[1][0]; B = nat[1][1]; }
  else if (t.mono) { A = '#c3c9ce'; B = '#7d858c'; if (k === 'oro' || k === 'favore' || k === 'star') { A = '#e3b54a'; B = '#9c6c18'; } if (k === 'cibo') { A = '#d9b15a'; B = '#6d5a3a'; } }
  else if (t.gold) { A = 'url(#g)'; B = (k === 'favore' || k === 'oro' || k === 'star' || k === 'pop' || k === 'castle' || k === 'map') ? '#c8382c' : '#f6e7bd'; }
  return { A, B, O: t.O, w: t.w, H: t.H };
}
function icoSVG(k) {
  const P = icoPalette(k); const t = THM().ico;
  const defs = t.gold ? `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset=".55" stop-color="#e2b13a"/><stop offset="1" stop-color="#a8741c"/></linearGradient></defs>` : '';
  const shadow = t.flat ? '' : `<ellipse cx="16" cy="30" rx="10" ry="1.6" fill="rgba(0,0,0,.18)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${defs}${shadow}${IDRAW[k](P)}</svg>`;
}
function buildIcons() {
  ICOURL = {}; ICOIMG = {}; let css = '';
  for (const k in IDRAW) {
    const u = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icoSVG(k)); ICOURL[k] = u;
    css += `.ico-${k}{background-image:url("${u}")}`;
    const im = new Image(); im.src = u; ICOIMG[k] = im;
  }
  let st = document.getElementById('icostyle'); if (!st) { st = document.createElement('style'); st.id = 'icostyle'; document.head.appendChild(st); }
  st.textContent = css;
}
function ICO(k, cls) { return `<i class="ico ico-${k}${cls ? ' ' + cls : ''}"></i>`; }
function applyTheme(name) {
  if (name) { SET.theme = name; saveSet(); }
  const t = THM(); const R = document.documentElement;
  R.dataset.theme = SET.theme;
  R.style.setProperty('--fh', `'${t.fh}', Cinzel, serif`);
  R.style.setProperty('--fb', `'${t.fb}', Lora, Georgia, serif`);
  R.style.setProperty('--fd', SET.theme === 'pergamena' ? `'Cinzel Decorative', Cinzel, serif` : `'${t.fh}', Cinzel, serif`);
  buildIcons();
  if (typeof updateHUD === 'function' && typeof S !== 'undefined' && S && MODE !== 'title') { updateHUD(); if (typeof lastCards !== 'undefined') lastCards = ''; if (typeof BT !== 'undefined' && BT) updateBattleHUD(true); }
}

// ================= GL3D: mini WebGL renderer for real 3D buildings (isometric ortho, matches the 2D map) =================
const G3 = { cv: null, gl: null, prog: null, models: {}, ok: false };
const SHX = 0.44, SHY = -0.25; // ombra portata: direzione opposta al sole (in alto a sinistra), per unità di altezza
const ISO_H = 39.19; // pixels per tile of height (ortho camera at 30° elevation)
function b64u8(s) { const bin = atob(s); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
function g3init() {
  if (G3.gl || typeof M3D === 'undefined') return !!G3.gl;
  const cv = document.createElement('canvas'); cv.width = cv.height = 16;
  const gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
  if (!gl) return false;
  const vs = `attribute vec3 aP; attribute vec4 aN; attribute vec2 aU;
  uniform vec3 uMin, uSize; uniform mat2 uM; uniform vec2 uC; uniform float uS, uY0; uniform vec4 uRect; uniform float uD0; uniform float uSh;
  varying vec2 vU; varying vec3 vN;
  void main(){ vec3 p = uMin + aP * uSize; vec2 g = uC + uM * vec2(p.x, p.z) * uS; float h = (p.y - uY0) * uS;
    if (uSh > 0.5) { g += vec2(${SHX}, ${SHY}) * h; h = 0.0; }
    float X = (g.x - g.y) * 32.0, Y = (g.x + g.y) * 16.0 - h * ${ISO_H.toFixed(2)};
    float d = -(g.x + g.y) * 0.6124 - h * 0.5 - uD0;
    gl_Position = vec4((X - uRect.x) / uRect.z * 2.0 - 1.0, 1.0 - (Y - uRect.y) / uRect.w * 2.0, clamp(d / 12.0, -0.99, 0.99), 1.0);
    vec3 n = aN.xyz; vec2 nh = uM * vec2(n.x, n.z); vN = normalize(vec3(nh, n.y)); vU = aU; }`;
  const fs = `precision mediump float; varying vec2 vU; varying vec3 vN; uniform sampler2D uT; uniform vec3 uL; uniform float uShF;
  void main(){ if (uShF > 0.5) { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.3); return; } vec4 c = texture2D(uT, vU); vec3 n = normalize(vN); float dif = max(dot(n, uL), 0.0); float back = max(dot(n, -uL), 0.0) * 0.12;
    float sky = 0.5 + 0.5 * n.z; vec3 col = c.rgb * (0.66 + 0.16 * sky + 0.5 * dif + back); col = mix(vec3(dot(col, vec3(0.299,0.587,0.114))), col, 1.12);
    gl_FragColor = vec4(col, 1.0); }`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(pr)); return false; }
  G3.cv = cv; G3.gl = gl; G3.prog = pr;
  const U = n => gl.getUniformLocation(pr, n); G3.u = { min: U('uMin'), size: U('uSize'), M: U('uM'), C: U('uC'), S: U('uS'), Y0: U('uY0'), rect: U('uRect'), D0: U('uD0'), T: U('uT'), L: U('uL'), Sh: U('uSh'), ShF: U('uShF') };
  G3.a = { P: gl.getAttribLocation(pr, 'aP'), N: gl.getAttribLocation(pr, 'aN'), U: gl.getAttribLocation(pr, 'aU') };
  for (const k in M3D) { g3load(k, M3D[k]); delete M3D[k]; } for (const a in M3D_ALIAS) if (a !== 'mastio' && G3.models[M3D_ALIAS[a]]) G3.models[a] = G3.models[M3D_ALIAS[a]];
  return true;
}
// ---- caricamento a pezzi dei modelli 3D: si scarica solo ciò che serve, il resto con calma ----
const M3D_FILES = new Set(["catapulta3d", "ariete3d", "insegna", "lampione", "pozzogrande", "staccionata", "steccato", "cavallofrisia", "cassa", "anfora", "cassafieno", "botte", "cassaortaggi", "fontanella", "stenditoio", "mucchiosassi", "felce", "segnavia", "gonfalone", "rovinamuro", "arco", "colonna", "rovine", "lastricato", "muretto", "rastrelliera", "carriola", "pozzo", "carretto", "croce", "lanterna", "abete3d", "accademia", "armeria", "balista", "balista_b", "balista_c", "bottino", "cancello", "capanno", "casa", "caserma", "castello", "cava", "chiesa", "falo", "fattoria", "fucina", "generale", "granaio", "infermeria", "mercato", "miniera", "monastero", "municipio", "mura", "olmo3d", "palizzata", "poligono", "quercia3d", "spoglio3d", "taverna", "tenda", "tesoreria", "torre", "torrepietra", "tronco3d", "cripta", "castrum", "capanna", "scuderia", "anfiteatro", "templare"]);
const M3D_ALIAS = { mastio: 'castello', tronco: 'tronco3d' };
// il quartier generale è un Castrum di legno fino al livello 4, poi un Castellum di pietra
const m3k = b => b.t === 'mastio' ? ((b.lvl || (S && S.mastio) || 1) >= 5 ? 'castello' : 'castrum') : b.t;
const L3 = { state: {}, q: [], active: 0, max: 3, prefetch: [] };
function need3d(k, low) {
  k = M3D_ALIAS[k] && !M3D_FILES.has(k) ? M3D_ALIAS[k] : k; if (!M3D_FILES.has(k) || L3.state[k]) return; L3.state[k] = 'q';
  if (low) L3.prefetch.push(k); else L3.q.push(k); pump3d();
}
function pump3d() {
  while (L3.active < L3.max && (L3.q.length || (L3.prefetch.length && L3.active < 1))) {
    const k = L3.q.length ? L3.q.shift() : L3.prefetch.shift(); if (L3.state[k] !== 'q') continue; L3.state[k] = 'l'; L3.active++;
    const sc = document.createElement('script'); sc.src = 'm3d/' + k + '.js'; sc.async = true;
    sc.onload = () => { L3.state[k] = 'ok'; L3.active--; if (G3.gl && M3D[k]) { if (!G3.models[k]) g3load(k, M3D[k]); for (const a in M3D_ALIAS) if (M3D_ALIAS[a] === k && !G3.models[a] && a !== 'mastio') G3.models[a] = G3.models[k]; delete M3D[k]; } pump3d(); };
    sc.onerror = () => { L3.state[k] = 'err'; L3.active--; pump3d(); };
    document.head.appendChild(sc);
  }
}
// precarico gli edifici dell'era attuale (a bassa priorità) e quelli già costruiti (subito)
function prefetchEra() {
  if (!S) return; for (const r of S.buildings) { need3d(m3k(r)); if (BDEF[r.t] && BDEF[r.t].wall) need3d(r.lvl >= 2 ? 'mura' : 'palizzata'); }
  need3d('quercia3d'); need3d('abete3d'); need3d('lampione'); need3d('insegna'); need3d('olmo3d', true); need3d('spoglio3d', true);
  for (const t in BDEF) { try { if (maxB(t) > 0) need3d(t, true); } catch (e) { } }
  if (hasB('balista')) { need3d('balista_b', true); need3d('balista_c', true); }
}
function g3load(k, m) {
  const gl = G3.gl; const buf = (data, tgt) => { const b = gl.createBuffer(); gl.bindBuffer(tgt || gl.ARRAY_BUFFER, b); gl.bufferData(tgt || gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b; };
  const pos = new Uint16Array(b64u8(m.pos).buffer), nor = new Int8Array(b64u8(m.nor).buffer), uv = new Uint16Array(b64u8(m.uv).buffer), idx = new Uint16Array(b64u8(m.idx).buffer);
  const o = { m, pos: buf(pos), nor: buf(nor), uv: buf(uv), idx: buf(idx, gl.ELEMENT_ARRAY_BUFFER), count: idx.length, tex: null, ready: false };
  const texSrc = m.tex; o.m = { min: m.min, size: m.size, n: m.n };
  const img = new Image(); img.onload = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    o.tex = t; o.ready = true; }; img.src = texSrc;
  G3.models[k] = o;
}
// draws model k for building b into ctx c (world-screen coords). fit = footprint tiles the model should span
// due passate: prima l'ombra portata a terra (piatta, senza profondità), poi il modello sopra
function g3passes(gl, o) {
  if (QQ().sh) { gl.uniform1f(G3.u.Sh, 1); gl.uniform1f(G3.u.ShF, 1); gl.disable(gl.DEPTH_TEST); gl.depthMask(false); gl.drawElements(gl.TRIANGLES, o.count, gl.UNSIGNED_SHORT, 0); }
  gl.uniform1f(G3.u.Sh, 0); gl.uniform1f(G3.u.ShF, 0); gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.drawElements(gl.TRIANGLES, o.count, gl.UNSIGNED_SHORT, 0);
}
function g3draw(c, b, k, fit, yaw) {
  if (!g3init()) return false; const o = G3.models[k]; if (!o || !o.ready) return false; const gl = G3.gl, m = o.m;
  const sx = m.size[0], sz = m.size[2]; const S = fit / Math.max(sx, sz);
  // facing: model +Z (front) -> world (+1,+1)/√2, model +X -> world (1,-1)/√2 ; then map rotation
  const f = Math.SQRT1_2; const F = [f, -f, f, f]; // columns: x-> (f,-f)? we want x->(f,-f), z->(f,f)
  const R = [RC, RS_, -RS_, RC]; // rotV as matrix (column-major: col0=(RC,RS_), col1=(-RS_,RC))
  // M = R * F (column-major 2x2)
  let F2 = F; if (yaw) { const cy = Math.cos(yaw), sy = Math.sin(yaw); F2 = [F[0] * cy + F[2] * sy, F[1] * cy + F[3] * sy, -F[0] * sy + F[2] * cy, -F[1] * sy + F[3] * cy]; }
  const M = [R[0] * F2[0] + R[2] * F2[1], R[1] * F2[0] + R[3] * F2[1], R[0] * F2[2] + R[2] * F2[3], R[1] * F2[2] + R[3] * F2[3]];
  const cen = rotP(b.x + b.w / 2, b.y + b.h / 2); const y0 = m.min[1];
  // screen bounds from bbox corners
  let x0 = 1e9, y0s = 1e9, x1 = -1e9, y1 = -1e9;
  for (const ax of [m.min[0], m.min[0] + sx]) for (const az of [m.min[2], m.min[2] + sz]) for (const ay of [m.min[1], m.min[1] + m.size[1]]) {
    const gx = cen[0] + (M[0] * ax + M[2] * az) * S, gy = cen[1] + (M[1] * ax + M[3] * az) * S, h = (ay - y0) * S;
    const X = (gx - gy) * 32, Y = (gx + gy) * 16 - h * ISO_H; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0s = Math.min(y0s, Y); y1 = Math.max(y1, Y);
    const sgx = gx + SHX * h, sgy = gy + SHY * h, SX = (sgx - sgy) * 32, SY = (sgx + sgy) * 16; x0 = Math.min(x0, SX); x1 = Math.max(x1, SX); y0s = Math.min(y0s, SY); y1 = Math.max(y1, SY);
  }
  x0 -= 4; y0s -= 4; x1 += 4; y1 += 4; const rw = x1 - x0, rh = y1 - y0s;
  const res = Math.min(2.5, cam.z * DPR * 1.15); const key = ANG.toFixed(4) + '|' + res.toFixed(2) + '|' + k + '|' + (yaw || 0).toFixed(3) + QQ().sh;
  if (b.c3k === key && b.c3cv) { c.drawImage(b.c3cv, x0, y0s, rw, rh); b.r3d = [x0, y0s, rw, rh]; return true; } const W = Math.min(2048, Math.ceil(rw * res)), H = Math.min(2048, Math.ceil(rh * res));
  if (G3.cv.width !== W || G3.cv.height !== H) { G3.cv.width = W; G3.cv.height = H; }
  gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(G3.prog);
  const u = G3.u; gl.uniform3fv(u.min, m.min); gl.uniform3fv(u.size, m.size); gl.uniformMatrix2fv(u.M, false, M); gl.uniform2f(u.C, cen[0], cen[1]);
  gl.uniform1f(u.S, S); gl.uniform1f(u.Y0, y0); gl.uniform4f(u.rect, x0, y0s, rw, rh); gl.uniform1f(u.D0, -(cen[0] + cen[1]) * 0.6124);
  const L = [-0.45, 0.25, 0.86], ll = Math.hypot(...L); gl.uniform3f(u.L, L[0] / ll, L[1] / ll, L[2] / ll);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, o.tex); gl.uniform1i(u.T, 0);
  const A = G3.a;
  gl.bindBuffer(gl.ARRAY_BUFFER, o.pos); gl.enableVertexAttribArray(A.P); gl.vertexAttribPointer(A.P, 3, gl.UNSIGNED_SHORT, true, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, o.nor); gl.enableVertexAttribArray(A.N); gl.vertexAttribPointer(A.N, 4, gl.BYTE, true, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, o.uv); gl.enableVertexAttribArray(A.U); gl.vertexAttribPointer(A.U, 2, gl.UNSIGNED_SHORT, true, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.idx); g3passes(gl, o);
  if (!b.c3cv) b.c3cv = document.createElement('canvas'); if (b.c3cv.width !== W || b.c3cv.height !== H) { b.c3cv.width = W; b.c3cv.height = H; } const cc = b.c3cv.getContext('2d'); cc.clearRect(0, 0, W, H); cc.drawImage(G3.cv, 0, 0); b.c3k = key;
  c.drawImage(b.c3cv, x0, y0s, rw, rh);
  b.r3d = [x0, y0s, rw, rh];
  return true;
}
// sprite 3D condiviso (alberi): renderizza il modello k centrato sull'origine; cache per angolo/zoom quantizzati
const G3S = {};
function g3sprite(k, hpx, yaw, tint) {
  if (!g3init()) return null; const o = G3.models[k]; if (!o || !o.ready) return null; const gl = G3.gl, m = o.m;
  const aq = 0, res = Math.pow(2, Math.round(Math.log2(Math.max(0.3, Math.min(2.5, cam.z * DPR * 1.1))) * 2) / 2);
  const key = k + '|' + hpx + '|' + yaw + '|' + (tint || 0) + '|' + aq.toFixed(2) + '|' + res; const e = G3S[k + '|' + hpx + '|' + yaw + '|' + (tint || 0)];
  if (e && e.key === key) return e;
  const S = hpx / (m.size[1] * ISO_H); const f = Math.SQRT1_2, F = [f, -f, f, f]; const rc = Math.cos(aq), rs = Math.sin(aq); const R = [rc, rs, -rs, rc];
  const cy = Math.cos(yaw), sy = Math.sin(yaw); const F2 = [F[0] * cy + F[2] * sy, F[1] * cy + F[3] * sy, -F[0] * sy + F[2] * cy, -F[1] * sy + F[3] * cy];
  const M = [R[0] * F2[0] + R[2] * F2[1], R[1] * F2[0] + R[3] * F2[1], R[0] * F2[2] + R[2] * F2[3], R[1] * F2[2] + R[3] * F2[3]];
  // centra il tronco (centro della base) sull'origine
  const mx = m.min[0] + m.size[0] / 2, mz = m.min[2] + m.size[2] / 2;
  const C0 = [-(M[0] * mx + M[2] * mz) * S, -(M[1] * mx + M[3] * mz) * S];
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const ax of [m.min[0], m.min[0] + m.size[0]]) for (const az of [m.min[2], m.min[2] + m.size[2]]) for (const ay of [m.min[1], m.min[1] + m.size[1]]) {
    const gx = C0[0] + (M[0] * ax + M[2] * az) * S, gy = C0[1] + (M[1] * ax + M[3] * az) * S, h = (ay - m.min[1]) * S;
    const X = (gx - gy) * 32, Y = (gx + gy) * 16 - h * ISO_H; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
    const sgx = gx + SHX * h, sgy = gy + SHY * h, SX = (sgx - sgy) * 32, SY = (sgx + sgy) * 16; x0 = Math.min(x0, SX); x1 = Math.max(x1, SX); y0 = Math.min(y0, SY); y1 = Math.max(y1, SY); }
  x0 -= 2; y0 -= 2; x1 += 2; y1 += 2; const rw = x1 - x0, rh = y1 - y0; const W = Math.min(1024, Math.ceil(rw * res)), H = Math.min(1024, Math.ceil(rh * res));
  if (G3.cv.width !== W || G3.cv.height !== H) { G3.cv.width = W; G3.cv.height = H; }
  gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(G3.prog);
  const u = G3.u; gl.uniform3fv(u.min, m.min); gl.uniform3fv(u.size, m.size); gl.uniformMatrix2fv(u.M, false, M); gl.uniform2f(u.C, C0[0], C0[1]);
  gl.uniform1f(u.S, S); gl.uniform1f(u.Y0, m.min[1]); gl.uniform4f(u.rect, x0, y0, rw, rh); gl.uniform1f(u.D0, 0);
  const L = [-0.45, 0.25, 0.86], ll = Math.hypot(...L); gl.uniform3f(u.L, L[0] / ll, L[1] / ll, L[2] / ll);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, o.tex); gl.uniform1i(u.T, 0); const A = G3.a;
  gl.bindBuffer(gl.ARRAY_BUFFER, o.pos); gl.enableVertexAttribArray(A.P); gl.vertexAttribPointer(A.P, 3, gl.UNSIGNED_SHORT, true, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, o.nor); gl.enableVertexAttribArray(A.N); gl.vertexAttribPointer(A.N, 4, gl.BYTE, true, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, o.uv); gl.enableVertexAttribArray(A.U); gl.vertexAttribPointer(A.U, 2, gl.UNSIGNED_SHORT, true, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.idx); g3passes(gl, o);
  const sp = e || {}; if (!sp.cv) sp.cv = document.createElement('canvas'); if (sp.cv.width !== W || sp.cv.height !== H) { sp.cv.width = W; sp.cv.height = H; }
  const cc = sp.cv.getContext('2d'); cc.globalCompositeOperation = 'source-over'; cc.clearRect(0, 0, W, H); cc.drawImage(G3.cv, 0, 0);
  if (tint) { cc.globalCompositeOperation = 'source-atop'; cc.fillStyle = tint; cc.fillRect(0, 0, W, H); cc.globalCompositeOperation = 'source-over'; }
  Object.assign(sp, { key, x0, y0, w: rw, h: rh }); G3S[k + '|' + hpx + '|' + yaw + '|' + (tint || 0)] = sp; return sp;
}
const TREE3D = { olmo: { k: 'olmo3d', h: 100 }, spoglio: { k: 'spoglio3d', h: 88 }, quercia: { k: 'quercia3d', h: 92, tints: [0, 'rgba(60,55,10,0.14)', 'rgba(70,50,10,0.26)'] }, abete: { k: 'abete3d', h: 104, tints: [0, 'rgba(10,25,20,0.14)', 'rgba(10,25,20,0.28)'] } };
const bareKind = o => { const h = (((o.x * 7919) | 0) ^ ((o.y * 104729) | 0)) >>> 0; const v = h % 100; return v < 3 ? 'spoglio' : v < 6 ? 'olmo' : null; };
function drawTree3D(c, o, wx, wy) {
  const bk = bareKind(o); if (bk) { const d = TREE3D[bk]; if (!G3.models[d.k]) need3d(d.k); if (G3.models[d.k] && G3.models[d.k].ready) { const yaw = [0, 1.6, 3.1, 4.7][(((o.x * 13 + o.y * 7) | 0) >>> 0) % 4]; const sp = g3sprite(d.k, d.h, yaw, S && MODE === 'village' && seasonInfo().s.k === 'inverno' ? 'rgba(236,242,250,0.35)' : 0); if (sp) { const k2 = o.s; c.fillStyle = 'rgba(0,0,0,0.16)'; c.beginPath(); c.ellipse(wx, wy, 20 * k2, 8 * k2, 0, 0, 7); c.fill(); c.drawImage(sp.cv, wx + sp.x0 * k2, wy + sp.y0 * k2, sp.w * k2, sp.h * k2); return true; } } }
  const kind = (o.k % 6) < 3 ? 'abete' : 'quercia', d = TREE3D[kind]; if (!G3.models[d.k]) need3d(d.k); if (!G3.models[d.k] || !G3.models[d.k].ready) return false;
  const hsh = ((o.x * 13 + o.y * 7) | 0) >>> 0; const yaw = kind === 'quercia' ? [0, 0.4, -0.4, 3.14][hsh % 4] : [0, 2.1, 4.2][hsh % 3]; const sz = 1.1;
  const sp = g3sprite(d.k, Math.round(d.h * sz), yaw, treeSeasonTint(kind, d.tints[o.k % 3], o.k % 3)); if (!sp) return false;
  const k2 = o.s / sz; c.fillStyle = 'rgba(0,0,0,0.2)'; c.beginPath(); c.ellipse(wx, wy, 24 * o.s * (kind === 'quercia' ? 1.3 : 0.9), 10 * o.s * (kind === 'quercia' ? 1.3 : 0.9), 0, 0, 7); c.fill();
  c.drawImage(sp.cv, wx + sp.x0 * k2, wy + sp.y0 * k2, sp.w * k2, sp.h * k2); return true;
}
// ================= ART: procedural isometric buildings, trees, ground =================
const TW = 64, TH = 32, RS = 2;
function isoP(u, v, z) { return [(u - v) * TW / 2, (u + v) * TH / 2 - (z || 0)]; }
// ---- view rotation (4 steps of 90°) ----
// continuous angle ANG (radians) around the map centre; buildings/units are upright billboards
let ANG = 0, RC = 1, RS_ = 0; const NMAP = 96, MC = 48, OFF = 32;
function setAng(a) { ANG = a; RC = Math.cos(a); RS_ = Math.sin(a); }
function rstep() { return ((Math.round(ANG / (Math.PI / 2)) % 4) + 4) % 4; }
function rotP(x, y) { const dx = x - MC, dy = y - MC; return [MC + dx * RC - dy * RS_, MC + dx * RS_ + dy * RC]; }
function rotPinv(x, y) { const dx = x - MC, dy = y - MC; return [MC + dx * RC + dy * RS_, MC - dx * RS_ + dy * RC]; }
function rotV(dx, dy) { return [dx * RC - dy * RS_, dx * RS_ + dy * RC]; }
function rotVinv(dx, dy) { return [dx * RC + dy * RS_, -dx * RS_ + dy * RC]; }
function rotMask(m) { for (let i = 0; i < rstep(); i++) m = (m & 1 ? 4 : 0) | (m & 2 ? 8 : 0) | (m & 4 ? 2 : 0) | (m & 8 ? 1 : 0); return m; }
function vRect(b) { const c = rotP(b.x + b.w / 2, b.y + b.h / 2); const sw = rstep() % 2 ? [b.h, b.w] : [b.w, b.h]; return [c[0] - sw[0] / 2, c[1] - sw[1] / 2, sw[0], sw[1]]; }
// affine transform: source pixels (unit px per tile, top-down) -> current isometric world
function tileTransform(c, unit) { const o = W(0, 0), p = W(1, 0), q = W(0, 1); c.transform((p[0] - o[0]) / unit, (p[1] - o[1]) / unit, (q[0] - o[0]) / unit, (q[1] - o[1]) / unit, o[0], o[1]); }
function WR(x, y) { return [(x - y) * TW / 2, (x + y) * TH / 2]; }
function W(x, y) { const p = rotP(x, y); return WR(p[0], p[1]); }
function rng(seed) { let s = (seed >>> 0) % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function shade(h, f, a) { const [r, g, b] = hexRgb(h); const c = v => Math.max(0, Math.min(255, Math.round(v * f))); return a == null ? `rgb(${c(r)},${c(g)},${c(b)})` : `rgba(${c(r)},${c(g)},${c(b)},${a})`; }
function poly(c, pts, fill, stroke, lw) {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1; c.stroke(); }
}
const COL = {
  wood: '#7a5230', dwood: '#55381f', log: '#6e4a2a', thatch: '#b38a3e', shingle: '#5e4128', stone: '#99928a',
  wstone: '#cdc6b6', plaster: '#cdb68c', tile: '#8a3b2a', mud: '#5f4b31', water: '#3d4a3f', crimson: '#8f1d1d',
  blue: '#1e3a8a', gold: '#c9a227', canvas: '#cbb68e', iron: '#4b4b4b', hay: '#c8a64a', grass: '#6b7a3a'
};
const EDGE = 'rgba(28,18,8,0.55)';

// texture a vertical face. A,B = [u,v] ground endpoints; face from z0 to z1
function texFace(c, A, B, z0, z1, tex, seed, base) {
  const pts = [isoP(A[0], A[1], z0), isoP(B[0], B[1], z0), isoP(B[0], B[1], z1), isoP(A[0], A[1], z1)];
  c.save(); poly(c, pts); c.clip();
  const R = rng(seed || 7);
  const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const L = (t, z) => isoP(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z);
  if (tex === 'log') {
    for (let z = z0; z < z1; z += 5) {
      const a = L(0, z), b = L(1, z);
      c.strokeStyle = 'rgba(30,18,6,0.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
      const a2 = L(0, z + 2.5), b2 = L(1, z + 2.5);
      c.strokeStyle = 'rgba(255,220,170,0.13)'; c.beginPath(); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke();
    }
  } else if (tex === 'plank') {
    const n = Math.max(2, Math.round(len * 7));
    for (let i = 1; i < n; i++) {
      const t = i / n, a = L(t, z0), b = L(t, z1);
      c.strokeStyle = 'rgba(30,18,6,0.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    }
    for (let i = 0; i < n; i++) { if (R() < 0.35) { const t = (i + 0.5) / n, a = L(t, z0); c.fillStyle = 'rgba(0,0,0,0.06)'; poly(c, [L(i / n, z0), L((i + 1) / n, z0), L((i + 1) / n, z1), L(i / n, z1)], 'rgba(0,0,0,' + (0.04 + R() * 0.08) + ')'); } }
  } else if (tex === 'stone') {
    let row = 0;
    for (let z = z0; z < z1; z += 6, row++) {
      const n = Math.max(2, Math.round(len * 4));
      for (let i = 0; i < n + 1; i++) {
        const t0 = Math.max(0, (i - (row % 2) * 0.5) / n), t1 = Math.min(1, (i + 1 - (row % 2) * 0.5) / n);
        if (t1 <= t0) continue;
        const v = R();
        poly(c, [L(t0, z), L(t1, z), L(t1, z + 6), L(t0, z + 6)], v < 0.5 ? `rgba(0,0,0,${0.03 + v * 0.12})` : `rgba(255,250,235,${(v - 0.5) * 0.18})`, 'rgba(40,35,30,0.35)', 0.8);
      }
    }
    // moss
    for (let i = 0; i < len * 3; i++) { const p = L(R(), z0 + R() * 8); c.fillStyle = 'rgba(70,95,40,0.35)'; c.beginPath(); c.arc(p[0], p[1], 1 + R() * 2.2, 0, 7); c.fill(); }
  } else if (tex === 'plaster') {
    for (let i = 0; i < len * 10; i++) { const p = L(R(), z0 + R() * (z1 - z0)); c.fillStyle = `rgba(80,60,30,${R() * 0.15})`; c.fillRect(p[0], p[1], 2 + R() * 3, 1 + R() * 2); }
    // timber frame
    c.strokeStyle = shade(COL.dwood, 1); c.lineWidth = 1.8;
    const a = L(0, z1 - 1), b = L(1, z1 - 1); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    const nn = Math.max(1, Math.round(len * 2));
    for (let i = 0; i <= nn; i++) { const p = L(i / nn, z0), q = L(i / nn, z1); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
    if (len > 0.8) { const p = L(0, z0), q = L(0.5, z1); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
  }
  // grime at bottom
  const g0 = L(0, z0), g1 = L(1, z0);
  c.strokeStyle = 'rgba(40,30,15,0.35)'; c.lineWidth = 4; c.beginPath(); c.moveTo(g0[0], g0[1]); c.lineTo(g1[0], g1[1]); c.stroke();
  c.restore();
}
function prism(c, u0, v0, u1, v1, z0, z1, base, tex, seed, topCol) {
  const L = [isoP(u0, v1, z0), isoP(u1, v1, z0), isoP(u1, v1, z1), isoP(u0, v1, z1)];
  const R = [isoP(u1, v1, z0), isoP(u1, v0, z0), isoP(u1, v0, z1), isoP(u1, v1, z1)];
  const T = [isoP(u0, v0, z1), isoP(u1, v0, z1), isoP(u1, v1, z1), isoP(u0, v1, z1)];
  poly(c, L, shade(base, 0.95)); if (tex) texFace(c, [u0, v1], [u1, v1], z0, z1, tex, seed, base);
  poly(c, R, shade(base, 0.7)); if (tex) texFace(c, [u1, v1], [u1, v0], z0, z1, tex, (seed || 1) + 3, base);
  poly(c, T, topCol || shade(base, 1.15));
  poly(c, L, null, EDGE, 1); poly(c, R, null, EDGE, 1); poly(c, T, null, EDGE, 1);
  // log ends at front corner
  if (tex === 'log') {
    for (let z = z0 + 2.5; z < z1; z += 5) { const p = isoP(u1, v1, z); c.fillStyle = '#a07a4c'; c.beginPath(); c.ellipse(p[0], p[1], 2.6, 2.3, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(40,25,10,.6)'; c.lineWidth = 0.7; c.stroke(); }
  }
}
function thatchTex(c, pts, seed, base) {
  c.save(); poly(c, pts); c.clip(); const R = rng(seed);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  for (let i = 0; i < (x1 - x0) * (y1 - y0) / 9; i++) {
    const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0);
    c.strokeStyle = R() < 0.5 ? 'rgba(60,40,10,0.35)' : 'rgba(255,230,160,0.25)'; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + (R() - 0.5) * 2, y + 3 + R() * 3); c.stroke();
  }
  c.restore();
}
function shingleTex(c, pts, seed) {
  c.save(); poly(c, pts); c.clip(); const R = rng(seed);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  for (let y = y0; y < y1; y += 4) { c.strokeStyle = 'rgba(20,10,5,0.35)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let x = x0 + (y % 8 ? 3 : 0); x < x1; x += 6) { if (R() < 0.3) { c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(x, y, 5, 4); } } }
  c.restore();
}
function roofTex(c, pts, tex, seed) { if (tex === 'thatch') thatchTex(c, pts, seed); else if (tex === 'shingle' || tex === 'tile') shingleTex(c, pts, seed); }
function pyramid(c, u0, v0, u1, v1, z, h, base, tex, seed) {
  const o = 0.14, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2, A = isoP(cu, cv, z + h);
  const c00 = isoP(u0 - o, v0 - o, z), c10 = isoP(u1 + o, v0 - o, z), c11 = isoP(u1 + o, v1 + o, z), c01 = isoP(u0 - o, v1 + o, z);
  const faces = [[[c00, c10, A], 1.05], [[c00, c01, A], 1.0], [[c01, c11, A], 0.95], [[c11, c10, A], 0.72]];
  for (const [p, f] of faces) { poly(c, p, shade(base, f)); roofTex(c, p, tex, seed++); poly(c, p, null, EDGE, 1); }
}
function gable(c, u0, v0, u1, v1, z, h, base, axis, tex, seed, wall) {
  const o = 0.14, cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  if (axis === 'u') {
    const r0 = isoP(u0 - o, cv, z + h), r1 = isoP(u1 + o, cv, z + h);
    const back = [isoP(u0 - o, v0 - o, z), isoP(u1 + o, v0 - o, z), r1, r0];
    const front = [isoP(u0 - o, v1 + o, z), isoP(u1 + o, v1 + o, z), r1, r0];
    poly(c, back, shade(base, 1.08)); roofTex(c, back, tex, seed); poly(c, back, null, EDGE);
    const end = [isoP(u1, v0, z), isoP(u1, v1, z), isoP(u1, cv, z + h)]; poly(c, end, shade(wall || COL.wood, 0.7), EDGE);
    poly(c, front, shade(base, 0.92)); roofTex(c, front, tex, seed + 1); poly(c, front, null, EDGE);
    c.strokeStyle = shade(base, 0.6); c.lineWidth = 2; c.beginPath(); c.moveTo(r0[0], r0[1]); c.lineTo(r1[0], r1[1]); c.stroke();
  } else {
    const r0 = isoP(cu, v0 - o, z + h), r1 = isoP(cu, v1 + o, z + h);
    const back = [isoP(u0 - o, v0 - o, z), isoP(u0 - o, v1 + o, z), r1, r0];
    const front = [isoP(u1 + o, v0 - o, z), isoP(u1 + o, v1 + o, z), r1, r0];
    poly(c, back, shade(base, 1.08)); roofTex(c, back, tex, seed); poly(c, back, null, EDGE);
    const end = [isoP(u0, v1, z), isoP(u1, v1, z), isoP(cu, v1, z + h)]; poly(c, end, shade(wall || COL.wood, 0.95), EDGE);
    poly(c, front, shade(base, 0.72)); roofTex(c, front, tex, seed + 1); poly(c, front, null, EDGE);
    c.strokeStyle = shade(base, 0.6); c.lineWidth = 2; c.beginPath(); c.moveTo(r0[0], r0[1]); c.lineTo(r1[0], r1[1]); c.stroke();
  }
}
function groundPlot(c, w, h, col, inset) {
  const i = inset == null ? 0.06 : inset;
  poly(c, [isoP(i, i), isoP(w - i, i), isoP(w - i, h - i), isoP(i, h - i)], col || 'rgba(92,72,45,0.55)');
}
function logPost(c, u, v, z0, len, r, col, sharp) {
  const [x, y] = isoP(u, v, z0);
  const g = c.createLinearGradient(x - r, 0, x + r, 0);
  g.addColorStop(0, shade(col, 1.15)); g.addColorStop(0.5, shade(col, 0.95)); g.addColorStop(1, shade(col, 0.55));
  c.fillStyle = g; c.beginPath(); c.moveTo(x - r, y); c.lineTo(x - r, y - len); if (sharp) c.lineTo(x, y - len - r * 2.2); c.lineTo(x + r, y - len); c.lineTo(x + r, y); c.ellipse(x, y, r, r * 0.5, 0, 0, Math.PI); c.closePath(); c.fill();
  c.strokeStyle = EDGE; c.lineWidth = 0.7; c.stroke();
}
function door(c, u, v, face, z, wdt, hgt, col) { // face 'L' (v const) or 'R' (u const)
  const pts = face === 'L' ? [isoP(u, v, z), isoP(u + wdt, v, z), isoP(u + wdt, v, z + hgt), isoP(u, v, z + hgt)] : [isoP(u, v, z), isoP(u, v - wdt, z), isoP(u, v - wdt, z + hgt), isoP(u, v, z + hgt)];
  poly(c, pts, col || '#2b1a0d', 'rgba(0,0,0,.6)', 1);
}
function windowS(c, u, v, face, z, s) { door(c, u, v, face, z, s || 0.12, 6, '#1d140b'); }
function banner(c, u, v, z, h, col, emblem) {
  const [x, y] = isoP(u, v, z);
  c.strokeStyle = '#3a2a18'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke();
  c.fillStyle = col; c.beginPath(); c.moveTo(x, y - h + 1); c.quadraticCurveTo(x + 9, y - h - 2, x + 18, y - h + 2); c.lineTo(x + 15, y - h + 7); c.lineTo(x + 18, y - h + 12); c.quadraticCurveTo(x + 9, y - h + 8, x, y - h + 11); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = .6; c.stroke();
  if (emblem) { c.fillStyle = COL.gold; c.font = 'bold 7px serif'; c.fillText(emblem, x + 6, y - h + 9); }
}
function battlements(c, u0, v0, u1, v1, z, base) {
  const n1 = Math.round((u1 - u0) / 0.28), n2 = Math.round((v1 - v0) / 0.28);
  for (let i = 0; i < n1; i += 2) { const a = u0 + i * (u1 - u0) / n1; prism(c, a, v0, a + (u1 - u0) / n1, v0 + 0.16, z, z + 6, base); }
  for (let i = 0; i < n2; i += 2) { const a = v0 + i * (v1 - v0) / n2; prism(c, u0, a, u0 + 0.16, a + (v1 - v0) / n2, z, z + 6, base); }
  for (let i = 0; i < n2; i += 2) { const a = v0 + i * (v1 - v0) / n2; prism(c, u1 - 0.16, a, u1, a + (v1 - v0) / n2, z, z + 6, base); }
  for (let i = 0; i < n1; i += 2) { const a = u0 + i * (u1 - u0) / n1; prism(c, a, v1 - 0.16, a + (u1 - u0) / n1, v1, z, z + 6, base); }
}
function sack(c, u, v, col) { const [x, y] = isoP(u, v, 0); c.fillStyle = col || '#bfa676'; c.beginPath(); c.ellipse(x, y - 4, 4.5, 5, 0, 0, 7); c.fill(); c.strokeStyle = EDGE; c.lineWidth = .7; c.stroke(); }
function logPile(c, u, v) {
  for (let r = 0; r < 3; r++) for (let i = 0; i < 3 - r; i++) {
    const [x, y] = isoP(u + i * 0.16 + r * 0.08, v, r * 4.5 + 3);
    c.fillStyle = '#6a4626'; c.fillRect(x - 12, y - 2.5, 12, 5);
    c.fillStyle = '#b88f5c'; c.beginPath(); c.ellipse(x, y, 2.6, 2.6, 0, 0, 7); c.fill(); c.strokeStyle = '#4a2f18'; c.lineWidth = .6; c.stroke();
  }
}

// ---- building painters: (c, b, opts) draws in local footprint coords ----
const PAINT = {
  mastio(c, lvl, s) {
    const R = rng(s);
    if (lvl <= 4) {
      // muddy moat ring
      poly(c, [isoP(0.05, 0.05), isoP(2.95, 0.05), isoP(2.95, 2.95), isoP(0.05, 2.95)], 'rgba(70,58,36,0.85)');
      poly(c, [isoP(0.3, 0.3), isoP(2.7, 0.3), isoP(2.7, 2.7), isoP(0.3, 2.7)], 'rgba(55,70,60,0.85)');
      poly(c, [isoP(0.45, 0.45), isoP(2.55, 0.45), isoP(2.55, 2.55), isoP(0.45, 2.55)], '#6c5a3c');
      const h = 58 + lvl * 12;
      if (lvl >= 3) { prism(c, 1.9, 1.75, 2.55, 2.5, 0, 20, COL.wood, 'plank', s + 4); gable(c, 1.9, 1.75, 2.55, 2.5, 20, 12, COL.thatch, 'v', 'thatch', s + 9); }
      prism(c, 0.75, 0.75, 2.05, 2.05, 0, h, COL.log, 'log', s);
      door(c, 1.2, 2.05, 'L', 0, 0.35, 16);
      windowS(c, 1.5, 2.05, 'L', h - 22); windowS(c, 2.05, 1.5, 'R', h - 22);
      prism(c, 0.6, 0.6, 2.2, 2.2, h, h + 6, COL.dwood, 'plank', s + 2);
      for (let i = 0; i < 6; i++) { logPost(c, 0.62 + i * 0.315, 2.2, h + 6, 7, 1.6, COL.log, false); }
      for (let i = 0; i < 6; i++) { logPost(c, 2.2, 0.62 + i * 0.315, h + 6, 7, 1.6, COL.log, false); }
      pyramid(c, 0.75, 0.75, 2.05, 2.05, h + 13, 30 + lvl * 3, COL.thatch, 'thatch', s + 7);
      if (lvl >= 2) banner(c, 1.4, 1.4, h + 40 + lvl * 3, 22, COL.crimson);
      if (lvl >= 4) { for (let i = 0; i < 7; i++) logPost(c, 0.35 + i * 0.36, 2.75, 0, 14, 1.8, COL.log, true); }
    } else {
      poly(c, [isoP(0.1, 0.1), isoP(2.9, 0.1), isoP(2.9, 2.9), isoP(0.1, 2.9)], '#706657');
      const e = lvl - 5, base = lvl >= 7 ? COL.wstone : COL.stone;
      const bh = 26 + e * 5;
      prism(c, 0.3, 0.3, 2.7, 2.7, 0, bh, COL.stone, 'stone', s);
      battlements(c, 0.3, 0.3, 2.7, 2.7, bh, COL.stone);
      door(c, 1.25, 2.7, 'L', 0, 0.45, 18, '#3a2410');
      const th = 50 + e * 12;
      prism(c, 0.8, 0.8, 2.2, 2.2, bh, bh + th, base, 'stone', s + 5);
      windowS(c, 1.35, 2.2, 'L', bh + th - 20, 0.1); windowS(c, 1.65, 2.2, 'L', bh + th - 20, 0.1); windowS(c, 2.2, 1.5, 'R', bh + th - 20, 0.1);
      battlements(c, 0.8, 0.8, 2.2, 2.2, bh + th, base);
      if (lvl >= 6) { pyramid(c, 1.1, 1.1, 1.9, 1.9, bh + th, 24, COL.tile, 'tile', s + 3); }
      if (lvl >= 7) {
        for (const [a, b2] of [[0.15, 2.25], [2.25, 2.25], [2.25, 0.15]]) { prism(c, a, b2, a + 0.6, b2 + 0.6, 0, bh + 22, base, 'stone', s + a * 10); pyramid(c, a, b2, a + 0.6, b2 + 0.6, bh + 22, 20, COL.tile, 'tile', s + 2); }
      }
      banner(c, 1.5, 1.5, bh + th + (lvl >= 6 ? 24 : 6), 26, COL.blue, '♔');
    }
  },
  fattoria(c, lvl, s) {
    groundPlot(c, 2, 2, '#6d5634');
    for (let i = 0; i < 6; i++) { const u = 0.95 + i * 0.17; poly(c, [isoP(u, 0.1), isoP(u + 0.1, 0.1), isoP(u + 0.1, 1.9), isoP(u, 1.9)], i % 2 ? '#b89a3c' : '#7f8f3a'); }
    for (let i = 0; i < 40; i++) { const R = rng(s + i); const [x, y] = isoP(0.95 + R() * 1.0, 0.15 + R() * 1.75, 0); c.strokeStyle = '#d6bf5a'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (R() - .5) * 2, y - 5 - R() * 3); c.stroke(); }
    prism(c, 0.15, 0.25, 0.85, 1.15, 0, 18, COL.plaster, 'plaster', s);
    door(c, 0.35, 1.15, 'L', 0, 0.22, 12);
    gable(c, 0.15, 0.25, 0.85, 1.15, 18, 16, COL.thatch, 'v', 'thatch', s + 3, COL.plaster);
    sack(c, 0.4, 1.55); sack(c, 0.6, 1.6, '#a88f5f');
    if (lvl >= 2) for (let i = 0; i < 6; i++) logPost(c, 1.95, 0.15 + i * 0.33, 0, 8, 1.1, COL.dwood);
    if (lvl >= 3) { prism(c, 0.2, 1.4, 0.6, 1.85, 0, 10, COL.wood, 'plank', s + 8); }
  },
  capanna(c, lvl, s) {
    groundPlot(c, 2, 2, '#5d4a2e');
    prism(c, 0.25, 0.3, 1.35, 1.25, 0, 20 + lvl * 2, COL.log, 'log', s);
    door(c, 0.55, 1.25, 'L', 0, 0.25, 13);
    gable(c, 0.25, 0.3, 1.35, 1.25, 20 + lvl * 2, 15, COL.shingle, 'u', 'shingle', s + 2, COL.log);
    logPile(c, 1.25, 1.65);
    const [x, y] = isoP(1.6, 0.75, 0); c.fillStyle = '#8a6a44'; c.beginPath(); c.ellipse(x, y - 3, 6, 3, 0, 0, 7); c.fill(); c.fillStyle = '#5a3d22'; c.fillRect(x - 6, y - 3, 12, 4); c.fillStyle = '#b39066'; c.beginPath(); c.ellipse(x, y - 4, 6, 3, 0, 0, 7); c.fill();
    if (lvl >= 2) logPile(c, 0.3, 1.7);
  },
  miniera(c, lvl, s) {
    groundPlot(c, 2, 2, '#5b5040');
    const R = rng(s);
    const pts = []; for (let i = 0; i < 14; i++) { const a = Math.PI * (i / 13); const rr = 1 + R() * 0.15; const [x, y] = isoP(1 - Math.cos(a) * 0.85 * rr, 0.8 - Math.cos(a) * 0.1, Math.sin(a) * (32 + lvl * 4) * rr); pts.push([x, y]); }
    pts.push(isoP(1.85, 1.0, 0)); pts.push(isoP(0.15, 1.0, 0));
    poly(c, pts, '#7d7363', EDGE); thatchTex(c, pts, s);
    // entrance frame
    const [ex, ey] = isoP(1.0, 1.05, 0);
    c.fillStyle = '#140d07'; c.beginPath(); c.moveTo(ex - 9, ey); c.lineTo(ex - 9, ey - 16); c.lineTo(ex + 9, ey - 16); c.lineTo(ex + 9, ey); c.fill();
    logPost(c, 0.8, 1.25, 0, 18, 1.8, COL.wood); logPost(c, 1.25, 0.85, 0, 18, 1.8, COL.wood);
    c.strokeStyle = COL.wood; c.lineWidth = 3.2; const a = isoP(0.78, 1.27, 18), b = isoP(1.27, 0.83, 18); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    // cart
    prism(c, 1.3, 1.35, 1.75, 1.75, 4, 11, COL.dwood, 'plank', s + 3);
    for (let i = 0; i < 6; i++) { const [x, y] = isoP(1.4 + R() * 0.3, 1.45 + R() * 0.25, 12); c.fillStyle = R() < .5 ? '#e8c34a' : '#c49a2a'; c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); }
    for (const [u, v] of [[1.35, 1.75], [1.75, 1.4]]) { const [x, y] = isoP(u, v, 4); c.fillStyle = '#3a2817'; c.beginPath(); c.arc(x, y, 3.2, 0, 7); c.fill(); }
  },
  cava(c, lvl, s) {
    groundPlot(c, 2, 2, '#6b6457');
    const R = rng(s);
    prism(c, 0.2, 0.2, 1.1, 1.0, 0, 24, COL.stone, 'stone', s);
    prism(c, 0.2, 1.0, 0.8, 1.4, 0, 12, COL.stone, 'stone', s + 2);
    for (let i = 0; i < 4 + lvl; i++) { const u = 1.2 + (i % 3) * 0.22, v = 1.1 + Math.floor(i / 3) * 0.25; prism(c, u, v, u + 0.18, v + 0.18, 0, 7, COL.wstone, null); }
    // crane
    logPost(c, 1.5, 0.5, 0, 34, 1.5, COL.wood); c.strokeStyle = COL.wood; c.lineWidth = 2; const a = isoP(1.5, 0.5, 34), b = isoP(1.1, 0.7, 26); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.strokeStyle = '#3a3a3a'; c.lineWidth = .7; c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(b[0], b[1] + 14); c.stroke();
  },
  granaio(c, lvl, s) {
    groundPlot(c, 2, 2);
    for (const [u, v] of [[0.35, 0.35], [1.65, 0.35], [0.35, 1.65], [1.65, 1.65]]) logPost(c, u, v, 0, 10, 1.8, COL.dwood);
    prism(c, 0.3, 0.3, 1.7, 1.7, 10, 34 + lvl * 3, COL.wood, 'plank', s);
    door(c, 0.8, 1.7, 'L', 12, 0.35, 15);
    gable(c, 0.3, 0.3, 1.7, 1.7, 34 + lvl * 3, 20, COL.thatch, 'u', 'thatch', s + 4, COL.wood);
    sack(c, 1.8, 1.8); sack(c, 1.95, 1.55, '#a88f5f'); sack(c, 0.2, 1.9);
  },
  tesoreria(c, lvl, s) {
    groundPlot(c, 2, 2, '#6a6152');
    prism(c, 0.3, 0.3, 1.7, 1.7, 0, 30 + lvl * 3, COL.stone, 'stone', s);
    door(c, 0.8, 1.7, 'L', 0, 0.38, 17, '#3a2410');
    const [x, y] = isoP(0.99, 1.7, 9); c.fillStyle = COL.iron; c.fillRect(x - 6, y - 1, 12, 1.5);
    gable(c, 0.3, 0.3, 1.7, 1.7, 30 + lvl * 3, 18, COL.tile, 'v', 'tile', s + 3, COL.stone);
    prism(c, 1.75, 0.6, 1.95, 0.95, 0, 7, '#6b4424', 'plank', s + 6, '#c9a227');
    for (let i = 0; i < 5; i++) { const [px, py] = isoP(1.82 + i * 0.03, 1.1 + i * 0.07, 0); c.fillStyle = '#e1b93a'; c.beginPath(); c.ellipse(px, py - 1, 2.5, 1.3, 0, 0, 7); c.fill(); }
  },
  caserma(c, lvl, s) {
    groundPlot(c, 3, 3, '#5c4a32');
    const h = 22 + lvl * 3;
    prism(c, 0.3, 0.5, 2.7, 1.9, 0, 6, COL.stone, 'stone', s);
    prism(c, 0.3, 0.5, 2.7, 1.9, 6, h, COL.wood, lvl >= 3 ? 'plaster' : 'plank', s + 1, null);
    door(c, 1.3, 1.9, 'L', 0, 0.4, 16);
    for (let i = 0; i < 3; i++) windowS(c, 0.5 + i * 0.4, 1.9, 'L', h - 10);
    gable(c, 0.3, 0.5, 2.7, 1.9, h, 20, COL.shingle, 'u', 'shingle', s + 2, COL.wood);
    banner(c, 2.75, 2.0, 0, 38, COL.crimson);
    // weapon rack
    const a = isoP(0.4, 2.5, 0); for (let i = 0; i < 5; i++) { c.strokeStyle = '#4a3420'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(a[0] + i * 4, a[1]); c.lineTo(a[0] + i * 4 + 2, a[1] - 18); c.stroke(); c.fillStyle = '#bbb'; c.beginPath(); c.moveTo(a[0] + i * 4 + 2, a[1] - 18); c.lineTo(a[0] + i * 4 + 0.5, a[1] - 22); c.lineTo(a[0] + i * 4 + 3.5, a[1] - 21); c.fill(); }
    // dummy
    logPost(c, 2.3, 2.5, 0, 16, 1.2, COL.dwood); const [dx, dy] = isoP(2.3, 2.5, 16); c.fillStyle = COL.hay; c.beginPath(); c.ellipse(dx, dy - 2, 4, 6, 0, 0, 7); c.fill(); c.strokeStyle = EDGE; c.stroke(); c.fillRect(dx - 7, dy + 1, 14, 2);
  },
  poligono(c, lvl, s) {
    groundPlot(c, 3, 3, '#6a6a3c');
    for (let i = 0; i <= 8; i++) { logPost(c, 0.1 + i * 0.35, 0.1, 0, 9, 1, COL.dwood); logPost(c, 0.1, 0.1 + i * 0.35, 0, 9, 1, COL.dwood); }
    prism(c, 0.25, 0.25, 1.15, 1.0, 0, 18, COL.wood, 'plank', s); gable(c, 0.25, 0.25, 1.15, 1.0, 18, 12, COL.shingle, 'u', 'shingle', s + 2, COL.wood);
    for (const [u, v] of [[2.2, 0.6], [2.4, 1.5], [2.0, 2.4]]) {
      logPost(c, u, v, 0, 12, 1, COL.dwood); const [x, y] = isoP(u, v, 22);
      c.fillStyle = COL.hay; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); c.strokeStyle = '#7a5a20'; c.lineWidth = 1; c.stroke();
      c.fillStyle = '#f4ead0'; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); c.fillStyle = COL.crimson; c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); c.fillStyle = '#f4ead0'; c.beginPath(); c.arc(x, y, 1.5, 0, 7); c.fill();
    }
    sack(c, 1.0, 2.3, COL.hay); banner(c, 0.3, 2.7, 0, 30, COL.blue);
  },
  scuderia(c, lvl, s) {
    groundPlot(c, 3, 3, '#5e4a2e');
    prism(c, 0.3, 0.3, 2.7, 1.3, 0, 24, COL.wood, 'plank', s);
    for (let i = 0; i < 4; i++) door(c, 0.45 + i * 0.58, 1.3, 'L', 0, 0.38, 15, '#22160b');
    gable(c, 0.3, 0.3, 2.7, 1.3, 24, 16, COL.thatch, 'u', 'thatch', s + 3, COL.wood);
    for (let i = 0; i <= 7; i++) { logPost(c, 0.2 + i * 0.37, 2.85, 0, 9, 1, COL.dwood); }
    for (let i = 0; i <= 4; i++) { logPost(c, 2.85, 1.45 + i * 0.35, 0, 9, 1, COL.dwood); }
    const a = isoP(0.2, 2.85, 6), b = isoP(2.8, 2.85, 6), d = isoP(2.85, 1.45, 6); c.strokeStyle = COL.wood; c.lineWidth = 1.5; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.stroke();
    for (const [u, v] of [[0.6, 1.9], [1.0, 2.2]]) { prism(c, u, v, u + 0.3, v + 0.25, 0, 8, COL.hay, null, 0, '#d9bc5c'); }
    banner(c, 2.75, 0.4, 24, 26, COL.blue);
  },
  monastero(c, lvl, s) {
    groundPlot(c, 3, 3, '#6f6758');
    prism(c, 0.4, 0.3, 1.1, 1.0, 0, 64, COL.wstone, 'stone', s);
    windowS(c, 0.65, 1.0, 'L', 44, 0.16);
    pyramid(c, 0.4, 0.3, 1.1, 1.0, 64, 26, COL.tile, 'tile', s + 5);
    const [cx, cy] = isoP(0.75, 0.65, 92); c.strokeStyle = COL.gold; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy - 10); c.moveTo(cx - 4, cy - 7); c.lineTo(cx + 4, cy - 7); c.stroke();
    prism(c, 0.6, 1.0, 2.6, 2.3, 0, 32, COL.wstone, 'stone', s + 2);
    door(c, 1.0, 2.3, 'L', 0, 0.35, 18, '#3a2410');
    for (let i = 0; i < 3; i++) windowS(c, 1.5 + i * 0.35, 2.3, 'L', 16, 0.1);
    gable(c, 0.6, 1.0, 2.6, 2.3, 32, 22, COL.tile, 'u', 'tile', s + 6, COL.wstone);
    banner(c, 2.7, 2.6, 0, 30, '#e8e0cc', '✠');
  },
  torre(c, lvl, s) {
    const h = 40 + lvl * 4;
    for (const [u, v] of [[0.2, 0.2], [0.8, 0.2], [0.2, 0.8], [0.8, 0.8]]) logPost(c, u, v, 0, h, 1.8, COL.log);
    c.strokeStyle = COL.dwood; c.lineWidth = 1.4;
    for (let z = 8; z < h - 4; z += 14) { const a = isoP(0.2, 0.8, z), b = isoP(0.8, 0.8, z + 12), d = isoP(0.8, 0.2, z); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.stroke(); }
    prism(c, 0.05, 0.05, 0.95, 0.95, h, h + 4, COL.dwood, 'plank', s);
    for (let i = 0; i < 5; i++) { logPost(c, 0.07 + i * 0.22, 0.95, h + 4, 7, 1, COL.log); logPost(c, 0.95, 0.07 + i * 0.22, h + 4, 7, 1, COL.log); }
    if (lvl >= 3) banner(c, 0.1, 0.1, h + 4, 30, COL.crimson);
  },
  balista(c, lvl, s) {
    const base = lvl >= 3 ? COL.wstone : COL.stone;
    prism(c, 0.15, 0.15, 1.85, 1.85, 0, 16, base, 'stone', s);
    battlements(c, 0.15, 0.15, 1.85, 1.85, 16, base);
  },
  stendardo(c, lvl, s) { const [x, y] = isoP(0.5, 0.5, 0); c.fillStyle = '#5a5246'; c.beginPath(); c.ellipse(x, y, 7, 3.5, 0, 0, 7); c.fill(); const a = ARMS(); const h = 46;
    c.strokeStyle = '#3a2a18'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h - 4); c.stroke(); c.fillStyle = '#c9a227'; c.beginPath(); c.arc(x, y - h - 5, 2, 0, 7); c.fill();
    const fx = x + 1, fy = y - h, fw = 20, fh = 26; c.save(); c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx + fw, fy); c.lineTo(fx + fw, fy + fh); c.lineTo(fx + fw / 2, fy + fh - 6); c.lineTo(fx, fy + fh); c.closePath(); c.clip(); c.fillStyle = a.c1; c.fillRect(fx, fy, fw, fh); c.fillStyle = a.c2;
    if (a.div === 'partito') c.fillRect(fx + fw / 2, fy, fw / 2, fh); else if (a.div === 'troncato') c.fillRect(fx, fy + fh * 0.42, fw, fh); else if (a.div === 'inquartato') { c.fillRect(fx + fw / 2, fy, fw / 2, fh * 0.42); c.fillRect(fx, fy + fh * 0.42, fw / 2, fh); } else if (a.div === 'banda') { c.beginPath(); c.moveTo(fx, fy + 3); c.lineTo(fx + 3, fy); c.lineTo(fx + fw, fy + fh - 3); c.lineTo(fx + fw, fy + fh + 4); c.closePath(); c.fill(); }
    c.restore(); c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = .7; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx + fw, fy); c.lineTo(fx + fw, fy + fh); c.lineTo(fx + fw / 2, fy + fh - 6); c.lineTo(fx, fy + fh); c.closePath(); c.stroke();
    c.font = '11px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(a.sym, fx + fw / 2, fy + fh * 0.42); c.textAlign = 'start'; c.textBaseline = 'alphabetic'; },
  tenda(c, lvl, s) {
    groundPlot(c, 2, 2, '#5a4a30');
    const A = isoP(1, 1, 40); const c00 = isoP(0.2, 0.2), c10 = isoP(1.8, 0.2), c11 = isoP(1.8, 1.8), c01 = isoP(0.2, 1.8);
    poly(c, [c00, c10, A], '#b8a27a', EDGE); poly(c, [c00, c01, A], '#c5ae84', EDGE); poly(c, [c01, c11, A], '#bda67c', EDGE); poly(c, [c11, c10, A], '#8f7c5a', EDGE);
    for (let i = 0; i < 4; i++) { const t = 0.15 + i * 0.22; const p = isoP(0.2 + 1.6 * t, 1.8), q = A; c.strokeStyle = 'rgba(120,30,25,.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0] + (p[0] - q[0]) * 0.15, q[1] + (p[1] - q[1]) * 0.15); c.stroke(); }
    const d = [isoP(0.85, 1.8), isoP(1.15, 1.8), isoP(1.0, 1.8, 18)]; poly(c, d, '#1d140b');
    banner(c, 1, 1, 40, 14, '#5a1d1d');
  },
  bottino(c, lvl, s) {
    groundPlot(c, 2, 2, '#5a4a30');
    prism(c, 0.3, 0.5, 1.6, 1.4, 6, 18, COL.dwood, 'plank', s);
    for (const [u, v] of [[0.45, 1.4], [1.4, 1.4]]) { const [x, y] = isoP(u, v, 6); c.fillStyle = '#2d1f12'; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); c.strokeStyle = '#6b4a2a'; c.lineWidth = 1.4; c.stroke(); }
    prism(c, 0.5, 0.6, 0.95, 1.0, 18, 27, '#6b4424', 'plank', s + 2, '#7a5230');
    prism(c, 1.05, 0.65, 1.45, 1.05, 18, 26, '#6b4424', 'plank', s + 3, '#7a5230');
    for (let i = 0; i < 7; i++) { const R = rng(s + i); const [x, y] = isoP(0.6 + R() * 0.8, 0.7 + R() * 0.3, 27); c.fillStyle = '#e1b93a'; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
    sack(c, 1.7, 1.7); sack(c, 1.5, 1.85, '#a88f5f');
  },
  capanno(c, lvl, s) { // enemy hut
    groundPlot(c, 2, 2, '#5a4a30');
    prism(c, 0.35, 0.35, 1.6, 1.5, 0, 18, COL.plaster, 'plaster', s);
    door(c, 0.75, 1.5, 'L', 0, 0.25, 12);
    gable(c, 0.35, 0.35, 1.6, 1.5, 18, 16, COL.thatch, 'u', 'thatch', s + 2, COL.plaster);
  },
  falo(c) { const [x, y] = isoP(0.5, 0.5); c.fillStyle = '#4a4036'; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; c.beginPath(); c.arc(x + Math.cos(a) * 9, y + Math.sin(a) * 4.5, 2.6, 0, 7); c.fill(); } c.fillStyle = '#2a1a10'; c.beginPath(); c.ellipse(x, y, 7, 3.5, 0, 0, 7); c.fill(); },
};
function paintWall(c, mask, stone, s) {
  // mask bits: 1:+u 2:-u 4:+v 8:-v
  const seg = (u0, v0, u1, v1) => {
    if (stone) { prism(c, u0, v0, u1, v1, 0, 22, COL.stone, 'stone', s); }
    else {
      const n = Math.max(1, Math.round(Math.hypot(u1 - u0, v1 - v0) / 0.16));
      for (let i = 0; i <= n; i++) { const t = i / n; logPost(c, u0 + (u1 - u0) * t + 0.08, v0 + (v1 - v0) * t + 0.08, 0, 22 + (i % 2) * 3, 2.1, COL.log, true); }
    }
  };
  const t = stone ? 0.17 : 0.0;
  if (mask & 8) seg(0.5 - t, 0, 0.5 + t, 0.5 - t);
  if (mask & 2) seg(0, 0.5 - t, 0.5 - t, 0.5 + t);
  if (stone) { prism(c, 0.3, 0.3, 0.7, 0.7, 0, 28, COL.stone, 'stone', s); prism(c, 0.28, 0.28, 0.72, 0.72, 28, 31, COL.stone); }
  else { logPost(c, 0.5, 0.5, 0, 28, 2.8, COL.dwood, true); }
  if (mask & 1) seg(0.5 + t, 0.5 - t, 1, 0.5 + t);
  if (mask & 4) seg(0.5 - t, 0.5 + t, 0.5 + t, 1);
  if (stone) { // merlons
    const m = (u, v) => prism(c, u - 0.07, v - 0.07, u + 0.07, v + 0.07, 22, 28, COL.stone);
    if (mask & 1) { m(0.85, 0.5); } if (mask & 4) { m(0.5, 0.85); }
  } else { // binding
    c.strokeStyle = 'rgba(60,40,20,.8)'; c.lineWidth = 1.2;
    if (mask & 1) { const a = isoP(0.5, 0.58, 12), b = isoP(1.0, 0.58, 12); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    if (mask & 4) { const a = isoP(0.58, 0.5, 12), b = isoP(0.58, 1.0, 12); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
  }
}
function paintRubble(c, w, h, s) {
  const R = rng(s), cx = w / 2, cy = h / 2;
  // terra bruciata dai bordi irregolari e sfumati
  for (let i = 0; i < 26 * w * h / 4 + 10; i++) { const a = R() * 6.283, d = Math.sqrt(R()) * 0.5; const u = cx + Math.cos(a) * d * w * 0.95, v = cy + Math.sin(a) * d * h * 0.95; const [x, y] = isoP(u, v); const r = (6 + R() * 10) * Math.sqrt(w * h) / 2; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${30 + R() * 20 | 0},${22 + R() * 14 | 0},${14 + R() * 8 | 0},${0.16 + R() * 0.12})`); g.addColorStop(1, 'rgba(30,22,14,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r * 0.55, 0, 0, 7); c.fill(); }
  const stone = (x, y, r) => { const n = 5 + (R() * 3 | 0), pts = []; for (let k = 0; k < n; k++) { const a = k / n * 6.283 + R() * 0.5, rr = r * (0.7 + R() * 0.45); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.62]); } const base = 0.62 + R() * 0.45; poly(c, pts, shade('#9a9184', base), 'rgba(30,24,18,0.55)', 0.7); c.fillStyle = shade('#c8c0b2', base, 0.55); c.beginPath(); c.ellipse(x - r * 0.25, y - r * 0.2, r * 0.38, r * 0.2, -0.3, 0, 7); c.fill(); };
  const beam = (x, y, L, ang, burnt) => { c.save(); c.translate(x, y); c.rotate(ang); const col = burnt ? '#2e2016' : shade('#6b4a2a', 0.8 + R() * 0.3); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(-L / 2 + 1, 0.6, L, 3.4); c.fillStyle = col; c.fillRect(-L / 2, -1.6, L, 3.4); c.fillStyle = burnt ? 'rgba(255,120,40,0.35)' : 'rgba(255,230,180,0.25)'; c.fillRect(-L / 2, -1.6, L, 1); c.fillStyle = '#1a120b'; c.fillRect(L / 2 - 2.5, -1.6, 2.5, 3.4); c.restore(); };
  // 2-4 cumuli di macerie
  const piles = 2 + (R() * 2 | 0) + (w > 2 ? 1 : 0);
  for (let p = 0; p < piles; p++) { const pu = 0.35 + R() * (w - 0.7), pv = 0.35 + R() * (h - 0.7); const big = 0.6 + R() * 0.6;
    for (let i = 0; i < 4; i++) { const [x, y] = isoP(pu + (R() - .5) * 0.6, pv + (R() - .5) * 0.6); beam(x, y - R() * 4, 14 + R() * 14, R() * 3.14, R() < 0.6); }
    for (let i = 0; i < 9 * big; i++) { const a = R() * 6.283, d = R() * 0.45 * big; const [x, y] = isoP(pu + Math.cos(a) * d, pv + Math.sin(a) * d, (0.45 * big - d) * 14); stone(x, y, 2.2 + R() * 3.4 * big); } }
  // pietre e schegge sparse
  for (let i = 0; i < 10 * w * h / 4 + 4; i++) { const [x, y] = isoP(0.15 + R() * (w - 0.3), 0.15 + R() * (h - 0.3)); if (R() < 0.7) stone(x, y, 1.2 + R() * 1.8); else beam(x, y, 6 + R() * 6, R() * 3.14, true); }
}
// caches
// ================= DECORAZIONI: disegni procedurali (sostituibili con modelli Meshy dello stesso nome) =================
function cylD(c, x, y, rx, ry, h, col, top) { const g = c.createLinearGradient(x - rx, 0, x + rx, 0); g.addColorStop(0, shade(col, 1.12)); g.addColorStop(0.55, shade(col, 0.92)); g.addColorStop(1, shade(col, 0.6)); c.fillStyle = g; c.beginPath(); c.moveTo(x - rx, y - h); c.lineTo(x - rx, y); c.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); c.lineTo(x + rx, y - h); c.closePath(); c.fill(); c.strokeStyle = EDGE; c.lineWidth = 0.7; c.stroke(); c.fillStyle = top || shade(col, 1.2); c.beginPath(); c.ellipse(x, y - h, rx, ry, 0, 0, 7); c.fill(); c.stroke(); }
function shadowE(c, x, y, rx, ry, a) { c.fillStyle = `rgba(0,0,0,${a || 0.22})`; c.beginPath(); c.ellipse(x + rx * 0.25, y + ry * 0.15, rx, ry, 0, 0, 7); c.fill(); }
function stonesRing(c, x, y, rx, ry, h, R) { c.strokeStyle = 'rgba(40,32,24,0.45)'; c.lineWidth = 0.6; for (let z = 3; z < h; z += 4) { c.beginPath(); c.ellipse(x, y - z, rx, ry, 0, 0.1, Math.PI - 0.1); c.stroke(); } for (let i = 0; i < 9; i++) { const a = 0.25 + i * 0.32, zz = (i % 3) * 4 + 2; c.beginPath(); c.moveTo(x - Math.cos(a) * rx, y - zz + Math.sin(a) * ry); c.lineTo(x - Math.cos(a) * rx, y - zz - 4 + Math.sin(a) * ry); c.stroke(); } }
const DPAINT = {
  pozzo(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 17, 8); cylD(c, x, y, 13, 6.5, 13, '#9a9184', '#3d4a52'); stonesRing(c, x, y, 13, 6.5, 13); c.fillStyle = '#2b3c46'; c.beginPath(); c.ellipse(x, y - 13, 9.5, 4.6, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(150,200,230,0.5)'; c.beginPath(); c.ellipse(x - 2, y - 14, 4, 1.5, 0, 0, 7); c.fill();
    for (const dx of [-11, 11]) { c.fillStyle = '#5a3a20'; c.fillRect(x + dx - 1.4, y - 38, 2.8, 26); } c.strokeStyle = '#3a2614'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 11, y - 33); c.lineTo(x + 11, y - 33); c.stroke(); c.strokeStyle = '#c9b48a'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x + 2, y - 33); c.lineTo(x + 2, y - 20); c.stroke(); c.fillStyle = '#6b4a2a'; c.fillRect(x - 1, y - 21, 6, 5);
    poly(c, [[x - 17, y - 36], [x, y - 48], [x + 17, y - 36], [x, y - 30]], '#7a4a2a', EDGE); poly(c, [[x, y - 48], [x + 17, y - 36], [x + 17, y - 33], [x, y - 45]], '#5a3418'); },
  fontana(c, lvl, s) { const [x, y] = isoP(1, 1); shadowE(c, x, y, 38, 18); cylD(c, x, y, 34, 17, 11, '#b4ab9c', '#cfc6b6'); stonesRing(c, x, y, 34, 17, 11); c.fillStyle = '#3f7fa8'; c.beginPath(); c.ellipse(x, y - 11, 29, 14, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(200,235,255,0.35)'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(x - 14 + i * 7, y - 12 + (i % 2) * 4, 5, 1.4, 0, 0, 7); c.fill(); }
    cylD(c, x, y - 11, 5, 2.5, 22, '#a59c8e'); cylD(c, x, y - 33, 13, 6, 4, '#b4ab9c', '#4a8bb5'); cylD(c, x, y - 37, 3, 1.5, 9, '#a59c8e'); c.fillStyle = '#d8d0c0'; c.beginPath(); c.arc(x, y - 47, 3.2, 0, 7); c.fill(); },
  statua(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 16, 7, 0.26); prism(c, 0.22, 0.22, 0.78, 0.78, 0, 6, '#a39a8c', 'stone', s); prism(c, 0.3, 0.3, 0.7, 0.7, 6, 18, '#b5ac9e', 'stone', s + 1); const by = y - 18, br = '#5f7d6c';
    c.fillStyle = br; c.beginPath(); c.moveTo(x - 7, by); c.lineTo(x - 5, by - 22); c.lineTo(x + 5, by - 22); c.lineTo(x + 7, by); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = .7; c.stroke(); c.fillStyle = shade(br, 0.75); c.beginPath(); c.moveTo(x + 1, by); c.lineTo(x + 3, by - 22); c.lineTo(x + 5, by - 22); c.lineTo(x + 7, by); c.closePath(); c.fill();
    c.fillStyle = shade(br, 1.15); c.beginPath(); c.arc(x, by - 26, 4, 0, 7); c.fill(); c.stroke(); c.strokeStyle = shade(br, 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(x + 5, by - 19); c.lineTo(x + 10, by - 34); c.stroke(); c.strokeStyle = '#8fa89a'; c.lineWidth = 1; c.beginPath(); c.moveTo(x + 7, by - 30); c.lineTo(x + 13, by - 30); c.stroke(); c.fillStyle = '#c9a227'; c.beginPath(); c.moveTo(x - 4, by - 29); c.lineTo(x - 3, by - 32); c.lineTo(x, by - 30); c.lineTo(x + 3, by - 32); c.lineTo(x + 4, by - 29); c.closePath(); c.fill(); },
  aiuola(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); const R = rng(s * 7 + 3); poly(c, [isoP(0.12, 0.5), isoP(0.5, 0.12), isoP(0.88, 0.5), isoP(0.5, 0.88)], '#5b4126', '#8a8174', 2); poly(c, [isoP(0.18, 0.5), isoP(0.5, 0.18), isoP(0.82, 0.5), isoP(0.5, 0.82)], '#4e7a2c');
    const cols = ['#e0453a', '#f2c94c', '#f5f1e8', '#b05fd0', '#ff8fb0', '#5b8ce0']; for (let i = 0; i < 34; i++) { const u = 0.22 + R() * 0.56, v = 0.22 + R() * 0.56; if (Math.abs(u - 0.5) + Math.abs(v - 0.5) > 0.3) continue; const [px, py] = isoP(u, v, 0); c.strokeStyle = '#3d6a22'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py - 4); c.stroke(); c.fillStyle = cols[(R() * cols.length) | 0]; c.beginPath(); c.arc(px, py - 5, 1.9, 0, 7); c.fill(); } },
  siepe(c, lvl, s) { prism(c, 0.12, 0.12, 0.88, 0.88, 0, 13, '#3f6e2a', null, s, '#5a8c38'); const R = rng(s + 9); for (let i = 0; i < 40; i++) { const u = 0.15 + R() * 0.7, v = 0.15 + R() * 0.7; const [px, py] = isoP(u, v, 13); c.fillStyle = R() < 0.5 ? 'rgba(120,170,70,0.6)' : 'rgba(30,60,20,0.4)'; c.beginPath(); c.arc(px, py, 1.6, 0, 7); c.fill(); } },
  lanterna(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 6, 3); c.fillStyle = '#2b2b2b'; c.fillRect(x - 1.2, y - 44, 2.4, 44); c.fillRect(x - 4, y - 2, 8, 2); c.fillRect(x - 1, y - 44, 9, 1.6); c.fillStyle = '#ffd77a'; c.fillRect(x + 4, y - 41, 6, 8); c.strokeStyle = '#2b2b2b'; c.lineWidth = 1; c.strokeRect(x + 4, y - 41, 6, 8); c.beginPath(); c.moveTo(x + 3, y - 41); c.lineTo(x + 7, y - 45); c.lineTo(x + 11, y - 41); c.closePath(); c.fillStyle = '#2b2b2b'; c.fill(); },
  pagliaio(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 17, 8); const g = c.createLinearGradient(x - 14, 0, x + 14, 0); g.addColorStop(0, '#e2c46a'); g.addColorStop(0.6, '#c8a64a'); g.addColorStop(1, '#8f7330'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 14, y); c.bezierCurveTo(x - 15, y - 26, x + 15, y - 26, x + 14, y); c.ellipse(x, y, 14, 7, 0, 0, Math.PI); c.closePath(); c.fill(); c.strokeStyle = EDGE; c.lineWidth = .7; c.stroke();
    const R = rng(s + 4); c.strokeStyle = 'rgba(110,80,30,0.5)'; for (let i = 0; i < 22; i++) { const px = x - 11 + R() * 22, py = y - 2 - R() * 16; c.beginPath(); c.moveTo(px, py); c.lineTo(px + (R() - 0.5) * 4, py + 4); c.stroke(); } logPost(c, 0.5, 0.5, 18, 9, 0.8, '#5a3a20'); },
  catasta(c, lvl, s) { const R = rng(s + 2); for (let row = 0; row < 3; row++) for (let i = 0; i < 4 - (row ? 1 : 0); i++) { const u = 0.2 + i * 0.18 + row * 0.09; const [px, py] = isoP(u, 0.78, 4 + row * 7.5); c.fillStyle = '#7a5230'; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 14, py - 7); c.lineTo(px + 14, py - 14); c.lineTo(px, py - 7); c.closePath(); c.fill(); c.strokeStyle = EDGE; c.lineWidth = .6; c.stroke(); c.fillStyle = '#c9a272'; c.beginPath(); c.ellipse(px, py - 3.5, 3.6, 3.6, 0, 0, 7); c.fill(); c.stroke(); c.strokeStyle = 'rgba(120,80,40,0.7)'; c.beginPath(); c.arc(px, py - 3.5, 1.6, 0, 7); c.stroke(); } },
  recinto(c, lvl, s) { const R = rng(s + 5); const P = [[0.1, 0.1], [1.9, 0.1], [1.9, 1.9], [0.1, 1.9]]; poly(c, P.map(p => isoP(p[0], p[1])), 'rgba(120,150,60,0.35)');
    const sheep = (u, v) => { const [px, py] = isoP(u, v); shadowE(c, px, py, 7, 3); c.fillStyle = '#efeae0'; c.beginPath(); c.ellipse(px, py - 6, 7, 5, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = .6; c.stroke(); c.fillStyle = '#3a3330'; c.beginPath(); c.ellipse(px + 7, py - 7, 2.6, 2.2, 0, 0, 7); c.fill(); c.fillRect(px - 4, py - 2, 1.4, 3); c.fillRect(px + 3, py - 2, 1.4, 3); };
    const hen = (u, v, col) => { const [px, py] = isoP(u, v); c.fillStyle = col; c.beginPath(); c.ellipse(px, py - 3, 3, 2.4, 0, 0, 7); c.fill(); c.fillStyle = '#c0392b'; c.fillRect(px + 2, py - 6, 1.4, 1.6); };
    // steccato dietro
    const rail = (a, b) => { for (const z of [5, 10]) { const p = isoP(a[0], a[1], z), q = isoP(b[0], b[1], z); c.strokeStyle = '#6b4a2a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); } };
    rail(P[0], P[1]); rail(P[3], P[0]); for (let i = 0; i <= 6; i++) { logPost(c, 0.1 + i * 0.3, 0.1, 0, 12, 1, '#6b4a2a'); logPost(c, 0.1, 0.1 + i * 0.3, 0, 12, 1, '#6b4a2a'); }
    prism(c, 1.3, 0.35, 1.7, 0.55, 0, 5, '#6b4a2a', 'plank', s); sheep(0.7, 0.8); sheep(1.2, 1.25); sheep(0.6, 1.4); for (let i = 0; i < 4; i++) hen(1.2 + R() * 0.5, 0.6 + R() * 0.6, R() < 0.5 ? '#f4efe4' : '#a5652f');
    rail(P[1], P[2]); rail(P[2], P[3]); for (let i = 0; i <= 6; i++) { logPost(c, 1.9, 0.1 + i * 0.3, 0, 12, 1, '#6b4a2a'); logPost(c, 0.1 + i * 0.3, 1.9, 0, 12, 1, '#6b4a2a'); } },
  carretto(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 18, 8); prism(c, 0.2, 0.3, 0.8, 0.7, 8, 15, '#7a5230', 'plank', s); c.strokeStyle = '#55381f'; c.lineWidth = 1.8; const a = isoP(0.8, 0.4, 9), b = isoP(1.15, 0.35, 4); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); const a2 = isoP(0.8, 0.6, 9), b2 = isoP(1.15, 0.65, 4); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke();
    const [wx2, wy2] = isoP(0.45, 0.72, 7); c.fillStyle = '#3a2614'; c.beginPath(); c.ellipse(wx2, wy2, 6.5, 7, 0, 0, 7); c.fill(); c.strokeStyle = '#8a6a44'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(wx2, wy2, 5, 5.5, 0, 0, 7); c.stroke(); sack(c, 0.4, 0.45, '#c9b48a'); const [sx, sy] = isoP(0.6, 0.5, 15); c.fillStyle = '#b8902e'; c.beginPath(); c.ellipse(sx, sy - 3, 5, 3.5, 0, 0, 7); c.fill(); },
  croce(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 13, 6); prism(c, 0.25, 0.25, 0.75, 0.75, 0, 5, '#9d9486', 'stone', s); prism(c, 0.33, 0.33, 0.67, 0.67, 5, 9, '#aaa193', 'stone', s + 1); prism(c, 0.45, 0.45, 0.55, 0.55, 9, 40, '#b8afa0', null, s); prism(c, 0.45, 0.3, 0.55, 0.7, 28, 33, '#b8afa0', null, s); const R = rng(s); c.fillStyle = 'rgba(90,120,60,0.55)'; for (let i = 0; i < 6; i++) { const [px, py] = isoP(0.3 + R() * 0.4, 0.3 + R() * 0.4, 5); c.beginPath(); c.arc(px, py, 1.4, 0, 7); c.fill(); } },
  alveari(c, lvl, s) { prism(c, 0.15, 0.4, 0.85, 0.6, 5, 7, '#7a5230', 'plank', s); for (const u of [0.15, 0.85]) logPost(c, u, 0.5, 0, 6, 0.9, '#55381f'); for (const u of [0.27, 0.5, 0.73]) { const [px, py] = isoP(u, 0.5, 7); const g = c.createLinearGradient(px - 7, 0, px + 7, 0); g.addColorStop(0, '#e0c070'); g.addColorStop(1, '#94742c'); c.fillStyle = g; c.beginPath(); c.moveTo(px - 7, py); c.bezierCurveTo(px - 7, py - 15, px + 7, py - 15, px + 7, py); c.closePath(); c.fill(); c.strokeStyle = 'rgba(90,60,20,0.55)'; c.lineWidth = 0.7; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(px - 7 + k * 0.6, py - k * 3); c.lineTo(px + 7 - k * 0.6, py - k * 3); c.stroke(); } c.fillStyle = '#2a1a0a'; c.beginPath(); c.arc(px, py - 2, 1.4, 0, 7); c.fill(); } },
  spaventapasseri(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 7, 3); c.fillStyle = '#5a3a20'; c.fillRect(x - 1.2, y - 40, 2.4, 40); c.fillRect(x - 13, y - 30, 26, 2.2); c.fillStyle = '#8f3b2a'; c.beginPath(); c.moveTo(x - 9, y - 31); c.lineTo(x + 9, y - 31); c.lineTo(x + 7, y - 16); c.lineTo(x - 7, y - 16); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = .6; c.stroke(); c.fillStyle = '#d9c38a'; c.beginPath(); c.arc(x, y - 36, 4.5, 0, 7); c.fill(); c.fillStyle = '#b8902e'; c.beginPath(); c.ellipse(x, y - 40, 9, 2.6, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(x - 4.5, y - 40); c.lineTo(x, y - 47); c.lineTo(x + 4.5, y - 40); c.fill(); c.strokeStyle = '#d9c38a'; c.lineWidth = 1; for (const dx of [-13, 13]) { c.beginPath(); c.moveTo(x + dx, y - 29); c.lineTo(x + dx * 1.15, y - 26); c.stroke(); } },
  bancarella(c, lvl, s) { const R = rng(s + 1); prism(c, 0.2, 0.35, 0.8, 0.7, 0, 12, '#7a5230', 'plank', s, '#8a6238'); for (let i = 0; i < 9; i++) { const [px, py] = isoP(0.26 + R() * 0.48, 0.4 + R() * 0.25, 12); c.fillStyle = ['#c0392b', '#e1b93a', '#6a9a3a', '#d27a2c', '#8e44ad'][(R() * 5) | 0]; c.beginPath(); c.arc(px, py - 1.5, 2.2, 0, 7); c.fill(); }
    for (const [u, v] of [[0.2, 0.3], [0.8, 0.3], [0.2, 0.75], [0.8, 0.75]]) logPost(c, u, v, 0, 30, 0.9, '#55381f'); const C = [isoP(0.12, 0.25, 32), isoP(0.88, 0.25, 32), isoP(0.88, 0.85, 26), isoP(0.12, 0.85, 26)]; c.save(); poly(c, C); c.clip(); for (let i = 0; i < 8; i++) { const a = isoP(0.12 + i * 0.1, 0.2, 34), b = isoP(0.12 + i * 0.1, 0.9, 24); c.strokeStyle = i % 2 ? '#f1e6cf' : '#b3261e'; c.lineWidth = 7; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); } c.restore(); poly(c, C, null, EDGE, 0.8); },
  gogna(c, lvl, s) { const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 14, 6); prism(c, 0.2, 0.3, 0.8, 0.7, 0, 4, '#6b4a2a', 'plank', s); for (const u of [0.3, 0.7]) logPost(c, u, 0.5, 4, 26, 1.3, '#55381f'); prism(c, 0.26, 0.46, 0.74, 0.54, 20, 26, '#7a5230', 'plank', s + 1); for (const u of [0.38, 0.5, 0.62]) { const [px, py] = isoP(u, 0.54, 23); c.fillStyle = '#1d140b'; c.beginPath(); c.arc(px, py, u === 0.5 ? 2.4 : 1.4, 0, 7); c.fill(); } },
  panni(c, lvl, s) { for (const u of [0.12, 0.88]) logPost(c, u, 0.5, 0, 26, 1, '#55381f'); const a = isoP(0.12, 0.5, 24), b = isoP(0.88, 0.5, 24); c.strokeStyle = '#d8cdb5'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 3, b[0], b[1]); c.stroke(); const [x, y] = isoP(0.5, 0.5); shadowE(c, x, y, 18, 5, 0.14); },
};
// parti animate disegnate a ogni fotogramma
const DANIM = {
  panni(c, b, cx, cy, t) { const cols = ['#e8e2d4', '#b3261e', '#3d5fa8', '#e8d48a']; for (let i = 0; i < 4; i++) { const u = 0.22 + i * 0.19; const [px, py] = isoP(u - 0.5, 0, 22.5 + Math.abs(u - 0.5) * -2); const sw = Math.sin(t * 2.2 + i * 1.3 + b.id) * 2.2; c.fillStyle = cols[(i + b.id) % 4]; c.beginPath(); c.moveTo(cx + px - 4, cy + py); c.lineTo(cx + px + 4, cy + py - 2); c.lineTo(cx + px + 4 + sw, cy + py + 9); c.lineTo(cx + px - 4 + sw, cy + py + 11); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = .5; c.stroke(); } },
  fontana(c, b, cx, cy, t) { c.strokeStyle = 'rgba(200,235,255,0.75)'; c.lineWidth = 1.1; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + t * 0.6, r = 10 + Math.sin(t * 3 + i) * 1.5; c.beginPath(); c.moveTo(cx, cy - 47); c.quadraticCurveTo(cx + Math.cos(a) * r * 0.6, cy - 52 + Math.sin(a) * r * 0.3, cx + Math.cos(a) * r, cy - 36 + Math.sin(a) * r * 0.5); c.stroke(); } c.fillStyle = 'rgba(230,248,255,0.8)'; for (let i = 0; i < 5; i++) { const k = (t * 1.3 + i / 5) % 1; c.beginPath(); c.arc(cx + Math.cos(i * 2.1) * (8 + k * 18), cy - 13 + Math.sin(i * 2.1) * (4 + k * 8), 1.2 * (1 - k) + 0.4, 0, 7); c.fill(); } },
  alveari(c, b, cx, cy, t) { c.fillStyle = '#2a1a0a'; for (let i = 0; i < 6; i++) { const a = t * (1.5 + i * 0.3) + i * 2; c.beginPath(); c.arc(cx + Math.cos(a) * (9 + i * 2), cy - 16 + Math.sin(a * 1.7) * 6, 0.9, 0, 7); c.fill(); } },
  recinto(c, b, cx, cy, t) { if (Math.sin(t * 0.7 + b.id) > 0.92) { c.fillStyle = 'rgba(255,255,255,0.85)'; c.font = '9px serif'; c.fillText('♪', cx - 6, cy - 28 - (t % 1) * 4); } },
};
Object.assign(PAINT, DPAINT);
const CACHE = {};
function cached(key, w, h, top, fn) {
  let e = CACHE[key]; if (e) return e;
  const pad = 30, cw = (w + h) * TW / 2 + pad * 2, ch = (w + h) * TH / 2 + top + pad;
  const cvs = document.createElement('canvas'); cvs.width = Math.ceil(cw * RS); cvs.height = Math.ceil(ch * RS);
  const c = cvs.getContext('2d'); c.scale(RS, RS); c.translate(h * TW / 2 + pad, top); c.lineJoin = 'round';
  fn(c);
  e = CACHE[key] = { cv: cvs, ox: h * TW / 2 + pad, oy: top, w: cw, h: ch };
  return e;
}
// trees
function paintTree(c, kind, s) {
  const R = rng(s);
  c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(0, 0, 18, 8, 0, 0, 7); c.fill();
  c.fillStyle = '#4a3220'; c.fillRect(-2.5, -18, 5, 18);
  if (kind === 0) { // pine
    const h = 60 + R() * 22;
    for (let i = 0; i < 4; i++) {
      const y = -14 - i * h / 5, wdt = 22 - i * 4;
      c.fillStyle = shade('#2f4a2a', 0.8 + i * 0.12); c.beginPath(); c.moveTo(-wdt, y); c.lineTo(0, y - h / 3.2); c.lineTo(wdt, y); c.closePath(); c.fill();
      c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.moveTo(0, y - h / 3.2); c.lineTo(wdt, y); c.lineTo(3, y); c.closePath(); c.fill();
    }
  } else { // oak
    const blobs = 7 + (R() * 4 | 0);
    for (let i = 0; i < blobs; i++) { const x = (R() - 0.5) * 30, y = -30 - R() * 26, r = 9 + R() * 8; c.fillStyle = shade(kind === 1 ? '#4c5e2c' : '#5d5a2a', 0.75 + R() * 0.45); c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    for (let i = 0; i < 18; i++) { const x = (R() - 0.5) * 34, y = -28 - R() * 30; c.fillStyle = 'rgba(200,210,120,0.18)'; c.beginPath(); c.arc(x, y, 2 + R() * 2, 0, 7); c.fill(); }
  }
}
const TREES = [];
function treeSprites() {
  for (let i = 0; i < 6; i++) {
    const cvs = document.createElement('canvas'); cvs.width = 90 * RS; cvs.height = 110 * RS;
    const c = cvs.getContext('2d'); c.scale(RS, RS); c.translate(45, 102); paintTree(c, i % 3, 100 + i * 17);
    TREES.push(cvs);
  }
}
function paintRock(c, s) { const R = rng(s); for (let i = 0; i < 3; i++) { const x = (R() - .5) * 14, y = -R() * 4; c.fillStyle = shade('#8c857a', 0.7 + R() * 0.4); c.beginPath(); c.ellipse(x, y, 6 + R() * 6, 4 + R() * 4, 0, 0, 7); c.fill(); c.strokeStyle = EDGE; c.lineWidth = .7; c.stroke(); } }
// ground prerender
// top-down ground texture (rotates smoothly with the map); decals = river/pond art
const EATL = new Image(); let EATL_OK = false; EATL.onload = () => { EATL_OK = true; };
// ================= SENTIERI: rete di strade lastricate tra gli edifici; la gente cammina su quelle =================
let PATHC = { key: '', grid: null, cv: null, P: 14 };
function pathKey(sc) { return sc.B.filter(b => !b.dead && !BDEF[b.t].decor).map(b => b.t[0] + b.x + ',' + b.y + (BDEF[b.t].wall ? 'w' : '')).sort().join('|'); }
function computePaths(sc) {
  const key = pathKey(sc); if (PATHC.key === key && PATHC.grid) { sc.pathG = PATHC.grid; return; }
  const G = new Uint8Array(N * N); const blocked = (x, y) => { const b = bAt(sc, x, y); if (!b) return false; const d = BDEF[b.t]; return !(d.decor || b.t === 'cancello'); };
  const m = sc.B.find(b => b.t === 'mastio');
  const doors = []; for (const b of sc.B) { const d = BDEF[b.t]; if (b.dead || d.wall || d.decor || b.nat) continue; doors.push([b, frontTile(sc, b)]); }
  if (!m) { PATHC = { key, grid: G, cv: null, P: 14, lines: [] }; sc.pathG = G; return; }
  const [mx, my] = frontTile(sc, m); G[my * N + mx] = 1; const lines = [];
  // piazza davanti al mastio
  for (let yy = -1; yy <= 1; yy++) for (let xx = -1; xx <= 1; xx++) { const x = mx + xx, y = my + yy; if (inMap(x, y) && !blocked(x, y) && !sc.water[y * N + x]) G[y * N + x] = 1; }
  doors.sort((a, b) => Math.hypot(a[1][0] - mx, a[1][1] - my) - Math.hypot(b[1][0] - mx, b[1][1] - my));
  const cost = (x, y) => { if (blocked(x, y)) return Infinity; if (sc.water[y * N + x]) return 40; const b = bAt(sc, x, y); if (b && BDEF[b.t].wall) return 3; return G[y * N + x] ? 0.35 : 1.6; };
  for (const [b, [dx, dy]] of doors) {
    if (G[dy * N + dx]) continue; const p = astar(dx, dy, (x, y) => G[y * N + x] === 1, cost, mx, my, 9000); G[dy * N + dx] = 1;
    if (p) { for (const [x, y] of p) G[y * N + x] = 1; const pts = [[dx + 0.5, dy + 0.5]]; for (const [x, y] of p) { const l = pts[pts.length - 1]; if (l[0] !== x + 0.5 || l[1] !== y + 0.5) pts.push([x + 0.5, y + 0.5]); } if (pts.length > 1) lines.push(pts); }
  }
  PATHC = { key, grid: G, cv: null, P: 14, lines, plaza: [mx + 0.5, my + 0.5] }; PATHC.lamps = pathLamps(sc, lines, G, blocked); PATHC.banners = villageBanners(sc, m, mx, my, blocked); sc.pathG = G;
}
// lampioni lungo i sentieri: uno ogni ~4 caselle, a lato della strada, alternando i lati
// insegne di guerra: coppie ai tre ingressi del borgo (dove le strade di terra entrano nell'abitato) e ai lati della piazza del Mastio
function villageBanners(sc, m, mx, my, blocked) {
  const out = [], mid = NMAP / 2, cx = m.x + m.w / 2, cy = m.y + m.h / 2; let rad = 7;
  for (const b of sc.B) { const d = BDEF[b.t]; if (b.dead || d.decor || d.wall || b.nat) continue; rad = Math.max(rad, Math.hypot(b.x + b.w / 2 - mid, b.y + b.h / 2 - mid) + 2.5); }
  const ok = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return inMap(xi, yi) && xi > 2 && yi > 2 && xi < N - 3 && yi < N - 3 && !blocked(xi, yi) && !sc.water[yi * N + xi] && !bAt(sc, xi, yi); };
  const curve = (ax, ay, bx, by, bend, t) => { const qx = (ax + bx) / 2 + bend, qy = (ay + by) / 2 - bend * 0.5; return [(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * qx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * qy + t * t * by]; };
  for (const [bx, by, bd] of [[mid, 3, 1], [3, mid, 1], [N - 4, mid - 4, 1.2]]) {
    for (let i = 1; i < 200; i++) { const t = i / 200, [x, y] = curve(mid, mid, bx, by, bd, t); if (Math.hypot(x - mid, y - mid) < rad) continue; const [x2, y2] = curve(mid, mid, bx, by, bd, t + 0.01); const dx = x2 - x, dy = y2 - y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      const yaw = Math.atan2(dy, dx); for (const sd of [1, -1]) { const px = x + nx * 1.1 * sd, py = y + ny * 1.1 * sd; if (ok(px, py)) out.push({ x: px, y: py, yaw: yaw + (sd > 0 ? 0 : Math.PI) }); } break; } }
  // insegne dell'esercito agli angoli di caserma, poligono e stalla
  for (const b of sc.B) if (!b.dead && (b.t === 'caserma' || b.t === 'poligono' || b.t === 'scuderia')) for (const [px, py] of [[b.x - 0.35, b.y + b.h + 0.35], [b.x + b.w + 0.35, b.y + b.h + 0.35]]) if (ok(px, py)) out.push({ x: px, y: py, yaw: 0, h: 100 });
  // ai lati della piazza davanti al Mastio
  const fx = mx + 0.5 - cx, fy = my + 0.5 - cy, fl = Math.hypot(fx, fy) || 1, nx = -fy / fl, ny = fx / fl;
  for (const sd of [1, -1]) { const px = mx + 0.5 + nx * 1.6 * sd + fx / fl * 0.6, py = my + 0.5 + ny * 1.6 * sd + fy / fl * 0.6; if (ok(px, py)) out.push({ x: px, y: py, yaw: Math.atan2(fy, fx) }); }
  return out;
}
function pathLamps(sc, lines, G, blocked) {
  const out = [], free = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return inMap(xi, yi) && !G[yi * N + xi] && !blocked(xi, yi) && !sc.water[yi * N + xi] && !bAt(sc, xi, yi); };
  const near = (x, y, r) => out.some(l => Math.hypot(l.x - x, l.y - y) < r); let side = 1;
  for (const l0 of lines) { const l = chaikin(l0); let acc = 1.6;
    for (let i = 1; i < l.length; i++) { const [ax, ay] = l[i - 1], [bx, by] = l[i]; const d = Math.hypot(bx - ax, by - ay); if (!d) continue; acc += d; if (acc < 5.5) continue;
      const nx = -(by - ay) / d, ny = (bx - ax) / d; let put = false;
      for (const sd of [side, -side]) { const x = bx + nx * 0.62 * sd, y = by + ny * 0.62 * sd; if (free(x, y) && !near(x, y, 2.6)) { out.push({ x, y, yaw: Math.atan2(-ny * sd, -nx * sd) }); put = true; side = -sd; break; } }
      if (put) acc = 0; } }
  return out;
}
function pathCanvas() {
  if (PATHC.cv || !PATHC.grid || !TEX_OK || !TEX.path) return PATHC.cv; const P = PATHC.P, G = PATHC.grid; const cv2 = document.createElement('canvas'); cv2.width = cv2.height = N * P; const c = cv2.getContext('2d');
  const segs = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (G[y * N + x]) { for (const [ex, ey] of [[1, 0], [0, 1], [1, 1], [-1, 1]]) { const nx = x + ex, ny = y + ey; if (inMap(nx, ny) && G[ny * N + nx]) { if (ex && ey && (G[y * N + nx] || G[ny * N + x])) continue; segs.push([x, y, nx, ny]); } } segs.push([x, y, x, y]); }
  const stroke = (w, style) => { c.strokeStyle = style; c.lineWidth = w * P; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); for (const [a, b, d, e] of segs) { c.moveTo((a + 0.5) * P, (b + 0.5) * P); c.lineTo((d + 0.5) * P + 0.01, (e + 0.5) * P); } c.stroke(); };
  // bordo di terra battuta, poi le lastre
  c.globalAlpha = 0.7; stroke(1.5, '#4a3420'); c.globalAlpha = 1; stroke(1.18, '#6b5236');
  const tmp = document.createElement('canvas'); tmp.width = tmp.height = N * P; const t = tmp.getContext('2d');
  t.strokeStyle = '#000'; t.lineWidth = 1.05 * P; t.lineCap = 'round'; t.lineJoin = 'round'; t.beginPath(); for (const [a, b, d, e] of segs) { t.moveTo((a + 0.5) * P, (b + 0.5) * P); t.lineTo((d + 0.5) * P + 0.01, (e + 0.5) * P); } t.stroke();
  t.globalCompositeOperation = 'source-in'; t.fillStyle = t.createPattern(texTile('path', P, 2.2), 'repeat'); t.fillRect(0, 0, N * P, N * P);
  t.globalCompositeOperation = 'source-atop'; t.fillStyle = 'rgba(170,125,70,0.22)'; t.fillRect(0, 0, N * P, N * P); t.globalCompositeOperation = 'source-over';
  c.drawImage(tmp, 0, 0);
  return PATHC.cv = cv2;
}
function drawPaths(c, sc) { if (!sc.pathG || (sc.mode !== 'village' && sc.mode !== 'raid')) return; const pc = pathCanvas(); if (!pc) return; c.save(); tileTransform(c, PATHC.P); c.drawImage(pc, 0, 0); c.restore(); }
// ================= TERRAIN: terreno a texture dipinte (erba, erba secca, terra battuta, fango) =================
const TEX = {}; let TEX_OK = false; const TEXC = {};
(function loadTex() { const ks = ['grass', 'dry', 'dirt', 'mud', 'path']; let n = 0; for (const k of ks) { const im = new Image(); im.onload = () => { if (++n === ks.length) TEX_OK = true; }; im.src = TEX_SRC[k]; TEX[k] = im; } })();
// piastrella pre-scalata: copre `tiles` caselle a `T` px per casella (eventualmente ruotata di 90°)
function texTile(k, T, tiles, rot) {
  const key = k + '|' + T + '|' + tiles + '|' + (rot || 0); if (TEXC[key]) return TEXC[key];
  const s = Math.max(4, Math.round(T * tiles)); const cv = document.createElement('canvas'); cv.width = cv.height = s; const c = cv.getContext('2d');
  c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  if (rot) { c.translate(s / 2, s / 2); c.rotate(rot * Math.PI / 2); c.translate(-s / 2, -s / 2); }
  c.drawImage(TEX[k], 0, 0, s, s); return TEXC[key] = cv;
}
// rumore a valori (fbm) deterministico
function makeNoise(seed) {
  const P = new Uint8Array(512); const R = rng(seed); for (let i = 0; i < 256; i++) P[i] = i; for (let i = 255; i > 0; i--) { const j = (R() * (i + 1)) | 0; const t = P[i]; P[i] = P[j]; P[j] = t; } for (let i = 0; i < 256; i++) P[i + 256] = P[i];
  const h = (x, y) => P[(P[x & 255] + y) & 511] / 255;
  const n = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
  return (x, y, oct) => { let s = 0, amp = 0.5, f = 1, t = 0; for (let o = 0; o < (oct || 3); o++) { s += n(x * f, y * f) * amp; t += amp; amp *= 0.5; f *= 2.03; } return s / t; };
}
const chaikin = (l, it = 2) => { let p = l; for (let k = 0; k < it; k++) { if (p.length < 3) return p; const o = [p[0]]; for (let i = 0; i < p.length - 1; i++) { const [ax, ay] = p[i], [bx, by] = p[i + 1]; o.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]); } o.push(p[p.length - 1]); p = o; } return p; };
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// maschere del terreno (M px per casella)
const CAMP_R = 15.5; // mezzo lato del piazzale dell'accampamento (caselle)
function groundMasks(enemy, decals, seed) {
  const N = NMAP, M = 4, S = N * M, mid = N / 2;
  const nz = [makeNoise(seed * 7 + 1), makeNoise(seed * 7 + 2), makeNoise(seed * 7 + 3), makeNoise(seed * 7 + 4), makeNoise(seed * 7 + 5)];
  // acqua dai decals
  const wt = new Uint8Array(N * N);
  for (const d of decals || []) { const m = d.k === 'fiume' ? EMASK.river.mask : d.k === 'lago' ? EMASK.pond.mask : null; if (!m) continue; for (let ty = 0; ty < m.length; ty++) for (let tx = 0; tx < m[ty].length; tx++) if (m[ty][tx] === '1') { const x = d.x + tx, y = d.y + ty; if (x >= 0 && y >= 0 && x < N && y < N) wt[y * N + x] = 1; } }
  // distanza dall'acqua (chamfer, in caselle)
  const dist = new Float32Array(N * N).fill(1e9); for (let i = 0; i < N * N; i++) if (wt[i]) dist[i] = 0;
  for (let p = 0; p < 2; p++) {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x; if (x) dist[i] = Math.min(dist[i], dist[i - 1] + 1); if (y) dist[i] = Math.min(dist[i], dist[i - N] + 1); if (x && y) dist[i] = Math.min(dist[i], dist[i - N - 1] + 1.41); if (y && x < N - 1) dist[i] = Math.min(dist[i], dist[i - N + 1] + 1.41); }
    for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) { const i = y * N + x; if (x < N - 1) dist[i] = Math.min(dist[i], dist[i + 1] + 1); if (y < N - 1) dist[i] = Math.min(dist[i], dist[i + N] + 1); if (x < N - 1 && y < N - 1) dist[i] = Math.min(dist[i], dist[i + N + 1] + 1.41); if (y < N - 1 && x) dist[i] = Math.min(dist[i], dist[i + N - 1] + 1.41); }
  }
  const dAt = (x, y) => { const xi = Math.min(N - 2, Math.max(0, Math.floor(x - 0.5))), yi = Math.min(N - 2, Math.max(0, Math.floor(y - 0.5))), fx = Math.min(1, Math.max(0, x - 0.5 - xi)), fy = Math.min(1, Math.max(0, y - 0.5 - yi)); const a = dist[yi * N + xi], b = dist[yi * N + xi + 1], c = dist[(yi + 1) * N + xi], d = dist[(yi + 1) * N + xi + 1]; return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy; };
  // sentieri (polilinee in caselle)
  const paths = [];
  const curve = (ax, ay, bx, by, bend) => { const pts = []; const cx = (ax + bx) / 2 + bend, cy = (ay + by) / 2 - bend * 0.5; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by]); } return pts; };
  if (!enemy) {
    for (const [bx, by, bd] of [[mid, 3, 1], [3, mid, 1], [3, mid + 6, 1.5], [26.5 + OFF, 25.4 + OFF, 1], [mid + 18, 6, -2], [N - 4, mid - 4, 1.2]]) paths.push(curve(mid, mid, bx, by, bd));
    paths.push(curve(26.6 + OFF, 25.6 + OFF, 30 + OFF, 29 + OFF, 0)); paths.push(curve(30 + OFF, 29 + OFF, N - 6, N - 3, 1));
  } else { const R = rng(seed); for (let i = 0; i < 3; i++) { const a = R() * 6.283; paths.push(curve(mid, mid, mid + Math.cos(a) * (mid - 3), mid + Math.sin(a) * (mid - 3), (R() < 0.5 ? -1 : 1) * (5 + R() * 9))); } }
  const segs = []; for (const p of paths) for (let i = 1; i < p.length; i++) segs.push([p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]]);
  const segD0 = (x, y) => { let best = 9; for (const s of segs) { if (x < s[4] - 3 || x > s[5] + 3 || y < s[6] - 3 || y > s[7] + 3) continue; const dx = s[2] - s[0], dy = s[3] - s[1], l = dx * dx + dy * dy; let t = l ? ((x - s[0]) * dx + (y - s[1]) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); const ex = s[0] + dx * t - x, ey = s[1] + dy * t - y; const d = ex * ex + ey * ey; if (d < best) best = d; } return Math.sqrt(best); };
  for (const s of segs) s.push(Math.min(s[0], s[2]), Math.max(s[0], s[2]), Math.min(s[1], s[3]), Math.max(s[1], s[3]));
  const PG = 3, PN = N * PG + 1, pdg = new Float32Array(PN * PN); if (segs.length) for (let j = 0; j < PN; j++) for (let i = 0; i < PN; i++) pdg[j * PN + i] = segD0(i / PG, j / PG);
  const segD = (x, y) => { const gx = Math.min(PN - 1.001, x * PG), gy = Math.min(PN - 1.001, y * PG), xi = gx | 0, yi = gy | 0, fx = gx - xi, fy = gy - yi, o = yi * PN + xi; return pdg[o] * (1 - fx) * (1 - fy) + pdg[o + 1] * fx * (1 - fy) + pdg[o + PN] * (1 - fx) * fy + pdg[o + PN + 1] * fx * fy; };
  const mk = () => { const cv = document.createElement('canvas'); cv.width = cv.height = S; return cv; };
  const L = { varg: mk(), dry: mk(), dirt: mk(), mud: mk(), dark: mk(), light: mk() };
  const D = {}; for (const k in L) D[k] = L[k].getContext('2d').createImageData(S, S);
  for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
    const x = (px + 0.5) / M, y = (py + 0.5) / M, o = (py * S + px) * 4 + 3;
    const dc = Math.hypot(x - mid, y - mid), edge = Math.min(x, y, N - x, N - y), wd = dAt(x, y);
    const n0 = nz[0](x / 16, y / 16, 3), n1 = nz[1](x / 7, y / 7, 3), n2 = nz[2](x / 5, y / 5, 2), n3 = nz[3](x / 22, y / 22, 3), n4 = nz[4](x / 3, y / 3, 2);
    // seconda erba (ruotata) per spezzare la ripetizione
    D.varg.data[o] = 255 * smooth(0.42, 0.62, n1) * 0.75;
    // erba secca: grandi chiazze, meno vicino all'acqua e al villaggio
    let dry = smooth(0.64, 0.78, n0 * 0.75 + n3 * 0.35) * smooth(1.5, 4, wd) * 0.55;
    if (!enemy) dry *= smooth(16, 26, dc); else dry = Math.max(dry, smooth(12, 9, dc) * 0.5);
    D.dry.data[o] = 255 * dry;
    // terra battuta: piazza, sentieri, accampamento, zolle sparse
    let dirt = 0;
    const r0 = enemy ? 10.5 : 4.2; dirt = smooth(r0 + 1.6, r0 - 1.6, dc + (n2 - 0.5) * (enemy ? 7 : 2.4) + (n0 - 0.5) * (enemy ? 9 : 3)) * (enemy ? 1 : 0.75);
    if (segs.length) { const sd = segD(x, y); dirt = Math.max(dirt, smooth(0.95, 0.25, sd + (n2 - 0.5) * 0.5) * (enemy ? 0.85 : 0.6)); }
    if (enemy) dirt = Math.max(dirt, smooth(0.8, 0.88, n4 * 0.6 + n0 * 0.5) * 0.5);
    // accampamento romano: grande piazzale rettangolare di terra calpestata, con fossa e terrapieno lungo il bordo
    let camp = 0, ditch = 0, bank = 0;
    if (!enemy) { const ch = Math.max(Math.abs(x - mid), Math.abs(y - mid)) + (n2 - 0.5) * 1.2 + (n0 - 0.5) * 1.6;
      camp = smooth(CAMP_R + 0.8, CAMP_R - 1.2, ch) * (0.72 + 0.28 * smooth(0.3, 0.7, n1)); dirt = Math.max(dirt, camp);
      const cr = Math.max(Math.abs(x - mid), Math.abs(y - mid)) + (n2 - 0.5) * 0.35; ditch = smooth(0.75, 0.15, Math.abs(cr - CAMP_R - 1.4)); bank = smooth(0.7, 0.1, Math.abs(cr - CAMP_R - 0.4)); dry *= smooth(CAMP_R + 3, CAMP_R + 6, ch); }
    dirt *= smooth(0.2, 1.2, wd); ditch *= smooth(0.5, 1.5, wd); bank *= smooth(0.5, 1.5, wd);
    D.dry.data[o] = 255 * dry;
    D.dirt.data[o] = 255 * Math.min(1, dirt);
    // fango lungo le rive e qualche pozzanghera nei prati
    let mud = smooth(2.6, 0.9, wd + (n2 - 0.5) * 1.6) * smooth(0.15, 0.7, wd);
    mud *= 0.7; if (enemy) mud = Math.max(mud, smooth(0.86, 0.93, n2 * 0.7 + n1 * 0.45) * 0.6 * smooth(8, 12, dc));
    D.mud.data[o] = 255 * Math.min(1, mud);
    // luce/ombra: nuvole dipinte e bordo scuro della foresta
    D.dark.data[o] = 255 * Math.min(1, smooth(0.5, 0.85, n3) * 0.22 + smooth(9, 0, edge) * 0.7 + ditch * 0.75);
    D.light.data[o] = 255 * Math.min(1, smooth(0.55, 0.85, 1 - n3) * 0.6 + bank * 0.9);
  }
  for (const k in L) L[k].getContext('2d').putImageData(D[k], 0, 0);
  return { L, M };
}
// disegna il terreno nel rettangolo [x0,x1)×[y0,y1) (caselle) su ctx già traslato in coordinate mondo×T
function paintGroundRegion(g, ctx, x0, y0, x1, y1, T) {
  const M = g.masks.M, pad = 1, rx0 = x0 - pad, ry0 = y0 - pad, rw = (x1 - x0 + pad * 2), rh = (y1 - y0 + pad * 2);
  const W = Math.ceil(rw * T), H = Math.ceil(rh * T);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  const fillTex = (c, tile) => { const p = c.createPattern(tile, 'repeat'); c.fillStyle = p; c.fillRect(rx0 * T, ry0 * T, W, H); };
  fillTex(ctx, texTile('grass', T, 7));
  let tmp = g._tmp; if (!tmp || tmp.width < W || tmp.height < H) { tmp = g._tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; }
  const tc = tmp.getContext('2d');
  const layer = (mask, draw, alpha, op) => {
    tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-over'; tc.globalAlpha = 1; tc.clearRect(0, 0, W, H);
    tc.save(); tc.translate(-rx0 * T, -ry0 * T); draw(tc); tc.restore();
    tc.globalCompositeOperation = 'destination-in'; tc.imageSmoothingEnabled = true; tc.imageSmoothingQuality = 'high';
    const sx = Math.max(0, rx0 * M), sy = Math.max(0, ry0 * M), ex = Math.min(NMAP * M, (rx0 + rw) * M), ey = Math.min(NMAP * M, (ry0 + rh) * M);
    tc.drawImage(mask, sx, sy, ex - sx, ey - sy, (sx / M - rx0) * T, (sy / M - ry0) * T, (ex - sx) / M * T, (ey - sy) / M * T);
    ctx.save(); ctx.globalAlpha = alpha; if (op) ctx.globalCompositeOperation = op; ctx.drawImage(tmp, 0, 0, W, H, rx0 * T, ry0 * T, W, H); ctx.restore();
  };
  const Lm = g.masks.L;
  layer(Lm.varg, c => fillTex(c, texTile('grass', T, 9.5, 1)), 1);
  layer(Lm.dry, c => fillTex(c, texTile('dry', T, 8)), 1);
  layer(Lm.mud, c => fillTex(c, texTile('mud', T, 7)), 0.95);
  layer(Lm.dirt, c => fillTex(c, texTile('dirt', T, 9)), 1);
  // sentieri lastricati (dalla rete calcolata sugli edifici)
  if (PATHC.grid && TEX.path && g.pathOn && PATHC.lines) {
    const lines = PATHC.lines.filter(l => l.some(([x, y]) => x > rx0 - 2 && y > ry0 - 2 && x < rx0 + rw + 2 && y < ry0 + rh + 2)).map(l => chaikin(l));
    const pathStroke = (cx, w) => { cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.lineWidth = w * T; cx.beginPath(); for (const l of lines) { cx.moveTo(l[0][0] * T, l[0][1] * T); for (let i = 1; i < l.length; i++) cx.lineTo(l[i][0] * T, l[i][1] * T); } if (PATHC.plaza) { const [px, py] = PATHC.plaza; cx.moveTo(px * T + 0.01, py * T); cx.lineTo(px * T, py * T); } cx.stroke(); if (PATHC.plaza) { const [px, py] = PATHC.plaza; cx.beginPath(); cx.arc(px * T, py * T, w * T * 1.05, 0, 7); cx.fill(); } };
    if (lines.length || PATHC.plaza) {
      // alone sfumato di erba calpestata, poi la terra battuta
      ctx.save(); for (const [w, al] of [[1.25, 0.10], [1.0, 0.14], [0.82, 0.2]]) { ctx.globalAlpha = al; ctx.strokeStyle = ctx.fillStyle = '#5b4426'; pathStroke(ctx, w); } ctx.restore();
      tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-over'; tc.globalAlpha = 1; tc.clearRect(0, 0, W, H); tc.save(); tc.translate(-rx0 * T, -ry0 * T); tc.strokeStyle = tc.fillStyle = '#000'; pathStroke(tc, 0.66);
      tc.globalCompositeOperation = 'source-in'; tc.fillStyle = tc.createPattern(texTile('path', T, 3), 'repeat'); tc.fillRect(rx0 * T, ry0 * T, W, H); tc.restore(); tc.globalCompositeOperation = 'source-over';
      ctx.save(); ctx.globalAlpha = 0.92; ctx.drawImage(tmp, 0, 0, W, H, rx0 * T, ry0 * T, W, H); ctx.restore(); } }
  layer(Lm.dark, c => { c.fillStyle = '#16200a'; c.fillRect(rx0 * T, ry0 * T, W, H); }, 0.32);
  layer(Lm.light, c => { c.fillStyle = '#fff3c8'; c.fillRect(rx0 * T, ry0 * T, W, H); }, 0.1);
  for (const d of g.decals) if (EATL_OK) { const f = EFR[d.k]; if (d.x > x1 + 1 || d.y > y1 + 1 || d.x + d.w < x0 - 1 || d.y + d.h < y0 - 1) continue; ctx.drawImage(EATL, f[0], f[1], f[2], f[3], d.x * T, d.y * T, d.w * T, d.h * T); }
  ctx.strokeStyle = 'rgba(20,15,5,0.5)'; ctx.lineWidth = Math.max(2, T / 10); ctx.strokeRect(0, 0, NMAP * T, NMAP * T);
}
const GCH = 12, GT = 40, GLOW = 12, GMAXCH = 48;
function paintGround(enemy, decals, seed) {
  const g = { enemy, decals: decals || [], seed, chunks: new Map(), tick: 0, stale: !TEX_OK || (!!(decals && decals.length) && !EATL_OK) };
  if (!TEX_OK) return g;
  g.masks = groundMasks(enemy, g.decals, seed || 1);
  const cv = document.createElement('canvas'); cv.width = cv.height = NMAP * GLOW; const c = cv.getContext('2d');
  paintGroundRegion(g, c, 0, 0, NMAP, NMAP, GLOW); g.low = cv;
  return g;
}
function groundChunk(g, cx, cy) {
  const key = cx + ',' + cy; let ch = g.chunks.get(key); if (ch) { ch.t = g.tick; return ch; }
  const pad = 4, S = GCH * GT + pad * 2; const cv = document.createElement('canvas'); cv.width = cv.height = S; const c = cv.getContext('2d');
  c.translate(pad - cx * GCH * GT, pad - cy * GCH * GT);
  paintGroundRegion(g, c, cx * GCH, cy * GCH, (cx + 1) * GCH, (cy + 1) * GCH, GT);
  ch = { cv, pad, t: g.tick }; g.chunks.set(key, ch);
  if (g.chunks.size > GMAXCH) { let ok = null, ot = 1e18; for (const [k, v] of g.chunks) if (v.t < ot) { ot = v.t; ok = k; } g.chunks.delete(ok); }
  return ch;
}
function drawGround(c, sc, vx0, vy0, vx1, vy1) {
  let g = sc.ground;
  if (g.stale && TEX_OK && (EATL_OK || !g.decals.length)) { g = sc.ground = paintGround(g.enemy, g.decals, g.seed); if (!g.enemy) GROUND_V = g; }
  if (g.low && !g.enemy && (sc.mode === 'village' || sc.mode === 'raid' || sc.mode === 'visit') && g.pathKey !== PATHC.key && PATHC.grid) { g.pathKey = PATHC.key; g.pathOn = true; g.chunks.clear(); const lc = g.low.getContext('2d'); lc.setTransform(1, 0, 0, 1, 0, 0); paintGroundRegion(g, lc, 0, 0, NMAP, NMAP, GLOW); }
  if (!g.low) { c.fillStyle = '#5d6b32'; c.save(); tileTransform(c, 1); c.fillRect(0, 0, NMAP, NMAP); c.restore(); return; }
  g.tick++;
  c.save(); tileTransform(c, GLOW); c.drawImage(g.low, 0, 0); c.restore();
  if (cam.z < 0.42) return;
  const n = Math.ceil(NMAP / GCH); let budget = 2; const want = [];
  for (let cy = 0; cy < n; cy++) for (let cx = 0; cx < n; cx++) {
    const xs = [], ys = []; for (const [u, v] of [[cx * GCH, cy * GCH], [(cx + 1) * GCH, cy * GCH], [cx * GCH, (cy + 1) * GCH], [(cx + 1) * GCH, (cy + 1) * GCH]]) { const p = W(u, v); xs.push(p[0]); ys.push(p[1]); }
    if (Math.max(...xs) < vx0 || Math.min(...xs) > vx1 || Math.max(...ys) < vy0 || Math.min(...ys) > vy1) continue;
    const key = cx + ',' + cy; if (g.chunks.has(key)) want.push([cx, cy, 0]); else { const cxw = (Math.min(...xs) + Math.max(...xs)) / 2 - cam.x, cyw = (Math.min(...ys) + Math.max(...ys)) / 2 - cam.y; want.push([cx, cy, 1, cxw * cxw + cyw * cyw]); }
  }
  want.sort((a, b) => (a[2] - b[2]) || ((a[3] || 0) - (b[3] || 0)));
  for (const [cx, cy, miss] of want) {
    if (miss) { if (budget <= 0) continue; budget--; }
    const ch = groundChunk(g, cx, cy);
    c.save(); tileTransform(c, GT); c.drawImage(ch.cv, cx * GCH * GT - ch.pad, cy * GCH * GT - ch.pad); c.restore();
  }
}

// env sprites: tinted tree variants
let TREEV = null;
function treeVariants() {
  if (TREEV || !EATL_OK) return TREEV; TREEV = [];
  for (const k of ['abete', 'quercia']) for (const tint of [0, 0.14, 0.28]) {
    const f = EFR[k]; const cv2 = document.createElement('canvas'); cv2.width = f[2]; cv2.height = f[3]; const c = cv2.getContext('2d');
    c.drawImage(EATL, f[0], f[1], f[2], f[3], 0, 0, f[2], f[3]);
    if (tint) { c.globalCompositeOperation = 'source-atop'; c.fillStyle = k === 'quercia' ? `rgba(60,55,10,${tint})` : `rgba(10,25,20,${tint})`; c.fillRect(0, 0, f[2], f[3]); }
    TREEV.push({ cv: cv2, k });
  }
  return TREEV;
}

// ================= CORE: data, state, map, pathfinding =================
const RES = ['cibo', 'legno', 'oro', 'pietra', 'ferro', 'pelli', 'favore'];
const RICON = { cibo: '🌾', legno: '🪵', oro: '🪙', pietra: '🪨', ferro: '⚒️', pelli: '🧥', favore: '🦅' };
const RNAME = { cibo: 'Cibo', legno: 'Legno', oro: 'Oro', pietra: 'Pietra', ferro: 'Ferro', pelli: 'Pelli', favore: 'Favore Imperiale' };
// building defs. max[] = max count per Mastio level 1..8. spr = sprite building (from Marco's art)
const BDEF = {
  mastio: { n: 'Castrum', w: 3, h: 3, hp: 1600, desc: 'Quartier generale del presidio. Il suo livello sblocca edifici, truppe ed eroi. Dal livello 5 diventa un Castellum di pietra.', max: [1, 1, 1, 1, 1, 1, 1, 1], icon: '🏰', shoot: { range: 5.5, dmg: 8, cd: 1.3, type: 'arrow' }, pop: 2 },
  casa: { n: 'Domus', w: 2, h: 2, hp: 320, cost: { legno: 70, cibo: 30 }, prod: ['oro', 5], pop: 6, desc: 'Famiglie di coloni: +6 Popolazione per livello (posti esercito) e qualche tassa in oro.', max: [2, 3, 4, 5, 6, 7, 8, 9], icon: '🏠', t: 5, spr: 'casa' },
  taverna: { n: 'Taberna', w: 2, h: 2, hp: 450, cost: { legno: 90, oro: 20 }, prod: ['cibo', 42], desc: 'Forno, salsicce, puls e pane per tutto il presidio. Produce molto Cibo.', max: [1, 1, 2, 2, 2, 3, 3, 3], icon: '🍖', t: 8, spr: 'taverna' },
  fattoria: { n: 'Villa Rustica', w: 3, h: 3, hp: 450, cost: { legno: 80 }, prod: ['cibo', 30], pop: 3, desc: 'Casa colonica, fienile, macina e campi recintati. +30 Cibo/min, mantiene 3 abitanti in più e fornisce il fieno alla Stalla.', max: [2, 2, 3, 3, 4, 4, 5, 5], icon: '🌾', t: 6, spr: 'fattoria' },
  capanna: { n: 'Falegnameria', w: 2, h: 2, hp: 400, cost: { legno: 40, cibo: 20 }, prod: ['legno', 28], desc: 'Segheria ad acqua: il taglialegna porta i tronchi della Selva Pannonica, la sega li fa assi. Produce Legno.', max: [2, 2, 3, 3, 4, 4, 5, 5], icon: '🪚', t: 6, spr: 'falegnameria' },
  fucina: { n: 'Fabrica', w: 2, h: 2, hp: 480, cost: { legno: 110, cibo: 40 }, prod: ['ferro', 12], desc: 'Forgia e incudine dei fabri della legione. Produce Ferro per loriche, gladi e pila.', max: [0, 1, 1, 2, 2, 2, 3, 3], icon: '⚒️', t: 10, spr: 'fucina' },
  armeria: { n: 'Armamentarium', w: 2, h: 2, hp: 550, cost: { legno: 150, ferro: 60 }, arms: 0.08, desc: 'Gladi, scudi e pila per tutto l\'esercito: +8% danno a tutte le truppe per livello. Serve per le truppe pesanti.', max: [0, 0, 1, 1, 1, 1, 1, 1], icon: '🗡️', t: 12, spr: 'armeria' },
  infermeria: { n: 'Valetudinarium', w: 2, h: 2, hp: 450, cost: { legno: 120, cibo: 80 }, cure: 0.15, desc: 'Erbe, bende e medici esperti: dopo ogni battaglia recupera il 15% dei caduti per livello. Di notte cura i difensori vicini.', max: [0, 1, 1, 1, 1, 1, 1, 1], icon: '✚', t: 10, spr: 'infermeria' },
  miniera: { n: 'Miniera', w: 3, h: 3, hp: 550, cost: { legno: 120, cibo: 60 }, prod: ['ferro', 20], bonus: { pietra: 0.5 }, desc: 'Galleria nella roccia puntellata dal legno. +20 Ferro/min e +10 Pietra/min: alimenta la Fabrica e le Mura.', max: [0, 1, 1, 2, 2, 2, 3, 3], icon: '⛏️', t: 10, spr: 'miniera' },
  cava: { n: 'Cava di Pietra', w: 2, h: 2, hp: 500, cost: { legno: 150, oro: 60 }, prod: ['pietra', 12], desc: 'Pietra per mura e Castellum. Lenta da estrarre.', max: [0, 0, 1, 1, 1, 2, 2, 2], icon: '🪨', t: 12 },
  granaio: { n: 'Horreum', w: 2, h: 2, hp: 500, cost: { legno: 100 }, store: { cibo: 900, legno: 500, pietra: 300, ferro: 250 }, desc: 'Stocca Cibo, Legno, Pietra e Ferro. Evita la carestia.', max: [1, 1, 2, 2, 2, 3, 3, 3], icon: '🏚️', t: 8 },
  tesoreria: { n: 'Aerarium', w: 2, h: 2, hp: 650, cost: { legno: 120, pietra: 40 }, store: { oro: 1000 }, desc: "Deposito dell'oro del presidio.", max: [0, 0, 1, 1, 1, 2, 2, 2], icon: '💰', t: 12 },
  caserma: { n: 'Caserma', w: 3, h: 3, hp: 700, cost: { legno: 150, cibo: 50 }, army: 1, desc: 'Addestra la fanteria.', max: [1, 1, 1, 1, 2, 2, 2, 2], icon: '⚔️', t: 10 },
  poligono: { n: 'Campo di Tiro', w: 3, h: 3, hp: 600, cost: { legno: 200, oro: 80 }, army: 1, desc: 'Arcieri siriaci e arcuballisti.', max: [0, 1, 1, 1, 1, 1, 2, 2], icon: '🏹', t: 12 },
  scuderia: { n: 'Stalla', w: 3, h: 3, hp: 650, cost: { legno: 260, oro: 150, cibo: 100 }, req: 'fattoria', desc: 'Cavalleria: Arciere a Cavallo, Equite Pretoriano. I cavalli addestrati qui sono +30% più veloci. Serve una Villa Rustica per il fieno.', max: [0, 0, 0, 1, 1, 1, 1, 1], icon: '🐎', t: 15, spr: 'stalla' },
  monastero: { n: 'Tempio di Marte', w: 3, h: 3, hp: 800, cost: { legno: 300, pietra: 200, oro: 200 }, prod: ['favore', 0.6], desc: 'Sacrifici e voti al dio della guerra. Lento Favore Imperiale e accesso ai Gladiatori.', max: [0, 0, 0, 0, 0, 1, 1, 1], icon: '✝️', t: 18 },
  torre: { n: 'Torre di Guardia', w: 1, h: 1, hp: 450, cost: { legno: 80, pietra: 10 }, desc: 'Torre alta con balcone di avvistamento: un sagittario di guardia tira da solo con gittata lunga. Costa poco, proteggi Miniera e Villa Rustica.', max: [1, 2, 2, 3, 3, 4, 4, 5], icon: '🗼', t: 6, shoot: { range: 7.5, dmg: 10, cd: 1.1, type: 'arrow' }, spr: 'torre' },
  torrepietra: { n: 'Torre di Pietra', w: 2, h: 2, hp: 1500, cost: { pietra: 220, legno: 100, oro: 80 }, desc: 'Torre di guardia in pietra squadrata, con merli e tetto di tegole. Gli arcieri tirano più lontano e più forte, e regge a lungo agli assedi. Arriva con l\'Età della Legione.', max: [0, 0, 0, 0, 1, 1, 2, 2], icon: '🏰', t: 16, shoot: { range: 9, dmg: 18, cd: 0.9, type: 'arrow' } },
  balista: { n: 'Torre Balista', w: 2, h: 2, hp: 700, cost: { legno: 150, pietra: 80, ferro: 40 }, desc: 'Grande balista a torsione, come quelle delle legioni. Colpi pesanti, anti-cavalleria.', max: [0, 0, 1, 1, 2, 2, 3, 3], icon: '🎯', t: 12, shoot: { range: 7.5, dmg: 42, cd: 2.6, type: 'bolt' } },
  fossato: { n: 'Fossato', w: 1, h: 1, hp: 9999, cost: { pietra: 25, cibo: 10 }, desc: 'Fossato pieno d\'acqua davanti alle mura. I nemici lo attraversano a fatica (60% più lenti), le tue truppe conoscono il guado. Si unisce da solo ai fossati vicini.', max: [0, 0, 10, 20, 30, 40, 50, 60], icon: '🌊', t: 4, decor: true, moat: true, pr: 0 },
  muro: { n: 'Palizzata', w: 1, h: 1, hp: 260, cost: { legno: 6 }, desc: 'Tronchi appuntiti su un vallo di terra. Dal livello 2 (Castrum 5) diventa Mura di Pietra.', max: [24, 40, 60, 80, 100, 120, 150, 180], icon: '🪵', t: 3, wall: true },
  stendardo: { n: 'Vessillo della Legione', w: 1, h: 1, hp: 120, cost: { oro: 30 }, desc: 'Drappo rosso con le lettere d\'oro. Puro orgoglio legionario.', max: [2, 2, 3, 3, 4, 4, 5, 5], icon: '🚩', t: 5, decor: true },
  municipio: { n: 'Basilica', w: 3, h: 3, hp: 1000, cost: { legno: 300, pietra: 120, oro: 150 }, prod: ['oro', 20], pop: 20, desc: 'Cuore amministrativo con il tribunale e la meridiana. +20 Popolazione per livello e tasse (+20 Oro/min). Sblocca Tempio di Giove, Forum e Biblioteca.', max: [0, 1, 1, 1, 1, 1, 1, 1], icon: '🏛️', t: 15, spr: 'municipio' },
  mercato: { n: 'Forum', w: 3, h: 3, hp: 600, cost: { legno: 220, oro: 80 }, prod: ['oro', 10], req: 'municipio', desc: 'Cinque bancarelle sotto il portico. +10 Oro/min e scambi: vendi legno, cibo e ferro in cambio d\'oro, o compra ferro.', max: [0, 0, 1, 1, 1, 1, 2, 2], icon: '🏪', t: 12, spr: 'mercato' },
  cripta: { n: 'Sepolcreto degli Eroi', w: 2, h: 2, hp: 900, cost: { pietra: 160, oro: 90, legno: 40 }, desc: 'Lungo la via riposano i veterani caduti, col loro nome inciso sulla stele. Ogni eroe custodito dà +1% vita a tutte le truppe (massimo +15%).', max: [0, 0, 1, 1, 1, 1, 1, 1], icon: '⚱️', t: 14, spr: 'chiesa' },
  chiesa: { n: 'Tempio di Giove', w: 2, h: 2, hp: 700, cost: { pietra: 200, legno: 120, oro: 100 }, req: 'municipio', desc: 'Colonne, frontone e altare dei sacrifici. Morale: +10% vita a tutte le truppe. Il Valetudinarium cura il 20% in più e di notte cura i difensori vicini.', max: [0, 0, 1, 1, 1, 1, 1, 1], icon: '⛪', t: 14, spr: 'chiesa' },
  accademia: { n: 'Biblioteca', w: 3, h: 3, hp: 800, cost: { legno: 300, pietra: 200, oro: 250 }, req: 'municipio', desc: 'Rotoli, mappe e scuola di guerra: ricerche permanenti su armature, balistica e logistica.', max: [0, 0, 0, 1, 1, 1, 1, 1], icon: '📚', t: 18, spr: 'accademia' },
  anfiteatro: { n: 'Anfiteatro', w: 6, h: 6, hp: 3000, cost: { pietra: 600, oro: 400, legno: 200 }, prod: ['oro', 25], desc: 'Il grande anfiteatro di pietra, cuore della città: giochi, gladiatori e venationes richiamano folle da tutta la Provincia. +25 Oro/min dai biglietti e dai mercanti.', max: [1, 1, 1, 1, 1, 1, 1, 1], icon: '🏟️', t: 30 },
  cancello: { n: 'Mura con Porta', w: 2, h: 2, hp: 1000, cost: { pietra: 150, legno: 80, ferro: 30 }, gate: true, desc: 'Torri merlate, saracinesca e porta ferrata. 1000 vita, i nemici devono abbatterla, le tue truppe passano. Ospita 2 arcieri.', max: [0, 0, 1, 1, 2, 2, 3, 4], icon: '🏯', t: 12, shoot: { range: 6, dmg: 8, cd: 0.8, type: 'arrow' }, spr: 'cancello' },
  // decorazioni / ostacoli naturali (acquistabili e rimovibili)
  funghi: { n: 'Funghi del Bosco', w: 1, h: 1, hp: 60, cost: { oro: 40 }, desc: 'Ovoli rossi tra l\'erba e i fiori. Belli da vedere, da non mangiare.', max: [3, 4, 5, 6, 7, 8, 9, 10], icon: '🍄', t: 4, decor: true, spr: 'funghi', rm: { cost: { cibo: 5 }, t: 3, gain: { cibo: 40 } } },
  cespuglio: { n: 'Cespuglio', w: 1, h: 1, hp: 60, cost: { oro: 25 }, desc: 'Siepe fitta di foglie: verde e riparo per gli uccelli.', max: [4, 5, 6, 7, 8, 9, 10, 12], icon: '🌿', t: 4, decor: true, spr: 'cespuglio', rm: { cost: { cibo: 8 }, t: 5, gain: { legno: 20, cibo: 15 } } },
  masso: { n: 'Masso Muschioso', w: 1, h: 1, hp: 200, cost: { oro: 60 }, desc: 'Pietra antica coperta di muschio.', max: [2, 3, 3, 4, 4, 5, 5, 6], icon: '🪨', t: 6, decor: true, spr: 'masso', rm: { cost: { oro: 30 }, t: 12, gain: { pietra: 45 } } },
  tronco: { n: 'Tronco Caduto', w: 2, h: 1, hp: 120, cost: { oro: 50 }, desc: 'Vecchio tronco caduto, coperto di licheni.', max: [2, 2, 3, 3, 4, 4, 5, 5], icon: '🪵', t: 5, decor: true, spr: 'tronco', rm: { cost: { cibo: 20 }, t: 9, gain: { legno: 70 } } },
  // enemy-only
  tenda: { n: 'Tenda dei Barbari', w: 2, h: 2, hp: 300, icon: '⛺' },
  bottino: { n: 'Carro del Bottino', w: 2, h: 2, hp: 450, icon: '💰' },
  capanno: { n: 'Capanno', w: 2, h: 2, hp: 320, icon: '🛖' },
  falo: { n: 'Falò', w: 1, h: 1, hp: 80, icon: '🔥', decor: true },
  pozzo: { n: 'Pozzo', w: 1, h: 1, hp: 200, cost: { oro: 60, pietra: 20 }, desc: 'Il pozzo del villaggio, con il tetto di legno e la carrucola. Qui si fermano a chiacchierare le donne del vicus.', max: [1, 1, 2, 2, 3, 3, 4, 4], icon: '🪣', t: 6, decor: true, pr: 3 },
  aiuola: { n: 'Aiuola Fiorita', w: 1, h: 1, hp: 40, cost: { cibo: 20, oro: 15 }, desc: 'Papaveri, calendule e fiordalisi in un bordo di pietra.', max: [3, 4, 6, 8, 10, 12, 14, 16], icon: '🌷', t: 3, decor: true, pr: 1 },
  siepe: { n: 'Siepe Potata', w: 1, h: 1, hp: 60, cost: { legno: 15 }, desc: 'Bosso potato a regola d\'arte dai giardinieri della villa.', max: [4, 6, 8, 10, 12, 14, 16, 20], icon: '🟩', t: 3, decor: true, pr: 1 },
  lanterna: { n: 'Lucerna', w: 1, h: 1, hp: 50, cost: { legno: 10, ferro: 10 }, desc: 'Lucerna su palo di ferro. Di notte illumina strade e piazze.', max: [2, 4, 6, 8, 10, 12, 14, 16], icon: '🏮', t: 3, decor: true, pr: 1 },
  pagliaio: { n: 'Pagliaio', w: 1, h: 1, hp: 60, cost: { cibo: 30 }, desc: 'Fieno accatastato per l\'inverno attorno a un palo.', max: [2, 3, 4, 5, 6, 7, 8, 9], icon: '🌾', t: 3, decor: true, pr: 1 },
  catasta: { n: 'Catasta di Legna', w: 1, h: 1, hp: 60, cost: { legno: 40 }, desc: 'Ciocchi spaccati e impilati per scaldare le case.', max: [2, 3, 4, 5, 6, 7, 8, 9], icon: '🪵', t: 3, decor: true, pr: 1 },
  panni: { n: 'Panni Stesi', w: 1, h: 1, hp: 40, cost: { legno: 10, cibo: 10 }, desc: 'Lenzuola e tuniche ad asciugare al vento.', max: [1, 2, 3, 4, 5, 6, 7, 8], icon: '👕', t: 2, decor: true, pr: 1 },
  spaventapasseri: { n: 'Spaventapasseri', w: 1, h: 1, hp: 40, cost: { cibo: 15, legno: 10 }, desc: 'Cappello di paglia e tunica rossa: i corvi stanno alla larga.', max: [1, 2, 3, 3, 4, 4, 5, 5], icon: '🧑‍🌾', t: 2, decor: true, pr: 1 },
  carretto: { n: 'Carretto', w: 1, h: 1, hp: 80, cost: { legno: 50 }, desc: 'Un carretto carico di sacchi e grano, pronto per il forum.', max: [1, 2, 2, 3, 3, 4, 4, 5], icon: '🛒', t: 4, decor: true, pr: 2 },
  alveari: { n: 'Alveari', w: 1, h: 1, hp: 50, cost: { legno: 30, cibo: 20 }, desc: 'Tre arnie di paglia intrecciata. Le api ronzano tra i fiori.', max: [0, 1, 2, 2, 3, 3, 4, 4], icon: '🐝', t: 4, decor: true, pr: 2 },
  recinto: { n: 'Recinto degli Animali', w: 2, h: 2, hp: 150, cost: { legno: 60, cibo: 40 }, desc: 'Pecore e galline dietro uno steccato di legno.', max: [0, 1, 1, 2, 2, 3, 3, 4], icon: '🐑', t: 6, decor: true, pr: 4 },
  bancarella: { n: 'Bancarella', w: 1, h: 1, hp: 80, cost: { legno: 40, oro: 30 }, desc: 'Banco a strisce con frutta, spezie e stoffe.', max: [0, 1, 2, 3, 4, 5, 6, 7], icon: '🎪', t: 4, decor: true, pr: 3 },
  croce: { n: 'Ara Votiva', w: 1, h: 1, hp: 150, cost: { pietra: 40 }, desc: 'Piccolo altare di pietra dove si offrono spighe a Cerere per il raccolto.', max: [0, 1, 1, 2, 2, 3, 3, 4], icon: '✝️', t: 5, decor: true, pr: 2 },
  gogna: { n: 'Gogna', w: 1, h: 1, hp: 100, cost: { legno: 40, ferro: 10 }, desc: 'La gogna in piazza: la giustizia del tribuno è sotto gli occhi di tutti.', max: [0, 0, 1, 1, 1, 2, 2, 2], icon: '⛓️', t: 5, decor: true, pr: 2 },
  staccionata: { n: 'Staccionata', w: 1, h: 1, hp: 60, cost: { legno: 12 }, desc: 'Staccionata di pali grezzi. Toccala e usa ↻ Ruota per orientarla.', max: [6, 10, 14, 18, 24, 30, 36, 44], icon: '🪵', t: 2, decor: true, pr: 1 },
  steccato: { n: 'Steccato Appuntito', w: 1, h: 1, hp: 80, cost: { legno: 18 }, desc: 'Pali appuntiti piantati fitti: un recinto da villaggio di frontiera.', max: [4, 8, 12, 16, 20, 24, 28, 32], icon: '🪵', t: 2, decor: true, pr: 1 },
  cavallofrisia: { n: 'Cavallo di Frisia', w: 1, h: 1, hp: 120, cost: { legno: 30, ferro: 5 }, desc: 'Tronchi incrociati e appuntiti contro le cariche dei cavalieri sarmati.', max: [0, 2, 4, 6, 8, 10, 12, 14], icon: '✖️', t: 3, decor: true, pr: 1 },
  cassa: { n: 'Cassa di Legno', w: 1, h: 1, hp: 40, cost: { legno: 15 }, desc: 'Una cassa inchiodata, piena di attrezzi e chiodi.', max: [3, 5, 7, 9, 11, 13, 15, 18], icon: '📦', t: 2, decor: true, pr: 1 },
  cassafieno: { n: 'Cassa di Fieno', w: 1, h: 1, hp: 40, cost: { legno: 12, cibo: 10 }, desc: 'Fieno fresco per le bestie della stalla.', max: [2, 4, 6, 8, 10, 12, 14, 16], icon: '📦', t: 2, decor: true, pr: 1 },
  cassaortaggi: { n: 'Cassa di Ortaggi', w: 1, h: 1, hp: 40, cost: { legno: 12, cibo: 15 }, desc: 'Cavoli e verze appena raccolti dall\'orto.', max: [2, 4, 6, 8, 10, 12, 14, 16], icon: '🥬', t: 2, decor: true, pr: 1 },
  botte: { n: 'Botte', w: 1, h: 1, hp: 50, cost: { legno: 20 }, desc: 'Botte di rovere cerchiata di ferro: vino, posca o acqua piovana.', max: [2, 4, 6, 8, 10, 12, 14, 16], icon: '🛢️', t: 2, decor: true, pr: 1 },
  anfora: { n: 'Anfora', w: 1, h: 1, hp: 30, cost: { oro: 15 }, desc: 'Anfora di terracotta per olio, vino e garum.', max: [2, 3, 4, 5, 6, 7, 8, 9], icon: '🏺', t: 2, decor: true, pr: 1 },
  fontanella: { n: 'Pompa dell\'Acqua', w: 1, h: 1, hp: 120, cost: { pietra: 30, ferro: 10 }, desc: 'Pompa di pietra con il secchio appeso: acqua fresca per il vicus.', max: [0, 1, 2, 2, 3, 3, 4, 4], icon: '🚰', t: 4, decor: true, pr: 2 },
  stenditoio: { n: 'Stenditoio delle Pelli', w: 1, h: 1, hp: 50, cost: { legno: 20, pelli: 1 }, desc: 'Pelli conciate tese ad asciugare al sole.', max: [1, 2, 3, 4, 5, 6, 7, 8], icon: '🦌', t: 3, decor: true, pr: 2 },
  rastrelliera: { n: 'Rastrelliera d\'Armi', w: 1, h: 1, hp: 150, cost: { legno: 40, ferro: 25 }, desc: 'Gladi, asce, pila e uno scudo, pronti per i tironi.', max: [0, 1, 2, 3, 4, 5, 6, 7], icon: '⚔️', t: 4, decor: true, pr: 3 },
  carriola: { n: 'Carriola', w: 1, h: 1, hp: 40, cost: { legno: 25 }, desc: 'Carriola di legno con la ruota a raggi, lasciata dai muratori.', max: [1, 2, 3, 4, 5, 6, 7, 8], icon: '🛞', t: 2, decor: true, pr: 1 },
  mucchiosassi: { n: 'Ometto di Pietre', w: 1, h: 1, hp: 100, cost: { pietra: 20 }, desc: 'Pietre tonde impilate a mano, come si fa lungo i sentieri.', max: [2, 3, 4, 5, 6, 7, 8, 9], icon: '🪨', t: 2, decor: true, pr: 1 },
  felce: { n: 'Felce', w: 1, h: 1, hp: 20, cost: { cibo: 8 }, desc: 'Un ciuffo di felci verdi.', max: [4, 6, 8, 10, 12, 14, 16, 20], icon: '🌿', t: 1, decor: true, pr: 1 },
  segnavia: { n: 'Miliario', w: 1, h: 1, hp: 40, cost: { legno: 15 }, desc: 'Colonnina di pietra con le miglia fino ai villaggi vicini.', max: [1, 2, 3, 4, 5, 6, 7, 8], icon: '🪧', t: 2, decor: true, pr: 1 },
  gonfalone: { n: 'Vexillum', w: 1, h: 1, hp: 60, cost: { oro: 40, pelli: 1 }, desc: 'Vexillum cremisi sul palo di quercia, per le feste e le parate.', max: [0, 1, 2, 3, 4, 5, 6, 7], icon: '🚩', t: 3, decor: true, pr: 2 },
  lastricato: { n: 'Lastricato', w: 1, h: 1, hp: 999, cost: { pietra: 10 }, desc: 'Lastre di pietra per pavimentare piazze e cortili attorno agli edifici.', max: [0, 10, 20, 30, 45, 60, 80, 100], icon: '🔲', t: 1, decor: true, pr: 1, flat: true },
  muretto: { n: 'Muretto di Pietra', w: 1, h: 1, hp: 200, cost: { pietra: 25 }, desc: 'Muretto a secco di pietre squadrate. Ruotalo con ↻.', max: [0, 4, 8, 12, 16, 20, 24, 30], icon: '🧱', t: 3, decor: true, pr: 1 },
  rovinamuro: { n: 'Muro Diroccato', w: 1, h: 1, hp: 200, cost: { pietra: 30 }, desc: 'Ciò che resta di una vecchia cinta, coperto di muschio.', max: [0, 1, 2, 3, 4, 5, 6, 7], icon: '🏚️', t: 3, decor: true, pr: 2 },
  arco: { n: 'Arco Trionfale', w: 1, h: 1, hp: 300, cost: { pietra: 60, oro: 20 }, desc: 'Un arco di pietra rimasto in piedi da un vecchio trionfo.', max: [0, 0, 1, 2, 2, 3, 3, 4], icon: '🚪', t: 5, decor: true, pr: 4 },
  colonna: { n: 'Colonna Antica', w: 1, h: 1, hp: 300, cost: { pietra: 50 }, desc: 'Colonna squadrata con capitello, segnata dai secoli.', max: [0, 0, 2, 2, 4, 4, 6, 6], icon: '🏛️', t: 5, decor: true, pr: 3 },
  rovine: { n: 'Rovine Antiche', w: 2, h: 2, hp: 400, cost: { pietra: 90, oro: 40 }, desc: 'Un angolo di muro e un pavimento di lastre: le rovine di un antico tempio celtico.', max: [0, 0, 1, 1, 2, 2, 3, 3], icon: '🏛️', t: 6, decor: true, pr: 6 },
  insegna: { n: 'Insegna di Guerra', w: 1, h: 1, hp: 60, cost: { legno: 20, pelli: 1 }, desc: 'Lancia con il drappo di tela logora: segna i confini e le adunate. Ruotala con ↻.', max: [2, 3, 4, 6, 8, 10, 12, 14], icon: '🏴', t: 2, decor: true, pr: 1 },
  pozzogrande: { n: 'Pozzo Muschioso', w: 2, h: 2, hp: 300, cost: { pietra: 60, legno: 40, oro: 30 }, desc: 'Un grande pozzo di pietra coperto di muschio, con il tetto di assi e la carrucola.', max: [0, 1, 1, 2, 2, 3, 3, 4], icon: '🪣', t: 6, decor: true, pr: 5 },
  fontana: { n: 'Fontana di Pietra', w: 2, h: 2, hp: 400, cost: { pietra: 120, oro: 80 }, desc: 'Una vasca ottagonale con lo zampillo. Il cuore della piazza.', max: [0, 0, 1, 1, 2, 2, 2, 3], icon: '⛲', t: 10, decor: true, pr: 8 },
  statua: { n: 'Statua dell\'Imperatore', w: 1, h: 1, hp: 500, cost: { pietra: 150, oro: 150 }, desc: 'Il divo Marco Aurelio, in bronzo, con il braccio alzato.', max: [0, 0, 0, 0, 1, 1, 2, 2], icon: '🗽', t: 12, decor: true, pr: 12 },
};
const BUILD_ORDER = ['municipio', 'casa', 'taverna', 'mercato', 'fattoria', 'capanna', 'granaio', 'fucina', 'infermeria', 'armeria', 'miniera', 'cava', 'tesoreria', 'caserma', 'poligono', 'scuderia', 'monastero', 'chiesa', 'accademia', 'cripta', 'anfiteatro', 'torre', 'torrepietra', 'cancello', 'balista', 'muro', 'fossato'];
const DECOR_ORDER = ['pozzogrande', 'pozzo', 'insegna', 'fontana', 'fontanella', 'statua', 'lastricato', 'lanterna', 'gonfalone', 'stendardo', 'aiuola', 'siepe', 'cespuglio', 'felce', 'staccionata', 'steccato', 'muretto', 'cavallofrisia', 'bancarella', 'carretto', 'carriola', 'rastrelliera', 'cassa', 'cassafieno', 'cassaortaggi', 'botte', 'anfora', 'panni', 'stenditoio', 'pagliaio', 'catasta', 'recinto', 'alveari', 'spaventapasseri', 'segnavia', 'croce', 'gogna', 'arco', 'colonna', 'rovinamuro', 'rovine', 'mucchiosassi', 'funghi', 'masso', 'tronco'];
// dimensione dei modelli delle decorazioni: w = larghezza in caselle, h = altezza in caselle
const DFIT = { pozzogrande: { w: 1.5 }, insegna: { h: 1.5 }, staccionata: { w: 1 }, steccato: { w: 0.95 }, cavallofrisia: { w: 0.85 }, cassa: { w: 0.5 }, cassafieno: { w: 0.55 }, cassaortaggi: { w: 0.55 }, botte: { h: 0.5 }, anfora: { h: 0.45 }, pozzo: { w: 0.85 }, fontanella: { h: 0.8 }, carretto: { w: 0.95 }, carriola: { w: 0.9 }, stenditoio: { w: 0.95 }, rastrelliera: { w: 1 }, mucchiosassi: { w: 0.55 }, felce: { w: 0.7 }, croce: { h: 0.85 }, segnavia: { h: 1.05 }, gonfalone: { h: 1.2 }, lanterna: { h: 1.2 }, rovinamuro: { w: 1 }, arco: { h: 1.25 }, colonna: { h: 1.3 }, rovine: { w: 1.9 }, lastricato: { w: 1.02 }, muretto: { w: 1 } };
const DYAW_RND = { botte: 1, anfora: 1, felce: 1, mucchiosassi: 1, cassa: 1, cassafieno: 1, cassaortaggi: 1 };
// prestigio: ogni decorazione completata dà punti; ogni 4 punti +1% produzione (max +20%)
function prestige() { return lifeCache().pr; }
function prestige0() { if (!S) return 0; let p = 0; for (const b of S.buildings) { const d = BDEF[b.t]; if (d.decor && !b.end && !b.nat) p += d.pr || (d.cost ? 1 : 0); } return p; }
const prestigeMult = () => (S && S.creative ? 1 : 1 + Math.min(0.2, Math.floor(prestige() / 4) / 100));
// ================= VITA DEL BORGO: umore del popolo, feste in piazza, carestia, bambini =================
const LIFEC = { t: -1, pr: 0, um: 50 };
function lifeCache() { const t = performance.now(); if (t - LIFEC.t < 1000 && LIFEC.t >= 0) return LIFEC; LIFEC.t = t; LIFEC.pr = prestige0(); LIFEC.um = umore0(); return LIFEC; }
function umore0() { if (!S) return 50; const c = caps(); const food = (S.res.cibo || 0) / Math.max(1, c.cibo);
  let u = 45 + Math.min(30, LIFEC.pr * 0.6) + Math.min(3, countB('taverna')) * 4 + (hasB('chiesa') ? 6 : 0) + (hasB('mercato') ? 4 : 0);
  u += food > 0.4 ? 8 : food < 0.01 ? -35 : food < 0.12 ? -12 : 0; if (S.raidLostT && now() - S.raidLostT < 20 * 60000) u -= 12; if (S.fest && now() < S.fest.end) u += 5;
  return Math.max(0, Math.min(100, Math.round(u))); }
const umore = () => lifeCache().um;
const umoreWord = v => v >= 75 ? ['😄', 'Festoso'] : v >= 55 ? ['🙂', 'Contento'] : v >= 35 ? ['😐', 'Inquieto'] : ['😠', 'Malcontento'];
const umoreMult = () => { if (!S || S.creative) return 1; const v = umore(); return v >= 75 ? 1.05 : v < 35 ? 0.9 : 1; };
const famine = () => !!(S && !S.creative && MODE === 'village' && (S.res.cibo || 0) < 1);
let FEST_T = 240, FEST_MT = 0;
function festTick(dt) {
  if (!S || S.creative || MODE !== 'village' || !SC) return;
  if (S.fest && now() > S.fest.end) { S.fest = null; }
  if (S.fest) { FEST_MT = (FEST_MT || 0) - dt; if (FEST_MT <= 0) { FEST_MT = 9.1; sfx('festa'); } }
  if (famine()) { if (!S.famineWarned) { S.famineWarned = 1; toast('🍂 Carestia! Il granaio è vuoto: le case si spengono e il popolo è malcontento (-10% produzione)'); sfx('bell'); } } else S.famineWarned = 0;
  FEST_T -= dt; if (FEST_T > 0 || S.fest) return; FEST_T = 420 + Math.random() * 300;
  if (umore() < 70 || !PATHC.plaza || (S.nightIn != null && S.nightIn < 120)) return;
  festStart();
}
function festStart() {
  const [px, py] = PATHC.plaza || [MCX, MCX]; S.fest = { end: now() + 80000, x: px + 1.2, y: py + 1.4 };
  addRes('favore', 1); toast('🎉 Festa in piazza! Il popolo è felice e balla attorno al falò: +1 👑 Favore'); sfx('festa'); FEST_MT = 9.1; festFX();
  for (const u of SC.U) if (u.ai === workerAI || u.kid) { u.st = 'rest'; u.wt = Math.random() * 2; }
}
function festFX() { if (!S.fest || !SC) return; if (SC.FX.some(f => f.k === 'festa')) return; SC.FX.push({ k: 'festa', x: S.fest.x, y: S.fest.y, t: 0, dur: Math.max(1, (S.fest.end - now()) / 1000), draw: drawFesta }); }
function drawFesta(c, sc, f, wx, wy) {
  const t = sc.time, fade = Math.min(1, f.t / 2, (f.dur - f.t) / 3);
  // ghirlanda di bandierine su due pali
  const A = W(f.x - 1.6, f.y - 1.6), B = W(f.x + 1.6, f.y - 1.6); c.globalAlpha = fade;
  for (const P of [A, B]) { c.fillStyle = '#55381f'; c.fillRect(P[0] - 1.2, P[1] - 46, 2.4, 46); }
  const cols = ['#c0392b', '#f1c40f', '#2e86de', '#27ae60', '#f5f1e8'];
  for (let i = 0; i < 11; i++) { const k = (i + 0.5) / 11, x = A[0] + (B[0] - A[0]) * k, y = A[1] - 44 + (B[1] - A[1]) * k + Math.sin(k * Math.PI) * 10 + Math.sin(t * 3 + i) * 0.8; c.fillStyle = cols[i % 5]; c.beginPath(); c.moveTo(x - 3, y); c.lineTo(x + 3, y); c.lineTo(x, y + 6); c.closePath(); c.fill(); }
  // falò
  c.fillStyle = '#3a2a1a'; c.beginPath(); c.ellipse(wx, wy, 9, 4.5, 0, 0, 7); c.fill();
  for (let i = 0; i < 9; i++) { const k = ((t * 1.7 + i / 9) % 1), x = wx + Math.sin(i * 2.3 + t * 5) * 4 * (1 - k), y = wy - 3 - k * 24; c.fillStyle = `rgba(255,${(200 - k * 140) | 0},40,${0.85 * (1 - k)})`; c.beginPath(); c.arc(x, y, 5 * (1 - k) + 1.5, 0, 7); c.fill(); }
  const g = c.createRadialGradient(wx, wy - 8, 2, wx, wy - 8, 60); g.addColorStop(0, `rgba(255,180,80,${0.35 * fade})`); g.addColorStop(1, 'rgba(255,140,50,0)'); c.fillStyle = g; c.fillRect(wx - 60, wy - 68, 120, 120);
  // note musicali
  c.fillStyle = 'rgba(255,245,210,0.9)'; c.font = '11px serif'; for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; c.globalAlpha = fade * (1 - k); c.fillText(i % 2 ? '♪' : '♫', wx - 18 + i * 16 + Math.sin(t * 2 + i) * 4, wy - 34 - k * 26); }
  c.globalAlpha = 1;
}
// durante la festa i paesani vanno a ballare attorno al falò
function festSpot(u) { if (!S.fest) return null; const a = Math.random() * 6.283, r = 1.3 + Math.random() * 1.1; const tx = Math.floor(S.fest.x + Math.cos(a) * r), ty = Math.floor(S.fest.y + Math.sin(a) * r); return [tx, ty]; }
// bambini che giocano a rincorrersi tra le case
function spawnKids(sc) {
  const houses = sc.B.filter(b => b.t === 'casa' && !b.dead); const n = Math.min(5, Math.floor(houses.length / 2) + (hasB('taverna') ? 1 : 0)); const R = rng(91);
  for (let i = 0; i < n; i++) { const h = houses[i % houses.length]; const [hx, hy] = frontTile(sc, h); const u = mkUnit('miliziano', 'V', hx + 0.5, hy + 0.5); u.k = ['cuoco', 'infermiera', 'fabbro', 'cuoco', 'infermiera'][i]; u.kid = true; u.d = { spd: 1.25 + R() * 0.3, hp: 1, cd: 1, rng: 0 }; u.st = 'rest'; u.wt = R() * 4; u.ai = kidAI; sc.U.push(u); }
}
function kidAI(sc, u, dt) {
  if (u.st === 'rest') { u.wt -= dt; if (u.wt > 0) return; let tx, ty; const fs = S && S.fest && now() < S.fest.end ? festSpot(u) : null;
    if (fs) [tx, ty] = fs; else { const others = sc.U.filter(o => o.kid && o !== u); if (others.length && Math.random() < 0.5) { const o = others[(Math.random() * others.length) | 0]; tx = Math.floor(o.x + (Math.random() - 0.5) * 2); ty = Math.floor(o.y + (Math.random() - 0.5) * 2); } else { const p = PATHC.plaza || [MCX, MCX]; tx = Math.floor(p[0] + (Math.random() - 0.5) * 14); ty = Math.floor(p[1] + (Math.random() - 0.5) * 14); } }
    if (!inMap(tx, ty) || bAt(sc, tx, ty) || isWater(sc, tx, ty)) { u.wt = 0.5; return; }
    u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => x === tx && y === ty, villagerCost(sc), tx, ty, 1500); u.pi = 0; u.st = u.path ? 'go' : 'rest'; u.wt = 1; }
  else if (u.st === 'go') { if (followPath(sc, u, dt)) { u.st = 'rest'; u.wt = (S && S.fest ? 0.6 : 1) + Math.random() * 3; } }
}

const NATURE = ['funghi', 'cespuglio', 'cespuglio', 'masso', 'funghi', 'cespuglio', 'masso', 'tronco'];
const TRONCHI_MAX = 8;
// units
const UDEF = {
  miliziano: { sn: 'Tirone', n: 'Tirone', hp: 55, dmg: 8, cd: 1.0, rng: 0.8, spd: 1.15, sp: 1, cost: { cibo: 40 }, lv: 1, at: 'caserma', role: 'Recluta di leva, fanteria leggera', t: 2 },
  arccorto: { sn: 'Sagittario', n: 'Sagittario', hp: 35, dmg: 9, cd: 1.1, rng: 4.5, spd: 1.15, sp: 1, cost: { legno: 50 }, lv: 1, at: 'caserma', role: 'Tiro rapido, debole vs armatura', ranged: 'arrow', t: 2 },
  scudata: { sn: 'Ausiliaria', n: 'Ausiliaria Scudata', hp: 120, dmg: 12, cd: 1.0, rng: 0.8, spd: 1.0, sp: 1, cost: { cibo: 40, oro: 20, ferro: 10 }, lv: 2, at: 'caserma', role: 'Scudo ovale: -25% danno da frecce', armor: 0.25, t: 3 },
  picchiere: { sn: 'Triario', n: 'Triario', hp: 95, dmg: 13, cd: 1.2, rng: 1.3, spd: 0.95, sp: 1, cost: { cibo: 35, legno: 30, ferro: 5 }, lv: 3, at: 'caserma', role: 'Lancia lunga: x3 contro i cavalli', anticav: 3, t: 3 },
  arclungo: { sn: 'Arc. Siriaco', n: 'Arciere Siriaco', hp: 50, dmg: 16, cd: 1.5, rng: 6.5, spd: 1.0, sp: 1, cost: { legno: 90, oro: 60 }, lv: 4, at: 'poligono', role: 'Cecchino a lunga gittata', ranged: 'arrow', t: 4 },
  balestriere: { sn: 'Arcuballista', n: 'Arcuballista', hp: 65, dmg: 26, cd: 2.2, rng: 5.5, spd: 0.9, sp: 1, cost: { oro: 100, ferro: 25 }, lv: 4, at: 'poligono', role: 'Dardi perforanti: ignora le armature', ranged: 'bolt', pierce: true, t: 4 },
  arccavallo: { sn: 'Arc. Cavallo', n: 'Arciere a Cavallo', hp: 140, dmg: 13, cd: 1.0, rng: 4.5, spd: 1.9, sp: 3, cost: { oro: 100, cibo: 80 }, lv: 5, at: 'scuderia', role: 'Razzia veloce, tiro al galoppo', ranged: 'arrow', cav: true, t: 5 },
  uomoarme: { sn: 'Legionario', n: 'Legionario', hp: 190, dmg: 20, cd: 1.1, rng: 0.8, spd: 0.95, sp: 2, cost: { oro: 100, ferro: 40, pelli: 2 }, lv: 6, at: 'caserma', need: 'armeria', role: 'Lorica e scudo: -30% frecce', armor: 0.3, t: 5 },
  berserker: { sn: 'Gladiatore', n: 'Gladiatore', hp: 260, dmg: 38, cd: 1.1, rng: 0.8, spd: 1.15, sp: 2, cost: { favore: 6, oro: 80 }, lv: 6, at: 'monastero', role: 'Furia sotto il 30% di vita: danno x2. Punta agli edifici', fury: true, bld: true, t: 6 },
  guardiareale: { sn: 'Pretoriano', n: 'Equite Pretoriano', hp: 330, dmg: 34, cd: 1.4, rng: 1.0, spd: 1.8, sp: 4, cost: { oro: 200, ferro: 60, cibo: 60, pelli: 3 }, lv: 7, at: 'scuderia', need: 'armeria', role: 'Carica: il primo colpo fa danno doppio', cav: true, charge: true, armor: 0.2, t: 7 },
  ariete: { sn: 'Ariete', n: 'Ariete', hp: 650, dmg: 60, cd: 2.2, rng: 0.75, spd: 0.5, sp: 4, cost: { legno: 220, ferro: 40, cibo: 60 }, lv: 5, at: 'caserma', need: 'fucina', role: 'Sfonda mura e cancelli (danno x3). Non attacca le truppe', siege: 'ram', bld: true, armor: 0.4, t: 6 },
  catapulta: { sn: 'Onagro', n: 'Onagro', hp: 260, dmg: 55, cd: 4.5, rng: 9, spd: 0.45, sp: 4, cost: { legno: 300, pietra: 120, ferro: 60, oro: 80 }, lv: 7, at: 'caserma', need: 'armeria', role: 'Scaglia massi da lontano sugli edifici, colpisce anche chi sta vicino', siege: 'cat', ranged: 'stone', bld: true, t: 8 },
  cavpesante: { sn: 'Catafratto', n: 'Catafratto', hp: 320, dmg: 30, cd: 1.2, rng: 0.9, spd: 0.85, sp: 3, cost: { oro: 180, ferro: 80, pelli: 4 }, lv: 8, at: 'caserma', need: 'armeria', role: 'Armatura a scaglie: -35% danni', armor: 0.35, t: 7 },
};
// bestie notturne (non addestrabili)
UDEF.lupo = { sn: 'Lupo', n: 'Lupo', hp: 70, dmg: 11, cd: 0.8, rng: 0.8, spd: 1.7, sp: 1, beast: true, cost: {}, lv: 99 };
UDEF.orso = { sn: 'Orso', n: 'Orso Bruno', hp: 340, dmg: 30, cd: 1.4, rng: 0.9, spd: 1.0, sp: 3, beast: true, bld: true, cost: {}, lv: 99, armor: 0.15 };
const UNIT_ORDER = ['miliziano', 'arccorto', 'scudata', 'picchiere', 'arclungo', 'balestriere', 'arccavallo', 'uomoarme', 'berserker', 'guardiareale', 'cavpesante', 'ariete', 'catapulta'];
const HDEF = {
  isolde: { n: 'Domina Livia', title: 'Signora di Savaria', hp: 420, dmg: 22, cd: 0.9, rng: 7, spd: 1.1, lv: 2, ranged: 'arrow', ult: 'Pioggia di Frecce', ultd: 'Raffica di frecce su un\'area: danni pesanti e rallenta i nemici del 40%.' },
  tomas: { n: 'Asclepiade', title: 'Il Medico Greco', hp: 650, dmg: 18, cd: 1.0, rng: 1.0, spd: 1.0, lv: 4, ult: 'Balsamo di Asclepio', ultd: 'Cura completa degli alleati vicini e rialza il 30% dei caduti. Aura: cura lenta.', aura: true },
  generale: { n: 'Tito Aurelio Ferox', title: 'Legato, il Portatore dell\'Aquila', hp: 1100, dmg: 34, cd: 1.0, rng: 1.0, spd: 0.95, lv: 5, armor: 0.35, model: 1, ult: 'Sacramentum', ultd: 'Alza l\'aquila: per 8 secondi le truppe vicine fanno +40% danno e si muovono più in fretta. Aura: +10% danno alle truppe attorno a lui.' },
  templare: { n: 'Cassio Longino', title: 'Primipilo, Difensore del Limes', hp: 950, dmg: 40, cd: 1.0, rng: 1.0, spd: 1.0, lv: 6, armor: 0.3, model: 1, ult: 'Testudo', ultd: 'Lui e gli alleati vicini serrano gli scudi a testuggine: invulnerabili per 6 secondi, attirano i nemici.' },
};
const ENEMY_UNITS = ['miliziano', 'arccorto', 'scudata', 'picchiere', 'balestriere', 'uomoarme', 'berserker'];
const MASTIO_UP = [null,
  { legno: 200, cibo: 100 }, { legno: 650, cibo: 400, oro: 200 }, { legno: 1100, cibo: 600, oro: 450, pietra: 250 },
  { legno: 1700, cibo: 1500, oro: 1000, pietra: 700, ferro: 260, favore: 5 }, { legno: 2600, cibo: 2400, oro: 1600, pietra: 1300, ferro: 450 }, { legno: 3600, cibo: 3400, oro: 2300, pietra: 1900, ferro: 700, favore: 10 }, { legno: 4800, cibo: 4500, oro: 3100, pietra: 2600, ferro: 1000, favore: 20 },
  { legno: 3800, oro: 2500, pietra: 2100, ferro: 850, favore: 25 }, { legno: 5000, oro: 3300, pietra: 2800, ferro: 1100, favore: 30 }, { legno: 6500, oro: 4300, pietra: 3600, ferro: 1450, favore: 35 }, { legno: 8400, oro: 5600, pietra: 4600, ferro: 1900, favore: 40 },
  { legno: 11000, oro: 7300, pietra: 6000, ferro: 2500, favore: 50 }, { legno: 14000, oro: 9500, pietra: 7800, ferro: 3200, favore: 60 }, { legno: 18000, oro: 12000, pietra: 10000, ferro: 4200, favore: 70 }, { legno: 23000, oro: 15500, pietra: 13000, ferro: 5500, favore: 90 }];
const ERA = l => l <= 4 ? { n: 'Età del Castrum', s: 'I', c: '#8B5A2B', hc: '#e0b07a' } : l <= 8 ? { n: 'Età della Legione', s: 'II', c: '#7f1d1d', hc: '#ff9a8a' } : l <= 12 ? { n: 'Età delle Città', s: 'III', c: '#1e3a8a', hc: '#9fb6ff' } : { n: 'Età Imperiale', s: 'IV', c: '#7e22ce', hc: '#e9b8ff' };
const YEAR = l => l <= 4 ? 192 + l : l <= 8 ? 197 + (l - 5) * 2 : l <= 12 ? 205 + (l - 9) * 2 : 212 + (l - 13) * 2;
const MASTIO_DESC = ['', 'Castrum di tronchi con fossato fangoso e una sola torre di guardia.', 'Torre di tronchi più alta: il primo vessillo sventola sul limes.', 'Baracche di legno e sentinelle fisse.', 'Vallo di terra e palizzata ai piedi del Castrum.', 'Il Castrum diventa Castellum di pietra: torri, insegne e porta ferrata. Inizia l\'Età della Legione.', 'Castellum più alto e massiccio, mura merlate.', 'Castellum imponente: la Provincia lo vede da lontano.', 'Fortezza legionaria completa: l\'Aquila Spezzata ti attende.', 'Principia di pietra squadrata: inizia l\'Età delle Città.', 'Torri circolari agli angoli e cammino di ronda.', 'Mura di opus quadratum e porta a saracinesca.', 'Fortezza da assedio con baliste sulle mura.', 'Palatium imperiale: inizia l\'Età Imperiale.', 'Mura concentriche e porta monumentale.', 'Marmo bianco di Carrara e insegne d\'oro.', 'L\'Aquila Spezzata è tua.'];

// ---------- state ----------
let S = null;
let SAVE_KEY = 'imperium_proto_v1';
function newState() {
  return {
    v: 1, mapv: 3, res: { cibo: 300, legno: 450, oro: 150, pietra: 0, ferro: 0, favore: 0 }, mastio: 1, mastioEnd: 0,
    buildings: [], army: { miliziano: 6, arccorto: 3 }, queue: [], heroes: {}, wins: 0, raids: 0, raidsWon: 0,
    nightAt: 0, nightIn: DF().truce, last: Date.now(), targets: null, log: [], sound: true, nextId: 1, tut: 0, fauna: [], faunaIn: 0, mapv: 3, mq: 0, best3: 0
  };
}
// ---- salvataggio: nel browser + nel cloud del tuo account claude.ai (sopravvive a chiusure, cache pulita, altri dispositivi) ----
const CLOUD = { doc: null, ready: false, pend: false, t: 0, last: 0, err: 0 };
function cloudDoc(key) { return CLOUD.col ? CLOUD.col.doc(key) : null; }
async function cloudPerms() { try { const p = window.claude && await claude.use('permissions'); if (!p) return null; return await p.state(); } catch (e) { return null; } }
async function cloudAsk() { try { const p = window.claude && await claude.use('permissions'); if (!p) { toast('Permessi non disponibili qui: apri il gioco dall\'app Claude'); return; } const st = await p.state(); const want = ['db', 'user'].filter(k => st[k] !== 'granted'); if (want.some(k => st[k] === 'denied')) { try { await p.manage(); } catch (e) { toast('Apri il menu Permessi dell\'artefatto (in alto) e attiva Archivio e Utente'); } } else if (want.length) await p.request(want); CLOUD.why = 'controllo…'; if (MODE === 'title') showTitle(); await cloudInit(); if (CLOUD.ready) toast('☁ Salvataggio nel cloud attivo'); } catch (e) { toast('Non riesco ad attivare il cloud'); } }
async function cloudInit() {
  try { if (!window.claude || !window.claude.use) { CLOUD.why = 'pagina fuori da claude.ai'; return; } const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]); if (!user || !db) { const ps = await cloudPerms(); CLOUD.ps = ps; }
    if (!user) { CLOUD.why = 'account non riconosciuto' + (CLOUD.ps ? ` (permessi: archivio ${CLOUD.ps.db || 'non offerto'}, utente ${CLOUD.ps.user || 'non offerto'})` : ''); if (MODE === 'title') showTitle(); return; } const lvl = { own: user.isOwner ? await user.isOwner() : null, edit: user.canEdit ? await user.canEdit() : null }; CLOUD.lvl = lvl; if (!db) { CLOUD.why = lvl.own === false ? 'stai usando un account diverso da quello del gioco' : 'archivio non disponibile'; if (MODE === 'title') showTitle(); return; } const id = await user.id(); if (!id) { CLOUD.why = 'non hai fatto l\'accesso a claude.ai'; if (MODE === 'title') showTitle(); return; }
    CLOUD.col = db.collection('data/users/' + id); try { await CLOUD.col.doc('ping').set({ t: Date.now() }); } catch (e) { CLOUD.why = 'scrittura rifiutata (' + (e && e.code || 'errore') + ')'; if (MODE === 'title') showTitle(); return; } CLOUD.ready = true;
    for (const key of ['imperium_proto_v1', 'imperium_creativo']) { const snap = await cloudDoc(key).get(); if (!snap.exists) continue; const d = snap.data(); let loc = null; try { loc = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { }
      if (d && d.s && (!loc || (d.t || 0) > (loc.last || 0) + 1000)) { try { localStorage.setItem(key, d.s); } catch (e) { } CLOUD.mem = CLOUD.mem || {}; CLOUD.mem[key] = d.s; } }
    if (MODE === 'title') showTitle();
  } catch (e) { CLOUD.err++; }
}
function cloudPush(now_) {
  if (!CLOUD.ready || !S || SAVE_KEY.startsWith('imperium_max')) return; const t = Date.now(); if (!now_ && t - CLOUD.t < 20000) { CLOUD.pend = true; return; }
  CLOUD.t = t; CLOUD.pend = false; const s = JSON.stringify(S); if (s === CLOUD.lastS) return; CLOUD.lastS = s;
  cloudDoc(SAVE_KEY).set({ s, t: S.last || t, m: S.mastio || 1 }).then(() => { CLOUD.last = Date.now(); }).catch(e => { CLOUD.err++; CLOUD.lastS = null; });
}
function save() { S.last = Date.now(); const j = JSON.stringify(S); CLOUD.mem = CLOUD.mem || {}; CLOUD.mem[SAVE_KEY] = j; try { localStorage.setItem(SAVE_KEY, j); } catch (e) { } backupTick(j); cloudPush(false); }
// ---- copie di sicurezza: ultima ora, ieri, l'altro ieri (+ quella fatta prima di una nuova campagna) ----
const BK_SLOTS = { h: 'Un\'ora fa circa', d1: 'Ieri', d2: 'L\'altro ieri', nuova: 'Prima di «Nuova Campagna»' };
function bkMeta() { try { return JSON.parse(localStorage.getItem('imperium_bk_' + SAVE_KEY) || '{}'); } catch (e) { return {}; } }
function bkPut(slot, j, meta) { try { localStorage.setItem(SAVE_KEY + '_bk_' + slot, j); const s = JSON.parse(j); meta[slot] = { t: Date.now(), m: s.mastio, ch: s.mq }; localStorage.setItem('imperium_bk_' + SAVE_KEY, JSON.stringify(meta)); } catch (e) { } }
function backupTick(j) { if (!S || S.sandbox || S.creative) return; const M = bkMeta(), t = Date.now(); const day = x => new Date(x).toDateString();
  if (!M.h || t - M.h.t > 3600000) bkPut('h', j, M);
  if (!M.d1 || day(M.d1.t) !== day(t)) { if (M.d1) { try { const old = localStorage.getItem(SAVE_KEY + '_bk_d1'); if (old) bkPut('d2', old, M); M.d2 && (M.d2.t = M.d1.t); localStorage.setItem('imperium_bk_' + SAVE_KEY, JSON.stringify(M)); } catch (e) { } } bkPut('d1', j, M); } }
function openBackups(fromTitle) { const M = bkMeta(); const rows = Object.keys(BK_SLOTS).filter(k => M[k]).map(k => { const m = M[k]; const w = new Date(m.t).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); return `<div class="row" style="display:flex;align-items:center;gap:8px;justify-content:space-between"><div><b>${BK_SLOTS[k]}</b><br><small>Castrum ${m.m || 1} · salvata ${w}</small></div><button class="btn" onclick="restoreBk('${k}',${fromTitle ? 1 : 0})">Ripristina</button></div>`; }).join('');
  openSheet('🛟 Copie di sicurezza', `<p class="desc">Il gioco conserva da solo alcune copie della tua campagna. Se qualcosa va storto puoi tornare a una di queste.</p>${rows || '<p class="desc"><i>Nessuna copia ancora: si creano mentre giochi.</i></p>'}`, 'bk'); }
function restoreBk(k, fromTitle) { askYes(`Tornare alla copia «${BK_SLOTS[k]}»?<br><small>La partita attuale viene sostituita (ne tengo comunque una copia).</small>`, () => { try { const j = localStorage.getItem(SAVE_KEY + '_bk_' + k); if (!j) { toast('Copia non trovata'); return; } const cur = localStorage.getItem(SAVE_KEY); if (cur) bkPut('nuova', cur, bkMeta()); localStorage.setItem(SAVE_KEY, j); CLOUD.mem = CLOUD.mem || {}; CLOUD.mem[SAVE_KEY] = j; closeSheet(); toast('🛟 Copia ripristinata'); beginGame(false); } catch (e) { toast('Ripristino non riuscito'); } }, 'Ripristina'); }
function load() { try { const j = localStorage.getItem(SAVE_KEY) || (CLOUD.mem && CLOUD.mem[SAVE_KEY]); if (j) { const s = JSON.parse(j); if (s && s.v === 1) return s; } } catch (e) { } return null; }
function bLvlCap() { if (S && S.creative) return 4; return S.mastio <= 8 ? Math.min(4, 1 + Math.floor(S.mastio / 2)) : Math.min(8, 4 + Math.ceil((S.mastio - 8) / 2)); }
function caps() {
  const c = { cibo: 800 + 550 * S.mastio, legno: 600 + 450 * S.mastio, oro: 400 + 350 * S.mastio, pietra: 300 + 300 * S.mastio, ferro: 250 + 200 * S.mastio, pelli: 60 + 40 * S.mastio, favore: 999 };
  for (const b of S.buildings) { const d = BDEF[b.t]; if (d.store && !b.end) for (const r in d.store) c[r] += d.store[r] * b.lvl; }
  return c;
}
function armyCap() { let c = 6; for (const b of S.buildings) { const d = BDEF[b.t]; if (d.pop && !(b.end && b.lvl <= 1 && b.toLvl === 1)) c += d.pop * b.lvl; } return c; }
function popTxt() { return `${armyUsed()}/${armyCap()}`; }
function lvlSum(t) { return S.buildings.filter(b => b.t === t && !(b.end && b.toLvl === 1)).reduce((a, b) => a + b.lvl, 0); }
function armsMult() { return 1 + 0.08 * lvlSum('armeria'); }
function curePct() { return Math.min(0.7, 0.15 * lvlSum('infermeria') * (lvlSum('chiesa') ? 1.2 : 1)); }
const TECH = { arm: { n: 'Armature', icon: '🛡️', d: '+8% vita a tutte le truppe', cost: l => ({ ferro: 80 * l, oro: 120 * l, pelli: 4 * l }) }, bal: { n: 'Balistica', icon: '🎯', d: '+10% danno a distanza (arcieri, balestre, torri)', cost: l => ({ legno: 150 * l, oro: 120 * l }) }, log: { n: 'Logistica', icon: '🐾', d: '+8% velocità di marcia', cost: l => ({ cibo: 200 * l, oro: 100 * l }) } };
function tech(k) { return (S.tech && S.tech[k]) || 0; }
function unitBonus(u) { if (!S) return; const hm = (1 + 0.08 * tech('arm')) * (lvlSum('chiesa') ? 1.1 : 1) * (1 + cryptBonus()); u.maxhp *= hm; u.hp *= hm; u.sm = (1 + 0.08 * tech('log')) * (!u.hero && UDEF[u.k] && UDEF[u.k].at === 'scuderia' ? 1.3 : 1); u.rm = 1 + 0.1 * tech('bal'); }
let BTHUMB = {};
function bThumb(k) { if (BTHUMB[k] || !BATL_OK || !BFR[k]) return BTHUMB[k] || null; const f = BFR[k], s = 64 / Math.max(f[2], f[3]); const cv2 = document.createElement('canvas'); cv2.width = 64; cv2.height = 64; cv2.getContext('2d').drawImage(BATL, f[0], f[1], f[2], f[3], (64 - f[2] * s) / 2, (64 - f[3] * s) / 2, f[2] * s, f[3] * s); return BTHUMB[k] = cv2.toDataURL(); }
function armyUsed() { let n = 0; for (const k in S.army) n += S.army[k] * UDEF[k].sp; for (const q of S.queue) n += UDEF[q.k].sp; return n; }
function canPay(cost) { if (S && S.creative) return true; for (const r in cost) if ((S.res[r] || 0) < cost[r]) return false; return true; }
function pay(cost) { if (S && S.creative) return; for (const r in cost) S.res[r] -= cost[r]; }
function addRes(r, v) { const c = caps(); const before = S.res[r]; S.res[r] = Math.min(c[r], S.res[r] + v); const got = S.res[r] - before; if (got < v && typeof diaryWaste === 'function') diaryWaste(r, v - got); return got; }
function scaleCost(cost, lvl) { const o = {}; for (const r in cost) o[r] = Math.round(cost[r] * Math.pow(1.9, lvl - 1)); return o; }
function costStr(cost) { return Object.keys(cost).map(r => `<span class="${(S.res[r] || 0) >= cost[r] ? '' : 'no'}">${ICO(r)} ${cost[r]}</span>`).join(' '); }
function countB(t) { return S.buildings.filter(b => b.t === t && !b.nat).length; }
function maxB(t) { if (S && S.creative && BDEF[t].max) return BDEF[t].wall ? 999 : 99; if (!BDEF[t].max) return 0; const base = BDEF[t].max[Math.min(8, S.mastio) - 1]; return S.mastio > 8 && t !== 'mastio' ? base + Math.round(base * (S.mastio - 8) / 8) : base; }
function builders() { if (S && S.creative) return 0; return S.buildings.filter(b => b.end && !BDEF[b.t].wall && !BDEF[b.t].decor).length + (S.mastioEnd ? 1 : 0); }
const MAX_BUILDERS = 2;
// ===== BILANCIAMENTO DEL RITMO (tempo reale) =====
// sessione tipo 20-30 min; giornata 2-3 sessioni. Era I ≈ giorno 1-2, Era II ≈ giorni 3-6, Era III ≈ settimana 2, Era IV ≈ settimane 3-4.
const PACE = () => (SET.pace === 'rapido' ? 0.1 : 1);
const MASTIO_T = [0, 1, 6, 12, 25, 45, 70, 100, 130, 160, 120, 180, 240, 360, 480, 720]; // minuti per salire da L a L+1
const UP_T = [0, 0, 1, 3, 8, 20, 40, 75, 120]; // minuti per portare un edificio al livello n (× peso dell'edificio)
const maxBuilders = () => 2 + (S && S.mastio >= 5 ? 1 : 0) + (S && S.mastio >= 9 ? 1 : 0);
const buildSecs = d => Math.round(d.t * 6 * PACE());

// ---------- grid map ----------
const N = NMAP, MCX = N / 2 - 0.5;
function makeGrid() { return new Int16Array(N * N).fill(-1); }
function inMap(x, y) { return x >= 0 && y >= 0 && x < N && y < N; }
// A* over grid. passable(x,y)-> cost (Infinity = blocked). goal(x,y)->bool. h target point.
function astar(sx, sy, goalFn, costFn, tx, ty, maxIter) {
  maxIter = Math.max(maxIter || 0, 9000);
  sx = Math.max(0, Math.min(N - 1, sx | 0)); sy = Math.max(0, Math.min(N - 1, sy | 0));
  const start = sy * N + sx; const g = new Float32Array(N * N).fill(Infinity); const from = new Int32Array(N * N).fill(-1);
  const heap = []; const push = (n, f) => { heap.push([f, n]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break;[heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (; ;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break;[heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  g[start] = 0; push(start, 0); let it = 0, found = -1;
  const H = (x, y) => { const dx = Math.abs(x - tx), dy = Math.abs(y - ty); return Math.max(dx, dy) + 0.41 * Math.min(dx, dy); };
  while (heap.length && it++ < (maxIter || 3000)) {
    const [, n] = pop(); const x = n % N, y = (n / N) | 0;
    if (goalFn(x, y)) { found = n; break; }
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (!inMap(nx, ny)) continue;
      let c = costFn(nx, ny); if (c === Infinity) continue;
      if (dx && dy) { if (costFn(x + dx, y) === Infinity || costFn(x, y + dy) === Infinity) continue; c *= 1.414; }
      const ng = g[n] + c; const m = ny * N + nx;
      if (ng < g[m]) { g[m] = ng; from[m] = n; push(m, ng + H(nx, ny)); }
    }
  }
  if (found < 0) return null;
  const path = []; let n = found; while (n !== start && n >= 0) { path.push([n % N, (n / N) | 0]); n = from[n]; }
  return path.reverse();
}

// ---------- sprites ----------
const ATL = new Image();
let ATL_OK = false; ATL.onload = () => ATL_OK = true;
// ---------- sprite romani (src/data_roman.js, generati da src/tools/sprites.py) ----------
const RATL = new Image(); let RATL_OK = false; RATL.onload = () => { RATL_OK = true; };
// direzione a 4 vie dall'ultimo movimento: F verso chi guarda, B di spalle, S di lato (verso destra; a sinistra si specchia)
function romanDir(u) { const sx = u.fsx, sy = u.fsy; if (sx == null) return u.face === 'B' ? 'B' : 'F'; return Math.abs(sx) > Math.abs(sy) * 0.85 ? 'S' : (sy > 0 ? 'F' : 'B'); }
function romanFrame(u) {
  const A = RFR[RUNIT[u.k]]; const pick = (k, i) => { const l = A[k]; return l ? l[Math.max(0, Math.min(l.length - 1, i))] : null; };
  if (u.dead) { const seq = [...(A.hit || []).slice(1), ...(A.death || [])]; return seq[Math.min(seq.length - 1, Math.floor((u.deadT || 0) / 0.11))]; }
  const dir = romanDir(u);
  if (u.atkT > 0) { const p = Math.min(0.999, 1 - u.atkT / 0.32);
    if (dir === 'F' && A.atkF) { const seq = [pick('idleF', 0), A.atkF[0], A.atkF[1]]; return seq[Math.floor(p * 3)]; }
    return pick('atkS', Math.floor(p * A.atkS.length)); }
  if (u.moving) { const k = 'walk' + dir; return pick(A[k] ? k : 'walkS', Math.floor(u.phase * 2.6) % 6); }
  const slow = Math.floor(u.phase * 0.7) % 2; return dir === 'B' ? pick('idleB', 0) : dir === 'S' ? pick('idleS', slow) : pick('idleF', slow);
}
function drawRoman(c, sc, u, wx, wy) {
  const f = romanFrame(u); if (!f) return false; let a = 1;
  if (u.dead) { a = Math.max(0, 1 - Math.max(0, u.deadT - 5) / 3); if (a <= 0) return true; } else u.phase += (u.moving ? 1 : 0.15) * (1 / 60) * 4;
  if (!u.dead) {
    const ring = u.side === 'A' ? (sc.mode === 'raid' ? 'rgba(200,50,40,0.55)' : 'rgba(70,120,230,0.55)') : u.side === 'D' ? (sc.mode === 'raid' ? 'rgba(70,120,230,0.55)' : 'rgba(200,50,40,0.55)') : null;
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(wx, wy, 9, 4.5, 0, 0, 7); c.fill();
    if (ring) { c.strokeStyle = ring; c.lineWidth = 1.6; c.beginPath(); c.ellipse(wx, wy, 10, 5, 0, 0, 7); c.stroke(); }
    if (u.hero) { c.strokeStyle = 'rgba(255,215,100,0.8)'; c.lineWidth = 2; c.beginPath(); c.ellipse(wx, wy, 13, 6.5, 0, 0, 7); c.stroke(); } }
  const s = (u.k === 'uomoarme' ? 0.37 : 0.33) * (u.kid ? 0.66 : 1); const [sx, sy, w, h] = f; const flip = u.fsx != null ? u.fsx < 0 : u.flip;
  if (u.hitT > 0) c.filter = 'brightness(1.6)'; if (a < 1) c.globalAlpha = a;
  const pix = c.imageSmoothingEnabled; c.imageSmoothingEnabled = cam.z * DPR * s < 0.9; // pixel art: nitido quando è ingrandito
  if (flip) { c.save(); c.translate(wx, wy + 1); c.scale(-1, 1); c.drawImage(RATL, sx, sy, w, h, -w * s / 2, -h * s, w * s, h * s); c.restore(); }
  else c.drawImage(RATL, sx, sy, w, h, wx - w * s / 2, wy + 1 - h * s, w * s, h * s);
  c.imageSmoothingEnabled = pix; c.globalAlpha = 1; if (u.hitT > 0) c.filter = 'none';
  if (u.inv > 0) { c.strokeStyle = 'rgba(160,215,255,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.arc(wx, wy - 26, 22, 0, 7); c.stroke(); }
  return true;
}
const RTHUMB = {};
function romanThumb(k) { if (RTHUMB[k] || !RATL_OK) return RTHUMB[k] || null; const f = RFR[RUNIT[k]].idleF[0]; const cv2 = document.createElement('canvas'); cv2.width = 120; cv2.height = 148; const s = Math.min(140 / f[3], 116 / f[2]); const x2 = cv2.getContext('2d'); x2.drawImage(RATL, f[0], f[1], f[2], f[3], (120 - f[2] * s) / 2, 148 - f[3] * s, f[2] * s, f[3] * s); return RTHUMB[k] = cv2.toDataURL(); }
function sprDraw(c, key, x, y, sc, flip, alpha) {
  const f = FR[key]; if (!f || !ATL_OK) return 0;
  const [sx, sy, w, h] = f;
  if (alpha != null && alpha < 1) c.globalAlpha = alpha;
  if (flip) { c.save(); c.translate(x, y); c.scale(-1, 1); c.drawImage(ATL, sx, sy, w, h, -w * sc / 2, -h * sc, w * sc, h * sc); c.restore(); }
  else c.drawImage(ATL, sx, sy, w, h, x - w * sc / 2, y - h * sc, w * sc, h * sc);
  if (alpha != null && alpha < 1) c.globalAlpha = 1;
  return h * sc;
}

// ---------- building sprites ----------
const BATL = new Image(); let BATL_OK = false; BATL.onload = () => BATL_OK = true;
const BSCALE = { castello: 1.2, casa: 1.0, taverna: 1.1, falegnameria: 1.14, fucina: 1.06, armeria: 1.06, infermeria: 1.04, municipio: 1.0, mercato: 1.22, chiesa: 1.1, accademia: 1.12, cancello: 1.35, stalla: 1.15, fattoria: 1.35, miniera: 1.28, torre: 1.35, funghi: 0.6, cespuglio: 1.05, masso: 1.0, tronco: 1.0 };
function bSprite(b) { if (b.t === 'mastio') return b.lvl >= 5 ? 'castello' : null; return BDEF[b.t].spr || null; }
function bSpriteView(b) { const k = bSprite(b); const kv = k + '_' + rstep(); return BFR[kv] ? kv : k; } // facades: casa_1, casa_2, casa_3 when provided
function bSpriteBase(b) { const k = bSprite(b); const f = BFR[k]; if (!f) return null;
  const fw = (b.w + b.h) * TW / 2; const lv = b.t === 'mastio' ? b.lvl - 5 : b.lvl - 1; const sc0 = fw * BSCALE[k] * (1 + 0.04 * lv) / f[2];
  const vr = vRect(b); const by = WR(vr[0] + vr[2], vr[1] + vr[3])[1]; const cx = WR(vr[0] + vr[2] / 2, vr[1] + vr[3] / 2)[0];
  return { k, sc0, cx, bottom: by - (b.w + b.h) * TH / 2 * 0.16 }; }
// fluid rotation: the building is a box; between two quarter turns the leaving face narrows and the next face widens
function drawSpriteBox(c, b, alpha) {
  const B = bSpriteBase(b); if (!B) return; const k = B.k, V = [k, k + '_1', k + '_2', k + '_3'];
  if (!BFR[V[1]]) { const r = bSpriteRect(b), f = BFR[k]; c.drawImage(BATL, f[0], f[1], f[2], f[3], r[0], r[1], r[2], r[3]); return; }
  const q = ((ANG / (Math.PI / 2)) % 4 + 4) % 4; const i = Math.floor(q) % 4, t = q - Math.floor(q), ph = t * Math.PI / 2;
  const sm = Math.min(1, Math.max(0, (t - 0.38) / 0.24)), s = sm * sm * (3 - 2 * sm); const ga = c.globalAlpha;
  for (const [f, al] of [[BFR[V[i]], 1 - s], [BFR[V[(i + 1) % 4]], s]]) { if (al < 0.01) continue; const w = f[2] * B.sc0, h = f[3] * B.sc0; c.globalAlpha = ga * al; c.drawImage(BATL, f[0], f[1], f[2], f[3], B.cx - w / 2, B.bottom - h, w, h); }
  c.globalAlpha = ga;
}
function bSpriteRect(b) { // world rect [x,y,w,h] of the sprite
  const k = bSprite(b); const f = BFR[k]; if (!f) return null;
  const fw = (b.w + b.h) * TW / 2; const lv = b.t === 'mastio' ? b.lvl - 5 : b.lvl - 1;
  const dw0 = fw * BSCALE[k] * (1 + 0.04 * lv), sc0 = dw0 / f[2]; const fv = BFR[bSpriteView(b)] || f; const dw = fv[2] * sc0, dh = fv[3] * sc0;
  const vr = vRect(b); const [bx, by] = WR(vr[0] + vr[2], vr[1] + vr[3]); const cx = WR(vr[0] + vr[2] / 2, vr[1] + vr[3] / 2)[0];
  const bottom = by - (b.w + b.h) * TH / 2 * 0.16;
  return [cx - dw / 2, bottom - dh, dw, dh];
}
// ---------- fauna ----------
const FAUNA = {
  cervo: { n: 'Cervo', w: 70, spd: 0.9, desc: 'Cervo nobile della Selva Pannonica. Cacciarlo è facile e sfama il villaggio. Compare dall\'Età delle Città.', gain: { cibo: 90 }, need: 0, risk: 0, max: 7, eras: [3, 4] },
  capra: { n: 'Capra Selvatica', w: 46, spd: 0.6, desc: 'Capra di montagna dal pelo folto. Facile da prendere.', gain: { cibo: 55 }, need: 0, risk: 0, max: 7, eras: [1, 2, 3, 4] },
  lupo: { n: 'Lupo', w: 54, spd: 1.1, desc: 'Lupo grigio dal collare runico. Pericoloso: serve una battuta di almeno 3 soldati. Pelli pregiate per armature.', gain: { pelli: 3 }, need: 3, risk: 0.3, max: 7, eras: [1, 2, 3, 4] },
  orso: { n: 'Orso Bruno', w: 90, spd: 0.5, desc: 'Orso bruno enorme. Serve una battuta di almeno 6 soldati e qualcuno può non tornare. Molte pelli e carne. Scende dai monti nell\'Età delle Città.', gain: { pelli: 6, cibo: 40 }, need: 6, risk: 0.5, max: 2, eras: [3, 4] },
  maiale: { n: 'Maiale Brado', w: 50, spd: 0.55, desc: 'Maiale dei primi coloni, lasciato libero nei boschi a mangiare ghiande. Facile da prendere e pieno di carne. Sparisce con la fine dell\'Età del Castrum.', gain: { cibo: 75 }, need: 0, risk: 0, max: 6, eras: [1] },
  cinghiale: { n: 'Cinghiale', w: 60, spd: 0.75, desc: 'Cinghiale dalle zanne ricurve. Non scappa: carica. Un lupo da solo spesso ne esce sventrato, due lupi lo abbattono. Per cacciarlo servono almeno 2 soldati.', gain: { cibo: 70, pelli: 2 }, need: 2, risk: 0.15, max: 5, eras: [1, 2, 3, 4] },
  lepre: { n: 'Lepre', w: 40, spd: 1.6, desc: 'Lepre dei campi, scatta via a balzi. Poca carne, ma si caccia senza rischi.', gain: { cibo: 25 }, need: 0, risk: 0, max: 9, eras: [1, 2, 3, 4] },
};
const FHK = { orso: 150, capra: 110, cervo: 140, lupo: 100, maiale: 159, lepre: 150, cinghiale: 158 }, FIDLE = { cinghiale: 0, orso: 2, capra: 1, cervo: 1, lupo: 1, maiale: 0, lepre: 1 };
const ERAI = l => l <= 4 ? 1 : l <= 8 ? 2 : l <= 12 ? 3 : 4;
const faunaOk = k => FAUNA[k].eras.includes(ERAI(S && S.mastio || 1));
const PREY = { cervo: 1, capra: 1, maiale: 1, lepre: 1 };
// probabilità che vincano i lupi, per numero di lupi [0,1,2,3+]
const STRONG = { orso: { k: 'orso', p: [0, 0, 0.5, 1], reach: 5, e: '🐻', art: "l'orso" }, cinghiale: { k: 'cinghiale', p: [0, 0.5, 1, 1], reach: 3, e: '🐗', art: 'il cinghiale' } };
const GRAZE = [0, 1, 2, 1, 2, 1, 2, 3, 0, 0, 0];
function animFrame(k, moving, ph, mode, mph, fast) { // -> [frameRect, drawW, drawH]
  const st = BFR[k], F = FAUNA[k]; const hs = F.w * st[3] / st[2];
  let key;
  if (mode === 'atk' && BFR[k + '_a0']) key = k + '_a' + Math.min(3, Math.max(0, Math.floor(mph)));
  else if (!moving && BFR[k + '_g0']) key = k + '_g' + GRAZE[((Math.floor(mph || 0) % GRAZE.length) + GRAZE.length) % GRAZE.length];
  else if (moving && fast > 1.3 && BFR[k + '_r0']) key = k + '_r' + (Math.floor(ph * 1.2) % 4 + 4) % 4;
  else key = k + '_w' + (moving ? (Math.floor(ph) % 4 + 4) % 4 : FIDLE[k]);
  const f = BFR[key];
  if (!f) return [st, F.w, hs]; const s = hs / FHK[k] * 1.05; return [f, f[2] * s, f[3] * s];
}
// ---------- nuovi animali (maiale, lepre): sprite di Marco in un atlante a parte ----------
const FATL2 = new Image(); FATL2.src = FATL2_SRC;
function buildFaunaSprites() { for (const k in FFR2) { const r = FFR2[k].slice(); r.img = FATL2; BFR[k] = r; } }
// ---------- water & terrain features ----------
const RIVER_AT = { k: 'fiume', x: 19 + OFF, y: 19 + OFF, w: 13, h: 13 }, POND_AT = { k: 'lago', x: 3 + OFF, y: 21 + OFF, w: 7, h: 8 };
function stampMask(arr, mask, x0, y0) { for (let ty = 0; ty < mask.length; ty++) for (let tx = 0; tx < mask[ty].length; tx++) if (mask[ty][tx] === '1') { const x = x0 + tx, y = y0 + ty; if (x >= 0 && y >= 0 && x < NMAP && y < NMAP) arr[y * NMAP + x] = 1; } }
let WATER_V = null;
const EXTRA_PONDS = NMAP > 64 ? [[14, 16], [74, 13], [15, 71], [73, 73], [60, 30]].map(([x, y]) => ({ k: 'lago', x, y, w: 7, h: 8 })) : [];
function villageWater() { if (WATER_V) return WATER_V; const a = new Uint8Array(NMAP * NMAP); for (const p of EXTRA_PONDS) stampMask(a, EMASK.pond.mask, p.x, p.y); stampMask(a, EMASK.river.mask, RIVER_AT.x, RIVER_AT.y); stampMask(a, EMASK.pond.mask, POND_AT.x, POND_AT.y); return WATER_V = a; }
function isWater(sc, x, y) { return !!(sc && sc.water && x >= 0 && y >= 0 && x < NMAP && y < NMAP && sc.water[y * NMAP + x]); }
// ---------- audio ----------
// ---- audio: musica (Web Audio, così il volume funziona anche su iPhone) + effetti, con muto generale ----
if (SET.mvol == null) SET.mvol = 0.45; if (SET.fvol == null) SET.fvol = 0.8; if (SET.mute == null) SET.mute = false;
const MUS = { el: null, src: null, g: null, duck: false, get on() { return SET.music !== false; } };
let FXG = null;
function fxOut(a) { if (!FXG) { FXG = a.createGain(); FXG.connect(a.destination); } FXG.gain.value = SET.mute ? 0 : SET.fvol; return FXG; }
function musicApply() { const mv = SET.mute || MUS.duck ? 0 : SET.mvol; try { if (RAIDM.el) RAIDM.el.volume = SET.mute ? 0 : Math.min(1, SET.mvol * 1.1); } catch (e) { } if (MUS.g) MUS.g.gain.value = mv; else if (MUS.el) MUS.el.volume = mv; if (FXG) FXG.gain.value = SET.mute ? 0 : SET.fvol; if (TENS.g) TENS.g.gain.value = SET.mute || !MUS.on ? 0 : SET.mvol * 0.9; }
function musicStart() {
  if (!MUS.on || SET.mute || document.hidden || MUS.duck) return;
  if (!MUS.el) { MUS.el = new Audio('music/feudum.mp3'); MUS.el.loop = true; MUS.el.preload = 'auto'; const a = ac(); if (a) { try { MUS.src = a.createMediaElementSource(MUS.el); MUS.g = a.createGain(); MUS.src.connect(MUS.g).connect(a.destination); } catch (e) { MUS.g = null; } } musicApply(); }
  else ac();
  if (MUS.el.paused) { const p = MUS.el.play(); if (p && p.catch) p.catch(() => { }); }
}
function musicStop() { if (MUS.el && !MUS.el.paused) MUS.el.pause(); }
function audioRefresh() { saveSet(); musicApply(); if (MUS.on && !SET.mute) musicStart(); else musicStop(); if (TENS.kind && (!MUS.on || SET.mute)) tensionStop(true); updateSndBtn(); }
function musicToggle() { SET.music = !MUS.on; audioRefresh(); }
function toggleMute() { SET.mute = !SET.mute; audioRefresh(); if (!SET.mute) sfx('click'); }
function updateSndBtn() { const b = $('#sndmute'); if (b) { b.textContent = SET.mute ? '🔇' : '🔊'; b.title = SET.mute ? 'Audio spento' : 'Audio attivo'; b.classList.toggle('off', !!SET.mute); } }
function setVol(k, v) { SET[k] = Math.max(0, Math.min(1, v / 100)); if (SET.mute && v > 0) SET.mute = false; saveSet(); musicApply(); if (k === 'mvol' && SET.mvol > 0) musicStart(); updateSndBtn(); const o = $('#v_' + k); if (o) o.textContent = Math.round(v) + '%'; }
// ---- prova dei suoni: ascolta musiche ed effetti senza giocare ----
const SND_TEST = [['festa', '🎉', 'Musica della festa'], ['ram', '🐏', 'Ariete'], ['launch', '🪨', 'Catapulta: lancio'], ['boulder', '💥', 'Masso che cade'], ['ladder', '🪜', 'Scala sulle mura'], ['bow', '🏹', 'Arco del cacciatore'], ['step', '👣', 'Passi'], ['horn', '📯', 'Corno di battaglia'], ['bell', '🔔', 'Campana'], ['win', '🏆', 'Vittoria'], ['coin', '🪙', 'Monete'], ['build', '🔨', 'Costruzione'], ['crash', '🏚️', 'Crollo']];
function sndTestHTML() { return `<div class="vbox"><div class="vh"><span>🎧 Prova i suoni</span></div><div class="sndt">${SND_TEST.map(([k, ic, n]) => `<button class="btn ghost" onclick="sndTest('${k}')">${ic} ${n}</button>`).join('')}<button class="btn ghost" onclick="sndTest('raidmus')">⚔ Musica di battaglia</button><button class="btn ghost" onclick="sndTest('stop')">⏹ Ferma</button></div></div>`; }
function sndTest(k) { const a = ac(); if (a && a.state === 'suspended') a.resume(); if (k === 'stop') { if (TENS.kind) tensionStop(); return; } if (k === 'raidmus') { if (TENS.kind) tensionStop(true); tensionStart('raid'); toast('⚔ Musica di battaglia: tocca «Ferma» per tornare alla musica del villaggio'); return; } if (k === 'step') { for (let i = 0; i < 6; i++) setTimeout(() => sfx('step'), i * 420); return; } sfx(k); }
function openAudio(back) {
  const re = `openAudio(${back ? `'${back}'` : ''})`;
  openSheet('🔊 Audio', `<div class="aud">${audioHTML(re)}${sndTestHTML()}<div class="acts"><button class="btn" onclick="${back ? back : 'closeSheet()'}">✓ Fatto</button></div></div>`, 'audio');
}
['pointerdown', 'keydown', 'touchend'].forEach(ev => document.addEventListener(ev, musicStart, { passive: true }));
document.addEventListener('visibilitychange', () => { if (RAIDM.el) { if (document.hidden) RAIDM.el.pause(); else if (TENS.kind && !RAIDM.bad) RAIDM.el.play().catch(() => { }); } if (!MUS.el) return; if (document.hidden) MUS.el.pause(); else musicStart(); });

// ---- musica di tensione durante assedi (attacchi tuoi) e razzie (attacchi subiti): generata con Web Audio ----
const TENS = { kind: null, g: null, iv: 0, nextT: 0, step: 0, bus: null };
const TENS_CH = [[38, [0, 3, 7]], [34, [0, 4, 7]], [31, [0, 3, 7]], [33, [0, 4, 7]]]; // Re- Sib Sol- La (midi radice + accordo)
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function tensionStart(kind) {
  const a = ac(); if (!a) return; tensionStop(true);
  MUS.duck = true; if (MUS.g && MUS.el) { const t = a.currentTime; MUS.g.gain.cancelScheduledValues(t); MUS.g.gain.setValueAtTime(MUS.g.gain.value, t); MUS.g.gain.linearRampToValueAtTime(0, t + 1.2); setTimeout(() => { if (MUS.duck) musicStop(); }, 1300); } else musicStop();
  if (!MUS.on || SET.mute) { TENS.kind = kind; return; }
  TENS.kind = kind; TENS.g = a.createGain(); TENS.g.connect(a.destination);
  const t0 = a.currentTime; TENS.g.gain.setValueAtTime(0.0001, t0); TENS.g.gain.linearRampToValueAtTime(SET.mvol * 0.9, t0 + 1.5);
  if (raidTrack(a)) return; // razzie e assedi: colonna sonora "Ombre delle Terre Feudali
  TENS.bus = a.createDynamicsCompressor(); TENS.bus.threshold.value = -18; TENS.bus.ratio.value = 4; TENS.bus.connect(TENS.g);
  TENS.nextT = t0 + 0.15; TENS.step = 0;
  TENS.iv = setInterval(tensionSched, 40);
}
// colonna sonora vera per le razzie (quando ti attaccano); se non si carica, resta la musica generata
const RAIDM = { el: null, src: null, bad: false };
function raidTrack(a) {
  if (RAIDM.bad) return false;
  try {
    if (!RAIDM.el) { RAIDM.el = new Audio('music/raid.mp3'); RAIDM.el.loop = true; RAIDM.el.preload = 'auto'; RAIDM.el.addEventListener('error', () => { RAIDM.bad = true; if (TENS.kind && !TENS.iv) { TENS.nextT = AC.currentTime + 0.1; TENS.step = 0; TENS.iv = setInterval(tensionSched, 40); } }); }
    // riproduzione diretta (affidabile su iPhone, dove il passaggio dentro WebAudio a volte resta muto)
    RAIDM.el.volume = Math.min(1, SET.mvol * 1.1); RAIDM.el.currentTime = 0; const p = RAIDM.el.play(); if (p && p.catch) p.catch(() => { RAIDM.bad = true; if (TENS.kind && !TENS.iv) { TENS.nextT = AC.currentTime + 0.1; TENS.step = 0; TENS.iv = setInterval(tensionSched, 40); } }); return true;
  } catch (e) { RAIDM.bad = true; return false; }
}
function tensionStop(now) {
  if (RAIDM.el && !RAIDM.el.paused) { const el = RAIDM.el; setTimeout(() => { if (!TENS.kind) el.pause(); }, now ? 400 : 2600); }
  if (TENS.iv) clearInterval(TENS.iv); TENS.iv = 0; const g = TENS.g, a = AC; TENS.g = null; const wasOn = !!TENS.kind; TENS.kind = null;
  if (g && a) { const t = a.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + (now ? 0.2 : 2.2)); setTimeout(() => { try { g.disconnect(); } catch (e) { } }, now ? 400 : 2600); }
  if (wasOn && !now) { MUS.duck = false; setTimeout(() => { if (TENS.kind) return; musicStart(); if (MUS.g && AC) { const t = AC.currentTime; MUS.g.gain.cancelScheduledValues(t); MUS.g.gain.setValueAtTime(0, t); MUS.g.gain.linearRampToValueAtTime(SET.mute ? 0 : SET.mvol, t + 2.5); } else musicApply(); }, 1600); }
  else if (!now) { MUS.duck = false; musicApply(); }
}
function tensionSched() {
  const a = AC; if (!a || !TENS.g) return; if (document.hidden) { TENS.nextT = a.currentTime + 0.1; return; }
  const raid = TENS.kind === 'raid'; const late = BT && !BT.ended && BT.timer < 40;
  const bpm = (raid ? 92 : 108) + (late ? 14 : 0), s16 = 60 / bpm / 4;
  if (TENS.nextT < a.currentTime - 0.5) TENS.nextT = a.currentTime + 0.05;
  while (TENS.nextT < a.currentTime + 0.25) { tensionStep(a, TENS.nextT, TENS.step, s16, raid, late); TENS.nextT += s16; TENS.step++; }
}
function tensionStep(a, t, st, s16, raid, late) {
  const O = TENS.bus; const sb = st % 16, bar = Math.floor(st / 16), ch = TENS_CH[bar % 4], root = ch[0];
  const env = (node, v, at, dec) => { const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + at); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dec); node.connect(g).connect(O); return g; };
  const osc = (type, f, v, at, dec, f2, lp) => { const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + at + dec); let n = o; if (lp) { const fl = a.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; } env(n, v, at, dec); o.start(t); o.stop(t + at + dec + 0.05); };
  const nz = (dur, f, q, v, type) => { const b = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; const fl = a.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = q; s.connect(fl); env(fl, v, 0.004, dur); s.start(t); s.stop(t + dur + 0.05); };
  // tamburi di guerra (timpano grave)
  const kick = raid ? [0, 6, 8, 14] : [0, 3, 6, 8, 11, 14];
  if (kick.includes(sb)) { osc('sine', 95, sb === 0 ? 0.55 : 0.38, 0.005, 0.42, 42); nz(0.12, 180, 0.8, 0.18, 'lowpass'); }
  // tamburo a cornice / rullante
  if (sb === 4 || sb === 12) nz(0.18, raid ? 600 : 900, 0.9, raid ? 0.13 : 0.18);
  if ((late || !raid) && sb % 2 === 1) nz(0.04, 5200, 1.5, late ? 0.05 : 0.025, 'highpass');
  if (late && (sb === 15 || sb === 13)) nz(0.1, 900, 0.9, 0.12);
  // bordone sull'accordo (ogni battuta)
  if (sb === 0) { const dur = s16 * 16; for (const iv of [0, 7]) { osc('sawtooth', mtof(root + iv), 0.05, dur * 0.3, dur * 0.75, null, raid ? 320 : 420); } osc('sine', mtof(root - 12), 0.12, dur * 0.25, dur * 0.8); }
  // ostinato d'archi pizzicato (crome)
  if (sb % 2 === 0) { const pat = raid ? [0, 12, 3, 12, 7, 12, 3, 1] : [0, 7, 12, 7, 3, 7, 12, 1]; const n = root + 24 + pat[(sb / 2) | 0] - (pat[(sb / 2) | 0] === 1 ? 0 : 0); osc('sawtooth', mtof(n), raid ? 0.045 : 0.06, 0.006, s16 * 1.6, null, 1700); }
  // ottoni ogni 4 battute
  if (bar % 4 === 3 && sb === 8) { const dur = s16 * 8; for (const iv of ch[1]) osc('sawtooth', mtof(root + 12 + iv), 0.045, dur * 0.45, dur * 0.7, null, 1100); }
  // razzia: campana a morto lontana
  if (raid && sb === 0 && bar % 2 === 0) { [1, 2.01, 2.76, 4.07].forEach((m, i) => osc('sine', mtof(root + 12) * m, 0.07 / (i + 1), 0.005, 2.6 - i * 0.4)); }
}
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
// ---- musica della festa: un saltarello medievale (flauto, cornamusa con bordone, tamburello) ----
function festaMusic(a, OUT) {
  const t0 = a.currentTime + 0.05, beat = 0.19; // crome in 6/8, tempo vivace
  const bus = a.createGain(); bus.gain.value = 0.9; bus.connect(OUT);
  const mt = n => 440 * Math.pow(2, (n - 69) / 12);
  // melodia in Re dorico: 4 battute ripetute con variazione (nota midi, durata in crome)
  const mel = [[74, 1], [76, 1], [77, 1], [79, 2], [77, 1], [76, 2], [74, 1], [72, 2], [74, 1],
               [74, 1], [76, 1], [77, 1], [79, 1], [81, 1], [79, 1], [77, 2], [76, 1], [74, 3],
               [81, 1], [79, 1], [77, 1], [79, 2], [77, 1], [76, 1], [77, 1], [76, 1], [74, 2], [72, 1],
               [74, 1], [76, 1], [77, 1], [76, 1], [74, 1], [72, 1], [74, 3], [74, 3]];
  let t = t0;
  for (const [n, d] of mel) { const o = a.createOscillator(), g = a.createGain(), v = a.createOscillator(), vg = a.createGain(); o.type = 'triangle'; o.frequency.value = mt(n);
    v.frequency.value = 5.5; vg.gain.value = mt(n) * 0.006; v.connect(vg).connect(o.frequency); // vibrato del flauto
    const dur = d * beat; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.11, t + 0.02); g.gain.setValueAtTime(0.09, t + dur * 0.7); g.gain.linearRampToValueAtTime(0.0001, t + dur * 0.98);
    o.connect(g).connect(bus); o.start(t); v.start(t); o.stop(t + dur); v.stop(t + dur); t += dur; }
  const end = t;
  // cornamusa: bordone Re-La filtrato
  const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; const dg = a.createGain(); dg.gain.setValueAtTime(0.0001, t0); dg.gain.linearRampToValueAtTime(0.045, t0 + 0.3); dg.gain.setValueAtTime(0.045, end - 0.3); dg.gain.linearRampToValueAtTime(0.0001, end); lp.connect(dg).connect(bus);
  for (const n of [50, 57, 62]) { const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mt(n); o.detune.value = (n % 3) * 3; o.connect(lp); o.start(t0); o.stop(end); }
  // tamburo (battere) e tamburello (sonagli) in 6/8: BUM . cik BUM . cik
  const noiseBuf = a.createBuffer(1, a.sampleRate * 0.2, a.sampleRate), nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  for (let k = 0, tt = t0; tt < end - 0.05; k++, tt += beat) { const pos = k % 6;
    if (pos === 0 || pos === 3) { const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(pos === 0 ? 130 : 110, tt); o.frequency.exponentialRampToValueAtTime(55, tt + 0.15); g.gain.setValueAtTime(0.22, tt); g.gain.exponentialRampToValueAtTime(0.001, tt + 0.22); o.connect(g).connect(bus); o.start(tt); o.stop(tt + 0.25); }
    if (pos === 2 || pos === 5 || (pos === 4 && k % 12 > 6)) { const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); src.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 6500; g.gain.setValueAtTime(0.09, tt); g.gain.exponentialRampToValueAtTime(0.001, tt + 0.12); src.connect(f).connect(g).connect(bus); src.start(tt); src.stop(tt + 0.15); } }
  return end - t0;
}
function sfx(kind) {
  if (SET.mute || SET.fvol <= 0) return; const a = ac(); if (!a) return; const t = a.currentTime; const OUT = fxOut(a);
  const noise = (dur, f, q, vol, type) => { const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); const s = a.createBufferSource(); s.buffer = b; const fl = a.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = q; const g = a.createGain(); g.gain.value = vol; s.connect(fl).connect(g).connect(OUT); s.start(t); };
  const tone = (f, dur, vol, type, f2) => { const o = a.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur); const g = a.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); o.connect(g).connect(OUT); o.start(t); o.stop(t + dur); };
  if (kind === 'win') { [[523, 0], [659, 140], [784, 280], [1046, 430]].forEach(([f, d]) => setTimeout(() => { const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime; o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.13, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t0 + (d === 430 ? 1.0 : 0.3)); o.connect(g).connect(OUT); o.start(t0); o.stop(t0 + 1.1); }, d)); }
  else if (kind === 'ram') { tone(70, 0.35, 0.22, 'sine', 38); noise(0.25, 180, 0.8, 0.16, 'lowpass'); setTimeout(() => noise(0.12, 900, 1.5, 0.05), 60); }
  else if (kind === 'launch') { tone(220, 0.25, 0.05, 'sawtooth', 90); noise(0.45, 700, 0.6, 0.07); setTimeout(() => tone(55, 0.2, 0.12, 'sine', 35), 80); }
  else if (kind === 'boulder') { tone(60, 0.5, 0.25, 'sine', 30); noise(0.6, 250, 0.6, 0.18, 'lowpass'); setTimeout(() => noise(0.3, 1400, 1, 0.05), 90); }
  else if (kind === 'ladder') { for (let i = 0; i < 3; i++) setTimeout(() => { tone(380 + i * 40, 0.06, 0.035, 'triangle'); noise(0.05, 1800, 2, 0.025); }, i * 140); }
  else if (kind === 'bow') { tone(180, 0.18, 0.06, 'triangle', 420); noise(0.15, 2600, 2, 0.04); }
  else if (kind === 'step') { noise(0.07, 1100, 1.4, 0.11); tone(110, 0.05, 0.06, 'sine', 70); }
  else if (kind === 'festa') { festaMusic(a, OUT); }
  else if (kind === 'arrow') noise(0.12, 2400, 2, 0.05);
  else if (kind === 'hit') { noise(0.08, 500, 1, 0.08); }
  else if (kind === 'bolt') { tone(140, 0.15, 0.08, 'triangle', 60); noise(0.1, 1200, 1, 0.06); }
  else if (kind === 'crash') { noise(0.5, 300, 0.7, 0.14, 'lowpass'); }
  else if (kind === 'build') { tone(660, 0.07, 0.05, 'square'); setTimeout(() => sfx('tock'), 120); }
  else if (kind === 'tock') tone(520, 0.06, 0.05, 'square');
  else if (kind === 'coin') { tone(1300, 0.08, 0.05, 'triangle'); setTimeout(() => tone(1760, 0.1, 0.04, 'triangle'), 70); }
  else if (kind === 'bell') { for (const st of [0, 0.9]) setTimeout(() => { [[523, 0.11], [1046, 0.06], [1318, 0.045], [1568, 0.03], [262, 0.05]].forEach(([f, v]) => tone(f, 2.4, v, 'sine')); noise(0.03, 3000, 2, 0.05); }, st * 1000); }
  else if (kind === 'horn') { tone(233, 1.0, 0.12, 'sawtooth', 220); tone(349, 1.0, 0.06, 'sawtooth', 330); tone(466, 0.9, 0.05, 'triangle', 440); }
  else if (kind === 'deploy') noise(0.06, 900, 1, 0.04);
  else if (kind === 'ult') { tone(330, 0.6, 0.06, 'triangle', 660); }
  else if (kind === 'click') tone(880, 0.04, 0.03, 'triangle');
}

// ================= SCENE: entities, simulation, rendering =================
let SC = null; // current scene
let EID = 1;
function mkBuilding(t, x, y, lvl, side, ref) {
  const d = BDEF[t]; const hp = Math.round(d.hp * (1 + 0.35 * (lvl - 1)));
  return { id: EID++, isB: true, t, x, y, w: d.w, h: d.h, lvl, hp, maxhp: hp, side, dead: false, cd: Math.random(), aim: { b: false, flip: false }, ref, loot: {}, seed: (x * 31 + y * 17) | 0, smokeT: 0, hitT: 0 };
}
function newScene(mode) {
  return { mode, water: new Uint8Array(N * N), decals: [], grid: makeGrid(), B: [], U: [], P: [], FX: [], T: [], trees: [], rocks: [], time: 0, ground: null, over: false, sel: null, ghost: null, deploySel: null, stars: 0, pct: 0, loot: {}, timer: 0, night: mode === 'raid' };
}
function sceneIndex(sc) {
  sc.grid.fill(-1);
  sc.B.forEach((b, i) => { if (b.dead) return; for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) if (inMap(x, y)) sc.grid[y * N + x] = i; });
  // wall masks
  for (const b of sc.B) if (BDEF[b.t].moat) { const at = (x, y) => { if (!inMap(x, y)) return false; const i = sc.grid[y * N + x]; return i >= 0 && BDEF[sc.B[i].t].moat; }; b.mask = (at(b.x + 1, b.y) ? 1 : 0) | (at(b.x - 1, b.y) ? 2 : 0) | (at(b.x, b.y + 1) ? 4 : 0) | (at(b.x, b.y - 1) ? 8 : 0); }
  for (const b of sc.B) if (BDEF[b.t].wall) {
    const at = (x, y) => { if (!inMap(x, y)) return false; const i = sc.grid[y * N + x]; return i >= 0 && BDEF[sc.B[i].t].wall; };
    b.mask = (at(b.x + 1, b.y) ? 1 : 0) | (at(b.x - 1, b.y) ? 2 : 0) | (at(b.x, b.y + 1) ? 4 : 0) | (at(b.x, b.y - 1) ? 8 : 0);
  }
}
function bAt(sc, x, y) { if (!inMap(x, y)) return null; const i = sc.grid[y * N + x]; if (i < 0) return null; const b = sc.B[i]; return b.dead ? null : b; }
function addTrees(sc, seed, dense) {
  const R = rng(seed);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const e = Math.min(x, y, N - 1 - x, N - 1 - y);
    const dc = Math.hypot(x + .5 - N / 2, y + .5 - N / 2); const grove = 0.5 + 0.5 * Math.sin(x * 0.55 + seed) * Math.cos(y * 0.47 - seed * 0.3);
    const p = e === 0 ? 0.85 : e === 1 ? 0.6 : e === 2 ? (dense ? 0.3 : 0.18) : dc > (dense ? 15 : 13) ? (grove > 0.82 ? 0.35 : 0.015) : 0;
    if (isWater(sc, x, y) || (x > 0 && isWater(sc, x - 1, y)) || (y > 0 && isWater(sc, x, y - 1))) continue;
    if (R() < p) sc.trees.push({ x: x + 0.2 + R() * 0.6, y: y + 0.2 + R() * 0.6, k: (R() * TREES.length) | 0, s: 0.8 + R() * 0.45 });
    else if (e >= 3 && R() < 0.012 && !isWater(sc, x, y)) sc.rocks.push({ x: x + 0.5, y: y + 0.5, s: (R() * 1000) | 0 });
  }
}
function paintMoat(c, m) {
  const P = [isoP(0, 0), isoP(1, 0), isoP(1, 1), isoP(0, 1)]; const g = c.createLinearGradient(P[0][0], P[0][1], P[2][0], P[2][1]); g.addColorStop(0, '#2f6f96'); g.addColorStop(1, '#245a7c'); poly(c, P, g);
  c.strokeStyle = 'rgba(190,230,255,0.35)'; c.lineWidth = 1; for (let i = 0; i < 3; i++) { const a = isoP(0.2 + i * 0.25, 0.3 + i * 0.15), b = isoP(0.38 + i * 0.25, 0.3 + i * 0.15); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
  // sponde di pietra dove il fossato finisce
  const bank = (A, B, inA, inB) => { poly(c, [A, B, inB, inA], '#8f8578', 'rgba(40,30,20,0.5)', 0.8); };
  const k = 0.16; if (!(m & 8)) bank(isoP(0, 0), isoP(1, 0), isoP(0, k), isoP(1, k)); if (!(m & 2)) bank(isoP(0, 0), isoP(0, 1), isoP(k, 0), isoP(k, 1)); if (!(m & 4)) bank(isoP(0, 1), isoP(1, 1), isoP(0, 1 - k), isoP(1, 1 - k)); if (!(m & 1)) bank(isoP(1, 0), isoP(1, 1), isoP(1 - k, 0), isoP(1 - k, 1));
}
function bCache(b) {
  const d = BDEF[b.t]; if (d.moat) { const m = rotMask(b.mask || 0); return cached(`moat${m}`, 1, 1, 10, c => paintMoat(c, m)); }
  if (d.wall) { const stone = b.lvl >= 2; const m = rotMask(b.mask || 0); return cached(`w${m}_${stone ? 1 : 0}`, 1, 1, 50, c => paintWall(c, m, stone, 5)); }
  const top = b.t === 'mastio' ? 230 : b.t === 'monastero' ? 130 : b.t === 'torre' ? 110 : 90;
  const fn = PAINT[b.t] || PAINT.capanno; return cached(`${b.t}_${b.lvl}_${b.seed % 3}${b.t === 'stendardo' ? JSON.stringify(ARMS()) : ''}`, b.w, b.h, top, c => fn(c, b.lvl, 11 + b.seed % 3 * 7));
}
function rubbleCache(b) { const v = ((b.x * 7 + b.y * 13) >>> 0) % 3; return cached(`rub${b.w}x${b.h}_${v}`, b.w, b.h, 30, c => paintRubble(c, b.w, b.h, b.w * 13 + v * 101)); }

// ---------- units ----------
function mkUnit(k, side, x, y, hero) {
  const d = hero ? HDEF[k] : UDEF[k];
  const lvlBoost = 1;
  return {
    id: EID++, k, d, hero: !!hero, side, x, y, hp: d.hp * lvlBoost, maxhp: d.hp * lvlBoost, cd: Math.random() * 0.5, atkT: 0, rt: 0, tgt: null, path: null, pi: 0, prt: 0,
    face: 'F', flip: Math.random() < 0.5, phase: Math.random() * 6, moving: false, dead: false, deadT: 0, post: { x, y }, slow: 0, inv: 0, charged: false, ultUsed: false, hitT: 0, auraT: 0
  };
}
function uScale(u) { return u.kid ? 0.3 : u.hero ? 0.5 : (u.d.cav ? 0.46 : 0.45); }
function distToB(x, y, b) { const cx = Math.max(b.x, Math.min(b.x + b.w, x)), cy = Math.max(b.y, Math.min(b.y + b.h, y)); return Math.hypot(x - cx, y - cy); }
function distTo(u, t) { return t.isB ? distToB(u.x, u.y, t) : Math.hypot(u.x - t.x, u.y - t.y); }
function tPos(t) { return t.isB ? [t.x + t.w / 2, t.y + t.h / 2] : [t.x, t.y]; }
function enemiesOf(side) { return side === 'A' ? 'D' : 'A'; }
function nearestUnit(sc, u, side, maxD) { if (u.pl && !u.hero) return spreadUnit(sc, u, side, maxD); return nearestUnit0(sc, u, side, maxD); }
function spreadUnit(sc, u, side, maxD) { const load = new Map(); for (const o of sc.U) if (!o.dead && o.pl && o !== u && o.tgt && !o.tgt.isB) load.set(o.tgt, (load.get(o.tgt) || 0) + 1);
  let best = null, bs = 1e9; for (const o of sc.U) { if (o.dead || o.side !== side) continue; const d = Math.hypot(o.x - u.x, o.y - u.y); if (d >= maxD) continue; const sc2 = d + (load.get(o) || 0) * (o.d && o.d.hp > 200 ? 0.9 : 1.8) + (o === u.tgt ? -1 : 0); if (sc2 < bs) { bs = sc2; best = o; } } return best; }
function nearestUnit0(sc, u, side, maxD) { let best = null, bd = maxD; for (const o of sc.U) { if (o.dead || o.side !== side) continue; const d = Math.hypot(o.x - u.x, o.y - u.y); if (d < bd) { bd = d; best = o; } } return best; }
function pickBuilding(sc, u) {
  let best = null, bd = 1e9; const towersFirst = u.pl && sc.order === 'towers';
  for (const b of sc.B) {
    if (b.dead || b.side === u.side) continue; const d = BDEF[b.t]; if (d.wall || d.decor) continue;
    let dist = distToB(u.x, u.y, b); if (u.pl) { let n = 0; for (const o of sc.U) if (!o.dead && o.pl && o !== u && o.tgt === b) n++; dist += n * (0.5 + 2.5 / Math.max(1, b.w * b.h)); }
    if (u.d.bld && !d.shoot) dist *= 0.9; if (towersFirst) dist *= d.shoot ? 0.25 : 3;
    if (dist < bd) { bd = dist; best = b; }
  }
  return best;
}
function costFnFor(sc, u, tgt) {
  return (x, y) => {
    if (sc.water[y * N + x]) return Infinity;
    const b = bAt(sc, x, y); if (!b) return 1;
    if (b === tgt) return 1;
    if (BDEF[b.t].wall || BDEF[b.t].gate) return u.side === b.side ? 1.5 : (BDEF[b.t].gate ? 14 : 7);
    if (BDEF[b.t].moat) return u.side === b.side ? 1.3 : 6;
    if (BDEF[b.t].decor) return 2;
    return Infinity;
  };
}
function repath(sc, u) {
  const t = u.tgt; if (!t) { u.path = null; return; }
  const r = Math.max(u.d.rng, 0.75);
  const goal = t.isB ? (x, y) => distToB(x + 0.5, y + 0.5, t) <= r + 0.15 && !(bAt(sc, x, y) && bAt(sc, x, y) !== t) : (x, y) => Math.hypot(x + 0.5 - t.x, y + 0.5 - t.y) <= Math.max(r, 1.0);
  const [tx, ty] = tPos(t);
  u.path = astar(Math.floor(u.x), Math.floor(u.y), goal, costFnFor(sc, u, t), tx, ty, 2500); u.pi = 0; u.prt = t.isB ? 3 : 1.2;
}
function moveTo(sc, u, tx, ty, dt) {
  const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy); if (d < 0.02) return true;
  const mb = sc.mode !== 'village' ? bAt(sc, Math.floor(u.x), Math.floor(u.y)) : null; const inMoat = mb && BDEF[mb.t].moat && mb.side !== u.side;
  const sp = u.d.spd * 1.3 * (u.sm || 1) * (u.gb > 0 ? 1.25 : 1) * (u.slow > 0 ? 0.6 : 1) * (inMoat ? 0.4 : 1) * dt;
  const st = Math.min(sp, d) / d;
  stepTo(sc, u, u.x + dx * st, u.y + dy * st);
  u.moving = true; setFace(u, dx, dy);
  return d <= sp;
}
function blockedFor(sc, u, x, y) { if (isWater(sc, Math.floor(x), Math.floor(y))) return true; const b = bAt(sc, Math.floor(x), Math.floor(y)); if (!b) return false; if (b === u.tgt && !b.isB) return false; if (BDEF[b.t].decor) return false; if ((BDEF[b.t].wall || BDEF[b.t].gate) && b.side === u.side) return false; return true; }
function stepTo(sc, u, nx, ny) {
  if (!blockedFor(sc, u, nx, ny)) { u.x = nx; u.y = ny; }
  else if (!blockedFor(sc, u, nx, u.y)) u.x = nx; else if (!blockedFor(sc, u, u.x, ny)) u.y = ny;
  u.x = Math.max(0.3, Math.min(N - 0.3, u.x)); u.y = Math.max(0.3, Math.min(N - 0.3, u.y));
}
function setFace(u, dx, dy) { [dx, dy] = rotV(dx, dy); const sx = dx - dy, sy = dx + dy; if (Math.abs(sx) + Math.abs(sy) < 1e-4) return; u.face = sy >= -0.15 ? 'F' : 'B'; u.flip = sx < 0; u.fsx = sx; u.fsy = sy * 2; }
function dealDamage(sc, t, amt, src, kind) {
  if (t.dead) return;
  if (!t.isB) {
    if (t.inv > 0) { floatText(sc, t.x, t.y, '🛡', '#9cf', 0.6); return; }
    let a = t.d.armor || 0; if (kind === 'melee') a *= 0.5; if (src && src.d && src.d.pierce) a = 0; amt *= 1 - a;
    if (src && src.d && src.d.anticav && t.d.cav) amt *= src.d.anticav;
  } else {
    if (src && src.d && src.d.bld) amt *= 1.6;
    if (src && src.d && src.d.ranged && !src.hero && !src.d.siege) amt *= 0.55;
    if (src && src.d && src.d.siege === 'ram' && (BDEF[t.t].wall || BDEF[t.t].gate)) amt *= 3;
  }
  if (t.df) amt *= t.df; t.hp -= amt; t.hitT = 0.15; if (amt > 30 && sc.mode !== 'village') shake(amt > 60 ? 4 : 2);
  if (t.hp <= 0 && t.duro) { t.duro = 0; t.hp = Math.max(1, t.maxhp * 0.15); t.inv = 1.2; floatText(sc, t.x, t.y, '💀 Duro a Morire!', '#ffd27a', 1.3); }
  if (t.hp <= 0) { t.hp = 0; kill(sc, t); }
}
function kill(sc, t) {
  t.dead = true; t.deadT = 0;
  if (t.isB) {
    sfx('crash'); sceneIndex(sc); if (sc.mode !== 'village') { debris(sc, t); shake(BDEF[t.t].wall ? 3 : t.t === 'mastio' ? 14 : 7); }
    for (let i = 0; i < 10; i++) puff(sc, t.x + Math.random() * t.w, t.y + Math.random() * t.h, 10 + Math.random() * 30, '#7a6a55');
    if (sc.onBDead) sc.onBDead(t);
  } else { if (Math.random() < 0.5) sfx('hit'); if (sc.onUDead) sc.onUDead(t); }
}
function attack(sc, u, t) {
  const [tx, ty] = tPos(t); setFace(u, tx - u.x, ty - u.y);
  if (u.cd > 0) return;
  u.cd = u.d.cd * (u.slow > 0 ? 1.3 : 1); u.atkT = 0.32;
  if (u.d.siege === 'ram') sfx('ram'); else if (u.d.siege === 'cat') sfx('launch');
  let dmg = u.d.dmg * (u.dm || 1) * (u.gb > 0 ? 1.4 : 1) * (u.ga > 0 ? 1.1 : 1); if (u.pl && sc.arms) dmg *= sc.arms; if (u.pl && u.d.ranged && u.rm) dmg *= u.rm;
  if (u.d.fury && u.hp < u.maxhp * 0.3) { dmg *= 2; if (Math.random() < 0.3) floatText(sc, u.x, u.y, 'FURIA!', '#f55', 0.7); }
  if (u.d.charge && !u.charged) { dmg *= 2; u.charged = true; floatText(sc, u.x, u.y, 'Carica!', '#fd6', 0.8); }
  if (u.d.ranged) { shoot(sc, u.x, u.y, 26, t, dmg, u.d.ranged, u); }
  else { dealDamage(sc, t, dmg, u, 'melee'); if (Math.random() < 0.35) sfx('hit'); if (t.isB && Math.random() < 0.3) puff(sc, tx + (Math.random() - .5) * t.w * .6, ty + (Math.random() - .5) * t.h * .6, 10, '#8a7a60'); }
}
function shoot(sc, x, y, z, t, dmg, type, src) {
  const [tx, ty] = tPos(t); const d = Math.hypot(tx - x, ty - y);
  sc.P.push({ x0: x, y0: y, z0: z, t: 0, dur: Math.max(0.25, d / (type === 'bolt' ? 14 : type === 'stone' ? 6 : 10)), tgt: t, tx, ty, dmg, type, src, arc: type === 'bolt' ? 8 : type === 'stone' ? 30 + d * 5 : 14 + d * 3 });
  if (Math.random() < 0.5) sfx(type === 'bolt' ? 'bolt' : 'arrow');
}
function floatText(sc, x, y, txt, col, dur) { sc.T.push({ x, y, txt, col, t: 0, dur: dur || 1.2 }); }
function puff(sc, x, y, z, col) { sc.FX.push({ k: 'puff', x, y, z, vx: (Math.random() - .5) * 0.3, vz: 10 + Math.random() * 14, r: 4 + Math.random() * 6, t: 0, dur: 1.2 + Math.random(), col }); }

function updateScene(sc, dt) {
  sc.time += dt;
  const U = sc.U;
  for (const u of U) {
    if (u.dead) { u.deadT += dt; continue; }
    u.cd -= dt; u.atkT -= dt; u.rt -= dt; u.slow -= dt; u.inv -= dt; u.hitT -= dt; u.prt -= dt; u.moving = false;
    if (u.ai) { u.ai(sc, u, dt); continue; }
    if (u.tgt && u.tgt.dead) { u.tgt = null; u.path = null; }
    if (u.wall && u.wall.dead) { u.wall = null; u.path = null; }
    const foe = enemiesOf(u.side);
    if (u.side === 'A') {
      if (u.rt <= 0) {
        u.rt = 0.5;
        const aggro = u.d.ranged ? u.d.rng + 1 : 2.6;
        const hero = u.pl && sc.order === 'hero' && !u.hero ? sc.U.find(o => o.hero && o.pl && !o.dead) : null;
        if (hero) { const nu = nearestUnit(sc, hero, foe, 3.2); if (nu) { if (u.tgt !== nu) { u.tgt = nu; u.wall = null; repath(sc, u); } } else if (Math.hypot(hero.x - u.x, hero.y - u.y) > 1.8) { u.tgt = null; u.wall = null; u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => Math.hypot(x + .5 - hero.x, y + .5 - hero.y) < 1.5, (x, y) => { const b = bAt(sc, x, y); return sc.water[y * N + x] ? Infinity : b ? (b.side === u.side ? Infinity : 8) : 1; }, Math.floor(hero.x), Math.floor(hero.y), 1500); u.pi = 0; u.follow = hero; } }
        else {
        if (sc.order === 'towers' && u.pl && u.tgt && !u.tgt.isB && !u.d.ranged) { u.tgt = null; }
        const nu = u.d.bld || (u.pl && sc.order === 'towers' && !u.d.ranged) ? null : nearestUnit(sc, u, foe, aggro);
        if (nu && (!u.tgt || u.tgt.isB)) { u.tgt = nu; u.wall = null; repath(sc, u); }
        else if (!u.tgt) { u.tgt = pickBuilding(sc, u); if (u.tgt) repath(sc, u); } }
      }
    } else { // defender guard
      if (u.rt <= 0) {
        u.rt = 0.5;
        if (u.pl && sc.order === 'hero' && !u.hero) { const h = sc.U.find(o => o.hero && o.pl && !o.dead); if (h) u.post = { x: h.x + ((u.id % 5) - 2) * 0.45, y: h.y + (((u.id / 5) | 0) % 3 - 1) * 0.45 }; }
        const charge = u.pl && sc.order === 'charge';
        const nu = nearestUnit(sc, u, foe, charge ? 60 : (u.guardR || 5));
        if (nu && (charge || Math.hypot(nu.x - u.post.x, nu.y - u.post.y) < (u.leash || 8))) { if (u.tgt !== nu) { u.tgt = nu; repath(sc, u); } }
        else if (u.tgt) { u.tgt = null; u.path = null; }
      }
    }
    if (u.gb > 0) u.gb -= dt; if (u.ga > 0) u.ga -= dt;
    if (u.hero && u.k === 'generale') { u.auraT -= dt; if (u.auraT <= 0) { u.auraT = 0.5; for (const o of U) if (!o.dead && o.side === u.side && o !== u && Math.hypot(o.x - u.x, o.y - u.y) < 3.5) o.ga = 0.7; } }
    if (u.hero && HDEF[u.k].aura) { u.auraT -= dt; if (u.auraT <= 0) { u.auraT = 1; for (const o of U) if (!o.dead && o.side === u.side && Math.hypot(o.x - u.x, o.y - u.y) < 3) o.hp = Math.min(o.maxhp, o.hp + 4); } }
    if (tryClimb(sc, u, dt)) continue;
    const t = u.wall || u.tgt;
    if (t) {
      const d = distTo(u, t), r = t.isB ? Math.max(u.d.rng, 0.55) + 0.2 : Math.max(u.d.rng, 0.7);
      if (d <= r) { attack(sc, u, t); }
      else {
        if (!t.isB && u.prt <= 0) repath(sc, u);
        if (!u.path || u.pi >= u.path.length) {
          if (!t.isB) { let [tx, ty] = tPos(t); if (u.pl && d > 1.6) { const a = (u.id * 2.39996) % 6.283, rr = Math.min(1.4, (d - 1) * 0.6); tx += Math.cos(a) * rr; ty += Math.sin(a) * rr; } moveTo(sc, u, tx, ty, dt); }
          else { if (u.prt <= 0) repath(sc, u); const [tx, ty] = tPos(t); moveTo(sc, u, tx, ty, dt); }
        } else {
          const [px, py] = u.path[u.pi];
          const wb = bAt(sc, px, py);
          if (wb && (BDEF[wb.t].wall || BDEF[wb.t].gate) && wb.side !== u.side && wb !== t) { u.wall = wb; }
          else if (moveTo(sc, u, px + 0.5, py + 0.5, dt)) u.pi++;
        }
      }
    } else if (u.side === 'D') {
      if (Math.hypot(u.x - u.post.x, u.y - u.post.y) > 0.4) moveTo(sc, u, u.post.x, u.post.y, dt);
    } else if (u.follow && u.path && u.pi < u.path.length) { const [px, py] = u.path[u.pi]; if (moveTo(sc, u, px + 0.5, py + 0.5, dt)) u.pi++; }
  }
  // separation
  for (let i = 0; i < U.length; i++) {
    const a = U[i]; if (a.dead) continue;
    for (let j = i + 1; j < U.length; j++) {
      const b = U[j]; if (b.dead) continue; const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, R = (a.d.cav || b.d.cav) ? 0.55 : (a.pl && b.pl ? 0.48 : 0.36);
      if (d2 < R * R && d2 > 1e-6) { const d = Math.sqrt(d2), p = (R - d) / d * 0.25; stepTo(sc, a, a.x - dx * p, a.y - dy * p); stepTo(sc, b, b.x + dx * p, b.y + dy * p); }
    }
  }
  // towers
  for (const b of sc.B) {
    if (b.dead) { b.deadT = (b.deadT || 0) + dt; continue; }
    b.hitT -= dt;
    const sh = BDEF[b.t].shoot; if (!sh || b.inactive || sc.mode === 'village') continue;
    b.cd -= dt; if (b.cd > 0) continue;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2; let best = null, bd = sh.range + b.lvl * 0.15;
    for (const u of U) { if (u.dead || u.side === b.side || u.side === 'V') continue; const d = Math.hypot(u.x - cx, u.y - cy); if (d < bd) { bd = d; best = u; } }
    if (best) {
      { const ddx = best.x - cx, ddy = best.y - cy; b.yawT = Math.atan2(-(ddx - ddy), ddx + ddy); b.fired = sc.time; }
      b.cd = sh.cd; const z = b.t === 'torrepietra' ? 96 : b.t === 'torre' ? 80 : b.t === 'mastio' ? 70 : b.t === 'cancello' ? 60 : 34;
      shoot(sc, cx, cy, z, best, sh.dmg * (1 + 0.3 * (b.lvl - 1)) * (b.side === 'D' && sc.mode === 'raid' ? 1 + 0.1 * tech('bal') : 1) * (b.side === 'D' && sc.mode === 'attack' ? DF().edmg : 1), sh.type, { d: { pierce: sh.type === 'bolt' } });
      const [dx, dy] = rotV(best.x - cx, best.y - cy); b.aim = { b: dx + dy < 0, flip: dx - dy < 0 }; b.fireT = 0.25;
    }
    b.fireT = (b.fireT || 0) - dt;
  }
  // projectiles
  for (const p of sc.P) {
    p.t += dt; if (!p.tgt.dead) { const [tx, ty] = tPos(p.tgt); p.tx = tx; p.ty = ty; }
    if (p.t >= p.dur) { p.done = true; if (!p.tgt.dead) dealDamage(sc, p.tgt, p.dmg, p.src, p.type); if (p.type === 'stone') { for (const o of sc.U) if (!o.dead && p.src && o.side !== p.src.side && Math.hypot(o.x - p.tx, o.y - p.ty) < 1.6) dealDamage(sc, o, p.dmg * 0.35, p.src, 'stone'); for (let i = 0; i < 5; i++) puff(sc, p.tx + (Math.random() - .5), p.ty + (Math.random() - .5), 8, '#8a7a60'); shake(3); sfx('boulder'); } }
  }
  sc.P = sc.P.filter(p => !p.done);
  // smoke from damaged buildings
  for (const b of sc.B) {
    if (b.dead ? (b.deadT < 8) : (b.hp < b.maxhp * 0.5 && !BDEF[b.t].wall)) { b.smokeT -= dt; if (b.smokeT <= 0) { b.smokeT = 0.25 + Math.random() * 0.3; puff(sc, b.x + b.w / 2 + (Math.random() - .5) * b.w * 0.5, b.y + b.h / 2 + (Math.random() - .5) * b.h * .5, b.dead ? 5 : 30, b.dead ? '#3d3833' : '#4a4540'); } }
  }
  for (const f of sc.FX) { f.t += dt; if (f.k === 'deb') debrisUpd(f, dt); else if (f.k === 'puff') { f.x += f.vx * dt; f.z += f.vz * dt; f.r += dt * 6; } if (f.upd) f.upd(sc, f, dt); }
  sc.FX = sc.FX.filter(f => f.t < f.dur);
  for (const t of sc.T) t.t += dt; sc.T = sc.T.filter(t => t.t < t.dur);
  // remove long-dead units to keep lists small
  if (sc.U.length > 160) sc.U = sc.U.filter(u => !u.dead || u.deadT < 4);
}

// ---------- hero ultimates ----------
function heroUlt(sc, u) {
  if (u.ultUsed || u.dead) return false; u.ultUsed = true; sfx('ult');
  if (u.k === 'isolde') {
    let cx = u.x, cy = u.y; const t = u.tgt || pickBuilding(sc, u); if (t) { [cx, cy] = tPos(t); }
    const foe = enemiesOf(u.side);
    sc.FX.push({ k: 'rain', x: cx, y: cy, t: 0, dur: 2.4, tick: 0, upd(sc, f, dt) { f.tick -= dt; if (f.tick <= 0 && f.t < 2) { f.tick = 0.4; for (const o of sc.U) if (!o.dead && o.side === foe && Math.hypot(o.x - f.x, o.y - f.y) < 2.8) { dealDamage(sc, o, 24, u, 'arrow'); o.slow = 4; } for (const b of sc.B) if (!b.dead && b.side === foe && distToB(f.x, f.y, b) < 2.2) dealDamage(sc, b, 40, null); } } });
    floatText(sc, u.x, u.y, 'Pioggia di Frecce!', '#ffe08a', 1.5);
  } else if (u.k === 'tomas') {
    let rev = 0; const dead = sc.U.filter(o => o.dead && o.side === u.side && !o.hero && Math.hypot(o.x - u.x, o.y - u.y) < 5);
    const n = Math.ceil(dead.length * 0.3);
    for (let i = 0; i < n; i++) { const o = dead[i]; o.dead = false; o.hp = o.maxhp * 0.5; o.deadT = 0; o.tgt = null; rev++; if (sc.onRevive) sc.onRevive(o); }
    for (const o of sc.U) if (!o.dead && o.side === u.side && Math.hypot(o.x - u.x, o.y - u.y) < 4.5) { o.hp = o.maxhp; o.slow = 0; }
    sc.FX.push({ k: 'ring', x: u.x, y: u.y, t: 0, dur: 1.4, col: '255,215,110', r: 4.5 });
    floatText(sc, u.x, u.y, `Ultima Unzione! ${rev ? '+' + rev + ' rialzati' : ''}`, '#ffe08a', 1.6);
  } else if (u.k === 'generale') {
    let n = 0; for (const o of sc.U) if (!o.dead && o.side === u.side && Math.hypot(o.x - u.x, o.y - u.y) < 5.5) { o.gb = 8; n++; }
    sc.FX.push({ k: 'ring', x: u.x, y: u.y, t: 0, dur: 1.6, col: '255,190,80', r: 5.5 });
    floatText(sc, u.x, u.y, `Giuramento di Ferro! ${n} uomini`, '#ffcf7a', 1.6);
  } else if (u.k === 'templare') {
    for (const o of sc.U) if (!o.dead && o.side === u.side && Math.hypot(o.x - u.x, o.y - u.y) < 3.2) o.inv = 6;
    for (const o of sc.U) if (!o.dead && o.side !== u.side && Math.hypot(o.x - u.x, o.y - u.y) < 5) { o.tgt = u; o.path = null; }
    sc.FX.push({ k: 'dome', x: u.x, y: u.y, t: 0, dur: 6, follow: u });
    floatText(sc, u.x, u.y, 'Muro di Scudi!', '#9cd2ff', 1.6);
  }
  return true;
}

// ---------- rendering ----------
const cam = { x: 0, y: 0, z: 1 };
function worldToScreen(wx, wy) { return [(wx - cam.x) * cam.z + VW / 2, (wy - cam.y) * cam.z + VH / 2]; }
function screenToTile(sx, sy) { const wx = (sx - VW / 2) / cam.z + cam.x, wy = (sy - VH / 2) / cam.z + cam.y; const a = wx / (TW / 2), b = wy / (TH / 2); return rotPinv((b + a) / 2, (b - a) / 2); }
function unitFrame(u) {
  const k = u.k;
  if (u.dead) return [k + '.death', u.flip];
  const dir = u.face;
  if (u.atkT > 0 || u.working) { const f = (u.working && !u.moving) ? ((u.phase * 1.6 | 0) % 2 ? 'attack' : 'idle') : 'attack'; return [k + '.' + f + dir, u.flip]; }
  if (u.moving) { const st = (u.phase * 2.2 | 0) % 2; return [k + (st ? '.walk' : '.idle') + dir, u.flip]; }
  return [k + '.idle' + dir, u.flip];
}
function render(sc, dt) {
  const c = ctx;
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = sc.night ? '#1b2016' : '#2f3a1f'; c.fillRect(0, 0, cv.width, cv.height);
  const z = cam.z * DPR; let shx = 0, shy = 0; if (SHAKE.a > 0.2) { shx = (Math.random() - .5) * SHAKE.a; shy = (Math.random() - .5) * SHAKE.a; SHAKE.a *= 0.86; } else SHAKE.a = 0;
  c.setTransform(z, 0, 0, z, DPR * (VW / 2 - cam.x * cam.z + shx), DPR * (VH / 2 - cam.y * cam.z + shy));
  c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  // view bounds in world
  const vx0 = cam.x - VW / 2 / cam.z - 120, vx1 = cam.x + VW / 2 / cam.z + 120, vy0 = cam.y - VH / 2 / cam.z - 60, vy1 = cam.y + VH / 2 / cam.z + 260;
  drawGround(c, sc, cam.x - VW / 2 / cam.z - 8, cam.y - VH / 2 / cam.z - 8, cam.x + VW / 2 / cam.z + 8, cam.y + VH / 2 / cam.z + 8);
  seasonGround(c, sc);
  const vis = (wx, wy) => wx > vx0 && wx < vx1 && wy > vy0 && wy < vy1;
  // floor overlays
  if (sc.zoneCv && sc.deploySel) { c.save(); c.globalAlpha = 0.75 + 0.2 * Math.sin(sc.time * 4); tileTransform(c, 8); c.drawImage(sc.zoneCv, 0, 0); c.restore();
    if (sc.rally && MODE === 'attack') { const [rx, ry] = W(sc.rally[0] + 0.5, sc.rally[1] + 0.5); const k = 0.5 + 0.5 * Math.sin(sc.time * 4); c.strokeStyle = `rgba(120,230,120,${0.6 + 0.4 * k})`; c.lineWidth = 3; c.beginPath(); c.ellipse(rx, ry, 30 + k * 6, 15 + k * 3, 0, 0, 7); c.stroke(); c.fillStyle = 'rgba(120,230,120,0.18)'; c.fill();
      c.fillStyle = '#3a2a18'; c.fillRect(rx - 1.2, ry - 44, 2.4, 44); c.fillStyle = '#2f8a3a'; c.beginPath(); c.moveTo(rx + 1, ry - 44); c.lineTo(rx + 20, ry - 39); c.lineTo(rx + 1, ry - 33); c.closePath(); c.fill();
      c.font = 'bold 12px Cinzel, serif'; c.textAlign = 'center'; c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,.75)'; c.strokeText('Schiera qui', rx, ry + 30); c.fillStyle = '#d8ffcf'; c.fillText('Schiera qui', rx, ry + 30); c.textAlign = 'start'; } }
  // rubble & dead buildings (floor)
  for (const b of sc.B) if (b.dead) { const vr = vRect(b); const [wx, wy] = WR(vr[0], vr[1]); const e = rubbleCache(b); if (!e) continue; c.drawImage(e.cv, wx - e.ox, wy - e.oy, e.w, e.h); }
  // selection
  if (sc.selN) { const [x, y] = W(sc.selN.x, sc.selN.y); c.strokeStyle = 'rgba(255,230,140,0.95)'; c.lineWidth = 2; c.fillStyle = 'rgba(255,230,140,0.18)'; c.beginPath(); c.ellipse(x, y, 24, 12, 0, 0, 7); c.fill(); c.stroke(); }
  if (sc.sel && !sc.sel.dead) { const b = sc.sel; poly(c, [W(b.x, b.y), W(b.x + b.w, b.y), W(b.x + b.w, b.y + b.h), W(b.x, b.y + b.h)], 'rgba(255,230,140,0.18)', 'rgba(255,230,140,0.9)', 2); }
  if (sc.ghost) { const ok = sc.ghost.ok; const gh = sc.ghost; poly(c, [W(gh.x, gh.y), W(gh.x + gh.w, gh.y), W(gh.x + gh.w, gh.y + gh.h), W(gh.x, gh.y + gh.h)], ok ? 'rgba(120,220,120,0.35)' : 'rgba(230,80,60,0.4)', ok ? '#9f9' : '#f88', 2); }
  // drawables
  const L = [];
  for (const b of sc.B) if (!b.dead) { const vr = vRect(b); const [wx, wy] = WR(vr[0], vr[1]); if (vis(wx, wy + 40)) L.push([BDEF[b.t].moat || BDEF[b.t].flat ? -1e6 + vr[0] + vr[1] : vr[0] + vr[1] + (b.w + b.h) / 2 - (BDEF[b.t].wall ? 0.0 : 0.02), 0, b]); }
  for (const u of sc.U) { const [wx, wy] = W(u.x, u.y); const p = rotP(u.x, u.y); if (vis(wx, wy)) L.push([u.dead ? p[0] + p[1] - 1.2 : p[0] + p[1], 1, u]); }
  for (const t of sc.trees) { const [wx, wy] = W(t.x, t.y); if (vis(wx, wy)) { const gi = sc.grid[(t.y | 0) * N + (t.x | 0)]; if (gi >= 0 && sc.B[gi] && !sc.B[gi].dead && !BDEF[sc.B[gi].t].decor) continue; const tq = QQ().tr; if (tq < 1 && Math.hypot(t.x - MCX, t.y - MCX) > 26 && ((((t.x * 73) | 0) ^ ((t.y * 151) | 0)) & 1023) / 1024 > tq) continue; const p = rotP(t.x, t.y); L.push([p[0] + p[1], 2, t]); } }
  for (const r of sc.rocks) { const [wx, wy] = W(r.x, r.y); if (vis(wx, wy)) { const p = rotP(r.x, r.y); L.push([p[0] + p[1] - 0.3, 3, r]); } }
  if (sc.mode === 'village' && S && S.fauna) for (const a of S.fauna) { const [wx, wy] = W(a.x, a.y); if (vis(wx, wy)) { const p = rotP(a.x, a.y); L.push([p[0] + p[1], 5, a]); } }
  const bans = (sc.mode === 'village' || sc.mode === 'raid') && PATHC.banners && sc.pathG === PATHC.grid ? PATHC.banners : sc.props || []; for (const l of bans) { const [wx, wy] = W(l.x, l.y); if (vis(wx, wy)) { const p = rotP(l.x, l.y); L.push([p[0] + p[1], 9, l]); } }
  if ((sc.mode === 'village' || sc.mode === 'raid') && PATHC.lamps && sc.pathG === PATHC.grid) for (const l of PATHC.lamps) { const [wx, wy] = W(l.x, l.y); if (vis(wx, wy)) { const p = rotP(l.x, l.y); L.push([p[0] + p[1], 8, l]); } }
  if (sc.ghost && sc.ghost.t) { const vr = vRect(sc.ghost); L.push([vr[0] + vr[1] + (sc.ghost.w + sc.ghost.h) / 2, 4, sc.ghost]); }
  L.sort((a, b) => a[0] - b[0]);
  for (const [, kind, o] of L) {
    if (kind === 0) drawBuilding(c, sc, o);
    else if (kind === 1) { if (sc.selU === o && !o.dead) { const [ux, uy] = W(o.x, o.y); c.strokeStyle = 'rgba(255,230,140,0.95)'; c.lineWidth = 2; c.beginPath(); c.ellipse(ux, uy, 13, 6, 0, 0, 7); c.stroke(); } drawUnit(c, sc, o); }
    else if (kind === 8) drawLamp(c, o);
    else if (kind === 9) drawBanner(c, o);
    else if (kind === 2) { const [wx, wy] = W(o.x, o.y); const tv = treeVariants();
      if (drawTree3D(c, o, wx, wy)) { }
      else if (tv) { const v = tv[o.k % 6]; const w = (v.k === 'quercia' ? 96 : 66) * o.s, h = w * v.cv.height / v.cv.width; const fl = ((o.x * 13 + o.y * 7) | 0) % 2; c.fillStyle = 'rgba(0,0,0,0.2)'; c.beginPath(); c.ellipse(wx, wy, w * 0.32, w * 0.14, 0, 0, 7); c.fill(); if (fl) { c.save(); c.translate(wx, 0); c.scale(-1, 1); c.drawImage(v.cv, -w / 2, wy - h + 5 * o.s, w, h); c.restore(); } else c.drawImage(v.cv, wx - w / 2, wy - h + 5 * o.s, w, h); }
      else { const tc = TREES[o.k]; const w = 90 * o.s, h = 110 * o.s; c.drawImage(tc, wx - w / 2, wy - h + 8 * o.s, w, h); } }
    else if (kind === 3) { const [wx, wy] = W(o.x, o.y); if (EATL_OK) { const f = EFR.roccia; const w = o.big ? 64 : 22 + (o.s % 22), h = w * f[3] / f[2]; c.drawImage(EATL, f[0], f[1], f[2], f[3], wx - w / 2, wy - h * 0.82, w, h); } else { c.save(); c.translate(wx, wy); paintRock(c, o.s); c.restore(); } }
    else if (kind === 5) { if (BATL_OK && BFR[o.k]) { const F = FAUNA[o.k]; const [wx, wy] = W(o.x, o.y); const atk = o.atk > 0; const [f, w, h] = animFrame(o.k, o.mv && o.dying == null && !atk, o.ph * 0.75, atk ? 'atk' : null, atk ? (0.8 - o.atk) / 0.2 : o.gph, o.fast); const bob = o.mv ? Math.abs(Math.sin(o.ph)) * (o.k === 'lepre' ? 1.2 : 0.8) : Math.sin(sc.time * 1.5 + o.id) * 0.4; const dk = o.dying != null ? Math.min(1, o.dying / 0.4) : 0;
      c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(wx, wy, w * 0.38, w * 0.11, 0, 0, 7); c.fill();
      if (sc.selA === o) { c.strokeStyle = 'rgba(255,230,140,0.95)'; c.lineWidth = 2; c.beginPath(); c.ellipse(wx, wy, w * 0.45, w * 0.16, 0, 0, 7); c.stroke(); }
      c.save(); c.translate(wx, wy - bob); if (o.fl) c.scale(-1, 1); if (dk) { c.globalAlpha = Math.max(0, 1 - (o.dying - 0.6)); c.rotate(dk * Math.PI / 2 * 0.9); } 
      c.drawImage(f.img || BATL, f[0], f[1], f[2], f[3], -w / 2, -h + 2, w, h); c.restore(); c.globalAlpha = 1; } }
    else if (kind === 4) { // anteprima di piazzamento: lo stesso modello che verrà costruito
      let fb = o._fb; if (!fb || fb.t !== o.t) fb = o._fb = { t: o.t, x: o.x, y: o.y, w: o.w, h: o.h, lvl: 1, seed: 0, mask: 0, id: -7, side: 'D', hp: 1, maxhp: 1, aim: {}, ghost: true, ref: { rot: o.rot || 0 } };
      fb.x = o.x; fb.y = o.y; const mk = m3k(o); if (!G3.models[mk]) need3d(mk);
      c.globalAlpha = 0.7; if ((G3.models[mk] && G3.models[mk].ready) || PAINT[o.t] || (bSprite(fb) && BATL_OK)) drawBuilding(c, sc, fb); else { poly(c, [W(o.x, o.y), W(o.x + o.w, o.y), W(o.x + o.w, o.y + o.h), W(o.x, o.y + o.h)], 'rgba(255,240,200,0.25)', 'rgba(255,240,200,0.8)', 1.5); const [cx, cy] = W(o.x + o.w / 2, o.y + o.h / 2); c.font = '22px serif'; c.textAlign = 'center'; c.fillText(BDEF[o.t].icon || '?', cx, cy - 8); c.textAlign = 'start'; } c.globalAlpha = 1; }
  }
  drawWorks(c, sc);
  // projectiles
  for (const p of sc.P) {
    const k = Math.min(1, p.t / p.dur); const x = p.x0 + (p.tx - p.x0) * k, y = p.y0 + (p.ty - p.y0) * k, zz = p.z0 * (1 - k) + 14 * k + p.arc * 4 * k * (1 - k);
    const k2 = Math.min(1, k + 0.05); const x2 = p.x0 + (p.tx - p.x0) * k2, y2 = p.y0 + (p.ty - p.y0) * k2, z2 = p.z0 * (1 - k2) + 14 * k2 + p.arc * 4 * k2 * (1 - k2);
    const [a, b] = W(x, y), [a2, b2] = W(x2, y2); const ang = Math.atan2((b2 - z2) - (b - zz), a2 - a);
    c.save(); c.translate(a, b - zz); c.rotate(ang);
    if (p.type === 'stone') { c.fillStyle = '#7d766a'; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill(); c.fillStyle = '#a49c8e'; c.beginPath(); c.arc(-1.5, -1.5, 2, 0, 7); c.fill(); }
    else if (p.type === 'bolt') { c.fillStyle = '#4a3420'; c.fillRect(-12, -1.6, 22, 3.2); c.fillStyle = '#ccc'; c.beginPath(); c.moveTo(10, -3); c.lineTo(16, 0); c.lineTo(10, 3); c.fill(); }
    else { c.strokeStyle = '#3b2a18'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(-8, 0); c.lineTo(7, 0); c.stroke(); c.fillStyle = '#ddd'; c.beginPath(); c.moveTo(7, -1.6); c.lineTo(10, 0); c.lineTo(7, 1.6); c.fill(); c.fillStyle = '#eee'; c.fillRect(-9, -1.5, 3, 3); }
    c.restore();
  }
  // fx
  for (const f of sc.FX) {
    const [wx, wy] = f.k === 'chim' ? [0, 0] : W(f.x, f.y); const k = f.t / f.dur;
    if (f.draw) f.draw(c, sc, f, wx, wy);
    else if (f.k === 'deb') { c.save(); c.globalAlpha = Math.min(1, (1 - k) * 2.5); c.translate(wx, wy - f.z); c.rotate(f.rot); c.fillStyle = f.col; c.fillRect(-f.s / 2, -f.s / 3, f.s, f.s * 0.66); c.restore(); }
    else if (f.k === 'puff') { c.fillStyle = shade(f.col, 1, 0.35 * (1 - k)); c.beginPath(); c.arc(wx, wy - f.z, f.r, 0, 7); c.fill(); }
    else if (f.k === 'ring') { c.strokeStyle = `rgba(${f.col},${1 - k})`; c.lineWidth = 3; c.beginPath(); c.ellipse(wx, wy, f.r * 32 * k, f.r * 16 * k, 0, 0, 7); c.stroke(); c.fillStyle = `rgba(${f.col},${0.15 * (1 - k)})`; c.fill(); }
    else if (f.k === 'rain') { c.strokeStyle = 'rgba(40,25,10,0.8)'; c.lineWidth = 1.2; for (let i = 0; i < 26; i++) { const R = rng(i * 13 + (f.t * 10 | 0)); const ox = (R() - 0.5) * 150, oy = (R() - 0.5) * 70; const h = (f.t * 300 + R() * 200) % 160; c.beginPath(); c.moveTo(wx + ox - 8, wy + oy - 160 + h); c.lineTo(wx + ox, wy + oy - 160 + h + 14); c.stroke(); } c.fillStyle = 'rgba(120,20,10,0.12)'; c.beginPath(); c.ellipse(wx, wy, 90, 45, 0, 0, 7); c.fill(); }
    else if (f.k === 'dome') { const u = f.follow; const [ux, uy] = u && !u.dead ? W(u.x, u.y) : [wx, wy]; c.strokeStyle = `rgba(150,210,255,${0.8 * (1 - k * 0.5)})`; c.lineWidth = 2; c.fillStyle = `rgba(150,210,255,${0.14})`; c.beginPath(); c.ellipse(ux, uy, 100, 50, 0, 0, 7); c.fill(); c.stroke(); }
    else if (f.k === 'chim') { c.fillStyle = `rgba(200,195,185,${0.32 * (1 - k)})`; c.beginPath(); c.arc(f.x0 + f.dx * k, f.y0 - k * 34, f.r + k * 9, 0, 7); c.fill(); }
    else if (f.k === 'spark') { c.fillStyle = `rgba(255,220,120,${1 - k})`; c.beginPath(); c.arc(wx, wy - 30 - k * 30, 3, 0, 7); c.fill(); }
  }
  // night lighting
  if (sc.night) {
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = 'rgba(10,18,40,0.5)'; c.fillRect(0, 0, cv.width, cv.height);
    c.globalCompositeOperation = 'lighter';
    c.setTransform(z, 0, 0, z, DPR * (VW / 2 - cam.x * cam.z), DPR * (VH / 2 - cam.y * cam.z));
    nightLights(c, sc, 1);
    for (const b of sc.B) if (!b.dead && BDEF[b.t].shoot) { const [wx, wy] = W(b.x + b.w / 2, b.y + b.h / 2); const fl = 0.85 + Math.sin(sc.time * 9 + b.id) * 0.1; for (const sx of [-9, 9]) { const x = wx + sx, y = wy - 26; const gr = c.createRadialGradient(x, y, 1, x, y, 16 * fl); gr.addColorStop(0, 'rgba(255,180,80,0.5)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = gr; c.fillRect(x - 16, y - 16, 32, 32); c.fillStyle = 'rgba(255,225,140,0.95)'; c.fillRect(x - 1.2, y - 2.5, 2.4, 3.5); } }
    for (const b of sc.B) if (b.dead && b.deadT < 8) { const [wx, wy] = W(b.x + b.w / 2, b.y + b.h / 2); const gr = c.createRadialGradient(wx, wy, 2, wx, wy, 50); gr.addColorStop(0, 'rgba(255,90,30,0.35)'); gr.addColorStop(1, 'rgba(255,60,20,0)'); c.fillStyle = gr; c.beginPath(); c.arc(wx, wy, 50, 0, 7); c.fill(); }
    c.restore();
  }
  drawDayNight(c, sc, z);
  drawWeather(c, sc, Math.min(0.05, dt || 0.016));
  // overlays: hp bars, bubbles, texts
  for (const b of sc.B) {
    if (b.dead) continue; const [wx, wy] = W(b.x + b.w / 2, b.y + b.h / 2);
    if (b.hp < b.maxhp && sc.mode !== 'village') hpBar(c, wx, wy - (BDEF[b.t].wall ? 34 : 50 + b.w * 12), 30 + b.w * 6, b.hp / b.maxhp, b.side === 'D' && sc.mode === 'attack' ? '#e0583a' : '#7ccf5a');
    if (b.ref && b.ref.end) { const k = 1 - Math.max(0, (b.ref.end - Date.now()) / (b.ref.dur || 1)); hpBar(c, wx, wy - 40 - b.w * 14, 40, k, '#e8c24a'); drawScaffold(c, b); }
    if (b.bubble) { const sr = bSprite(b) ? bSpriteRect(b) : null; const by = (sr ? sr[1] + 6 : wy - 60 - b.w * 16) + Math.sin(sc.time * 3 + b.id) * 3; const bb = THM().bub; c.fillStyle = bb[0]; c.strokeStyle = bb[1]; c.lineWidth = 1.6; c.beginPath(); if (SET.theme === 'araldica') { c.rect(wx - 11, by - 11, 22, 22); } else c.arc(wx, by, 11.5, 0, 7); c.fill(); c.stroke(); const im = ICOIMG[b.bubbleK]; if (im && im.complete && im.naturalWidth) c.drawImage(im, wx - 9, by - 9.5, 18, 18); else { c.font = '13px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b.bubble, wx, by + 1); } }
  }
  for (const u of sc.U) {
    if (u.dead || u.ai) continue; if (u.hp >= u.maxhp && !u.hero) continue;
    const [wx, wy] = W(u.x, u.y); const hh = (FR[u.k + '.idleF'] || [0, 0, 0, 120])[3] * uScale(u);
    hpBar(c, wx, wy - hh - 6, u.hero ? 28 : 18, u.hp / u.maxhp, u.side === 'A' ? (sc.mode === 'raid' ? '#e0583a' : '#7ccf5a') : (sc.mode === 'raid' ? '#7ccf5a' : '#e0583a'));
    if (u.hero) { c.font = '10px serif'; c.textAlign = 'center'; c.fillStyle = '#ffd86b'; c.fillText('♔', wx, wy - hh - 12); }
  }
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  for (const t of sc.T) { const [wx, wy] = W(t.x, t.y); const k = t.t / t.dur; c.font = THM().cf; c.lineWidth = 3; c.strokeStyle = `rgba(20,10,0,${1 - k})`; c.fillStyle = t.col; c.globalAlpha = 1 - k * k; c.strokeText(t.txt, wx, wy - 60 - k * 26); c.fillText(t.txt, wx, wy - 60 - k * 26); c.globalAlpha = 1; }
}
function hpBar(c, x, y, w, k, col) { c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(x - w / 2 - 1, y - 1, w + 2, 5); c.fillStyle = col; c.fillRect(x - w / 2, y, w * Math.max(0, k), 3); }
function drawScaffold(c, b0) {
  const vr = vRect(b0); const b = { x: vr[0], y: vr[1], w: vr[2], h: vr[3] }; const W = WR;
  c.strokeStyle = 'rgba(120,85,45,0.9)'; c.lineWidth = 1.5; const h = 24 + b.w * 6;
  for (const [u, v] of [[b.x + 0.1, b.y + b.h - 0.1], [b.x + b.w - 0.1, b.y + b.h - 0.1], [b.x + b.w - 0.1, b.y + 0.1]]) { const [x, y] = W(u, v); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke(); }
  const a = W(b.x + 0.1, b.y + b.h - 0.1), d = W(b.x + b.w - 0.1, b.y + b.h - 0.1), e = W(b.x + b.w - 0.1, b.y + 0.1);
  for (const hh of [h * 0.45, h]) { c.beginPath(); c.moveTo(a[0], a[1] - hh); c.lineTo(d[0], d[1] - hh); c.lineTo(e[0], e[1] - hh); c.stroke(); }
}
function plotCache(w, h) { return cached(`plot${w}x${h}${TEX_OK ? "t" : ""}`, w, h, 16, c => {
  const [x, y] = isoP(w / 2, h / 2); const g = c.createRadialGradient(x, y + 4, 4, x, y + 4, (w + h) * 18); g.addColorStop(0, 'rgba(0,0,0,0.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y + 4, (w + h) * 18, (w + h) * 9, 0, 0, 7); c.fill();
  if (!TEX_OK) { poly(c, [isoP(0.02, 0.02), isoP(w - 0.02, 0.02), isoP(w - 0.02, h - 0.02), isoP(0.02, h - 0.02)], 'rgba(96,76,48,0.75)'); return; }
  const T = 32, m = 0.38, PW = Math.round((w + m * 2) * T), PH = Math.round((h + m * 2) * T);
  const tv = document.createElement('canvas'); tv.width = PW; tv.height = PH; const t = tv.getContext('2d');
  t.fillStyle = t.createPattern(texTile('dirt', T, 9), 'repeat'); t.fillRect(0, 0, PW, PH);
  const nz = makeNoise(w * 31 + h * 7), id = t.getImageData(0, 0, PW, PH), d = id.data;
  for (let py = 0; py < PH; py++) for (let px = 0; px < PW; px++) {
    const u = px / T - m, v = py / T - m, e = Math.min(u, v, w - u, h - v), n = nz(u * 1.3, v * 1.3, 2);
    const a = Math.min(1, Math.max(0, (e + m * 0.85 + (n - 0.5) * 0.7) / (m * 1.1))); const o = (py * PW + px) * 4;
    const sh = 0.9 + 0.1 * Math.min(1, Math.max(0, e + 0.3)); d[o] *= sh; d[o + 1] *= sh; d[o + 2] *= sh; d[o + 3] = 255 * a * a * (3 - 2 * a) * 0.96;
  }
  t.putImageData(id, 0, 0);
  const o0 = isoP(-m, -m), ex = isoP(1, 0), ey = isoP(0, 1), oz = isoP(0, 0);
  c.save(); c.transform((ex[0] - oz[0]) / T, (ex[1] - oz[1]) / T, (ey[0] - oz[0]) / T, (ey[1] - oz[1]) / T, o0[0], o0[1]); c.drawImage(tv, 0, 0); c.restore();
}); }
const H3FREE = { anfiteatro: 1, cripta: 1, torrepietra: 1, torre: 1, mura: 1, palizzata: 1, cancello: 1, balista: 1 };
function drawBuilding(c, sc, b) {
  const vr0 = vRect(b); const [wx, wy] = WR(vr0[0], vr0[1]);
  if (b.hitT > 0) { c.save(); c.translate((Math.random() - .5) * 2, 0); }
  const mk3 = m3k(b); if (!G3.models[mk3]) need3d(mk3);
  const sk = G3.models[mk3] && G3.models[mk3].ready ? mk3 : bSprite(b);
  if (sk && G3.models[sk] && G3.models[sk].ready) {
    if (!BDEF[b.t].decor) { const p = plotCache(b.w, b.h); c.drawImage(p.cv, wx - p.ox, wy - p.oy, p.w, p.h); } else if (!DFIT[b.t]) { const [cx2, cy2] = W(b.x + b.w / 2, b.y + b.h / 2); c.fillStyle = 'rgba(0,0,0,0.2)'; c.beginPath(); c.ellipse(cx2, cy2, (b.w + b.h) * 13, (b.w + b.h) * 5.5, 0, 0, 7); c.fill(); } const ga = c.globalAlpha; if (b.ref && b.ref.end && b.ref.toLvl === 1) c.globalAlpha = 0.5; let k3 = sk, yaw = 0, fitm = 1;
    if (b.t === 'tronco') { const hh = (((b.x * 7 + b.y * 13) | 0) >>> 0) + (b.ref ? b.ref.id : 0); yaw = [-Math.PI / 4, 3 * Math.PI / 4, Math.PI / 4, -3 * Math.PI / 4][hh % 4] + ((hh >> 2) % 5 - 2) * 0.07; }
    if (b.t === 'balista') { need3d('balista_b'); need3d('balista_c'); fitm = 0.68; if (b.yawT != null) { let d = b.yawT - (b.yaw || 0); while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; b.yaw = (b.yaw || 0) + d * 0.18; } yaw = b.yaw || 0;
      const tf = b.fired != null ? sc.time - b.fired : 99; if (tf < 0.35 && G3.models.balista_c && G3.models.balista_c.ready) k3 = 'balista_c'; else if (tf < 1.4 && G3.models.balista_b && G3.models.balista_b.ready) k3 = 'balista_b'; }
    if (b.t === 'cancello' && M3D_FILES.has('cancello_aperto')) { need3d('cancello_aperto'); const om = G3.models.cancello_aperto; if (om && om.ready && sc.U.some(u => !u.dead && u.side === b.side && Math.hypot(u.x - (b.x + 1), u.y - (b.y + 1)) < 2.2)) k3 = 'cancello_aperto'; }
    const dfit = DFIT[b.t] && G3.models[k3] && G3.models[k3].m; if (dfit) { const mm = G3.models[k3].m, hz = Math.max(mm.size[0], mm.size[2]); fitm = DFIT[b.t].h ? DFIT[b.t].h * hz / Math.max(1e-6, mm.size[1]) / (b.w * 1.3) : DFIT[b.t].w / (b.w * 1.3); yaw = ((b.ref && b.ref.rot) || 0) * Math.PI / 2 + (DYAW_RND[b.t] ? ((b.id * 2654435761) >>> 0) % 628 / 100 : 0); }
    let fit3 = fitm * b.w * 1.3 * (b.t === 'mastio' ? (b.lvl <= 8 ? 1.25 + 0.03 * b.lvl : 1.49 + 0.014 * (b.lvl - 8)) : b.t === 'caserma' ? 0.82 : b.t === 'anfiteatro' ? 1.16 : b.t === 'falo' ? 0.8 : b.t === 'tronco' ? 0.55 : 1);
    // nessun edificio deve superare in altezza il Mastio: tetto all'altezza in base all'impronta
    if (b.t !== 'mastio' && !H3FREE[b.t] && b.w >= 2) { const mm = G3.models[k3].m, hNow = mm.size[1] * fit3 / Math.max(mm.size[0], mm.size[2]), hMax = 0.75 * b.w + 0.3; if (hNow > hMax) fit3 *= hMax / hNow; }
    const dark = (b.t === 'casa' || b.t === 'taverna') && sc.mode === 'village' && famine(); if (dark) c.filter = 'brightness(0.6) saturate(0.5)';
    g3draw(c, b, k3, fit3, yaw); c.globalAlpha = ga; if (dark) c.filter = 'none';
    if (CHIM3[b.t] && b.r3d && !b.dead && !b.ghost && sc.mode !== 'title' && !(dark)) { b.chimT = (b.chimT || 0) - 1 / 60; if (b.chimT <= 0) { b.chimT = 0.45 + Math.random() * 0.6; const [cxp, cyp] = CHIM3[b.t]; const r = b.r3d; sc.FX.push({ k: 'chim', x0: r[0] + r[2] * cxp, y0: r[1] + r[3] * cyp, t: 0, dur: 2.8, r: 3 + Math.random() * 2.5, dx: 5 + Math.random() * 7 }); } }
  } else if (sk && BATL_OK && BFR[sk]) {
    if (BDEF[b.t].decor) { const [cx, cy] = W(b.x + b.w / 2, b.y + b.h / 2); c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(cx, cy, (b.w + b.h) * 12, (b.w + b.h) * 6, 0, 0, 7); c.fill(); }
    else { const p = plotCache(b.w, b.h); c.drawImage(p.cv, wx - p.ox, wy - p.oy, p.w, p.h); }
    const r = bSpriteRect(b); const building = b.ref && b.ref.end && b.ref.toLvl === 1;
    if (building) c.globalAlpha = 0.5;
    drawSpriteBox(c, b);
    c.globalAlpha = 1;
    if (sk === 'fucina' || sk === 'casa' || sk === 'taverna') { b.chimT = (b.chimT || 0) - 1 / 60; if (b.chimT <= 0 && !b.dead && sc.mode !== 'title') { b.chimT = 0.5 + Math.random() * 0.6; const cx = sk === 'fucina' ? 0.73 : sk === 'casa' ? 0.68 : 0.7; const cy = sk === 'fucina' ? 0.06 : sk === 'casa' ? 0.22 : 0.12; sc.FX.push({ k: 'chim', x0: r[0] + r[2] * cx, y0: r[1] + r[3] * cy, t: 0, dur: 2.6, r: 3 + Math.random() * 2, dx: 4 + Math.random() * 6 }); } }
  } else {
    const e = bCache(b);
    const wk = BDEF[b.t].wall ? (b.lvl >= 2 ? 'mura' : 'palizzata') : null; if (wk && !G3.models[wk]) need3d(wk);
    if (wk && G3.models[wk] && G3.models[wk].ready) { const m = b.mask || 0; const segs = []; if ((m & 3) || !m) segs.push(['_wu', Math.PI / 4]); if (m & 12) segs.push(['_wv', 3 * Math.PI / 4]);
      for (const [kk, yw] of segs) { if (!b[kk]) b[kk] = { x: b.x, y: b.y, w: 1, h: 1 }; g3draw(c, b[kk], wk, 1.1, yw); }
      if (wk === 'mura' && (m & 3) && (m & 12) && (m & 3) !== 3 && (m & 12) !== 12) { if (!G3.models.torrepietra) need3d('torrepietra'); if (G3.models.torrepietra && G3.models.torrepietra.ready) { if (!b._tw) b._tw = { x: b.x, y: b.y, w: 1, h: 1 }; g3draw(c, b._tw, 'torrepietra', 1.15, 0); } } }
    else if (BDEF[b.t].wall || BDEF[b.t].moat) c.drawImage(e.cv, wx - e.ox, wy - e.oy, e.w, e.h);
    else { const q = ((ANG / (Math.PI / 2)) % 4 + 4) % 4, i = Math.floor(q), sm0 = Math.min(1, Math.max(0, (q - i - 0.38) / 0.24)), t = sm0 * sm0 * (3 - 2 * sm0); const ga = c.globalAlpha; const [cx] = W(b.x + b.w / 2, b.y + b.h / 2); const ox = cx - wx;
      for (const [fl, al] of [[i % 2, 1 - t], [(i + 1) % 2, t]]) { if (al < 0.01) continue; c.globalAlpha = ga * (al > 0.99 ? 1 : al); if (fl) { c.save(); c.translate(wx + ox, 0); c.scale(-1, 1); c.translate(-ox, 0); c.drawImage(e.cv, -e.ox, wy - e.oy, e.w, e.h); c.restore(); } else c.drawImage(e.cv, wx - e.ox, wy - e.oy, e.w, e.h); }
      c.globalAlpha = ga; }
    if (DANIM[b.t]) { const [cx, cy] = W(b.x + b.w / 2, b.y + b.h / 2); DANIM[b.t](c, b, cx, cy, sc.time); }
  }
  if (b.hitT > 0) c.restore();
  if (b.t === 'balista' && !(G3.models.balista && G3.models.balista.ready)) {
    const [cx, cy] = W(b.x + 1, b.y + 1); const firing = b.fireT > 0;
    const key = b.aim.b ? (firing ? 'balista.attackF' : 'balista.idleF') : (firing ? 'balista.attackB' : 'balista.idleB');
    sprDraw(c, key, cx, cy - 12, 0.42, b.aim.flip);
  } else if (b.t === 'torre') {
    const firing = b.fireT > 0; const key = 'guardiatorre.' + (firing ? 'attack' : 'idle') + (b.aim.b ? 'B' : 'F');
    if (BATL_OK && BFR.torre) { const r = bSpriteRect(b); sprDraw(c, key, r[0] + r[2] * 0.5, r[1] + r[3] * 0.53, 0.2, b.aim.flip); }
    else { const [cx, cy] = W(b.x + 0.5, b.y + 0.5); const h = 44 + b.lvl * 4; sprDraw(c, key, cx, cy - h + 2, 0.28, b.aim.flip); }
  } else if (b.t === 'cancello' && BATL_OK && BFR.cancello) {
    const firing = b.fireT > 0; const key = 'guardiatorre.' + (firing ? 'attack' : 'idle') + (b.aim.b ? 'B' : 'F'); const r = bSpriteRect(b);
    for (const fx of [0.18, 0.82]) sprDraw(c, key, r[0] + r[2] * fx, r[1] + r[3] * 0.2, 0.17, b.aim.flip);
  } else if (b.t === 'falo' && !(G3.models.falo && G3.models.falo.ready)) {
    const [cx, cy] = W(b.x + 0.5, b.y + 0.5);
    for (let i = 0; i < 3; i++) { const fl = Math.sin(sc.time * 12 + i * 2) * 2; c.fillStyle = ['#ffcf4a', '#ff8a2a', '#e8481a'][i]; c.beginPath(); c.moveTo(cx - 6 + i * 2, cy); c.quadraticCurveTo(cx - 3 + fl, cy - 16 + i * 4, cx + fl * 0.5, cy - 22 + i * 5); c.quadraticCurveTo(cx + 3 + fl, cy - 12 + i * 4, cx + 6 - i * 2, cy); c.fill(); }
  }
}
function drawHero3D(c, sc, u, wx, wy) {
  if (!G3.models[u.k]) need3d(u.k); if (!G3.models[u.k] || !G3.models[u.k].ready) return false;
  let a = 1, rot = 0; if (u.dead) { a = Math.max(0, 1 - Math.max(0, u.deadT - 4) / 3); if (a <= 0) return true; rot = Math.min(1, u.deadT / 0.5) * 1.35; }
  const back = u.face === 'B', yaw = back ? (u.flip ? 2.4 : 3.9) : (u.flip ? 0.75 : -0.75);
  const sp = g3sprite(u.k, 64, yaw, 0); if (!sp) return false;
  u.phase += (u.moving ? 1 : 0.15) * (1 / 60) * 4; const bob = u.moving && !u.dead ? Math.abs(Math.sin(u.phase * Math.PI * 1.1)) * 2.2 : Math.sin(u.phase) * 0.4;
  const lunge = !u.dead && u.atkT > 0 ? Math.sin(Math.min(1, u.atkT / 0.3) * Math.PI) * 4 : 0;
  if (!u.dead) { c.fillStyle = 'rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(wx, wy, 14, 6, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,215,100,0.85)'; c.lineWidth = 2; c.beginPath(); c.ellipse(wx, wy, 15, 7, 0, 0, 7); c.stroke(); }
  c.save(); c.globalAlpha = a; c.translate(wx + (u.flip ? -lunge : lunge), wy - bob); if (rot) c.rotate(u.flip ? -rot : rot); if (u.hitT > 0) c.filter = 'brightness(1.6)';
  c.drawImage(sp.cv, sp.x0, sp.y0, sp.w, sp.h); c.restore(); c.filter = 'none';
  if (u.gb > 0 && !u.dead) { c.strokeStyle = 'rgba(255,190,80,0.7)'; c.lineWidth = 1.5; c.beginPath(); c.arc(wx, wy - 34, 26, 0, 7); c.stroke(); }
  if (u.inv > 0) { c.strokeStyle = 'rgba(160,215,255,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.arc(wx, wy - 30, 24, 0, 7); c.stroke(); }
  return true;
}
const HPORT = {};
function heroPortrait(k) { if (HPORT[k]) return HPORT[k]; need3d(k); const sp = G3.models[k] && G3.models[k].ready ? g3sprite(k, 140, 0.5, 0) : null; if (!sp) return ''; const cv2 = document.createElement('canvas'); cv2.width = 120; cv2.height = 148; const s = Math.min(140 / sp.h, 116 / sp.w); cv2.getContext('2d').drawImage(sp.cv, (120 - sp.w * s) / 2, 148 - sp.h * s, sp.w * s, sp.h * s); return HPORT[k] = cv2.toDataURL(); }
// i personaggi di FEUDUM restano nascosti nel villaggio finché non arrivano gli sprite romani:
// si vedono solo quelli con un modello 3D romano (es. il Centurione). La logica (lavoro, caccia, visite) continua uguale.
const HIDE_FOLK = true;
const ROMAN3D = new Set(['templare']); // personaggi con modello 3D romano: si vedono sempre
const folkHidden = (sc, u) => HIDE_FOLK && sc && sc.mode === 'village' && !ROMAN3D.has(u.k) && !RUNIT[u.k];
function drawUnit(c, sc, u) { if (folkHidden(sc, u)) { if (u.vis && u.visLead) drawVisitorMark(c, sc, u); return; } drawUnit0(c, sc, u); if (u.vis) drawVisitorMark(c, sc, u); }
function drawUnit0(c, sc, u) {
  const [wx, wy] = W(u.x, u.y); if (u.k === 'carro') { if (!u.dead) drawCart(c, u, wx, wy); return; }
  if (u.climb) drawLadder(c, u);
  if (UDEF[u.k] && UDEF[u.k].siege) { if (u.dead) { const a = Math.max(0, 1 - u.deadT / 3); if (a <= 0) return; c.globalAlpha = a; } u.wph = (u.wph || 0) + (u.moving ? 0.08 : 0); const fire = u.atkT > 0 ? 1 - u.atkT / 0.6 : 0; const mk = UDEF[u.k].siege === 'ram' ? 'ariete3d' : 'catapulta3d'; if (!G3.models[mk]) need3d(mk); if (G3.models[mk] && G3.models[mk].ready) { const yaw = (u.face === 'B' ? (u.flip ? 2.4 : 3.9) : (u.flip ? 0.75 : -0.75)) + (UDEF[u.k].siege === 'ram' ? -Math.PI / 2 : 0); const yq = Math.round(yaw / 0.3927) * 0.3927; const mm = G3.models[mk].m, hp = Math.round((mk === 'ariete3d' ? 1.35 : 1.5) * mm.size[1] * ISO_H / Math.max(mm.size[0], mm.size[2])); const sp = g3sprite(mk, hp, yq, 0); const jolt = fire > 0 && fire < 1 ? Math.sin(fire * Math.PI) * (mk === 'ariete3d' ? 4 : 2.5) : 0; if (sp) c.drawImage(sp.cv, wx + sp.x0 + jolt * (u.flip ? -1 : 1), wy + sp.y0 - (mk === 'catapulta3d' ? jolt : 0), sp.w, sp.h); if (fire > 0.3 && fire < 0.5 && mk === 'catapulta3d') { c.fillStyle = 'rgba(200,190,170,0.5)'; c.beginPath(); c.arc(wx, wy - 40, 8, 0, 7); c.fill(); } } else drawSiegeAt(c, UDEF[u.k].siege === 'ram' ? 'ariete' : 'catapulta', wx, wy, u.flip, u.wph, fire > 0 && fire < 1 ? fire : 0); c.globalAlpha = 1; if (!u.dead && u.hp < u.maxhp) hpBar(c, wx, wy - 50, 34, u.hp / u.maxhp, '#7ccf6a'); return; }
  if (u.d.beast) { if (!BATL_OK || !BFR[u.k]) return; const fight = !u.dead && u.atkT > 0.32 - u.d.cd; const [f, w, h] = animFrame(u.k, u.moving && !u.dead && !fight, u.phase * 1.4, fight ? 'atk' : null, fight ? (0.32 - u.atkT) / (u.d.cd / 4) : 0);
    let a = 1, rot = 0; if (u.dead) { a = Math.max(0, 1 - Math.max(0, u.deadT - 4) / 3); if (a <= 0) return; rot = Math.min(1, u.deadT / 0.4) * 1.4; }
    u.phase += (u.moving ? 1 : 0.15) * (1 / 60) * 6; const bob = u.moving && !u.dead ? Math.abs(Math.sin(u.phase * 2)) * 0.8 : 0; const lunge = 0;
    if (!u.dead) { c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(wx, wy, w * 0.38, w * 0.11, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(200,50,40,0.55)'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(wx, wy, w * 0.42, w * 0.13, 0, 0, 7); c.stroke(); }
    c.save(); c.globalAlpha = a; c.translate(wx, wy - bob); if (u.flip) c.scale(-1, 1); c.translate(lunge, 0); if (rot) c.rotate(rot); if (u.hitT > 0) c.filter = 'brightness(1.6)';
    if (sc.night && !u.dead) { c.shadowColor = 'rgba(255,200,60,0.9)'; c.shadowBlur = 6; }
    c.drawImage(BATL, f[0], f[1], f[2], f[3], -w / 2, -h + 2, w, h); c.restore(); c.filter = 'none'; c.globalAlpha = 1; return; }
  if (u.d.model && drawHero3D(c, sc, u, wx, wy)) return;
  if (RUNIT[u.k] && RATL_OK && drawRoman(c, sc, u, wx, wy)) return;
  if (u.dead) { const a = Math.max(0, 1 - Math.max(0, u.deadT - 5) / 3); if (a <= 0) return; sprDraw(c, u.k + '.death', wx, wy + 4, uScale(u) * 0.95, u.flip, a * 0.95); return; }
  u.phase += (u.moving ? 1 : 0.15) * (1 / 60) * 4;
  const ring = u.side === 'A' ? (sc.mode === 'raid' ? 'rgba(200,50,40,0.55)' : 'rgba(70,120,230,0.55)') : u.side === 'D' ? (sc.mode === 'raid' ? 'rgba(70,120,230,0.55)' : 'rgba(200,50,40,0.55)') : null;
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(wx, wy, u.d.cav ? 15 : 9, u.d.cav ? 6 : 4.5, 0, 0, 7); c.fill();
  if (ring) { c.strokeStyle = ring; c.lineWidth = 1.6; c.beginPath(); c.ellipse(wx, wy, u.d.cav ? 15 : 10, u.d.cav ? 6.5 : 5, 0, 0, 7); c.stroke(); }
  if (u.hero) { c.strokeStyle = 'rgba(255,215,100,0.8)'; c.lineWidth = 2; c.beginPath(); c.ellipse(wx, wy, 13, 6.5, 0, 0, 7); c.stroke(); }
  const [key, flip] = unitFrame(u);
  const bob = u.moving ? Math.abs(Math.sin(u.phase * Math.PI * 1.1)) * 1.6 : 0;
  if (u.hitT > 0) c.filter = 'brightness(1.6)';
  sprDraw(c, key, wx, wy + 1 - bob, uScale(u), flip);
  if (u.hitT > 0) c.filter = 'none';
  if (u.inv > 0) { c.strokeStyle = 'rgba(160,215,255,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.arc(wx, wy - 26, 22, 0, 7); c.stroke(); }
}

// ================= GAME: village, battles, input, UI =================
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
let DPR = 1, VW = 0, VH = 0;
// ---- qualità grafica ----
const QUAL = { alta: { n: 'Alta', d: 'Tutto attivo: ombre, foreste piene, luci, nitidezza massima.', dpr: 2, sh: 1, tr: 1, fx: 1, fps: 60 }, media: { n: 'Media', d: 'Bilanciata per iPhone: un po\' meno nitidezza, foreste più leggere.', dpr: 1.5, sh: 1, tr: 0.7, fx: 0.7, fps: 60 }, bassa: { n: 'Bassa', d: 'Batteria e fluidità prima di tutto: niente ombre, meno alberi ed effetti, 30 fotogrammi al secondo.', dpr: 1, sh: 0, tr: 0.45, fx: 0.4, fps: 30 } };
const QQ = () => QUAL[SET.q] || QUAL[(innerWidth < 700 ? 'media' : 'alta')];
function setQual(k) { SET.q = k; saveSet(); resize(); for (const k2 in G3S) delete G3S[k2]; if (SC) for (const b of SC.B) { b.c3k = null; } toast('🖥️ Qualità grafica: ' + QUAL[k].n); openMenu('look'); }
function resize() { DPR = Math.min(QQ().dpr, window.devicePixelRatio || 1); VW = innerWidth; VH = innerHeight; cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR); cv.style.width = VW + 'px'; cv.style.height = VH + 'px'; }
const $ = s => document.querySelector(s);
const now = () => Date.now();
let GROUND_V = null, GROUND_E = null, GROUND_R = null;
let MODE = 'title';
let placing = null; // {t, x, y, w, h, move: bref}

// ---------- initial state ----------
function initialBuildings() {
  // città romana: l'Anfiteatro al centro della mappa, il Castrum dietro con la porta verso l'arena, caserma e horreum ai lati;
  // davanti all'arena la via con le Domus, il pozzo e il miliario; la villa rustica tra i campi, la falegnameria verso il bosco
  const L = [['anfiteatro', 13, 13], ['mastio', 7, 7], ['caserma', 3, 10], ['granaio', 11, 5], ['fattoria', 17, 5], ['capanna', 8, 20],
    ['casa', 15, 22], ['casa', 22, 15], ['stendardo', 11, 9], ['stendardo', 9, 11], ['lanterna', 22, 19], ['lanterna', 19, 22],
    ['pozzo', 20, 20], ['segnavia', 24, 24], ['anfora', 17, 23], ['anfora', 24, 15], ['carretto', 13, 6], ['cassafieno', 16, 8], ['cassafieno', 20, 8],
    ['botte', 10, 20], ['botte', 10, 22], ['aiuola', 18, 22], ['aiuola', 22, 18], ['aiuola', 21, 23], ['torre', 5, 5], ['torre', 25, 19]];
  return L.map(([t, x, y]) => ({ id: S.nextId++, t, x: x + OFF, y: y + OFF, lvl: 1, stock: 0, end: 0 }));
}
function startNew() { S = newState(); S.buildings = initialBuildings(); save(); }
function mastioRef() { return S.buildings.find(b => b.t === 'mastio'); }

// ---------- village scene ----------
function occupiedBy(x, y, w, h, ignore) {
  for (const b of S.buildings) { if (b === ignore) continue; const d = BDEF[b.t]; if (x < b.x + d.w && x + w > b.x && y < b.y + d.h && y + h > b.y) return b; }
  return null;
}
function canPlace(t, x, y, ignore) { const d = BDEF[t]; if (x < 3 || y < 3 || x + d.w > N - 3 || y + d.h > N - 3) return false; const wv = villageWater(); for (let yy = y; yy < y + d.h; yy++) for (let xx = x; xx < x + d.w; xx++) if (wv[yy * N + xx]) return false; return !occupiedBy(x, y, d.w, d.h, ignore); }
function buildVillage() {
  const sc = newScene('village'); villageSetup(sc);
  for (const r of S.buildings) { const b = mkBuilding(r.t, r.x, r.y, r.lvl, 'D', r); sc.B.push(b); }
  sceneIndex(sc);
  computePaths(sc);
  // workers
  const jobs = [];
  for (const b of sc.B) {
    if (b.t === 'capanna') jobs.push(['taglialegna', b, 'tree']);
    if (b.t === 'mercato') jobs.push(['cuoco', b, 'self']);
    if (b.t === 'chiesa' || b.t === 'municipio' || b.t === 'accademia') jobs.push(['infermiera', b, 'wander']);
    if (b.t === 'taverna' || b.t === 'fattoria') jobs.push(['cuoco', b, 'self']);
    if (b.t === 'fucina' || b.t === 'armeria' || b.t === 'caserma' || b.t === 'miniera' || b.t === 'cava') jobs.push(['fabbro', b, 'self']);
    if (b.t === 'infermeria' || b.t === 'mastio' || b.t === 'monastero') jobs.push(['infermiera', b, b.t === 'infermeria' ? 'self' : 'wander']);
  }
  for (const [k, home, kind] of jobs) {
    const [hx, hy] = frontTile(sc, home);
    const u = mkUnit('miliziano', 'V', hx + 0.5, hy + 0.5); u.k = k; u.d = { spd: 0.7, hp: 1, cd: 1, rng: 0 }; u.home = home; u.jk = kind; u.st = 'rest'; u.wt = Math.random() * 4; u.ai = workerAI; { const wr = workRec(home.ref ? home.ref.id : home.id, k); u.wrec = wr; u.d.spd = 0.7 * (1 + 0.1 * (wr.spd || 0)); }
    sc.U.push(u);
  }
  // idle soldiers in formation near first caserma
  const cas = sc.B.find(b => b.t === 'caserma');
  if (cas) {
    let i = 0; const list = [];
    for (const k of UNIT_ORDER) for (let n = 0; n < (S.army[k] || 0) && list.length < 14; n++) list.push(k);
    const vix = {};
    for (const k of list) {
      const vi = vix[k] = (vix[k] == null ? 0 : vix[k] + 1);
      const x = cas.x + 3.4 + (i % 4) * 0.55, y = cas.y + 0.4 + Math.floor(i / 4) * 0.6; i++;
      if (bAt(sc, Math.floor(x), Math.floor(y))) continue;
      const u = mkUnit(k, 'V', x, y); u.vi = vi; u.face = 'F'; u.flip = false; u.ai = soldierAI; sc.U.push(u);
    }
  }
  if (S && S.hunts && S.fauna) for (const id of S.hunts) { const a = S.fauna.find(f => f.id === id && f.dying == null); if (a) { a.huntBy = 1; hunterSpawn(sc, a); } }
  if (S && !S.creative) { spawnKids(sc); if (S.fest && now() < S.fest.end) setTimeout(festFX, 0); }
  if (S && S.mastio >= HDEF.generale.lv && !S.sandbox) { const m = sc.B.find(b => b.t === 'mastio'); if (m) { const [fx, fy] = frontTile(sc, m); const u = mkUnit('generale', 'V', fx + 1.2, fy + 0.6, true); u.face = 'F'; u.flip = true; u.ai = soldierAI; sc.U.push(u); } }
  if (S && !S.sandbox) { const m = sc.B.find(b => b.t === 'mastio'); if (m) { const u = mkUnit('templare', 'V', m.x + m.w + 0.15, m.y + m.h + 0.75, true); u.face = 'F'; u.flip = false; u.ai = soldierAI; sc.U.push(u); } }
  return sc;
}
function villageSetup(sc) {
  sc.water.set(villageWater()); sc.decals = [RIVER_AT, POND_AT, ...EXTRA_PONDS];
  if (!GROUND_V || (GROUND_V.stale && EATL_OK && TEX_OK)) GROUND_V = paintGround(false, sc.decals, 42); sc.ground = GROUND_V;
  addForests(sc, 7);
  for (const [x, y] of [[28.6, 19.4], [5.2, 6.4], [24.5, 3.5]].map(p => [p[0] + OFF, p[1] + OFF])) if (!isWater(sc, x | 0, y | 0)) sc.rocks.push({ x, y, s: 7, big: true });
  const rem = new Set(S && S.removed || []); sc.trees = sc.trees.filter(t => !rem.has(natKey(t))); sc.rocks = sc.rocks.filter(r => !rem.has(natKey(r)));
}
// ---- alberi e rocce del paesaggio: tutti rimovibili ----
function natKey(o) { return (o.k != null ? 'T' : o.big ? 'R' : 'r') + Math.round(o.x * 10) + ',' + Math.round(o.y * 10); }
function natInfo(o) {
  if (o.k != null && bareKind(o)) return bareKind(o) === 'olmo' ? { n: 'Olmo Spoglio', icon: '🌳', desc: 'Vecchio olmo senza foglie, rami fitti e radici nodose.', cost: { cibo: 12 }, gain: { legno: 40 }, t: 10 } : { n: 'Albero Morto', icon: '🪵', desc: 'Albero secco e contorto. Si abbatte in fretta: legna da ardere.', cost: { cibo: 5 }, gain: { legno: 25 }, t: 6 };
  if (o.k != null) { const oak = (o.k % 6) >= 3; return oak ? { n: 'Quercia', icon: '🌳', desc: 'Quercia secolare della Pannonia. Abbatterla dà molto legname.', cost: { cibo: 15 }, gain: { legno: 55 }, t: 12 } : { n: 'Abete', icon: '🌲', desc: 'Abete della Selva Pannonica. Legno dritto e resinoso.', cost: { cibo: 10 }, gain: { legno: 35 }, t: 8 }; }
  return o.big ? { n: 'Masso', icon: '🪨', desc: 'Grosso masso muschioso. Spaccarlo richiede tempo e paga in pietra.', cost: { oro: 20 }, gain: { pietra: 50 }, t: 15 } : { n: 'Sasso', icon: '🪨', desc: 'Sassi sparsi nel prato.', cost: { cibo: 5 }, gain: { pietra: 12 }, t: 4 };
}
function pickNature(sx, sy, tx, ty) {
  let best = null, bd = 0.75;
  for (const o of SC.trees.concat(SC.rocks)) { const d = Math.hypot(o.x - tx, o.y - ty); if (d < bd) { bd = d; best = o; } }
  if (best) return best;
  const wx = (sx - VW / 2) / cam.z + cam.x, wy = (sy - VH / 2) / cam.z + cam.y; let key = -1e9;
  for (const o of SC.trees) { const [bx, by] = W(o.x, o.y); const w = (((o.k % 6) >= 3) ? 96 : 66) * o.s * 0.7, h = 150 * o.s; if (wx > bx - w / 2 && wx < bx + w / 2 && wy > by - h && wy < by) { const p = rotP(o.x, o.y); if (p[0] + p[1] > key) { key = p[0] + p[1]; best = o; } } }
  return best;
}
function openNature(o) {
  const n = natInfo(o); SC.selN = o; SC.sel = null;
  const cs = Object.keys(n.cost).length ? costStr(n.cost) : 'gratis'; const wk = workOn('nat', natKey(o));
  openSheet(`${n.icon} ${n.n}`, `<p class="desc">${n.desc}</p><div class="acts">${wk ? `<button class="btn dis">🪓 In rimozione… ${fmtT(wk.end - now())}</button>` : `<button class="btn" onclick="removeNature()">✖ Rimuovi<small>${cs} · ⏱ ${n.t}s → ${Object.keys(n.gain).map(k => ICO(k) + ' +' + n.gain[k]).join(' ')}</small></button>`}</div>`, 'n');
}
function removeNature() {
  const o = SC.selN; if (!o) return; const n = natInfo(o); const key = natKey(o);
  if (workOn('nat', key)) return;
  if (!canPay(n.cost)) { toast('Risorse insufficienti'); return; }
  if (timedOn() && crewBusy() >= MAX_CREW) { toast(`Le squadre di sgombero sono occupate (max ${MAX_CREW})`); return; }
  pay(n.cost); addWork({ kind: 'nat', key, x: o.x, y: o.y, tree: o.k != null, gain: n.gain, dur: n.t });
  closeSheet(); sfx('tock'); save(); updateHUD();
}
// ---- demolizione edifici ----
function demolish(id) {
  const i = S.buildings.findIndex(b => b.id === id); if (i < 0) return; const r = S.buildings[i], d = BDEF[r.t];
  if (r.t === 'mastio') return;
  if (workOn('demo', r.id) || r.end) { toast(r.end ? 'Prima finisci i lavori in corso' : 'Demolizione già in corso'); return; }
  const dc = { cibo: 10 * r.lvl }, dt2 = Math.max(4, Math.round((d.t || 4) * 0.6 * r.lvl));
  if (!demolish.ok) { askYes(`Demolire ${d.n}?<br><small>Costa ${dc.cibo} cibo e ${fmtT(dt2 * 1000)} di lavoro, recuperi il 30% del costo.</small>`, () => { demolish.ok = 1; demolish(id); demolish.ok = 0; }, 'Demolisci'); return; }
  if (!canPay(dc)) { toast('Risorse insufficienti'); return; }
  if (timedOn() && crewBusy() >= MAX_CREW) { toast(`Le squadre di sgombero sono occupate (max ${MAX_CREW})`); return; }
  const base = d.cost ? scaleCost(d.cost, r.lvl) : {}; const gain = {}; for (const k in base) gain[k] = Math.floor(base[k] * 0.3);
  pay(dc); r.demo = 1; addWork({ kind: 'demo', key: r.id, x: r.x + d.w / 2, y: r.y + d.h / 2, w: d.w, h: d.h, gain, dur: dt2 });
  closeSheet(); sfx('tock'); save(); updateHUD();
}
// foreste fitte stile RTS: una fascia di bosco ai bordi dal profilo irregolare e qualche macchia isolata, prati puliti al centro
function addForests(sc, seed) {
  const R = rng(seed * 13 + 1), nA = makeNoise(seed * 5 + 3), nB = makeNoise(seed * 5 + 4), nC = makeNoise(seed * 5 + 9), c0 = N / 2;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const e = Math.min(x, y, N - 1 - x, N - 1 - y), dc = Math.hypot(x + .5 - c0, y + .5 - c0);
    const band = 6 + nA(x / 9, y / 9, 3) * 9; // spessore del bosco ai bordi: 6..15 caselle
    const clump = dc > 21 && nB(x / 7, y / 7, 3) > 0.64; // macchie di bosco nel prato esterno
    let p = e < band ? (e < band - 2 ? 0.62 : 0.32) : clump ? 0.55 : dc > 18 ? 0.004 : 0;
    if (!p || isWater(sc, x, y) || isWater(sc, x - 1, y) || isWater(sc, x, y - 1) || isWater(sc, x + 1, y) || isWater(sc, x, y + 1)) continue;
    if (R() < p) { const oak = nC(x / 14, y / 14, 2) > 0.52; sc.trees.push({ x: x + 0.15 + R() * 0.7, y: y + 0.15 + R() * 0.7, k: (oak ? 3 : 0) + ((R() * 3) | 0), s: 0.85 + R() * 0.4 }); }
    else if (e >= band && dc > 14 && R() < 0.003) sc.rocks.push({ x: x + 0.5, y: y + 0.5, s: (R() * 1000) | 0 });
  }
}
function addGroves(sc, seed, minD) {
  const R = rng(seed * 31 + 5); const cx = N / 2;
  for (let g = 0; g < 14; g++) {
    const a = R() * 6.283, d = minD + R() * (N / 2 - minD - 3); const gx = cx + Math.cos(a) * d, gy = cx + Math.sin(a) * d; const n = 3 + ((R() * 6) | 0), oak = R() < 0.5;
    for (let i = 0; i < n; i++) { const x = gx + (R() - .5) * 3.5, y = gy + (R() - .5) * 3.5; if (x < 3 || y < 3 || x > N - 3 || y > N - 3) continue; if (isWater(sc, x | 0, y | 0) || isWater(sc, (x | 0) + 1, y | 0) || isWater(sc, (x | 0) - 1, y | 0) || isWater(sc, x | 0, (y | 0) + 1) || isWater(sc, x | 0, (y | 0) - 1) || bAt(sc, x | 0, y | 0) || (S && S.buildings && sc.mode !== 'attack' && occupiedBy(x | 0, y | 0, 1, 1))) continue; sc.trees.push({ x, y, k: (oak ? 3 : 0) + ((R() * 3) | 0), s: 0.85 + R() * 0.4 }); }
  }
}
function frontTile(sc, b) {
  const cand = [];
  for (let x = b.x - 1; x <= b.x + b.w; x++) cand.push([x, b.y + b.h]);
  for (let y = b.y - 1; y <= b.y + b.h; y++) cand.push([b.x + b.w, y]);
  for (let x = b.x - 1; x <= b.x + b.w; x++) cand.push([x, b.y - 1]);
  for (let y = b.y; y < b.y + b.h; y++) cand.push([b.x - 1, y]);
  for (const [x, y] of cand) if (inMap(x, y) && !bAt(sc, x, y) && !isWater(sc, x, y)) return [x, y];
  return [b.x + b.w, b.y + b.h];
}
function villagerCost(sc) { const G = sc.pathG; return (x, y) => { if (sc.water[y * N + x]) return Infinity; const b = bAt(sc, x, y); const on = G && G[y * N + x]; if (!b) return on ? 1 : 12; const d = BDEF[b.t]; if (d.wall) return on ? 1.5 : 14; if (d.decor) return on ? 1 : 12; return Infinity; }; }
function followPath(sc, u, dt) {
  if (!u.path || u.pi >= u.path.length) return true;
  const [px, py] = u.path[u.pi];
  const dx = px + 0.5 - u.x, dy = py + 0.5 - u.y, d = Math.hypot(dx, dy), sp = u.d.spd * dt;
  if (d <= sp) { u.x = px + 0.5; u.y = py + 0.5; u.pi++; } else { u.x += dx / d * sp; u.y += dy / d * sp; }
  u.moving = true; setFace(u, dx, dy); return u.pi >= u.path.length;
}
function workerAI(sc, u, dt) {
  u.working = false;
  if (u.st === 'rest') { u.wt -= dt; if (u.wt <= 0) { pickWork(sc, u); } }
  else if (u.st === 'go') { if (followPath(sc, u, dt)) { u.st = 'work'; u.wt = 5 + Math.random() * 6; if (u.fx != null) setFace(u, u.fx - u.x, u.fy - u.y); } }
  else if (u.st === 'work') { u.working = true; u.wt -= dt; u.phase += dt * 0.6; if (u.wt <= 0) { const [hx, hy] = frontTile(sc, u.home); u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => x === hx && y === hy, villagerCost(sc), hx, hy, 2500); u.pi = 0; u.st = 'back'; } }
  else if (u.st === 'back') { if (followPath(sc, u, dt)) { u.st = 'rest'; u.wt = 2 + Math.random() * 4; } }
}
function pickWork(sc, u) {
  let tx, ty;
  if (S && S.fest && now() < S.fest.end && Math.random() < 0.8) { [tx, ty] = festSpot(u); u.fx = S.fest.x; u.fy = S.fest.y; }
  else if (u.jk === 'tree') { let best = null, bd = 1e9; for (const t of sc.trees) { const e = Math.min(t.x, t.y, N - t.x, N - t.y); if (e < 2.2) continue; const d = Math.hypot(t.x - u.x, t.y - u.y) + Math.random() * 3; if (d < bd) { bd = d; best = t; } } if (best) { tx = Math.floor(best.x + (best.x < N / 2 ? 1 : -1)); ty = Math.floor(best.y); u.fx = best.x; u.fy = best.y; } }
  else if (u.jk === 'self') { const [x, y] = frontTile(sc, u.home); tx = x; ty = y; u.fx = u.home.x + u.home.w / 2; u.fy = u.home.y + u.home.h / 2; }
  else { const bs = sc.B.filter(b => !BDEF[b.t].wall && !BDEF[b.t].decor); const b = bs[(Math.random() * bs.length) | 0]; [tx, ty] = frontTile(sc, b); u.fx = b.x + b.w / 2; u.fy = b.y + b.h / 2; }
  if (tx == null || !inMap(tx, ty) || bAt(sc, tx, ty) || isWater(sc, tx, ty)) { u.wt = 3; return; }
  u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => x === tx && y === ty, villagerCost(sc), tx, ty, 2500); u.pi = 0;
  u.st = u.path ? 'go' : 'rest'; if (!u.path) u.wt = 4;
}
function soldierAI(sc, u, dt) { u.phase += dt * 0.2; if (Math.random() < dt * 0.05) u.flip = !u.flip; }

// ---------- economy tick ----------
function rateOf(r) { const d = BDEF[r.t]; const m = DF().prod * prestigeMult() * umoreMult() * workMult(r) * seasonMod(resOf(r)); if (r.t === 'mastio') return 6 * r.lvl * m; return d.prod ? d.prod[1] * r.lvl * m : 0; }
function resOf(r) { return r.t === 'mastio' ? 'oro' : (BDEF[r.t].prod || [])[0]; }
function stockCap(r) { const rt = rateOf(r); return r.t === 'monastero' ? 4 * r.lvl : Math.max(30, Math.round(rt * Math.min(180, 20 + 10 * r.lvl))); }
let accT = 0, saveT = 0;
function economy(dt) {
  worksTick(); wxTick();
  const t = now();
  let changed = false;
  for (const r of S.buildings) {
    if (r.end && t >= r.end) {
      r.end = 0; r.lvl = r.toLvl || r.lvl; r.toLvl = 0; changed = true;
      if (r.t === 'mastio') { S.mastio = r.lvl; prefetchEra(); if (ERAI(r.lvl) !== ERAI(r.lvl - 1)) setTimeout(() => { faunaFill(true); toast(ERAI(r.lvl) === 2 ? '🐖 I maiali bradi spariscono dai boschi' : ERAI(r.lvl) === 3 ? '🦌 Cervi e orsi scendono nella Provincia' : '🐺 Nuove bestie popolano la Provincia'); }, 2500); toast(`🏰 Castrum livello ${r.lvl}! ${r.lvl === 5 ? 'Inizia l\'Età della Legione!' : ''}`); sfx('bell'); refreshTargets(true); }
      else if (!BDEF[r.t].wall && !BDEF[r.t].decor) { toast(`🔨 ${BDEF[r.t].n} completato (liv. ${r.lvl})`); sfx('build'); } else if (Math.random() < 0.3) sfx('tock');
    }
    if (!r.end && resOf(r)) { r.stock = Math.min(stockCap(r), (r.stock || 0) + rateOf(r) * dt / 60); }
  }
  // training queue
  if (S.queue.length) {
    const q = S.queue[0]; q.left = (q.left == null ? UDEF[q.k].t * 4 * PACE() : q.left) - dt;
    if (q.left <= 0) { S.queue.shift(); S.army[q.k] = (S.army[q.k] || 0) + 1; if (!S.queue.length) toast('⚔️ Addestramento completato'); if ($('#sheet').dataset.p === 'army') openArmy(); }
  }
  if (changed && MODE === 'village') { const sel = SC.sel && SC.sel.ref; SC = buildVillage(); if (sel) SC.sel = SC.B.find(b => b.ref === sel) || null; refreshSheet(); }
  if (MODE === 'village' && SC) for (const b of SC.B) { const r = b.ref; if (!r) continue; const res = resOf(r); b.bubble = (res && r.stock >= Math.max(1, stockCap(r) * 0.15) && !r.end) ? RICON[res] : null; b.bubbleK = res; }
}
function buildVillageUnitsOnly() { if (MODE !== 'village') return; const sel = SC.sel && SC.sel.ref; SC = buildVillage(); if (sel) SC.sel = SC.B.find(b => b.ref === sel) || null; }
function collect(r) {
  const res = resOf(r); if (!res) return false; const v = Math.floor(r.stock); if (v < 1) return false;
  const got = addRes(res, v); r.stock -= v; const bon = BDEF[r.t].bonus; let bonTxt = ''; if (bon) for (const k in bon) { const gb = addRes(k, Math.floor(v * bon[k])); if (gb) bonTxt += ` +${gb} ${ICO(k)}`; }
  const b = SC.B.find(b => b.ref === r); if (b) { floatText(SC, b.x + b.w / 2, b.y + b.h / 2, got > 0 ? `+${got} ${RICON[res]}${bonTxt}` : 'Magazzini pieni!', got > 0 ? '#ffe9a6' : '#f99', 1.3); }
  S.collects = (S.collects || 0) + 1; sfx('coin'); updateHUD(); return true;
}
function offlineCatchup() {
  const el = Math.min(28800, Math.max(0, (now() - (S.last || now())) / 1000));
  if (el > 5) { for (const r of S.buildings) if (!r.end && resOf(r)) r.stock = Math.min(stockCap(r), (r.stock || 0) + rateOf(r) * el / 60); let left = el; while (S.queue.length && left > 0) { const q = S.queue[0]; const need = q.left == null ? UDEF[q.k].t * 4 * PACE() : q.left; if (left >= need) { left -= need; S.queue.shift(); S.army[q.k] = (S.army[q.k] || 0) + 1; } else { q.left = need - left; left = 0; } } }
}

// ---------- enemy generation ----------
const TNAMES = [['Accampamento dei Barbari', 'nella Selva Pannonica'], ['Villaggio di Re Gaiobomaro', 'sulle rive del Danubio'], ['Torre del mercante Sabino', 'al porto di Aquincum'], ['Santuario fortificato', 'dei sacerdoti di Mitra'], ['Campo dei Iazigi', 'nella pianura del Tibisco'], ['Vicus di Brigetio', 'tra le vigne'], ['Castellum del Prefetto', 'di Poetovio'], ['Covo dei Costoboci', 'nella palude'], ['Fortezza di Vindobona', 'sopra il fiume']];
function refreshTargets(force) {
  if (S.targets && !force) return; const wars = (S.targets || []).filter(t => t.fid != null);
  const base = Math.max(1, S.mastio - 1 + Math.floor(S.wins / 4) * 0);
  const pool = TNAMES.slice().sort(() => Math.random() - 0.5); S.targets = [-1, 0, 1].map((k, i) => { const d = Math.max(1, Math.min(10, base + k + (i === 2 ? 1 : 0))); const nm = pool[i % pool.length]; return { d, name: nm[0], where: nm[1], seed: (Math.random() * 1e9) | 0 }; }); S.targets = wars.concat(S.targets);
}
function lootPool(d) { const m = DF().loot; const o = { cibo: 160 + 140 * d, legno: 180 + 150 * d, oro: 100 + 120 * d, pietra: d >= 3 ? 50 * d : 0, ferro: d >= 2 ? 35 * d : 0 }; for (const k in o) o[k] = Math.round(o[k] * m); return o; }
function genEnemy(tg) {
  const d = tg.d, R = rng(tg.seed);
  const sc = newScene('attack');
  if (R() < 0.7) { const sp = [[3, 3], [N - 10, 3], [3, N - 11], [N - 10, N - 11]][(R() * 4) | 0]; const pd = { k: 'lago', x: sp[0], y: sp[1], w: 7, h: 8 }; stampMask(sc.water, EMASK.pond.mask, sp[0], sp[1]); sc.decals.push(pd); }
  sc.ground = paintGround(true, sc.decals, 99 + (tg.seed % 50));
  addForests(sc, tg.seed % 1000);
  for (let i = 0; i < 4; i++) { const x = 3.5 + R() * (N - 7), y = 3.5 + R() * (N - 7); if (Math.hypot(x - MCX, y - MCX) > 9 && !isWater(sc, x | 0, y | 0)) sc.rocks.push({ x, y, s: 7, big: true }); }
  const c = N / 2 - 1; const add = (t, x, y, lvl) => { const dd = BDEF[t]; for (let yy = y; yy < y + dd.h; yy++) for (let xx = x; xx < x + dd.w; xx++) if (!inMap(xx, yy) || xx < 3 || yy < 3 || xx >= N - 3 || yy >= N - 3 || bAt(sc, xx, yy) || sc.water[yy * N + xx]) return null; const b = mkBuilding(t, x, y, lvl, 'D'); b.hp = Math.round(b.hp * DF().ehp); b.maxhp = b.hp; sc.B.push(b); sceneIndex(sc); return b; };
  const rl = Math.min(8, 1 + Math.floor(d * 0.75));
  add('mastio', c - 1, c - 1, rl);
  const r = d <= 2 ? 3 : d <= 5 ? 4 : 5; const wl = d >= 6 ? 2 : 1;
  sc.props = []; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + R() * 0.4, rr = r + 3 + R() * 1.5; const x = c + 0.5 + Math.cos(a) * rr, y = c + 0.5 + Math.sin(a) * rr; if (!isWater(sc, x | 0, y | 0)) sc.props.push({ x, y, yaw: a + Math.PI / 2, h: 104 + R() * 16 }); }
  // walls ring
  const gaps = d <= 2 ? 0.45 : d <= 4 ? 0.12 : 0;
  for (let i = -r; i <= r; i++) for (const [x, y] of [[c + i, c - r], [c + i, c + r + 1], [c - r, c + i], [c + r + 1, c + i]]) { if (R() < gaps) continue; add('muro', x, y, wl); }
  add('muro', c + r + 1, c + r + 1, wl); add('muro', c + r + 1, c - r, wl);
  // inner defenses
  const nT = Math.min(4, 1 + Math.floor(d / 2)); const corners = [[c - r + 1, c - r + 1], [c + r - 1, c + r - 1], [c + r - 1, c - r + 1], [c - r + 1, c + r - 1]];
  for (let i = 0; i < nT; i++) add('torre', corners[i][0], corners[i][1], Math.min(4, 1 + Math.floor(d / 3)));
  const nB = d >= 3 ? Math.min(3, Math.floor((d - 1) / 2)) : 0; const bsp = [[c + 2, c - 1], [c - 3, c - 1], [c - 1, c + 2], [c - 1, c - 3]];
  for (let i = 0; i < nB; i++) add('balista', bsp[i][0], bsp[i][1], Math.min(3, 1 + Math.floor(d / 4)));
  if (d >= 2) { add('bottino', c + 2, c + 2, 1) || add('bottino', c - 3, c + 2, 1); }
  // outside camp
  const outs = d <= 2 ? ['tenda', 'capanno', 'tenda', 'bottino', 'tenda', 'falo', 'casa', 'fattoria'] : ['tenda', 'casa', 'taverna', 'bottino', 'casa', 'fucina', 'falo', 'granaio', 'fattoria', 'capanna', 'mercato', 'chiesa', 'municipio', 'scuderia', 'armeria', 'infermeria'];
  const nO = 4 + Math.min(6, d);
  for (let i = 0, tries = 0; i < nO && tries < 300; tries++) { const t = outs[(R() * outs.length) | 0]; const ang = R() * 6.283, rr = r + 2.5 + R() * 3.5; const x = Math.round(c + Math.cos(ang) * rr), y = Math.round(c + Math.sin(ang) * rr); if (add(t, x, y, Math.min(3, 1 + (d >> 2)))) i++; }
  for (let i = 0; i < 2; i++) add('falo', c + (i ? -2 : 1), c + (i ? 1 : -2), 1);
  for (let i = 0, tries = 0; i < 6 && tries < 80; tries++) { const t = NATURE[(R() * NATURE.length) | 0]; const x = 3 + ((R() * (N - 7)) | 0), y = 3 + ((R() * (N - 7)) | 0); if (Math.hypot(x - c, y - c) > r + 2 && add(t, x, y, 1)) i++; }
  // loot
  const pool = lootPool(d); const wt = b => ({ mastio: 3, bottino: 3, tenda: 1, capanno: 1.5, granaio: 2, fattoria: 1, torre: 0.3, balista: 0.4, casa: 1.2, taverna: 2, mercato: 2.5, municipio: 3, chiesa: 1.5, scuderia: 1.2, miniera: 1.5, fucina: 1.5, armeria: 1.5, infermeria: 1, capanna: 1.2 })[b.t] || 0;
  const tot = sc.B.reduce((s, b) => s + wt(b), 0);
  for (const b of sc.B) { const w = wt(b); for (const k in pool) b.loot[k] = Math.round(pool[k] * w / tot); }
  // defenders
  const roster = ENEMY_UNITS.slice(0, Math.min(ENEMY_UNITS.length, 2 + Math.floor(d / 1.5)));
  const nD = Math.max(1, Math.round((2 + d) * DF().def));
  for (let i = 0; i < nD; i++) { const k = roster[(R() * roster.length) | 0]; const a = R() * 6.28, rr = 1.8 + R() * (r - 1.5); let x = c + 0.5 + Math.cos(a) * rr, y = c + 0.5 + Math.sin(a) * rr; if (bAt(sc, Math.floor(x), Math.floor(y))) { x = c + 0.5 + Math.cos(a) * (r - 0.5); y = c + 0.5 + Math.sin(a) * (r - 0.5); } if (bAt(sc, Math.floor(x), Math.floor(y)) || isWater(sc, Math.floor(x), Math.floor(y))) continue; const u = mkUnit(k, 'D', x, y); u.guardR = 4.5; u.leash = 9; u.hp *= DF().ehp; u.maxhp *= DF().ehp; u.dm = DF().edmg; sc.U.push(u); }
  sc.countable = sc.B.filter(b => !BDEF[b.t].wall && !BDEF[b.t].decor).length;
  return sc;
}
function buildZone(sc) {
  const f = new Uint8Array(N * N);
  for (const b of sc.B) { if (b.dead || BDEF[b.t].decor) continue; for (let y = b.y - 2; y < b.y + b.h + 2; y++) for (let x = b.x - 2; x < b.x + b.w + 2; x++) if (inMap(x, y)) f[y * N + x] = 1; }
  sc.zone = f;
  for (let i = 0; i < N * N; i++) if (sc.water[i]) f[i] = 2;
  const cvs = sc.zoneCv || document.createElement('canvas'); cvs.width = N * 8; cvs.height = N * 8;
  const c = cvs.getContext('2d'); c.clearRect(0, 0, cvs.width, cvs.height);
  c.fillStyle = 'rgba(190,30,20,0.2)'; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (f[y * N + x] === 1) c.fillRect(x * 8, y * 8, 8, 8);
  c.fillStyle = 'rgba(255,70,50,0.85)'; const zz = (x, y) => inMap(x, y) && f[y * N + x] === 1; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (zz(x, y)) { if (!zz(x - 1, y)) c.fillRect(x * 8, y * 8, 1.6, 8); if (!zz(x + 1, y)) c.fillRect(x * 8 + 6.4, y * 8, 1.6, 8); if (!zz(x, y - 1)) c.fillRect(x * 8, y * 8, 8, 1.6); if (!zz(x, y + 1)) c.fillRect(x * 8, y * 8 + 6.4, 8, 1.6); }
  sc.zoneCv = cvs;
}

// ================= BATTAGLIE 2: ordini, impatto, assedio nel villaggio del regno =================
const ORDERS = { attack: [['free', '⚔', 'Libera', 'Ognuno attacca ciò che ha vicino'], ['towers', '🗼', 'Alle torri', 'La fanteria punta torri e baliste'], ['hero', '🛡', 'Con l\'eroe', 'Tutti seguono e proteggono l\'eroe']],
  raid: [['guard', '🏰', 'In difesa', 'Ognuno difende il suo posto'], ['charge', '⚔', 'Carica', 'Tutti all\'assalto dei predoni'], ['hero', '🛡', 'Con l\'eroe', 'Tutti si stringono attorno all\'eroe']] };
function renderOrders() { const el = $('#bord'); if (!el || !SC) return; const list = ORDERS[MODE === 'raid' ? 'raid' : 'attack']; const cur = SC.order || list[0][0];
  el.innerHTML = list.map(([k, ic, n, d]) => `<button class="${cur === k ? 'on' : ''}" title="${d}" onclick="setOrder('${k}')"><span>${ic}</span>${n}</button>`).join(''); }
function setOrder(k) { if (!SC) return; SC.order = k; sfx('horn'); const o = ORDERS[MODE === 'raid' ? 'raid' : 'attack'].find(x => x[0] === k); toast(`${o[1]} Ordine: ${o[3]}`); for (const u of SC.U) if (u.pl && !u.dead) { u.rt = 0; u.follow = null; if (k !== 'hero' && MODE === 'raid' && u.home0) u.post = { ...u.home0 }; } renderOrders(); }
// --- impatto: scossa e macerie ---
const SHAKE = { a: 0 };
function shake(a) { SHAKE.a = Math.min(14, Math.max(SHAKE.a, a)); }
function debris(sc, b) { const cols = BDEF[b.t].wall ? ['#7d7468', '#5c5248', '#8b6b47'] : ['#6b4e2e', '#8a6a42', '#7d7468', '#3e2c1a', '#a08356'];
  for (let i = 0; i < 26; i++) { const a = Math.random() * 6.283, v = 0.6 + Math.random() * 1.8; sc.FX.push({ k: 'deb', x: b.x + b.w / 2 + (Math.random() - .5) * b.w * 0.6, y: b.y + b.h / 2 + (Math.random() - .5) * b.h * 0.6, z: 10 + Math.random() * 30, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vz: 40 + Math.random() * 70, s: 2 + Math.random() * 4, rot: Math.random() * 6, col: cols[(Math.random() * cols.length) | 0], t: 0, dur: 1.6 + Math.random() * 0.8 }); } }
function debrisUpd(f, dt) { if (f.z > 0) { f.x += f.vx * dt; f.y += f.vy * dt; f.vz -= 220 * dt; f.z += f.vz * dt; f.rot += dt * 9; if (f.z <= 0) { f.z = 0; f.vx *= 0.2; f.vy *= 0.2; } } }
// --- assedio dentro il villaggio di un regno visitato ---
function genRealmSiege(tg) {
  const r = realms()[tg.rid]; const sc = buildRealmScene(r); sc.mode = 'attack'; sc.U = []; sc.realmSiege = true;
  for (const b of sc.B) { b.hp = Math.round(b.hp * DF().ehp); b.maxhp = b.hp; }
  const d = tg.d; const pool = lootPool(d); const wt = b => ({ mastio: 3, bottino: 3, granaio: 2, fattoria: 1, torre: 0.3, balista: 0.4, casa: 1.2, taverna: 2, mercato: 2.5, municipio: 3, chiesa: 1.5, scuderia: 1.2, miniera: 1.5, fucina: 1.5, armeria: 1.5, infermeria: 1, capanna: 1.2, tesoreria: 3, cava: 1.5 })[b.t] || 0;
  const tot = sc.B.reduce((s, b) => s + wt(b), 0) || 1; for (const b of sc.B) { const w = wt(b); for (const k in pool) b.loot[k] = Math.round(pool[k] * w / tot); }
  const m = sc.B.find(b => b.t === 'mastio'); const roster = ENEMY_UNITS.slice(0, Math.min(ENEMY_UNITS.length, 2 + Math.floor(d / 1.5))); const nD = Math.max(2, Math.round((3 + d * 1.3) * DF().def)); const R = rng(r.seed + 5);
  for (let i = 0, tries = 0; i < nD && tries < 200; tries++) { const a = R() * 6.28, rr = 2 + R() * 7; const x = m.x + 1.5 + Math.cos(a) * rr, y = m.y + 1.5 + Math.sin(a) * rr; if (!inMap(x | 0, y | 0) || bAt(sc, x | 0, y | 0) || isWater(sc, x | 0, y | 0)) continue; const u = mkUnit(roster[(R() * roster.length) | 0], 'D', x, y); u.guardR = 4.5; u.leash = 9; u.hp *= DF().ehp; u.maxhp *= DF().ehp; u.dm = DF().edmg; sc.U.push(u); i++; }
  sc.countable = sc.B.filter(b => !BDEF[b.t].wall && !BDEF[b.t].decor).length; return sc;
}
// ---------- battle flow ----------
let BT = null; // battle meta
function startAttack(i) {
  const tg = S.targets[i]; if (!tg) return; if ((S.army.ariete || 0) + (S.army.catapulta || 0)) { need3d('ariete3d'); need3d('catapulta3d'); }
  const total = Object.values(S.army).reduce((a, b) => a + b, 0); const heroes = heroList();
  if (!total && !heroes.length) { toast('Non hai truppe! Addestra prima un esercito.'); return; }
  closeSheet(); sfx('horn'); tensionStart('attack');
  closeFolk(); SC = tg.rid != null ? genRealmSiege(tg) : genEnemy(tg); if (tg.boss) bossSetup(SC); MODE = 'attack'; buildZone(SC); SC.arms = armsMult(); if (tg.boss) setTimeout(() => toast('👑 Il Legato di Carnuntum in persona difende la fortezza'), 1500);
  BT = { tg, idx: i, avail: { ...S.army }, used: {}, heroes: heroes.map(k => ({ k, u: null })), timer: 210, started: false, lootGot: {}, mastioDown: false, ended: false };
  SC.onBDead = b => { for (const k in b.loot) { BT.lootGot[k] = (BT.lootGot[k] || 0) + b.loot[k]; } if (b.t === 'mastio') BT.mastioDown = true; buildZone(SC); const [x, y] = [b.x + b.w / 2, b.y + b.h / 2]; const s = Object.entries(b.loot).filter(e => e[1] > 0).map(e => `+${e[1]}${RICON[e[0]]}`).join(' '); if (s) floatText(SC, x, y, s, '#ffe9a6', 1.6); };
  SC.onRevive = u => { if (!u.hero) BT.used[u.k] = BT.used[u.k]; };
  SC.deploySel = firstAvail();
  centerCam(MCX, MCX); cam.z = VW < 600 ? 0.75 : Math.max(0.6, Math.min(1.0, VW / 1250));
  SC.rally = frontRally(); if (SC.rally) { const [rx, ry] = SC.rally; centerCam((rx + MCX) / 2, (ry + MCX) / 2); const [ax, ay] = W(rx, ry), [bx, by] = W(MCX, MCX); const span = Math.max(Math.abs(ax - bx) / (VW * 0.8), Math.abs(ay - by) / (VH * 0.45), 0.01); cam.z = Math.max(0.5, Math.min(1.1, 1 / span)); }
  showBattleHUD(); setTimeout(() => { if (BT && !BT.started) toast('⚔ Tocca le carte in basso per schierare, o «Schiera tutti»'); }, 900);
}
function heroList() { return Object.keys(HDEF).filter(k => S.mastio >= HDEF[k].lv); }
function firstAvail() { for (const k of UNIT_ORDER) if (BT.avail[k] > 0) return { k }; const h = BT.heroes.find(h => !h.u); return h ? { hero: h.k } : null; }
function startRaid() {
  closeSheet(); closeFolk(); MODE = 'raid'; sfx('bell'); S.raids++; tensionStart('raid');
  const sc = newScene('raid'); villageSetup(sc);
  for (const r of S.buildings) { const b = mkBuilding(r.t, r.x, r.y, r.lvl, 'D', null); b.raidRef = r; if (r.end) b.inactive = true; sc.B.push(b); }
  sceneIndex(sc); try { computePaths(sc); } catch (e) { }
  sc.countable = sc.B.filter(b => !BDEF[b.t].wall && !BDEF[b.t].decor).length;
  // defenders = army
  const m = sc.B.find(b => b.t === 'mastio'); const cas = sc.B.filter(b => b.t === 'caserma' || b.t === 'mastio');
  let i = 0;
  for (const k of UNIT_ORDER) for (let n = 0; n < (S.army[k] || 0); n++) { if (i > 45) break; const home = cas[i % cas.length]; const [fx, fy] = frontTile(sc, home); const u = mkUnit(k, 'D', fx + 0.5 + (Math.random() - .5) * 1.5, fy + 0.5 + (Math.random() - .5) * 1.5); if (bAt(sc, Math.floor(u.x), Math.floor(u.y))) { u.x = fx + 0.5; u.y = fy + 0.5; } u.post = { x: u.x, y: u.y }; u.guardR = 7; u.leash = 13; u.pl = true; u.home0 = { ...u.post }; unitBonus(u); recApply(u, vets(k)[n]); sc.U.push(u); i++; }
  { const al = allyReinforcements(); const m0 = sc.B.find(b => b.t === 'mastio'); if (al.length && m0) { let j = 0; for (const k of al) { const [fx, fy] = frontTile(sc, m0); const u = mkUnit(k, 'D', fx + 0.5 + (Math.random() - .5) * 3, fy + 0.5 + (Math.random() - .5) * 3); if (bAt(sc, Math.floor(u.x), Math.floor(u.y))) { u.x = fx + 0.5; u.y = fy + 0.5; } u.post = { x: u.x, y: u.y }; u.guardR = 8; u.leash = 14; u.ally = true; sc.U.push(u); j++; } setTimeout(() => toast(`🤝 Gli alleati mandano ${j} uomini in tuo aiuto`), 1500); } }
  const lv = S.mastio; const pool = ['miliziano', 'arccorto', 'miliziano']; if (lv >= 2) pool.push('scudata'); if (lv >= 3) pool.push('picchiere', 'arccorto'); if (lv >= 4) pool.push('balestriere'); if (lv >= 5) pool.push('berserker', 'scudata'); if (lv >= 6) pool.push('uomoarme');
  const pack = S.raids >= 2 && Math.random() < 0.3; if (pack) { pool.length = 0; pool.push('lupo', 'lupo', 'lupo'); if (lv >= 2) pool.push('orso'); } else { pool.push('lupo'); if (lv >= 3) pool.push('orso'); }
  const count = Math.min(50, Math.max(2, Math.round((4 + lv * 2 + Math.min(10, S.raids)) * DF().raid)));
  const side = (Math.random() * 4) | 0;
  BT = { raid: true, timer: 150, heroes: heroList().map(k => ({ k, u: null })), avail: {}, used: {}, raiders: count, killed: 0, ended: false, spawnLeft: count, spawnT: 1.5, side, pool, pack, beasts: { lupo: 0, orso: 0 } };
  SC = sc; SC.deploySel = null; SC.arms = armsMult();
  SC.onUDead = u => { if (u.side === 'A') { BT.killed++; if (u.d.beast) BT.beasts[u.k]++; } };
  centerCam(MCX, MCX); cam.z = VW < 600 ? 0.75 : Math.max(0.6, Math.min(1.0, VW / 1250));
  showBattleHUD(); toast(BT.pack ? '🐺 Ululati nella notte! Un branco di lupi e orsi scende dai boschi…' : '🔔 Suonano le trombe! Predoni e bestie arrivano con la nebbia…'); if (BT.pack) sfx('horn');
}
function raidSpawn(dt) {
  if (BT.spawnLeft <= 0) return; BT.spawnT -= dt; if (BT.spawnT > 0) return;
  BT.spawnT = 0.5; const n = Math.min(BT.spawnLeft, 3); BT.spawnLeft -= n;
  for (let i = 0; i < n; i++) {
    const s = BT.side, ang = [-Math.PI / 2, 0, Math.PI / 2, Math.PI][s] + (Math.random() - .5) * 1.2, rr = 21 + Math.random() * 4;
    const x = Math.max(3, Math.min(N - 3, MCX + Math.cos(ang) * rr)), y = Math.max(3, Math.min(N - 3, MCX + Math.sin(ang) * rr));
    if (isWater(SC, x | 0, y | 0)) { BT.spawnLeft++; continue; }
    const k = BT.pool[(Math.random() * BT.pool.length) | 0]; const u = mkUnit(k, 'A', x, y); u.hp *= DF().ehp; u.maxhp *= DF().ehp; u.dm = DF().edmg; SC.U.push(u);
  }
}
function deployAt(sx, sy) {
  if (!BT || BT.ended || !SC.deploySel) return false;
  const [tx, ty] = screenToTile(sx, sy); const ix = Math.floor(tx), iy = Math.floor(ty);
  if (!inMap(ix, iy) || ix < 1 || iy < 1 || ix > N - 2 || iy > N - 2) return false;
  if (MODE === 'attack' && SC.zone[iy * N + ix]) { floatText(SC, tx, ty, '✕', '#f66', 0.6); return false; }
  if (MODE === 'raid' && bAt(SC, ix, iy)) return false;
  if (isWater(SC, ix, iy)) { floatText(SC, tx, ty, '≈', '#9cf', 0.6); return false; }
  const sel = SC.deploySel;
  if (sel.hero) {
    const h = BT.heroes.find(h => h.k === sel.hero && !h.u); if (!h) return false;
    const u = mkUnit(sel.hero, MODE === 'raid' ? 'D' : 'A', tx, ty, true); u.pl = true; unitBonus(u); recApply(u, heroRec(sel.hero)); if (MODE === 'raid') { u.guardR = 9; u.leash = 30; }
    h.u = u; SC.U.push(u); sfx('horn'); SC.deploySel = firstAvailOrNull(); BT.started = true; updateBattleHUD(true); return true;
  }
  if (!(BT.avail[sel.k] > 0)) return false;
  BT.avail[sel.k]--; BT.used[sel.k] = (BT.used[sel.k] || 0) + 1;
  const u = mkUnit(sel.k, 'A', tx + (Math.random() - .5) * 0.2, ty + (Math.random() - .5) * 0.2); u.bt = true; u.pl = true; unitBonus(u); { SC.usedRec = SC.usedRec || new Set(); const r = vets(sel.k).filter(r => !SC.usedRec.has(r.id)).sort((a, b) => (b.lvl - a.lvl) || (b.xp - a.xp))[0]; if (r) { SC.usedRec.add(r.id); recApply(u, r); } } SC.U.push(u);
  puff(SC, tx, ty, 2, '#9a8a6a'); sfx('deploy'); BT.started = true; if (!deployAt.auto) { SC.rally = [ix, iy]; SC.dn = 0; }
  if (BT.avail[sel.k] <= 0) SC.deploySel = firstAvailOrNull();
  updateBattleHUD(true); return true;
}
function firstAvailOrNull() { if (MODE === 'raid') { const h = BT.heroes.find(h => !h.u); return h ? { hero: h.k } : null; } return firstAvail(); }
// ================= MACCHINE D'ASSEDIO, SCALE E SORTITE =================
function drawSiegeAt(c, k, x, y, flip, ph, fire) {
  c.save(); c.translate(x, y); if (flip) c.scale(-1, 1);
  c.fillStyle = 'rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(0, 0, 26, 9, 0, 0, 7); c.fill();
  const wheel = (wx, wy, r) => { c.fillStyle = '#3a2614'; c.beginPath(); c.arc(wx, wy, r, 0, 7); c.fill(); c.strokeStyle = '#8a6a44'; c.lineWidth = 1.4; c.beginPath(); c.arc(wx, wy, r - 1.6, 0, 7); c.stroke(); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4 + ph; c.beginPath(); c.moveTo(wx + Math.cos(a) * (r - 1.5), wy + Math.sin(a) * (r - 1.5)); c.lineTo(wx - Math.cos(a) * (r - 1.5), wy - Math.sin(a) * (r - 1.5)); c.stroke(); } };
  if (k === 'ariete') {
    const sw = fire ? Math.sin(Math.min(1, fire) * Math.PI) * 9 : 0;
    c.fillStyle = '#6b4424'; c.fillRect(-22, -18, 40, 8); // telaio
    c.fillStyle = '#4a2f18'; c.beginPath(); c.moveTo(-24, -18); c.lineTo(-2, -40); c.lineTo(20, -18); c.closePath(); c.fill(); // tetto
    c.fillStyle = '#8a5a32'; for (let i = 0; i < 5; i++) { c.fillRect(-21 + i * 8, -18 - (i < 3 ? i : 4 - i) * 5.5 - 6, 7, 2); }
    c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(-24, -18); c.lineTo(-2, -40); c.lineTo(20, -18); c.stroke();
    c.fillStyle = '#7a5230'; c.fillRect(-14 + sw, -15, 40, 6); c.fillStyle = '#4b4b4b'; c.beginPath(); c.moveTo(26 + sw, -17); c.lineTo(33 + sw, -12); c.lineTo(26 + sw, -7); c.closePath(); c.fill(); // tronco con punta di ferro
    wheel(-14, -6, 6); wheel(12, -6, 6);
  } else {
    const arm = fire ? (fire < 0.3 ? -1.1 + fire / 0.3 * 2.0 : 0.9 - (fire - 0.3) * 1.2) : -1.1;
    c.fillStyle = '#6b4424'; c.fillRect(-22, -14, 44, 7); c.fillStyle = '#5a3818'; c.fillRect(-4, -34, 6, 22); c.fillRect(8, -30, 5, 18);
    c.save(); c.translate(0, -30); c.rotate(arm); c.fillStyle = '#7a5230'; c.fillRect(-2, -30, 4, 34); c.fillStyle = '#3a2614'; c.beginPath(); c.arc(0, -30, 4.5, 0, 7); c.fill(); if (!fire || fire > 0.3) { c.fillStyle = '#8a8378'; c.beginPath(); c.arc(0, -33, 3.6, 0, 7); c.fill(); } c.restore();
    c.fillStyle = '#4b4b4b'; c.fillRect(-20, -18, 9, 6); wheel(-14, -6, 6); wheel(14, -6, 6);
  }
  c.restore();
}
const SIEGE_TH = {};
function siegeThumb(k) { if (SIEGE_TH[k]) return SIEGE_TH[k]; const mk = k === 'ariete' ? 'ariete3d' : 'catapulta3d'; if (!G3.models[mk]) need3d(mk); if (G3.models[mk] && G3.models[mk].ready) { const mm = G3.models[mk].m; const sp = g3sprite(mk, Math.round(1.4 * mm.size[1] * ISO_H / Math.max(mm.size[0], mm.size[2])), k === 'ariete' ? -0.75 - Math.PI / 2 : -0.75, 0); if (sp) { const cv = document.createElement('canvas'); cv.width = cv.height = 108; const c = cv.getContext('2d'); const sc = Math.min(100 / sp.w, 100 / sp.h); c.drawImage(sp.cv, (108 - sp.w * sc) / 2, 104 - sp.h * sc, sp.w * sc, sp.h * sc); return SIEGE_TH[k] = cv.toDataURL(); } } const cv = document.createElement('canvas'); cv.width = cv.height = 108; const c = cv.getContext('2d'); c.scale(1.6, 1.6); drawSiegeAt(c, k, 34, 58, false, 0, 0); return cv.toDataURL(); }
// scale: i fanti bloccati da un muro piantano una scala e lo scavalcano
function tryClimb(sc, u, dt) {
  if (!u.pl || u.side !== 'A' || u.d.cav || u.d.ranged || u.d.siege || u.hero || !u.wall || !BDEF[u.wall.t].wall) { u.clT = 0; return false; }
  if (u.climb) { u.climb.t += dt; u.moving = false; if (u.climb.t >= 1.6) { u.x = u.climb.to[0]; u.y = u.climb.to[1]; u.climb = null; u.wall = null; u.clT = 0; if (u.path) u.pi = Math.min(u.path.length, u.pi + 2); floatText(sc, u.x, u.y, '🪜', '#ffe9a6', 0.8); } return true; }
  u.clT = (u.clT || 0) + dt; if (u.clT < 3.5) return false;
  const w = u.wall, dx = w.x + 0.5 - u.x, dy = w.y + 0.5 - u.y, l = Math.hypot(dx, dy) || 1; const tx = w.x + 0.5 + dx / l * 1.0, ty = w.y + 0.5 + dy / l * 1.0;
  if (!inMap(Math.floor(tx), Math.floor(ty)) || bAt(sc, Math.floor(tx), Math.floor(ty)) || isWater(sc, Math.floor(tx), Math.floor(ty))) { u.clT = 0; return false; }
  u.climb = { t: 0, to: [tx, ty], w: [w.x + 0.5, w.y + 0.5] }; sfx('ladder'); return true;
}
function drawLadder(c, u) { if (!u.climb) return; const [ax, ay] = W(u.x, u.y), [bx, by] = W(u.climb.w[0], u.climb.w[1]); const top = by - 34; c.strokeStyle = '#7a5230'; c.lineWidth = 2; for (const o of [-4, 4]) { c.beginPath(); c.moveTo(ax + o, ay); c.lineTo(bx + o * 0.6, top); c.stroke(); } c.lineWidth = 1.4; for (let i = 1; i < 6; i++) { const k = i / 6, x = ax + (bx - ax) * k, y = ay + (top - ay) * k; c.beginPath(); c.moveTo(x - 4 + 1.6 * k, y); c.lineTo(x + 4 - 1.6 * k, y); c.stroke(); } }
// sortita: se l'assedio ristagna i difensori escono dal castello
function sortieTick(dt) {
  if (MODE !== 'attack' || !BT || BT.ended || !BT.started || BT.sortie) return; BT.stall = (BT.stall || 0) + dt; if (BT.pct > (BT.lastPct || 0)) { BT.lastPct = BT.pct; BT.stall = 0; }
  if (BT.stall < 35) return; BT.sortie = 1; const m = SC.B.find(b => b.t === 'mastio' && !b.dead); if (!m) return; const d = BT.tg.d || 1; const ks = ENEMY_UNITS.slice(0, Math.min(ENEMY_UNITS.length, 2 + Math.floor(d / 1.5))); const n = 3 + Math.min(5, Math.floor(d / 2));
  for (let i = 0; i < n; i++) { const a = i / n * 6.283, x = m.x + m.w / 2 + Math.cos(a) * (m.w / 2 + 0.8), y = m.y + m.h / 2 + Math.sin(a) * (m.h / 2 + 0.8); if (bAt(SC, Math.floor(x), Math.floor(y)) || isWater(SC, Math.floor(x), Math.floor(y))) continue; const u = mkUnit(ks[i % ks.length], 'D', x, y); u.guardR = 60; u.leash = 99; u.hp *= DF().ehp; u.maxhp *= DF().ehp; u.dm = DF().edmg; SC.U.push(u); puff(SC, x, y, 4, '#9a8a6a'); }
  toast('⚔ Sortita! I difensori escono dal forte per caricare i tuoi uomini'); sfx('horn'); shake(4);
}
function battleTick(dt) {
  if (!BT || BT.ended) return; sortieTick(dt);
  if (MODE === 'raid') { raidSpawn(dt); BT.healT = (BT.healT || 0) - dt; if (BT.healT <= 0) { BT.healT = 1; for (const b of SC.B) if ((b.t === 'infermeria' || b.t === 'chiesa') && !b.dead) for (const u of SC.U) if (!u.dead && u.side === 'D' && Math.hypot(u.x - b.x - 1, u.y - b.y - 1) < 5 && u.hp < u.maxhp) { u.hp = Math.min(u.maxhp, u.hp + 3 * b.lvl); if (Math.random() < 0.15) floatText(SC, u.x, u.y, '✚', '#9f9', 0.7); } } }
  if (BT.started || MODE === 'raid') BT.timer -= dt;
  const alive = SC.B.filter(b => !b.dead && !BDEF[b.t].wall && !BDEF[b.t].decor).length;
  const pct = Math.round((1 - alive / Math.max(1, SC.countable)) * 100);
  if (MODE === 'attack') {
    BT.pct = pct; BT.stars = (pct >= 50 ? 1 : 0) + (BT.mastioDown ? 1 : 0) + (pct >= 100 ? 1 : 0);
    const att = SC.U.some(u => !u.dead && u.side === 'A'); const left = Object.values(BT.avail).some(v => v > 0) || BT.heroes.some(h => !h.u);
    if (BT.timer <= 0 || pct >= 100 || (BT.started && !att && !left)) endBattle();
  } else {
    BT.pct = pct; const raidersAlive = SC.U.some(u => !u.dead && u.side === 'A');
    if ((BT.spawnLeft <= 0 && !raidersAlive) || BT.timer <= 0 || pct >= 100) endBattle();
  }
  updateBattleHUD();
}
function endBattle() {
  BT.ended = true; SC.deploySel = null; tensionStop();
  const dead = {}; for (const u of SC.U) if (u.dead && !u.hero && !u.ally && (u.side === (MODE === 'raid' ? 'D' : 'A'))) dead[u.k] = (dead[u.k] || 0) + 1;
  const cp = curePct(); const cured = {}; let curedN = 0; for (const k in dead) { cured[k] = Math.floor(dead[k] * cp + (Math.random() < (dead[k] * cp) % 1 ? 1 : 0)); curedN += cured[k]; dead[k] -= cured[k]; if (!dead[k]) delete dead[k]; }
  const fallen = [];
  { const side = MODE === 'raid' ? 'D' : 'A'; const left = Object.assign({}, dead); let ups = 0;
    for (const u of SC.U) if (u.rec && u.hero && u.side === side) { if (recGainXP(u.rec, u.dead ? 20 : 50)) ups++; continue; }
    for (const u of SC.U) if (u.rec && !u.hero && u.side === side) { if (u.dead && left[u.k] > 0) { left[u.k]--; u.rec.dead = true; if (u.rec.lvl >= 2 || u.rec.tr) { (S.crypt = S.crypt || []).unshift({ nm: u.rec.nm, k: u.k, lvl: u.rec.lvl, tr: u.rec.tr || null, t: now(), w: MODE === 'raid' ? 'difendendo il presidio' : (BT.tg ? 'all\'assedio di ' + BT.tg.name : 'in battaglia') }); S.crypt = S.crypt.slice(0, 60); fallen.push(u.rec); } } else if (recGainXP(u.rec, u.dead ? 15 : 35)) ups++; }
    BT.vetUps = ups; }
  for (const k in dead) S.army[k] = Math.max(0, (S.army[k] || 0) - dead[k]);
  const cureLine = ((curedN ? `<div class="row"><b>✚ Curati dal Valetudinarium:</b> ${curedN}</div>` : '') + (BT.vetUps ? `<div class="row"><b>⬆ Veterani:</b> ${BT.vetUps} soldati salgono di livello</div>` : '') + (fallen.length ? `<div class="row fallen"><b>✝ Caduti con onore:</b> ${fallen.map(r => `${r.nm} (liv. ${r.lvl}${r.tr ? ', ' + TRAITS[r.tr].n : ''})`).join(', ')}${hasB('cripta') ? ' — i loro nomi riposano nella Cripta' : ''}</div>` : ''));
  let html = '';
  if (MODE === 'attack') {
    const st = BT.stars; const got = {};
    for (const k in BT.lootGot) got[k] = addRes(k, BT.lootGot[k]);
    const fav = st * 2 + (st === 3 ? Math.ceil(BT.tg.d / 2) : 0); if (fav) got.favore = addRes('favore', fav);
    if (BT.tg && BT.tg.fid != null) warResult(BT.tg.fid, st);
    if (st === 3) S.best3 = 1; if (st >= 1) { S.wins++; S.targets.splice(BT.idx, 1); if (S.targets.length < 3) { const nm = TNAMES[(Math.random() * TNAMES.length) | 0]; S.targets.push({ d: Math.max(1, S.mastio + ((Math.random() * 3) | 0) - 1), name: nm[0], where: nm[1], seed: (Math.random() * 1e9) | 0 }); } }
    html = `<div class="stars">${'★'.repeat(st)}<span>${'★'.repeat(3 - st)}</span></div><h3>${st ? 'Vittoria!' : 'Sconfitta'}</h3><p class="sub">${BT.tg.name} — distruzione ${BT.pct}%</p>
      <div class="row"><b>Bottino:</b> ${Object.keys(got).filter(k => got[k] > 0).map(k => `${ICO(k)} ${got[k]}`).join('  ') || 'nessuno'}</div>
      <div class="row"><b>Caduti:</b> ${Object.keys(dead).map(k => `${UDEF[k].n} ×${dead[k]}`).join(', ') || 'nessuno'}</div>
      ${fragReward(st)}${cureLine}<p class="lore">${st >= 2 ? '«Le legioni della Provincia gridano il tuo nome.»' : st ? '«Un passo in più verso l\'Aquila.»' : '«Il fango ha inghiottito il tuo stendardo. Ritorna più forte.»'}</p>`;
  } else {
    const won = (!SC.U.some(u => !u.dead && u.side === 'A') && BT.spawnLeft <= 0) || BT.pct < 10;
    let stolen = {};
    if (!won) S.raidLostT = now();
    if (won) { S.raidsWon++; const b = addRes('oro', 12 * BT.raiders); const f = addRes('favore', 1); stolen = null; html = `<h3>Il presidio resiste!</h3><p class="sub">Predoni respinti: ${BT.killed}/${BT.raiders}</p><div class="row"><b>Taglia sui briganti:</b> 🪙 ${b}  👑 ${f}</div>`; }
    else { const k = Math.min(0.35, BT.pct / 100 * 0.6); for (const r of ['cibo', 'legno', 'oro']) { stolen[r] = Math.floor(S.res[r] * k); S.res[r] -= stolen[r]; } html = `<h3>I predoni fuggono col bottino</h3><p class="sub">Distruzione ${BT.pct}% — predoni abbattuti ${BT.killed}/${BT.raiders}</p><div class="row"><b>Rubato:</b> ${Object.keys(stolen).map(k => `${ICO(k)} ${stolen[k]}`).join('  ')}</div>`; }
    const pl = BT.beasts.lupo * 1 + BT.beasts.orso * 3; if (pl) { const gp = addRes('pelli', pl); html += `<div class="row"><b>Bestie abbattute:</b> 🐺 ${BT.beasts.lupo} · 🐻 ${BT.beasts.orso} → 🧥 +${gp} Pelli</div>`; }
    html += `<div class="row"><b>Difensori caduti:</b> ${Object.keys(dead).map(k => `${UDEF[k].n} ×${dead[k]}`).join(', ') || 'nessuno'}</div>${cureLine}<p class="lore">Le mura vengono rattoppate all'alba. Il prossimo buio arriverà.</p>`;
    S.nightIn = DF().night * seasonRaidMul() * (S.mastio <= 4 ? 1.4 : 1);
  }
  save();
  setTimeout(() => { openSheet('Esito', `<div class="result">${html}<button class="btn big" onclick="backToVillage()">Torna al presidio</button></div>`, 'result'); }, 900);
}
function backToVillage() { setTimeout(() => { if (S && S.fragStory != null) fragStoryShow(); }, 600); if (TENS.kind) tensionStop(); else if (MUS.duck) { MUS.duck = false; musicStart(); musicApply(); } closeSheet(); BT = null; MODE = 'village'; SC = buildVillage(); $('#bhud').classList.add('hidden'); $('#hud').classList.remove('hidden'); centerCam(MCX, MCX); cam.z = VW < 600 ? 1.05 : Math.max(0.7, Math.min(1.25, VW / 900)); updateHUD(); save(); }
function retreat() { if (BT && !BT.ended) { if (MODE === 'raid') { BT.timer = 0; } else endBattle(); } }

// ---------- camera & input ----------
// ---- smooth map rotation ----
let ROTA = null; const Q90 = Math.PI / 2;
function rotLabel() { const rl = $('#rotlbl'); if (rl) rl.textContent = ['N', 'E', 'S', 'O'][rstep()]; }
function animRot(target, dur, pivot) { ROTA = { from: ANG, to: target, t: 0, dur, pivot: pivot || screenToTile(VW / 2, VH / 2), px: VW / 2, py: VH / 2 }; }
function rotTick(dt) {
  if (!ROTA) return; ROTA.t += dt; const k = Math.min(1, ROTA.t / ROTA.dur); const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  setAng(ROTA.from + (ROTA.to - ROTA.from) * e); keepPivot(ROTA.pivot, ROTA.px, ROTA.py);
  if (k >= 1) { setAng(ROTA.to); ROTA = null; rotLabel(); }
}
function keepPivot(p, sx, sy) { const [wx, wy] = W(p[0], p[1]); cam.x = wx - (sx - VW / 2) / cam.z; cam.y = wy - (sy - VH / 2) / cam.z; }
function rotateView(d) {
  if (!SC || MODE === 'title') return;
  const base = ROTA ? ROTA.to : Math.round(ANG / Q90) * Q90; const piv = ROTA ? ROTA.pivot : null;
  animRot(base + d * Q90, 0.55, piv); sfx('click');
}
function snapRot(pivot, sx, sy) { const tgt = Math.round(ANG / Q90) * Q90; animRot(tgt, Math.min(0.35, 0.12 + Math.abs(tgt - ANG) * 0.5), pivot); if (sx != null) { ROTA.px = sx; ROTA.py = sy; } }
function centerCam(tx, ty) { const [wx, wy] = W(tx, ty); cam.x = wx; cam.y = wy; }
function clampCam() { cam.z = Math.max(0.32, Math.min(2.4, cam.z)); cam.x = Math.max(-N * 30, Math.min(N * 30, cam.x)); cam.y = Math.max(N * 2, Math.min(N * 30, cam.y)); }
const ptr = new Map(); let G = null, holdTimer = null, holdIv = null, lastPos = null;
function stopHold() { clearTimeout(holdTimer); clearInterval(holdIv); holdTimer = holdIv = null; }
cv.addEventListener('pointerdown', e => {
  ac(); cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptr.size === 1 && (e.button === 2 || e.shiftKey) && MODE !== 'title') { ROTA = null; G = { k: 'twist', sx: e.clientX, a0: ANG, pivot: screenToTile(VW / 2, VH / 2) }; return; }
  if (ptr.size === 1) {
    G = { k: 'tap', sx: e.clientX, sy: e.clientY, cx: cam.x, cy: cam.y, held: false }; lastPos = [e.clientX, e.clientY];
    if ((MODE === 'attack' || MODE === 'raid') && SC.deploySel && !SC.deploySel.hero) { holdTimer = setTimeout(() => { if (G && G.k === 'tap') { G.held = true; deployAt(lastPos[0], lastPos[1]); holdIv = setInterval(() => { if (G && G.held) deployAt(lastPos[0] + (Math.random() - .5) * 14, lastPos[1] + (Math.random() - .5) * 8); }, 110); } }, 260); }
  } else if (ptr.size === 2) { stopHold(); const [a, b] = [...ptr.values()]; ROTA = null; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; G = { k: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y), z0: cam.z, f0: Math.atan2(b.y - a.y, b.x - a.x), a0: ANG, pivot: screenToTile(mx, my), rot: false }; }
});
cv.addEventListener('pointermove', e => {
  if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); lastPos = [e.clientX, e.clientY];
  if (!G) return;
  if (G.k === 'tap' && !G.held && Math.hypot(e.clientX - G.sx, e.clientY - G.sy) > 8) { G.k = 'pan'; stopHold(); }
  if (G.k === 'pan') { cam.x = G.cx - (e.clientX - G.sx) / cam.z; cam.y = G.cy - (e.clientY - G.sy) / cam.z; clampCam(); }
  else if (G.k === 'pinch' && ptr.size >= 2) {
    const [a, b] = [...ptr.values()]; let da = Math.atan2(b.y - a.y, b.x - a.x) - G.f0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    if (MODE !== 'title' && (G.rot || Math.abs(da) > 0.14)) { if (!G.rot) { G.rot = true; G.f0 += Math.sign(da) * 0.14; da -= Math.sign(da) * 0.14; } setAng(G.a0 - da); }
    const d = Math.hypot(a.x - b.x, a.y - b.y); cam.z = Math.max(0.32, Math.min(2.4, G.z0 * d / G.d0));
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; keepPivot(G.pivot, mx, my); G.mx = mx; G.my = my; clampCam(); }
  else if (G.k === 'twist') { setAng(G.a0 + (e.clientX - G.sx) * 0.009); keepPivot(G.pivot, VW / 2, VH / 2); }
});
function endPtr(e) {
  if (!ptr.has(e.pointerId)) return; ptr.delete(e.pointerId);
  if (G && G.k === 'tap' && !G.held && ptr.size === 0) onTap(e.clientX, e.clientY);
  if (G && (G.k === 'twist' || (G.k === 'pinch' && G.rot))) snapRot(G.k === 'twist' ? G.pivot : screenToTile(G.mx || VW / 2, G.my || VH / 2), G.k === 'twist' ? null : G.mx, G.k === 'twist' ? null : G.my);
  if (ptr.size === 0) { G = null; stopHold(); } else if (G && G.k === 'pinch') { const [a] = [...ptr.values()]; G = { k: 'pan', sx: a.x, sy: a.y, cx: cam.x, cy: cam.y }; }
}
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => { if (e.key === 'q' || e.key === 'Q') rotateView(-1); if (e.key === 'e' || e.key === 'E') rotateView(1); });
cv.addEventListener('wheel', e => { e.preventDefault(); const z0 = cam.z, z = Math.max(0.32, Math.min(2.4, z0 * Math.exp(-e.deltaY * 0.0015))); const wx = (e.clientX - VW / 2) / z0 + cam.x, wy = (e.clientY - VH / 2) / z0 + cam.y; cam.z = z; cam.x = wx - (e.clientX - VW / 2) / z; cam.y = wy - (e.clientY - VH / 2) / z; clampCam(); }, { passive: false });
function onTap(sx, sy) {
  if (MODE === 'visit') { visitTap(sx, sy); return; }
  if (MODE === 'attack' || MODE === 'raid') { deployAt(sx, sy); return; }
  if (MODE !== 'village') return;
  const [tx, ty] = screenToTile(sx, sy);
  if (placing) { const d = BDEF[placing.t]; placing.x = Math.floor(tx - d.w / 2 + 0.5); placing.y = Math.floor(ty - d.h / 2 + 0.5); updateGhost(); return; }
  // pick building: prefer one whose sprite area contains point; test tile then tiles below (tall sprites)
  let hit = bAt(SC, Math.floor(tx), Math.floor(ty));
  if (!hit) { const wx = (sx - VW / 2) / cam.z + cam.x, wy = (sy - VH / 2) / cam.z + cam.y; let best = -1; for (const b of SC.B) { if (b.dead || BDEF[b.t].wall) continue; let r = bSprite(b) ? bSpriteRect(b) : null; if (!r) { const e = bCache(b); const vr = vRect(b); const [bx, by] = WR(vr[0], vr[1]); r = [bx - e.ox + 20, by - e.oy + 20, e.w - 40, e.h - 40]; } if (wx >= r[0] && wx <= r[0] + r[2] && wy >= r[1] && wy <= r[1] + r[3]) { const vk = vRect(b); const key = vk[0] + vk[1] + (b.w + b.h) / 2; if (key > best) { best = key; hit = b; } } } }
  for (let k = 1; k <= 3 && !hit; k++) { const b = bAt(SC, Math.floor(tx + k * 0.5), Math.floor(ty + k * 0.5)); if (b) hit = b; }
  { const vu = pickVisitor(sx, sy); if (vu) { const e = EVENTS.find(x => x.id === vu.vis); if (e) { sfx('click'); openEvent(e); return; } } }
  { const fu = pickFolk(sx, sy, tx, ty); if (fu) { sfx('click'); openFolk(fu); return; } if ($('#fcard') && !$('#fcard').classList.contains('hidden')) { closeFolk(); return; } }
  { const an = pickAnimal(sx, sy, tx, ty); if (an) { sfx('click'); openAnimal(an); return; } }
  if (!bAt(SC, Math.floor(tx), Math.floor(ty))) { const nat = pickNature(sx, sy, tx, ty); if (nat && (!hit || (nat.k == null && Math.hypot(nat.x - tx, nat.y - ty) < 0.75) || Math.hypot(nat.x - tx, nat.y - ty) < 0.75)) { sfx('click'); openNature(nat); return; } if (!hit && nat) { sfx('click'); openNature(nat); return; } }
  if (hit) {
    if (hit.ref && hit.bubble && collect(hit.ref)) { hit.bubble = null; return; }
    SC.sel = hit; sfx('click'); openBuildingInfo(hit.ref);
  } else { SC.sel = null; closeSheet(); }
}

// ---------- placement ----------
function startPlacement(t, moveRef) {
  closeSheet(); const d = BDEF[t];
  const [tx, ty] = screenToTile(VW / 2, VH / 2);
  placing = { t, w: d.w, h: d.h, x: Math.floor(tx - d.w / 2 + 0.5), y: Math.floor(ty - d.h / 2 + 0.5), move: moveRef || null };
  if (moveRef) { placing.x = moveRef.x; placing.y = moveRef.y; } else { const f = findFree(t, placing.x, placing.y); if (f) { placing.x = f[0]; placing.y = f[1]; } }
  updateGhost(); $('#placebar').classList.remove('hidden'); $('#hud-bot').classList.add('hidden');
  $('#placeinfo').innerHTML = moveRef ? `Sposta: <b>${d.n}</b>` : `<b>${d.n}</b> ${costStr(d.cost || {})}`;
}
function findFree(t, x0, y0, ignore) { for (let r = 0; r < 14; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (canPlace(t, x0 + dx, y0 + dy, ignore)) return [x0 + dx, y0 + dy]; } return null; }
function updateGhost() { if (!placing) { SC.ghost = null; return; } placing.ok = canPlace(placing.t, placing.x, placing.y, placing.move); SC.ghost = { ...placing }; }
function confirmPlace() {
  if (!placing) return; const d = BDEF[placing.t];
  if (!placing.ok) { toast('Spazio occupato o fuori dal presidio'); return; }
  if (placing.move) { placing.move.x = placing.x; placing.move.y = placing.y; cancelPlace(); SC = buildVillage(); save(); return; }
  if (countB(placing.t) >= maxB(placing.t)) { toast('Limite raggiunto: alza il livello del Castrum'); cancelPlace(); return; }
  if (d.req && !S.creative && !hasB(d.req)) { toast(`Serve prima: ${BDEF[d.req].n}`); cancelPlace(); return; }
  if (!canPay(d.cost)) { const nm = d.n; cancelPlace(); needSheet(d.cost, 'costruire ' + nm); return; }
  if (d.t && !d.wall && !d.decor && builders() >= maxBuilders()) { toast(`Tutti i fabri sono occupati (max ${maxBuilders()})`); return; }
  pay(d.cost);
  const r = { id: S.nextId++, t: placing.t, x: placing.x, y: placing.y, lvl: 1, stock: 0, end: d.t && !S.creative ? now() + buildSecs(d) * 1000 * seasonBuildMul() : 0, dur: buildSecs(d) * 1000 * seasonBuildMul(), toLvl: 1 };
  if (placing.t === 'muro' && S.mastio >= 5) r.lvl = 1;
  S.buildings.push(r); sfx('build'); SC = buildVillage(); save(); updateHUD();
  if (d.wall || d.decor) { // keep placing next
    const nx = placing.x + 1; placing.x = nx; if (!canPlace(placing.t, placing.x, placing.y)) { const f = findFree(placing.t, placing.x, placing.y); if (f) { placing.x = f[0]; placing.y = f[1]; } } if (countB(placing.t) >= maxB(placing.t) || !canPay(d.cost)) { cancelPlace(); return; } updateGhost(); $('#placeinfo').innerHTML = `<b>${d.n}</b> ${countB(placing.t)}/${maxB(placing.t)} — tocca per posizionare, ✓ per costruire`;
  } else cancelPlace();
}
function cancelPlace() { placing = null; if (SC) SC.ghost = null; $('#placebar').classList.add('hidden'); $('#hud-bot').classList.remove('hidden'); }
function nudge(dx, dy) { if (!placing) return; [dx, dy] = rotVinv(dx, dy).map(Math.round); placing.x += dx; placing.y += dy; updateGhost(); }

// ---------- ostacoli naturali & decorazioni ----------
function spawnNature(n) {
  let made = 0;
  for (let tries = 0; tries < 400 && made < n; tries++) {
    const t = NATURE[(Math.random() * NATURE.length) | 0], x = 3 + ((Math.random() * (N - 7)) | 0), y = 3 + ((Math.random() * (N - 7)) | 0);
    if (Math.hypot(x - MCX, y - MCX) < 11 || !canPlace(t, x, y)) continue;
    if (t === 'tronco' && S.buildings.filter(b => b.nat && b.t === 'tronco').length >= TRONCHI_MAX) continue;
    S.buildings.push({ id: S.nextId++, t, x, y, lvl: 1, stock: 0, end: 0, nat: true }); made++;
  }
  return made;
}
function removeObj(id) {
  const i = S.buildings.findIndex(b => b.id === id); if (i < 0) return; const r = S.buildings[i], d = BDEF[r.t];
  if (workOn('obj', r.id)) return;
  let gain = {}, cost = {}, tt = d.rm && d.rm.t || 4;
  if (r.nat) { cost = d.rm.cost; gain = { ...d.rm.gain }; } else { cost = { cibo: 5 }; tt = 3; for (const k in d.cost) gain[k] = Math.floor(d.cost[k] / 2); }
  if (!canPay(cost)) { toast('Risorse insufficienti per rimuoverlo'); return; }
  if (timedOn() && crewBusy() >= MAX_CREW) { toast(`Le squadre di sgombero sono occupate (max ${MAX_CREW})`); return; }
  pay(cost); addWork({ kind: 'obj', key: r.id, nat: !!r.nat, fav: r.t === 'funghi' && r.nat, x: r.x + d.w / 2, y: r.y + d.h / 2, w: d.w, h: d.h, gain, dur: tt });
  closeSheet(); sfx('tock'); save(); updateHUD();
}
// ================= GENTE: ogni soldato e contadino ha nome, livello, esperienza e punti da spendere =================
const NOMI_M = ['Aulo', 'Caio', 'Decimo', 'Fausto', 'Flavio', 'Gneo', 'Lucio', 'Marcello', 'Numerio', 'Ottavio', 'Publio', 'Quinto', 'Rufo', 'Servio', 'Sesto', 'Tiberio', 'Tito', 'Valerio', 'Vibio', 'Appio', 'Cesio', 'Druso', 'Emilio', 'Gallo', 'Lentulo', 'Massimo', 'Postumio', 'Spurio', 'Varo', 'Elio'];
const NOMI_F = ['Aurelia', 'Cornelia', 'Claudia', 'Domizia', 'Fabia', 'Flavia', 'Giulia', 'Livilla', 'Lucrezia', 'Marcia', 'Ottavia', 'Plauzia', 'Porzia', 'Sabina', 'Servilia', 'Terenzia', 'Tullia', 'Valeria', 'Vipsania', 'Prisca'];
const SOPRA = ['Rufo', 'Longino', 'Crasso', 'Ferox', 'Tacito', 'Silvano', 'Montano', 'Malleolo', 'Celere', 'Aquilino', 'Capitone', 'Molinario', 'Pio', 'Sanguineo', 'Canuto', 'Valente'];
const FEMK = { infermiera: 1, scudata: 1 };
const WROLE = {
  taglialegna: { n: 'Taglialegna', d: 'Abbatte alberi e porta tronchi alla capanna. Più è esperto, più legna produce la sua capanna.' },
  cuoco: { n: 'Contadino', d: 'Lavora i campi, la cucina e il mercato. Più è esperto, più rende il suo edificio.' },
  fabbro: { n: 'Artigiano', d: 'Fabbro, minatore o cavatore: batte il ferro e spacca la pietra. Più è esperto, più produce la sua bottega.' },
  infermiera: { n: 'Guaritrice', d: 'Cura i feriti e assiste il villaggio. Più è esperta, più rende l\'edificio a cui è legata.' },
};
function folkName(id, k) { const R = rng(id * 7919 + 13); const f = FEMK[k] || (R() < 0.12 && !UDEF[k]); const n = f ? NOMI_F[(R() * NOMI_F.length) | 0] : NOMI_M[(R() * NOMI_M.length) | 0]; return n + ' ' + SOPRA[(R() * SOPRA.length) | 0]; }
const FOLK_MAX = () => Math.min(10, 2 + S.mastio);
const xpNeed = l => 60 + l * 50;
function newRec(k) { const id = (S.folkId = (S.folkId || 0) + 1); return { id, k, nm: folkName(id, k), lvl: 1, xp: 0, pts: 0, str: 0, vit: 0, def: 0, abi: 0, spd: 0 }; }
// soldati: lista per tipo, sincronizzata con S.army (prima tolgo i caduti segnati, poi taglio/aggiungo in coda)
function vets(k) {
  S.vets = S.vets || {}; let a = S.vets[k] || (S.vets[k] = []); const n = S.army[k] || 0;
  if (a.some(r => r.dead)) { let rm = a.filter(r => r.dead).length; S.vets[k] = a = a.filter(r => !r.dead); }
  while (a.length > n) a.pop(); while (a.length < n) a.push(newRec(k)); return a;
}
// contadini: uno per edificio-lavoro
function heroRec(k) { S.hrec = S.hrec || {}; let r = S.hrec[k]; if (!r) { r = S.hrec[k] = newRec(k); r.nm = HDEF[k].n; } return r; }
function workRec(bid, k) { S.wrk = S.wrk || {}; let r = S.wrk[bid]; if (!r || r.k !== k) r = S.wrk[bid] = newRec(k); return r; }
function workMult(r) { const w = S && S.wrk && S.wrk[r.id]; return w ? 1 + 0.08 * (w.lvl - 1) + 0.06 * (w.abi || 0) : 1; }
// effetti in battaglia
// ---- tratti dei veterani (dal livello 3) ----
const TRAITS = {
  furia: { n: 'Furia del Nord', ic: '🔥', d: '+20% danno' }, scudo: { n: 'Scudo di Quercia', ic: '🛡', d: '-15% danno subito' },
  duro: { n: 'Duro a Morire', ic: '💀', d: 'sopravvive al primo colpo mortale' }, lesto: { n: 'Piè Veloce', ic: '🏃', d: '+20% velocità' },
  gigante: { n: 'Gigante', ic: '🪨', d: '+25% vita, -10% velocità' }, cento: { n: 'Cento Battaglie', ic: '⚔', d: '+10% a tutto' },
  occhio: { n: 'Occhio di Falco', ic: '🦅', d: '+25% danno a distanza' }, codardo: { n: 'Codardo', ic: '🐇', d: '-15% danno, +25% velocità' },
};
function giveTrait(rec) { if (rec.tr || !UDEF[rec.k] || rec.lvl < 3) return; const pool = Object.keys(TRAITS).filter(k => k !== 'occhio' || UDEF[rec.k].ranged); const R = rng(rec.id * 131 + 7); rec.tr = pool[(R() * pool.length) | 0]; const T = TRAITS[rec.tr]; setTimeout(() => toast(`${T.ic} ${rec.nm} si è guadagnato un soprannome di guerra: «${T.n}» (${T.d})`), 900); }
function cryptHTML() { const L = S.crypt || []; return `<div class="crypt"><b>⚱️ ${L.length ? L.length + ' eroi custoditi · +' + Math.round(cryptBonus() * 100) + '% vita alle truppe' : 'Nessun eroe ancora: i veterani caduti verranno sepolti qui'}</b>${L.slice(0, 20).map(x => `<div><span>✝ ${x.nm}</span><small>${UDEF[x.k] ? UDEF[x.k].n : x.k} · liv. ${x.lvl}${x.tr ? ' · ' + TRAITS[x.tr].ic + ' ' + TRAITS[x.tr].n : ''} · caduto ${x.w}</small></div>`).join('')}</div>`; }
function cryptBonus() { return S && hasB('cripta') ? Math.min(0.15, 0.01 * (S.crypt || []).length) : 0; }
function recApply(u, rec) {
  if (!rec) return; u.rec = rec; const L = 1 + 0.03 * (rec.lvl - 1);
  const hm = L * (1 + 0.12 * rec.vit); u.maxhp *= hm; u.hp *= hm;
  u.dm = (u.dm || 1) * L * (1 + 0.12 * rec.str); u.df = Math.max(0.55, 1 - 0.06 * rec.def);
  const t = rec.tr; if (t === 'furia') u.dm *= 1.2; else if (t === 'scudo') u.df *= 0.85; else if (t === 'lesto') u.sm = (u.sm || 1) * 1.2; else if (t === 'gigante') { u.maxhp *= 1.25; u.hp *= 1.25; u.sm = (u.sm || 1) * 0.9; } else if (t === 'cento') { u.dm *= 1.1; u.maxhp *= 1.1; u.hp *= 1.1; } else if (t === 'occhio' && u.d.ranged) u.dm *= 1.25; else if (t === 'codardo') { u.dm *= 0.85; u.sm = (u.sm || 1) * 1.25; }
  if (t === 'duro') u.duro = 1;
}
function recGainXP(rec, v) {
  if (!rec || rec.lvl >= FOLK_MAX()) { if (rec) rec.xp = Math.min(rec.xp + v, xpNeed(rec.lvl)); return false; }
  rec.xp += v; let up = false;
  while (rec.lvl < FOLK_MAX() && rec.xp >= xpNeed(rec.lvl)) { rec.xp -= xpNeed(rec.lvl); rec.lvl++; rec.pts++; up = true; } if (up) giveTrait(rec);
  return up;
}
function trainCost(rec) { const l = rec.lvl; if (HDEF[rec.k]) return { cibo: 40 + l * 25, oro: 30 + l * 25 }; return UDEF[rec.k] ? { cibo: 20 + l * 15, oro: 10 + l * 12 } : { cibo: 15 + l * 12, oro: 5 + l * 8 }; }
// selezione sulla mappa
function pickFolk(sx, sy, tx, ty) {
  if (!SC || MODE !== 'village') return null; const wx = (sx - VW / 2) / cam.z + cam.x, wy = (sy - VH / 2) / cam.z + cam.y; let best = null, bd = 1e9;
  for (const u of SC.U) { if (u.dead || u.side !== 'V' || u.k === 'carro' || u.kid || u.vis || u.hunter || folkHidden(SC, u)) continue; const [bx, by] = W(u.x, u.y); const tall = u.d && u.d.model ? 34 : 26; const dx = wx - bx, dy = wy - (by - (tall === 34 ? 28 : 20)); if (Math.abs(dx) < 16 && Math.abs(dy) < tall) { const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = u; } } }
  return best;
}
function folkOf(u) {
  if (u.wrec) return u.wrec;
  if (u.home && WROLE[u.k]) return u.wrec = workRec(u.home.ref ? u.home.ref.id : u.home.id, u.k);
  if (u.hero && HDEF[u.k]) return heroRec(u.k);
  if (UDEF[u.k]) { const a = vets(u.k); return a[u.vi || 0]; }
  return null;
}
const PORT = {};
function thumbAt(k, h) { if (!PORT[k] && RUNIT[k] && romanThumb(k)) PORT[k] = romanThumb(k); if (!PORT[k]) { const f = FR[k + '.idleF']; if (!f || !ATL.complete) return ''; const cv2 = document.createElement('canvas'); cv2.width = 120; cv2.height = 148; const s = Math.min(140 / f[3], 116 / f[2]); const x2 = cv2.getContext('2d'); x2.drawImage(ATL, f[0], f[1], f[2], f[3], (120 - f[2] * s) / 2, 148 - f[3] * s, f[2] * s, f[3] * s); PORT[k] = cv2.toDataURL(); }
  return `background-image:url(${PORT[k]});background-size:cover;background-position:center bottom;`; }
setInterval(() => { if (!S || MODE !== 'village') return; const el = $('#fcard'); if (el && !el.classList.contains('hidden') && SC && SC.folkU && workOn('train', folkOf(SC.folkU).id)) openFolk(SC.folkU); const p = $('#sheet').dataset.p; if (p === 'n' && SC && SC.selN && workOn('nat', natKey(SC.selN))) openNature(SC.selN); else if (p && p.startsWith('b:') && S.works && S.works.some(w => w.key === +p.slice(2))) refreshSheet(); }, 1000);
function closeFolk() { const el = $('#fcard'); if (el) el.classList.add('hidden'); if (SC) { SC.selU = null; SC.folkU = null; } }
function openFolk(u) {
  const rec = folkOf(u); if (!rec) return; if (!$('#sheet').classList.contains('hidden')) closeSheet(); SC.selU = u; SC.folkU = u; const hero = !!(u.hero && HDEF[u.k]); const sold = !!UDEF[u.k] || hero;
  const role = hero ? HDEF[u.k] : sold ? UDEF[u.k] : WROLE[u.k]; const need = xpNeed(rec.lvl), mx = FOLK_MAX(), maxed = rec.lvl >= mx;
  const L = 1 + 0.03 * (rec.lvl - 1), hid = u.home ? (u.home.ref ? u.home.ref.id : u.home.id) : 0;
  const st = sold ? [
    ['str', '⚔', 'Forza', `${Math.round(role.dmg * L * (1 + 0.12 * rec.str) * 10) / 10}`],
    ['vit', '❤', 'Vita', `${Math.round(role.hp * L * (1 + 0.12 * rec.vit))}`],
    ['def', '🛡', 'Difesa', `${Math.round((1 - Math.max(0.55, 1 - 0.06 * rec.def)) * 100)}%`],
  ] : [
    ['abi', '⚒', 'Abilità', `+${Math.round((workMult({ id: hid }) - 1) * 100)}%`],
    ['spd', '🏃', 'Rapidità', `+${(rec.spd || 0) * 10}%`],
  ];
  const c = trainCost(rec), can = canPay(c) && !maxed && !workOn('train', rec.id);
  const desc = hero ? `<b>${role.ult}:</b> ${role.ultd}` : sold ? `${role.role}. ${role.ranged ? 'Tiro a distanza.' : 'Mischia.'}` : role.d.split('.')[0] + '.';
  let el = $('#fcard'); if (!el) { el = document.createElement('div'); el.id = 'fcard'; document.body.appendChild(el); } el.classList.toggle('hero', hero);
  el.innerHTML = `<button class="fx" onclick="closeFolk()">✕</button>
    <div class="ftop"><div class="fpor" style="${hero ? thumbStyle(u.k) : thumbAt(u.k, 74)}"></div>
      <div class="fid"><div class="fnm">${rec.nm}${rec.tr ? ` <span class="ftr2" title="${TRAITS[rec.tr].d}">${TRAITS[rec.tr].ic} ${TRAITS[rec.tr].n}</span>` : ''}</div><div class="frl">${hero ? 'Eroe · ' + role.title.split(',')[0] : role.n}</div><div class="fds">${desc}</div></div>
      <div class="flv"><small>LIV</small><b>${rec.lvl}</b><small>/${mx}</small></div></div>
    <div class="fxp" title="Esperienza"><i style="width:${maxed ? 100 : Math.min(100, rec.xp / need * 100)}%"></i><span>${maxed ? (rec.lvl >= 10 ? 'Livello massimo' : 'Max per ora · sali di Castrum') : `Esp. ${rec.xp}/${need}`}${rec.pts ? ` · <b>${rec.pts} punt${rec.pts > 1 ? 'i' : 'o'}!</b>` : ''}</span></div>
    <div class="fsts">${st.map(([k, ic, n, v]) => { const cap = 5 + Math.floor(rec.lvl / 3), up = rec.pts && (rec[k] || 0) < cap; return `<div class="fst ${up ? 'up' : ''}" ${up ? `onclick="folkPoint('${k}')"` : ''}><span class="i">${ic}</span><b>${v}</b><small>${n}${rec[k] ? ' ' + '•'.repeat(rec[k]) : ''}</small>${up ? '<em>+1</em>' : ''}</div>`; }).join('')}</div>
    ${workOn('train', rec.id) ? `<button class="ftr dis busy" disabled>🎯 In addestramento… <span>${fmtT(workOn('train', rec.id).end - now())}</span></button>` : `<button class="ftr ${can ? '' : 'dis'}" ${can ? '' : 'disabled'} onclick="folkTrain()">🎯 Addestra <small>+40 esp. · ⏱ ${fmtT((30 + 30 * rec.lvl) * PACE() * 1000)}</small><span>${maxed ? '—' : costStr(c)}</span></button>`}`;
  el.classList.remove('hidden');
}
function folkTrain() { const u = SC && SC.folkU; if (!u) return; const rec = folkOf(u); const c = trainCost(rec); if (!canPay(c) || rec.lvl >= FOLK_MAX() || workOn('train', rec.id)) return; pay(c);
  const dur = Math.round((30 + 30 * rec.lvl) * PACE()); if (timedOn()) { addWork({ kind: 'train', key: rec.id, rid: rec.id, xp: 40, dur }); sfx('tock'); toast(`🎯 ${rec.nm} si addestra (${dur}s)`); } else finishWork({ kind: 'train', rec, xp: 40 }); save(); updateHUD(); openFolk(u); }
function folkPoint(k) { const u = SC && SC.folkU; if (!u) return; const rec = folkOf(u); if (!rec.pts) return; rec.pts--; rec[k] = (rec[k] || 0) + 1; sfx('coin'); if (k === 'spd' && u.d) u.d.spd = 0.7 * (1 + 0.1 * rec.spd); save(); openFolk(u); }
// ================= LAVORI: rimozioni, demolizioni e addestramenti richiedono tempo =================
const MAX_CREW = 2; // squadre di sgombero (separate dai mastri d'opera)
const timedOn = () => S && !S.creative;
function crewBusy() { return (S.works || []).filter(w => w.kind !== 'train').length; }
function workOn(kind, key) { return (S.works || []).find(w => w.kind === kind && w.key === key); }
function fmtT(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); if (s >= 3600) { const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return m ? `${h}h ${m}m` : `${h}h`; } return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}s`; }
function addWork(w) { if (!timedOn() || !w.dur) { finishWork(w); return true; } w.end = now() + w.dur * 1000; w.d = w.dur * 1000; (S.works = S.works || []).push(w); return true; }
function finishWork(w) {
  const got = {}; for (const k in (w.gain || {})) got[k] = addRes(k, w.gain[k]);
  if (w.fav && Math.random() < 0.25) got.favore = addRes('favore', 1);
  const txt = Object.keys(got).filter(k => got[k] > 0).map(k => `+${got[k]}${RICON[k]}`).join(' ');
  if (w.kind === 'nat') {
    if (!(S.removed = S.removed || []).includes(w.key)) S.removed.push(w.key); S.cleared = (S.cleared || 0) + 1;
    if (MODE === 'village' && SC) { const o = SC.trees.concat(SC.rocks).find(o => natKey(o) === w.key); SC.trees = SC.trees.filter(t => t !== o); SC.rocks = SC.rocks.filter(r => r !== o); if (SC.selN === o) { SC.selN = null; closeSheet(); }
      for (let k = 0; k < 6; k++) puff(SC, w.x + (Math.random() - .5) * .6, w.y + (Math.random() - .5) * .6, 10, w.tree ? '#6a7a3a' : '#8a8278'); floatText(SC, w.x, w.y, txt || 'Rimosso', '#ffe9a6', 1.3); sfx(w.tree ? 'crash' : 'coin'); }
  } else if (w.kind === 'obj' || w.kind === 'demo') {
    const i = S.buildings.findIndex(b => b.id === w.key); if (i >= 0) { if (w.kind === 'obj' && w.nat) S.cleared = (S.cleared || 0) + 1; S.buildings.splice(i, 1); }
    if (MODE === 'village') { const sel = SC.sel && SC.sel.ref; SC = buildVillage(); if (sel && sel.id !== w.key) SC.sel = SC.B.find(b => b.ref === sel) || null; for (let k = 0; k < 8; k++) puff(SC, w.x + (Math.random() - .5) * (w.w || 1), w.y + (Math.random() - .5) * (w.h || 1), 12, '#7a6a55'); floatText(SC, w.x, w.y, txt || (w.kind === 'demo' ? 'Demolito' : 'Rimosso'), '#ffe9a6', 1.4); sfx(w.kind === 'demo' ? 'crash' : 'coin'); }
  } else if (w.kind === 'train') {
    const rec = w.rec; const up = recGainXP(rec, w.xp || 40); rec.trainEnd = 0;
    const u = MODE === 'village' && SC && SC.U.find(u => !u.dead && u.side === 'V' && folkOf(u) === rec);
    if (u) floatText(SC, u.x, u.y, up ? `⬆ Livello ${rec.lvl}!` : `+${w.xp || 40} esp.`, up ? '#ffe08a' : '#cfe8ff', 1.5);
    toast(up ? `⬆ ${rec.nm} sale al livello ${rec.lvl}: hai un punto da spendere` : `🎯 ${rec.nm} ha finito l'addestramento`); sfx(up ? 'bell' : 'tock');
    if (SC && SC.folkU && folkOf(SC.folkU) === rec) openFolk(SC.folkU);
  }
  save(); updateHUD();
}
function worksTick() {
  if (!S || !S.works || !S.works.length) return; const t = now(); const done = S.works.filter(w => t >= w.end); if (!done.length) return;
  S.works = S.works.filter(w => t < w.end); for (const w of done) { if (w.kind === 'train') { const r = findRec(w.rid); if (!r) continue; w.rec = r; } finishWork(w); }
}
function findRec(id) { for (const k in (S.vets || {})) { const r = S.vets[k].find(r => r.id === id); if (r) return r; } for (const k in (S.wrk || {})) if (S.wrk[k].id === id) return S.wrk[k]; return null; }
// barre di avanzamento sulla mappa
function drawWorks(c, sc) {
  if (!S || !S.works || MODE !== 'village') return; const t = now();
  for (const w of S.works) {
    let x = w.x, y = w.y; if (w.kind === 'train') { const u = sc.U.find(u => { if (u.dead || u.side !== 'V') return false; const r = u.wrec || (UDEF[u.k] ? folkOf(u) : null); return r && r.id === w.rid; }); if (!u) continue; x = u.x; y = u.y; }
    const [px, py0] = W(x, y); const py = py0 - (w.kind === 'train' ? 58 : w.tree ? 92 : w.kind === 'demo' ? 70 : 34); const p = Math.min(1, 1 - (w.end - t) / w.d);
    c.fillStyle = 'rgba(20,14,8,0.8)'; c.beginPath(); c.roundRect ? c.roundRect(px - 24, py - 5, 48, 10, 5) : c.rect(px - 24, py - 5, 48, 10); c.fill();
    c.fillStyle = w.kind === 'train' ? '#6fb3ea' : w.kind === 'demo' ? '#d0643a' : '#d9b25a'; c.fillRect(px - 22, py - 3, 44 * p, 6);
    c.font = `700 10px ${THM().cf || 'serif'}`; c.textAlign = 'center'; c.fillStyle = '#fff3d6'; c.fillText((w.kind === 'train' ? '🎯 ' : w.kind === 'demo' ? '🔨 ' : '🪓 ') + fmtT(w.end - t), px, py - 9);
    if (w.kind !== 'train' && Math.random() < 0.02) puff(sc, x + (Math.random() - .5) * .5, y + (Math.random() - .5) * .5, 6, w.tree ? '#7a6a3a' : '#8a8278');
  }
}
// ================= STAGIONI & METEO =================
const SEASON_MS = 2 * 60 * 60 * 1000, WX_MS = 10 * 60 * 1000;
const SEASONS = [
  { k: 'primavera', n: 'Primavera', ic: '🌸', mod: { cibo: 1.1 }, fx: '+10% cibo', wx: { sereno: 35, nuvoloso: 25, pioggia: 30, vento: 10 } },
  { k: 'estate', n: 'Estate', ic: '☀️', mod: { oro: 1.1 }, fx: '+10% oro dai commerci', wx: { sereno: 55, nuvoloso: 15, pioggia: 10, temporale: 10, vento: 10 } },
  { k: 'autunno', n: 'Autunno', ic: '🍂', mod: { cibo: 1.2, legno: 1.1 }, fx: '+20% cibo (raccolto), +10% legno', wx: { sereno: 20, nuvoloso: 25, pioggia: 30, vento: 25 } },
  { k: 'inverno', n: 'Inverno', ic: '❄️', mod: { cibo: 0.7, legno: 0.9 }, fx: '-30% cibo, -10% legno', wx: { sereno: 20, nuvoloso: 20, neve: 45, vento: 15 } },
];
const WXN = { sereno: ['☀️', 'Sereno'], nuvoloso: ['⛅', 'Nuvoloso'], pioggia: ['🌧️', 'Pioggia'], temporale: ['⛈️', 'Temporale'], neve: ['🌨️', 'Neve'], vento: ['💨', 'Vento'] };
function seasonInfo() { if (!S) return { i: 0, s: SEASONS[0], left: SEASON_MS }; if (!S.seasonEpoch) S.seasonEpoch = now(); const e = now() - S.seasonEpoch; const i = Math.floor(e / SEASON_MS) % 4; return { i, s: SEASONS[i], left: SEASON_MS - (e % SEASON_MS), t: (e % SEASON_MS) / SEASON_MS }; }
function seasonMod(res) { if (!S || S.creative || !res) return 1; return seasonInfo().s.mod[res] || 1; }
function pickWx(s) { let tot = 0; for (const k in s.wx) tot += s.wx[k]; let r = Math.random() * tot; for (const k in s.wx) { r -= s.wx[k]; if (r <= 0) return k; } return 'sereno'; }
function wxTick() {
  if (!S) return; const si = seasonInfo();
  if (S.lastSeason !== si.i) { const first = S.lastSeason == null; S.lastSeason = si.i; if (!first && MODE === 'village') toast(`${si.s.ic} Arriva ${si.s.n === 'Estate' ? "l'" : 'la '}${si.s.n}: ${si.s.fx}`); S.wx = null; }
  if (!S.wx || now() > S.wx.end || (S.wx.k === 'neve' && si.i !== 3)) { const k = pickWx(si.s); const ws = k === 'vento' ? 0.75 + Math.random() * 0.25 : k === 'temporale' ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.35; S.wx = { k, end: now() + WX_MS, wa: (S.wx ? S.wx.wa : Math.random() * 6.28) + (Math.random() - 0.5) * 1.6, ws }; }
}
// --- rendering ---
const WX = { I: 0, k: 'sereno', drops: [], flakes: [], leaves: [], streaks: [], clouds: [], flash: 0, nextBolt: 4, snowA: 0, last: 0 };
let SNOWCV = null;
function snowCanvas() { if (SNOWCV && SNOWCV.pk === PATHC.key) return SNOWCV; const M = 8, Sz = NMAP * M; const cv2 = SNOWCV || document.createElement('canvas'); cv2.width = cv2.height = Sz; const x = cv2.getContext('2d'); const id = x.createImageData(Sz, Sz); const nz = makeNoise(77), nz2 = makeNoise(78), nz3 = makeNoise(79); const WV = villageWater();
  // manto di neve compatto: bordi netti, poche chiazze d'erba scoperta, leggere ombre azzurre
  for (let py = 0; py < Sz; py++) for (let px = 0; px < Sz; px++) { const u = px / M, v = py / M; const n = nz(u / 7, v / 7, 3) * 0.75 + nz2(u / 2, v / 2, 2) * 0.25; const a = Math.min(1, Math.max(0, (n - 0.27) / 0.05)); const f = nz3(u * 1.6, v * 1.6, 2); const o = (py * Sz + px) * 4; const sh = 232 + f * 22 + (n - 0.5) * 10; let wet = 0; if (WV) { const gx = Math.max(0, Math.min(NMAP - 1.001, u - 0.5)), gy = Math.max(0, Math.min(NMAP - 1.001, v - 0.5)), xi = gx | 0, yi = gy | 0, fx = gx - xi, fy = gy - yi, W0 = (X, Y) => WV[Math.min(NMAP - 1, Y) * NMAP + Math.min(NMAP - 1, X)] ? 1 : 0; wet = W0(xi, yi) * (1 - fx) * (1 - fy) + W0(xi + 1, yi) * fx * (1 - fy) + W0(xi, yi + 1) * (1 - fx) * fy + W0(xi + 1, yi + 1) * fx * fy; wet = smooth(0.15, 0.6, wet + (f - 0.5) * 0.3); }
    id.data[o] = sh - 8; id.data[o + 1] = sh - 3; id.data[o + 2] = Math.min(255, sh + 10); id.data[o + 3] = 255 * a * (1 - 0.9 * wet); }
  x.putImageData(id, 0, 0);
  // sentieri battuti: la neve è calpestata e sporca
  if (PATHC.lines) { const st = (w, al, col, op) => { x.globalCompositeOperation = op; x.globalAlpha = al; x.strokeStyle = col; x.lineWidth = w * M; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); for (const l0 of PATHC.lines) { const l = chaikin(l0); x.moveTo(l[0][0] * M, l[0][1] * M); for (let i = 1; i < l.length; i++) x.lineTo(l[i][0] * M, l[i][1] * M); } x.stroke(); };
    st(0.9, 0.35, '#000', 'destination-out'); st(0.6, 0.45, '#000', 'destination-out'); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; }
  cv2.pk = PATHC.key; return SNOWCV = cv2; }
function seasonGround(c, sc) {
  if (sc.mode !== 'village' && sc.mode !== 'visit') return; const si = seasonInfo(); const k = si.s.k;
  const tgt = k === 'inverno' ? Math.min(1, si.t * 8) * (si.t > 0.94 ? (1 - si.t) / 0.06 : 1) : 0; WX.snowA += (tgt - WX.snowA) * 0.02;
  c.save(); tileTransform(c, 1);
  if (k === 'autunno') { c.globalCompositeOperation = 'soft-light'; c.fillStyle = 'rgba(210,120,30,0.55)'; c.fillRect(0, 0, NMAP, NMAP); }
  else if (k === 'estate') { c.globalCompositeOperation = 'soft-light'; c.fillStyle = 'rgba(255,215,120,0.35)'; c.fillRect(0, 0, NMAP, NMAP); }
  else if (k === 'primavera') { c.globalCompositeOperation = 'soft-light'; c.fillStyle = 'rgba(120,220,90,0.3)'; c.fillRect(0, 0, NMAP, NMAP); }
  c.restore();
  if (WX.snowA > 0.01) { c.save(); tileTransform(c, 8); c.globalAlpha = WX.snowA * 0.95; c.drawImage(snowCanvas(), 0, 0); c.restore(); }
}
function treeSeasonTint(kind, base, k3) {
  if (!S || MODE !== 'village') return base; const s = seasonInfo().s.k;
  if (s === 'autunno' && kind === 'quercia') return ['rgba(200,105,20,0.45)', 'rgba(215,150,30,0.42)', 'rgba(165,60,20,0.45)'][k3];
  if (s === 'inverno') return kind === 'quercia' ? 'rgba(228,234,242,0.55)' : 'rgba(236,242,250,0.33)';
  if (s === 'primavera' && kind === 'quercia') return ['rgba(150,235,90,0.16)', 'rgba(255,200,220,0.14)', 'rgba(150,235,90,0.1)'][k3];
  return base;
}
// direzione del vento fissa sullo schermo: ruotare la mappa non cambia pioggia, neve e raffiche
function windScreen() { const w = S && S.wx; if (!w) return [0.3, 0]; const sgn = Math.cos(w.wa) >= 0 ? 1 : -1; return [sgn * (0.55 + 0.45 * Math.abs(Math.cos(w.wa))) * w.ws, 0.15 * Math.sin(w.wa) * w.ws]; }
function drawWeather(c, sc, dt) {
  if (sc.mode !== 'village' && sc.mode !== 'visit') return;
  const W0 = cv.width, H0 = cv.height, D = DPR; const w = (S && S.wx) || { k: 'sereno', ws: 0.2 }; const k = w.k;
  const on = { rain: k === 'pioggia' || k === 'temporale', snow: k === 'neve', wind: k === 'vento' || w.ws > 0.7, cloud: k !== 'sereno' && k !== 'vento' };
  WX.I += ((on.rain || on.snow || on.cloud || on.wind ? 1 : 0) - WX.I) * Math.min(1, dt * 0.4);
  const [wx, wy] = windScreen(); const I = WX.I;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  // nuvole: ombre morbide che scorrono col vento
  if (on.cloud || on.rain || on.snow) {
    while (WX.clouds.length < 5) WX.clouds.push({ x: Math.random() * W0, y: Math.random() * H0, r: (180 + Math.random() * 220) * D });
    c.globalAlpha = 0.18 * I * (k === 'temporale' ? 1.6 : 1);
    for (const cl of WX.clouds) { cl.x += (wx * 40 + 6) * D * dt; cl.y += wy * 20 * D * dt; if (cl.x - cl.r > W0) { cl.x = -cl.r; cl.y = Math.random() * H0; } if (cl.x + cl.r < -cl.r) cl.x = W0 + cl.r; const g = c.createRadialGradient(cl.x, cl.y, 0, cl.x, cl.y, cl.r); g.addColorStop(0, 'rgba(15,22,35,1)'); g.addColorStop(1, 'rgba(15,22,35,0)'); c.fillStyle = g; c.fillRect(cl.x - cl.r, cl.y - cl.r, cl.r * 2, cl.r * 2); }
    c.globalAlpha = 1;
  }
  if (on.rain) { c.fillStyle = `rgba(20,30,48,${(k === 'temporale' ? 0.28 : 0.16) * I})`; c.fillRect(0, 0, W0, H0); }
  if (on.snow) { c.fillStyle = `rgba(225,235,250,${0.1 * I})`; c.fillRect(0, 0, W0, H0); }
  // pioggia
  const nR = on.rain ? Math.round(QQ().fx * (k === 'temporale' ? 320 : 200) * I * Math.min(1.4, W0 * H0 / (1200 * 800 * D * D) + 0.4)) : 0;
  while (WX.drops.length < nR) WX.drops.push({ x: Math.random() * W0, y: Math.random() * H0, l: (14 + Math.random() * 14) * D, v: (650 + Math.random() * 350) * D });
  if (WX.drops.length > nR) WX.drops.length = nR;
  if (nR) { c.strokeStyle = 'rgba(200,218,240,0.55)'; c.lineWidth = 1.1 * D; c.beginPath(); const sl = wx * 0.9;
    for (const d of WX.drops) { d.y += d.v * dt; d.x += sl * d.v * dt; if (d.y > H0) { d.y = -d.l; d.x = Math.random() * (W0 + 200 * D) - 100 * D; if (Math.random() < 0.3) WX.streaks.push({ x: d.x, y: Math.random() * H0, t: 0, sp: 1 }); } if (d.x > W0 + 50) d.x -= W0 + 100; if (d.x < -50) d.x += W0 + 100; c.moveTo(d.x, d.y); c.lineTo(d.x + sl * d.l, d.y + d.l); }
    c.stroke();
    c.strokeStyle = 'rgba(210,225,245,0.5)'; c.lineWidth = 1 * D; for (const s of WX.streaks) if (s.sp) { s.t += dt * 3; c.beginPath(); c.ellipse(s.x, s.y, 2 * D + s.t * 6 * D, 1 * D + s.t * 2 * D, 0, 0, 7); c.globalAlpha = Math.max(0, 1 - s.t); c.stroke(); } c.globalAlpha = 1;
    WX.streaks = WX.streaks.filter(s => !s.sp || s.t < 1).slice(-80);
  }
  // fulmini
  if (k === 'temporale' && I > 0.6) { WX.nextBolt -= dt; if (WX.nextBolt <= 0) { WX.flash = 1; WX.nextBolt = 5 + Math.random() * 9; setTimeout(() => sfx('crash'), 400 + Math.random() * 900); } }
  if (WX.flash > 0) { c.fillStyle = `rgba(235,240,255,${WX.flash * 0.55})`; c.fillRect(0, 0, W0, H0); WX.flash -= dt * 3.5; }
  // neve
  const nS = on.snow ? Math.round(260 * I * Math.min(1.4, W0 * H0 / (1200 * 800 * D * D) + 0.4)) : 0;
  while (WX.flakes.length < nS) WX.flakes.push({ x: Math.random() * W0, y: Math.random() * H0, r: (1 + Math.random() * 2.4) * D, v: (28 + Math.random() * 45) * D, p: Math.random() * 6 });
  if (WX.flakes.length > nS) WX.flakes.length = nS;
  if (nS) { c.fillStyle = 'rgba(255,255,255,0.9)'; for (const f of WX.flakes) { f.p += dt * 1.6; f.y += f.v * dt * (1 + w.ws * 0.6); f.x += (Math.sin(f.p) * 18 + wx * 120) * D * dt; if (f.y > H0) { f.y = -4; f.x = Math.random() * W0; } if (f.x > W0 + 10) f.x = -10; if (f.x < -10) f.x = W0 + 10; c.beginPath(); c.arc(f.x, f.y, f.r, 0, 7); c.fill(); } }
  // vento: raffiche e foglie
  const sk = seasonInfo().s.k; const nL = (on.wind ? 26 : sk === 'autunno' ? 10 : 0) * (on.wind ? I : 1);
  while (WX.leaves.length < nL) WX.leaves.push({ x: Math.random() * W0, y: Math.random() * H0, a: Math.random() * 6, s: (3 + Math.random() * 3) * D, v: 0.6 + Math.random() * 0.8, col: sk === 'autunno' ? ['#c8641c', '#e0a03a', '#9a3a16', '#d48a2a'][(Math.random() * 4) | 0] : sk === 'inverno' ? '#e8eef5' : ['#6f9a3a', '#89b04a', '#4f7a2a'][(Math.random() * 3) | 0] });
  if (WX.leaves.length > nL) WX.leaves.length = Math.max(0, Math.round(nL));
  const ws2 = Math.max(0.25, w.ws), dirx = wx / (Math.hypot(wx, wy) || 1) || 1;
  for (const L of WX.leaves) { L.a += dt * 5 * L.v; L.x += (dirx * 260 * ws2 * L.v) * D * dt; L.y += (Math.sin(L.a * 0.7) * 30 + 22) * D * dt; if (L.x > W0 + 20) { L.x = -20; L.y = Math.random() * H0; } if (L.x < -20) { L.x = W0 + 20; L.y = Math.random() * H0; } if (L.y > H0 + 20) L.y = -20;
    c.save(); c.translate(L.x, L.y); c.rotate(L.a); c.scale(1, Math.abs(Math.cos(L.a * 1.3)) * 0.8 + 0.2); c.fillStyle = L.col; c.beginPath(); c.ellipse(0, 0, L.s, L.s * 0.5, 0, 0, 7); c.fill(); c.restore(); }
  if (on.wind) { if (Math.random() < dt * 6 * I) WX.streaks.push({ x: dirx > 0 ? -200 * D : W0, y: Math.random() * H0, t: 0, len: (120 + Math.random() * 200) * D, sp: 0 });
    c.lineWidth = 1.4 * D; for (const s of WX.streaks) if (!s.sp) { s.t += dt; s.x += dirx * 900 * D * dt; const al = Math.sin(Math.min(1, s.t / 0.9) * Math.PI) * 0.35; c.strokeStyle = `rgba(255,255,255,${al})`; c.beginPath(); c.moveTo(s.x, s.y); c.quadraticCurveTo(s.x + s.len * 0.5 * dirx, s.y - 6 * D, s.x + s.len * dirx, s.y + Math.sin(s.t * 4) * 4 * D); c.stroke(); }
    WX.streaks = WX.streaks.filter(s => s.sp || s.t < 0.9); }
  c.restore();
}
// --- indicatore in alto a destra: bussola + meteo ---
function compassAngle() { const v = rotV(-1, -1); const sx = (v[0] - v[1]) * 32, sy = (v[0] + v[1]) * 16; return Math.atan2(sx, -sy); }
function updateWxWidget() {
  let el = $('#wxw'); if (!el) return; if (!S || MODE !== 'village') { el.classList.add('hidden'); return; } el.classList.remove('hidden');
  const si = seasonInfo(), w = S.wx || { k: 'sereno', ws: 0.2 }; let [ic, nm] = WXN[w.k]; if (w.k === 'sereno' && dayInfo().night > 0.5) { ic = '🌙'; nm = 'Notte serena'; }
  const ang = compassAngle() * 180 / Math.PI; const wv = rotV(Math.cos(w.wa || 0), Math.sin(w.wa || 0)); const wa = Math.atan2(wv[0] - wv[1], -(wv[0] + wv[1]) / 2) * 180 / Math.PI;
  const key = dayInfo().n + '|' + si.i + '|' + w.k + '|' + Math.round(ang) + '|' + Math.round(wa / 5) + '|' + Math.floor(si.left / 10000);
  if (el.dataset.k === key) return; el.dataset.k = key;
  const mm = Math.floor(si.left / 60000), ss = Math.floor(si.left / 1000) % 60;
  el.innerHTML = `<div class="wxp"><span class="wi">${ic}</span><div class="wt"><b>${nm}</b><small>${dayInfo().ic} ${dayInfo().n} · ${si.s.ic} ${si.s.n}</small></div></div>
    <div class="cmp"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" class="r1"/><circle cx="32" cy="32" r="24" class="r2"/>
      <g transform="rotate(${ang.toFixed(1)} 32 32)">${['N', 'E', 'S', 'O'].map((l, i) => `<text x="32" y="15" transform="rotate(${i * 90} 32 32)" class="${l === 'N' ? 'n' : ''}">${l}</text>`).join('')}
      <path d="M32 12 37 32 32 30 27 32z" class="nd"/><path d="M32 52 37 32 32 34 27 32z" class="sd"/></g>
      <g transform="rotate(${wa.toFixed(1)} 32 32)" opacity="${Math.min(1, 0.35 + w.ws)}"><path d="M32 4 35 10 29 10z" class="wd"/></g><circle cx="32" cy="32" r="2.6" class="hub"/></svg></div>`;
  const r = $('#res').getBoundingClientRect(), q = $('#quest').getBoundingClientRect(), e = $('#era').getBoundingClientRect(); el.style.top = ((VW < 700 ? Math.max(q.bottom, e.bottom) : r.bottom) + 6) + 'px';
}
function openWeather() {
  const si = seasonInfo(), w = S.wx || { k: 'sereno', ws: 0.2 }; const [ic, nm] = WXN[w.k];
  const order = [0, 1, 2, 3].map(j => SEASONS[(si.i + j) % 4]);
  openSheet(`${ic} Meteo e stagioni`, `<div class="wxs"><div class="row"><b>Ora:</b> ${nm}${w.ws > 0.7 ? ' · vento forte' : w.ws > 0.4 ? ' · vento moderato' : ' · brezza'}</div>
    <div class="row"><b>${si.s.ic} ${si.s.n}</b> — ${si.s.fx}. Finisce tra ${Math.ceil(si.left / 60000)} min. Prossimo cambio del tempo tra ${Math.ceil(Math.max(0, w.end - now()) / 60000)} min.</div>
    <div class="slist">${order.map((s, j) => `<div class="${j ? '' : 'on'}"><span>${s.ic}</span><b>${s.n}</b><small>${s.fx}</small></div>`).join('')}</div>
    <p class="desc">Ogni stagione dura due ore (un anno è circa una giornata) e il tempo cambia ogni 10 minuti, anche a gioco chiuso. Mezz'ora prima del cambio arriva l'avviso. La bussola mostra dove si trova il Nord mentre ruoti la mappa; la freccia azzurra indica da dove soffia il vento.</p></div>`, 'wx');
}
// ---------- fauna: animali selvatici e caccia ----------
function wildOk(x, y) { const ix = x | 0, iy = y | 0; if (ix < 2 || iy < 2 || ix >= N - 2 || iy >= N - 2) return false; if (villageWater()[iy * N + ix]) return false; if (Math.hypot(x - MCX, y - MCX) < 13) return false; return !S.buildings.some(b => !BDEF[b.t].decor && ix >= b.x && ix < b.x + BDEF[b.t].w && iy >= b.y && iy < b.y + BDEF[b.t].h); }
function spawnFauna(k) {
  if (k === 'lupo') { for (let t = 0; t < 60; t++) { const a = Math.random() * 6.283, r = 16 + Math.random() * (N / 2 - 20); const x = MCX + Math.cos(a) * r, y = MCX + Math.sin(a) * r; if (!wildOk(x, y)) continue;
      const n = Math.random() < 0.5 ? 1 : 2 + (Math.random() < 0.4 ? 1 : 0); const lid = S.nextId; let made = 0;
      for (let i = 0; i < n; i++) { const px = x + (i ? (Math.random() - .5) * 5 : 0), py = y + (i ? (Math.random() - .5) * 5 : 0); if (!wildOk(px, py)) continue; S.fauna.push({ id: S.nextId++, k, x: px, y: py, tx: px, ty: py, wt: Math.random() * 3, fl: Math.random() < .5, ph: Math.random() * 6, pack: n > 1 ? lid : 0 }); made++; }
      return made; } return 0; }
  for (let t = 0; t < 60; t++) { const a = Math.random() * 6.283, r = 16 + Math.random() * (N / 2 - 20); const x = MCX + Math.cos(a) * r, y = MCX + Math.sin(a) * r; if (wildOk(x, y)) { S.fauna.push({ id: S.nextId++, k, x, y, tx: x, ty: y, wt: Math.random() * 3, fl: Math.random() < .5, ph: Math.random() * 6 }); return true; } } return false; }
function faunaFill(all) { S.fauna = S.fauna || []; S.fauna = S.fauna.filter(a => FAUNA[a.k] && (faunaOk(a.k) || a.dying != null)); for (const k in FAUNA) { if (!faunaOk(k)) continue; let n = S.fauna.filter(a => a.k === k).length; while (n < FAUNA[k].max) { const m = spawnFauna(k); if (!m) break; n += m === true ? 1 : m; if (!all) return; } } }
function faunaTick(dt) {
  if (!S.fauna) return; S.faunaIn = (S.faunaIn || 0) - dt; if (S.faunaIn <= 0) { S.faunaIn = seasonInfo().s.k === 'primavera' ? 40 : seasonInfo().s.k === 'inverno' ? 110 : 75; faunaFill(false); }
  const live = S.fauna.filter(a => a.dying == null);
  const byId = {}; for (const a of live) byId[a.id] = a;
  // packs: keep a living leader
  for (const a of live) if (a.k === 'lupo' && a.pack && !byId[a.pack]) { const mem = live.filter(o => o.pack === a.pack); if (mem.length > 1) { const nl = mem[0].id; for (const o of mem) o.pack = nl; } else a.pack = 0; }
  // ---- scontri tra lupi e bestie forti (orso, cinghiale): conta il numero ----
  const near = (a) => Math.hypot(a.x - MCX, a.y - MCX) < 34 && SC && MODE === 'village';
  for (const bear of live) {
    const SG = STRONG[bear.k]; if (!SG || bear.fight || (bear.fcd || 0) > 0) continue;
    let w0 = null, wd = SG.reach; for (const o of live) if (o.k === 'lupo' && !o.infight && !((o.fcd || 0) > 0) && (bear.k === 'orso' || !o.sated || o.chId === bear.id)) { const d2 = Math.hypot(o.x - bear.x, o.y - bear.y); if (d2 < wd) { wd = d2; w0 = o; } }
    if (!w0) continue;
    const grp = live.filter(o => o.k === 'lupo' && !o.infight && !((o.fcd || 0) > 0) && (o === w0 || (w0.pack && o.pack === w0.pack)) && Math.hypot(o.x - w0.x, o.y - w0.y) < 6);
    for (const o of grp) { o.tx = bear.x; o.ty = bear.y; o.charge = 2.3; }
    bear.tx = w0.x; bear.ty = w0.y; bear.charge = bear.k === 'cinghiale' ? 2.4 : 1.8;
    if (grp.some(o => Math.hypot(o.x - bear.x, o.y - bear.y) < 1.1)) {
      const n = Math.min(3, grp.length), wolvesWin = Math.random() < SG.p[n];
      bear.fight = { t: 0, wolves: grp.map(o => o.id), win: wolvesWin ? 'lupi' : 'bestia' }; bear.infight = true; for (const o of grp) o.infight = bear.id;
      if (near(bear)) { floatText(SC, bear.x, bear.y, grp.length > 1 ? `🐺×${grp.length} attaccano ${SG.art}!` : `${SG.e} contro 🐺!`, '#f3c9a8', 1.4); sfx('hit'); }
    }
  }
  for (const bear of live) if (bear.fight) {
    const F2 = bear.fight, SG = STRONG[bear.k]; F2.t += dt; const ws = F2.wolves.map(id => byId[id]).filter(Boolean);
    if (F2.t > 2.2 || !ws.length) {
      if (F2.win === 'lupi' && ws.length) { bear.dying = 0; for (const o of ws) { o.sated = 90; o.fcd = 20; } if (near(bear)) { floatText(SC, bear.x, bear.y, ws.length > 1 ? `🐺 il branco ha abbattuto ${SG.art}` : `🐺 il lupo ha avuto la meglio sul${SG.k === 'orso' ? "l'orso" : ' cinghiale'}`, '#f3c9a8', 1.8); for (let i = 0; i < 5; i++) puff(SC, bear.x + (Math.random() - .5) * .6, bear.y + (Math.random() - .5) * .6, 6, '#8a2a1a'); } }
      else if (ws.length) { const dead = ws[0]; dead.dying = 0; for (const o of ws.slice(1)) { o.fcd = 30; o.hunting = false; const ex = o.x - bear.x, ey = o.y - bear.y, el = Math.hypot(ex, ey) || 1; o.tx = o.x + ex / el * 6; o.ty = o.y + ey / el * 6; o.charge = 2; } bear.sated = 40; bear.fcd = 25; if (near(bear)) { floatText(SC, bear.x, bear.y, `${SG.e} ${SG.art} ha ${SG.k === 'orso' ? 'sbranato' : 'sventrato'} il lupo${ws.length > 1 ? ', il branco fugge' : ''}`, '#f3c9a8', 1.8); for (let i = 0; i < 4; i++) puff(SC, dead.x + (Math.random() - .5) * .5, dead.y + (Math.random() - .5) * .5, 5, '#8a2a1a'); } }
      for (const o of ws) o.infight = 0; bear.fight = null; bear.infight = false; if (near(bear)) sfx('hit');
    }
  }
  for (const a of S.fauna) {
    if (a.dying != null) { a.dying += dt; continue; }
    a.gph = (a.gph || Math.random() * 10) + dt * 1.6; if (a.atk > 0) a.atk -= dt; if (a.fcd > 0) a.fcd -= dt;
    if (a.infight) { a.mv = false; if (!(a.atk > 0)) a.atk = 0.8; const op = STRONG[a.k] ? byId[(a.fight && a.fight.wolves[0])] : byId[a.infight]; if (op) { const sv = rotV(op.x - a.x, op.y - a.y); a.fl = (sv[0] - sv[1]) < 0; } continue; }
    const chg = a.charge; a.charge = 0;
    if (!chg && a.k === 'lupo' && a.pack && a.pack !== a.id && byId[a.pack]) { const L = byId[a.pack], dl = Math.hypot(L.x - a.x, L.y - a.y); if (dl > 8) { a.tx = L.x + (Math.random() - .5) * 5; a.ty = L.y + (Math.random() - .5) * 5; a.fast = 1.4; } else if (!a.hunting && Math.hypot(a.tx - a.x, a.ty - a.y) < 0.05 && a.wt <= 0) { const nx = L.tx + (Math.random() - .5) * 7, ny = L.ty + (Math.random() - .5) * 7; if (wildOk(nx, ny)) { a.tx = nx; a.ty = ny; a.wt = 2 + Math.random() * 5; } } }
    const pred = a.k === 'lupo' || a.k === 'orso'; a.sated = Math.max(0, (a.sated || 0) - dt); a.fast = 1; if (chg) { a.fast = chg; a.hunting = true; }
    if (pred && !a.sated && !chg) { let prey = null, pd = a.k === 'lupo' ? 7 : 5; if (a.ignT > 0) a.ignT -= dt; for (const o of live) if (!o.huntBy && (PREY[o.k] || (a.k === 'lupo' && o.k === 'cinghiale' && !o.infight)) && o.dying == null && (a.k === 'lupo' || o.k !== 'lepre') && !(a.ignT > 0 && a.ign === o.id)) { const d2 = Math.hypot(o.x - a.x, o.y - a.y) * (o.k === 'lepre' ? 2.2 : 1); if (d2 < pd) { pd = d2; prey = o; } } if (prey) pd = Math.hypot(prey.x - a.x, prey.y - a.y);
      if (prey && a.chId === prey.id) { a.chT = (a.chT || 0) + dt; if (a.chT > (prey.k === 'lepre' ? 3 : 7)) { a.ign = prey.id; a.ignT = 40; a.sated = 20; a.chT = 0; a.chId = 0; prey = null; a.hunting = false; a.tx = a.x; a.ty = a.y; a.wt = 3; } } else if (prey) { a.chId = prey.id; a.chT = 0; }
      if (prey) { a.tx = prey.x; a.ty = prey.y; a.fast = a.k === 'lupo' ? 2.2 : 1.8; a.hunting = true;
        if (pd < 1.4 && !(a.atk > 0)) a.atk = 0.8;
        if (pd < 0.7 && !STRONG[prey.k]) { prey.dying = 0; a.sated = 100; a.chId = 0; a.hunting = false; a.tx = a.x; a.ty = a.y; a.wt = 6; if (SC && MODE === 'village') { for (let i = 0; i < 4; i++) puff(SC, prey.x + (Math.random() - .5) * .5, prey.y + (Math.random() - .5) * .5, 5, '#8a2a1a'); if (Math.hypot(prey.x - MCX, prey.y - MCX) < 30) floatText(SC, prey.x, prey.y, `${a.k === 'lupo' ? '🐺' : '🐻'} ha cacciato ${FAUNA[prey.k].n.split(' ')[0].toLowerCase()}`, '#f3c9a8', 1.6); sfx('hit'); } }
      } else a.hunting = false; }
    if (!pred && a.k !== 'cinghiale') { let th = null, td = 4.5; for (const o of live) if ((o.k === 'lupo' || o.k === 'orso') && o.hunting) { const d2 = Math.hypot(o.x - a.x, o.y - a.y); if (d2 < td) { td = d2; th = o; } }
      if (th) { const ex = a.x - th.x, ey = a.y - th.y, el = Math.hypot(ex, ey) || 1; let nx = a.x + ex / el * 3, ny = a.y + ey / el * 3; if (!wildOk(nx, ny)) { nx = a.x + ey / el * 3; ny = a.y - ex / el * 3; } a.tx = nx; a.ty = ny; a.fast = 2; a.wt = 1; } }
    if (a.huntBy) a.fast = Math.min(a.fast || 1, 0.6);
    const F = FAUNA[a.k], dx = a.tx - a.x, dy = a.ty - a.y, d = Math.hypot(dx, dy);
    if (d < 0.05) { a.mv = false; a.wt -= dt; if (a.wt <= 0) { for (let t = 0; t < 8; t++) { const nx = a.x + (Math.random() - .5) * 8, ny = a.y + (Math.random() - .5) * 8; if (wildOk(nx, ny)) { a.tx = nx; a.ty = ny; break; } } a.wt = 2 + Math.random() * 6; } }
    else { const st = Math.min(d, F.spd * a.fast * dt); const nx = a.x + dx / d * st, ny = a.y + dy / d * st; if (wildOk(nx, ny)) { a.x = nx; a.y = ny; a.mv = true; a.ph += dt * 9; const sv = rotV(dx, dy); a.fl = (sv[0] - sv[1]) < 0; } else { a.tx = a.x; a.ty = a.y; } }
  }
  S.fauna = S.fauna.filter(a => a.dying == null || a.dying < 1.6);
}
function pickAnimal(sx, sy, tx, ty) {
  if (!S || !S.fauna || MODE !== 'village') return null; let best = null, bd = 1.1;
  for (const a of S.fauna) { if (a.dying != null) continue; const d = Math.hypot(a.x - tx, a.y - ty); if (d < bd) { bd = d; best = a; } }
  if (best) return best;
  const wx = (sx - VW / 2) / cam.z + cam.x, wy = (sy - VH / 2) / cam.z + cam.y;
  for (const a of S.fauna) { if (a.dying != null) continue; const [bx, by] = W(a.x, a.y); const w = FAUNA[a.k].w; if (Math.abs(wx - bx) < w / 2 && wy < by + 4 && wy > by - w * 0.9) return a; }
  return null;
}
function soldiers() { return Object.keys(S.army).reduce((s, k) => s + (S.army[k] || 0), 0); }
function openAnimal(a) {
  const F = FAUNA[a.k]; SC.selA = a; SC.sel = null; SC.selN = null;
  const can = soldiers() >= F.need; const risk = Math.round(F.risk * DF().edmg * (1 - curePct()) * 100);
  openSheet(`🏹 ${F.n}`, `<p class="desc">${F.desc}</p><div class="stats"><span>Bottino ${Object.keys(F.gain).map(k => ICO(k) + ' +' + F.gain[k]).join(' ')}</span>${F.need ? `<span>Battuta: ${F.need} soldati (hai ${soldiers()})</span><span>Rischio di perdere un uomo: ${risk}%</span>` : '<span>Caccia sicura</span>'}</div><div class="acts">${a.huntBy ? '<button class="btn dis">🏹 I cacciatori sono in cammino…</button>' : can ? `<button class="btn" onclick="huntAnimal(${a.id})">🏹 Caccia</button>` : `<button class="btn dis">Servono ${F.need} soldati</button>`}</div>`, 'a');
}
// ---- la caccia vera: il cacciatore parte dal Mastio, cammina fino all'animale, tira e torna ----
function huntAnimal(id) {
  const a = S.fauna.find(f => f.id === id); if (!a || a.dying != null) return; const F = FAUNA[a.k];
  if (soldiers() < F.need) return; if (a.huntBy) { toast('🏹 I cacciatori sono già sulle sue tracce'); return; }
  S.hunts = (S.hunts || []).filter(h => S.fauna.some(f => f.id === h)); S.hunts.push(id); a.huntBy = 1;
  hunterSpawn(SC, a); SC.selA = null; closeSheet(); sfx('horn'); save();
  toast(F.need ? `🏹 La battuta di caccia parte verso ${F.n.toLowerCase()}` : `🏹 Il cacciatore parte verso ${F.n.toLowerCase()}`);
}
function hunterSpawn(sc, a) {
  if (!sc || sc.mode !== 'village') return; const m = sc.B.find(b => b.t === 'mastio'); if (!m) return; const [hx, hy] = frontTile(sc, m); const F = FAUNA[a.k];
  const pos = a.hpos || [hx + 0.5, hy + 0.5]; const n = Math.max(1, Math.min(4, F.need || 1)); const kinds = ['arccorto', 'miliziano', 'arccorto', 'scudata'];
  for (let i = 0; i < n; i++) { const u = mkUnit(kinds[i], 'V', pos[0] + i * 0.3, pos[1] + (i % 2) * 0.3); u.d = Object.assign({}, UDEF[kinds[i]], { spd: 0.95 }); u.hunter = a.id; u.hLead = i === 0; u.st = 'go'; u.rp = 0; u.delay = i * 0.5; u.home = [hx, hy]; u.ai = hunterAI; sc.U.push(u); }
}
function hunterAI(sc, u, dt) {
  if (u.delay > 0) { u.delay -= dt; return; }
  if (u.st === 'back') { if (!u.path || followPath(sc, u, dt)) { u.dead = true; u.deadT = 9; } return; }
  const a = S.fauna.find(f => f.id === u.hunter && f.dying == null);
  if (!a) { if (u.hLead) { S.hunts = (S.hunts || []).filter(h => h !== u.hunter); floatText(sc, u.x, u.y, 'La preda è sfuggita', '#ffe9a6', 1.6); }
    u.st = 'back'; u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => x === u.home[0] && y === u.home[1], villagerCost(sc), u.home[0], u.home[1], 6000); u.pi = 0; return; }
  const d = Math.hypot(a.x - u.x, a.y - u.y); if (u.hLead) a.hpos = [u.x, u.y];
  if (u.hLead && d < 3.2) { u.moving = false; setFace(u, a.x - u.x, a.y - u.y); u.aim = (u.aim || 0) + dt; a.tx = a.x; a.ty = a.y; a.wt = 2;
    if (u.aim > 0.9) { sfx('bow'); shoot(sc, u.x, u.y, 26, { x: a.x, y: a.y, dead: true }, 0, 'arrow', u); u.resT = 0.45; u.aim = -99; } if (u.resT > 0) { u.resT -= dt; if (u.resT <= 0) huntResolve(a.id); } return; }
  if (!u.hLead) { const L = sc.U.find(o => o.hunter === u.hunter && o.hLead && !o.dead); if (L && Math.hypot(L.x - u.x, L.y - u.y) < 1.4) { u.moving = false; return; } }
  u.rp -= dt; if (u.rp <= 0 || !u.path || u.pi >= u.path.length) { u.rp = 3; const tx = Math.floor(a.x), ty = Math.floor(a.y); u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => Math.hypot(x + 0.5 - a.x, y + 0.5 - a.y) < 2.4, (x, y) => sc.water[y * N + x] ? Infinity : (bAt(sc, x, y) && !BDEF[bAt(sc, x, y).t].decor ? Infinity : (sc.pathG && sc.pathG[y * N + x] ? 1 : 1.6)), tx, ty, 6000); u.pi = 0; if (u.path && u.path.length > 1 && u.path[0][0] === Math.floor(u.x) && u.path[0][1] === Math.floor(u.y)) u.pi = 1; }
  if (u.path) { followPath(sc, u, dt); if (u.hLead) { u.stT = (u.stT || 0) - dt; if (u.stT <= 0) { u.stT = 0.42; const [px, py] = W(u.x, u.y); const sx = (px - cam.x) * cam.z + VW / 2, sy = (py - cam.y) * cam.z + VH / 2; if (sx > 0 && sx < VW && sy > 0 && sy < VH) sfx('step'); } } }
}
function huntResolve(id) {
  const a = S.fauna.find(f => f.id === id); if (!a || a.dying != null) return; const F = FAUNA[a.k];
  S.hunts = (S.hunts || []).filter(h => h !== id);
  const got = {}; for (const k in F.gain) got[k] = addRes(k, F.gain[k]);
  let lost = '';
  if (F.risk && Math.random() < F.risk * DF().edmg * (1 - curePct())) { const ks = UNIT_ORDER.filter(k => S.army[k] > 0); const k = ks[0]; if (k) { S.army[k]--; lost = ` — ${UDEF[k].n} caduto nella caccia`; } }
  a.dying = 0; S.hunted = (S.hunted || 0) + 1; if (a.k === 'orso') S.bears = (S.bears || 0) + 1;
  for (let i = 0; i < 4; i++) puff(SC, a.x + (Math.random() - .5) * .5, a.y + (Math.random() - .5) * .5, 6, '#7a6a55');
  floatText(SC, a.x, a.y, Object.keys(got).filter(k => got[k] > 0).map(k => `+${got[k]}${RICON[k]}`).join(' ') || 'Magazzini pieni', '#ffe9a6', 1.5);
  if (lost) toast('🐻' + lost);
  sfx('hit'); save(); updateHUD();
  if (SC) for (const u of SC.U) if (u.hunter === id && !u.dead) { u.st = 'back'; u.delay = 1.2; u.path = astar(Math.floor(u.x), Math.floor(u.y), (x, y) => x === u.home[0] && y === u.home[1], villagerCost(SC), u.home[0], u.home[1], 6000); u.pi = 0; }
}
// ---------- modalità città al massimo ----------
function buildMaxState(lvl) {
  S = newState(); S.mastio = lvl; S.sandbox = lvl; S.mq = 99; S.natInit = S.natBig = S.natHuge = 1;
  const cx = MCX | 0;
  S.buildings = [{ id: S.nextId++, t: 'mastio', x: cx - 1, y: cx - 1, lvl, stock: 0, end: 0 }];
  const free = (t, x, y) => { const d = BDEF[t]; if (!canPlace(t, x, y)) return false; if (lvl > 8 && x < cx + 5 && x + d.w > cx - 4 && y < cx + 5 && y + d.h > cx - 4) return false; return !occupiedBy(x - 1, y - 1, d.w + 2, d.h + 2) ; };
  const place = (t, lv) => { const d = BDEF[t]; for (let r = 2; r < 30; r++) { const cand = []; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Math.max(Math.abs(dx), Math.abs(dy)) === r) cand.push([cx + dx, cx + dy]); cand.sort(() => Math.random() - .5); for (const [x, y] of cand) if (free(t, x, y)) { S.buildings.push({ id: S.nextId++, t, x, y, lvl: lv, stock: 0, end: 0 }); return true; } } return false; };
  const order = ['municipio', 'caserma', 'poligono', 'scuderia', 'monastero', 'accademia', 'chiesa', 'mercato', 'fattoria', 'miniera', 'taverna', 'capanna', 'fucina', 'armeria', 'infermeria', 'granaio', 'tesoreria', 'cava', 'casa', 'balista', 'cancello', 'torre'];
  for (const t of order) { const d = BDEF[t]; const n = maxB(t); for (let i = 0; i < n; i++) place(t, d.decor ? 1 : bLvlCap()); }
  // cinta di palizzata / mura attorno al borgo
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; for (const b of S.buildings) { const d = BDEF[b.t]; x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + d.w); y1 = Math.max(y1, b.y + d.h); }
  x0 -= 2; y0 -= 2; x1 += 1; y1 += 1; let walls = maxB('muro'); const wl = lvl >= 5 ? 2 : 1; const ring = [];
  for (let x = x0; x <= x1; x++) { ring.push([x, y0], [x, y1]); } for (let y = y0 + 1; y < y1; y++) { ring.push([x0, y], [x1, y]); }
  const midx = (x0 + x1) >> 1, midy = (y0 + y1) >> 1;
  for (const [x, y] of ring) { if (walls <= 0) break; if (Math.abs(x - midx) <= 1 || Math.abs(y - midy) <= 1) continue; if (canPlace('muro', x, y)) { S.buildings.push({ id: S.nextId++, t: 'muro', x, y, lvl: wl, stock: 0, end: 0 }); walls--; } }
  const addAt = (t, x, y) => { if (canPlace(t, x, y)) { S.buildings.push({ id: S.nextId++, t, x, y, lvl: BDEF[t].decor ? 1 : bLvlCap(), stock: 0, end: 0 }); return true; } return false; };
  if (lvl >= 9) { // Età dei Castelli: torri agli angoli della cinta e stendardi alle porte
    for (const [x, y] of [[x0 + 1, y0 + 1], [x1 - 1, y0 + 1], [x0 + 1, y1 - 1], [x1 - 1, y1 - 1]]) addAt('torre', x, y);
    for (const [x, y] of [[midx - 2, y0 - 1], [midx + 2, y0 - 1], [midx - 2, y1 + 1], [midx + 2, y1 + 1], [x0 - 1, midy - 2], [x0 - 1, midy + 2], [x1 + 1, midy - 2], [x1 + 1, midy + 2]]) addAt('stendardo', x, y);
  }
  if (lvl >= 13) { // Età Imperiale: mura concentriche con barbacani
    const X0 = x0 - 4, Y0 = y0 - 4, X1 = x1 + 4, Y1 = y1 + 4; const ring2 = [];
    for (let x = X0; x <= X1; x++) ring2.push([x, Y0], [x, Y1]); for (let y = Y0 + 1; y < Y1; y++) ring2.push([X0, y], [X1, y]);
    for (const [x, y] of ring2) { if (walls <= 0) break; if (Math.abs(x - midx) <= 1 || Math.abs(y - midy) <= 1) continue; if (canPlace('muro', x, y)) { S.buildings.push({ id: S.nextId++, t: 'muro', x, y, lvl: 2, stock: 0, end: 0 }); walls--; } }
    for (const [x, y] of [[X0 + 1, Y0 + 1], [X1 - 1, Y0 + 1], [X0 + 1, Y1 - 1], [X1 - 1, Y1 - 1]]) addAt('torre', x, y);
    for (const [x, y] of [[midx - 3, Y0 - 2], [midx - 3, Y1 + 1], [X0 - 2, midy - 3], [X1 + 1, midy - 3]]) addAt('balista', x, y);
  }
  for (let i = 0; i < maxB('stendardo'); i++) place('stendardo', 1);
  spawnNature(40);
  // esercito al completo
  const cap = armyCap(); const ks = UNIT_ORDER.filter(k => unlockedUnit(k)); let used = 0, i = 0; S.army = {};
  while (ks.length && i < 400) { const k = ks[i++ % ks.length]; if (used + UDEF[k].sp > cap) { if (i > ks.length * 3) break; continue; } S.army[k] = (S.army[k] || 0) + 1; used += UDEF[k].sp; }
  if (hasB('accademia')) S.tech = { arm: 5, bal: 5, log: 5 };
  const c2 = caps(); for (const r of RES) S.res[r] = r === 'favore' ? 200 : c2[r];
  S.wins = 10; S.raids = 1; S.nightIn = DF().night;
}
function startCreative(fresh) {
  SAVE_KEY = 'imperium_creativo'; const old = !fresh && load();
  if (old) { S = old; } else { S = newState(); S.creative = 1; S.mastio = 8; S.mq = 99; S.natInit = S.natBig = S.natHuge = 1; S.raids = 1; S.wins = 10;
    const cx = MCX | 0; S.buildings = [{ id: S.nextId++, t: 'mastio', x: cx - 1, y: cx - 1, lvl: 8, stock: 0, end: 0 }]; S.army = {}; for (const k of UNIT_ORDER) S.army[k] = 2; S.tech = { arm: 5, bal: 5, log: 5 }; }
  save(); beginGame(false, true);
}
function startMax(lvl) { SAVE_KEY = 'imperium_max_' + lvl; buildMaxState(lvl); save(); beginGame(false, true); }
function toMenu() { save(); location.reload(); }
// ---------- mercato & accademia ----------
const TRADES = [{ give: { pelli: 10 }, get: { oro: 70 } }, { give: { legno: 100 }, get: { oro: 35 } }, { give: { cibo: 100 }, get: { oro: 30 } }, { give: { ferro: 50 }, get: { oro: 45 } }, { give: { pietra: 50 }, get: { oro: 40 } }, { give: { oro: 80 }, get: { ferro: 50 } }];
function tradeMul() { return 1 + 0.1 * (lvlSum('mercato') - 1); }
function tradeGet(t) { const o = {}; for (const k in t.get) o[k] = Math.round(t.get[k] * (t.give.oro ? 1 : tradeMul())); return o; }
function doTrade(i, id) { const t = TRADES[i]; if (!canPay(t.give)) { toast('Risorse insufficienti'); return; } pay(t.give); const g2 = tradeGet(t); for (const k in g2) addRes(k, g2[k]); sfx('coin'); save(); updateHUD(); openBuildingInfo(S.buildings.find(b => b.id === id)); }
function doResearch(k, id) { const l = tech(k) + 1, mx = lvlSum('accademia') * 2; if (l > Math.min(5, mx)) { toast('Migliora la Biblioteca per ricerche più avanzate'); return; } const c2 = TECH[k].cost(l); if (!canPay(c2)) { toast('Risorse insufficienti'); return; } pay(c2); (S.tech = S.tech || {})[k] = l; sfx('bell'); toast(`📚 ${TECH[k].n} livello ${l}!`); save(); updateHUD(); openBuildingInfo(S.buildings.find(b => b.id === id)); }
// ---------- upgrades / training ----------
function upCost(r) { if (r.t === 'mastio') return MASTIO_UP[r.lvl]; if (r.t === 'muro') return { pietra: 12 }; return scaleCost(BDEF[r.t].cost, r.lvl + 1); }
function upTime(r) { return Math.round(upTime0(r) * seasonBuildMul()); }
function upTime0(r) { const p = PACE(); if (r.t === 'mastio') return Math.round((MASTIO_T[r.lvl] || 720) * 60 * p); if (r.t === 'muro') return Math.round(6 * r.lvl * p); const w = Math.max(0.4, (BDEF[r.t].t || 6) / 10); return Math.max(10, Math.round((UP_T[r.lvl + 1] || 150) * 60 * w * p)); }
function canUp(r) {
  if (r.end) return 'In costruzione…';
  if (r.t === 'mastio') return r.lvl >= 16 ? `Livello massimo (${ERA(r.lvl).n})` : null;
  if (r.t === 'muro') return r.lvl >= 2 ? 'Già in pietra' : S.mastio < 5 ? 'Serve Castrum 5 (Età della Legione)' : null;
  if (BDEF[r.t].decor) return 'Decorazione';
  if (r.lvl >= bLvlCap()) return `Livello massimo con Castrum ${S.mastio}`;
  return null;
}
function doUpgrade(id) {
  const r = S.buildings.find(b => b.id === id); if (!r) return; const why = canUp(r); if (why) { toast(why); return; }
  const c = upCost(r); if (!canPay(c)) { needSheet(c, r.t === 'mastio' ? `alzare il Castrum al livello ${r.lvl + 1}` : `migliorare ${BDEF[r.t].n}`); return; }
  const t = upTime(r); if (t && !BDEF[r.t].wall && builders() >= maxBuilders()) { toast(`Tutti i fabri sono occupati (max ${maxBuilders()})`); return; }
  pay(c); if (resOf(r)) collect(r);
  if (t && !S.creative) { r.end = now() + t * 1000; r.dur = t * 1000; r.toLvl = r.lvl + 1; } else { r.lvl++; }
  sfx('build'); const sel = r; SC = buildVillage(); SC.sel = SC.B.find(b => b.ref === sel) || null; save(); updateHUD(); openBuildingInfo(r);
}
function upgradeAllWalls() {
  const ws = S.buildings.filter(b => b.t === 'muro' && b.lvl < 2); let n = 0;
  for (const w of ws) { if (w.end) continue; if (S.res.pietra < 12) break; S.res.pietra -= 12; if (timedOn()) { w.end = now() + (4 + n * 0.3) * 1000; w.dur = (4 + n * 0.3) * 1000; w.toLvl = 2; } else w.lvl = 2; n++; }
  if (n) { toast(`🧱 ${n} pezzi di palizzata diventano Mura di Pietra`); sfx('build'); SC = buildVillage(); save(); updateHUD(); } else toast('Serve pietra (12 per pezzo)');
  closeSheet();
}
function finishNow(id) { /* no premium: just info */ }
function train(k, n) {
  const d = UDEF[k]; let done = 0;
  for (let i = 0; i < n; i++) { if (armyUsed() + d.sp > armyCap()) { toast('👥 Popolazione al completo: costruisci o migliora le Domus'); break; } if (!canPay(d.cost)) { if (!done) toast('Risorse insufficienti'); break; } pay(d.cost); S.queue.push({ k }); done++; }
  if (done) { sfx('click'); save(); updateHUD(); openArmy(); }
}
function hasB(t) { return S.buildings.some(b => b.t === t && !(b.end && b.toLvl === 1)); }
function unlockedUnit(k) { const d = UDEF[k]; return S.mastio >= d.lv && hasB(d.at) && (!d.need || hasB(d.need)); }

// ================= UI =================
function toast(msg) { const t = $('#toast'); const d = document.createElement('div'); d.className = 'tmsg'; d.innerHTML = msg; t.appendChild(d); setTimeout(() => d.classList.add('out'), 2600); setTimeout(() => d.remove(), 3200); }
function fmt(n) { n = Math.floor(n); return n >= 10000 ? (n / 1000).toFixed(1) + 'k' : String(n); }
function updateHUD() {
  if (!S) return; const c = caps();
  $('#res').innerHTML = RES.map(r => { const full = r !== 'favore' && S.res[r] >= c[r]; return `<div class="chip${full ? ' full' : ''}" title="${RNAME[r]}" onclick="resInfo('${r}')"><span class="ic">${ICO(r)}</span><span class="v">${fmt(S.res[r])}</span>${r !== 'favore' ? `<span class="cap">/${fmt(c[r])}</span>` : ''}<i style="width:${r === 'favore' ? 0 : Math.min(100, S.res[r] / c[r] * 100)}%"></i></div>`; }).join('');
  const e = ERA(S.mastio);
  const nt = Math.max(0, S.nightIn || 0) * 1000; const mm = Math.floor(nt / 60000), ss = Math.floor(nt / 1000) % 60; const truce = !S.raids;
  if (S.creative) { const qe0 = $('#quest'); if (qe0) qe0.innerHTML = '<span class="ql">🧱 Modalità Creativa</span> <span class="qt">tutto sbloccato · risorse infinite · niente razzie</span>'; }
  const qe = S.creative ? null : $('#quest'); if (qe) { const h = questHTML(); if (qe.dataset.h !== h) { qe.innerHTML = h; qe.dataset.h = h; } qe.classList.toggle('ready', !!(QUESTS[S.mq] && QUESTS[S.mq].c())); }
  $('#era').innerHTML = `<div class="m">${S.creative ? '' : `<span onclick="openArms()" style="cursor:pointer;margin-right:3px">${crestSVG(ARMS(), 13)}</span>`}<b>Castrum ${S.mastio}</b> · <span style="color:${e.hc}">${e.n}</span> · ${YEAR(S.mastio)} d.C. · <span style="color:${DF().col === '#8f1d1d' ? '#ff8a7a' : DF().col === '#3f7a2e' ? '#9fe08a' : '#ffcf7a'}">${DF().n}</span></div><div class="n">${truce ? ICO('truce') + ' Tregua: predoni tra' : ICO('moon') + ' Notte tra'} ${mm}:${String(ss).padStart(2, '0')} · ${ICO('pop')} ${popTxt()} · ${ICO('hammer')} ${builders()}/${MAX_BUILDERS}${S.creative ? '' : ` · <span onclick="openMood()" style="cursor:pointer">${umoreWord(umore())[0]} ${umore()}</span>`}</div>`;
}
function resInfo(r) { if (!S) return; const c = caps(); toast(`${ICO(r)} ${RNAME[r]}: ${fmt(S.res[r])}${r !== 'favore' ? ' / ' + fmt(c[r]) + (S.res[r] >= c[r] ? ' — magazzino pieno!' : '') : ''}`); }
function audioHTML(back) {
  const row = (k, lbl, ic) => `<div class="vrow"><div class="vl">${ic} ${lbl}<b id="v_${k}">${Math.round(SET[k] * 100)}%</b></div><input type="range" min="0" max="100" step="5" value="${Math.round(SET[k] * 100)}" oninput="setVol('${k}',+this.value)" ${k === 'fvol' ? `onchange="sfx('coin')"` : ''}></div>`;
  return `<button class="btn ${SET.mute ? '' : 'ghost'} big mute" onclick="toggleMute();${back}">${SET.mute ? '🔇 Audio spento · tocca per riattivare' : '🔊 Audio attivo · tocca per silenziare'}</button>
    <div class="vbox"><div class="vh"><span>🎵 Colonna sonora</span><button class="btn ghost" onclick="musicToggle();${back}">${MUS.on ? 'Attiva' : 'Spenta'}</button></div>${row('mvol', 'Volume musica', '🎼')}</div>
    <div class="vbox"><div class="vh"><span>⚔ Effetti sonori</span><span class="vs">battaglia, costruzioni, trombe</span></div>${row('fvol', 'Volume effetti', '🔔')}</div>`;
}
function openMenu(tab) {
  tab = tab || openMenu.tab || 'audio'; openMenu.tab = tab;
  const tabs = [['audio', 'sound', 'Audio'], ['look', 'scroll', 'Layout'], ['diff', 'army', 'Difficoltà'], ['game', 'castle', 'Partita']];
  let body = '';
  if (tab === 'audio') body = audioHTML(`openMenu('audio')`) + sndTestHTML();
  else if (tab === 'look') body = `<div class="lay">${layoutCards(`openMenu('look')`)}</div><h4 style="margin:12px 0 6px">🖥️ Qualità grafica</h4><div class="dif">${Object.keys(QUAL).map(k => `<button class="card ${QQ() === QUAL[k] ? 'on' : ''}" onclick="setQual('${k}')" style="text-align:left"><div class="cn">${QUAL[k].n}${QQ() === QUAL[k] ? ' ✓' : ''}</div><div class="cd">${QUAL[k].d}</div></button>`).join('')}</div>`;
  else if (tab === 'diff') body = `<div class="dif">${diffCards(`openMenu('diff')`)}</div>`;
  else body = `<div class="mlist">
    <button class="btn ghost" onclick="openHelp()">${ICO('scroll')} Come si gioca · missioni</button>
    ${S && !S.creative && !S.sandbox ? `<button class="btn ghost" onclick="openCronache()">📜 Cronache della Provincia</button><button class="btn ghost" onclick="openBackups()">🛟 Copie di sicurezza</button><button class="btn ghost" onclick="closeSheet();tutStart()">🕯️ Rifai la guida passo passo</button><button class="btn ghost" onclick="openArms()">🛡️ Stemma della casata</button>` : ''}
    <button class="btn ghost" onclick="save();saveCode()">📋 Copia codice partita<small>salvalo in Note: con Importa la riprendi ovunque</small></button>
    <button class="btn ghost" onclick="save();cloudPush(true);toast(CLOUD.ready ? '💾 Partita salvata anche nel cloud' : '💾 Partita salvata su questo browser')">💾 Salva ora</button>
    ${S && !S.creative && !S.sandbox ? `<button class="btn ghost" onclick="openDiary()">📈 Diario del ritmo<small>quanto dura davvero ogni traguardo</small></button>` : ''}
    <button class="btn ghost" onclick="SET.pace = SET.pace === 'rapido' ? 'normale' : 'rapido'; saveSet(); openMenu('game'); toast(SET.pace === 'rapido' ? '⏩ Ritmo rapido: tutti i tempi ÷10 (per provare)' : '⏱ Ritmo normale')">${SET.pace === 'rapido' ? '⏩ Ritmo: rapido (tempi ÷10)' : '⏱ Ritmo: normale'}<small>tocca per cambiare · il rapido serve per provare il gioco</small></button>
    ${S && !S.creative && !S.sandbox ? `<button class="btn ghost" onclick="newCampaign()">↺ Nuova partita</button>` : ''}
    <button class="btn" onclick="closeSheet();toMenu()">🏠 Menu principale</button></div>`;
  openSheet(ICO('gear') + ' Menu', `<div class="mtabs">${tabs.map(([k, i, n]) => `<button class="${k === tab ? 'on' : ''}" onclick="openMenu('${k}')">${ICO(i)}<span>${n}</span></button>`).join('')}</div><div class="aud mbody">${body}</div>`, 'menu');
}
function openSheet(title, html, key) { setTimeout(() => { try { if (MODE === 'village') tutTick(); } catch (e) { } }, 0); if (typeof closeFolk === 'function' && $('#fcard')) closeFolk(); const s = $('#sheet'); s.dataset.p = key || ''; $('#sheet-t').innerHTML = title; $('#sheet-b').innerHTML = html; s.classList.remove('hidden'); }
function closeSheet() { const s = $('#sheet'); s.classList.add('hidden'); s.dataset.p = ''; if (SC && MODE === 'village' && !placing) { SC.sel = null; SC.selN = null; SC.selA = null; SC.selU = null; } }
function refreshSheet() { const p = $('#sheet').dataset.p; if (!p) return; if (p === 'army') openArmy(); else if (p === 'build') openBuild(); else if (p.startsWith('b:')) { const r = S.buildings.find(b => b.id === +p.slice(2)); if (r) openBuildingInfo(r); } }
const CHIM3 = { casa: [0.5, 0.3], taverna: [0.93, 0.52], fucina: [0.27, 0.04], fattoria: [0.3, 0.2] };
function openMood() { const v = umore(), w = umoreWord(v), c = caps(), food = (S.res.cibo || 0) / Math.max(1, c.cibo); const row = (ok, t) => `<div class="row">${ok ? '✅' : '▫️'} ${t}</div>`;
  openSheet(`${w[0]} Umore del popolo`, `<p class="desc">Il popolo è <b>${w[1]}</b> (${v}/100). ${v >= 75 ? 'Produzione +5% e ogni tanto una festa in piazza.' : v < 35 ? 'Produzione -10%: il popolo lavora malvolentieri.' : 'Sopra 75 il popolo fa festa e produce di più.'}</p>
    ${row(LIFEC.pr > 0, `✨ Prestigio delle decorazioni: +${Math.round(Math.min(30, LIFEC.pr * 0.6))}`)}${row(countB('taverna') > 0, `🍺 Taverne: +${Math.min(3, countB('taverna')) * 4}`)}${row(hasB('chiesa'), '⛪ Tempio: +6')}${row(hasB('mercato'), '🏪 Forum: +4')}
    ${row(food > 0.4, food > 0.4 ? '🌾 Granai pieni: +8' : food < 0.01 ? '🍂 Carestia: -35' : food < 0.12 ? '🌾 Poco cibo: -12' : '🌾 Cibo nella norma')}${S.raidLostT && now() - S.raidLostT < 20 * 60000 ? row(false, '🔥 Razzia persa da poco: -12') : ''}
    ${S.fest && now() < S.fest.end ? '<p class="desc">🎉 <b>Festa in corso!</b></p>' : ''}<div class="acts"><button class="btn" onclick="openBuild('d')">🌷 Decorazioni</button><button class="btn ghost" onclick="closeSheet()">Chiudi</button></div>`, 'mood'); }
// ================= STEMMA DELLA CASATA =================
const ARMS_COL = [['Rosso', '#a8322a'], ['Azzurro', '#1e4a9a'], ['Verde', '#2f6b2f'], ['Nero', '#1c1c1c'], ['Porpora', '#5b2a6e'], ['Oro', '#d4a72c'], ['Argento', '#ece8de']];
const ARMS_DIV = [['pieno', 'Pieno'], ['partito', 'Partito'], ['troncato', 'Troncato'], ['inquartato', 'Inquartato'], ['banda', 'In banda']];
const ARMS_SYM = ['✠', '♔', '⚜', '🦁', '🦅', '🐺', '🐻', '🐗', '🐉', '🗝️', '⚔️', '🌹', '☀️', '🏰'];
const ARMS = () => (S && S.arms) || { c1: '#a8322a', c2: '#d4a72c', div: 'partito', sym: '🦅' };
function crestSVG(a, sz) { a = a || ARMS(); const id = 'cl' + Math.random().toString(36).slice(2, 7); const P = 'M2 2 H38 V20 C38 34 28 42 20 46 C12 42 2 34 2 20 Z';
  const part = a.div === 'partito' ? `<rect x="20" y="0" width="20" height="48" fill="${a.c2}"/>` : a.div === 'troncato' ? `<rect x="0" y="20" width="40" height="28" fill="${a.c2}"/>` : a.div === 'inquartato' ? `<rect x="20" y="0" width="20" height="20" fill="${a.c2}"/><rect x="0" y="20" width="20" height="28" fill="${a.c2}"/>` : a.div === 'banda' ? `<path d="M0 6 L6 0 L40 34 L40 46 Z" fill="${a.c2}"/>` : '';
  return `<svg viewBox="0 0 40 48" width="${sz}" height="${sz * 1.2}" style="vertical-align:middle"><defs><clipPath id="${id}"><path d="${P}"/></clipPath></defs><g clip-path="url(#${id})"><rect width="40" height="48" fill="${a.c1}"/>${part}</g><path d="${P}" fill="none" stroke="#1a1208" stroke-width="2.2"/><text x="20" y="27" font-size="18" text-anchor="middle" dominant-baseline="middle">${a.sym}</text></svg>`; }
function openArms() { if (!S) return; if (!S.arms) S.arms = Object.assign({}, ARMS()); const a = S.arms;
  const chips = (k, list) => list.map(([n, v]) => `<button class="achip ${a[k] === v ? 'on' : ''}" onclick="setArms('${k}','${v}')" title="${n}"><i style="background:${v}"></i></button>`).join('');
  openSheet('🛡️ Stemma della casata', `<div class="arms"><div class="aprev">${crestSVG(a, 92)}</div><p class="desc">Il tuo stemma sventola sui vessilli del presidio, sulla classifica degli Altri Regni e in cima allo schermo.</p>
    <h4>Campo</h4><div class="arow">${chips('c1', ARMS_COL)}</div><h4>Seconda tintura</h4><div class="arow">${chips('c2', ARMS_COL)}</div>
    <h4>Partizione</h4><div class="arow">${ARMS_DIV.map(([v, n]) => `<button class="achip w ${a.div === v ? 'on' : ''}" onclick="setArms('div','${v}')">${crestSVG(Object.assign({}, a, { div: v, sym: '' }), 22)}<small>${n}</small></button>`).join('')}</div>
    <h4>Figura</h4><div class="arow">${ARMS_SYM.map(v => `<button class="achip s ${a.sym === v ? 'on' : ''}" onclick="setArms('sym','${v}')">${v}</button>`).join('')}</div>
    <div class="acts"><button class="btn" onclick="closeSheet()">✓ Fatto</button></div></div>`, 'arms'); }
function setArms(k, v) { if (!S.arms) S.arms = Object.assign({}, ARMS()); S.arms[k] = v; for (const key in CACHE) if (key.startsWith('stendardo')) delete CACHE[key]; save(); updateHUD(); openArms(); }
function rotDeco(id) { const r = S.buildings.find(b => b.id === id); if (!r) return; r.rot = ((r.rot || 0) + 1) % 4; const b = SC && SC.B.find(x => x.ref === r); if (b) { b.c3k = null; } save(); sfx('tock'); }
let BTAB = 'b';
function openBuild(tab) {
  if (tab) BTAB = tab; const deco = BTAB === 'd';
  const lockMsg = t => { const d = BDEF[t]; const lv = d.max.findIndex(v => v > 0) + 1; return `Castrum ${lv}`; };
  const pr = prestige(), pm = Math.round((prestigeMult() - 1) * 100);
  const tabs = `<div class="btabs"><button class="${deco ? '' : 'on'}" onclick="openBuild('b')">🏠 Edifici</button><button class="${deco ? 'on' : ''}" onclick="openBuild('d')">🌷 Decorazioni</button></div>`
    + (deco ? `<div class="prest"><b>✨ Prestigio ${pr}</b><span>produzione +${pm}%${pm < 20 ? ` · prossimo +1% a ${(Math.floor(pr / 4) + 1) * 4}` : ' · massimo'}</span><i style="width:${Math.min(100, pr / 80 * 100)}%"></i></div>` : '');
  const html = tabs + `<div class="grid">${(deco ? DECOR_ORDER : BUILD_ORDER).map(t => {
    const d = BDEF[t], n = countB(t), m = maxB(t), needReq = d.req && !S.creative && !hasB(d.req), locked = m === 0 || needReq, full = n >= m; const th = d.spr && bThumb(d.spr);
    return `<button class="card ${locked || full ? 'dis' : ''}" ${locked || full ? '' : !canPay(d.cost) ? `onclick="needSheet(BDEF['${t}'].cost,'costruire ${d.n.replace(/'/g, '’')}')"` : `onclick="startPlacement('${t}')"`}>
      <div class="ci">${th ? `<img src="${th}" style="width:46px;height:46px;object-fit:contain">` : d.icon}</div><div class="cn">${d.n}</div>
      <div class="cs">${deco && d.pr ? `✨${d.pr} · ` : ''}${m === 0 ? '🔒 ' + lockMsg(t) : needReq ? '🔒 Serve ' + BDEF[d.req].n : `${n}/${m}`}</div>
      <div class="cc">${costStr(d.cost)}${!locked && !full && !canPay(d.cost) ? `<div class="cneed">${needLabel(d.cost)}</div>` : ''}${d.t && !S.creative ? ` <span class="tm">⏱ ${fmtT(buildSecs(d) * 1000 * seasonBuildMul())}</span>` : ''}</div><div class="cd">${d.desc}</div></button>`;
  }).join('')}</div>`;
  openSheet(ICO('build') + ' Costruisci', html, 'build');
}
function openBuildingInfo(r) {
  const d = BDEF[r.t]; const why = canUp(r); const res = resOf(r);
  let body = `<p class="desc">${d.desc}</p>${r.t === 'cripta' ? cryptHTML() : ''}${r.t === 'mastio' ? crownHTML() : ''}<div class="stats">`;
  body += `<span>Livello <b>${r.lvl}</b>${r.end ? ` → ${r.toLvl}` : ''}</span><span>Vita <b>${Math.round(d.hp * (1 + 0.35 * (r.lvl - 1)))}</b></span>`;
  if (res) body += `<span>${ICO(res)} <b>${rateOf(r) < 1 ? rateOf(r).toFixed(1) : Math.round(rateOf(r))}</b>/min</span><span>In deposito <b>${Math.floor(r.stock || 0)}</b>/${stockCap(r)}</span>`;
  if (d.store) body += `<span>Capienza ${Object.keys(d.store).map(k => ICO(k) + ' +' + d.store[k] * r.lvl).join(' ')}</span>`;
  if (d.pop) body += `<span>👥 Popolazione <b>+${d.pop * r.lvl}</b></span>`;
  if (d.arms) body += `<span>🗡️ Danno truppe <b>+${Math.round(d.arms * r.lvl * 100)}%</b></span>`;
  if (d.cure) body += `<span>✚ Recupero caduti <b>${Math.min(60, Math.round(d.cure * r.lvl * 100))}%</b></span>`;
  if (d.shoot) body += `<span>Gittata <b>${d.shoot.range}</b> · Danno <b>${Math.round(d.shoot.dmg * (1 + 0.3 * (r.lvl - 1)))}</b></span>`;
  body += `</div>`;
  if (r.end) { body += `<div class="note">🔨 Lavori in corso: ancora ${fmtT(r.end - now())}</div>`; }
  if (r.t === 'mastio') {
    const nx = r.lvl + 1;
    if (nx <= 8) {
      const un = []; for (const t of BUILD_ORDER) { const m0 = BDEF[t].max[r.lvl - 1], m1 = BDEF[t].max[nx - 1]; if (m1 > m0) un.push(`${BDEF[t].icon} ${BDEF[t].n} ${m0 ? `(${m0}→${m1})` : '(nuovo)'}`); }
      for (const k of UNIT_ORDER) if (UDEF[k].lv === nx) un.push(`⚔ ${UDEF[k].n}`); for (const k in HDEF) if (HDEF[k].lv === nx) un.push(`♔ Eroe: ${HDEF[k].n}`);
      if (nx % 2 === 0) un.push(`⬆ Edifici fino al livello ${Math.min(4, 1 + Math.floor(nx / 2))}`);
      if (nx === 5) un.push('🧱 Mura di pietra');
      body += `<div class="unl"><b>Livello ${nx} — ${ERA(nx).n}, ${YEAR(nx)} d.C.</b><br><i>${MASTIO_DESC[nx]}</i><br>${un.join(' · ')}</div>`;
    }
  }
  body += `<div class="acts">`;
  if (r.t === 'mercato' && !r.end) body += `<button class="btn" onclick="openMarket()">⚖ Commercia<small>compra e vendi risorse</small></button><button class="btn ghost" onclick="openDiplo()">🤝 Diplomazia</button>`;
  if (d.decor && d.rm) { if (workOn('obj', r.id)) body += `<button class="btn dis">🪓 In rimozione… ${fmtT(workOn('obj', r.id).end - now())}</button>`; else if (r.nat) body += `<button class="btn" onclick="removeObj(${r.id})">✖ Rimuovi<small>${Object.keys(d.rm.cost).length ? costStr(d.rm.cost) : 'gratis'} · ⏱ ${d.rm.t || 4}s → ${Object.keys(d.rm.gain).map(k => ICO(k) + ' +' + d.rm.gain[k]).join(' ')}${r.t === 'funghi' ? ' (+👑?)' : ''}</small></button>`; else body += `<button class="btn" onclick="removeObj(${r.id})">✖ Rimuovi<small>${costStr({ cibo: 5 })} · ⏱ 3s · rimborso ${Object.keys(d.cost).map(k => ICO(k) + ' ' + Math.floor(d.cost[k] / 2)).join(' ')}</small></button>`; }
  else if (!why) body += `<button class="btn" onclick="doUpgrade(${r.id})">⬆ Migliora a liv. ${r.lvl + 1}<small>${costStr(upCost(r))} ${upTime(r) ? '· ⏱ ' + fmtT(upTime(r) * 1000) : ''}</small></button>`;
  else if (!d.decor) body += `<button class="btn dis">⬆ ${why}</button>`;
  if (res && r.stock >= 1) body += `<button class="btn" onclick="collect(S.buildings.find(b=>b.id===${r.id}));openBuildingInfo(S.buildings.find(b=>b.id===${r.id}))">${ICO(res)} Raccogli ${Math.floor(r.stock)}</button>`;
  let extra = '';
  if (r.t === 'mercato' && !r.end) extra += `<h4>Scambi del Forum</h4><div class="acts">${TRADES.map((t, i) => `<button class="btn sm" onclick="doTrade(${i},${r.id})">${costStr(t.give)} → ${Object.entries(tradeGet(t)).map(e => ICO(e[0]) + ' ' + e[1]).join(' ')}</button>`).join('')}</div>`;
  if (r.t === 'accademia' && !r.end) extra += `<h4>Ricerche (max liv. ${Math.min(5, lvlSum('accademia') * 2)})</h4><div class="ulist">${Object.keys(TECH).map(k => { const T = TECH[k], l = tech(k); return `<div class="urow"><div class="uimg" style="display:flex;align-items:center;justify-content:center;font-size:28px">${T.icon}</div><div class="uinfo"><b>${T.n}</b> <span class="cnt">liv. ${l}</span><div class="role">${T.d}</div></div><div class="ubtn">${l < 5 ? `<button class="btn sm" onclick="doResearch('${k}',${r.id})">Studia<small>${costStr(T.cost(l + 1))}</small></button>` : '<span class="ok">Max</span>'}</div></div>`; }).join('')}</div>`;
  if (d.army || r.t === 'monastero' || r.t === 'scuderia') body += `<button class="btn" onclick="openArmy()">⚔ Addestra</button>`;
  if (r.t === 'muro' && S.mastio >= 5) body += `<button class="btn" onclick="upgradeAllWalls()">🧱 Tutte in pietra<small>🪨 12 l'una</small></button>`;
  if (r.nat) body = body.replace('<p class="desc">', '<p class="desc"><b>Ostacolo naturale.</b> Impedisce di costruire qui: rimuovilo per liberare spazio e ottenere risorse. ');
  if (r.t !== 'mastio' && !(d.decor && d.rm)) body += workOn('demo', r.id) ? `<button class="btn dis">🔨 Demolizione… ${fmtT(workOn('demo', r.id).end - now())}</button>` : `<button class="btn ghost" onclick="demolish(${r.id})">🔨 Demolisci<small>${costStr({ cibo: 10 * r.lvl })} · ⏱ ${Math.max(4, Math.round((d.t || 4) * 0.6 * r.lvl))}s · rimborso 30%</small></button>`;
  if (r.t !== 'mastio' && !r.nat) body += `<button class="btn ghost" onclick="startPlacement('${r.t}', S.buildings.find(b=>b.id===${r.id}))">✥ Sposta</button>`;
  if (d.decor && DFIT[r.t] && !DYAW_RND[r.t]) body += `<button class="btn ghost" onclick="rotDeco(${r.id})">↻ Ruota</button>`;
  body += `</div>`;
  body = body.replace('<div class="acts">', extra + '<div class="acts">');
  openSheet(`${d.icon} ${d.n}`, body, 'b:' + r.id);
}
function unitRow(k) {
  const d = UDEF[k]; const ok = unlockedUnit(k);
  const lockTxt = ok ? '' : S.mastio < d.lv ? `Castrum ${d.lv}` : !hasB(d.at) ? `serve ${(BDEF[d.at] || {}).n || d.at}` : d.need ? `serve ${(BDEF[d.need] || {}).n || d.need}` : '';
  const thumb = FR[k + '.idleF'];
  return `<div class="urow ${ok ? '' : 'dis'}"><div class="uimg" style="${thumbStyle(k)}"></div>
   <div class="uinfo"><b>${d.n}</b> <span class="cnt">×${S.army[k] || 0}</span><div class="role">${d.role}</div>
   <div class="ust">❤ ${d.hp} · ⚔ ${d.dmg} · ${d.ranged ? '🏹 ' + d.rng : 'mischia'} · 👥 ${d.sp}</div></div>
   <div class="ubtn">${ok ? `<button class="btn sm" onclick="train('${k}',1)">+1<small>${costStr(d.cost)}</small></button><button class="btn sm" onclick="train('${k}',5)">+5</button>` : `<span class="lock">🔒 ${lockTxt}</span>`}</div></div>`;
}
let THUMB_URL = null;
function thumbStyle(k) {
  if (UDEF[k] && UDEF[k].siege) return `background-image:url(${siegeThumb(k)});background-size:contain;background-repeat:no-repeat;background-position:center bottom;`;
  if (HDEF[k] && HDEF[k].model) { const u = heroPortrait(k); return u ? `background-image:url(${u});background-size:contain;background-repeat:no-repeat;background-position:center bottom;` : ''; }
  if (RUNIT[k]) { const u = romanThumb(k); if (u) return `background-image:url(${u});background-size:contain;background-repeat:no-repeat;background-position:center bottom;`; }
  const f = FR[k + '.idleF']; if (!f) return '';
  const s = 54 / f[3];
  return `background-image:url(${ATL.src});background-size:${ATLW * s}px ${ATLH * s}px;background-position:${-f[0] * s + (54 - f[2] * s) / 2}px ${-f[1] * s}px;`;
}
function openArmy() {
  const q = S.queue.length ? `<div class="queue">In addestramento: ${S.queue.slice(0, 12).map((q, i) => `<span class="${i === 0 ? 'act' : ''}">${UDEF[q.k].n.split(' ')[0]}</span>`).join('')}${S.queue.length > 12 ? ' …' : ''}</div>` : '';
  const hs = Object.keys(HDEF).map(k => { const h = HDEF[k]; const ok = S.mastio >= h.lv; return `<div class="urow hero ${ok ? '' : 'dis'}"><div class="uimg" style="${thumbStyle(k)}"></div><div class="uinfo"><b>${h.n}</b> <span class="cnt">${h.title}</span><div class="role"><b>${h.ult}:</b> ${h.ultd}</div><div class="ust">❤ ${h.hp} · ⚔ ${h.dmg} · ${h.ranged ? '🏹 ' + h.rng : 'mischia'}</div></div><div class="ubtn">${ok ? '<span class="ok">Giurato ✓</span>' : `<span class="lock">🔒 Castrum ${h.lv}</span>`}</div></div>`; }).join('');
  const html = `<div class="capbar"><span>👥 Popolazione ${armyUsed()}/${armyCap()} · 🗡️ Armi +${Math.round((armsMult() - 1) * 100)}% · ✚ Cure ${Math.round(curePct() * 100)}%</span><i style="width:${Math.min(100, armyUsed() / armyCap() * 100)}%"></i></div>${q}
   <div class="ulist">${UNIT_ORDER.map(unitRow).join('')}</div><h4>Eroi</h4><div class="ulist">${hs}</div>`;
  openSheet(ICO('army') + ' Esercito', html, 'army');
}
// ================= LA CORONA DI SVEVIA: sei frammenti e l'assedio finale al Margravio =================
const FRAGS = [
  { name: 'Torre di Scarbantia', where: 'custodita dai veterani', x: 'Nel sacello diroccato di Scarbantia, sotto l\'altare dei Lari, trovi uno scrigno di piombo. Dentro, avvolta nella porpora, brilla la prima parte dell\'Aquila: un\'ala d\'oro.<br><br>Sul coperchio è incisa una sigla: <b>LEG XXIII</b>.' },
  { name: 'Mitreo di Savaria', where: 'dei sacerdoti guerrieri', x: 'I sacerdoti difendevano il mitreo senza sapere cosa custodissero. Tra le offerte votive trovi la seconda parte, nascosta dentro la statua del dio che uccide il toro.<br><br>Pater Elio, quando lo saprà, non dirà una parola.' },
  { name: 'Castellum di Brigetio', where: 'nelle mani di un mercenario', x: 'Il capo mercenario che teneva Brigetio l\'aveva comprata dal Legato. La terza parte dell\'Aquila era appesa al suo collo come un amuleto.<br><br>Ora sai per certo che Carnuntum sta radunando i pezzi.' },
  { name: 'Villa di Gorsium', where: 'occupata dai predoni', x: 'I predoni avevano saccheggiato la villa, ma la quarta parte era murata dietro un mosaico con l\'aquila. Domina Livia ti aveva detto dove cercare.<br><br>«Mio padre la nascose qui la notte in cui morì.»' },
  { name: 'Forte di Intercisa', where: 'avamposto del Legato', x: 'Intercisa era l\'ultimo avamposto di Carnuntum. Nella cassa del prefetto trovi la quinta parte e una tavoletta del Legato: «L\'ultimo pezzo resterà con me. Chi lo vuole, venga a prenderlo.»' },
];
const FRAG_BOSS = { name: 'Fortezza di Carnuntum', where: 'il Legato · ultimo pezzo', x: 'Le mura di Carnuntum crollano e il Legato cade nel cortile dei principia, il gladio spezzato accanto. Dal suo collo prendi l\'ultimo pezzo.<br><br>Nel sacello del tuo castellum le sei parti tornano a combaciare: l\'Aquila d\'oro della Ventitreesima è di nuovo intera.<br><br>Domina Livia si inginocchia per prima. Poi, una dopo l\'altra, tutte le legioni del Danubio.<br><br><i>«Ave, Imperator!»</i>' };
const frags = () => (S && S.frag) || 0;
function fragTarget() {
  if (!S || S.sandbox || S.creative || !S.targets) return; if (S.targets.some(t => t.frag != null || t.boss)) return; const f = frags();
  if (f < 5 && S.mastio >= 5) { const F = FRAGS[f]; S.targets.unshift({ d: Math.max(3, Math.min(10, S.mastio - 2 + f)), name: F.name, where: F.where, seed: (Math.random() * 1e9) | 0, frag: f }); }
  else if (f >= 5 && S.mastio >= 10 && !S.crowned) S.targets.unshift({ d: 10, name: FRAG_BOSS.name, where: FRAG_BOSS.where, seed: 1255, boss: 1 });
}
function bossSetup(sc) { const m = sc.B.find(b => b.t === 'mastio'); if (!m) return; const ks = ['uomoarme', 'balestriere', 'picchiere', 'scudata', 'berserker'];
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283, x = m.x + m.w / 2 + Math.cos(a) * (m.w / 2 + 1.3), y = m.y + m.h / 2 + Math.sin(a) * (m.h / 2 + 1.3); if (bAt(sc, x | 0, y | 0) || isWater(sc, x | 0, y | 0)) continue; const u = mkUnit(ks[i % ks.length], 'D', x, y); u.guardR = 6; u.leash = 10; u.hp *= 1.3 * DF().ehp; u.maxhp *= 1.3 * DF().ehp; u.dm = DF().edmg; sc.U.push(u); }
  const [fx, fy] = frontTile(sc, m); const g = mkUnit('cavpesante', 'D', fx + 0.5, fy + 0.5); g.boss = true; g.hp *= 5; g.maxhp *= 5; g.dm = 1.6; g.guardR = 8; g.leash = 12; sc.U.push(g);
  m.hp *= 1.6; m.maxhp *= 1.6; }
function fragReward(st) {
  const tg = BT.tg; if (tg.frag == null && !tg.boss) return '';
  if (tg.boss) { if (!BT.mastioDown) return '<div class="row"><b>👑 Il Legato resiste:</b> abbatti il suo castellum per prendere l\'ultimo pezzo</div>'; S.frag = 6; S.crowned = 1; addRes('favore', 60); S.fragStory = 'boss'; return '<div class="row"><b>👑 L\'Aquila d\'oro è di nuovo intera!</b> +60 Favore Imperiale</div>'; }
  if (!(BT.mastioDown || st >= 2)) return '<div class="row"><b>👑 La parte dell\'Aquila è ancora nel forte:</b> abbatti il castrum o conquista 2 stelle</div>';
  S.frag = Math.max(frags(), tg.frag + 1); addRes('favore', 8); S.fragStory = tg.frag; return `<div class="row"><b>👑 Parte dell\'Aquila recuperata!</b> (${S.frag}/6) · +8 Favore Imperiale</div>`;
}
function fragStoryShow() { if (S.fragStory == null) return; const k = S.fragStory; S.fragStory = null; save();
  if (k === 'boss') storyOpen([{ img: 1, ic: '🦅', sub: 'Epilogo', t: 'L\'Aquila intera', x: FRAG_BOSS.x }]);
  else storyOpen([{ img: 1, ic: '👑', sub: `Frammento ${k + 1} di 6`, t: FRAGS[k].name, x: FRAGS[k].x }]); }
function crownHTML() { const f = frags(); if (!S || S.mastio < 5 && !f) return ''; return `<div class="crown"><b>👑 Sacello dell\'Aquila</b><div class="cfr">${Array.from({ length: 6 }, (_, i) => `<span class="${i < f ? 'on' : ''}">${i < f ? '✦' : '·'}</span>`).join('')}</div><small>${f >= 6 ? 'L\'Aquila è intera. Le legioni ti acclamano Imperatore.' : f >= 5 ? `5 parti su 6. L'ultima è nella Fortezza di Carnuntum${S.mastio < 10 ? ' (Castrum 10 per assediarla)' : ': cercala nella Mappa'}.` : `${f} parti su 6. Cerca nella Mappa i forti segnati con 👑.`}</small></div>`; }
function openMap() {
  refreshTargets(false); fragTarget();
  const total = Object.values(S.army).reduce((a, b) => a + b, 0);
  const html = `<p class="desc">La Pannonia, ${YEAR(S.mastio)} d.C.. Scegli chi depredare. Truppe pronte: <b>${total}</b>${heroList().length ? ' + ' + heroList().length + ' eroi' : ''}.</p>
  <div class="tlist">${S.targets.map((t, i) => { const p = lootPool(t.d); return `<div class="tcard${t.frag != null || t.boss ? ' crownt' : ''}"><div class="tt"><b>${t.frag != null || t.boss ? '👑 ' : ''}${t.name}</b><span>${t.where}${t.frag != null ? ` · frammento ${t.frag + 1} di 6` : ''}</span></div><div class="skull">${'💀'.repeat(Math.min(5, Math.ceil(t.d / 2)))} <small>difficoltà ${t.d}</small></div><div class="tl">Bottino stimato: 🌾${p.cibo} 🪵${p.legno} 🪙${p.oro}${p.pietra ? ' 🪨' + p.pietra : ''}</div><button class="btn" onclick="startAttack(${i})">⚔ Assedia</button></div>`; }).join('')}</div>
  <div class="maptabs three"><button class="btn ghost" onclick="openRealms()">🌍 Altri Regni<small>${realms().length} capi</small></button><button class="btn ghost" onclick="openDiplo()">🤝 Diplomazia<small>${feudi().filter(f => f.req).length ? '📜 ' + feudi().filter(f => f.req).length + ' richieste' : countSt('alleato') + ' alleati · ' + countSt('vassallo') + ' tributari'}</small></button><button class="btn ghost" onclick="openMarket()">⚖ Forum<small>${hasB('mercato') ? 'compra e vendi' : 'serve il Forum'}</small></button></div><div class="acts"><button class="btn ghost" onclick="refreshTargets(true);openMap()">↻ Altri bersagli</button>${S.raids ? '<button class="btn ghost" onclick="startRaid()">🌙 Attendi la notte (difendi il presidio)</button>' : ''}</div>`;
  openSheet(ICO('map') + ' Mappa della Provincia', html, 'map');
}
function openHelp() {
  openSheet(ICO('scroll') + ' Come si gioca', `<div class="help">
  <p><b>Dal fango al trono.</b> Anno Domini 1254: la stirpe sveva si è spenta ed è il Grande Interregno. Hai un Castrum di legno marcio e pochi coloni.</p>
  <ul><li><b>Raccogli:</b> tocca le icone sopra gli edifici per incassare cibo, legno, oro e pietra.</li>
  <li><b>Economia:</b> Taberna e Villa Rustica → Cibo · Falegnameria → Legno · Fabrica → Ferro · Domus → Popolazione (posti esercito) e tasse · Armamentarium → +danno truppe · Valetudinarium → recupera i caduti.</li>
  <li><b>Città:</b> la Basilica aumenta la popolazione e sblocca Forum (scambi e oro), Tempio di Giove (morale e cure) e Biblioteca (ricerche). Le Mura con Porta fermano i nemici ma lasciano passare le tue truppe.</li>
  <li><b>Bestie:</b> di notte lupi e orsi si uniscono ai predoni, a volte arriva un branco intero. Ogni lupo abbattuto dà 1 pelle, ogni orso 3. Nei boschi lupi e orsi cacciano cervi e capre, che scappano.</li>
  <li><b>Animali:</b> cervi e capre si cacciano liberamente e danno Cibo; lupi (3 soldati) e orsi (6 soldati) danno Pelli 🧥, usate per armature, cavalleria pesante, ricerche e vendute al Forum. Toccali sulla mappa per cacciarli.</li>
  <li><b>Natura:</b> ogni oggetto della mappa si può rimuovere: alberi (danno legno), sassi e massi (danno pietra), funghi, cespugli e tronchi che spuntano nel presidio. Toccali e rimuovili per liberare spazio e ottenere risorse; puoi anche comprarli come decorazioni dal menu Costruisci.</li>
  <li><b>Missioni:</b> segui la pergamena in alto e riscuoti le ricompense.</li>
  <li><b>Costruisci e migliora:</b> hai 2 fabri. Il Castrum sblocca edifici, truppe ed eroi (liv. 1-4 Età del Castrum, 5-8 Età della Legione).</li>
  <li><b>Assedia:</b> dalla Mappa scegli un bersaglio, seleziona una truppa in basso e tocca il terreno fuori dalla zona rossa. Tieni premuto per schierarne tante. 3:30 di assedio.</li>
  <li><b>Stelle:</b> ★ 50% distrutto · ★ Castrum nemico abbattuto · ★ 100%. Le stelle danno Favore Imperiale.</li>
  <li><b>Eroi:</b> schierali una volta per battaglia, poi tocca la loro carta per l'abilità finale.</li>
  <li><b>Notte:</b> all'inizio hai 10 minuti di tregua per costruire il villaggio e armare le truppe. Poi, ogni 6 minuti di gioco, i predoni attaccano il villaggio. Torri, baliste e il tuo esercito difendono da soli; tu puoi schierare gli eroi.</li>
  <li><b>Difficoltà e layout:</b> scegli in fondo a questa pagina o nel menu iniziale. Facile allunga la tregua e indebolisce i nemici, Difficile li rende più numerosi e resistenti.</li>
  <li><b>Camera:</b> trascina per muoverti, pizzica o rotella per lo zoom. Ruota la mappa con i pulsanti ⟲ ⟳ a destra, girando liberamente con due dita (su PC: tasto destro o Shift + trascina, oppure Q / E): quando lasci si allinea al lato più vicino.</li></ul>
  <h4>🎨 Layout</h4><div class="lay">${layoutCards('openHelp()')}</div><h4>⚔ Difficoltà</h4><div class="dif">${diffCards('openHelp()')}</div>
  <div class="acts"><button class="btn ghost" onclick="openMenu()">${ICO('gear')} Menu · audio, layout, difficoltà</button><button class="btn ghost" onclick="newCampaign()">↺ Nuova partita</button><button class="btn ghost" onclick="toMenu()">🏠 Menu principale</button></div></div>`, 'help');
}

// ---------- missioni ----------
const built = t => S.buildings.filter(b => b.t === t && !(b.end && b.toLvl === 1)).length;
// ================= DIARIO DEL RITMO: misura quanto dura davvero ogni pezzo del gioco =================
const PACE_TARGET = { 2: 0.05, 3: 0.3, 4: 0.6, 5: 1.5, 6: 2.5, 7: 3.5, 8: 5, 9: 7, 10: 9, 11: 11.5, 12: 14, 13: 17, 14: 21, 15: 25, 16: 30 }; // ore di gioco attivo previste
function diary() { if (!S.diary) S.diary = { t0: now(), play: 0, sess: 1, lastSeen: now(), lvl: { 1: [0, now()] }, ch: {}, waste: {}, raids: 0, events: 0, hourly: [] }; return S.diary; }
function diaryTick(dt) {
  if (!S || S.creative || S.sandbox || MODE === 'title') return; const D = diary();
  if (now() - D.lastSeen > 10 * 60 * 1000) D.sess++; D.lastSeen = now(); D.play += dt;
  if (!D.lvl[S.mastio]) D.lvl[S.mastio] = [Math.round(D.play), now()];
  const q = QUESTS[S.mq]; if (q && D.ch[q.ch] == null) D.ch[q.ch] = [Math.round(D.play), now()];
}
function diaryWaste(r, v) { if (!S || S.creative || !S.diary || v <= 0) return; S.diary.waste[r] = (S.diary.waste[r] || 0) + v; }
const hm = s => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`; };
const dayOf = t => 1 + Math.floor((t - diary().t0) / 86400000);
function diaryText() {
  const D = diary(); const L = [];
  L.push(`IMPERIUM · diario del ritmo · ${new Date().toLocaleString('it-IT')}`);
  L.push(`Gioco attivo ${hm(D.play)} in ${D.sess} sessioni (media ${hm(D.play / Math.max(1, D.sess))}) · giorno ${dayOf(now())} · difficoltà ${DF().n} · ritmo ${SET.pace === 'rapido' ? 'rapido' : 'normale'}`);
  L.push('Castrum: ' + Object.keys(D.lvl).map(k => `${k}@${hm(D.lvl[k][0])}`).join(' '));
  L.push('Capitoli: ' + Object.keys(D.ch).map(k => `${CHAPTERS[k].n}@${hm(D.ch[k][0])}`).join(' '));
  L.push('Sprecato a magazzino pieno: ' + (Object.keys(D.waste).map(k => `${k} ${Math.round(D.waste[k])}`).join(', ') || 'niente'));
  L.push(`Razzie ${S.raids || 0} (vinte ${S.raidsWon || 0}) · assedi vinti ${S.wins || 0} · eventi ${S.events || 0} · scambi ${S.trades || 0} · carovane ${S.caravans || 0}`);
  return L.join('\n');
}
function openDiary() {
  const D = diary(); const lv = Object.keys(D.lvl).map(Number).sort((a, b) => a - b);
  const rows = lv.map(k => { const a = D.lvl[k][0] / 3600, t = PACE_TARGET[k]; const diff = t ? a / t : 1; const col = !t || k === 1 ? '' : diff < 0.6 ? 'fast' : diff > 1.5 ? 'slow' : 'ok';
    return `<tr><td>Castrum ${k}</td><td>${hm(D.lvl[k][0])}</td><td>${t ? hm(t * 3600) : '—'}</td><td class="${col}">${!t || k === 1 ? '' : diff < 0.6 ? 'troppo veloce' : diff > 1.5 ? 'troppo lento' : 'giusto'}</td><td>g. ${dayOf(D.lvl[k][1])}</td></tr>`; }).join('');
  const chs = Object.keys(D.ch).map(k => `<tr><td>Cap. ${CHAPTERS[k].n}</td><td>${hm(D.ch[k][0])}</td><td colspan="3">giorno ${dayOf(D.ch[k][1])}</td></tr>`).join('');
  const w = Object.keys(D.waste).map(k => `${ICO(k)} ${fmt(Math.round(D.waste[k]))}`).join(' ') || 'niente';
  const raidsH = D.play > 600 ? ((S.raids || 0) / (D.play / 3600)).toFixed(1) : '—';
  openSheet('📈 Diario del ritmo', `<div class="diary"><div class="dsum"><div><b>${hm(D.play)}</b><small>gioco attivo</small></div><div><b>${D.sess}</b><small>sessioni</small></div><div><b>${hm(D.play / Math.max(1, D.sess))}</b><small>sessione media</small></div><div><b>${dayOf(now())}</b><small>giorno</small></div></div>
    <table><tr><th>Traguardo</th><th>Tu</th><th>Previsto</th><th></th><th></th></tr>${rows}${chs}</table>
    <div class="row"><b>Sprecato a magazzino pieno:</b> ${w}</div><div class="row"><b>Razzie all'ora:</b> ${raidsH} · <b>eventi</b> ${S.events || 0} · <b>assedi vinti</b> ${S.wins || 0}</div>
    <p class="desc">Il diario registra quanto tempo di gioco attivo serve per ogni traguardo e lo confronta con il ritmo previsto. Copialo e incollalo in chat: così sistemiamo i numeri sui dati veri.</p>
    <div class="acts"><button class="btn" onclick="copyDiary()">📋 Copia il diario</button><button class="btn ghost" onclick="openMenu('game')">← Menu</button></div></div>`, 'diary');
}
function copyDiary() { const t = diaryText(); try { navigator.clipboard.writeText(t).then(() => toast('📋 Diario copiato: incollalo in chat'), () => prompt('Copia il diario:', t)); } catch (e) { prompt('Copia il diario:', t); } }
// --- previsioni: stagione in arrivo e razzia in arrivo ---
function forecastTick() {
  if (!S || S.creative || MODE !== 'village') return; const si = seasonInfo(); const next = SEASONS[(si.i + 1) % 4]; const left = si.left / 60000;
  const mark = si.i + ':' + (left <= 5 ? 5 : left <= 30 ? 30 : 0);
  if (S.fcMark !== mark && (left <= 30)) { S.fcMark = mark; if (left <= 30 && left > 5) toast(`${next.ic} ${next.n} in arrivo tra ${Math.ceil(left)} minuti: ${next.fx}`); else if (left <= 5) toast(`${next.ic} ${next.n} tra ${Math.ceil(left)} minuti!${next.k === 'inverno' ? ' Riempi i granai.' : ''}`); }
  if (!S.creative && S.nightIn != null && S.nightIn <= 120 && S.nightIn > 0 && !S.raidWarned) { S.raidWarned = 1; toast('🔥 Fuochi all\'orizzonte: i predoni arriveranno tra 2 minuti'); sfx('horn'); }
  if (S.nightIn > 125) S.raidWarned = 0;
}
// ================= VISITA AGLI ALTRI REGNI: ogni regno ha un villaggio diverso (stile, posizioni, abbellimenti) =================
const RSTYLE = [
  { k: 'radiale', n: 'a cerchi attorno al forte', deco: { cespuglio: 6, funghi: 3, stendardo: 4 } },
  { k: 'griglia', n: 'a isolati ordinati', deco: { stendardo: 6, masso: 2, cespuglio: 3 } },
  { k: 'strada', n: 'lungo la strada maestra', deco: { tronco: 3, cespuglio: 5, funghi: 2 } },
  { k: 'fortezza', n: 'chiuso dentro le mura', deco: { stendardo: 8, masso: 3 } },
  { k: 'sparso', n: 'a villaggi sparsi nei boschi', deco: { funghi: 7, cespuglio: 7, tronco: 4, masso: 3 } },
  { k: 'giardino', n: 'tra giardini e siepi', deco: { cespuglio: 14, funghi: 6, masso: 2, stendardo: 2 } },
];
function realmBuildList(L) {
  const cap = L <= 8 ? Math.min(4, 1 + Math.floor(L / 2)) : Math.min(8, 4 + Math.ceil((L - 8) / 2));
  const out = []; const ord = ['caserma', 'casa', 'fattoria', 'capanna', 'taverna', 'granaio', 'mercato', 'municipio', 'fucina', 'miniera', 'infermeria', 'armeria', 'cava', 'tesoreria', 'chiesa', 'poligono', 'scuderia', 'accademia', 'monastero', 'torre', 'torrepietra', 'balista'];
  for (const t of ord) { const d = BDEF[t]; if (!d || !d.max) continue; let n = d.max[Math.min(8, L) - 1]; if (L > 8) n += Math.round(n * (L - 8) / 8); for (let i = 0; i < n; i++) out.push({ t, lvl: Math.max(1, Math.min(cap, cap - (i % 2))) }); }
  return out;
}
function buildRealmScene(r) {
  const R = rng(r.seed * 3 + 11); const st = RSTYLE[r.i % RSTYLE.length]; const sc = newScene('visit'); sc.realm = r; sc.style = st;
  // acqua diversa per ogni regno
  const ponds = []; const np = 2 + ((R() * 4) | 0); for (let i = 0; i < np; i++) { const a = R() * 6.283, d = 18 + R() * 26; ponds.push({ k: 'lago', x: Math.round(MCX + Math.cos(a) * d - 3), y: Math.round(MCX + Math.sin(a) * d - 4), w: 7, h: 8 }); }
  const riv = { k: 'fiume', x: Math.round(MCX + (R() < 0.5 ? -1 : 1) * (10 + R() * 8) - 6), y: Math.round(MCX + (R() - 0.5) * 20 - 6), w: 13, h: 13 };
  sc.decals = [riv, ...ponds]; for (const d of sc.decals) stampMask(sc.water, d.k === 'fiume' ? EMASK.river.mask : EMASK.pond.mask, d.x, d.y);
  if (!GROUND_R || GROUND_R.seed !== r.seed || (GROUND_R.stale && TEX_OK)) { GROUND_R = paintGround(false, sc.decals, r.seed); GROUND_R.seed = r.seed; } sc.ground = GROUND_R;
  addTrees(sc, r.seed % 997, st.k === 'sparso' || st.k === 'giardino'); addGroves(sc, r.seed % 991, st.k === 'fortezza' ? 16 : 12);
  const occ = new Uint8Array(N * N);
  const free = (t, x, y, gap) => { const d = BDEF[t]; for (let yy = y - gap; yy < y + d.h + gap; yy++) for (let xx = x - gap; xx < x + d.w + gap; xx++) { if (!inMap(xx, yy) || xx < 3 || yy < 3 || xx >= N - 3 || yy >= N - 3) return false; if (occ[yy * N + xx] || sc.water[yy * N + xx]) return false; } return true; };
  const put = (t, x, y, lvl) => { const d = BDEF[t]; for (let yy = y; yy < y + d.h; yy++) for (let xx = x; xx < x + d.w; xx++) occ[yy * N + xx] = 1; const b = mkBuilding(t, x, y, lvl, 'D', null); if (d.wall) b.mask = 0; sc.B.push(b); return b; };
  const cx = Math.round(MCX - 1 + (R() - 0.5) * 6), cy = Math.round(MCX - 1 + (R() - 0.5) * 6);
  // sgombero l'area centrale dagli alberi
  const m = put('mastio', cx, cy, r.lvl);
  const list = realmBuildList(r.lvl); for (let i = list.length - 1; i > 0; i--) { const j = (R() * (i + 1)) | 0; [list[i], list[j]] = [list[j], list[i]]; }
  const tryAt = (t, lvl, gen, tries, gap) => { for (let k = 0; k < tries; k++) { const [x, y] = gen(k); if (free(t, Math.round(x), Math.round(y), gap)) { put(t, Math.round(x), Math.round(y), lvl); return true; } } return false; };
  const a0 = R() * 6.283; let ring = 0;
  for (const it of list) {
    const d = BDEF[it.t]; let ok = false;
    if (st.k === 'radiale') ok = tryAt(it.t, it.lvl, k => { const rr = 6 + Math.floor(k / 24) * 4 + (ring % 2); const a = a0 + k * 0.26 + R() * 0.1; return [cx + 1 + Math.cos(a) * rr - d.w / 2, cy + 1 + Math.sin(a) * rr - d.h / 2]; }, 140, 1);
    else if (st.k === 'griglia') ok = tryAt(it.t, it.lvl, k => { const gx = ((k * 7) % 11) - 5, gy = (Math.floor(k * 7 / 11) % 11) - 5; return [cx + 1 + gx * 4 - d.w / 2 + (R() < 0.2 ? 1 : 0), cy + 1 + gy * 4 - d.h / 2]; }, 160, 0);
    else if (st.k === 'strada') { const dir = R() < 0.5 ? [1, 0] : [0, 1]; ok = tryAt(it.t, it.lvl, k => { const along = (k % 2 ? 1 : -1) * (5 + Math.floor(k / 2) * 2.2), side = ((k >> 1) % 2 ? 1 : -1) * (3 + (k % 5)); return dir[0] ? [cx + along, cy + side] : [cx + side, cy + along]; }, 160, 0); }
    else if (st.k === 'fortezza') ok = tryAt(it.t, it.lvl, k => { const s = 5 + Math.floor(k / 30) * 2; return [cx + 1 + (R() * 2 - 1) * s - d.w / 2, cy + 1 + (R() * 2 - 1) * s - d.h / 2]; }, 200, 0);
    else { const hubs = sc.hubs || (sc.hubs = [0, 1, 2, 3].map(i => { const a = a0 + i * 1.6 + R(); const rr = st.k === 'sparso' ? 14 + R() * 8 : 8 + R() * 6; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; })); const h = hubs[(R() * hubs.length) | 0]; ok = tryAt(it.t, it.lvl, k => [h[0] + (R() - 0.5) * (6 + k * 0.4), h[1] + (R() - 0.5) * (6 + k * 0.4)], 120, st.k === 'giardino' ? 1 : 0); }
    if (!ok) tryAt(it.t, it.lvl, () => [cx + (R() - 0.5) * 40, cy + (R() - 0.5) * 40], 200, 0); ring++;
  }
  // mura per le fortezze (e per i regni dall'Era II in su, a volte)
  if (st.k === 'fortezza' || (r.lvl >= 6 && R() < 0.4)) {
    let x0 = N, y0 = N, x1 = 0, y1 = 0; for (const b of sc.B) { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); }
    x0 -= 2; y0 -= 2; x1 += 1; y1 += 1; const gate = [Math.round((x0 + x1) / 2), y1];
    for (let x = x0; x <= x1; x++) for (const y of [y0, y1]) if (!(y === gate[1] && Math.abs(x - gate[0]) <= 1) && free('muro', x, y, 0)) put('muro', x, y, r.lvl >= 5 ? 2 : 1);
    for (let y = y0 + 1; y < y1; y++) for (const x of [x0, x1]) if (free('muro', x, y, 0)) put('muro', x, y, r.lvl >= 5 ? 2 : 1);
    if (r.lvl >= 5 && free('cancello', gate[0] - 1, gate[1] - 1, 0)) put('cancello', gate[0] - 1, gate[1] - 1, 1);
  }
  // abbellimenti
  for (const t in st.deco) { const n = Math.round(st.deco[t] * (0.6 + R() * 0.8) * (0.6 + r.lvl / 10)); for (let i = 0; i < n; i++) tryAt(t, 1, () => { const b = sc.B[(R() * sc.B.length) | 0]; return [b.x + (R() < 0.5 ? -1 - BDEF[t].w : b.w + 1) + ((R() * 2) | 0), b.y + ((R() * (b.h + 2)) | 0) - 1]; }, 30, 0); }
  // via gli alberi dalle costruzioni
  sc.trees = sc.trees.filter(t => !occ[(t.y | 0) * N + (t.x | 0)] && Math.hypot(t.x - cx, t.y - cy) > 7); sc.rocks = sc.rocks.filter(o => !occ[(o.y | 0) * N + (o.x | 0)]);
  sceneIndex(sc); try { computePaths(sc); } catch (e) { }
  // qualche abitante a passeggio e i soldati in piazza
  const homes = sc.B.filter(b => !BDEF[b.t].wall && !BDEF[b.t].decor);
  for (let i = 0; i < Math.min(10, 3 + r.lvl); i++) { const h = homes[(R() * homes.length) | 0]; const [hx, hy] = frontTile(sc, h); const k = ['cuoco', 'fabbro', 'infermiera', 'taglialegna'][i % 4]; const u = mkUnit('miliziano', 'V', hx + 0.5, hy + 0.5); u.k = k; u.d = { spd: 0.7, hp: 1, cd: 1, rng: 0 }; u.home = h; u.jk = 'wander'; u.st = 'rest'; u.wt = R() * 4; u.ai = workerAI; sc.U.push(u); }
  const [fx, fy] = frontTile(sc, m); const pool = r.lvl >= 5 ? ['scudata', 'arccorto', 'miliziano', 'picchiere'] : ['miliziano', 'arccorto'];
  for (let i = 0; i < Math.min(12, 3 + r.lvl); i++) { const k = pool[i % pool.length]; if (!UDEF[k]) continue; const u = mkUnit(k, 'V', fx + 1.5 + (i % 4) * 0.55, fy + 0.6 + Math.floor(i / 4) * 0.6); u.face = 'F'; u.ai = soldierAI; sc.U.push(u); }
  return sc;
}
let VISIT_PREV = null;
function visitRealm(i) {
  const r = realms()[i]; closeSheet(); closeFolk(); VISIT_PREV = MODE;
  MODE = 'visit'; SC = buildRealmScene(r); const m = SC.B.find(b => b.t === 'mastio'); centerCam(m.x + 1.5, m.y + 1.5); cam.z = VW < 600 ? 0.8 : 1;
  $('#title').classList.add('hidden'); $('#hud').classList.add('hidden'); $('#bhud').classList.add('hidden'); $('#rotbar').classList.remove('hidden');
  let el = $('#vbar'); if (!el) { el = document.createElement('div'); el.id = 'vbar'; document.body.appendChild(el); }
  const canAtk = S && VISIT_PREV === 'village' && r.lvl <= S.mastio + 3;
  el.innerHTML = `<div class="vb"><span class="rem" style="background:${r.col}">${r.ic}</span><div><b>${r.name}</b><small>di ${r.user} · Castrum ${r.lvl} · villaggio ${SC.style.n}</small></div></div><div class="va"><button class="btn ghost" onclick="leaveVisit()">⬅ Torna</button>${canAtk ? `<button class="btn" onclick="leaveVisit(true,${i})">⚔ Assedia</button>` : ''}</div>`;
  el.classList.remove('hidden');
}
function leaveVisit(attack, i) {
  const el = $('#vbar'); if (el) el.classList.add('hidden');
  if (VISIT_PREV === 'title' || !S) { MODE = 'title'; SC = null; showTitle(); if (typeof titleScene === 'function') titleScene(); return; }
  backToVillage(); if (attack) attackRealm(i);
}
function visitTap(sx, sy) {
  const [tx, ty] = screenToTile(sx, sy); const b = bAt(SC, Math.floor(tx), Math.floor(ty)); if (!b) return;
  const d = BDEF[b.t]; toast(`${d.icon || '🏠'} ${b.t === 'mastio' ? (b.lvl >= 5 ? 'Castellum' : 'Castrum') : d.n}${d.decor || d.wall ? '' : ' · livello ' + b.lvl}`);
}
// ================= GUIDA DEI PRIMI 10 MINUTI: il Siniscalco ti accompagna passo passo =================
const TUT = [
  { t: 'Ave, tribuno', x: 'Sono il vostro Centurione. Questo è il Castrum di legno che vostro padre vi ha lasciato sul limes. Vi mostro come far crescere il presidio: ci vorrà qualche minuto.', next: 'Cominciamo' },
  { t: 'Raccogli le monete', x: 'Le botteghe producono da sole. Quando sopra un edificio compare un\'icona, toccala per raccogliere. Tocca la moneta sopra il Castrum.', world: () => { const b = SC.B.find(b => b.t === 'mastio'); return b && [b.x + b.w / 2, b.y + b.h / 2, 110]; }, done: () => (S.collects || 0) > 0, prep: () => { const m = S.buildings.find(b => b.t === 'mastio'); if (m) m.stock = Math.max(m.stock || 0, 40); } },
  { t: 'Costruisci la Taberna', x: 'La Taberna dà cibo al presidio ed è la vostra prima missione. Tocca «Costruisci», scegli la Taberna e posizionala dove preferite.', el: () => $('#hud-bot .hb'), done: () => (placing && placing.t === 'taverna') || S.buildings.some(b => b.t === 'taverna') },
  { t: 'Conferma il posto', x: 'Spostala col dito o con le frecce, poi tocca ✓ per far partire i lavori. I fabri della legione ci metteranno un minuto.', el: () => placing && $('#placebar .pbtn.ok'), skipIf: () => S.buildings.some(b => b.t === 'taverna'), done: () => S.buildings.some(b => b.t === 'taverna') },
  { t: 'Addestra i soldati', x: 'Di notte i barbari attraversano il fiume. Tocca «Esercito» e addestra qualche Tirone: costano solo cibo.', el: () => $('#hud-bot .hb:nth-child(2)'), done: () => S.queue.length > 0 || (S.tutArmy != null && Object.values(S.army).reduce((a, b) => a + b, 0) > S.tutArmy), prep: () => { S.tutArmy = Object.values(S.army).reduce((a, b) => a + b, 0); } },
  { t: 'Conosci la tua gente', x: 'Ogni colono e soldato ha un nome e può crescere. Tocca una persona che cammina per il villaggio.', world: () => { const u = SC.U.find(u => !u.dead && u.side === 'V' && u.home); return u && [u.x, u.y, 46]; }, done: () => !!(SC.folkU) },
  { t: 'Il Promemoria', x: 'Quando non sapete cosa fare, toccate la tavoletta: vi dico io cosa attende la vostra attenzione.', el: () => $('#memob'), done: () => $('#sheet').dataset.p === 'memo' },
  { t: 'Le missioni', x: 'In alto c\'è la missione del capitolo. Quando è compiuta compare «Riscuoti»: la ricompensa vi aiuta a crescere. Finite la Taberna e riscuotetela.', el: () => $('#quest'), done: () => S.mq >= 1 },
  { t: 'Il presidio è vostro', x: 'Ora sapete l\'essenziale. Dalla «Mappa» potrete assediare i vicini, trattare con i capi e commerciare. Che le trombe suonino il vostro nome!', next: 'Al lavoro!' },
];
let TUT_SHOWN = -1;
function tutActive() { return S && !S.creative && !S.sandbox && S.tut != null && S.tut >= 0 && S.tut < TUT.length; }
function tutStart() { S.tut = 0; TUT_SHOWN = -1; }
function tutSkip() { S.tut = -1; tutHide(); save(); toast('Guida chiusa: la trovi in Menu → Partita'); }
function tutNext() { S.tut++; TUT_SHOWN = -1; sfx('click'); if (S.tut >= TUT.length) { S.tut = -1; tutHide(); } save(); }
function tutHide() { const b = $('#tutb'), a = $('#tuta'); if (b) b.classList.add('hidden'); if (a) a.classList.add('hidden'); }
// suggerimenti brevi quando la finestra giusta è aperta
const TUT_MINI = { 2: { build: 'Scegli la Taberna nell\'elenco' }, 4: { army: 'Tocca «+1» sul Tirone' } };
function tutTick() {
  if (!tutActive() || MODE !== 'village') { tutHide(); return; }
  const st = TUT[S.tut]; if (st.skipIf && st.skipIf()) { tutNext(); return; }
  if (st.done && st.done()) { sfx('coin'); tutNext(); return; }
  let b = $('#tutb'); if (!b) { b = document.createElement('div'); b.id = 'tutb'; document.body.appendChild(b); } let a = $('#tuta'); if (!a) { a = document.createElement('div'); a.id = 'tuta'; a.textContent = '👇'; document.body.appendChild(a); }
  const sp = !$('#sheet').classList.contains('hidden') ? $('#sheet').dataset.p : '';
  const fcard = $('#fcard') && !$('#fcard').classList.contains('hidden'), ask = $('#askd') && !$('#askd').classList.contains('hidden'), story = $('#story') && !$('#story').classList.contains('hidden');
  const mini = sp && TUT_MINI[S.tut] && TUT_MINI[S.tut][sp];
  // con una finestra aperta la guida si fa da parte: niente sovrapposizioni
  if (ask || story || fcard || (sp && !mini)) { tutHide(); TUT_SHOWN = -2; return; }
  const key = mini ? 'm' + S.tut : S.tut;
  if (TUT_SHOWN !== key) { if (TUT_SHOWN !== -2 && !mini && st.prep && TUT_SHOWN !== 'm' + S.tut) st.prep(); TUT_SHOWN = key;
    b.className = mini ? 'mini' : '';
    b.innerHTML = mini ? `<div class="tav">🕯️</div><div class="ttx"><small>Guida · ${S.tut + 1}/${TUT.length}</small><b>${mini}</b></div>`
      : `<div class="tav">🕯️</div><div class="ttx"><small>Guida · ${S.tut + 1}/${TUT.length}</small><b>${st.t}</b><p>${st.x}</p><div class="tbt">${st.next ? `<button class="btn" onclick="tutNext()">${st.next}</button>` : ''}<button class="btn ghost" onclick="tutSkip()">Salta guida</button></div></div>`; }
  b.classList.remove('hidden'); b.classList.toggle('top', !!placing && !mini);
  // freccia: solo senza finestre aperte, e mai sotto la nuvoletta
  let pt = null;
  if (!sp) { if (st.el) { const e = st.el(); if (e && e.offsetParent !== null) { const r = e.getBoundingClientRect(); pt = [r.left + r.width / 2, r.top]; } }
    else if (st.world) { const w = st.world(); if (w) { const [px, py] = W(w[0], w[1]); pt = [(px - cam.x) * cam.z + VW / 2, (py - cam.y) * cam.z + VH / 2 - w[2] * cam.z]; } } }
  const br = b.getBoundingClientRect(); if (pt && pt[1] - 46 < br.bottom && pt[1] > br.top - 10 && pt[0] > br.left && pt[0] < br.right && !(st.el && st.el() && st.el().closest && st.el().closest('#hud-bot'))) pt = null;
  if (pt && pt[0] > 0 && pt[0] < VW && pt[1] > 0 && pt[1] < VH) { a.style.left = (pt[0] - 18) + 'px'; a.style.top = (pt[1] - 46) + 'px'; a.classList.remove('hidden'); } else a.classList.add('hidden');
}
// ================= VITA NEL VILLAGGIO: giorno e notte, carovane, suoni d'ambiente =================
const DAY_MS = 24 * 60 * 1000; // una giornata = 24 minuti reali
function dayInfo() { const t0 = (S && S.seasonEpoch) || 0; const p = (((now() - t0) % DAY_MS) + DAY_MS) % DAY_MS / DAY_MS; // 0=alba
  const night = p < 0.06 ? 1 - p / 0.06 : p < 0.62 ? 0 : p < 0.7 ? (p - 0.62) / 0.08 : p < 0.94 ? 1 : 1 - (p - 0.94) / 0.06;
  const ph = p < 0.08 ? ['🌅', 'Alba'] : p < 0.55 ? ['☀️', 'Giorno'] : p < 0.68 ? ['🌇', 'Tramonto'] : p < 0.94 ? ['🌙', 'Notte'] : ['🌅', 'Alba'];
  const hour = Math.floor((6 + p * 24) % 24); return { p, night: Math.max(0, Math.min(1, night)), ic: ph[0], n: ph[1], hour, dusk: p > 0.55 && p < 0.7 }; }
function drawBanner(c, l) { if (!G3.models.insegna) need3d('insegna'); const m = G3.models.insegna; if (!m || !m.ready) return; const [wx, wy] = W(l.x, l.y); const yr = ((l.yaw - ANG) % 6.283 + 6.283) % 6.283; const yq = [0, 0.45, 2.69, 3.14, 3.59, 5.83].reduce((b, v) => Math.abs(Math.atan2(Math.sin(v - yr), Math.cos(v - yr))) < Math.abs(Math.atan2(Math.sin(b - yr), Math.cos(b - yr))) ? v : b, 0); const sp = g3sprite('insegna', l.h || 112, yq, 0); if (sp) c.drawImage(sp.cv, wx + sp.x0, wy + sp.y0, sp.w, sp.h); }
function drawLamp(c, l) { if (!G3.models.lampione) need3d('lampione'); need3d('insegna'); const [wx, wy] = W(l.x, l.y); const m = G3.models.lampione; if (!m || !m.ready) { c.fillStyle = '#4a3420'; c.fillRect(wx - 1.2, wy - 40, 2.4, 40); return; }
  const yq = Math.round(((l.yaw - ANG) % 6.283 + 6.283) % 6.283 / 0.785) % 8 * 0.785; const sp = g3sprite('lampione', 84, yq, 0); if (sp) c.drawImage(sp.cv, wx + sp.x0, wy + sp.y0, sp.w, sp.h); }
function nightLights(c, sc, k) {
  if (PATHC.lamps && sc.pathG === PATHC.grid) for (const l of PATHC.lamps) { const [lx, ly] = W(l.x, l.y); const fl = 0.9 + Math.sin(sc.time * 6 + l.x * 3) * 0.08; for (const [x, y, r, a] of [[lx, ly - 60, 15, 0.32], [lx, ly, 26, 0.07]]) { const gr = c.createRadialGradient(x, y, 1, x, y, r * fl); gr.addColorStop(0, `rgba(255,200,110,${a * k})`); gr.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); } }
    for (const b of sc.B) { if (b.dead) continue; const d = BDEF[b.t]; if (b.t === 'lanterna') { const [lx, ly] = W(b.x + 0.5, b.y + 0.5); const x = lx + 7, y = ly - 37; const fl = 0.9 + Math.sin(sc.time * 7 + b.id) * 0.08; const gr = c.createRadialGradient(x, y, 1, x, y, 34 * fl); gr.addColorStop(0, `rgba(255,200,110,${0.55 * k})`); gr.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = gr; c.fillRect(x - 34, y - 34, 68, 68); const g2 = c.createRadialGradient(lx, ly, 1, lx, ly, 40); g2.addColorStop(0, `rgba(255,190,100,${0.18 * k})`); g2.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = g2; c.fillRect(lx - 40, ly - 40, 80, 80); continue; }
      if (d.wall || (d.decor && b.t !== 'falo') || b.nat) continue; const [wx, wy] = W(b.x + b.w / 2, b.y + b.h / 2); const h0 = ((b.x * 73856093) ^ (b.y * 19349663) ^ (b.id * 83492791)) >>> 0;
      if (b.t === 'falo') { const fl = 0.8 + Math.sin(sc.time * 11 + b.id) * 0.12 + Math.sin(sc.time * 17) * 0.06; const gr = c.createRadialGradient(wx, wy - 8, 1, wx, wy - 8, 26 * fl); gr.addColorStop(0, `rgba(255,190,90,${0.55 * k})`); gr.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = gr; c.beginPath(); c.arc(wx, wy - 8, 26 * fl, 0, 7); c.fill(); continue; }
      if (NOLIGHT.has(b.t) || (b.t !== 'mastio' && h0 % 4 === 0)) continue; // qualche casa resta al buio
      const nW = b.t === 'mastio' ? 6 : Math.min(4, 1 + (h0 >> 3) % 2 + (b.w > 2 ? 1 : 0)); const sp = b.t === 'mastio' ? 9 + (S.mastio || 1) * 2.6 : 9 + b.w * 3;
      for (let i = 0; i < nW; i++) { const hh = (h0 >> (i * 3)) & 63; const side = i % 2 ? 1 : -1; const ox = side * (5 + (hh % 5) * 0.2 * sp) ; const oy = -10 - (hh >> 2) % 4 * 4 - b.w * 3 + Math.abs(ox) * 0.35; const x = wx + ox, y = wy + oy;
        const fl = 0.85 + Math.sin(sc.time * 2.3 + b.id * 3 + i * 1.7) * 0.1 + (Math.sin(sc.time * 9 + i * 5 + b.id) > 0.97 ? -0.3 : 0); const al = k * fl;
        const gr = c.createRadialGradient(x, y, 0.5, x, y, 9); gr.addColorStop(0, `rgba(255,190,100,${0.35 * al})`); gr.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = gr; c.fillRect(x - 9, y - 9, 18, 18);
        c.fillStyle = `rgba(255,214,130,${0.95 * al})`; c.fillRect(x - 1.3, y - 2, 2.6, 3.6); c.fillStyle = `rgba(255,245,200,${0.8 * al})`; c.fillRect(x - 0.6, y - 1.4, 1.2, 1.6); }
    }
}
const NOLIGHT = new Set(['poligono', 'stendardo', 'cripta', 'cancello', 'balista', 'bottino', 'tenda']);
function drawDayNight(c, sc, z) {
  if (sc.mode !== 'village' && sc.mode !== 'visit') return; const D = dayInfo(); const k = D.night;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  if (D.dusk) { c.fillStyle = `rgba(255,120,40,${0.12 * Math.sin(Math.PI * (D.p - 0.55) / 0.15)})`; c.globalCompositeOperation = 'soft-light'; c.fillRect(0, 0, cv.width, cv.height); c.globalCompositeOperation = 'source-over'; }
  if (k > 0.01) {
    c.fillStyle = `rgba(12,20,45,${0.5 * k})`; c.fillRect(0, 0, cv.width, cv.height);
    c.globalCompositeOperation = 'lighter'; c.setTransform(z, 0, 0, z, DPR * (VW / 2 - cam.x * cam.z), DPR * (VH / 2 - cam.y * cam.z));
    nightLights(c, sc, k);
    // lucciole d'estate e stelle
    if (seasonInfo().s.k === 'estate') for (let i = 0; i < 18; i++) { const px = ((i * 977 + sc.time * 6 * (i % 3 + 1)) % VW), py = ((i * 613 + Math.sin(sc.time + i) * 30) % VH); const al = (0.5 + 0.5 * Math.sin(sc.time * 3 + i * 2)) * k; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(220,255,140,${al * 0.8})`; c.beginPath(); c.arc(px * DPR, py * DPR, 1.8 * DPR, 0, 7); c.fill(); }
  }
  c.restore();
}
// --- carovane che arrivano lungo i sentieri ---
function caravanSpawn(sc, label) {
  if (!sc || sc.mode !== 'village') return; const dest = sc.B.find(b => b.t === 'mercato' && !b.dead) || sc.B.find(b => b.t === 'mastio'); if (!dest) return;
  const [tx, ty] = frontTile(sc, dest); const edges = []; for (let i = 4; i < N - 4; i += 6) edges.push([i, 3], [i, N - 4], [3, i], [N - 4, i]);
  const G = sc.pathG; let best = null, bd = 1e9; for (const [ex, ey] of edges) { if (isWater(sc, ex, ey) || bAt(sc, ex, ey)) continue; const d = Math.hypot(ex - tx, ey - ty) + Math.random() * 25; if (d < bd) { bd = d; best = [ex, ey]; } } if (!best) return;
  const path = astar(best[0], best[1], (x, y) => x === tx && y === ty, villagerCost(sc), tx, ty, 9000); if (!path) return;
  const u = mkUnit('miliziano', 'V', best[0] + 0.5, best[1] + 0.5); u.k = 'carro'; u.d = { spd: 0.9, hp: 1, cd: 1, rng: 0, model: 1 }; u.path = path; u.pi = 0; u.cart = label || 'Carovana di mercanti';
  u.ai = (sc, u, dt) => { if (followPath(sc, u, dt)) { u.dead = true; u.deadT = 9; if (u.cart) floatText(sc, u.x, u.y, '🐴 ' + u.cart, '#ffe9a6', 1.6); } };
  sc.U.push(u); return u;
}
function drawCart(c, u, wx, wy) {
  if (!G3.models.bottino) need3d('bottino'); if (!G3.models.bottino || !G3.models.bottino.ready) { c.font = '22px serif'; c.textAlign = 'center'; c.fillText('🐴', wx, wy - 4); return true; }
  const yaw = u.face === 'B' ? (u.flip ? 2.4 : 3.9) : (u.flip ? 0.75 : -0.75); const sp = g3sprite('bottino', 44, yaw, 0); if (!sp) return false;
  const bob = Math.abs(Math.sin(u.phase * 6)) * 1.2; u.phase += 1 / 60;
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.ellipse(wx, wy, 18, 7, 0, 0, 7); c.fill(); c.drawImage(sp.cv, wx + sp.x0, wy + sp.y0 - bob, sp.w, sp.h); return true;
}
let CARAVAN_T = 90;
function lifeTick(dt) { if (!S || MODE !== 'village' || S.creative) return; festTick(dt); visitorTick(dt); CARAVAN_T -= dt; if (CARAVAN_T <= 0) { CARAVAN_T = 150 + Math.random() * 150; if (dayInfo().night < 0.5 && SC.U.filter(u => u.k === 'carro' && !u.dead).length < 2) caravanSpawn(SC, ['Mercanti di stoffe', 'Carro del mugnaio', 'Pellegrini con un carro', 'Venditori di sale'][(Math.random() * 4) | 0]); } ambientTick(dt); }
// --- suoni d'ambiente (sintetizzati, al volume degli effetti) ---
const AMB = { t: 2, hammer: 1, bell: -1 };
function ambientTick(dt) {
  if (SET.mute || SET.fvol <= 0 || document.hidden || !AC || MODE !== 'village') return; const a = AC; const out = fxOut(a); const D = dayInfo(), si = seasonInfo().s.k, w = S.wx || { k: 'sereno' };
  const blip = (f0, f1, dur, vol, type, delay) => { const t = a.currentTime + (delay || 0); const o = a.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.05); };
  AMB.t -= dt; if (AMB.t <= 0) {
    AMB.t = 2.5 + Math.random() * 4;
    if (D.night < 0.5 && w.k !== 'pioggia' && w.k !== 'temporale' && si !== 'inverno') { const n = 2 + ((Math.random() * 4) | 0), f = 2600 + Math.random() * 1800; for (let i = 0; i < n; i++) blip(f * (1 + Math.random() * 0.2), f * (0.75 + Math.random() * 0.5), 0.09 + Math.random() * 0.06, 0.035, 'sine', i * 0.12); }
    else if (D.night >= 0.5 && si !== 'inverno') { for (let i = 0; i < 6; i++) blip(4300, 4200, 0.035, 0.012, 'square', i * 0.07); }
    if (D.night >= 0.5 && Math.random() < 0.15) { blip(420, 380, 0.5, 0.03, 'sine'); blip(330, 300, 0.7, 0.03, 'sine', 0.55); } // gufo
  }
  AMB.hammer -= dt; if (AMB.hammer <= 0) { AMB.hammer = 1.1 + Math.random() * 1.5; if (S.buildings.some(b => b.end && !BDEF[b.t].wall && !BDEF[b.t].decor)) for (let i = 0; i < 2; i++) blip(900, 300, 0.06, 0.05, 'triangle', i * 0.32); }
  const dawn = D.p < 0.02; if (dawn && AMB.bell !== Math.floor((now() - (S.seasonEpoch || 0)) / DAY_MS)) { AMB.bell = Math.floor((now() - (S.seasonEpoch || 0)) / DAY_MS); for (let i = 0; i < 3; i++) [1, 2.01, 2.76].forEach((m, j) => blip(330 * m, 330 * m, 2.2 - j * 0.4, 0.05 / (j + 1), 'sine', i * 1.4)); toast('🔔 Suonano le trombe: è l\'alba'); }
}
// ================= MEMO: la pergamena delle cose da fare =================
function memoItems() {
  if (!S || S.creative || MODE !== 'village') return []; const it = []; const add = (pri, ic, t, sub, act, lbl) => it.push({ pri, ic, t, sub, act, lbl });
  // missione pronta
  const q = QUESTS[S.mq]; if (q && q.c()) add(0, '📜', 'Missione compiuta: riscuoti!', q.t, 'claimQuest();openMemo()', 'Riscuoti');
  // missione bloccata dai materiali
  { const qc = questCost(); if (qc && Object.keys(lacking(qc.cost)).length) add(1, '🧱', `Per ${qc.what} manca qualcosa`, needLabel(qc.cost), `questNeed()`, 'Dove trovarlo'); }
  // razzia in arrivo
  if (S.raids != null && S.nightIn > 0 && S.nightIn <= 180) add(0, '🔥', `Predoni tra ${fmtT(S.nightIn * 1000)}`, 'Controlla mura, torri ed esercito', "closeSheet();openArmy()", 'Esercito');
  // raccolto
  const ready = S.buildings.filter(r => !r.end && resOf(r) && r.stock >= Math.max(1, stockCap(r) * 0.15)); if (ready.length) { const tot = {}; for (const r of ready) { const k = resOf(r); tot[k] = (tot[k] || 0) + Math.floor(r.stock); } add(1, '🧺', `${ready.length} botteghe da raccogliere`, Object.keys(tot).map(k => ICO(k) + ' ' + fmt(tot[k])).join('  '), 'memoCollect()', 'Raccogli tutto'); }
  // magazzini pieni
  const c = caps(); const full = RES.filter(r => r !== 'favore' && S.res[r] >= c[r] * 0.97); if (full.length) add(1, '📦', 'Magazzino pieno', full.map(r => ICO(r) + ' ' + RNAME[r]).join(', ') + ': spendi o costruisci un Horreum', "closeSheet();openBuild()", 'Costruisci');
  // mastri d'opera liberi
  const free = maxBuilders() - builders(); if (free > 0) { const m = S.buildings.find(b => b.t === 'mastio'); const mc = m && !m.end && !canUp(m) ? upCost(m) : null; if (mc && canPay(mc)) add(1, '🏰', `Puoi alzare il Castrum al livello ${m.lvl + 1}`, 'Sblocca edifici, truppe e la prossima era', `closeSheet();openBuildingInfo(S.buildings.find(b=>b.t==='mastio'))`, 'Vai');
    else add(2, '🔨', `${free} mastr${free > 1 ? 'i' : 'o'} d'opera senza lavoro`, 'Costruisci o migliora un edificio', "closeSheet();openBuild()", 'Costruisci'); }
  // edifici migliorabili ora
  if (free > 0) { const ups = S.buildings.filter(r => r.t !== 'mastio' && !BDEF[r.t].wall && !BDEF[r.t].decor && !r.nat && !canUp(r) && canPay(upCost(r))); if (ups.length) { const r = ups.sort((a, b) => a.lvl - b.lvl)[0]; add(2, '⬆', `${ups.length} edifici migliorabili`, `Per esempio ${BDEF[r.t].n} al livello ${r.lvl + 1}`, `closeSheet();openBuildingInfo(S.buildings.find(b=>b.id===${r.id}))`, 'Vai'); } }
  // persone con punti da spendere
  const pts = []; for (const k in (S.vets || {})) for (const r of S.vets[k]) if (r.pts) pts.push(r); for (const k in (S.wrk || {})) if (S.wrk[k].pts) pts.push(S.wrk[k]); for (const k in (S.hrec || {})) if (S.hrec[k].pts) pts.push(S.hrec[k]);
  if (pts.length) add(1, '⭐', `${pts.length} ${pts.length > 1 ? 'persone hanno' : 'persona ha'} punti da spendere`, pts.slice(0, 3).map(r => r.nm).join(', ') + (pts.length > 3 ? '…' : ''), `memoFolk(${pts[0].id})`, 'Mostra');
  // persone da addestrare
  const busyT = new Set((S.works || []).filter(w => w.kind === 'train').map(w => w.rid)); const all = []; for (const k in (S.wrk || {})) all.push(S.wrk[k]); for (const k in (S.vets || {})) for (const r of S.vets[k]) all.push(r);
  const tr = all.filter(r => !busyT.has(r.id) && r.lvl < FOLK_MAX() && canPay(trainCost(r))).sort((a, b) => a.lvl - b.lvl);
  if (tr.length && !busyT.size) add(3, '🎯', 'Nessuno si sta addestrando', `${tr[0].nm} può salire di livello`, `memoFolk(${tr[0].id})`, 'Addestra');
  // esercito
  if (!S.queue.length && armyUsed() < armyCap()) add(3, '⚔', 'La caserma è ferma', `Posti liberi nell'esercito: ${armyCap() - armyUsed()}`, "closeSheet();openArmy()", 'Addestra');
  // diplomazia
  const reqs = typeof feudi === 'function' ? feudi().filter(f => f.req) : []; if (reqs.length) add(1, '🤝', `${reqs.length} ${reqs.length > 1 ? 'capi aspettano' : 'capo aspetta'} una risposta`, reqs.map(f => `${fBase(f).lord} (scade ${fmtT(f.req.left * 1000)})`).join(', '), "closeSheet();openDiplo()", 'Diplomazia');
  if (typeof feudi === 'function') { const g = feudi().find(f => f.st !== 'guerra' && now() >= (f.gift || 0) && f.rel < 60 && canPay(giftCost(f))); if (g && S.mq >= 10) add(3, '🎁', `Puoi mandare un dono a ${fBase(g).lord}`, `Rapporto: ${relWord(g.rel)}`, "closeSheet();openDiplo()", 'Diplomazia'); }
  // stagione in arrivo
  const si = seasonInfo(); if (si.left < 30 * 60000) { const n = SEASONS[(si.i + 1) % 4]; add(2, n.ic, `${n.n} tra ${fmtT(si.left)}`, n.fx + (n.k === 'inverno' ? ' · fai scorte di cibo' : n.k === 'autunno' ? ' · ottimo per vendere il grano dopo' : ''), "closeSheet();openWeather()", 'Meteo'); }
  if (!S.arms && S.mq >= 1) add(3, '🛡️', 'Scegli lo stemma della casata', 'Colori e figura per stendardi e bandiere', 'openArms()', 'Stemma');
  if (prestige() < 6 && S.mastio >= 2) add(4, '🌷', 'Abbellisci il villaggio', 'Le decorazioni danno Prestigio: più produzione e un popolo felice', "closeSheet();openBuild('d')", 'Decorazioni');
  // caccia
  if ((S.hunted || 0) < 3 && S.fauna && S.fauna.some(a => !FAUNA[a.k].need)) add(4, '🏹', 'Animali da cacciare nei boschi', 'Tocca un cervo, una capra o una lepre sulla mappa', null, '');
  return it.sort((a, b) => a.pri - b.pri);
}
function memoCollect() { let n = 0; for (const r of S.buildings) if (!r.end && resOf(r) && r.stock >= 1) { if (collect(r)) n++; } if (SC) for (const b of SC.B) b.bubble = null; toast(`🧺 Raccolto da ${n} botteghe`); save(); openMemo(); }
function memoFolk(id) { closeSheet(); const u = SC.U.find(u => !u.dead && u.side === 'V' && folkOf(u) && folkOf(u).id === id); if (u) { const [x, y] = W(u.x, u.y); cam.x = x; cam.y = y + 60; cam.z = Math.max(cam.z, 1.3); openFolk(u); } else toast('È in caserma: lo trovi tra i soldati vicino alla caserma'); }
function openMemo() {
  const it = memoItems();
  openSheet('📜 Promemoria del Centurione', it.length ? `<p class="desc"><i>«Tribuno, ecco cosa attende la vostra attenzione.»</i></p><div class="memo">${it.map(x => `<div class="mi p${x.pri}"><span class="mic">${x.ic}</span><div class="mt"><b>${x.t}</b><small>${x.sub}</small></div>${x.act ? `<button class="btn ${x.pri <= 1 ? '' : 'ghost'}" onclick="${x.act}">${x.lbl}</button>` : ''}</div>`).join('')}</div>` : `<div class="memo0"><div>🕯️</div><p><i>«Tutto è in ordine, tribuno. Il presidio lavora per voi.»</i></p></div>`, 'memo');
}
let MEMO_T = 0;
function memoTick(dt) { MEMO_T -= dt; if (MEMO_T > 0) return; MEMO_T = 1; const el = $('#memob'); if (!el) return; if (!S || S.creative || MODE !== 'village') { el.classList.add('hidden'); return; } el.classList.remove('hidden'); const it = memoItems(); const urgent = it.filter(x => x.pri <= 1).length; const b = el.querySelector('b'); b.textContent = it.length; b.style.display = it.length ? '' : 'none'; el.classList.toggle('urg', urgent > 0); if ($('#sheet').dataset.p === 'memo' && (el.dataset.n !== String(it.length))) openMemo(); el.dataset.n = it.length; }

// ================= RISORSE MANCANTI: la pergamena dice dove produrle =================
const RSRC = { cibo: ['fattoria', 'taverna'], legno: ['capanna'], oro: ['casa', 'municipio', 'mercato', 'mastio'], pietra: ['cava', 'miniera'], ferro: ['fucina', 'miniera'], pelli: [], favore: ['monastero'] };
const RXTRA = { cibo: 'Caccia cervi e cinghiali nei boschi', legno: 'Rimuovi tronchi caduti e cespugli dalla mappa', oro: 'Vinci assedi o vendi merci al Forum', pietra: 'Rimuovi i massi muschiosi dalla mappa', ferro: 'Compra ferro al Forum', pelli: 'Caccia animali o abbatti lupi e orsi durante le razzie', favore: 'Completa missioni e vinci assedi con molte stelle' };
function lacking(cost) { const o = {}; if (!cost || (S && S.creative)) return o; for (const r in cost) { const m = cost[r] - Math.floor(S.res[r] || 0); if (m > 0) o[r] = m; } return o; }
function needLabel(cost) { const l = lacking(cost); const k = Object.keys(l); if (!k.length) return ''; const r = k[0]; const own = S.buildings.filter(b => RSRC[r].includes(b.t) && !b.nat && !(b.end && b.toLvl === 1)); const w = own.length ? BDEF[own[0].t].n : (RSRC[r].find(t => t !== 'mastio' && maxB(t) > 0) ? BDEF[RSRC[r].find(t => t !== 'mastio' && maxB(t) > 0)].n : ''); return `Manca ${k.map(x => ICO(x) + ' ' + fmt(l[x])).join(' ')}${w ? ' → ' + w : ''}`; }
function needItems(cost) {
  const l = lacking(cost); const out = []; const c = caps();
  for (const r in l) {
    const miss = l[r]; const lines = []; const acts = [];
    if (cost[r] > c[r]) lines.push(`⚠️ Il magazzino ne tiene solo ${fmt(c[r])}: ${r === 'oro' ? 'costruisci o migliora la Tesoreria' : 'costruisci o migliora un Horreum'}`);
    const own = S.buildings.filter(b => RSRC[r].includes(b.t) && !b.nat && !(b.end && b.toLvl === 1));
    if (own.length) {
      const stock = own.reduce((a, b) => a + Math.floor(b.stock || 0), 0); const rate = own.reduce((a, b) => a + rateOf(b), 0);
      const names = [...new Set(own.map(b => BDEF[b.t].n))].join(', ');
      if (stock > 0) lines.push(`🧺 ${stock >= miss ? 'Basta raccogliere' : 'Raccogli'} ${ICO(r)} ${fmt(stock)} già pronti da: <b>${names}</b>`);
      else lines.push(`Lo producono le tue botteghe: <b>${names}</b>`);
      if (rate > 0 && stock < miss) lines.push(`⏳ Con la produzione attuale (${rate < 1 ? rate.toFixed(1) : Math.round(rate)}/min) ti servono circa ${fmtT((miss - stock) / rate * 60000)}`);
      const best = own.filter(b => !b.end).sort((a, b) => (b.stock || 0) - (a.stock || 0))[0] || own[0];
      acts.push([stock > 0 ? 'Raccogli' : 'Vai', `closeSheet();needGo(${best.id})`]);
      const up = own.find(b => b.t !== 'mastio' && !canUp(b)); if (up) lines.push(`⬆ Migliora ${BDEF[up.t].n} per produrne di più`);
    }
    const canNew = RSRC[r].filter(t => t !== 'mastio' && maxB(t) > 0 && countB(t) < maxB(t) && !(BDEF[t].req && !hasB(BDEF[t].req)));
    if (canNew.length) { lines.push(`🔨 ${own.length ? 'Oppure costruisci' : 'Costruisci'}: <b>${canNew.map(t => BDEF[t].n).join(' o ')}</b>`); acts.push(['Costruisci', `closeSheet();openBuild()`]); }
    else if (!own.length && RSRC[r].length) { const lk = RSRC[r].filter(t => t !== 'mastio').map(t => { const d = BDEF[t]; if (d.req && !hasB(d.req)) return `${d.n} (serve ${BDEF[d.req].n})`; const lv = d.max.findIndex(v => v > 0) + 1; return lv > S.mastio ? `${d.n} (Castrum ${lv})` : null; }).filter(Boolean); if (lk.length) lines.push(`🔒 Si sblocca: ${lk.join(', ')}`); }
    if (RXTRA[r]) lines.push(`💡 ${RXTRA[r]}`);
    if (hasB('mercato') && ['oro', 'ferro'].includes(r)) acts.push(['Forum', `closeSheet();openMarket()`]);
    out.push({ r, miss, lines, acts });
  }
  return out;
}
function needGo(id) { const r = S.buildings.find(b => b.id === id); if (!r) return; if (!r.end && resOf(r) && (r.stock || 0) >= 1) { collect(r); save(); updateHUD(); } const b = SC && SC.B.find(b => b.ref === r); if (b) { const [x, y] = W(b.x + b.w / 2, b.y + b.h / 2); cam.x = x; cam.y = y + 60; SC.sel = b; } openBuildingInfo(r); }
function needSheet(cost, what) {
  const it = needItems(cost); if (!it.length) return false;
  openSheet('📜 Ti mancano i materiali', `<p class="desc"><i>«Tribuno, per ${what} non basta ciò che abbiamo nei magazzini. Ecco dove trovare il resto.»</i></p><div class="memo need">${it.map(x => `<div class="mi p1"><span class="mic">${ICO(x.r)}</span><div class="mt"><b>Mancano ${fmt(x.miss)} ${RNAME[x.r]}</b>${x.lines.map(l => `<small>${l}</small>`).join('')}</div>${x.acts.length ? `<div class="nacts">${x.acts.map(a => `<button class="btn" onclick="${a[1]}">${a[0]}</button>`).join('')}</div>` : ''}</div>`).join('')}</div><div class="acts"><button class="btn ghost" onclick="closeSheet()">Ho capito</button></div>`, 'need');
  return true;
}
function questCost() { const q = QUESTS[S.mq]; if (!q || q.c()) return null; if (q.m) { const m = S.buildings.find(b => b.t === 'mastio'); return m && !m.end && !canUp(m) ? { cost: upCost(m), what: `alzare il Castrum al livello ${m.lvl + 1}` } : null; } if (q.b) { const d = BDEF[q.b]; return maxB(q.b) > countB(q.b) ? { cost: d.cost, what: `costruire ${d.n}` } : null; } return null; }
function questNeed() { const qc = questCost(); if (qc) needSheet(qc.cost, qc.what); }
// ================= ALTRI REGNI: signori "di altri giocatori" (simulati per ora) =================
const RLM_SEED = 1254;
let _rlmT0 = 0; function RLM_T0() { if (_rlmT0) return _rlmT0; try { let v = +localStorage.getItem('imperium_rlm'); if (!v) { v = now() - 2 * 86400000; localStorage.setItem('imperium_rlm', v); } return _rlmT0 = v; } catch (e) { return _rlmT0 = now() - 2 * 86400000; } }
const RLM_DEF = [
  ['Domina_Ilse', 'Villa di Rosaria', '🌹', '#a8322a', 'LEGA'], ['GaioMontano', 'Castrum di Sirmio', '🦅', '#1e3a8a', 'OPTIMATI'], ['Lupo_di_Dacia', 'Covo di Apulum', '🐺', '#4a4a4a', 'BRANCO'],
  ['Cesare_Fede77', 'Colonia Federica', '👑', '#b45309', 'OPTIMATI'], ['Vestale_Matilde', 'Tempio di Vesta', '🔥', '#6b5236', 'LEGA'], ['Ottavio_IV', 'Legio di Mogontiacum', '🦁', '#8f1d1d', 'IMPERO'],
  ['GiuliaLaRossa', 'Villa di Aquileia', '🍷', '#c2410c', ''], ['Arminio99', 'Selva di Teutoburgo', '⚔️', '#3f3f46', 'BRANCO'], ['Settimio_Afro', 'Leptis Magna', '🐘', '#166534', 'IMPERO'],
  ['Cunigonda', 'Rezia Alpina', '🏔️', '#0e7490', 'LEGA'], ['Sir_Draco', 'Castra Draconis', '🐉', '#581c87', ''], ['Bianca_Licinia', 'Domus di Ravenna', '🕊️', '#64748b', 'OPTIMATI'],
  ['MastroAnselmo', 'Mulini di Ostia', '⚙️', '#78716c', ''], ['Pertinace_Ultimo', 'Ultima Roma', '🦅', '#ca8a04', 'IMPERO'],
];
const ALLY_N = { LEGA: 'Lega del Danubio', OPTIMATI: 'Gli Ottimati', BRANCO: 'Il Branco', IMPERO: 'Fedeli di Roma' };
function realms() {
  const days = (now() - RLM_T0()) / 86400000; const R0 = rng(RLM_SEED);
  return RLM_DEF.map((d, i) => {
    const R = rng(RLM_SEED + i * 97); const speed = 0.6 + R() * 1.6; const base = 1 + Math.floor(R() * 6);
    const lvl = Math.max(1, Math.min(16, Math.floor(base + days * speed * 1.2 + (R() - 0.5) * 2)));
    const wins = Math.floor(lvl * (3 + R() * 6) + days * speed * 4); const power = lvl * 100 + wins * 30 + Math.floor(R() * 200);
    const hr = new Date().getHours(); const on = ((i * 7 + hr) % 5 === 0) || (R() < 0.15);
    const ago = on ? 0 : 1 + Math.floor(((i * 13 + Math.floor(now() / 600000)) % 47) * (1 + R()));
    return { i, user: d[0], name: d[1], ic: d[2], col: d[3], ally: d[4], lvl, wins, power, on, ago, seed: (RLM_SEED * (i + 3)) | 0 };
  });
}
const myPower = () => S ? (S.mastio || 1) * 100 + (S.wins || 0) * 30 + (S.raidsWon || 0) * 20 + countSt('alleato', 'vassallo') * 60 : 100;
function realmNews() {
  const rs = realms(); const R = rng(Math.floor(now() / 300000)); const out = [];
  const verbs = [r => `ha alzato il Castrum al livello ${r.lvl}`, r => `ha respinto una razzia notturna`, (r, o) => `ha assediato ${o.name}: ${'★'.repeat(1 + ((R() * 3) | 0))}`, r => `ha giurato fedeltà a ${ALLY_N[r.ally] || 'nessuno'}`, r => `ha addestrato un esercito di ${20 + ((R() * 60) | 0)} uomini`, r => `ha costruito ${['un Tempio', 'un Forum', 'una Torre di Pietra', 'la Biblioteca', 'una Balista'][(R() * 5) | 0]}`];
  for (let k = 0; k < 7; k++) { const r = rs[(R() * rs.length) | 0], o = rs[(R() * rs.length) | 0]; const v = verbs[(R() * verbs.length) | 0]; out.push({ r, t: v(r, o === r ? rs[(r.i + 1) % rs.length] : o), m: 2 + k * 6 + ((R() * 5) | 0) }); }
  return out;
}
function openRealms(fromTitle) {
  const rs = realms().sort((a, b) => b.power - a.power); const me = { me: true, user: 'Tu', name: S ? 'La tua Provincia' : 'Il tuo presidio', ic: ARMS().sym, col: ARMS().c1, lvl: S ? S.mastio : 1, power: S ? myPower() : 100, on: true, ally: '' };
  const all = rs.concat([me]).sort((a, b) => b.power - a.power); const pos = all.indexOf(me) + 1;
  const row = (r, k) => `<div class="rrow ${r.me ? 'me' : ''}" ${r.me ? '' : `onclick="openRealm(${r.i}${fromTitle ? ',1' : ''})"`}><span class="rk">${k + 1}</span><span class="rem" style="background:${r.col}">${r.ic}</span><div class="rn"><b>${r.name}</b><small>${r.me ? 'tu' : r.user}${r.ally ? ` · [${r.ally}]` : ''}</small></div><div class="rs"><b>${r.power}</b><small>Castrum ${r.lvl} · ${ERA(r.lvl).s}</small></div><i class="ron ${r.on ? 'on' : ''}" title="${r.on ? 'online' : 'offline'}"></i></div>`;
  const news = realmNews().map(n => `<div class="rnw"><span class="rem sm" style="background:${n.r.col}">${n.r.ic}</span><span><b>${n.r.user}</b> ${n.t}</span><small>${n.m} min fa</small></div>`).join('');
  openSheet('🌍 Altri Regni', `<p class="desc">I capi della Provincia che giocano accanto a te. Sei <b>${pos}°</b> su ${all.length} per potenza. <small>(Per ora sono regni simulati: diventeranno giocatori veri con i salvataggi online.)</small></p>
    <div class="rtabs"><b>Classifica</b></div><div class="rlist">${all.map(row).join('')}</div><div class="rtabs"><b>Cronache della Provincia</b></div><div class="rnews">${news}</div>
    ${fromTitle ? '<div class="acts"><button class="btn" onclick="closeSheet()">✓ Chiudi</button></div>' : ''}`, 'realms');
}
function openRealm(i, fromTitle) {
  const r = realms()[i]; const p = lootPool(Math.min(10, r.lvl));
  const canAtk = !fromTitle && S && MODE === 'village'; const close = r.lvl <= (S ? S.mastio : 1) + 3;
  openSheet(`${r.ic} ${r.name}`, `<div class="rdet"><div class="rhd"><span class="rem lg" style="background:${r.col}">${r.ic}</span><div><b>${r.user}</b><small>${r.on ? '🟢 online ora' : `⚪ visto ${r.ago < 60 ? r.ago + ' min fa' : Math.floor(r.ago / 60) + ' h fa'}`}</small>${r.ally ? `<small>⚜ ${ALLY_N[r.ally]}</small>` : ''}</div></div>
    <div class="stats"><span>🏰 Castrum ${r.lvl} · ${ERA(r.lvl).n}</span><span>⚔ ${r.wins} assedi vinti</span><span>💪 Potenza ${r.power}</span></div>
    <p class="desc">${canAtk ? (close ? `Bottino stimato: 🌾${p.cibo} 🪵${p.legno} 🪙${p.oro}` : 'Troppo forte per te adesso: il suo forte ti schiaccerebbe.') : 'Entra in una partita per assediarlo.'}</p>
    <div class="acts">${canAtk && close ? `<button class="btn" onclick="attackRealm(${i})">⚔ Assedia</button>` : ''}<button class="btn" onclick="visitRealm(${i})">👁 Visita il regno</button><button class="btn ghost" onclick="realmMsg(${i})">✉ Manda un messaggio</button><button class="btn ghost" onclick="openRealms(${fromTitle ? 1 : 0})">← Classifica</button></div></div>`, 'realm');
}
function attackRealm(i) { const r = realms()[i]; refreshTargets(false); S.targets = S.targets.filter(t => t.rid == null); S.targets.unshift({ d: Math.max(1, Math.min(10, r.lvl)), name: r.name, where: `${r.ic} di ${r.user}`, seed: r.seed, rid: i }); closeSheet(); startAttack(0); }
function realmMsg(i) { const r = realms()[i]; const rep = ['Che Fortuna ti sia favorevole, tribuno.', 'Le mie mura ti aspettano. Vieni pure.', 'Un\'alleanza? Parliamone davanti a un boccale.', 'Non ho tempo per le chiacchiere, ho un assedio da preparare.', 'Ricambio i saluti dalla mia rocca!', 'Bel forte il tuo. Peccato sia così vicino al mio...']; toast(`✉ ${r.user}: «${rep[(r.i + Math.floor(now() / 60000)) % rep.length]}»`); }
// ================= CAMPAGNA, FEUDI VICINI, COMMERCIO, EVENTI =================
// ---------- feudi vicini & diplomazia ----------
const FEUDI_BASE = [
  { name: 'Regno dei Quadi', lord: 'Re Gaiobomaro', ic: '🐺', off: 1, tr: 'superbo', d: 'Re barbaro antico e orgoglioso. Rispetta la forza e i doni generosi.' },
  { name: 'Porto di Aquincum', lord: 'Mercante Lucio Sabino', ic: '⚓', off: 0, tr: 'avido', d: 'Controlla il porto sul Danubio e i suoi pedaggi. Ama l\'oro più di ogni giuramento.' },
  { name: 'Santuario di Mitra', lord: 'Pater Elio', ic: '☀️', off: -1, tr: 'pio', d: 'Sacerdoti ricchi di grano e di offerte. Preferiscono la pace e i pellegrini.' },
  { name: 'Orda dei Iazigi', lord: 'Capo Banadaspo', ic: '🐎', off: 2, tr: 'bellicoso', d: 'Cavalieri sarmati della pianura con una banda di predoni. Provano a conquistare la Provincia.' },
  { name: 'Legione di Carnuntum', lord: 'Legato Clodio Rufo', ic: '🦅', off: 3, tr: 'astuto', d: 'Il vicino più potente. Un alleato prezioso, un nemico terribile.' },
];
const DST = { neutrale: ['Neutrale', '#9a8a6a'], patto: ['Patto commerciale', '#3f7a2e'], alleato: ['Alleato', '#1e3a8a'], vassallo: ['Tuo tributario', '#b45309'], guerra: ['In guerra', '#8f1d1d'] };
const CARAVAN_MS = 3 * 60 * 1000, TRIBUTE_MS = 5 * 60 * 1000, GIFT_CD = 2 * 3600 * 1000;
function feudi() {
  if (!S.feudi) S.feudi = FEUDI_BASE.map((f, i) => ({ id: i, rel: f.tr === 'pio' ? 20 : f.tr === 'bellicoso' ? -30 : 0, st: 'neutrale', next: 0, gift: 0 }));
  return S.feudi;
}
const fBase = f => FEUDI_BASE[f.id];
const fPow = f => Math.max(1, Math.min(16, S.mastio + fBase(f).off));
const relWord = r => r >= 70 ? 'Amichevole' : r >= 30 ? 'Cordiale' : r > -20 ? 'Diffidente' : r > -60 ? 'Ostile' : 'Odio';
function relAdd(f, v) { f.rel = Math.max(-100, Math.min(100, f.rel + v)); if (f.st === 'patto' && f.rel < 0) { f.st = 'neutrale'; toast(`📜 ${fBase(f).lord} rompe il patto commerciale`); } if (f.st === 'alleato' && f.rel < 30) { f.st = f.rel >= 0 ? 'patto' : 'neutrale'; toast(`💔 ${fBase(f).lord} scioglie l'alleanza`); } }
const countSt = (...sts) => feudi().filter(f => sts.includes(f.st)).length;
function giftCost(f) { return { oro: 40 + 25 * fPow(f) }; }
function remember(f, v, txt) { f.mem = f.mem || []; f.mem.unshift({ t: now(), v: Math.round(v), txt }); f.mem = f.mem.slice(0, 6); relAdd(f, v); }
const repMul = () => 1 + (S.rep || 0) / 200;
function repAdd(v) { S.rep = Math.max(-100, Math.min(100, (S.rep || 0) + v)); }
function dipAct(i, act) {
  const f = feudi()[i], B = fBase(f), P = fPow(f), t = now();
  if (act === 'gift') { const c = giftCost(f); if (t < f.gift) { toast('Hai già mandato un dono: aspetta che passi un po\' di tempo'); return; } if (!canPay(c)) { toast('Oro insufficiente'); return; } pay(c); f.gift = t + GIFT_CD * PACE(); remember(f, (B.tr === 'avido' ? 22 : B.tr === 'superbo' ? 12 : 16) * repMul(), '🎁 un tuo dono'); S.gifts = (S.gifts || 0) + 1; toast(`🎁 ${B.lord} accetta il dono (${relWord(f.rel)})`); sfx('coin'); }
  else if (act === 'pact') { if (!hasB('mercato')) { toast('Serve un Forum per i patti commerciali'); return; } if (f.rel < 20) { toast(`${B.lord} non si fida ancora di te`); return; } f.st = 'patto'; f.next = t + CARAVAN_MS; remember(f, 5, '📜 il patto commerciale'); toast(`📜 Patto commerciale con ${B.name}: arriveranno carovane`); sfx('bell'); }
  else if (act === 'ally') { const c = { oro: 150 + 30 * P, cibo: 100 }; if (f.rel < 60 || f.st !== 'patto') { toast('Serve un patto commerciale e un rapporto amichevole (60+)'); return; } if (!canPay(c)) { toast('Risorse insufficienti per il giuramento'); return; } pay(c); f.st = 'alleato'; remember(f, 10, '🤝 il giuramento di alleanza'); toast(`🤝 ${B.lord} giura alleanza: ti manderà rinforzi nelle razzie`); sfx('bell'); }
  else if (act === 'tribute') { if (S.mastio < P + 2) { toast(`${B.lord} ride: il tuo Castrum non incute timore (serve livello ${P + 2})`); return; } const ok = Math.random() < 0.35 + Math.max(0, f.rel) / 200 + (S.mastio - P - 2) * 0.1; if (ok) { f.st = 'vassallo'; f.next = t + TRIBUTE_MS; f.rel = Math.max(f.rel, 10); remember(f, 0, '👑 la tua pretesa di tributo, accolta'); toast(`👑 ${B.lord} piega il ginocchio: ora è tuo tributario`); sfx('bell'); } else { remember(f, -35, '👑 la tua pretesa di tributo'); repAdd(-6); if (f.rel < -50) { f.st = 'guerra'; addWarTarget(f); toast(`⚔ ${B.lord} rifiuta e ti dichiara guerra!`); sfx('horn'); } else toast(`${B.lord} rifiuta sdegnato (${relWord(f.rel)})`); } }
  else if (act === 'war') { if (!dipAct.ok) { askYes(`Dichiarare guerra a ${B.name}?<br><small>Gli altri popoli se ne ricorderanno.</small>`, () => { dipAct.ok = 1; dipAct(i, 'war'); dipAct.ok = 0; }, '⚔ Guerra'); return; } f.st = 'guerra'; f.rel = -100; remember(f, 0, '⚔ la tua dichiarazione di guerra'); for (const o of feudi()) if (o !== f) remember(o, -8, `⚔ la guerra contro ${B.name}`); repAdd(-20); addWarTarget(f); toast(`⚔ Guerra a ${B.name}! Lo trovi sulla mappa degli assedi`); sfx('horn'); }
  else if (act === 'peace') { const c = { oro: 80 + 30 * P }; if (!canPay(c)) { toast('Oro insufficiente per la pace'); return; } if (Math.random() < 0.5 + (S.wins || 0) * 0.02) { pay(c); f.st = 'neutrale'; f.rel = -20; remember(f, 0, '🕊 la pace firmata'); repAdd(8); S.targets = (S.targets || []).filter(x => x.fid !== f.id); toast(`🕊 Pace firmata con ${B.name}`); } else { pay({ oro: Math.round(c.oro / 3) }); toast(`${B.lord} respinge l'ambasciatore`); } }
  else if (act === 'deliver') { const q = f.req; if (!q || q.kind !== 'res') return; const c = { [q.r]: q.n }; if (!canPay(c)) { toast('Non hai abbastanza risorse'); return; } pay(c); reqDone(f); }
  save(); updateHUD(); openDiplo();
}
// --- richieste dei signori ---
const REQ_TXT = {
  avido: [['oro', 'per i pedaggi del guado'], ['legno', 'per rifare il ponte']], superbo: [['pietra', 'per la nuova torre del forte'], ['win', 'per vendicare un insulto: vinci un assedio']],
  pio: [['cibo', 'per sfamare i pellegrini'], ['pelli', 'per coprire i sacerdoti d\'inverno']], bellicoso: [['ferro', 'per armare i suoi mercenari'], ['win', 'per provare il tuo valore: vinci un assedio']],
  astuto: [['oro', 'per un affare che non vuole spiegare'], ['ferro', 'per le sue baliste'], ['win', 'per indebolire un rivale: vinci un assedio']],
};
function makeReq(f) { const B = fBase(f), P = fPow(f); const opts = REQ_TXT[B.tr]; const [r, why] = opts[(Math.random() * opts.length) | 0]; const base = { oro: 60, legno: 120, pietra: 80, cibo: 120, ferro: 50, pelli: 2 }[r] || 0;
  const rew = Math.random() < 0.5 ? { oro: 40 + 25 * P } : { favore: 1 + Math.floor(P / 3) };
  return r === 'win' ? { kind: 'win', w0: S.wins || 0, left: 40 * 60, txt: why, rew } : { kind: 'res', r, n: Math.round(base * (1 + 0.45 * (P - 1)) / (r === 'pelli' ? 1 : 10)) * (r === 'pelli' ? 1 : 10), left: 35 * 60, txt: why, rew }; }
function reqDone(f) { const q = f.req; if (!q) return; const got = []; for (const k in q.rew) { const v = addRes(k, q.rew[k]); if (v) got.push(ICO(k) + '+' + v); } remember(f, 15 * repMul(), '📜 la richiesta che hai esaudito'); repAdd(4); S.reqDone = (S.reqDone || 0) + 1; f.req = null; f.reqNext = 20 * 60 + Math.random() * 20 * 60; toast(`📜 ${fBase(f).lord} ringrazia ${got.join(' ')}`); sfx('coin'); }
function addWarTarget(f) { refreshTargets(false); S.targets = (S.targets || []).filter(x => x.fid !== f.id); const B = fBase(f); S.targets.unshift({ d: Math.min(10, fPow(f) + 1), name: B.name, where: `${B.ic} ${B.lord} · in guerra`, seed: (Math.random() * 1e9) | 0, fid: f.id }); }
function warResult(fid, st) { const f = feudi()[fid]; if (!f) return; if (st >= 2) { f.st = 'vassallo'; f.rel = 0; f.next = now() + TRIBUTE_MS; setTimeout(() => toast(`👑 ${fBase(f).name} è conquistato: ora ti paga tributo`), 2500); } else { relAdd(f, -10); setTimeout(() => { if (f.st === 'guerra' && !(S.targets || []).some(t => t.fid === f.id)) addWarTarget(f); }, 0); } }
function diploTick(dt) {
  if (!S || S.creative) return; const t = now(); dt = dt || 0;
  if (MODE === 'village' && dt) {
    if (S.rep) { S.repT = (S.repT || 0) + dt; if (S.repT > 600) { S.repT = 0; S.rep += S.rep > 0 ? -1 : 1; } }
    for (const f of feudi()) {
      if (f.st === 'guerra' || f.rel <= -40) { f.req = null; continue; }
      if (f.req) { const q = f.req; if (q.kind === 'win' && (S.wins || 0) > q.w0) { reqDone(f); continue; } q.left -= dt; if (q.left <= 0) { f.req = null; f.reqNext = 25 * 60; remember(f, -10, '⌛ la richiesta che hai ignorato'); repAdd(-3); toast(`⌛ ${fBase(f).lord} è deluso: non hai esaudito la sua richiesta`); } }
      else if (S.mq >= 10) { f.reqNext = (f.reqNext == null ? 5 * 60 + f.id * 240 : f.reqNext) - dt; if (f.reqNext <= 0) { f.req = makeReq(f); const q = f.req; toast(`📜 ${fBase(f).lord} ti chiede ${q.kind === 'win' ? 'un favore' : q.n + ' ' + RNAME[q.r].toLowerCase()} ${q.txt}`); } }
    }
    if ((S.rep || 0) <= -40 && t > (S.coalT || 0)) { const cand = feudi().filter(f => f.rel < 0 && (f.st === 'neutrale' || f.st === 'patto')); if (cand.length >= 2) { S.coalT = t + 2 * 3600 * 1000; const two = cand.slice(0, 2); for (const f of two) { f.st = 'guerra'; f.rel = -80; remember(f, 0, '⚔ la coalizione contro di te'); addWarTarget(f); } toast(`⚔ Coalizione! ${two.map(f => fBase(f).lord).join(' e ')} si alleano contro di te: hai fatto troppa paura alla Provincia`); sfx('horn'); } }
  }
  for (const f of feudi()) {
    const P = fPow(f);
    if ((f.st === 'patto' || f.st === 'alleato') && f.next && t >= f.next) { f.next = t + CARAVAN_MS; const pool = ['cibo', 'legno', 'pietra', 'ferro']; const r = pool[(Math.random() * pool.length) | 0]; const g = { oro: 20 + 10 * P }; g[r] = (g[r] || 0) + 25 + 12 * P; const got = []; for (const k in g) { const v = addRes(k, g[k]); if (v) got.push(ICO(k) + '+' + v); } S.caravans = (S.caravans || 0) + 1; relAdd(f, 1); if (MODE === 'village') caravanSpawn(SC, 'Carovana di ' + fBase(f).name); if (MODE === 'village') toast(`🐴 Carovana da ${fBase(f).name}: ${got.join(' ')}`); }
    if (f.st === 'vassallo' && f.next && t >= f.next) { f.next = t + TRIBUTE_MS; const g = { oro: 40 + 20 * P, cibo: 30 + 15 * P }; const got = []; for (const k in g) { const v = addRes(k, g[k]); if (v) got.push(ICO(k) + '+' + v); } if (MODE === 'village') toast(`👑 Tributo da ${fBase(f).name}: ${got.join(' ')}`); }
    if (f.st === 'neutrale' && Math.random() < 0.0005) relAdd(f, f.rel > 0 ? -1 : 1); // i rapporti tornano piano verso il neutro
  }
}
function allyReinforcements() { const out = []; for (const f of feudi()) if (f.st === 'alleato') { const n = 2 + Math.floor(fPow(f) / 3); for (let i = 0; i < n; i++) out.push(i % 2 ? 'arccorto' : (fPow(f) >= 5 ? 'scudata' : 'miliziano')); } return out.slice(0, 14); }
function openDiplo() {
  const fs = feudi();
  const card = (f, i) => { const B = fBase(f), P = fPow(f), st = DST[f.st]; const gc = giftCost(f), cd = now() < f.gift;
    const acts = [];
    if (f.st !== 'guerra') acts.push(`<button class="btn ghost ${cd ? 'dis' : ''}" onclick="dipAct(${i},'gift')">🎁 Dono<small>${cd ? 'tra ' + fmtT(f.gift - now()) : costStr(gc)}</small></button>`);
    if (f.st === 'neutrale') acts.push(`<button class="btn ghost ${f.rel >= 20 && hasB('mercato') ? '' : 'dis'}" onclick="dipAct(${i},'pact')">📜 Patto<small>${hasB('mercato') ? 'rapporto 20+' : 'serve Forum'}</small></button>`);
    if (f.st === 'patto') acts.push(`<button class="btn ghost ${f.rel >= 60 ? '' : 'dis'}" onclick="dipAct(${i},'ally')">🤝 Alleanza<small>${costStr({ oro: 150 + 30 * P, cibo: 100 })}</small></button>`);
    if (f.st === 'neutrale' || f.st === 'patto') acts.push(`<button class="btn ghost ${S.mastio >= P + 2 ? '' : 'dis'}" onclick="dipAct(${i},'tribute')">👑 Esigi tributo<small>Castrum ${P + 2}+</small></button>`);
    if (f.st !== 'guerra' && f.st !== 'vassallo') acts.push(`<button class="btn ghost" onclick="dipAct(${i},'war')">⚔ Guerra</button>`);
    if (f.st === 'guerra') acts.push(`<button class="btn ghost" onclick="dipAct(${i},'peace')">🕊 Pace<small>${costStr({ oro: 80 + 30 * P })}</small></button>`, `<button class="btn" onclick="closeSheet();openMap()">⚔ Assedia</button>`);
    const nx = f.next && (f.st === 'patto' || f.st === 'alleato' || f.st === 'vassallo') ? `<div class="fn">${f.st === 'vassallo' ? '👑 Tributo' : '🐴 Carovana'} tra ${fmtT(f.next - now())}</div>` : '';
    const mem = (f.mem || []).slice(0, 3).map(m => `<span class="${m.v > 0 ? 'p' : m.v < 0 ? 'n' : ''}">${m.txt}${m.v ? ` (${m.v > 0 ? '+' : ''}${m.v})` : ''} · ${fmtT(now() - m.t)} fa</span>`).join('');
    const rq = f.req ? `<div class="dreq"><b>📜 Richiesta:</b> ${f.req.kind === 'win' ? 'vinci un assedio' : f.req.n + ' ' + ICO(f.req.r)} ${f.req.txt}. <small>Ricompensa ${Object.keys(f.req.rew).map(k => ICO(k) + ' ' + f.req.rew[k]).join(' ')} · scade tra ${fmtT(f.req.left * 1000)}</small>${f.req.kind === 'res' ? `<button class="btn ${canPay({ [f.req.r]: f.req.n }) ? '' : 'dis'}" onclick="dipAct(${i},'deliver')">Consegna</button>` : ''}</div>` : '';
    return `<div class="dcard"><div class="dh"><span class="dic">${B.ic}</span><div><b>${B.name}</b><small>${B.lord} · potenza ${P} · ${B.tr}</small></div><span class="dst" style="background:${st[1]}">${st[0]}</span></div>
      <div class="drel"><i style="left:${(f.rel + 100) / 2}%"></i></div><div class="drw">${relWord(f.rel)} (${f.rel > 0 ? '+' : ''}${Math.round(f.rel)})</div>
      <p class="dd">${B.d}</p>${rq}${mem ? `<div class="dmem"><b>Ricorda:</b>${mem}</div>` : ''}${nx}<div class="dacts">${acts.join('')}</div></div>`; };
  openSheet('🤝 Diplomazia della Provincia', `<p class="desc">Doni e patti aprono carovane di merci; gli alleati mandano rinforzi quando i predoni attaccano; i tributari pagano tributo. Alleati ${countSt('alleato')} · tributari ${countSt('vassallo')} · guerre ${countSt('guerra')}. <b>Reputazione nella Provincia: ${(S.rep || 0) > 20 ? 'onorata' : (S.rep || 0) < -40 ? 'temuta e odiata' : (S.rep || 0) < -10 ? 'sospetta' : 'neutra'}</b> (${Math.round(S.rep || 0)}).</p><div class="dlist">${fs.map(card).join('')}</div>`, 'diplo');
}
// ---------- mercato ----------
const PBASE = { cibo: 1, legno: 1, pietra: 1.6, ferro: 3.2, pelli: 9 };
function price(r) { const s = seasonInfo().s.k; let p = PBASE[r] * (S.pmod && S.pmod[r] || 1); if (r === 'cibo') p *= s === 'inverno' ? 1.6 : s === 'autunno' ? 0.75 : 1; if (r === 'legno') p *= s === 'inverno' ? 1.3 : 1; if (r === 'pelli') p *= s === 'inverno' ? 1.4 : 1; const pacts = countSt('patto', 'alleato'); return p * (1 - Math.min(0.2, pacts * 0.05)); }
function trade(r, qty, buy) {
  if (!hasB('mercato') && !S.creative) { toast('Serve un Forum'); return; }
  const p = price(r); const gold = Math.round(qty * p * (buy ? 1 : 0.65));
  if (buy) { if (!canPay({ oro: gold })) { toast('Oro insufficiente'); return; } const got = addRes(r, qty); if (!got) { toast('Magazzino pieno'); return; } pay({ oro: Math.round(gold * got / qty) }); }
  else { if ((S.res[r] || 0) < qty) { toast('Non ne hai abbastanza'); return; } const got = addRes('oro', gold); S.res[r] -= qty; if (got < gold) toast('Tesoreria piena: parte dell\'oro è andata persa'); }
  S.trades = (S.trades || 0) + 1; sfx('coin'); save(); updateHUD(); openMarket();
}
function openMarket() {
  const has = hasB('mercato') || S.creative; const s = seasonInfo().s;
  const rows = Object.keys(PBASE).map(r => { const p = price(r), q = r === 'pelli' ? 2 : r === 'ferro' ? 20 : 50; return `<div class="mrow"><span class="mr">${ICO(r)} <b>${RNAME[r]}</b><small>${fmt(S.res[r] || 0)}</small></span>
    <button class="btn ghost" onclick="trade('${r}',${q},false)">Vendi ${q}<small>+${Math.round(q * p * 0.65)} ${ICO('oro')}</small></button>
    <button class="btn" onclick="trade('${r}',${q},true)">Compra ${q}<small>-${Math.round(q * p)} ${ICO('oro')}</small></button></div>`; }).join('');
  openSheet('⚖ Forum della Provincia', `${has ? '' : '<p class="desc"><b>Costruisci un Forum</b> per commerciare.</p>'}<p class="desc">${s.ic} ${s.n}: ${s.k === 'inverno' ? 'il cibo e la legna costano cari' : s.k === 'autunno' ? 'dopo il raccolto il grano costa poco' : 'prezzi normali'}. Ogni patto commerciale abbassa i prezzi del 5% (max 20%).</p><div class="mlist2 ${has ? '' : 'dis'}">${rows}</div>`, 'market');
}
// ---------- eventi casuali ----------
const EVENTS = [
  { id: 'mercante', s: 'all', ic: '🧺', t: 'Il mercante errante', x: 'Un carro carico di lingotti si ferma al Castrum. «Ferro del Norico, tribuno. Prezzo onesto.»', ch: [{ l: 'Compra 60 ferro', c: { oro: 110 }, f: () => addRes('ferro', 60) }, { l: 'Vendigli pelli (3)', need: () => S.res.pelli >= 3, f: () => { S.res.pelli -= 3; addRes('oro', 90); } }, { l: 'Lascialo andare' }] },
  { id: 'raccolto', s: ['autunno'], ic: '🌾', t: 'Raccolto abbondante', x: 'I campi hanno dato più grano del previsto. I granai traboccano.', ch: [{ l: 'Riempi i granai', f: () => addRes('cibo', 180) }, { l: 'Vendi l\'eccedenza', f: () => addRes('oro', 140) }] },
  { id: 'gelata', s: ['inverno'], ic: '🥶', t: 'La grande gelata', x: 'Una notte di ghiaccio minaccia le scorte di grano nei granai.', ch: [{ l: 'Scalda i granai', c: { legno: 90 } }, { l: 'Lascia correre (-20% cibo)', f: () => { S.res.cibo = Math.floor(S.res.cibo * 0.8); } }] },
  { id: 'incendio', s: ['estate'], ic: '🔥', cond: () => S.buildings.some(b => resOf(b) && !b.end), t: 'Incendio nel vicus!', x: 'Il fieno secco ha preso fuoco vicino a una bottega.', ch: [{ l: 'Spegni le fiamme', c: { legno: 50, oro: 30 } }, { l: 'Lascia bruciare (bottega ferma 3 min)', f: () => { const bs = S.buildings.filter(b => resOf(b) && !b.end && b.t !== 'mastio'); const b = bs[(Math.random() * bs.length) | 0]; if (b) { b.end = now() + 180000; b.dur = 180000; b.toLvl = b.lvl; toast(`🔥 ${BDEF[b.t].n} va ricostruita`); } } }] },
  { id: 'pellegrini', s: ['primavera', 'estate'], ic: '🙏', t: 'Pellegrini per il Santuario', x: 'Una schiera di pellegrini chiede pane e un tetto per la notte.', ch: [{ l: 'Sfamali (+favore, Abbazia felice)', c: { cibo: 70 }, f: () => { addRes('favore', 2); relAdd(feudi()[2], 10); } }, { l: 'Mandali via' }] },
  { id: 'banditi', s: 'all', ic: '🗡️', t: 'Predoni al guado', x: 'Una banda blocca il guado e chiede un pedaggio per lasciar passare i tuoi carri.', ch: [{ l: 'Paga il pedaggio', c: { oro: 90 } }, { l: 'Respingili coi legionari', f: () => { if (soldiers() >= 6) { addRes('oro', 80); toast('⚔ I predoni fuggono lasciando il bottino'); } else { const k = UNIT_ORDER.find(k => S.army[k] > 0); if (k) S.army[k]--; S.res.cibo = Math.max(0, S.res.cibo - 50); toast('⚔ Troppo pochi: un soldato cade e i predoni razziano'); } } }] },
  { id: 'epidemia', s: ['inverno', 'primavera'], ic: '🤒', t: 'Febbre nel vicus', x: 'Una febbre si diffonde tra le case. Servono erbe e cure.', ch: [{ l: 'Compra erbe e cure', c: { cibo: 60, oro: 50 } }, { l: 'Affidati alla sorte', f: () => { if (hasB('infermeria') && Math.random() < 0.7) toast('✚ Le guaritrici fermano la febbre'); else { let n = 2; for (const k of UNIT_ORDER) while (n && S.army[k] > 0) { S.army[k]--; n--; } toast('🤒 La febbre si porta via due uomini'); } } }] },
  { id: 'lupi', s: ['inverno', 'autunno'], ic: '🐺', t: 'Lupi affamati', x: 'Di notte i lupi scendono fino ai recinti e sbranano il bestiame.', ch: [{ l: 'Organizza una battuta (3 soldati)', need: () => soldiers() >= 3, f: () => { addRes('pelli', 3); addRes('cibo', 30); } }, { l: 'Perdi il bestiame (-60 cibo)', f: () => { S.res.cibo = Math.max(0, S.res.cibo - 60); } }] },
  { id: 'messaggero', s: 'all', ic: '📨', cond: () => feudi().some(f => f.st === 'neutrale'), t: 'Un messaggero dei vicini', x: '', mk: () => { const f = feudi().filter(f => f.st === 'neutrale')[0]; return { x: `Un cavaliere con l\'insegna ${fBase(f).ic} porta i saluti di ${fBase(f).lord}, che vorrebbe migliori rapporti con la Provincia.`, ch: [{ l: 'Ricambia con un banchetto', c: { cibo: 80 }, f: () => relAdd(f, 20) }, { l: 'Rispondi con freddezza', f: () => relAdd(f, -5) }] }; } },
  { id: 'torneo', s: ['estate', 'primavera'], ic: '🏇', t: 'I giochi gladiatori', x: 'Un lanista chiede di tenere giochi nell\'anfiteatro di legno sotto le tue mura.', ch: [{ l: 'Finanzia i giochi', c: { oro: 120 }, f: () => { addRes('favore', 3); const a = Object.keys(S.army).filter(k => S.army[k] > 0); if (a.length) { const r = vets(a[0])[0]; if (r && recGainXP(r, 80)) toast(`⬆ ${r.nm} trionfa nell\'arena e sale di livello`); } } }, { l: 'Rifiuta' }] },
  { id: 'monaco', s: 'all', ic: '📖', t: 'L\'agrimensore greco', x: 'Un erudito di Alessandria si offre di insegnare ai tuoi coloni metodi nuovi per i campi e le botteghe.', ch: [{ l: 'Accoglilo', c: { oro: 80 }, f: () => { for (const k in (S.wrk || {})) recGainXP(S.wrk[k], 50); toast('📖 Tutti i coloni guadagnano esperienza'); } }, { l: 'Non serve' }] },
  { id: 'nevicata', s: ['inverno'], ic: '🌨️', cond: () => S.buildings.some(b => b.end), t: 'Nevicata abbondante', x: 'La neve copre i cantieri. I fabri della legione chiedono uomini per spalarla.', ch: [{ l: 'Manda uomini a spalare', c: { cibo: 50 } }, { l: 'Aspetta il disgelo (+60s ai cantieri)', f: () => { for (const b of S.buildings) if (b.end) { b.end += 60000; b.dur += 60000; } } }] },
  { id: 'fiera', s: ['primavera'], ic: '🎪', t: 'Il mercato di primavera', x: 'Mercanti da tutta la Provincia montano le bancarelle. Si fanno affari d\'oro.', ch: [{ l: 'Fai scorta', c: { oro: 100 }, f: () => { addRes('cibo', 150); addRes('legno', 120); } }, { l: 'Riscuoti le tasse', f: () => addRes('oro', 70) }] },
  { id: 'disertore', s: 'all', ic: '🛡️', t: 'Un disertore', x: 'Un guerriero iazigo bussa alla porta: è stanco del suo capo e vuole servirti.', ch: [{ l: 'Arruolalo', need: () => armyUsed() < armyCap(), f: () => { S.army.miliziano = (S.army.miliziano || 0) + 1; relAdd(feudi()[3], -5); } }, { l: 'Rimandalo indietro', f: () => relAdd(feudi()[3], 8) }] },
  { id: 'tempesta', s: ['estate', 'autunno'], ic: '⛈️', t: 'La tempesta', x: 'Il vento della notte ha abbattuto alberi e scoperchiato tetti di tegole.', ch: [{ l: 'Raccogli la legna caduta', f: () => addRes('legno', 70) }, { l: 'Ripara i tetti', c: { legno: 40 }, f: () => addRes('favore', 1) }] },
];
// ================= EVENTI VISIBILI: i visitatori arrivano a piedi (o a cavallo) fino al Mastio =================
const EV_VIS = { mercante: ['carro', 1, 'Il mercante errante'], fiera: ['carro', 2, 'I mercanti del mercato'], pellegrini: ['infermiera', 3, 'Pellegrini'], monaco: ['infermiera', 1, 'L\'agrimensore greco'], messaggero: ['arccavallo', 1, 'Un messaggero'], torneo: ['miliziano', 2, 'Il lanista e i gladiatori'], disertore: ['miliziano', 1, 'Un disertore'], banditi: ['arccorto', 2, 'Predoni'] };
function visitorTarget(sc) { const m = sc.B.find(b => b.t === 'mastio'); if (!m) return null; const [fx, fy] = frontTile(sc, m); return [fx, fy]; }
function visitorSpawn(sc, id, atDoor) {
  const v = EV_VIS[id]; const tg = visitorTarget(sc); if (!v || !tg) return false; const [tx, ty] = tg; const G = sc.pathG;
  let start = null; if (atDoor) start = [tx + 1, ty + 1]; else { let bd = 1e9; for (let i = 4; i < N - 4; i += 5) for (const [ex, ey] of [[i, 3], [i, N - 4], [3, i], [N - 4, i]]) { if (isWater(sc, ex, ey) || bAt(sc, ex, ey)) continue; const d = Math.hypot(ex - tx, ey - ty) + Math.random() * 30; if (d < bd) { bd = d; start = [ex, ey]; } } }
  if (!start) return false; const path = atDoor ? [] : astar(start[0], start[1], (x, y) => Math.abs(x - tx) <= 1 && Math.abs(y - ty) <= 1, villagerCost(sc), tx, ty, 9000); if (!atDoor && !path) return false;
  for (let i = 0; i < v[1]; i++) { const u = mkUnit('miliziano', 'V', start[0] + 0.5 + i * 0.35, start[1] + 0.5 + i * 0.25); u.k = v[0]; u.vis = id; u.visLead = i === 0; u.visName = v[2];
    if (v[0] === 'carro') { u.d = { spd: 0.85, hp: 1, cd: 1, rng: 0, model: 1 }; u.cart = v[2]; } else u.d = Object.assign({}, UDEF[v[0]] || UDEF.miliziano, { spd: 0.75 });
    u.path = path ? path.slice() : []; u.pi = 0; u.ai = visitorAI; u.arrived = atDoor; u.delay = i * 0.6; sc.U.push(u); }
  return true;
}
function visitorAI(sc, u, dt) {
  if (u.delay > 0) { u.delay -= dt; return; }
  if (!u.arrived) { if (!u.path || followPath(sc, u, dt)) { u.arrived = true; u.moving = false; u.face = 'F'; if (u.visLead && S.visEv && S.visEv.id === u.vis) { S.visEv.arr = now(); floatText(sc, u.x, u.y, '❗ ' + u.visName + (EV_VIS[u.vis][1] > 1 ? ' chiedono udienza' : ' chiede udienza'), '#ffe9a6', 2.2); sfx('bell'); } } return; }
  u.moving = false; if (!S.visEv || S.visEv.id !== u.vis) { u.dead = true; u.deadT = 9; }
}
function visitorsOf(sc) { return sc ? sc.U.filter(u => u.vis && !u.dead) : []; }
function visitorStart(e) { if (!EV_VIS[e.id] || !SC) return false; S.visEv = { id: e.id, t: now(), arr: 0 }; if (!visitorSpawn(SC, e.id)) { S.visEv = null; return false; } toast(`👀 ${EV_VIS[e.id][2]} si avvicina al Castrum…`); return true; }
function visitorTick(dt) {
  if (!S || !S.visEv || MODE !== 'village' || !SC) return; const ve = S.visEv;
  if (!visitorsOf(SC).length) visitorSpawn(SC, ve.id, true); // dopo un ricaricamento aspetta già alla porta
  if (ve.arr && !ve.shown && $('#sheet').classList.contains('hidden') && !placing) { ve.shown = 1; const e = EVENTS.find(x => x.id === ve.id); if (e) openEvent(e); }
  if (now() - ve.t > 8 * 60000) { S.visEv = null; toast('Il visitatore se n\'è andato senza udienza'); }
}
function visitorDone() { if (!S.visEv) return; S.visEv = null; if (SC) for (const u of visitorsOf(SC)) { u.dead = true; u.deadT = 9; } }
function pickVisitor(sx, sy) { if (!SC || !S.visEv) return null; const wx = (sx - VW / 2) / cam.z + cam.x, wy = (sy - VH / 2) / cam.z + cam.y; for (const u of visitorsOf(SC)) { const [bx, by] = W(u.x, u.y); if (Math.abs(wx - bx) < 22 && wy > by - 60 && wy < by + 8) return u; } return null; }
function drawVisitorMark(c, sc, u) { if (!u.visLead || !S.visEv || u.dead) return; const [x, y] = W(u.x, u.y); const t = sc.time, by = y - (u.d && u.d.cav ? 76 : 58) - Math.abs(Math.sin(t * 3)) * 4; c.fillStyle = 'rgba(253,246,227,0.96)'; c.strokeStyle = '#5c3a25'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, by, 11, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(x - 4, by + 9); c.lineTo(x, by + 16); c.lineTo(x + 4, by + 9); c.fill(); c.fillStyle = '#b3261e'; c.font = 'bold 14px serif'; c.textAlign = 'center'; c.fillText('!', x, by + 5); c.textAlign = 'start'; }
function evPick() {
  const s = seasonInfo().s.k; const pool = EVENTS.filter(e => (e.s === 'all' || e.s.includes(s)) && (!e.cond || e.cond()) && e.id !== S.lastEv);
  return pool[(Math.random() * pool.length) | 0];
}
function eventTick(dt) {
  if (!S || S.creative || S.sandbox || MODE !== 'village' || S.mq < 3) return;
  S.evIn = (S.evIn == null ? 200 : S.evIn) - dt;
  if (S.evIn <= 0 && $('#sheet').classList.contains('hidden') && !placing) { const e = evPick(); if (!e) { S.evIn = 60; return; } S.evIn = 360 + Math.random() * 240; S.lastEv = e.id; if (S.visEv || !visitorStart(e)) openEvent(e); }
}
let CUR_EV = null;
function openEvent(e) {
  const v = e.mk ? e.mk() : e; CUR_EV = { e, ch: v.ch }; sfx('bell');
  openSheet(`${e.ic} ${e.t}`, `<div class="evc"><div class="evi">${e.ic}</div><p class="evx">${v.x || e.x}</p><div class="evch">${v.ch.map((c, i) => { const ok = (!c.c || canPay(c.c)) && (!c.need || c.need()); return `<button class="btn ${i === v.ch.length - 1 && !c.c && !c.f ? 'ghost' : ''} ${ok ? '' : 'dis'}" ${ok ? '' : 'disabled'} onclick="evChoose(${i})">${c.l}${c.c ? `<small>${costStr(c.c)}</small>` : ''}</button>`; }).join('')}</div></div>`, 'event');
}
function evChoose(i) { const c = CUR_EV && CUR_EV.ch[i]; if (!c) return; if (S.visEv && S.visEv.id === CUR_EV.e.id) visitorDone(); if (c.c) { if (!canPay(c.c)) return; pay(c.c); } if (c.f) c.f(); S.events = (S.events || 0) + 1; CUR_EV = null; closeSheet(); save(); updateHUD(); }
// ---------- conseguenze delle stagioni ----------
const seasonBuildMul = () => (S && !S.creative && seasonInfo().s.k === 'inverno') ? 1.25 : 1;
const seasonRaidMul = () => { const k = seasonInfo().s.k; return k === 'inverno' ? 1.4 : k === 'estate' ? 0.85 : 1; };
function seasonTick(dt) {
  if (!S || S.creative || MODE !== 'village') return; const si = seasonInfo();
  if (S.prevSeasonK && S.prevSeasonK !== si.s.k && si.s.k === 'primavera') { S.winters = (S.winters || 0) + 1; }
  S.prevSeasonK = si.s.k;
  if (si.s.k !== 'inverno') return;
  S.upkT = (S.upkT || 0) + dt; if (S.upkT < 60) return; S.upkT = 0;
  const need = Math.ceil(armyUsed() * 0.5); if (!need) return;
  if (S.res.cibo >= need) { S.res.cibo -= need; if (Math.random() < 0.25) toast(`❄️ L'esercito consuma ${need} ${ICO('cibo')} per l'inverno`); }
  else { S.res.cibo = 0; const k = UNIT_ORDER.slice().reverse().find(k => S.army[k] > 0); if (k) { S.army[k]--; toast(`❄️ Fame d'inverno: un ${UDEF[k].n} diserta`); } }
}
// ---------- capitoli della campagna ----------
const CHAPTERS = [
  { n: 'I', t: 'Il Castrum di Legno', x: 'Inverno dell\'anno 193 dopo Cristo. L\'imperatore Commodo è morto, Pertinace è stato ucciso dai pretoriani e l\'Impero è stato messo all\'asta. Ti resta un castrum di legno marcio sul Danubio, una manciata di coloni e una tavoletta dal sigillo infranto: «Riprendi l\'Aquila». Prima di ogni gloria, servono pane, tetti e uomini.', r: { oro: 120, legno: 120 } },
  { n: 'II', t: 'Fuoco e Ferro', x: 'La voce del nuovo tribuno corre lungo il Danubio, e con lei arrivano i barbari. Senza fabbri, senza medici e senza mura il presidio non vedrà la primavera. Fai cantare le incudini.', r: { ferro: 80, oro: 150 } },
  { n: 'III', t: 'I Vicini del Limes', x: 'Cinque potenti si spartiscono le terre intorno a te: un re barbaro superbo, un mercante avido, un sacerdote di Mitra, un capo sarmata e il potente Legato di Carnuntum. Con l\'oro e la parola si vincono più guerre che con il gladio.', r: { oro: 200, favore: 3 } },
  { n: 'IV', t: 'Il Fiume Gelato', x: 'D\'inverno il Danubio ghiaccia e i barbari lo attraversano a piedi. L\'esercito mangia il doppio, i cantieri rallentano e i lupi scendono fino ai recinti. Prepara gli horrea e tempra i tuoi uomini.', r: { cibo: 300, pelli: 4 } },
  { n: 'V', t: 'L\'Età della Legione', x: 'Il legno lascia il posto alla pietra: il Castrum diventa un castellum. Ora sei un comandante tra i comandanti. Stringi alleanze, fai passare le carovane e mostra alla Provincia chi comanda in battaglia.', r: { oro: 400, favore: 6 } },
  { n: 'VI', t: 'L\'Aquila Spezzata', x: 'Le parti dell\'Aquila d\'oro della Legione Ventitreesima sono sparse lungo il limes. Chi riunirà alleati e tributari sotto una sola insegna potrà marciare su Roma.', r: { oro: 600, favore: 10 } },
  { n: 'VII', t: 'L\'Età delle Città', x: 'Mura concentriche, torri e baliste: il tuo presidio è diventato una città, la più temuta del Danubio. Ma un trono si regge sulla fedeltà delle legioni, non solo sulle pietre.', r: { oro: 900, favore: 15 } },
  { n: 'VIII', t: 'L\'Impero', x: 'Tutta la Provincia guarda a te. Resta un ultimo passo: unire ogni popolo sotto la tua insegna e alzare il Castrum fino al cielo. Che le legioni gridino il nome del nuovo Imperatore.', r: { favore: 30 } },
];
const vetMax = () => { let m = 1; for (const k in (S.vets || {})) for (const r of S.vets[k]) m = Math.max(m, r.lvl); return m; };
const QUESTS = [
  { ch: 0, t: 'Costruisci la Taberna', b: 'taverna', c: () => built('taverna') >= 1, r: { oro: 80, legno: 60 } },
  { ch: 0, t: 'Costruisci una terza Domus', b: 'casa', c: () => built('casa') >= 3, r: { legno: 120 } },
  { ch: 0, t: 'Riscuoti 5 volte dalle tabernae', c: () => (S.collects || 0) >= 5, r: { cibo: 120 } },
  { ch: 0, t: 'Raduna un esercito di 14 uomini', c: () => Object.keys(S.army).reduce((a, k) => a + S.army[k] * UDEF[k].sp, 0) >= 14, r: { cibo: 150 } },
  { ch: 0, t: 'Vinci la tua prima battaglia', c: () => S.wins >= 1, r: { oro: 150, favore: 2 } },
  { ch: 1, t: 'Porta il Castrum al livello 2', m: 1, c: () => S.mastio >= 2, r: { legno: 200, cibo: 100 } },
  { ch: 1, t: 'Costruisci la Fabrica', b: 'fucina', c: () => built('fucina') >= 1, r: { ferro: 60 } },
  { ch: 1, t: "Costruisci il Valetudinarium", b: 'infermeria', c: () => built('infermeria') >= 1, r: { oro: 120 } },
  { ch: 1, t: 'Respingi un\'incursione notturna', c: () => S.raidsWon >= 1, r: { favore: 3, oro: 100 } },
  { ch: 1, t: 'Porta il Castrum al livello 3', m: 1, c: () => S.mastio >= 3, r: { pietra: 150 } },
  { ch: 2, t: 'Manda un dono a un popolo vicino', c: () => (S.gifts || 0) >= 1, r: { oro: 80 }, how: 'Mappa → Diplomazia' },
  { ch: 2, t: 'Costruisci il Forum', b: 'mercato', c: () => built('mercato') >= 1, r: { legno: 150 } },
  { ch: 2, t: 'Commercia 3 volte al Forum', c: () => (S.trades || 0) >= 3, r: { oro: 100 }, how: 'Mappa → Forum' },
  { ch: 2, t: 'Stringi un patto commerciale', c: () => countSt('patto', 'alleato') >= 1, r: { oro: 150, favore: 2 } },
  { ch: 2, t: 'Affronta 3 eventi della Provincia', c: () => (S.events || 0) >= 3, r: { cibo: 150 } },
  { ch: 3, t: "Costruisci l'Armamentarium", b: 'armeria', c: () => built('armeria') >= 1, r: { ferro: 120 } },
  { ch: 3, t: 'Caccia 3 animali selvatici', c: () => (S.hunted || 0) >= 3, r: { cibo: 150, pelli: 3 } },
  { ch: 3, t: 'Sopravvivi a un inverno', c: () => (S.winters || 0) >= 1, r: { cibo: 200, legno: 150 } },
  { ch: 3, t: 'Porta il Castrum al livello 4', m: 1, c: () => S.mastio >= 4, r: { oro: 300, ferro: 100 } },
  { ch: 3, t: 'Ottieni 3 stelle in una battaglia', c: () => !!S.best3, r: { favore: 5 } },
  { ch: 4, t: 'Il Castrum diventa Castellum (liv. 5)', m: 1, c: () => S.mastio >= 5, r: { oro: 500, favore: 5 } },
  { ch: 4, t: 'Stringi alleanza con un popolo', c: () => countSt('alleato') >= 1, r: { oro: 250 } },
  { ch: 4, t: 'Ricevi 5 carovane', c: () => (S.caravans || 0) >= 5, r: { pietra: 200 } },
  { ch: 4, t: 'Porta un veterano al livello 5', c: () => vetMax() >= 5, r: { ferro: 150 } },
  { ch: 4, t: 'Vinci 10 battaglie', c: () => S.wins >= 10, r: { favore: 10 } },
  { ch: 5, t: 'Rendi tributario un popolo', c: () => countSt('vassallo') >= 1, r: { oro: 400 }, how: 'Esigi tributo o conquistalo in guerra' },
  { ch: 5, t: 'Castellum al livello 8', m: 1, c: () => S.mastio >= 8, r: { favore: 15 } },
  { ch: 5, t: 'Due popoli alleati o tributari', c: () => countSt('alleato', 'vassallo') >= 2, r: { oro: 500 } },
  { ch: 6, t: 'Castrum al livello 10', m: 1, c: () => S.mastio >= 10, r: { pietra: 400, oro: 400 } },
  { ch: 6, t: 'Tre popoli alleati o tributari', c: () => countSt('alleato', 'vassallo') >= 3, r: { favore: 15 } },
  { ch: 6, t: 'Castrum al livello 12', m: 1, c: () => S.mastio >= 12, r: { oro: 800 } },
  { ch: 7, t: 'Castrum al livello 14', m: 1, c: () => S.mastio >= 14, r: { oro: 1000, ferro: 400 } },
  { ch: 7, t: 'Tutti i popoli alleati o tributari', c: () => countSt('alleato', 'vassallo') >= 5, r: { favore: 25 } },
  { ch: 7, t: 'Castrum al livello 16: sei Imperatore', m: 1, c: () => S.mastio >= 16, r: { favore: 50 } },
];
function questMigrate() { if (S.qv === 2) return; S.qv = 2; let i = 0; while (i < QUESTS.length && QUESTS[i].c()) i++; S.mq = Math.min(S.mq || 0, i); if ((S.mq || 0) > 0) S.chSeen = QUESTS[Math.min(S.mq, QUESTS.length - 1)].ch; }
let CH_IDLE = 0;
function chapterTick(dt) {
  if (!S || S.creative || S.sandbox || MODE !== 'village' || placing || !$('#sheet').classList.contains('hidden')) { CH_IDLE = 0; return; } CH_IDLE += dt || 0; if (CH_IDLE < 1.2) return;
  const q = QUESTS[S.mq]; if (!q) return; if ((S.chSeen == null ? -1 : S.chSeen) < q.ch) { S.chSeen = q.ch; if (q.ch > 0) { openCronaca(q.ch); STORY.onEnd = () => openChapter(q.ch); } else openChapter(q.ch); }
}
function openChapter(i) {
  const C = CHAPTERS[i]; const qs = QUESTS.filter(q => q.ch === i);
  openSheet(`📜 Capitolo ${C.n}`, `<div class="chap"><div class="chn">Capitolo ${C.n}</div><h3>${C.t}</h3><p class="chx">${C.x}</p><div class="chq"><b>Obiettivi</b>${qs.map(q => `<div>◇ ${q.t}${q.how ? ` <small>(${q.how})</small>` : ''}</div>`).join('')}</div><div class="chr">Ricompensa del capitolo: ${Object.keys(C.r).map(k => ICO(k) + ' ' + C.r[k]).join(' ')}</div><div class="acts"><button class="btn big" onclick="closeSheet()">Comincia</button></div></div>`, 'chapter');
}
// ================= STORIA: prologo alla prima apertura e Cronache rileggibili =================
const PROLOGO = [
  { img: 1, ic: '🦅', t: 'Anno 193 dopo Cristo', x: 'Commodo è morto strangolato nel bagno. Pertinace, il suo successore, è durato ottantasette giorni: i pretoriani lo hanno ucciso e hanno messo l\'Impero all\'asta.<br><br>Si dice che quella stessa notte, sul Danubio, l\'Aquila d\'oro della Ventitreesima Legione sia andata in pezzi.' },
  { img: 2, ic: '🗺️', t: 'La Pannonia', x: 'Lungo il Danubio i legati non obbediscono più a Roma. Re barbari superbi, mercanti avidi, sacerdoti potenti e capi sarmati si contendono guadi, ville e villaggi.<br><br>Ogni comandante alza mura. Nessuno si fida del vicino.' },
  { img: 3, ic: '🛡️', t: 'L\'ultimo della gens', x: 'Tu sei il figlio minore di una gens caduta in disgrazia. Tuo padre, legato della Ventitreesima, è morto in un\'imboscata; i tuoi fratelli in battaglia oltre il fiume.<br><br>Ti restano un nome, un anello col sigillo e un castrum di legno marcio sul limes.' },
  { img: 4, ic: '📜', t: 'Il sigillo infranto', x: 'Una notte un cavaliere senza insegne ti consegna una tavoletta di cera e sparisce nel buio. Il sigillo è spezzato a metà, come l\'Aquila.<br><br>Incise nella cera, poche parole: <i>«Riprendi l\'Aquila.»</i><br><br>Nessuno sa chi l\'abbia scritta.' },
  { img: 5, ic: '🌅', t: 'L\'alba sul limes', x: 'All\'alba raggiungi il presidio. Una manciata di coloni e veterani ti guarda in silenzio, tra baracche di legno e una palizzata che cade a pezzi.<br><br>Il vecchio Centurione ti aspetta davanti al castrum.<br><br><i>«Ave, tribuno. Il presidio è vostro. Da dove cominciamo?»</i>' },
];
// una pagina di cronaca per ogni capitolo: si sblocca quando il capitolo comincia
const CRONACHE = [
  'Il castrum cigola a ogni folata di vento e i coloni hanno più fame che speranza. Il Centurione ti mostra i campi incolti, la taberna chiusa, la palizzata marcita.<br><br>«Prima di ogni gloria, tribuno, servono pane, tetti e uomini.»<br><br>Quella notte, al lume di una lucerna, rileggi la tavoletta. Sul bordo del sigillo spezzato noti un segno che non avevi visto: mezza ala d\'aquila.',
  'La voce del nuovo tribuno corre lungo il Danubio, e con lei arrivano i barbari. Le prime notti di fuoco ti insegnano che un presidio senza fabbri e senza medici non sopravvive all\'inverno.<br><br>Tra i predoni uccisi trovi un uomo con lo stesso segno della tavoletta tatuato sul polso: mezza ala d\'aquila. Qualcuno, nella Provincia, conosce il tuo nome meglio di te.',
  'Cinque potenti si spartiscono le terre intorno al tuo presidio. Re Gaiobomaro ti riceve con disprezzo, il mercante Sabino conta le tue monete, Pater Elio ti benedice nel nome di Mitra e ti osserva.<br><br>Ognuno, a modo suo, ti chiede della tavoletta. Nessuno ammette di averla scritta. Ma Pater Elio, quando vede il sigillo, impallidisce.',
  'D\'inverno il Danubio ghiaccia e porta neve, fame e lupi. Nelle lunghe notti Asclepiade il medico ti racconta una storia: quando la Ventitreesima fu distrutta, l\'ultimo aquilifero spezzò l\'Aquila in sei parti e le affidò a sei famiglie fedeli, perché nessun usurpatore potesse mai marciare sotto di lei.<br><br>«La vostra gens, tribuno, era una di quelle sei.»',
  'Il legno lascia il posto alla pietra: il castrum diventa un castellum e i potenti della Provincia smettono di ridere. Le carovane passano dalle tue terre, i popoli vicini pagano tributo.<br><br>Una matrona arriva al presidio con una scorta di cavalieri: Domina Livia. Al collo porta un pendente d\'oro a forma di mezza ala d\'aquila.',
  'Domina Livia confessa: è stata lei a scrivere la tavoletta. Suo padre custodiva una parte dell\'Aquila, ed è morto per difenderla. Il Legato di Carnuntum sta radunando gli altri pezzi con il gladio e con l\'inganno, per farsi acclamare Imperatore.<br><br>«Chi riunirà l\'Aquila avrà dietro di sé le legioni del Danubio. Ho scelto voi, perché siete l\'unico a cui non importava della porpora.»',
  'Mura concentriche, torri e baliste: il tuo presidio è ormai una città, la più temuta del Danubio. Tre parti dell\'Aquila sono nelle tue mani, due in quelle del Legato.<br><br>Ma un trono si regge sulla fedeltà delle legioni, non sulle pietre. Il Legato lo sa, e compra i tuoi alleati uno a uno.',
  'Tutta la Provincia guarda a te. Nel sacello delle insegne le parti dell\'Aquila d\'oro giacciono su un drappo di porpora, in attesa dell\'ultimo pezzo.<br><br>Resta un passo: unire ogni popolo sotto la tua insegna e alzare il castrum fino al cielo. Allora l\'Aquila spezzata tornerà intera, e le legioni grideranno il tuo nome.',
];
const storyImg = i => `ui/story_${i}.webp`;
function storyPanel(p, n, i, last) {
  return `<div class="stimg"><img src="${storyImg(p.img || 6)}" alt="" onload="this.classList.add('ok');this.nextElementSibling&&this.nextElementSibling.remove()" onerror="this.remove()"><div class="stph"><span>${p.ic || '📜'}</span></div></div>
    <div class="sttx"><div class="stn">${n}</div><h2>${p.t}</h2><p>${p.x}</p></div>
    <div class="stnav">${Array.from({ length: n.total || 1 }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
    <div class="sthint">${last ? (p.sub === 'Prologo' ? 'Tocca per cominciare' : 'Tocca per chiudere') : 'Tocca per continuare'}</div>`;
}
let STORY = null;
const STORY_IMG = {}; function storyPreload(pages) { return Promise.all(pages.map(p => { const src = storyImg(p.img || 6); if (STORY_IMG[src]) return STORY_IMG[src]; const im = new Image(); im.src = src; return STORY_IMG[src] = (im.decode ? im.decode() : new Promise(r => { im.onload = r; })).catch(() => { }); })); }
function storyOpen(pages, onEnd) { storyPreload(pages).then(() => storyOpen0(pages, onEnd)); }
function storyOpen0(pages, onEnd) { STORY = { pages, i: 0, onEnd }; let el = $('#story'); if (!el) { el = document.createElement('div'); el.id = 'story'; el.innerHTML = '<button class="stskip" onclick="event.stopPropagation();storyEnd()">Salta ›</button><div class="stbox"></div>'; el.addEventListener('click', storyNext); document.body.appendChild(el); } el.classList.remove('hidden'); storyShow(); try { musicStart(); } catch (e) { } }
function storyShow() { const el = $('#story'), p = STORY.pages[STORY.i]; const n = { total: STORY.pages.length, toString() { return '' } }; const box = el.querySelector('.stbox'); box.classList.remove('in'); box.innerHTML = storyPanel(p, Object.assign(n, { toString: () => p.sub || '' }), STORY.i, STORY.i === STORY.pages.length - 1); void box.offsetWidth; box.classList.add('in'); }
function storyNext() { if (!STORY) return; if (STORY.i < STORY.pages.length - 1) { STORY.i++; sfx('click'); storyShow(); } else storyEnd(); }
function storyEnd() { const el = $('#story'); if (el) el.classList.add('hidden'); const f = STORY && STORY.onEnd; STORY = null; if (f) f(); }
function prologueMaybe() { if (SET.storySeen) return; SET.storySeen = 1; saveSet(); storyOpen(PROLOGO.map(p => Object.assign({ sub: 'Prologo' }, p))); }
function curChapter() { if (!S) return -1; const q = QUESTS[Math.min(S.mq, QUESTS.length - 1)]; return S.mq >= QUESTS.length ? CHAPTERS.length - 1 : (q ? q.ch : 0); }
function openCronache() {
  const cur = S && !S.sandbox && !S.creative ? curChapter() : -1;
  const row = (ok, ic, t, sub, on) => `<button class="crow ${ok ? '' : 'lock'}" ${ok ? `onclick="${on}"` : ''}><span class="cic">${ok ? ic : '🔒'}</span><span class="ctx"><b>${t}</b><small>${sub}</small></span></button>`;
  openSheet('📜 Cronache della Provincia', `<p class="desc"><i>Gli annali dello scriba della tua gens. Ogni capitolo della campagna ne aggiunge una nuova.</i></p><div class="cron">${row(true, '👑', 'Prologo', 'L\'Aquila spezzata e la tavoletta', 'closeSheet();storyOpen(PROLOGO.map(p=>Object.assign({sub:\'Prologo\'},p)))')}
    ${CHAPTERS.map((C, i) => row(i <= cur, '📖', `Capitolo ${C.n} · ${C.t}`, i <= cur ? (i < cur ? 'Concluso' : 'In corso') : 'Sigillato: si apre andando avanti nella campagna', `closeSheet();openCronaca(${i})`)).join('')}</div>`, 'cron');
}
function openCronaca(i) { const C = CHAPTERS[i]; storyOpen([{ img: i === 2 || i === 3 ? 7 : 6, ic: '📖', sub: `Capitolo ${C.n}`, t: C.t, x: CRONACHE[i] || C.x }]); }
function campaignTick(dt) { diploTick(dt); seasonTick(dt); eventTick(dt); chapterTick(dt); diaryTick(dt); forecastTick(); }
function questHTML() {
  const q = QUESTS[S.mq]; if (!q) return '<span class="qt">📜 La Provincia è tua. Tutte le missioni compiute.</span>';
  const done = q.c(); const rw = Object.keys(q.r).map(k => ICO(k) + q.r[k]).join(' ');
  const chq = QUESTS.filter(x => x.ch === q.ch), ci = chq.indexOf(q) + 1;
  const qc = !done && questCost(); const nl = qc ? needLabel(qc.cost) : '';
  return `<span class="ql" onclick="openChapter(${q.ch})">📜 Cap. ${CHAPTERS[q.ch].n} · ${ci}/${chq.length}</span> <span class="qt">${q.t}</span> <span class="qr">${rw}</span>${done ? '<button class="qb" onclick="claimQuest()">Riscuoti</button>' : ''}${nl ? `<span class="qn" onclick="questNeed()">${nl} ›</span>` : ''}`;
}
function claimQuest() { const q = QUESTS[S.mq]; if (!q || !q.c()) return; for (const k in q.r) addRes(k, q.r[k]); const chDone = !QUESTS[S.mq + 1] || QUESTS[S.mq + 1].ch !== q.ch; S.mq++; if (chDone) { const C = CHAPTERS[q.ch]; for (const k in C.r) addRes(k, C.r[k]); setTimeout(() => toast(`🏆 Capitolo ${C.n} «${C.t}» completato! ${Object.keys(C.r).map(k => ICO(k) + ' +' + C.r[k]).join(' ')}`), 1800); } sfx('coin'); toast(`📜 Missione compiuta! ${Object.keys(q.r).map(k => ICO(k) + ' +' + q.r[k]).join(' ')}`); save(); updateHUD(); }

// ---------- battle HUD ----------
function showBattleHUD() { $('#hud').classList.add('hidden'); $('#bhud').classList.remove('hidden'); $('#placebar').classList.add('hidden'); if (SC) SC.order = MODE === 'raid' ? 'guard' : 'free'; renderOrders(); updateBattleHUD(true); }
let lastCards = '';
function updateBattleHUD(force) {
  if (!BT) return;
  const t = Math.max(0, Math.ceil(BT.timer)); const mm = Math.floor(t / 60), ss = t % 60;
  if (MODE === 'attack') {
    $('#btop').innerHTML = `<div class="bt-name">${BT.tg.name}</div><div class="bt-row"><span class="tm">${BT.started ? '' : '⚑ '}${mm}:${String(ss).padStart(2, '0')}</span><span class="st">${'★'.repeat(BT.stars || 0)}<i>${'★'.repeat(3 - (BT.stars || 0))}</i></span><span class="pc">${BT.pct || 0}%</span></div><div class="bt-loot">${Object.keys(BT.lootGot).filter(k => BT.lootGot[k] > 0).map(k => ICO(k) + ' ' + BT.lootGot[k]).join(' ') || 'Bottino: —'}</div>`;
  } else {
    const alive = SC.U.filter(u => !u.dead && u.side === 'A').length + BT.spawnLeft;
    $('#btop').innerHTML = `<div class="bt-name">${BT.pack ? '🐺 Notte del branco' : '🌙 Razzia notturna'}</div><div class="bt-row"><span class="tm">${mm}:${String(ss).padStart(2, '0')}</span><span class="pc">${BT.pack ? "Bestie" : "Predoni"}: ${alive}</span><span class="pc">Danni ${BT.pct || 0}%</span></div>`;
  }
  // cards (only rebuild when something changes)
  const sel = SC.deploySel; const sig = JSON.stringify([BT.avail, BT.heroes.map(h => [h.k, !!h.u, h.u && h.u.ultUsed, h.u && h.u.dead]), sel, BT.ended]);
  if (!force && sig === lastCards) return; lastCards = sig;
  let html = '';
  if (MODE === 'attack') for (const k of UNIT_ORDER) { const n = BT.avail[k] || 0, used = BT.used[k] || 0; if (!n && !used) continue; html += `<button class="ucard ${sel && sel.k === k ? 'on' : ''} ${n ? '' : 'dis'}" onclick="selDeploy('${k}')"><div class="uimg" style="${thumbStyle(k)}"></div><span class="n">×${n}</span><span class="nm">${UDEF[k].sn}</span></button>`; }
  for (const h of BT.heroes) {
    const d = HDEF[h.k]; let cls = '', lab = d.n.split(' ').pop();
    if (!h.u) cls = sel && sel.hero === h.k ? 'on' : ''; else if (h.u.dead) { cls = 'dis'; lab = 'Caduto'; } else if (h.u.ultUsed) { cls = 'dis'; lab = 'Usata'; } else { cls = 'ult'; lab = d.ult; }
    html += `<button class="ucard hero ${cls}" onclick="heroCard('${h.k}')"><div class="uimg" style="${thumbStyle(h.k)}"></div><span class="n">♔</span><span class="nm">${lab}</span></button>`;
  }
  const left = MODE === 'attack' ? UNIT_ORDER.reduce((s, k) => s + (BT.avail[k] || 0), 0) : 0;
  $('#bcards').innerHTML = (left > 1 ? `<button class="ucard all" onclick="deployAll()"><div class="uimg">⚔</div><span class="n">×${left}</span><span class="nm">Schiera tutti</span></button>` : '') + (html || '<div class="empty">Nessuna truppa: difesa automatica</div>');
}
function selDeploy(k) { if (!BT || BT.ended || !(BT.avail[k] > 0)) return; SC.deploySel = { k }; autoDeploy(); }
// punto di raccolta: casella libera appena fuori dalla zona nemica, la più vicina al centro dello schermo
// punto di raccolta davanti al campo: la casella libera fuori dalla zona rossa più in basso sullo schermo (il lato da cui arrivi)
function frontRally() { let best = null, bv = -1e9; for (let y = 2; y < N - 2; y++) for (let x = 2; x < N - 2; x++) { if (SC.zone[y * N + x] || isWater(SC, x, y) || bAt(SC, x, y)) continue; let near = false; for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) if (inMap(x + dx, y + dy) && SC.zone[(y + dy) * N + x + dx] === 1) { near = true; break; } if (!near) continue; const p = rotP(x + 0.5, y + 0.5); const v = p[0] + p[1] - Math.abs((p[0] - p[1])) * 0.3; if (v > bv) { bv = v; best = [x, y]; } } return best; }
function rallyPoint() {
  const [cx, cy] = screenToTile(VW / 2, VH * 0.62); let best = null, bd = 1e9;
  const free = (x, y) => inMap(x, y) && x > 1 && y > 1 && x < N - 2 && y < N - 2 && !(MODE === 'attack' && SC.zone[y * N + x]) && !isWater(SC, x, y) && !bAt(SC, x, y);
  for (let y = 2; y < N - 2; y++) for (let x = 2; x < N - 2; x++) { if (!free(x, y)) continue; let near = false; if (MODE === 'attack') { for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) if (inMap(x + dx, y + dy) && SC.zone[(y + dy) * N + x + dx]) { near = true; break; } } else near = true; if (!near) continue; const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy); if (d < bd) { bd = d; best = [x, y]; } }
  return best;
}
function autoDeploy(all) {
  if (!BT || BT.ended || !SC.deploySel) return; if (!SC.rally) SC.rally = rallyPoint(); const r = SC.rally; if (!r) { toast('Nessun punto libero per schierare: tocca la mappa fuori dalla zona rossa'); return; }
  let tries = 0, done = 0; const want = all ? 999 : 1;
  while (done < want && SC.deploySel && tries < 400) { tries++; SC.dn = (SC.dn || 0) + 1; const a = SC.dn * 2.4, rr = 0.3 + Math.sqrt(SC.dn) * 0.45; const x = r[0] + 0.5 + Math.cos(a) * rr, y = r[1] + 0.5 + Math.sin(a) * rr;
    const [wx, wy] = W(x, y); const sx = (wx - cam.x) * cam.z + VW / 2, sy = (wy - cam.y) * cam.z + VH / 2; const ok = deployAtQuiet(sx, sy); if (ok) done++; if (SC.dn > 300) SC.dn = 0; }
  if (all && done) { toast(`⚔ Schierati ${done} uomini`); sfx('horn'); }
}
function deployAtQuiet(sx, sy) { const T = SC.T.length; deployAt.auto = 1; const r = deployAt(sx, sy); deployAt.auto = 0; if (!r) SC.T.length = T; return r; }
function deployAll() { if (!BT || BT.ended || MODE !== 'attack') return; for (const k of UNIT_ORDER) { if (!(BT.avail[k] > 0)) continue; SC.deploySel = { k }; autoDeploy(true); } updateBattleHUD(true); }
function heroCard(k) { const h = BT.heroes.find(h => h.k === k); if (!h) return; if (!h.u) { SC.deploySel = { hero: k }; autoDeploy(); } else if (heroUlt(SC, h.u)) { } updateBattleHUD(true); }

// ---------- title ----------
// conferma dentro al gioco (i popup del browser sono bloccati nella pagina pubblicata)
let ASK = null;
// ---- aggiornamento automatico: se su GitHub c'è una versione nuova, ricarica scavalcando la cache ----
const BUILD = '__BUILD__';
function checkUpdate() { if (BUILD.startsWith('__') || !/github\.io$/.test(location.hostname)) return;
  fetch('version.txt?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.text() : '').then(v => { v = (v || '').trim(); if (!v || v === BUILD) return; let tried = ''; try { tried = sessionStorage.getItem('imperium_upd') || ''; } catch (e) { } if (tried === v) return; try { sessionStorage.setItem('imperium_upd', v); } catch (e) { }
    try { if (S && MODE !== 'title') save(); } catch (e) { } location.replace(location.pathname + '?v=' + v); }).catch(() => { }); }
setTimeout(checkUpdate, 1500); document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
function askYes(msg, fn, yes) { ASK = fn; let el = $('#askd'); if (!el) { el = document.createElement('div'); el.id = 'askd'; document.body.appendChild(el); }
  el.innerHTML = `<div class="ab"><p>${msg}</p><div class="aa"><button class="btn ghost" onclick="askClose()">Annulla</button><button class="btn" onclick="askOk()">${yes || 'Conferma'}</button></div></div>`; el.classList.remove('hidden'); document.body.classList.add('asking');
  el.querySelectorAll('button').forEach((b, i) => b.addEventListener('touchend', ev => { ev.preventDefault(); i === 0 ? askClose() : askOk(); }, { passive: false })); }
function askClose() { const el = $('#askd'); if (el) el.classList.add('hidden'); document.body.classList.remove('asking'); ASK = null; }
function askOk() { const f = ASK; askClose(); if (f) f(); }
function newCampaign() { askYes('Ricominciare la campagna da capo?<br><small>Tengo una copia della partita attuale in «Copie di sicurezza».</small>', () => { closeSheet(); closeFolk(); try { const cur = localStorage.getItem(SAVE_KEY); if (cur) bkPut('nuova', cur, bkMeta()); localStorage.removeItem(SAVE_KEY); } catch (e) { } if (CLOUD.mem) delete CLOUD.mem[SAVE_KEY]; CLOUD.lastS = null; beginGame(true); cloudPush(true); toast('⚔ Nuova campagna iniziata'); }, 'Ricomincia'); }
function saveCode() { const s = load(); if (!s) { toast('Nessuna partita da esportare'); return; } const code = 'IMPERIUM1:' + btoa(unescape(encodeURIComponent(JSON.stringify(s)))); try { navigator.clipboard.writeText(code).then(() => toast('📋 Codice della partita copiato: incollalo in Note per conservarlo'), () => prompt('Copia questo codice:', code)); } catch (e) { prompt('Copia questo codice:', code); } }
function openImport() { openSheet('📥 Importa partita', `<p class="desc">Incolla qui il codice della partita che avevi copiato (inizia con IMPERIUM1:).</p><textarea id="impc" style="width:100%;height:120px;font-size:12px;border-radius:8px;padding:6px"></textarea><div class="acts"><button class="btn" onclick="doImport()">Carica partita</button><button class="btn ghost" onclick="closeSheet()">Annulla</button></div>`, 'imp'); }
function doImport() { const v = ($('#impc').value || '').trim(); try { if (!v.startsWith('IMPERIUM1:')) throw 0; const s = JSON.parse(decodeURIComponent(escape(atob(v.slice(10))))); if (!s || s.v !== 1) throw 0; SAVE_KEY = 'imperium_proto_v1'; CLOUD.mem = CLOUD.mem || {}; CLOUD.mem[SAVE_KEY] = JSON.stringify(s); try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { } closeSheet(); beginGame(false); toast('📥 Partita caricata'); } catch (e) { toast('Codice non valido'); } }
function showTitle() {
  MODE = 'title'; $('#title').classList.remove('hidden'); renderTset();
  const tb = (cls, on, ic, lb, sub, dis) => `<button class="btn tb ${cls}" ${dis ? 'disabled' : `onclick="${on}"`}><i class="bi">${ic}</i><span class="bl">${lb}</span>${sub ? `<small>${sub}</small>` : ''}</button>`;
  const sv = load(); const when = sv && sv.last ? new Date(sv.last).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  const cs = !window.claude ? '💾 Salvataggio su questo dispositivo · usa 📋 Copia codice partita per spostarlo' : CLOUD.ready ? '☁ Salvataggio nel cloud del tuo account: attivo' : '⚠ Salvataggio solo su questo browser' + (CLOUD.why ? ' · motivo: ' + CLOUD.why : ' · controllo del cloud in corso…') + '<br><button class="btn ghost" style="margin-top:5px;font-size:12px;padding:6px 12px" onclick="cloudAsk()">☁ Attiva salvataggio cloud</button>';
  const bNew = tb('big k-new', sv ? 'newCampaign()' : 'beginGame(true)', '⚔', sv ? 'Nuova Campagna' : 'Inizia Campagna', sv ? 'ricomincia da capo (cancella il salvataggio)' : 'una nuova Provincia da conquistare');
  const bCont = tb('big cont' + (sv ? '' : ' dis'), 'beginGame(false)', '📜', 'Continua Campagna', sv ? `Castrum ${sv.mastio} · ${ERA(sv.mastio).n} · salvata ${when}` : (CLOUD.ready ? 'nessun salvataggio sul tuo account' : 'nessun salvataggio su questo dispositivo'), !sv);
  $('#tbtns').innerHTML = (sv ? bCont + bNew : bNew + bCont)
    + `<div class="savex">${sv ? '<button class="btn ghost" onclick="saveCode()">📋 Copia codice partita</button>' : ''}<button class="btn ghost" onclick="openImport()">📥 Importa partita</button>${Object.keys(bkMeta()).length ? '<button class="btn ghost" onclick="openBackups(1)">🛟 Copie</button>' : ''}</div>`
    + `<div class="cloudst">${cs}</div>`
    + tb('k-max', 'pickEra()', '🏰', 'Città al massimo', "scegli l'era, tutto sbloccato")
    + tb('k-cre', 'pickCreative()', '🧱', 'Modalità Creativa', 'tutto sbloccato, risorse infinite')
    + tb('ghost k-rlm', 'openRealms(1)', '🌍', 'Altri Regni', 'classifica e cronache dei capi della Provincia')
    + tb('ghost k-cron', 'openCronache()', '📜', 'Cronache', 'rileggi la storia della Provincia');
}
function pickCreative() {
  SAVE_KEY = 'imperium_creativo'; const has = !!load(); SAVE_KEY = 'imperium_proto_v1';
  if (!has) { startCreative(true); return; }
  $('#tset').classList.add('hidden');
  $('#tbtns').innerHTML = `<button class="btn big" style="background:linear-gradient(180deg,#3f7a2e,#245216)" onclick="startCreative(false)">🧱 Continua la creazione</button><button class="btn ghost" onclick="askYes('Ripartire con la mappa vuota?', () => startCreative(true), 'Riparti')">Mappa vuota</button><button class="btn ghost" onclick="showTitle()">← Indietro</button>`;
}
function renderTset() { const t = $('#tset'); if (!t) return; t.innerHTML = `<button class="btn ghost" onclick="pickLayout()">🎨 Layout<small>${THM().n}</small></button><button class="btn ghost" onclick="pickDiff()">⚔ Difficoltà<small>${DF().n}</small></button><button class="btn ghost" onclick="openAudio('closeSheet();renderTset()')">${SET.mute ? '🔇' : '🔊'} Audio<small>${SET.mute ? 'Muto' : 'Musica ' + Math.round(SET.mvol * 100) + '%'}</small></button>`; t.classList.remove('hidden'); }
function icoURLFor(th, k) { const o = SET.theme; SET.theme = th; const u = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icoSVG(k)); SET.theme = o; return u; }
function layoutCards(after) { return Object.keys(THEMES).map(k => { const t = THEMES[k]; return `<div class="card ${SET.theme === k ? 'on' : ''}" onclick="applyTheme('${k}');${after}"><div class="cn">${SET.theme === k ? '✓ ' : ''}${t.n}</div><div class="fs" style="font-family:'${t.fh}',serif">Imperium</div><div class="cs" style="font-family:'${t.fb}',serif">${t.fh} · ${t.fb}</div><div class="sw">${t.sw.map(s => `<i style="background:${s}"></i>`).join('')}</div><div class="ics">${['cibo', 'legno', 'oro', 'ferro', 'favore', 'army'].map(i => `<i class="ico" style="background-image:url('${icoURLFor(k, i)}')"></i>`).join('')}</div><div class="cd">${t.d}</div></div>`; }).join(''); }
function diffCards(after) { return Object.keys(DIFFS).map(k => { const d = DIFFS[k]; return `<div class="card ${SET.diff === k ? 'on' : ''}" onclick="setDiff('${k}');${after}"><div class="cn"><b style="background:${d.col}"></b>${SET.diff === k ? '✓ ' : ''}${d.n}</div><div class="cd">${d.d}</div></div>`; }).join(''); }
function setDiff(k) { SET.diff = k; saveSet(); if (typeof S !== 'undefined' && S && MODE !== 'title') { if (!S.raids && S.nightIn > DF().truce) S.nightIn = DF().truce; updateHUD(); toast('⚔ Difficoltà: ' + DF().n); } }
function pickLayout() { $('#tset').classList.add('hidden'); $('#tbtns').innerHTML = `<div class="lay">${layoutCards('pickLayout()')}</div><button class="btn big" onclick="showTitle()">✓ Fatto</button>`; }
function pickDiff() { $('#tset').classList.add('hidden'); $('#tbtns').innerHTML = `<div class="dif">${diffCards('pickDiff()')}</div><p style="font-size:12px;margin:2px 0">Vale per le partite normali, le razzie e gli assedi. Puoi cambiarla anche durante il gioco dal menu 📜.</p><button class="btn big" onclick="showTitle()">✓ Fatto</button>`; }
function pickEra() {
  $('#tset').classList.add('hidden');
  const era = (s, n, y, l, d, ok) => `<button class="card ${ok ? '' : 'dis'}" style="text-align:left;width:100%" ${ok ? `onclick="startMax(${l})"` : ''}><div class="cn">${s} · ${n}</div><div class="cs">${y}</div><div class="cd">${d}</div></button>`;
  $('#tbtns').innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;width:100%">
   ${era('I', 'Età del Castrum', '193-196 d.C. · Castrum 4', 4, 'Castrum di tronchi, palizzate, prime domus, Basilica, Forum e Tempio al massimo dell\'era.', true)}
   ${era('II', 'Età della Legione', '197-203 d.C. · Castellum livello 8', 8, 'Castellum di pietra, mura, Stalla, Biblioteca con tutte le ricerche, esercito completo con eroi.', true)}
   ${era('III', 'Età delle Città', '205-211 d.C. · Castellum livello 12', 12, 'Principia e torri agli angoli della cinta, baliste e torri raddoppiate, edifici al livello 6, città più grande.', true)}
   ${era('IV', 'Età Imperiale', '212-218 d.C. · Castellum livello 16', 16, 'Palatium imperiale con mura concentriche, porte monumentali con baliste, insegne d\'oro, edifici al livello 8.', true)}
   <button class="btn ghost" onclick="showTitle()">← Indietro</button></div>`;
}
function beginGame(fresh, preset) {
  ac(); $('#title').classList.add('hidden');
  if (preset) { } else if (fresh || !load()) startNew(); else { S = load(); offlineCatchup(); }
  if (!fresh && S.mapv !== 3) { const sh = S.mapv === 2 ? 24 : 32; for (const r of S.buildings) { r.x += sh; r.y += sh; } S.removed = []; S.mapv = 3; }
  if (!S.buildings.some(b => b.t === 'mastio')) S.buildings.unshift({ id: S.nextId++, t: 'mastio', x: 14 + OFF, y: 14 + OFF, lvl: S.mastio, stock: 0, end: 0 });
  for (const r of S.buildings) { if (r.t === 'mastio' || r.nat) continue; if (!canPlace(r.t, r.x, r.y, r)) { const f = findFree(r.t, r.x, r.y, r); if (f) { r.x = f[0]; r.y = f[1]; } } }
  S.buildings = S.buildings.filter(r => !r.nat || canPlace(r.t, r.x, r.y, r));
  for (const r of S.buildings) { if (r.t === 'mastio') continue; const d = BDEF[r.t]; const wv = villageWater(); let wet = false; for (let yy = r.y; yy < r.y + d.h; yy++) for (let xx = r.x; xx < r.x + d.w; xx++) if (wv[yy * N + xx]) wet = true; if (wet) { const f = findFree(r.t, r.x, r.y, r); if (f) { r.x = f[0]; r.y = f[1]; } } }
  { let k = 0; S.buildings = S.buildings.filter(b => !(b.nat && b.t === 'tronco') || ++k <= TRONCHI_MAX); }
  if (!S.fauna) S.fauna = []; faunaFill(true);
  if (S.nightIn == null) S.nightIn = S.raids ? 180 : DF().truce;
  if (!S.natInit) { S.natInit = 1; spawnNature(14); S.natIn = 240; }
  if (!S.natBig) { S.natBig = 1; spawnNature(12); }
  if (!S.natHuge) { S.natHuge = 1; spawnNature(45); }
  for (const r of RES) if (S.res[r] == null) S.res[r] = 0; if (S.mq == null) S.mq = 0; if (S.best3 == null) S.best3 = 0;
  if (!S.sandbox && !S.buildings.some(b => b.t === 'anfiteatro')) { const c0 = (MCX | 0) - 2; const f = canPlace('anfiteatro', c0, c0) ? [c0, c0] : findFree('anfiteatro', c0, c0); if (f) { S.buildings.push({ id: S.nextId++, t: 'anfiteatro', x: f[0], y: f[1], lvl: 1, stock: 0, end: 0 }); if (!fresh) setTimeout(() => toast('🏟️ Il Senato ti dona un Anfiteatro per la città!'), 1500); } }
  if (!S.creative && !S.buildings.some(b => b.t === 'casa')) { let n = 0; for (let rr = 4; rr < 12 && n < 2; rr++) for (let y = (MCX | 0) - rr; y <= (MCX | 0) + rr && n < 2; y++) for (let x = (MCX | 0) - rr; x <= (MCX | 0) + rr && n < 2; x++) if (canPlace('casa', x, y)) { S.buildings.push({ id: S.nextId++, t: 'casa', x, y, lvl: 1, stock: 0, end: 0 }); n++; } if (n) setTimeout(() => toast('🏠 Il presidio cresce: 2 Domus regalate ai tuoi coloni'), 1200); }
  refreshTargets(false);
  questMigrate(); MODE = 'village'; SC = buildVillage(); prefetchEra(); centerCam(MCX, MCX); cam.z = VW < 600 ? 1.05 : Math.max(0.7, Math.min(1.25, VW / 900));
  $('#hud').classList.remove('hidden'); $('#rotbar').classList.remove('hidden'); updateHUD();
  if (fresh && !S.creative && !S.sandbox) tutStart();
}

// ---------- main loop ----------
let lastT = performance.now(), hudT = 0;
function frame(t) {
  if (QQ().fps < 60 && t - lastT < 30) { requestAnimationFrame(frame); return; }
  const dt = Math.min(0.1, (t - lastT) / 1000); lastT = t;
  if (!S && MODE === 'visit' && SC) { rotTick(dt); updateScene(SC, dt); }
  if (S && MODE !== 'title') {
    economy(dt);
    rotTick(dt); if (MODE === 'village' && S) { faunaTick(dt); campaignTick(dt); lifeTick(dt); }
    if (SC) updateScene(SC, dt);
    if (MODE === 'attack' || MODE === 'raid') battleTick(dt);
    hudT -= dt; if (hudT <= 0 && MODE === 'village') { hudT = 0.5; updateHUD(); if ($('#sheet').dataset.p && $('#sheet').dataset.p.startsWith('b:')) { const r = S.buildings.find(b => b.id === +$('#sheet').dataset.p.slice(2)); if (r && r.end) openBuildingInfo(r); } }
    saveT -= dt; if (saveT <= 0) { saveT = 5; save(); }
    if (MODE === 'village' && S.creative) { S.nightIn = 600; for (const r of RES) if (r !== 'favore') S.res[r] = caps()[r]; }
    if (MODE === 'village' && !S.creative) S.nightIn = Math.max(0, (S.nightIn == null ? 600 : S.nightIn) - dt);
    if (MODE === 'village' && !placing) { S.natIn = (S.natIn == null ? 240 : S.natIn) - dt; if (S.natIn <= 0) { S.natIn = 240; if (S.buildings.filter(b => b.nat).length < 80 && spawnNature(1)) { const sel = SC.sel && SC.sel.ref; SC = buildVillage(); if (sel) SC.sel = SC.B.find(b => b.ref === sel) || null; } } }
    if (MODE === 'village' && S.nightIn <= 0 && $('#sheet').classList.contains('hidden') && !placing) {
      S.nightIn = DF().night * seasonRaidMul() * (S.mastio <= 4 ? 1.4 : 1); { const rv = realms().filter(r => Math.abs(r.lvl - S.mastio) <= 2); const who = rv.length && Math.random() < 0.5 ? rv[(Math.random() * rv.length) | 0] : null; toast(who ? `🌙 Cala la notte: i predoni di ${who.user} ${who.ic} attaccano!` : '🌙 Cala la notte. Le trombe della torre…'); } setTimeout(() => { if (MODE === 'village') startRaid(); }, 2500);
    }
  }
  if (SC) { render(SC, dt); updateWxWidget(); memoTick(dt); tutTick(); } else { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#1c150e'; ctx.fillRect(0, 0, cv.width, cv.height); }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { if (document.hidden && S) { save(); cloudPush(true); } });
window.addEventListener('pagehide', () => { if (S) { save(); cloudPush(true); } });
setInterval(() => { if (CLOUD.pend && S) cloudPush(true); }, 21000);
cloudInit(); try { if (!window.claude && navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
applyTheme(); resize(); treeSprites(); updateSndBtn(); buildFaunaSprites();
g3init(); ATL.src = ATLAS_SRC; RATL.src = RATLAS_SRC; BATL.src = BATLAS_SRC; EATL.src = EATLAS_SRC;
// title backdrop: show an enemy-ish village behind title
function titleScene() { const tg = { d: 7, seed: 777, name: '', where: '' }; SC = genEnemy(tg); SC.U = []; SC.mode = 'title'; centerCam(MCX, MCX); cam.z = Math.max(0.7, Math.min(1.2, VW / 1000)); cam.y += VH * 0.3 / cam.z; }
titleScene();
showTitle(); if (!SET.storySeen) storyPreload(PROLOGO); setTimeout(prologueMaybe, 400);
requestAnimationFrame(frame);

