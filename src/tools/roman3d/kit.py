#!/usr/bin/env python3
# Kit per costruire a mano i modelli 3D romani di IMPERIUM (stesso formato M3D di glb2m3d.py).
# Geometria: quadrilateri, scatole, cilindri, tetti. Texture: atlante 8x8 di materiali dipinti con numpy.
import math, io, base64, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

CELL = 128; GRID = 8; ATL = CELL * GRID
rng = np.random.default_rng(7)

# ---------------------------------------------------------------- rumore ripetibile
def tnoise(n, cells, seed, oct=3):
    """rumore liscio che si ripete senza giunture, valori 0..1, forma (n,n)"""
    r = np.random.default_rng(seed); out = np.zeros((n, n)); amp = 1; tot = 0
    for o in range(oct):
        c = cells * (2 ** o); g = r.random((c, c))
        big = np.tile(g, (3, 3)); im = Image.fromarray((big * 255).astype(np.uint8)).resize((n * 3, n * 3), Image.BICUBIC)
        a = np.asarray(im, dtype=np.float64)[n:2 * n, n:2 * n] / 255
        out += a * amp; tot += amp; amp *= 0.5
    return out / tot

def col(c, n=CELL):
    a = np.zeros((n, n, 3)); a[:] = c; return a

def shade(a, f):
    return a * f[..., None]

def clip(a):
    return np.clip(a, 0, 255).astype(np.uint8)

# ---------------------------------------------------------------- materiali
def m_plaster(base, seed, stain=0.10):
    n1 = tnoise(CELL, 4, seed); n2 = tnoise(CELL, 16, seed + 1, 2)
    a = col(base); a = shade(a, 1 - stain + stain * 2 * n1 * 0.9 + (n2 - 0.5) * 0.06)
    return a

