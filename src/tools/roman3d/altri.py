# Tutti gli altri edifici romani (importato da edifici.py)
import math
from kit import Mesh

def wall_line(m, x0, z0, x1, z1, y0, y1, mat, th, top='plaster_w'):
    import numpy as np
    d = np.array([x1 - x0, z1 - z0], float); L = np.linalg.norm(d); d /= L; n = np.array([-d[1], d[0]]) * th / 2
    c = ((x0 + x1) / 2, (z0 + z1) / 2)
    A0, A1, B0, B1 = (x0 + n[0], z0 + n[1]), (x1 + n[0], z1 + n[1]), (x0 - n[0], z0 - n[1]), (x1 - n[0], z1 - n[1])
    m.quad((A0[0], y0, A0[1]), (A1[0], y0, A1[1]), (A1[0], y1, A1[1]), (A0[0], y1, A0[1]), mat, out=(c[0] + n[0] * 99, y0, c[1] + n[1] * 99))
    m.quad((B1[0], y0, B1[1]), (B0[0], y0, B0[1]), (B0[0], y1, B0[1]), (B1[0], y1, B1[1]), mat, out=(c[0] - n[0] * 99, y0, c[1] - n[1] * 99))
    m.quad((A0[0], y1, A0[1]), (A1[0], y1, A1[1]), (B1[0], y1, B1[1]), (B0[0], y1, B0[1]), top, out=(c[0], y1 + 9, c[1]))
    for p, q, s in ((A0, B0, -1), (A1, B1, 1)):
        m.quad((p[0], y0, p[1]), (q[0], y0, q[1]), (q[0], y1, q[1]), (p[0], y1, p[1]), mat, out=((p[0] + q[0]) / 2 + d[0] * s * 9, y0, (p[1] + q[1]) / 2 + d[1] * s * 9))

def merlons(m, x0, z0, x1, z1, y, h, w, mat, th):
    import numpy as np
    L = math.hypot(x1 - x0, z1 - z0); n = max(2, int(L / (w * 2)))
    for i in range(n):
        t0 = (i + 0.25) / n; t1 = (i + 0.75) / n
        wall_line(m, x0 + (x1 - x0) * t0, z0 + (z1 - z0) * t0, x0 + (x1 - x0) * t1, z0 + (z1 - z0) * t1, y, y + h, mat, th, top=mat)

def walls4(m, x0, z0, x1, z1, h, mat, rep=None):
    c = ((x0 + x1) / 2, h / 2, (z0 + z1) / 2)
    m.quad((x0, 0, z1), (x1, 0, z1), (x1, h, z1), (x0, h, z1), mat, out=(c[0], c[1], z1 + 9), rep=rep)
    m.quad((x1, 0, z0), (x0, 0, z0), (x0, h, z0), (x1, h, z0), mat, out=(c[0], c[1], z0 - 9), rep=rep)
    m.quad((x0, 0, z0), (x0, 0, z1), (x0, h, z1), (x0, h, z0), mat, out=(x0 - 9, c[1], c[2]), rep=rep)
    m.quad((x1, 0, z1), (x1, 0, z0), (x1, h, z0), (x1, h, z1), mat, out=(x1 + 9, c[1], c[2]), rep=rep)

def fresco_rep(h): return (1.0, h)

def house(m, x0, z0, x1, z1, h, rh, axis='x', wallm='fresco', roof='roof', over=0.08, end='plaster_w', y=0):
    rep = fresco_rep(h) if wallm == 'fresco' else None
    if y: m.box(x0, y - 0.001, z0, x1, y, z1, 'stone_d')
    c = ((x0 + x1) / 2, y + h / 2, (z0 + z1) / 2)
    m.quad((x0, y, z1), (x1, y, z1), (x1, y + h, z1), (x0, y + h, z1), wallm, out=(c[0], c[1], z1 + 9), rep=rep)
    m.quad((x1, y, z0), (x0, y, z0), (x0, y + h, z0), (x1, y + h, z0), wallm, out=(c[0], c[1], z0 - 9), rep=rep)
    m.quad((x0, y, z0), (x0, y, z1), (x0, y + h, z1), (x0, y + h, z0), wallm, out=(x0 - 9, c[1], c[2]), rep=rep)
    m.quad((x1, y, z1), (x1, y, z0), (x1, y + h, z0), (x1, y + h, z1), wallm, out=(x1 + 9, c[1], c[2]), rep=rep)
    if roof: m.gable(x0, z0, x1, z1, y + h, rh, roof, end, over, axis)

def colonnade(m, x0, x1, z, y0, y1, n, r=0.045, mat='flutes', cap='marble'):
    for i in range(n):
        x = x0 + (x1 - x0) * i / max(1, n - 1); m.column(x, z, y0, y1, r, mat, cap)

def colonnade_z(m, z0, z1, x, y0, y1, n, r=0.045, mat='flutes', cap='marble'):
    for i in range(n):
        z = z0 + (z1 - z0) * i / max(1, n - 1); m.column(x, z, y0, y1, r, mat, cap)

def portico(m, x0, x1, z0, z1, y, n, h=0.42, rh=0.1, front='z'):
    """portico a una falda: colonne sul lato esterno (z1), tetto che sale verso il muro (z0)"""
    colonnade(m, x0 + 0.06, x1 - 0.06, z1 - 0.05, y, y + h, n, 0.038)
    m.box(x0, y + h, z1 - 0.1, x1, y + h + 0.05, z1, 'plaster_w')
    m.shed(x0, z0, x1, z1, y + h + rh + 0.05, y + h + 0.05, 'roof', 0.04)

def temple(m, x0, x1, z0, z1, pod, colh, ncol, roof_h, steps=5, front_cols=True, inscr=True, rcol=0.05, ped='marble'):
    """tempio su podio: scalinata davanti, pronao di colonne, cella, frontone"""
    W = x1 - x0; zp = z0 + (z1 - z0) * 0.42  # inizio pronao
    m.box(x0, 0, z0, x1, pod, z1 - (z1 - z0) * 0.22, 'stone', top='marble')
    m.box(x0 - 0.02, pod - 0.03, z0 - 0.02, x1 + 0.02, pod, z1 - (z1 - z0) * 0.22 + 0.02, 'marble')
    zs = z1 - (z1 - z0) * 0.22
    m.stairs(x0 + W * 0.12, x1 - W * 0.12, z1, 0, pod, steps, z1 - zs, 'marble')
    for s in (-1, 1):
        xa = x0 if s < 0 else x1 - W * 0.12
        m.box(xa, 0, zs, xa + W * 0.12, pod, z1, 'stone', top='marble')
    # cella
    cx0, cx1 = x0 + W * 0.1, x1 - W * 0.1
    walls4(m, cx0, z0 + 0.05, cx1, zp, colh, 'marble')
    m.door((cx0 + cx1) / 2, pod, zp, W * 0.22, colh * 0.62, 'f', 'door')
    m.box((cx0 + cx1) / 2 - W * 0.13, pod, zp, (cx0 + cx1) / 2 + W * 0.13, pod + colh * 0.66, zp + 0.025, 'marble', skip=('f',))
    y0 = pod
    m.box(cx0, 0, z0 + 0.05, cx1, y0, zp, 'stone')
    # colonne del pronao (fronte e fianchi)
    colonnade(m, x0 + 0.08, x1 - 0.08, zs - 0.06, y0, y0 + colh, ncol, rcol)
    for x in (x0 + 0.08, x1 - 0.08): colonnade_z(m, zp + 0.05, zs - 0.06, x, y0, y0 + colh, 2, rcol)
    # trabeazione
    ya = y0 + colh; ea = 0.1
    m.box(x0 + 0.02, ya, z0 + 0.02, x1 - 0.02, ya + ea, zs, 'marble', sides={'f': 'inscr' if inscr else 'marble'})
    m.box(x0, ya + ea, z0, x1, ya + ea + 0.03, zs + 0.02, 'marble')
    # frontone e tetto
    m.gable(x0, z0, x1, zs + 0.02, ya + ea + 0.03, roof_h, 'roof', ped, 0.04, axis='z')
    # acroteri dorati
    m.box((x0 + x1) / 2 - 0.03, ya + ea + 0.03 + roof_h, zs, (x0 + x1) / 2 + 0.03, ya + ea + 0.03 + roof_h + 0.06, zs + 0.04, 'gold')

