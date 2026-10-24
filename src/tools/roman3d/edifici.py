#!/usr/bin/env python3
# Edifici romani di IMPERIUM, costruiti a mano con kit.py.
# Uso: python3 src/tools/roman3d/edifici.py [nome ...] [--preview cartella]
# Senza nomi li rigenera tutti e scrive m3d_<nome>.js in radice (convenzioni: +Y su, fronte verso +Z).
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import Mesh, init, preview, V
import kit

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

def wall(m, x0, z0, x1, z1, y0, y1, mat='fresco', th=0.06):
    """muro spesso tra due punti (sul piano), con lo zoccolo dipinto sempre in basso"""
    import numpy as np
    d = np.array([x1 - x0, z1 - z0], float); L = np.linalg.norm(d); d /= L; n = np.array([-d[1], d[0]]) * th / 2
    a0, a1 = (x0 + n[0], z0 + n[1]), (x1 + n[0], z1 + n[1]); b0, b1 = (x0 - n[0], z0 - n[1]), (x1 - n[0], z1 - n[1])
    rep = (1.0, y1 - y0) if mat == 'fresco' else None
    cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
    m.quad((a0[0], y0, a0[1]), (a1[0], y0, a1[1]), (a1[0], y1, a1[1]), (a0[0], y1, a0[1]), mat, out=(cx + n[0] * 99, y0, cz + n[1] * 99), rep=rep)
    m.quad((b1[0], y0, b1[1]), (b0[0], y0, b0[1]), (b0[0], y1, b0[1]), (b1[0], y1, b1[1]), mat, out=(cx - n[0] * 99, y0, cz - n[1] * 99), rep=rep)
    m.quad((a0[0], y1, a0[1]), (a1[0], y1, a1[1]), (b1[0], y1, b1[1]), (b0[0], y1, b0[1]), 'plaster_w', out=(cx, y1 + 9, cz))
    for (p, q) in ((a0, b0), (a1, b1)):
        m.quad((p[0], y0, p[1]), (q[0], y0, q[1]), (q[0], y1, q[1]), (p[0], y1, p[1]), mat, out=((p[0] + q[0]) / 2 + (p[0] - cx) * 9, y0, (p[1] + q[1]) / 2 + (p[1] - cz) * 9), rep=rep)

def block(m, x0, z0, x1, z1, h, wallm='fresco', roof='roof', rh=0.32, axis='x', over=0.1, end=None):
    """corpo di fabbrica con tetto a capanna di coppi"""
    rep = (1.0, h) if wallm == 'fresco' else None
    c = ((x0 + x1) / 2, h / 2, (z0 + z1) / 2)
    m.quad((x0, 0, z1), (x1, 0, z1), (x1, h, z1), (x0, h, z1), wallm, out=(c[0], c[1], z1 + 9), rep=rep)
    m.quad((x1, 0, z0), (x0, 0, z0), (x0, h, z0), (x1, h, z0), wallm, out=(c[0], c[1], z0 - 9), rep=rep)
    m.quad((x0, 0, z0), (x0, 0, z1), (x0, h, z1), (x0, h, z0), wallm, out=(x0 - 9, c[1], c[2]), rep=rep)
    m.quad((x1, 0, z1), (x1, 0, z0), (x1, h, z0), (x1, h, z1), wallm, out=(x1 + 9, c[1], c[2]), rep=rep)
    if roof: m.gable(x0, z0, x1, z1, h, rh, roof, end or ('plaster_w' if wallm in ('fresco', 'plaster') else wallm), over, axis)

# ============================================================ DOMUS
def casa():
    m = Mesh()
    # fronte: due tabernae ai lati e l'ingresso (fauces) al centro
    block(m, -1.15, 0.3, 1.15, 0.85, 0.5, rh=0.2)
    # retro: tablinum e cubicula, più alto
    block(m, -1.15, -0.85, 1.15, -0.3, 0.8, rh=0.28)
    # ali laterali basse con tetto verso l'atrio
    for s in (-1, 1):
        x0, x1 = (-1.15, -0.62) if s < 0 else (0.62, 1.15)
        block(m, x0, -0.3, x1, 0.3, 0.5, roof=None)
        xo, xi = (x0, x1) if s < 0 else (x1, x0)
        m.quad((xi + s * 0.1, 0.44, 0.32), (xi + s * 0.1, 0.44, -0.32), (xo - s * 0.06, 0.62, -0.32), (xo - s * 0.06, 0.62, 0.32), 'roof', out=(xi, 9, 0))
    # atrio con impluvium
    m.box(-0.62, 0, -0.3, 0.62, 0.02, 0.25, 'mosaic')
    m.box(-0.26, 0.02, -0.16, 0.26, 0.05, 0.12, 'marble'); m.box(-0.22, 0.05, -0.12, 0.22, 0.052, 0.08, 'water')
    # tetti inclinati verso l'atrio (compluvium) davanti e dietro
    m.quad((-0.62, 0.42, 0.16), (0.62, 0.42, 0.16), (0.62, 0.5, 0.3), (-0.62, 0.5, 0.3), 'roof', out=(0, 9, 0))
    m.quad((0.62, 0.5, -0.16), (-0.62, 0.5, -0.16), (-0.62, 0.64, -0.3), (0.62, 0.64, -0.3), 'roof', out=(0, 9, 0))
    # porta, botteghe e finestrelle sul fronte
    m.door(0, 0, 0.85, 0.24, 0.36); m.box(-0.17, 0, 0.85, -0.13, 0.4, 0.9, 'marble'); m.box(0.13, 0, 0.85, 0.17, 0.4, 0.9, 'marble'); m.box(-0.18, 0.39, 0.85, 0.18, 0.44, 0.91, 'marble')
    for x in (-0.72, 0.72):
        m.door(x, 0, 0.85, 0.42, 0.32, mat='shop')
        m.shed(x - 0.27, 0.86, x + 0.27, 1.04, 0.4, 0.34, 'awning', 0.0)
        for px in (x - 0.25, x + 0.25): m.box(px - 0.012, 0, 1.02, px + 0.012, 0.34, 1.04, 'wood_d')
    for x in (-0.95, -0.45, 0.45, 0.95): m.door(x, 0.6, -0.3 + 0.001, 0.1, 0.1, 'f', 'window')
    for z in (-0.6,):
        m.door(-1.15, 0.45, z, 0.12, 0.12, 'l', 'window'); m.door(1.15, 0.45, z, 0.12, 0.12, 'r', 'window')
    # orto con siepe sul retro (peristilio in miniatura)
    m.box(-1.15, 0, -1.12, 1.15, 0.015, -0.85, 'grass')
    for x in (-0.9, -0.3, 0.3, 0.9): m.box(x - 0.12, 0, -1.08, x + 0.12, 0.1, -0.95, 'hedge')
    m.amphora(1.0, 1.0); m.amphora(-1.02, 0.98)
    return m

from altri import BUILDERS2
BUILDERS = {'casa': casa, **BUILDERS2}

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; pv = None
    if '--preview' in sys.argv: pv = sys.argv[sys.argv.index('--preview') + 1]; args = [a for a in args if a != pv]
    init()
    for name in (args or list(BUILDERS)):
        m = BUILDERS[name]()
        nv, nt, kb = m.export(name, os.path.join(REPO, f'm3d_{name}.js'))
        print(f'{name:14s} {nv:6d} vertici {nt:6d} triangoli {kb:5d} KB')
        if pv: os.makedirs(pv, exist_ok=True); preview(m, os.path.join(pv, f'{name}.png'))

if __name__ == '__main__': main()