def m_roof(seed):
    a = col((156, 70, 46)); n = tnoise(CELL, 8, seed)
    y, x = np.mgrid[0:CELL, 0:CELL]
    cw, rh = 16, 16
    ci = x // cw; ri = y // rh; fx = (x % cw) / cw; fy = (y % rh) / rh
    r = np.random.default_rng(seed); tint = r.uniform(0.74, 1.14, (CELL // rh, CELL // cw))
    t = tint[ri, ci]
    ridge = 0.72 + 0.42 * np.sin(fx * math.pi)            # coppi tondi
    lap = np.where(fy > 0.82, 0.62, 1.0) * (0.9 + 0.12 * fy)  # ombra del corso sopra
    a = shade(a, t * ridge * lap * (0.9 + 0.2 * n))
    a[..., 1] *= 0.95
    return a

def m_ashlar(base, seed, bw=32, bh=16, mortar=(120, 112, 100)):
    a = col(base); n = tnoise(CELL, 8, seed); n2 = tnoise(CELL, 32, seed + 3, 2)
    y, x = np.mgrid[0:CELL, 0:CELL]; row = y // bh; xs = (x + (row % 2) * (bw // 2)) % CELL
    bi = xs // bw; r = np.random.default_rng(seed); tint = r.uniform(0.85, 1.1, (CELL // bh + 1, CELL // bw + 1))
    a = shade(a, tint[row, bi] * (0.88 + 0.22 * n) * (0.96 + 0.08 * n2))
    jx = (xs % bw) < 2; jy = (y % bh) < 2
    a[jx | jy] = mortar
    # bordo chiaro sopra ogni blocco
    a[((y % bh) == 2)] *= 1.08
    return a

def m_brick(seed):
    return m_ashlar((168, 82, 56), seed, 32, 8, (150, 130, 110))

def m_rubble(base, seed):
    a = col(base); n = tnoise(CELL, 6, seed)
    y, x = np.mgrid[0:CELL, 0:CELL]; r = np.random.default_rng(seed)
    pts = r.random((40, 2)) * CELL; best = np.full((CELL, CELL), 1e9); sec = np.full((CELL, CELL), 1e9); idx = np.zeros((CELL, CELL), int)
    for i, (px, py) in enumerate(pts):
        for ox in (-CELL, 0, CELL):
            for oy in (-CELL, 0, CELL):
                d = np.hypot(x - px - ox, y - py - oy)
                m = d < best; sec = np.where(m, best, np.minimum(sec, d)); best = np.where(m, d, best); idx = np.where(m, i, idx)
    tint = r.uniform(0.78, 1.12, 40)[idx]
    edge = np.clip((sec - best) / 4, 0, 1)
    a = shade(a, tint * (0.85 + 0.25 * n) * (0.55 + 0.45 * edge))
    return a

def m_marble(seed, base=(214, 208, 192)):
    n = tnoise(CELL, 3, seed, 4); a = col(base)
    v = np.abs(np.sin((n * 9) * math.pi)); a = shade(a, 0.93 + 0.07 * v)
    return a

def m_flutes(seed):
    a = m_marble(seed); y, x = np.mgrid[0:CELL, 0:CELL]
    f = 0.78 + 0.3 * np.abs(np.sin(x / CELL * math.pi * 12)); return shade(a, f)

def m_wood(base, seed, vertical=False, ph=16):
    n = tnoise(CELL, 4, seed); y, x = np.mgrid[0:CELL, 0:CELL]
    if vertical: x, y = y, x
    r = np.random.default_rng(seed); pl = y // ph; tint = r.uniform(0.8, 1.12, CELL // ph + 1)[pl]
    grain = 0.9 + 0.12 * np.sin((x / CELL * 6 + n * 5 + pl * 1.7) * math.pi * 2)
    a = shade(col(base), tint * grain * (0.9 + 0.15 * n))
    a[(y % ph) < 2] *= 0.45
    return a

def m_logs(seed):
    n = tnoise(CELL, 4, seed); y, x = np.mgrid[0:CELL, 0:CELL]; lw = 16
    fx = (x % lw) / lw; r = np.random.default_rng(seed); tint = r.uniform(0.82, 1.1, CELL // lw)[x // lw]
    a = shade(col((128, 92, 58)), tint * (0.55 + 0.55 * np.sin(fx * math.pi)) * (0.85 + 0.25 * n))
    return a

def m_thatch(seed):
    n = tnoise(CELL, 16, seed, 2); n2 = tnoise(CELL, 4, seed + 1)
    y, x = np.mgrid[0:CELL, 0:CELL]; s = 0.8 + 0.3 * np.abs(np.sin(x * 0.9 + n * 20))
    return shade(col((178, 148, 86)), s * (0.85 + 0.25 * n2))

def m_solid(c, seed, var=0.12, cells=6):
    n = tnoise(CELL, cells, seed); return shade(col(c), 1 - var + 2 * var * n)

def m_metal(c, seed):
    n = tnoise(CELL, 3, seed); y, x = np.mgrid[0:CELL, 0:CELL]
    return shade(col(c), 0.8 + 0.35 * n + 0.15 * np.sin(y / CELL * math.pi))

def m_stripes(c1, c2, seed, w=16):
    y, x = np.mgrid[0:CELL, 0:CELL]; a = np.where(((x // w) % 2 == 0)[..., None], np.array(c1, float), np.array(c2, float))
    n = tnoise(CELL, 6, seed); return shade(a, 0.9 + 0.15 * n)

def m_paving(seed):
    a = m_ashlar((168, 162, 150), seed, 64, 32, (110, 104, 96)); return a

def m_field(seed):
    n = tnoise(CELL, 8, seed); y, x = np.mgrid[0:CELL, 0:CELL]
    rows = 0.7 + 0.35 * np.abs(np.sin(x / CELL * math.pi * 8))
    a = np.where((np.sin(x / CELL * math.pi * 8) > 0)[..., None], np.array((120, 140, 60), float), np.array((105, 84, 54), float))
    return shade(a, rows * (0.85 + 0.25 * n))

def m_grass(seed):
    n = tnoise(CELL, 8, seed); n2 = tnoise(CELL, 32, seed + 5, 2)
    return shade(col((88, 122, 52)), 0.8 + 0.25 * n + 0.12 * n2)

def m_water(seed):
    n = tnoise(CELL, 4, seed); return shade(col((70, 120, 150)), 0.85 + 0.3 * n)

# ---- materiali "unici" (mappati una volta su tutta la faccia)
def img2a(im): return np.asarray(im.convert('RGB'), dtype=np.float64)

def m_door(seed, arch=False):
    a = m_wood((92, 58, 34), seed, vertical=True, ph=21)
    im = Image.fromarray(clip(a)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, CELL - 1, CELL - 1], outline=(52, 34, 20), width=10)
    d.line([(CELL // 2, 0), (CELL // 2, CELL)], fill=(48, 30, 18), width=4)
    for yy in (34, 94):
        for xx in (22, 50, 78, 106): d.ellipse([xx - 3, yy - 3, xx + 3, yy + 3], fill=(170, 140, 80))
    d.ellipse([CELL // 2 - 14, 60, CELL // 2 - 4, 70], outline=(190, 160, 90), width=2); d.ellipse([CELL // 2 + 4, 60, CELL // 2 + 14, 70], outline=(190, 160, 90), width=2)
    if arch:
        d.rectangle([0, 0, CELL, 26], fill=(40, 26, 16))
    return img2a(im)

def m_window(seed):
    im = Image.new('RGB', (CELL, CELL), (36, 26, 20)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, CELL - 1, CELL - 1], outline=(214, 204, 180), width=14)
    for xx in (48, 80): d.line([(xx, 14), (xx, CELL - 14)], fill=(70, 60, 50), width=6)
    d.rectangle([0, CELL - 18, CELL, CELL], fill=(200, 190, 168))
    return img2a(im)

def m_vexillum(seed):
    im = Image.new('RGB', (CELL, CELL), (150, 22, 26)); d = ImageDraw.Draw(im)
    n = tnoise(CELL, 6, seed); a = img2a(im) * (0.85 + 0.25 * n[..., None]); im = Image.fromarray(clip(a)); d = ImageDraw.Draw(im)
    d.rectangle([4, 4, CELL - 5, CELL - 5], outline=(220, 176, 60), width=6)
    # aquila stilizzata
    cx, cy = CELL // 2, 58
    d.polygon([(cx, cy - 24), (cx - 34, cy - 30), (cx - 20, cy - 6), (cx - 8, cy), (cx - 10, cy + 22), (cx, cy + 30), (cx + 10, cy + 22), (cx + 8, cy), (cx + 20, cy - 6), (cx + 34, cy - 30)], fill=(228, 186, 70))
    d.ellipse([cx - 7, cy - 34, cx + 7, cy - 20], fill=(228, 186, 70))
    for xx in range(10, CELL - 8, 12): d.line([(xx, CELL - 14), (xx, CELL - 2)], fill=(220, 176, 60), width=4)
    return img2a(im)

def m_scutum(seed):
    im = Image.new('RGB', (CELL, CELL), (160, 28, 30)); d = ImageDraw.Draw(im)
    d.rectangle([3, 3, CELL - 4, CELL - 4], outline=(214, 172, 62), width=7)
    d.ellipse([CELL // 2 - 16, CELL // 2 - 16, CELL // 2 + 16, CELL // 2 + 16], fill=(196, 160, 72), outline=(120, 90, 40), width=3)
    for s in (-1, 1):
        d.line([(CELL // 2 + s * 18, CELL // 2), (CELL // 2 + s * 52, CELL // 2 - 40)], fill=(214, 172, 62), width=6)
        d.line([(CELL // 2 + s * 18, CELL // 2), (CELL // 2 + s * 52, CELL // 2 + 40)], fill=(214, 172, 62), width=6)
    return img2a(im)

def m_target(seed):
    a = m_thatch(seed); im = Image.fromarray(clip(a)); d = ImageDraw.Draw(im); c = CELL // 2
    for r, f in ((58, (200, 190, 160)), (44, (170, 30, 30)), (30, (220, 210, 180)), (16, (170, 30, 30))): d.ellipse([c - r, c - r, c + r, c + r], fill=f)
    return img2a(im)

def m_inscription(seed):
    a = m_marble(seed); im = Image.fromarray(clip(a)); d = ImageDraw.Draw(im)
    r = np.random.default_rng(seed)
    for yy in (40, 76):
        x = 10
        while x < CELL - 14:
            w = int(r.integers(5, 10)); d.rectangle([x, yy, x + w, yy + 16], fill=(120, 96, 60)); x += w + int(r.integers(3, 6))
            if r.random() < 0.15: x += 8
    d.rectangle([0, 0, CELL - 1, CELL - 1], outline=(190, 184, 170), width=6)
    return img2a(im)

def m_fresco(seed):
    """intonaco a fasce: zoccolo rosso pompeiano, fascia nera, parete ocra chiara"""
    a = m_plaster((222, 196, 150), seed); y, x = np.mgrid[0:CELL, 0:CELL]
    a[y > 92] = m_plaster((146, 44, 34), seed + 2)[y > 92]
    a[(y > 86) & (y <= 92)] = (40, 30, 24)
    return a

def m_shop(seed):
    """bottega aperta: buio interno, banco di muratura e anfore"""
    im = Image.new('RGB', (CELL, CELL), (34, 24, 18)); d = ImageDraw.Draw(im)
    d.rectangle([0, 78, CELL, CELL], fill=(190, 170, 140)); d.rectangle([0, 78, CELL, 84], fill=(150, 130, 105))
    for xx in (18, 44, 70, 96):
        d.ellipse([xx - 9, 40, xx + 9, 76], fill=(170, 92, 52)); d.rectangle([xx - 3, 32, xx + 3, 44], fill=(150, 80, 45))
    d.rectangle([0, 0, CELL - 1, CELL - 1], outline=(90, 60, 36), width=6)
    return img2a(im)

def m_hay(seed): return m_thatch(seed + 30) * np.array([1.06, 1.04, 0.8])


# ---- arcate dell'anfiteatro: una campata per cella, con semicolonne sui bordi che si uniscono alla campata vicina
TRAV = (204, 188, 156)
def m_arcade(seed, order=0, statue=False):
    a = m_ashlar(TRAV, seed, 32, 16, (170, 154, 124)); im = Image.fromarray(clip(a)); d = ImageDraw.Draw(im)
    W = CELL; top = 22; bot = CELL - (6 if order == 0 else 18)
    # trabeazione e (dai piani alti) zoccolo con balaustra
    d.rectangle([0, 0, W, top - 6], fill=(214, 200, 170)); d.rectangle([0, top - 6, W, top - 2], fill=(150, 134, 104)); d.rectangle([0, 3, W, 5], fill=(176, 160, 128))
    if order: d.rectangle([0, bot, W, CELL], fill=(196, 180, 148)); d.rectangle([0, bot, W, bot + 3], fill=(150, 134, 104))
    # vano dell'arco: buio con un accenno di volta
    ax0, ax1 = 30, 98; ay = 56; r = (ax1 - ax0) // 2
    d.rectangle([ax0, ay, ax1, bot], fill=(44, 34, 26)); d.pieslice([ax0, ay - r, ax1, ay + r], 180, 360, fill=(44, 34, 26))
    d.arc([ax0 - 4, ay - r - 4, ax1 + 4, ay + r + 4], 180, 360, fill=(160, 144, 114), width=5)
    d.rectangle([ax0 + 6, ay + 4, ax1 - 6, ay + 14], fill=(62, 50, 40))
    if statue:
        cx = (ax0 + ax1) // 2; d.ellipse([cx - 5, ay - 12, cx + 5, ay - 2], fill=(226, 220, 204)); d.polygon([(cx - 9, ay), (cx + 9, ay), (cx + 7, bot - 4), (cx - 7, bot - 4)], fill=(222, 214, 196))
        d.rectangle([cx - 11, bot - 6, cx + 11, bot], fill=(190, 176, 146))
    # semicolonne (metà a sinistra e metà a destra della cella)
    for x0, x1 in ((0, 12), (W - 12, W)):
        d.rectangle([x0, top - 2, x1, bot], fill=(222, 208, 178))
        sh = (x0 == 0); d.rectangle([x1 - 4 if sh else x0, top - 2, x1 if sh else x0 + 4, bot], fill=(176, 160, 128))
        cap = [(top - 2, top + 6)]
        col = (232, 220, 192) if order < 2 else (238, 226, 196)
        d.rectangle([x0, top - 2, x1, top + 6], fill=col)
        if order == 1:
            for vx in ((x1 - 3) if x0 == 0 else (x0 + 3),): d.ellipse([vx - 3, top - 1, vx + 3, top + 5], outline=(150, 134, 104), width=2)
        if order == 2:
            for yy in (top + 2, top + 7): d.line([(x0, yy), (x1, yy)], fill=(160, 150, 110), width=2)
    return img2a(im)

def m_attic(seed, window=True):
    a = m_ashlar(TRAV, seed, 32, 16, (170, 154, 124)); im = Image.fromarray(clip(a)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, CELL, 14], fill=(214, 200, 170)); d.rectangle([0, 14, CELL, 18], fill=(150, 134, 104))
    for x in range(8, CELL, 22): d.rectangle([x, 18, x + 6, 26], fill=(176, 160, 128))   # mensole per le antenne del velario
    for x0, x1 in ((0, 8), (CELL - 8, CELL)): d.rectangle([x0, 18, x1, CELL - 10], fill=(222, 208, 178))
    if window: d.rectangle([52, 56, 76, 82], fill=(44, 34, 26)); d.rectangle([48, 52, 80, 56], fill=(176, 160, 128))
    d.rectangle([0, CELL - 10, CELL, CELL], fill=(190, 174, 142))
    return img2a(im)

def m_sand(seed):
    n = tnoise(CELL, 6, seed); n2 = tnoise(CELL, 32, seed + 1, 2); y, x = np.mgrid[0:CELL, 0:CELL]
    a = shade(col((188, 160, 112)), 0.86 + 0.2 * n + 0.08 * n2)
    return a

def m_seats(seed):
    """gradoni visti dall'alto: lastre di travertino con giunti"""
    return m_ashlar((198, 186, 160), seed, 64, 128, (150, 138, 116))

MATS = {}
def defmat(name, arr, rep=(1.0, 1.0), once=False):
    MATS[name] = dict(i=len(MATS), arr=arr, rep=rep, once=once)

def build_materials():
    MATS.clear()
    defmat('plaster', m_plaster((226, 208, 172), 1), (1.2, 1.2))
    defmat('plaster_w', m_plaster((236, 230, 214), 2), (1.2, 1.2))
    defmat('plaster_o', m_plaster((214, 164, 98), 3), (1.2, 1.2))
    defmat('plaster_r', m_plaster((150, 46, 36), 4), (1.2, 1.2))
    defmat('fresco', m_fresco(5), (1.0, 1.0))
    defmat('roof', m_roof(6), (0.36, 0.36))
    defmat('stone', m_ashlar((196, 186, 164), 7), (0.7, 0.7))
    defmat('stone_d', m_ashlar((150, 144, 132), 8, 32, 16, (100, 94, 86)), (0.7, 0.7))
    defmat('stone_big', m_ashlar((182, 172, 152), 9, 64, 32, (110, 102, 92)), (1.2, 1.2))
    defmat('rubble', m_rubble((170, 160, 140), 10), (0.8, 0.8))
    defmat('brick', m_brick(11), (0.6, 0.6))
    defmat('marble', m_marble(12), (1.5, 1.5))
    defmat('flutes', m_flutes(13), (1.0, 1.0), once=True)
    defmat('wood', m_wood((132, 90, 54), 14), (0.9, 0.9))
    defmat('wood_v', m_wood((124, 86, 52), 15, vertical=True), (0.9, 0.9))
    defmat('wood_d', m_wood((84, 56, 34), 16), (0.9, 0.9))
    defmat('logs', m_logs(17), (0.6, 0.6))
    defmat('thatch', m_thatch(18), (0.8, 0.8))
    defmat('door', m_door(19), once=True)
    defmat('window', m_window(20), once=True)
    defmat('vexillum', m_vexillum(21), once=True)
    defmat('scutum', m_scutum(22), once=True)
    defmat('target', m_target(23), once=True)
    defmat('inscr', m_inscription(24), once=True)
    defmat('shop', m_shop(25), once=True)
    defmat('awning', m_stripes((176, 34, 32), (226, 210, 170), 26), (0.6, 0.6))
    defmat('red', m_solid((158, 28, 28), 27), (1, 1))
    defmat('gold', m_metal((218, 172, 62), 28), (1, 1))
    defmat('bronze', m_metal((150, 104, 50), 29), (1, 1))
    defmat('iron', m_metal((76, 78, 84), 30), (1, 1))
    defmat('dark', m_solid((30, 22, 18), 31, 0.05), (1, 1))
    defmat('dirt', m_solid((124, 98, 68), 32, 0.15), (1.5, 1.5))
    defmat('grass', m_grass(33), (1.5, 1.5))
    defmat('field', m_field(34), (1.2, 1.2))
    defmat('water', m_water(35), (1.5, 1.5))
    defmat('paving', m_paving(36), (1.4, 1.4))
    defmat('rock', m_rubble((128, 124, 118), 37), (1.6, 1.6))
    defmat('terra', m_solid((176, 92, 52), 38, 0.1), (1, 1))
    defmat('hay', m_hay(39), (0.7, 0.7))
    defmat('cloth', m_solid((214, 200, 168), 40, 0.1), (1, 1))
    defmat('leather', m_solid((120, 80, 46), 41, 0.12), (1, 1))
    defmat('fire', m_solid((240, 150, 40), 42, 0.25), (1, 1))
    defmat('purple', m_solid((96, 30, 70), 43), (1, 1))
    defmat('mosaic', m_ashlar((210, 200, 180), 44, 8, 8, (60, 50, 44)), (0.6, 0.6))
    defmat('ochre_d', m_plaster((176, 120, 64), 45), (1.2, 1.2))
    defmat('green', m_solid((70, 104, 46), 46, 0.2), (1, 1))
    defmat('hedge', m_grass(47) * 0.8, (0.8, 0.8))
    defmat('arc1', m_arcade(48, 0), once=True)
    defmat('arc2', m_arcade(49, 1, True), once=True)
    defmat('arc3', m_arcade(50, 2, True), once=True)
    defmat('attic_w', m_attic(51, True), once=True)
    defmat('attic_p', m_attic(52, False), once=True)
    defmat('sand', m_sand(53), (1.5, 1.5))
    defmat('seats', m_seats(54), (0.6, 0.6))
    defmat('trav', m_ashlar((204, 188, 156), 55, 32, 16, (170, 154, 124)), (0.7, 0.7))

def atlas():
    a = np.zeros((ATL, ATL, 3))
    for m in MATS.values():
        i = m['i']; gx, gy = i % GRID, i // GRID
        a[gy * CELL:(gy + 1) * CELL, gx * CELL:(gx + 1) * CELL] = m['arr']
    return Image.fromarray(clip(a))

def cell_uv(mat, u, v):
    """u,v in 0..1 dentro la cella -> coordinate atlante (rientro di 1.5px contro le sbavature)"""
    i = MATS[mat]['i']; gx, gy = i % GRID, i // GRID; e = 1.5 / CELL
    u = e + np.clip(u, 0, 1) * (1 - 2 * e); v = e + np.clip(v, 0, 1) * (1 - 2 * e)
    return ((gx + u) / GRID, (gy + v) / GRID)

# ---------------------------------------------------------------- geometria
V = lambda *a: np.array(a, dtype=np.float64)

class Mesh:
    def __init__(s): s.P = []; s.N = []; s.U = []; s.T = []

    def _tri(s, p, uv, n):
        b = len(s.P)
        for k in range(3): s.P.append(p[k]); s.N.append(n); s.U.append(uv[k])
        s.T.append((b, b + 1, b + 2))

    def quad(s, p0, p1, p2, p3, mat, out=None, rep=None, flip_u=False):
        """p0-p1 lato basso, p3 sopra p0. 'out': un punto verso cui la faccia guarda (o il suo opposto se negativo)"""
        p0, p1, p2, p3 = map(lambda q: np.asarray(q, float), (p0, p1, p2, p3))
        n = np.cross(p1 - p0, p3 - p0); ln = np.linalg.norm(n)
        if ln < 1e-12: n = np.cross(p2 - p1, p3 - p1); ln = np.linalg.norm(n)
        if ln < 1e-12: return
        n = n / ln
        if out is not None and np.dot(n, np.asarray(out, float) - (p0 + p2) / 2) < 0: n = -n
        M = MATS[mat]
        if M['once']:
            s._quad_cell(p0, p1, p2, p3, mat, n, 0, 1, 0, 1, flip_u); return
        ru, rv = rep or M['rep']
        W = max(np.linalg.norm(p1 - p0), np.linalg.norm(p2 - p3)); H = max(np.linalg.norm(p3 - p0), np.linalg.norm(p2 - p1))
        nu = max(1, int(math.ceil(W / ru - 1e-6))); nv = max(1, int(math.ceil(H / rv - 1e-6)))
        for i in range(nu):
            a0, a1 = i / nu, (i + 1) / nu
            for j in range(nv):
                b0, b1 = j / nv, (j + 1) / nv
                q = lambda a, b: (p0 * (1 - a) + p1 * a) * (1 - b) + (p3 * (1 - a) + p2 * a) * b
                uw0 = 0; uw1 = min(1, W / nu / ru) ; vw0 = 0; vw1 = min(1, H / nv / rv)
                s._quad_cell(q(a0, b0), q(a1, b0), q(a1, b1), q(a0, b1), mat, n, uw0, uw1, vw0, vw1, flip_u)

    def _quad_cell(s, p0, p1, p2, p3, mat, n, u0, u1, v0, v1, flip_u):
        if flip_u: u0, u1 = u1, u0
        uv = lambda u, v: cell_uv(mat, u, v)
        # v dell'immagine cresce verso il basso: p0/p1 in basso -> v1
        A, B, C, D = uv(u0, v1), uv(u1, v1), uv(u1, v0), uv(u0, v0)
        s._tri([p0, p1, p2], [A, B, C], n); s._tri([p0, p2, p3], [A, C, D], n)

    def tri(s, p0, p1, p2, mat, out=None, uvs=((0, 1), (1, 1), (0.5, 0))):
        p0, p1, p2 = map(lambda q: np.asarray(q, float), (p0, p1, p2))
        n = np.cross(p1 - p0, p2 - p0); ln = np.linalg.norm(n)
        if ln < 1e-12: return
        n = n / ln
        if out is not None and np.dot(n, np.asarray(out, float) - (p0 + p1 + p2) / 3) < 0: n = -n
        M = MATS[mat]
        if not M['once']:
            # scala la texture sulla dimensione reale del triangolo
            ru, rv = M['rep']; W = np.linalg.norm(p1 - p0); H = np.linalg.norm(p2 - (p0 + p1) / 2)
            fu, fv = min(1, W / ru), min(1, H / rv)
            uvs = [(u * fu, 1 - (1 - v) * fv) for u, v in uvs]
        s._tri([p0, p1, p2], [cell_uv(mat, u, v) for u, v in uvs], n)

    def box(s, x0, y0, z0, x1, y1, z1, mat, top=None, bottom=False, sides=None, skip=()):
        """scatola allineata agli assi. sides: dict con 'f','b','l','r' (fronte=+z) per materiali diversi"""
        c = V((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); sd = sides or {}
        g = lambda k: sd.get(k, mat)
        if 'f' not in skip: s.quad((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1), g('f'), out=c * 0 + (c[0], c[1], z1 + 1))
        if 'b' not in skip: s.quad((x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0), g('b'), out=(c[0], c[1], z0 - 1))
        if 'l' not in skip: s.quad((x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0), g('l'), out=(x0 - 1, c[1], c[2]))
        if 'r' not in skip: s.quad((x1, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1), g('r'), out=(x1 + 1, c[1], c[2]))
        if 't' not in skip: s.quad((x0, y1, z1), (x1, y1, z1), (x1, y1, z0), (x0, y1, z0), top or mat, out=(c[0], y1 + 1, c[2]))
        if bottom: s.quad((x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1), mat, out=(c[0], y0 - 1, c[2]))

    def cyl(s, cx, cz, r, y0, y1, mat, seg=10, top=None, r1=None):
        r1 = r if r1 is None else r1; c = V(cx, (y0 + y1) / 2, cz)
        for i in range(seg):
            a0, a1 = 2 * math.pi * i / seg, 2 * math.pi * (i + 1) / seg
            p0 = (cx + r * math.cos(a0), y0, cz + r * math.sin(a0)); p1 = (cx + r * math.cos(a1), y0, cz + r * math.sin(a1))
            p2 = (cx + r1 * math.cos(a1), y1, cz + r1 * math.sin(a1)); p3 = (cx + r1 * math.cos(a0), y1, cz + r1 * math.sin(a0))
            am = (a0 + a1) / 2; o = (cx + 9 * math.cos(am), (y0 + y1) / 2, cz + 9 * math.sin(am))
            if MATS[mat]['once']:
                n = np.cross(np.subtract(p1, p0), np.subtract(p3, p0)); n = n / np.linalg.norm(n)
                if np.dot(n, np.subtract(o, p0)) < 0: n = -n
                s._quad_cell(*map(np.asarray, (p0, p1, p2, p3)), mat, n, i / seg, (i + 1) / seg, 0, 1, False)
            else: s.quad(p0, p1, p2, p3, mat, out=o)
        if top is not False:
            tm = top or mat
            for i in range(seg):
                a0, a1 = 2 * math.pi * i / seg, 2 * math.pi * (i + 1) / seg
                s.tri((cx, y1, cz), (cx + r1 * math.cos(a0), y1, cz + r1 * math.sin(a0)), (cx + r1 * math.cos(a1), y1, cz + r1 * math.sin(a1)), tm, out=(cx, y1 + 1, cz), uvs=((0.5, 0.5), (0.5 + 0.5 * math.cos(a0), 0.5 + 0.5 * math.sin(a0)), (0.5 + 0.5 * math.cos(a1), 0.5 + 0.5 * math.sin(a1))))

    def cone(s, cx, cz, r, y0, y1, mat, seg=10):
        for i in range(seg):
            a0, a1 = 2 * math.pi * i / seg, 2 * math.pi * (i + 1) / seg; am = (a0 + a1) / 2
            s.tri((cx + r * math.cos(a0), y0, cz + r * math.sin(a0)), (cx + r * math.cos(a1), y0, cz + r * math.sin(a1)), (cx, y1, cz), mat, out=(cx + 9 * math.cos(am), y0 + (y1 - y0) * 0.3, cz + 9 * math.sin(am)))

    def gable(s, x0, z0, x1, z1, y, h, mat='roof', end='plaster', over=0.12, axis='x', th=0.05):
        """tetto a capanna. axis='x': colmo lungo x, falde verso +z e -z, timpani sui lati x"""
        if axis == 'x':
            zm = (z0 + z1) / 2; X0, X1 = x0 - over, x1 + over; Z0, Z1 = z0 - over, z1 + over; dz = over * h / ((z1 - z0) / 2)
            Y = y - dz
            s.quad((X0, Y, Z1), (X1, Y, Z1), (X1, y + h, zm), (X0, y + h, zm), mat, out=(0, y + 9, z1 + 9))
            s.quad((X1, Y, Z0), (X0, Y, Z0), (X0, y + h, zm), (X1, y + h, zm), mat, out=(0, y + 9, z0 - 9))
            # spessore del bordo
            s.quad((X0, Y - th, Z1), (X1, Y - th, Z1), (X1, Y, Z1), (X0, Y, Z1), 'wood_d', out=(0, Y, z1 + 9))
            s.quad((X1, Y - th, Z0), (X0, Y - th, Z0), (X0, Y, Z0), (X1, Y, Z0), 'wood_d', out=(0, Y, z0 - 9))
            if end:
                s.tri((x0, y, z1), (x0, y, z0), (x0, y + h, zm), end, out=(x0 - 9, y, zm))
                s.tri((x1, y, z0), (x1, y, z1), (x1, y + h, zm), end, out=(x1 + 9, y, zm))
            # falde viste da sotto/fianco: chiusura del frontone sporgente
            s.tri((X0, Y, Z1), (X0, Y, Z0), (X0, y + h, zm), end or mat, out=(X0 - 9, y, zm))
            s.tri((X1, Y, Z0), (X1, Y, Z1), (X1, y + h, zm), end or mat, out=(X1 + 9, y, zm))
        else:
            xm = (x0 + x1) / 2; X0, X1 = x0 - over, x1 + over; Z0, Z1 = z0 - over, z1 + over; dx = over * h / ((x1 - x0) / 2)
            Y = y - dx
            s.quad((X1, Y, Z1), (X1, Y, Z0), (xm, y + h, Z0), (xm, y + h, Z1), mat, out=(x1 + 9, y + 9, 0))
            s.quad((X0, Y, Z0), (X0, Y, Z1), (xm, y + h, Z1), (xm, y + h, Z0), mat, out=(x0 - 9, y + 9, 0))
            s.quad((X1, Y - th, Z1), (X1, Y - th, Z0), (X1, Y, Z0), (X1, Y, Z1), 'wood_d', out=(x1 + 9, Y, 0))
            s.quad((X0, Y - th, Z0), (X0, Y - th, Z1), (X0, Y, Z1), (X0, Y, Z0), 'wood_d', out=(x0 - 9, Y, 0))
            if end:
                s.tri((x0, y, z1), (x1, y, z1), (xm, y + h, z1), end, out=(xm, y, z1 + 9))
                s.tri((x1, y, z0), (x0, y, z0), (xm, y + h, z0), end, out=(xm, y, z0 - 9))
            s.tri((X0, Y, Z1), (X1, Y, Z1), (xm, y + h, Z1), end or mat, out=(xm, y, Z1 + 9))
            s.tri((X1, Y, Z0), (X0, Y, Z0), (xm, y + h, Z0), end or mat, out=(xm, y, Z0 - 9))

    def hip(s, x0, z0, x1, z1, y, h, mat='roof', over=0.1):
        """tetto a padiglione (se quadrato è una piramide)"""
        X0, X1, Z0, Z1 = x0 - over, x1 + over, z0 - over, z1 + over; w, d = X1 - X0, Z1 - Z0
        if w >= d: r0 = (X0 + d / 2, X1 - d / 2); top = [(r0[0], (Z0 + Z1) / 2), (r0[1], (Z0 + Z1) / 2)]
        else: r0 = (Z0 + w / 2, Z1 - w / 2); top = [((X0 + X1) / 2, r0[0]), ((X0 + X1) / 2, r0[1])]
        yt = y + h; c = ((X0 + X1) / 2, y, (Z0 + Z1) / 2)
        if w >= d:
            a, b = top
            s.quad((X0, y, Z1), (X1, y, Z1), (b[0], yt, b[1]), (a[0], yt, a[1]), mat, out=(c[0], y + 9, Z1 + 9))
            s.quad((X1, y, Z0), (X0, y, Z0), (a[0], yt, a[1]), (b[0], yt, b[1]), mat, out=(c[0], y + 9, Z0 - 9))
            s.tri((X0, y, Z0), (X0, y, Z1), (a[0], yt, a[1]), mat, out=(X0 - 9, y + 9, c[2]))
            s.tri((X1, y, Z1), (X1, y, Z0), (b[0], yt, b[1]), mat, out=(X1 + 9, y + 9, c[2]))
        else:
            a, b = top
            s.quad((X1, y, Z1), (X1, y, Z0), (a[0], yt, a[1]), (b[0], yt, b[1]), mat, out=(X1 + 9, y + 9, c[2]))
            s.quad((X0, y, Z0), (X0, y, Z1), (b[0], yt, b[1]), (a[0], yt, a[1]), mat, out=(X0 - 9, y + 9, c[2]))
            s.tri((X0, y, Z1), (X1, y, Z1), (b[0], yt, b[1]), mat, out=(c[0], y + 9, Z1 + 9))
            s.tri((X1, y, Z0), (X0, y, Z0), (a[0], yt, a[1]), mat, out=(c[0], y + 9, Z0 - 9))

    def shed(s, x0, z0, x1, z1, yhi, ylo, mat='roof', over=0.08):
        """tetto a una falda: alto sul lato z0, basso su z1 (verso il fronte)"""
        s.quad((x0 - over, ylo, z1 + over), (x1 + over, ylo, z1 + over), (x1 + over, yhi, z0 - over), (x0 - over, yhi, z0 - over), mat, out=(0, yhi + 9, z1 + 9))
        s.quad((x0 - over, ylo - 0.04, z1 + over), (x1 + over, ylo - 0.04, z1 + over), (x1 + over, ylo, z1 + over), (x0 - over, ylo, z1 + over), 'wood_d', out=(0, ylo, z1 + 9))

    # ---- pezzi architettonici
    def column(s, x, z, y0, y1, r=0.06, mat='flutes', cap='marble', seg=8):
        s.box(x - r * 1.35, y0, z - r * 1.35, x + r * 1.35, y0 + r * 0.9, z + r * 1.35, cap)
        s.cyl(x, z, r, y0 + r * 0.9, y1 - r * 0.9, mat, seg, top=False, r1=r * 0.88)
        s.box(x - r * 1.45, y1 - r * 0.9, z - r * 1.45, x + r * 1.45, y1, z + r * 1.45, cap)

    def door(s, x, y, z, w, h, face='f', mat='door'):
        """porta (o finestra) appena davanti alla parete. face: f(+z) b(-z) l(-x) r(+x); x,z = centro sulla parete"""
        e = 0.012
        if face == 'f': s.quad((x - w / 2, y, z + e), (x + w / 2, y, z + e), (x + w / 2, y + h, z + e), (x - w / 2, y + h, z + e), mat, out=(x, y, z + 9))
        if face == 'b': s.quad((x + w / 2, y, z - e), (x - w / 2, y, z - e), (x - w / 2, y + h, z - e), (x + w / 2, y + h, z - e), mat, out=(x, y, z - 9))
        if face == 'l': s.quad((x - e, y, z - w / 2), (x - e, y, z + w / 2), (x - e, y + h, z + w / 2), (x - e, y + h, z - w / 2), mat, out=(x - 9, y, z))
        if face == 'r': s.quad((x + e, y, z + w / 2), (x + e, y, z - w / 2), (x + e, y + h, z - w / 2), (x + e, y + h, z + w / 2), mat, out=(x + 9, y, z))

    def banner(s, x, z, y0, y1, w=0.22, face='f'):
        """vexillum: asta, traversa e drappo"""
        s.box(x - 0.015, 0, z - 0.015, x + 0.015, y1 + 0.06, z + 0.015, 'wood_d')
        s.box(x - w / 2 - 0.02, y1 - 0.015, z - 0.012, x + w / 2 + 0.02, y1 + 0.015, z + 0.012, 'wood_d')
        s.quad((x - w / 2, y0, z + 0.02), (x + w / 2, y0, z + 0.02), (x + w / 2, y1, z + 0.02), (x - w / 2, y1, z + 0.02), 'vexillum', out=(x, y0, z + 9))
        s.quad((x + w / 2, y0, z + 0.019), (x - w / 2, y0, z + 0.019), (x - w / 2, y1, z + 0.019), (x + w / 2, y1, z + 0.019), 'red', out=(x, y0, z - 9))
        s.cyl(x, z, 0.03, y1 + 0.06, y1 + 0.1, 'gold', 6)

    def amphora(s, x, z, y=0, h=0.16):
        s.cyl(x, z, h * 0.08, y, y + h * 0.2, 'terra', 7, top=False, r1=h * 0.22)
        s.cyl(x, z, h * 0.22, y + h * 0.2, y + h * 0.75, 'terra', 7, top=False, r1=h * 0.12)
        s.cyl(x, z, h * 0.07, y + h * 0.75, y + h, 'terra', 6)

    def stairs(s, x0, x1, zf, y0, y1, steps, depth, mat='marble'):
        """gradini dal fronte zf (+z) indietro di depth fino alla quota y1"""
        for i in range(steps):
            t = (i + 1) / steps; s.box(x0, y0, zf - depth, x1, y0 + (y1 - y0) * t, zf - depth * i / steps, mat)

    def export(s, name, path, texsize=1024):
        P = np.array(s.P); N = np.array(s.N); UV = np.array(s.U); T = np.array(s.T, dtype=np.int64)
        # la scala del gioco si basa su min/size: niente punti sotto lo zero
        assert len(P) < 65000, (name, len(P))
        mn = P.min(0); size = np.maximum(1e-6, P.max(0) - mn)
        pos = np.round((P - mn) / size * 65535).astype(np.uint16)
        nor = np.zeros((len(N), 4), np.int8); nor[:, :3] = np.round(N * 127).astype(np.int8)
        uv = np.round(np.clip(UV, 0, 1) * 65535).astype(np.uint16)
        idx = T.astype(np.uint16)
        tex = ATLAS_IMG.resize((texsize, texsize), Image.LANCZOS) if ATLAS_IMG.size[0] != texsize else ATLAS_IMG
        bb = io.BytesIO(); tex.save(bb, 'JPEG', quality=86, optimize=True)
        b64 = lambda a: base64.b64encode(a.tobytes()).decode()
        js = (f"M3D.{name}={{min:{mn.tolist()},size:{size.tolist()},n:{len(P)},pos:'{b64(pos)}',nor:'{b64(nor)}',uv:'{b64(uv)}',idx:'{b64(idx)}',"
              f"tex:'data:image/jpeg;base64,{base64.b64encode(bb.getvalue()).decode()}'}};\n")
        open(path, 'w').write(js)
        return len(P), len(T), len(js) // 1024

ATLAS_IMG = None
def init():
    global ATLAS_IMG
    build_materials(); ATLAS_IMG = atlas(); return ATLAS_IMG

# ---------------------------------------------------------------- anteprima isometrica (come nel gioco)
def preview(mesh, out, px=360, yaw=0.0, both=True):
    if both:
        import tempfile
        a = out + '.a.png'; b = out + '.b.png'; preview(mesh, a, px, 0.0, False); preview(mesh, b, px, 0.75, False)
        A, B = Image.open(a), Image.open(b); C = Image.new('RGB', (A.width + B.width + 10, max(A.height, B.height)), (40, 40, 40)); C.paste(A, (0, 0)); C.paste(B, (A.width + 10, 0)); C.save(out); os.remove(a); os.remove(b); return
    """rasterizza il modello come lo disegna il gioco: vista isometrica, luce da sinistra, z-buffer"""
    P = np.array(mesh.P); N = np.array(mesh.N); UV = np.array(mesh.U); T = np.array(mesh.T)
    mn = P.min(0); sz = P.max(0) - mn; S = 1 / max(sz[0], sz[2])
    f = math.sqrt(0.5); cy, sy = math.cos(yaw), math.sin(yaw)
    ax = np.array([f, -f]); az = np.array([f, f])
    axr = ax * cy + az * sy; azr = -ax * sy + az * cy
    p = P - (mn + sz / 2) * np.array([1, 0, 1]) - np.array([0, mn[1], 0])
    gx = (p[:, 0] * axr[0] + p[:, 2] * azr[0]) * S; gy = (p[:, 0] * axr[1] + p[:, 2] * azr[1]) * S; h = p[:, 1] * S
    X = (gx - gy) * 32; Y = (gx + gy) * 16 - h * 39.19; D = -(gx + gy) * 0.6124 - h * 0.5
    nh0 = N[:, 0] * axr[0] + N[:, 2] * azr[0]; nh1 = N[:, 0] * axr[1] + N[:, 2] * azr[1]; nw = np.stack([nh0, nh1, N[:, 1]], 1)
    L = np.array([-0.45, 0.25, 0.86]); L /= np.linalg.norm(L)
    dif = np.clip(nw @ L, 0, None); back = np.clip(-(nw @ L), 0, None) * 0.12; sky = 0.5 + 0.5 * nw[:, 2]
    light = 0.66 + 0.16 * sky + 0.5 * dif + back
    x0, x1, y0, y1 = X.min(), X.max(), Y.min(), Y.max(); sc = (px - 20) / max(x1 - x0, y1 - y0)
    W = int((x1 - x0) * sc) + 20; H = int((y1 - y0) * sc) + 20
    sxp = (X - x0) * sc + 10; syp = (Y - y0) * sc + 10
    img = np.zeros((H, W, 3)) + np.array([92, 120, 60]); zb = np.full((H, W), 1e9)
    tex = np.asarray(ATLAS_IMG, dtype=np.float64); TS = tex.shape[0]
    for t in T:
        a, b, c = t; xs = sxp[[a, b, c]]; ys = syp[[a, b, c]]
        bx0, bx1 = int(max(0, xs.min())), int(min(W - 1, xs.max() + 1)); by0, by1 = int(max(0, ys.min())), int(min(H - 1, ys.max() + 1))
        if bx1 < bx0 or by1 < by0: continue
        gyy, gxx = np.mgrid[by0:by1 + 1, bx0:bx1 + 1] + 0.5
        den = (ys[1] - ys[2]) * (xs[0] - xs[2]) + (xs[2] - xs[1]) * (ys[0] - ys[2])
        if abs(den) < 1e-9: continue
        w0 = ((ys[1] - ys[2]) * (gxx - xs[2]) + (xs[2] - xs[1]) * (gyy - ys[2])) / den
        w1 = ((ys[2] - ys[0]) * (gxx - xs[2]) + (xs[0] - xs[2]) * (gyy - ys[2])) / den; w2 = 1 - w0 - w1
        m = (w0 >= -1e-6) & (w1 >= -1e-6) & (w2 >= -1e-6)
        if not m.any(): continue
        d = w0 * D[a] + w1 * D[b] + w2 * D[c]; zs = zb[by0:by1 + 1, bx0:bx1 + 1]; m &= d < zs
        if not m.any(): continue
        u = w0 * UV[a, 0] + w1 * UV[b, 0] + w2 * UV[c, 0]; v = w0 * UV[a, 1] + w1 * UV[b, 1] + w2 * UV[c, 1]
        tc = tex[np.clip((v * TS).astype(int), 0, TS - 1), np.clip((u * TS).astype(int), 0, TS - 1)]
        lt = w0 * light[a] + w1 * light[b] + w2 * light[c]
        cc = tc * lt[..., None]; g = cc @ np.array([0.299, 0.587, 0.114]); cc = g[..., None] + (cc - g[..., None]) * 1.12
        sub = img[by0:by1 + 1, bx0:bx1 + 1]; sub[m] = cc[m]; zs[m] = d[m]
    Image.fromarray(clip(img)).save(out)