def altar(m, x, z, s=1.0, fire=True):
    m.box(x - 0.11 * s, 0, z - 0.07 * s, x + 0.11 * s, 0.13 * s, z + 0.07 * s, 'marble')
    m.box(x - 0.13 * s, 0.13 * s, z - 0.09 * s, x + 0.13 * s, 0.16 * s, z + 0.09 * s, 'marble')
    if fire: m.cone(x, z, 0.06 * s, 0.16 * s, 0.26 * s, 'fire', 6)

def tower_wood(m, cx, cz, w, h, roof=True, base=0.0):
    r = w / 2
    for sx in (-1, 1):
        for sz in (-1, 1): m.box(cx + sx * r - 0.035, base, cz + sz * r - 0.035, cx + sx * r + 0.035, h + 0.18, cz + sz * r + 0.035, 'wood_d')
    # cassone di tavole alla base e piattaforma
    m.box(cx - r, base, cz - r, cx + r, base + h * 0.35, cz + r, 'logs', top='wood')
    m.box(cx - r - 0.05, h - 0.03, cz - r - 0.05, cx + r + 0.05, h, cz + r + 0.05, 'wood')
    for (a, b, c, d) in ((-1, 1, 1, 1), (-1, 1, -1, -1)):
        m.box(cx - r - 0.05, h, cz + c * (r + 0.05) - 0.02, cx + r + 0.05, h + 0.16, cz + c * (r + 0.05) + 0.02, 'wood_v')
    for c in (-1, 1): m.box(cx + c * (r + 0.05) - 0.02, h, cz - r - 0.05, cx + c * (r + 0.05) + 0.02, h + 0.16, cz + r + 0.05, 'wood_v')
    # croci di controvento
    for c in (-1, 1):
        m.quad((cx - r, base + h * 0.35, cz + c * r), (cx + r, h - 0.05, cz + c * r), (cx + r, h - 0.01, cz + c * r), (cx - r, base + h * 0.35 + 0.05, cz + c * r), 'wood_d', out=(cx, 0, cz + c * 9))
    if roof: m.hip(cx - r - 0.05, cz - r - 0.05, cx + r + 0.05, cz + r + 0.05, h + 0.18, w * 0.45, 'roof', 0.06)

def tower_stone(m, cx, cz, w, h, roof=True, mat='stone_big'):
    r = w / 2; m.box(cx - r, 0, cz - r, cx + r, h, cz + r, mat)
    m.box(cx - r - 0.03, h - 0.04, cz - r - 0.03, cx + r + 0.03, h, cz + r + 0.03, 'stone_d')
    for f in 'flrb':
        if f in 'fb': m.door(cx, h * 0.62, cz + (r if f == 'f' else -r), w * 0.18, w * 0.26, f, 'window')
        else: m.door(cx + (r if f == 'r' else -r), h * 0.62, cz, w * 0.18, w * 0.26, f, 'window')
    if roof: m.hip(cx - r - 0.04, cz - r - 0.04, cx + r + 0.04, cz + r + 0.04, h, w * 0.5, 'roof', 0.05)
    else:
        for (a, b, c, d) in ((cx - r, cz + r, cx + r, cz + r), (cx + r, cz - r, cx - r, cz - r), (cx - r, cz - r, cx - r, cz + r), (cx + r, cz + r, cx + r, cz - r)):
            merlons(m, a, b, c, d, h, 0.1, w / 8, mat, 0.07)

def palisade_line(m, x0, z0, x1, z1, h, base=0.0, r=0.045):
    L = math.hypot(x1 - x0, z1 - z0); n = max(2, int(L / (r * 1.9)))
    for i in range(n):
        t = (i + 0.5) / n; x, z = x0 + (x1 - x0) * t, z0 + (z1 - z0) * t; hh = h * (0.94 + 0.08 * ((i * 37) % 5) / 4)
        m.cyl(x, z, r, base, base + hh, 'logs', 6, top=False); m.cone(x, z, r, base + hh, base + hh + r * 2.2, 'wood', 6)

def vallum(m, x0, z0, x1, z1, h, wtop):
    """terrapieno: argine erboso a sezione trapezia lungo il bordo di un rettangolo"""
    for (a, b, c, d, nx, nz) in ((x0, z1, x1, z1, 0, 1), (x1, z0, x0, z0, 0, -1), (x0, z0, x0, z1, -1, 0), (x1, z1, x1, z0, 1, 0)):
        o = wtop * 1.6
        if nz: p0, p1 = (a - o, 0, b + nz * o), (c + o, 0, d + nz * o); p2, p3 = (c, h, d), (a, h, b)
        else: p0, p1 = (a + nx * o, 0, b - o * (1 if nx < 0 else -1)), (c + nx * o, 0, d + o * (1 if nx < 0 else -1)); p2, p3 = (c, h, d), (a, h, b)
        m.quad(p0, p1, p2, p3, 'grass', out=((x0 + x1) / 2 + nx * 99, 0, (z0 + z1) / 2 + nz * 99))

# ============================================================ CASTRUM (legno)
def castrum():
    m = Mesh(); R = 1.65; h = 0.22
    m.box(-R, 0, -R, R, 0.02, R, 'dirt')
    vallum(m, -R, -R, R, R, h, 0.1)
    for (a, b, c, d) in ((-R, R, -0.36, R), (0.36, R, R, R), (R, R, R, -R), (R, -R, -R, -R), (-R, -R, -R, R)):
        palisade_line(m, a, b, c, d, 0.42, h)
    # porta pretoria con due torri
    for x in (-0.48, 0.48): tower_wood(m, x, R, 0.26, 0.82, base=0)
    m.box(-0.36, 0.62, R - 0.08, 0.36, 0.68, R + 0.08, 'wood'); m.box(-0.36, 0.68, R + 0.06, 0.36, 0.82, R + 0.08, 'wood_v')
    m.box(-0.34, 0, R - 0.02, -0.03, 0.55, R + 0.01, 'wood_v'); m.box(0.03, 0, R - 0.02, 0.34, 0.55, R + 0.01, 'wood_v')
    # torri d'angolo
    for sx in (-1, 1):
        for sz in (-1, 1): tower_wood(m, sx * (R - 0.06), sz * (R - 0.06), 0.3, 0.9)
    # principia al centro
    house(m, -0.62, -0.95, 0.62, -0.25, 0.5, 0.24, 'x', 'fresco')
    m.box(-0.66, 0, -0.25, 0.66, 0.04, 0.0, 'stone')
    colonnade(m, -0.56, 0.56, -0.05, 0.04, 0.42, 5, 0.035, 'wood_v', 'wood_d')
    m.shed(-0.62, -0.25, 0.62, 0.0, 0.52, 0.44, 'roof', 0.03)
    m.door(0, 0.04, -0.25, 0.22, 0.32)
    # baracche (contubernia) ai lati
    for s in (-1, 1):
        for z in (-0.95, -0.3, 0.35):
            house(m, s * 1.32 - 0.22, z, s * 1.32 + 0.22, z + 0.48, 0.28, 0.14, 'z', 'wood_v', 'roof', 0.05, 'wood_v')
    # via principalis, vessilli e tende
    m.box(-0.3, 0.02, 0.05, 0.3, 0.025, R, 'paving')
    for x in (-0.22, 0.22): m.banner(x, 0.25, 0.6, 0.95, 0.16)
    altar(m, 0, 0.42, 0.8)
    for x in (-0.8, 0.8): m.box(x - 0.12, 0, 0.9, x + 0.12, 0.05, 1.2, 'hay')
    return m

