#!/usr/bin/env python3
# Texture del terreno di IMPERIUM (accampamento romano in Pannonia): erba rada color oliva, terra calpestata con ghiaia,
# vie lastricate di basoli. Riscrive le voci grass/dirt/path di TEX_SRC in src/data.js.   Uso: python3 src/tools/terreno.py [--preview cartella]
import sys, os, io, json, base64, math
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'roman3d'))
from kit import tnoise

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
N = 512

def clip(a): return np.clip(a, 0, 255).astype(np.uint8)

def voronoi(n, cnt, seed):
    """celle di Voronoi ripetibili: (distanza al bordo, indice cella)"""
    r = np.random.default_rng(seed); pts = r.random((cnt, 2)) * n
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    best = np.full((n, n), 1e9, np.float32); sec = best.copy(); idx = np.zeros((n, n), np.int32)
    for i, (px, py) in enumerate(pts):
        for ox in (-n, 0, n):
            for oy in (-n, 0, n):
                if abs(px + ox - n / 2) > n * 0.85 or abs(py + oy - n / 2) > n * 0.85: continue
                d = np.hypot(x - px - ox, y - py - oy)
                m = d < best; sec = np.where(m, best, np.minimum(sec, d)); best = np.where(m, d, best); idx = np.where(m, i, idx)
    return sec - best, idx

def grass():
    n1 = tnoise(N, 4, 11, 4); n2 = tnoise(N, 24, 12, 3); n3 = tnoise(N, 64, 13, 2); n4 = tnoise(N, 8, 14, 3)
    base = np.array([100, 124, 58.0]); dry = np.array([150, 138, 82.0]); soil = np.array([118, 98, 66.0])
    a = base * (1 - n1[..., None] * 0.0)
    t = np.clip((n1 - 0.42) * 2.2, 0, 1)[..., None]; a = a * (1 - t * 0.55) + dry * t * 0.55
    s = np.clip((n4 - 0.62) * 5, 0, 1)[..., None] * 0.55; a = a * (1 - s) + soil * s
    a *= (0.86 + 0.22 * n2)[..., None]; a *= (0.9 + 0.16 * n3)[..., None]
    # fili d'erba: trattini chiari e scuri
    r = np.random.default_rng(15)
    blades = np.zeros((N, N)); xs = r.integers(0, N, 9000); ys = r.integers(0, N, 9000); ln = r.integers(2, 6, 9000)
    for x, y, l, v in zip(xs, ys, ln, r.choice([-1, 1], 9000)):
        for k in range(l): blades[(y - k) % N, (x + (k // 3)) % N] += v
    a *= (1 + np.clip(blades, -2, 2) * 0.06)[..., None]
    return clip(a)

def dirt():
    n1 = tnoise(N, 4, 21, 4); n2 = tnoise(N, 32, 22, 3); n3 = tnoise(N, 12, 23, 3)
    a = np.array([138, 116, 84.0]) * (0.82 + 0.3 * n1)[..., None] * (0.92 + 0.12 * n2)[..., None]
    # ghiaia: sassolini con ombra
    r = np.random.default_rng(24); img = Image.fromarray(clip(a)); px = img.load()
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    for _ in range(1400):
        x, y = r.integers(0, N, 2); s = r.integers(1, 4); g = int(r.integers(120, 190))
        col = (g, int(g * 0.94), int(g * 0.84))
        for ox in (-N, 0, N):
            for oy in (-N, 0, N):
                d.ellipse([x + ox - s + 1, y + oy - s + 2, x + ox + s + 1, y + oy + s + 2], fill=(84, 70, 52))
                d.ellipse([x + ox - s, y + oy - s, x + ox + s, y + oy + s], fill=col)
    a = np.asarray(img, float)
    # impronte e solchi leggeri
    a *= (0.94 + 0.1 * np.clip((n3 - 0.5) * 3, -1, 1) * 0.5 + 0.03)[..., None]
    return clip(a)

def path():
    """basoli: grandi lastre poligonali di pietra grigia con giunti scuri"""
    e, idx = voronoi(N, 70, 31); n1 = tnoise(N, 8, 32, 3); n2 = tnoise(N, 48, 33, 2)
    r = np.random.default_rng(34); tint = r.uniform(0.8, 1.12, 70)[idx]; warm = r.uniform(-1, 1, 70)[idx]
    base = np.array([128, 126, 120.0])
    a = base[None, None, :] * tint[..., None]
    a[..., 0] += warm * 8; a[..., 2] -= warm * 6
    a *= (0.88 + 0.2 * n1)[..., None] * (0.93 + 0.12 * n2)[..., None]
    # bordo smussato chiaro e giunto scuro
    bev = np.clip(e / 6, 0, 1); a *= (0.62 + 0.38 * bev)[..., None]
    a[e < 2.2] = np.array([70, 62, 50.0]) * (0.9 + 0.2 * n1[e < 2.2])[..., None]
    hl = (e > 2.2) & (e < 4.5); a[hl] *= 1.06
    return clip(a)

def enc(arr, q=82):
    b = io.BytesIO(); Image.fromarray(arr).save(b, 'WEBP', quality=q, method=6); return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()

def main():
    pv = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None
    tex = {'grass': grass(), 'dirt': dirt(), 'path': path()}
    if pv:
        os.makedirs(pv, exist_ok=True)
        for k, v in tex.items(): Image.fromarray(np.tile(v, (2, 2, 1))).resize((512, 512)).save(os.path.join(pv, f'terr_{k}.png'))
    p = os.path.join(REPO, 'src', 'data.js'); lines = open(p).read().split('\n')
    for i, l in enumerate(lines):
        if l.startswith('const TEX_SRC='):
            d = json.loads(l[len('const TEX_SRC='):].rstrip(';'))
            for k, v in tex.items(): d[k] = enc(v)
            lines[i] = 'const TEX_SRC=' + json.dumps(d) + ';'
    open(p, 'w').write('\n'.join(lines)); print('TEX_SRC aggiornato:', ', '.join(tex))

if __name__ == '__main__': main()