# ============================================================ CASTELLUM (pietra)
def castello():
    m = Mesh(); R = 1.6; H = 0.62; th = 0.16
    m.box(-R, 0, -R, R, 0.02, R, 'paving')
    for (a, b, c, d) in ((-R, -R, R, -R), (-R, -R, -R, R), (R, -R, R, R), (-R, R, -0.38, R), (0.38, R, R, R)):
        wall_line(m, a, b, c, d, 0, H, 'stone_big', th, top='stone_d')
    for (a, b, c, d, o) in ((-R, -R, R, -R, (0, -1)), (-R, -R, -R, R, (-1, 0)), (R, -R, R, R, (1, 0)), (-R, R, -0.38, R, (0, 1)), (0.38, R, R, R, (0, 1))):
        merlons(m, a + o[0] * th * 0.35, b + o[1] * th * 0.35, c + o[0] * th * 0.35, d + o[1] * th * 0.35, H, 0.1, 0.07, 'stone_big', 0.05)
    for sx in (-1, 1):
        for sz in (-1, 1): tower_stone(m, sx * (R - 0.08), sz * (R - 0.08), 0.42, 0.95)
    # porta con arco: due torri, architrave con iscrizione
    for x in (-0.55, 0.55): tower_stone(m, x, R, 0.36, 0.9)
    m.box(-0.38, 0.5, R - 0.12, 0.38, 0.8, R + 0.12, 'stone_big', sides={'f': 'inscr'})
    m.door(0, 0, R + 0.12, 0.5, 0.5, 'f', 'dark'); m.door(0, 0, R + 0.125, 0.5, 0.06, 'f', 'stone_d')
    merlons(m, -0.38, R + 0.08, 0.38, R + 0.08, 0.8, 0.09, 0.07, 'stone_big', 0.05)
    # principia di pietra con portico e basilica
    house(m, -0.75, -1.2, 0.75, -0.35, 0.62, 0.3, 'x', 'fresco')
    m.box(-0.8, 0, -0.35, 0.8, 0.06, 0.02, 'marble')
    colonnade(m, -0.7, 0.7, -0.04, 0.06, 0.55, 6, 0.04)
    m.box(-0.78, 0.55, -0.1, 0.78, 0.61, 0.0, 'marble', sides={'f': 'inscr'})
    m.shed(-0.78, -0.35, 0.78, 0.0, 0.7, 0.61, 'roof', 0.03)
    m.door(0, 0.06, -0.35, 0.26, 0.38)
    # magazzini e caserme lungo i muri
    for s in (-1, 1):
        house(m, s * 1.15 - 0.28, -1.25, s * 1.15 + 0.28, 0.0, 0.36, 0.16, 'z', 'fresco')
        house(m, s * 1.15 - 0.28, 0.3, s * 1.15 + 0.28, 1.2, 0.34, 0.15, 'z', 'fresco')
    for x in (-0.28, 0.28): m.banner(x, 0.35, 0.65, 1.02, 0.17)
    m.column(0, 0.75, 0.0, 0.5, 0.045); m.box(-0.05, 0.5, 0.7, 0.05, 0.6, 0.8, 'gold')
    return m

# ============================================================ TABERNA
def taverna():
    m = Mesh()
    house(m, -1.05, -0.75, 1.05, 0.35, 0.82, 0.26, 'x', 'plaster_o', end='plaster_o')
    m.box(-1.05, 0, 0.35, 1.05, 0.06, 0.62, 'stone')
    # bancone a L con dolia incassati (thermopolium)
    m.door(0.2, 0.06, 0.35, 1.0, 0.5, 'f', 'shop')
    m.box(-0.3, 0.06, 0.4, 0.7, 0.3, 0.52, 'marble', sides={'f': 'plaster_r'})
    for x in (-0.15, 0.15, 0.45): m.cyl(x, 0.46, 0.05, 0.3, 0.305, 'dark', 8)
    m.door(-0.72, 0.06, 0.35, 0.24, 0.42)
    for x in (-0.6, 0.0, 0.6): m.door(x, 0.56, 0.35, 0.12, 0.13, 'f', 'window')
    # pergola con tendone
    for x in (-0.95, -0.1, 0.75):
        m.box(x - 0.02, 0, 0.98, x + 0.02, 0.5, 1.02, 'wood_d')
    m.shed(-1.0, 0.36, 0.8, 1.02, 0.6, 0.5, 'awning', 0.0)
    # tavoli e panche
    for x in (-0.55, 0.35):
        m.box(x - 0.14, 0.16, 0.72, x + 0.14, 0.19, 0.88, 'wood'); m.box(x - 0.02, 0.06, 0.78, x + 0.02, 0.16, 0.82, 'wood_d')
        for z in (0.66, 0.94): m.box(x - 0.14, 0.09, z - 0.03, x + 0.14, 0.11, z + 0.03, 'wood')
    # forno a cupola del pane sul fianco
    m.box(1.05, 0, -0.35, 1.32, 0.18, 0.1, 'brick'); m.cyl(1.185, -0.12, 0.13, 0.18, 0.28, 'brick', 9, top=False, r1=0.08); m.cone(1.185, -0.12, 0.08, 0.28, 0.34, 'brick', 9)
    m.door(1.185, 0.18, 0.1, 0.1, 0.07, 'f', 'fire')
    # insegna e anfore
    m.box(-1.08, 0.62, 0.36, -0.82, 0.76, 0.39, 'wood', sides={'f': 'inscr'})
    for i, (x, z) in enumerate(((0.95, 0.55), (1.02, 0.42), (0.88, 0.42), (-1.0, 0.5))): m.amphora(x, z, 0, 0.2)
    m.box(-0.95, 0, -0.95, -0.55, 0.14, -0.8, 'wood_d')
    return m

# ============================================================ VILLA RUSTICA
def fattoria():
    m = Mesh()
    m.box(-1.7, 0, -1.7, 1.7, 0.012, 1.7, 'dirt')
    # casa colonica a L intorno all'aia
    house(m, -1.6, -1.55, 0.4, -0.85, 0.5, 0.24, 'x', 'fresco')
    house(m, -1.6, -0.85, -0.95, 0.3, 0.44, 0.2, 'z', 'plaster', end='plaster')
    m.box(-0.95, 0, -0.85, 0.4, 0.04, 0.3, 'paving')
    portico(m, -0.9, 0.35, -0.85, -0.6, 0.0, 4, 0.34, 0.08)
    m.door(-0.4, 0.0, -0.85, 0.2, 0.32); m.door(-0.95, 0.0, -0.3, 0.2, 0.3, 'r')
    # fienile di legno con tetto di paglia
    house(m, 0.55, -1.55, 1.6, -0.85, 0.42, 0.26, 'x', 'wood_v', 'thatch', 0.06, 'wood_v')
    m.door(1.07, 0, -0.85, 0.36, 0.36, 'f', 'dark')
    # macina e pozzo nell'aia
    m.cyl(-0.3, -0.25, 0.14, 0.04, 0.12, 'stone_d', 10); m.cyl(-0.3, -0.25, 0.1, 0.12, 0.2, 'stone', 10); m.box(-0.52, 0.17, -0.27, -0.08, 0.2, -0.23, 'wood_d')
    m.cyl(0.15, -0.3, 0.09, 0.04, 0.18, 'stone', 9, top='water')
    # campi recintati
    m.box(-1.6, 0, 0.5, -0.1, 0.03, 1.6, 'field'); m.box(0.1, 0, 0.5, 1.6, 0.03, 1.6, 'field')
    m.box(0.55, 0, -0.65, 1.6, 0.03, 0.3, 'field')
    for (a, b, c, d) in ((-1.62, 1.62, 1.62, 1.62), (-1.62, 0.48, -1.62, 1.62), (1.62, 0.48, 1.62, 1.62), (0.52, -0.67, 0.52, 0.32)):
        L = math.hypot(c - a, d - b); n = int(L / 0.25) + 1
        for i in range(n + 1):
            t = i / n; x, z = a + (c - a) * t, b + (d - b) * t; m.box(x - 0.015, 0, z - 0.015, x + 0.015, 0.14, z + 0.015, 'wood_d')
        wall_line(m, a, b, c, d, 0.09, 0.11, 'wood', 0.02, 'wood')
    for (x, z) in ((1.2, -0.25), (0.85, -0.3)): m.cyl(x, z, 0.11, 0.0, 0.14, 'hay', 8, top=False, r1=0.1); m.cone(x, z, 0.1, 0.14, 0.26, 'hay', 8)
    for x in (-1.3, -1.0): m.amphora(x, 0.42, 0, 0.18)
    return m

# ============================================================ FALEGNAMERIA (capanna)
def capanna():
    m = Mesh()
    house(m, -1.0, -0.8, 0.5, 0.2, 0.55, 0.24, 'x', 'wood_v', 'roof', 0.08, 'wood_v')
    m.box(-1.0, 0, -0.8, 0.5, 0.08, 0.2, 'stone_d', skip=('t',))
    m.door(-0.6, 0.08, 0.2, 0.36, 0.38, 'f', 'dark'); m.door(0.15, 0.25, 0.2, 0.14, 0.12, 'f', 'window')
    # tettoia aperta con la sega
    for x in (0.55, 1.1):
        for z in (-0.6, 0.15): m.box(x - 0.025, 0, z - 0.025, x + 0.025, 0.42, z + 0.025, 'wood_d')
    m.shed(0.5, -0.65, 1.15, 0.2, 0.52, 0.42, 'roof', 0.04)
    m.box(0.6, 0.18, -0.3, 1.05, 0.22, -0.18, 'wood'); m.box(0.65, 0, -0.29, 0.69, 0.18, -0.19, 'wood_d'); m.box(0.96, 0, -0.29, 1.0, 0.18, -0.19, 'wood_d')
    m.box(0.8, 0.22, -0.35, 0.82, 0.38, -0.13, 'iron')
    # ruota ad acqua sul fianco
    import numpy as np
    for i in range(10):
        a = 2 * math.pi * i / 10; r = 0.3
        m.box(-1.12, 0.32 + r * math.sin(a) - 0.03, -0.3 + r * math.cos(a) - 0.06, -1.04, 0.32 + r * math.sin(a) + 0.03, -0.3 + r * math.cos(a) + 0.06, 'wood')
    m.cyl(-1.08, -0.3, 0.05, 0.31, 0.33, 'wood_d', 8)
    m.box(-1.25, 0, -0.75, -1.02, 0.04, 0.15, 'water')
    # tronchi accatastati e assi
    for i, z in enumerate((0.5, 0.62, 0.74)):
        for j in range(4 - i):
            x0 = -0.9 + j * 0.15 + i * 0.075; m.cyl(0, 0, 0.001, 0, 0.001, 'wood', 3, top=False)
            yy = 0.06 + i * 0.1
            m.box(-1.0, yy - 0.05, z - 0.05, 0.2, yy + 0.05, z + 0.05, 'logs') if False else None
    for i in range(3):
        for j in range(3 - i):
            y = 0.06 + i * 0.1; x = -0.95 + j * 0.12 + i * 0.06
            m.box(x - 0.05, y - 0.05, 0.4, x + 0.05, y + 0.05, 1.0, 'wood_d', sides={'f': 'logs', 'b': 'logs'})
    for k in range(4): m.box(0.15, k * 0.03, 0.45, 0.95, k * 0.03 + 0.028, 0.75, 'wood')
    return m

# ============================================================ FABRICA (fucina)
def fucina():
    m = Mesh()
    house(m, -1.0, -0.85, 1.0, 0.1, 0.62, 0.22, 'x', 'brick', 'roof', 0.08, 'brick')
    m.door(-0.45, 0, 0.1, 0.62, 0.48, 'f', 'dark'); m.door(0.5, 0.0, 0.1, 0.22, 0.36)
    # forgia in muratura con fuoco
    m.box(-0.75, 0, 0.1, -0.2, 0.26, 0.42, 'brick', top='stone_d'); m.box(-0.62, 0.26, 0.2, -0.33, 0.3, 0.36, 'fire')
    m.box(-0.62, 0.3, -0.05, -0.33, 1.1, 0.12, 'brick'); m.box(-0.66, 1.1, -0.09, -0.29, 1.14, 0.16, 'stone_d')
    # tettoia sopra la forgia
    m.shed(-0.85, 0.1, -0.1, 0.55, 0.5, 0.42, 'roof', 0.03)
    for x in (-0.82, -0.13): m.box(x - 0.02, 0, 0.52, x + 0.02, 0.42, 0.56, 'wood_d')
    # incudine su ceppo, mantice, armi
    m.cyl(0.05, 0.5, 0.06, 0, 0.12, 'logs', 7); m.box(-0.02, 0.12, 0.46, 0.13, 0.17, 0.54, 'iron'); m.box(0.12, 0.14, 0.48, 0.17, 0.16, 0.52, 'iron')
    m.box(-0.18, 0.05, 0.48, -0.12, 0.16, 0.6, 'leather')
    for i, x in enumerate((0.35, 0.47, 0.59, 0.71)): m.box(x - 0.012, 0, 0.32, x + 0.012, 0.36, 0.35, 'iron'); m.box(x - 0.03, 0.26, 0.31, x + 0.03, 0.28, 0.36, 'bronze')
    m.box(0.3, 0, 0.25, 0.8, 0.04, 0.35, 'wood_d')
    m.box(0.7, 0, 0.5, 0.95, 0.12, 0.7, 'wood', sides={'f': 'wood_d'}); m.box(0.72, 0.12, 0.52, 0.93, 0.15, 0.68, 'iron')
    m.cyl(-0.9, 0.5, 0.08, 0, 0.14, 'wood_d', 8, top='water')
    return m

# ============================================================ ARMAMENTARIUM
def armeria():
    m = Mesh()
    house(m, -1.05, -0.75, 1.05, 0.2, 0.7, 0.26, 'x', 'stone', 'roof', 0.08, 'stone')
    m.box(-1.1, 0, -0.8, 1.1, 0.06, 0.6, 'stone_d', top='paving')
    portico(m, -1.05, 1.05, 0.2, 0.55, 0.06, 6, 0.48, 0.08)
    m.door(0, 0.06, 0.2, 0.3, 0.42)
    # scudi appesi sotto il portico
    for x in (-0.75, -0.45, 0.45, 0.75): m.door(x, 0.2, 0.2, 0.16, 0.26, 'f', 'scutum')
    # rastrelliere di pila e un manichino armato
    for x0 in (-0.9, 0.55):
        m.box(x0, 0.28, 0.62, x0 + 0.35, 0.31, 0.66, 'wood_d'); m.box(x0, 0.06, 0.62, x0 + 0.02, 0.31, 0.66, 'wood_d'); m.box(x0 + 0.33, 0.06, 0.62, x0 + 0.35, 0.31, 0.66, 'wood_d')
        for i in range(6): x = x0 + 0.04 + i * 0.055; m.box(x - 0.008, 0.06, 0.66, x + 0.008, 0.52, 0.68, 'wood'); m.box(x - 0.012, 0.52, 0.66, x + 0.012, 0.6, 0.68, 'iron')
    m.box(-0.05, 0.06, 0.75, 0.05, 0.32, 0.8, 'iron'); m.cyl(0, 0.775, 0.05, 0.32, 0.42, 'bronze', 7); m.door(0, 0.1, 0.8, 0.12, 0.2, 'f', 'scutum')
    for x in (-0.7, 0.7): m.door(x, 0.55, -0.75, 0.12, 0.12, 'b', 'window')
    return m

# ============================================================ VALETUDINARIUM
def infermeria():
    m = Mesh()
    # quattro ali intorno al cortile con il giardino delle erbe
    house(m, -1.1, -1.0, 1.1, -0.55, 0.5, 0.2, 'x', 'fresco')
    house(m, -1.1, 0.45, 1.1, 0.9, 0.5, 0.2, 'x', 'fresco')
    house(m, -1.1, -0.55, -0.7, 0.45, 0.44, 0.17, 'z', 'fresco')
    house(m, 0.7, -0.55, 1.1, 0.45, 0.44, 0.17, 'z', 'fresco')
    m.box(-0.7, 0, -0.55, 0.7, 0.02, 0.45, 'grass')
    for x in (-0.45, -0.15, 0.15, 0.45): m.box(x - 0.1, 0.02, -0.4, x + 0.1, 0.08, 0.3, 'hedge')
    m.cyl(0, -0.05, 0.08, 0.02, 0.12, 'marble', 8, top='water')
    portico(m, -0.7, 0.7, -0.55, -0.32, 0.02, 5, 0.34, 0.07)
    # ingresso monumentale sul fronte con porta e lucerne
    m.box(-0.28, 0, 0.9, 0.28, 0.62, 0.98, 'marble', sides={'f': 'inscr'})
    m.door(0, 0, 0.98, 0.26, 0.4); m.gable(-0.3, 0.9, 0.3, 1.02, 0.62, 0.14, 'roof', 'marble', 0.03, 'z')
    for x in (-0.75, -0.5, 0.5, 0.75): m.door(x, 0.25, 0.9, 0.12, 0.14, 'f', 'window')
    # lettighe e bende ad asciugare
    for x in (-0.9, 0.7):
        m.box(x, 0.1, 1.1, x + 0.3, 0.13, 1.2, 'cloth'); m.box(x, 0, 1.1, x + 0.02, 0.1, 1.12, 'wood_d'); m.box(x + 0.28, 0, 1.18, x + 0.3, 0.1, 1.2, 'wood_d')
    m.box(-1.25, 0, 0.0, -1.22, 0.3, 0.02, 'wood_d'); m.box(-1.25, 0, 0.5, -1.22, 0.3, 0.52, 'wood_d'); m.box(-1.24, 0.27, 0.0, -1.23, 0.28, 0.52, 'wood_d')
    m.quad((-1.235, 0.12, 0.05), (-1.235, 0.12, 0.47), (-1.235, 0.27, 0.47), (-1.235, 0.27, 0.05), 'cloth', out=(-9, 0, 0.25))
    return m

# ============================================================ MINIERA
def miniera():
    m = Mesh()
    # collina di roccia a gradoni
    for i, (r, h) in enumerate(((1.6, 0.25), (1.25, 0.5), (0.85, 0.75))):
        m.box(-r, 0, -1.6, r * 0.8, h, -1.6 + r * 1.3, 'rock')
    # ingresso puntellato
    m.box(-0.35, 0, 0.45, 0.35, 0.48, 0.5, 'rock', skip=())
    m.door(0, 0, 0.5, 0.4, 0.38, 'f', 'dark')
    for x in (-0.24, 0.24): m.box(x - 0.04, 0, 0.5, x + 0.04, 0.42, 0.58, 'logs')
    m.box(-0.3, 0.38, 0.5, 0.3, 0.46, 0.6, 'logs')
    # binari e carrello con il minerale
    for x in (-0.09, 0.09): m.box(x - 0.012, 0, 0.5, x + 0.012, 0.02, 1.5, 'iron')
    for z in range(8): zz = 0.6 + z * 0.12; m.box(-0.15, 0, zz, 0.15, 0.012, zz + 0.04, 'wood_d')
    m.box(-0.14, 0.04, 0.95, 0.14, 0.2, 1.2, 'wood', top='rubble'); m.box(-0.12, 0.2, 0.97, 0.12, 0.24, 1.18, 'iron')
    for z in (0.98, 1.17): m.cyl(0, 0, 0.001, 0, 0.001, 'iron', 3, top=False)
    # mucchi di minerale e capanno degli attrezzi
    for (x, z, r) in ((0.75, 0.9, 0.24), (1.05, 1.15, 0.18), (-0.75, 1.0, 0.2)): m.cone(x, z, r, 0, r * 0.8, 'rubble', 8)
    house(m, 0.75, 0.0, 1.35, 0.55, 0.32, 0.14, 'x', 'wood_v', 'roof', 0.05, 'wood_v')
    m.door(1.05, 0, 0.55, 0.16, 0.24, 'f', 'dark')
    m.box(-1.2, 0, 0.3, -0.8, 0.05, 0.6, 'wood_d'); m.box(-1.15, 0.05, 0.35, -0.85, 0.12, 0.55, 'rubble')
    m.box(-0.5, 0, 0.55, -0.46, 0.5, 0.59, 'wood_d'); m.door(-0.48, 0.38, 0.59, 0.1, 0.12, 'f', 'fire')
    return m

# ============================================================ CAVA DI PIETRA
def cava():
    m = Mesh()
    # parete di cava tagliata a gradoni
    m.box(-1.2, 0, -0.9, 1.2, 0.85, -0.45, 'rock', sides={'f': 'stone_big'})
    m.box(-1.2, 0, -0.45, 1.2, 0.52, -0.1, 'rock', sides={'f': 'stone_big'}, top='stone_big')
    m.box(-1.2, 0, -0.1, 0.4, 0.24, 0.2, 'rock', sides={'f': 'stone_big', 'r': 'stone_big'}, top='stone_big')
    m.box(0.4, 0, -0.1, 1.2, 0.05, 1.1, 'rubble')
    # blocchi squadrati e capra (gru a cavalletto)
    for (x, z, s) in ((-0.6, 0.55, 0.16), (-0.25, 0.6, 0.14), (-0.42, 0.62, 0.12), (0.2, 0.75, 0.15), (-0.9, 0.85, 0.13)):
        m.box(x - s, 0, z - s * 0.7, x + s, s * 1.1, z + s * 0.7, 'stone_big')
    m.box(-0.55, 0.18, 0.48, -0.3, 0.3, 0.66, 'stone_big')
    for (a, b) in ((0.55, 0.25), (1.05, 0.25)):
        m.quad((a - 0.04, 0, b), (a + 0.04, 0, b), (0.84, 0.95, 0.5), (0.76, 0.95, 0.5), 'wood_d', out=(a, 0, 9)); m.quad((a + 0.04, 0, b), (a - 0.04, 0, b), (0.76, 0.95, 0.5), (0.84, 0.95, 0.5), 'wood_d', out=(a, 0, -9))
    m.quad((0.78, 0, 0.95), (0.84, 0, 0.95), (0.84, 0.95, 0.5), (0.78, 0.95, 0.5), 'wood_d', out=(0.8, 0, 9))
    m.box(0.78, 0.9, 0.3, 0.84, 0.96, 0.75, 'wood')
    m.box(0.8, 0.2, 0.7, 0.81, 0.92, 0.71, 'cloth'); m.box(0.68, 0.06, 0.6, 0.93, 0.2, 0.8, 'stone_big')
    m.box(-1.1, 0, 0.9, -0.7, 0.03, 1.1, 'wood_d'); m.box(-1.0, 0.03, 0.95, -0.98, 0.25, 0.97, 'iron')
    return m

# ============================================================ HORREUM (granaio)
def granaio():
    m = Mesh()
    # granaio rialzato su pilastrini, con contrafforti
    m.box(-1.05, 0, -0.8, 1.05, 0.14, 0.5, 'stone_d')
    for x in [-0.95 + i * 0.27 for i in range(8)]: m.door(x, 0.03, 0.5, 0.08, 0.07, 'f', 'dark')
    house(m, -1.0, -0.75, 1.0, 0.45, 0.66, 0.26, 'x', 'stone', 'roof', 0.08, 'stone', y=0.14)
    for x in [-1.0 + i * 0.4 for i in range(6)]:
        m.box(x - 0.05, 0, 0.45, x + 0.05, 0.7, 0.55, 'stone')
        m.box(x - 0.05, 0, -0.85, x + 0.05, 0.7, -0.75, 'stone')
    for x in (-0.6, 0.6): m.door(x, 0.55, 0.45, 0.1, 0.12, 'f', 'window')
    # rampa di carico e porta
    m.door(0.0, 0.14, 0.45, 0.28, 0.4)
    m.quad((-0.2, 0, 1.0), (0.2, 0, 1.0), (0.2, 0.14, 0.55), (-0.2, 0.14, 0.55), 'wood', out=(0, 9, 9))
    for s in (-1, 1): m.quad((s * 0.2, 0, 1.0), (s * 0.2, 0, 0.55), (s * 0.2, 0.14, 0.55), (s * 0.2, 0.0, 1.0), 'stone_d', out=(s * 9, 0, 0.7))
    # sacchi e anfore
    for (x, z) in ((-0.55, 0.75), (-0.42, 0.78), (-0.48, 0.66), (0.5, 0.72), (0.62, 0.7)): m.cyl(x, z, 0.06, 0, 0.12, 'cloth', 7, r1=0.045)
    for x in (0.85, 0.97): m.amphora(x, 0.75, 0, 0.18)
    return m

# ============================================================ AERARIUM (tesoreria)
def tesoreria():
    m = Mesh()
    temple(m, -0.75, 0.75, -0.95, 0.85, 0.3, 0.62, 4, 0.22, steps=4, rcol=0.045)
    # casse con le monete davanti alla porta, guardie (lance)
    for x in (-0.4, 0.4):
        m.box(x - 0.012, 0, 0.92, x + 0.012, 0.62, 0.94, 'wood_d'); m.box(x - 0.025, 0.62, 0.92, x + 0.025, 0.7, 0.94, 'iron')
    m.box(-0.12, 0.3, 0.05, 0.12, 0.4, 0.15, 'wood', top='gold')
    return m

# ============================================================ CASERMA
def caserma():
    m = Mesh()
    m.box(-1.7, 0, -1.7, 1.7, 0.012, 1.7, 'dirt')
    # due lunghi blocchi di contubernia con portico verso la strada
    for s in (-1, 1):
        x0, x1 = (-1.65, -0.55) if s < 0 else (0.55, 1.65)
        house(m, x0, -1.6, x1, 1.0, 0.48, 0.2, 'z', 'fresco')
        xi = x1 if s < 0 else x0
        for i in range(5):
            z = -1.4 + i * 0.55; m.door(xi, 0, z, 0.16, 0.3, 'r' if s < 0 else 'l')
        for i in range(6):
            z = -1.55 + i * 0.5; m.column(xi - s * 0.0 + (0.22 if s < 0 else -0.22), z, 0, 0.38, 0.03, 'wood_v', 'wood_d')
        if s < 0: m.quad((x1 + 0.25, 0.38, 1.0), (x1 + 0.25, 0.38, -1.6), (x1, 0.48, -1.6), (x1, 0.48, 1.0), 'roof', out=(x1 + 9, 9, 0))
        else: m.quad((x0 - 0.25, 0.38, -1.6), (x0 - 0.25, 0.38, 1.0), (x0, 0.48, 1.0), (x0, 0.48, -1.6), 'roof', out=(x0 - 9, 9, 0))
    # casa del centurione in testa
    house(m, -0.55, -1.6, 0.55, -1.1, 0.56, 0.22, 'x', 'fresco')
    m.door(0, 0, -1.1, 0.2, 0.34)
    # piazza d'armi: pali per le esercitazioni, rastrelliera, vessillo
    m.box(-0.3, 0.012, -1.0, 0.3, 0.02, 1.7, 'paving')
    for (x, z) in ((-0.15, -0.4), (0.15, -0.2), (-0.15, 0.1), (0.15, 0.3)): m.cyl(x, z, 0.035, 0, 0.32, 'logs', 6)
    m.banner(0, 0.65, 0.55, 0.9, 0.2)
    for x in (-1.1, 1.1): m.box(x - 0.2, 0, 1.15, x + 0.2, 0.18, 1.45, 'wood', sides={'f': 'wood_d'})
    for x in (-1.25, -1.1, -0.95, 0.95, 1.1, 1.25): m.door(x, 0.18, 1.45, 0.11, 0.16, 'f', 'scutum')
    return m

# ============================================================ CAMPO DI TIRO
def poligono():
    m = Mesh()
    m.box(-1.6, 0, -1.6, 1.6, 0.015, 1.6, 'grass')
    m.box(-1.6, 0.015, 0.6, 1.6, 0.02, 1.6, 'dirt')
    # bersagli di paglia
    for x in (-1.1, -0.4, 0.3, 1.0):
        z = -1.15
        m.box(x - 0.2, 0, z - 0.05, x + 0.2, 0.08, z + 0.05, 'hay')
        m.quad((x - 0.2, 0.08, z + 0.055), (x + 0.2, 0.08, z + 0.055), (x + 0.2, 0.48, z - 0.02), (x - 0.2, 0.48, z - 0.02), 'target', out=(x, 0.3, 9))
        m.quad((x + 0.2, 0.08, z + 0.05), (x - 0.2, 0.08, z + 0.05), (x - 0.2, 0.48, z - 0.025), (x + 0.2, 0.48, z - 0.025), 'hay', out=(x, 0.3, -9))
        for s in (-1, 1): m.quad((x + s * 0.12, 0, z - 0.22), (x + s * 0.12, 0.02, z - 0.2), (x + s * 0.12, 0.44, z - 0.02), (x + s * 0.12, 0.42, z - 0.04), 'wood_d', out=(x + s * 9, 0, z))
    # linea di tiro con staccionata e tettoia con archi
    for i in range(13): x = -1.55 + i * 0.26; m.box(x - 0.015, 0, 0.55, x + 0.015, 0.16, 0.58, 'wood_d')
    wall_line(m, -1.55, 0.565, 1.57, 0.565, 0.12, 0.14, 'wood', 0.025, 'wood')
    for x in (-1.5, -0.6):
        for z in (0.85, 1.45): m.box(x - 0.025, 0, z - 0.025, x + 0.025, 0.45, z + 0.025, 'wood_d')
    m.shed(-1.55, 0.8, -0.55, 1.5, 0.55, 0.45, 'roof', 0.04) if False else m.gable(-1.55, 0.8, -0.55, 1.5, 0.45, 0.16, 'roof', None, 0.05, 'x')
    for i in range(5): x = -1.4 + i * 0.18; m.box(x - 0.01, 0.0, 1.38, x + 0.01, 0.36, 1.4, 'wood')
    house(m, 0.5, 0.95, 1.5, 1.5, 0.36, 0.16, 'x', 'wood_v', 'roof', 0.05, 'wood_v'); m.door(1.0, 0, 1.5, 0.2, 0.26, 'f', 'dark')
    # frecce piantate e faretre
    for (x, z) in ((-1.05, -1.11), (-1.12, -1.1), (0.32, -1.1), (1.0, -1.12), (0.95, -1.1)): m.box(x - 0.004, 0.22, z, x + 0.004, 0.226, z + 0.18, 'wood')
    m.banner(1.45, 0.62, 0.45, 0.75, 0.16)
    return m

# ============================================================ STALLA (scuderia)
def scuderia():
    m = Mesh()
    house(m, -1.6, -1.5, 1.2, -0.75, 0.52, 0.24, 'x', 'plaster', 'roof', 0.08, 'plaster')
    m.box(-1.6, 0, -1.5, 1.2, 0.18, -0.75, 'stone_d', skip=('t',))
    for i in range(6): x = -1.4 + i * 0.47; m.door(x, 0, -0.75, 0.26, 0.34, 'f', 'door'); m.door(x, 0.4, -0.75, 0.14, 0.07, 'f', 'window')
    m.shed(-1.6, -0.75, 1.2, -0.45, 0.46, 0.38, 'roof', 0.04)
    for x in (-1.55, -0.6, 0.35, 1.15): m.box(x - 0.02, 0, -0.47, x + 0.02, 0.38, -0.43, 'wood_d')
    # recinto con abbeveratoio e fieno
    m.box(-1.6, 0, -0.4, 1.6, 0.012, 1.6, 'dirt')
    for (a, b, c, d) in ((-1.6, 1.6, 1.6, 1.6), (-1.6, -0.35, -1.6, 1.6), (1.6, -0.35, 1.6, 1.6)):
        L = math.hypot(c - a, d - b); n = int(L / 0.3) + 1
        for i in range(n + 1): t = i / n; x, z = a + (c - a) * t, b + (d - b) * t; m.box(x - 0.02, 0, z - 0.02, x + 0.02, 0.22, z + 0.02, 'wood_d')
        for y in (0.1, 0.19): wall_line(m, a, b, c, d, y, y + 0.025, 'wood', 0.025, 'wood')
    m.box(-0.6, 0, 0.3, 0.3, 0.12, 0.45, 'wood', top='water')
    for (x, z) in ((1.0, 0.2), (1.25, 0.6), (-1.2, 1.1)): m.box(x - 0.15, 0, z - 0.1, x + 0.15, 0.16, z + 0.1, 'hay')
    house(m, 1.25, -1.5, 1.6, -0.75, 0.38, 0.14, 'z', 'wood_v', 'thatch', 0.05, 'wood_v')
    return m

# ============================================================ TEMPIO DI MARTE (monastero)
def monastero():
    m = Mesh()
    m.box(-1.7, 0, -1.7, 1.7, 0.02, 1.7, 'paving')
    temple(m, -1.0, 1.0, -1.55, 0.95, 0.42, 0.95, 6, 0.3, steps=7, rcol=0.055)
    # recinto sacro con colonne, altare col fuoco, trofei
    altar(m, 0, 1.3, 1.3)
    for x in (-1.45, 1.45): colonnade_z(m, -1.5, 1.4, x, 0.02, 0.5, 6, 0.035)
    for x in (-1.45, 1.45): m.box(x - 0.06, 0.5, -1.55, x + 0.06, 0.55, 1.45, 'marble')
    for x in (-0.6, 0.6):
        m.cyl(x, 1.35, 0.02, 0, 0.5, 'wood_d', 5); m.door(x, 0.25, 1.37, 0.2, 0.28, 'f', 'scutum'); m.cyl(x, 1.35, 0.06, 0.5, 0.6, 'bronze', 7)
    return m

# ============================================================ TEMPIO DI GIOVE (chiesa)
def chiesa():
    m = Mesh()
    m.box(-1.2, 0, -1.2, 1.2, 0.02, 1.2, 'paving')
    temple(m, -0.75, 0.75, -1.15, 0.75, 0.36, 0.86, 4, 0.26, steps=6, rcol=0.05)
    altar(m, 0, 1.0, 1.1)
    m.column(-0.95, 0.95, 0.02, 0.6, 0.04); m.cone(-0.95, 0.95, 0.06, 0.6, 0.7, 'gold', 6)
    m.column(0.95, 0.95, 0.02, 0.6, 0.04); m.cone(0.95, 0.95, 0.06, 0.6, 0.7, 'gold', 6)
    return m

# ============================================================ TORRE DI GUARDIA (legno)
def torre():
    m = Mesh()
    m.box(-0.38, 0, -0.38, 0.38, 0.16, 0.38, 'rubble', top='stone_d')
    tower_wood(m, 0, 0, 0.6, 1.55, base=0.16)
    m.quad((-0.12, 0.16, 0.6), (0.12, 0.16, 0.6), (0.12, 1.52, 0.33), (-0.12, 1.52, 0.33), 'wood', out=(0, 9, 9))
    for i in range(10): t = i / 10; m.box(-0.13, 0.16 + 1.36 * t, 0.6 - 0.27 * t - 0.01, 0.13, 0.16 + 1.36 * t + 0.02, 0.6 - 0.27 * t + 0.02, 'wood_d')
    m.banner(0.26, 0.26, 1.9, 2.1, 0.12)
    m.box(-0.06, 1.55, -0.06, 0.06, 1.62, 0.06, 'iron'); m.cone(0, 0, 0.05, 1.62, 1.7, 'fire', 5)
    return m

# ============================================================ TORRE DI PIETRA
def torrepietra():
    m = Mesh()
    m.box(-0.62, 0, -0.62, 0.62, 0.12, 0.62, 'stone_d')
    m.box(-0.55, 0.12, -0.55, 0.55, 1.5, 0.55, 'stone_big')
    m.box(-0.6, 1.5, -0.6, 0.6, 1.56, 0.6, 'stone_d')
    for y in (0.6, 1.1):
        for f in 'flrb':
            if f in 'fb': m.door(0, y, 0.55 if f == 'f' else -0.55, 0.12, 0.2, f, 'window')
            else: m.door(0.55 if f == 'r' else -0.55, y, 0, 0.12, 0.2, f, 'window')
    m.door(0, 0.12, 0.55, 0.26, 0.38)
    # piano di guardia coperto
    for sx in (-1, 1):
        for sz in (-1, 1): m.box(sx * 0.52 - 0.05, 1.56, sz * 0.52 - 0.05, sx * 0.52 + 0.05, 1.86, sz * 0.52 + 0.05, 'stone_big')
    for (a, b, c, d) in ((-0.6, 0.6, 0.6, 0.6), (0.6, -0.6, -0.6, -0.6), (-0.6, -0.6, -0.6, 0.6), (0.6, 0.6, 0.6, -0.6)): wall_line(m, a, b, c, d, 1.56, 1.68, 'stone_big', 0.07, 'stone_d')
    m.hip(-0.6, -0.6, 0.6, 0.6, 1.86, 0.5, 'roof', 0.08)
    m.banner(0, 0.64, 0.5, 0.95, 0.18) if False else None
    return m

# ============================================================ MURA (segmento lungo X)
def mura():
    m = Mesh(); L = 0.5; th = 0.24; H = 0.78
    m.box(-L, 0, -th / 2 - 0.03, L, 0.1, th / 2 + 0.03, 'stone_d')
    m.box(-L, 0.1, -th / 2, L, H, th / 2, 'stone_big', top='paving')
    for z in (th / 2 - 0.04, -th / 2 + 0.04):
        for i in range(3):
            x0 = -L + (i + 0.2) * (2 * L / 3); x1 = x0 + (2 * L / 3) * 0.55
            m.box(x0, H, z - 0.04, x1, H + 0.16, z + 0.04, 'stone_big')
    return m

# ============================================================ PALIZZATA (segmento lungo X)
def palizzata():
    m = Mesh(); L = 0.5
    palisade_line(m, -L, 0, L, 0, 0.78, 0.0, 0.034)
    m.box(-L, 0.5, 0.032, L, 0.56, 0.05, 'wood_d')
    return m

# ============================================================ BASILICA (municipio)
def municipio():
    m = Mesh()
    m.box(-1.7, 0, -1.0, 1.7, 0.1, 0.95, 'stone_d', top='paving')
    # navata centrale alta con finestre del claristorio, navate laterali basse
    house(m, -1.5, -0.95, 1.5, 0.3, 1.1, 0.3, 'x', 'plaster_w', 'roof', 0.08, 'plaster_w', y=0.1)
    for s in (-1, 1): m.box(-1.5, 0.1, s * 0.0 + (-0.95 if s < 0 else 0.3) - (0.0), 1.5, 0.11, (-0.95 if s < 0 else 0.3), 'plaster_w')
    for x in [-1.25 + i * 0.36 for i in range(8)]: m.door(x, 0.9, 0.3, 0.12, 0.18, 'f', 'window'); m.door(x, 0.9, -0.95, 0.12, 0.18, 'b', 'window')
    # portico colonnato sul fronte con frontone centrale e iscrizione
    m.stairs(-1.6, 1.6, 0.95, 0.0, 0.1, 2, 0.12, 'marble')
    colonnade(m, -1.45, 1.45, 0.72, 0.1, 0.62, 9, 0.042)
    m.box(-1.52, 0.62, 0.3, 1.52, 0.7, 0.8, 'marble', sides={'f': 'inscr'})
    m.shed(-1.52, 0.3, 1.52, 0.8, 0.82, 0.7, 'roof', 0.03)
    m.box(-0.5, 0.7, 0.76, 0.5, 0.74, 0.82, 'marble'); m.gable(-0.5, 0.3, 0.5, 0.82, 0.74, 0.2, 'roof', 'marble', 0.03, 'z')
    m.door(0, 0.1, 0.3, 0.3, 0.42); m.door(-0.7, 0.1, 0.3, 0.2, 0.34); m.door(0.7, 0.1, 0.3, 0.2, 0.34)
    # meridiana e statua sulla piazza
    m.box(1.05, 0.1, 0.82, 1.25, 0.22, 0.92, 'marble'); m.box(1.14, 0.22, 0.86, 1.16, 0.34, 0.88, 'bronze')
    m.box(-1.25, 0.1, 0.8, -1.05, 0.3, 0.92, 'marble'); m.cyl(-1.15, 0.86, 0.04, 0.3, 0.5, 'bronze', 6)
    return m

# ============================================================ FORUM (mercato)
def mercato():
    m = Mesh()
    m.box(-1.7, 0, -1.5, 1.7, 0.04, 1.6, 'paving')
    # portici su tre lati con le botteghe dietro
    house(m, -1.65, -1.5, 1.65, -1.0, 0.5, 0.18, 'x', 'fresco')
    for x in [-1.35 + i * 0.54 for i in range(6)]: m.door(x, 0.04, -1.0, 0.36, 0.32, 'f', 'shop')
    portico(m, -1.65, 1.65, -1.0, -0.7, 0.04, 9, 0.4, 0.07)
    for s in (-1, 1):
        x0, x1 = (-1.65, -1.25) if s < 0 else (1.25, 1.65)
        house(m, x0, -0.7, x1, 1.0, 0.44, 0.16, 'z', 'fresco')
        xi = x1 if s < 0 else x0
        for z in (-0.4, 0.15, 0.7): m.door(xi, 0.04, z, 0.32, 0.3, 'r' if s < 0 else 'l', 'shop')
        colonnade_z(m, -0.62, 0.95, xi - s * (-0.22) if False else (xi + 0.22 if s < 0 else xi - 0.22), 0.04, 0.4, 5, 0.033)
        if s < 0: m.quad((x1 + 0.27, 0.42, 1.0), (x1 + 0.27, 0.42, -0.7), (x1, 0.5, -0.7), (x1, 0.5, 1.0), 'roof', out=(x1 + 9, 9, 0))
        else: m.quad((x0 - 0.27, 0.42, -0.7), (x0 - 0.27, 0.42, 1.0), (x0, 0.5, 1.0), (x0, 0.5, -0.7), 'roof', out=(x0 - 9, 9, 0))
    # bancarelle con tende a strisce
    for (x, z) in ((-0.55, 0.2), (0.55, 0.2), (-0.55, 0.9), (0.55, 0.9), (0.0, -0.35)):
        m.box(x - 0.2, 0.04, z - 0.1, x + 0.2, 0.2, z + 0.1, 'wood', sides={'f': 'wood_d'})
        for c, xx in (('field', x - 0.1), ('terra', x), ('hay', x + 0.1)): m.box(xx - 0.04, 0.2, z - 0.06, xx + 0.04, 0.24, z + 0.06, c)
        for px in (x - 0.2, x + 0.2): m.box(px - 0.01, 0.04, z - 0.12, px + 0.01, 0.4, z - 0.1, 'wood_d')
        m.shed(x - 0.24, z - 0.15, x + 0.24, z + 0.17, 0.42, 0.36, 'awning', 0.0)
    # colonna onoraria con la statua
    m.box(-0.12, 0.04, 1.2, 0.12, 0.2, 1.44, 'marble', sides={'f': 'inscr'}); m.column(0, 1.32, 0.2, 0.78, 0.05); m.box(-0.04, 0.78, 1.28, 0.04, 0.9, 1.36, 'bronze')
    for (x, z) in ((-1.0, 1.3), (1.0, 1.3), (1.05, 0.0)): m.amphora(x, z, 0.04, 0.17)
    return m

# ============================================================ SEPOLCRETO (cripta)
def cripta():
    m = Mesh()
    m.box(-1.2, 0, -1.2, 1.2, 0.012, 1.2, 'grass')
    m.box(-0.25, 0.012, -1.2, 0.25, 0.02, 1.2, 'paving')
    # mausoleo a tamburo su base quadrata
    m.box(-0.95, 0, -1.05, -0.3, 0.3, -0.4, 'stone_big', sides={'r': 'inscr'})
    m.cyl(-0.625, -0.725, 0.28, 0.3, 0.62, 'marble', 14, top=False); m.cyl(-0.625, -0.725, 0.3, 0.62, 0.66, 'marble', 14, top=False)
    m.cone(-0.625, -0.725, 0.3, 0.66, 0.92, 'roof', 14); m.box(-0.66, 0.9, -0.76, -0.59, 1.0, -0.69, 'gold')
    # edicola funeraria con frontone
    m.box(0.35, 0, -1.0, 0.95, 0.18, -0.45, 'stone', top='marble')
    walls4(m, 0.42, -0.95, 0.88, -0.55, 0.6, 'marble'); m.door(0.65, 0.18, -0.55, 0.2, 0.3, 'f', 'dark')
    m.gable(0.4, -0.97, 0.9, -0.53, 0.6, 0.16, 'roof', 'marble', 0.03, 'z')
    # stele lungo la via e cipressi
    for i, z in enumerate((-0.05, 0.35, 0.75)):
        for s in (-1, 1):
            x = s * 0.45; m.box(x - 0.08, 0, z - 0.03, x + 0.08, 0.26, z + 0.03, 'marble', sides={'f': 'inscr'}); m.tri((x - 0.08, 0.26, z + 0.031), (x + 0.08, 0.26, z + 0.031), (x, 0.32, z + 0.031), 'marble', out=(x, 0.3, 9))
    for (x, z) in ((-0.95, 0.2), (0.95, 0.2), (-0.95, 0.9), (0.95, 0.9)):
        m.cyl(x, z, 0.02, 0, 0.1, 'wood_d', 5); m.cone(x, z, 0.1, 0.08, 0.7, 'green', 8)
    for x in (-0.15, 0.15): m.box(x - 0.02, 0, 1.0, x + 0.02, 0.3, 1.04, 'iron'); m.cone(x, 1.02, 0.03, 0.3, 0.36, 'fire', 5)
    return m

# ============================================================ BIBLIOTECA (accademia)
def accademia():
    m = Mesh()
    m.box(-1.7, 0, -1.2, 1.7, 0.08, 1.0, 'stone_d', top='paving')
    # edificio a due piani con portico sul fronte
    house(m, -1.5, -1.15, 1.5, 0.15, 1.0, 0.3, 'x', 'plaster_w', 'roof', 0.08, 'plaster_w', y=0.08)
    m.box(-1.52, 0.55, 0.15, 1.52, 0.6, 0.2, 'marble')
    for x in [-1.2 + i * 0.4 for i in range(7)]: m.door(x, 0.7, 0.15, 0.16, 0.24, 'f', 'window')
    m.stairs(-0.6, 0.6, 1.0, 0.0, 0.08, 2, 0.12, 'marble')
    colonnade(m, -1.4, 1.4, 0.68, 0.08, 0.55, 8, 0.04)
    m.box(-1.48, 0.55, 0.15, 1.48, 0.62, 0.76, 'marble', sides={'f': 'inscr'})
    m.shed(-1.48, 0.15, 1.48, 0.76, 0.74, 0.62, 'roof', 0.03)
    m.door(0, 0.08, 0.15, 0.3, 0.4)
    for x in (-0.8, 0.8): m.door(x, 0.08, 0.15, 0.4, 0.36, 'f', 'shop')
    # esedra con i sedili e una statua di filosofo
    m.box(-0.35, 0.08, 0.82, 0.35, 0.2, 0.92, 'marble'); m.box(-0.08, 0.2, 0.84, 0.08, 0.32, 0.9, 'marble'); m.cyl(0, 0.87, 0.05, 0.32, 0.5, 'bronze', 7)
    # rotoli su un tavolo
    m.box(1.05, 0.2, 0.82, 1.45, 0.23, 0.95, 'wood'); m.box(1.08, 0.08, 0.85, 1.11, 0.2, 0.92, 'wood_d'); m.box(1.39, 0.08, 0.85, 1.42, 0.2, 0.92, 'wood_d')
    for x in (1.12, 1.22, 1.32): m.box(x - 0.03, 0.23, 0.86, x + 0.03, 0.26, 0.92, 'cloth')
    return m

# ============================================================ MURA CON PORTA (cancello)
def cancello():
    m = Mesh(); th = 0.36
    for x in (-0.82, 0.82):
        m.box(x - 0.3, 0, -th / 2 - 0.06, x + 0.3, 1.15, th / 2 + 0.06, 'stone_big')
        m.box(x - 0.33, 1.15, -th / 2 - 0.09, x + 0.33, 1.2, th / 2 + 0.09, 'stone_d')
        for (a, b, c, d) in ((x - 0.33, th / 2 + 0.05, x + 0.33, th / 2 + 0.05), (x - 0.33, -th / 2 - 0.05, x + 0.33, -th / 2 - 0.05)): merlons(m, a, b, c, d, 1.2, 0.13, 0.06, 'stone_big', 0.06)
        m.door(x, 0.65, th / 2 + 0.06, 0.1, 0.18, 'f', 'window'); m.door(x, 0.65, -th / 2 - 0.06, 0.1, 0.18, 'b', 'window')
    # arco della porta con l'iscrizione e il passaggio
    m.box(-0.52, 0.62, -th / 2, 0.52, 0.95, th / 2, 'stone_big', sides={'f': 'inscr'}, bottom=True)
    for (a, b) in ((th / 2, 'f'), (-th / 2, 'b')): merlons(m, -0.52, a, 0.52, a, 0.95, 0.12, 0.06, 'stone_big', 0.06)
    m.box(-0.52, 0, -0.02, 0.52, 0.62, 0.02, 'iron') if False else None
    for i in range(7): x = -0.45 + i * 0.15; m.box(x - 0.012, 0.02, -0.01, x + 0.012, 0.62, 0.01, 'iron')
    for y in (0.15, 0.35, 0.55): m.box(-0.52, y, -0.01, 0.52, y + 0.025, 0.01, 'iron')
    m.box(-0.52, 0, -th / 2, 0.52, 0.015, th / 2, 'paving')
    for x in (-0.32, 0.32): m.banner(x, th / 2 + 0.1, 0.62, 0.92, 0.14)
    return m

BUILDERS2 = {k: v for k, v in dict(castrum=castrum, castello=castello, taverna=taverna, fattoria=fattoria, capanna=capanna, fucina=fucina, armeria=armeria,
    infermeria=infermeria, miniera=miniera, cava=cava, granaio=granaio, tesoreria=tesoreria, caserma=caserma, poligono=poligono, scuderia=scuderia,
    monastero=monastero, chiesa=chiesa, torre=torre, torrepietra=torrepietra, mura=mura, palizzata=palizzata, municipio=municipio, mercato=mercato,
    cripta=cripta, accademia=accademia, cancello=cancello).items()}

# ============================================================ ARA VOTIVA (croce)
def croce():
    m = Mesh()
    m.box(-0.34, 0, -0.26, 0.34, 0.06, 0.26, 'stone_d', top='paving')
    m.box(-0.22, 0.06, -0.15, 0.22, 0.42, 0.15, 'marble', sides={'f': 'inscr'})
    m.box(-0.27, 0.42, -0.19, 0.27, 0.48, 0.19, 'marble')
    for x in (-0.22, 0.22): m.cyl(x, 0, 0.05, 0.48, 0.52, 'marble', 7)
    m.box(-0.12, 0.48, -0.08, 0.12, 0.5, 0.08, 'stone_d'); m.box(-0.08, 0.5, -0.05, 0.08, 0.55, 0.05, 'hay')
    m.amphora(0.27, 0.2, 0.06, 0.16)
    return m
BUILDERS2['croce'] = croce
