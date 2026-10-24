#!/usr/bin/env python3
# Divide un GLB "kit" di Meshy (tanti oggetti in un'unica mesh) in oggetti separati.
# Uso: python3 glbsplit.py kit.glb prefisso cartella_out [tris_per_oggetto] [margine_unione, negativo = solo sovrapposizioni vere]
#  -> cartella_out/<prefisso>_<n>.js (moduli M3D) + elenco con dimensioni
import sys, os, io, base64, json
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from glb2m3d import load, cluster

def find(p, i):
    while p[i] != i: p[i] = p[p[i]]; i = p[i]
    return i

def split(P, T, merge_margin=0.012):
    sz = (P.max(0) - P.min(0)).max(); q = np.round((P - P.min(0)) / sz * 20000).astype(np.int64)
    key = (q[:, 0] * 20001 + q[:, 1]) * 20001 + q[:, 2]; _, vid = np.unique(key, return_inverse=True)
    n = vid.max() + 1; par = np.arange(n)
    tv = vid[T]
    for a, b in ((0, 1), (1, 2)):
        for x, y in zip(tv[:, a], tv[:, b]):
            rx, ry = find(par, x), find(par, y)
            if rx != ry: par[rx] = ry
    root = np.array([find(par, i) for i in range(n)]); comp_of_tri = root[tv[:, 0]]
    comps = {}
    for ti, c in enumerate(comp_of_tri): comps.setdefault(c, []).append(ti)
    comps = list(comps.values())
    # unisci i pezzi i cui volumi si sovrappongono
    bb = []
    for tl in comps:
        v = P[T[tl].ravel()]; bb.append((v[:, 0].min(), v[:, 0].max(), v[:, 2].min(), v[:, 2].max(), v[:, 1].min(), v[:, 1].max()))
    m = merge_margin * sz; k = len(comps); par2 = list(range(k))
    def f2(i):
        while par2[i] != i: par2[i] = par2[par2[i]]; i = par2[i]
        return i
    for i in range(k):
        for j in range(i + 1, k):
            a, b = bb[i], bb[j]
            if a[0] - m < b[1] and b[0] - m < a[1] and a[2] - m < b[3] and b[2] - m < a[3] and a[4] - m < b[5] and b[4] - m < a[5]:
                ri, rj = f2(i), f2(j)
                if ri != rj: par2[ri] = rj
    groups = {}
    for i in range(k): groups.setdefault(f2(i), []).extend(comps[i])
    return [np.array(g) for g in groups.values()]

def write(name, P, N, UV, T, tex, out, target):
    used = np.unique(T); rm = -np.ones(len(P), np.int64); rm[used] = np.arange(len(used))
    P, N, UV, T = P[used], N[used], UV[used], rm[T]
    # ritaglia la texture alla zona usata
    W, H = tex.size; u0, v0 = np.clip(UV.min(0), 0, 1); u1, v1 = np.clip(UV.max(0), 0, 1)
    pad = 4 / W; u0, v0, u1, v1 = max(0, u0 - pad), max(0, v0 - pad), min(1, u1 + pad), min(1, v1 + pad)
    crop = tex.crop((int(u0 * W), int(v0 * H), int(np.ceil(u1 * W)), int(np.ceil(v1 * H))))
    UV = (UV - [u0, v0]) / [max(1e-6, u1 - u0), max(1e-6, v1 - v0)]
    lo, hi, best = 12, 260, None
    for _ in range(14):
        G = (lo + hi) // 2; r = cluster(P, N, UV, T, G, 16)
        if len(r[3]) > target or len(r[0]) > 65000: hi = G - 1
        else: best = r; lo = G + 1
        if lo > hi: break
    if best is None: best = cluster(P, N, UV, T, 12, 16)
    Pc, Nc, UVc, Tc = best
    mn = Pc.min(0); size = np.maximum(1e-6, Pc.max(0) - mn)
    pos = np.round((Pc - mn) / size * 65535).astype(np.uint16); nor = np.zeros((len(Nc), 4), np.int8); nor[:, :3] = np.round(Nc * 127).astype(np.int8)
    uv = np.round(np.clip(UVc, 0, 1) * 65535).astype(np.uint16); idx = Tc.astype(np.uint16)
    cw, ch = crop.size; s = min(1, 512 / max(cw, ch)); crop = crop.resize((max(8, int(cw * s)), max(8, int(ch * s))), Image.LANCZOS)
    bb = io.BytesIO(); crop.save(bb, 'JPEG', quality=84, optimize=True); b64 = lambda a: base64.b64encode(a.tobytes()).decode()
    js = (f"M3D.{name}={{min:{mn.tolist()},size:{size.tolist()},n:{len(Pc)},pos:'{b64(pos)}',nor:'{b64(nor)}',uv:'{b64(uv)}',idx:'{b64(idx)}',"
          f"tex:'data:image/jpeg;base64,{base64.b64encode(bb.getvalue()).decode()}'}};\n")
    open(out, 'w').write(js); return len(Tc), len(js) // 1024, size.tolist()

if __name__ == '__main__':
    src, pre, od = sys.argv[1], sys.argv[2], sys.argv[3]; target = int(sys.argv[4]) if len(sys.argv) > 4 else 5000; mm = float(sys.argv[5]) if len(sys.argv) > 5 else 0.012
    os.makedirs(od, exist_ok=True); P, N, UV, T, tex = load(src)
    groups = split(P, T, mm); P0 = P.min(0); sz = (P.max(0) - P0).max()
    info = []
    for g in groups:
        v = P[T[g].ravel()]; info.append((v[:, 2].mean(), v[:, 0].mean(), g, (v.max(0) - v.min(0)).max() / sz))
    info = [x for x in info if x[3] > 0.02]
    info.sort(key=lambda x: (round(x[0] / (sz * 0.08)), x[1]))  # righe (Z) poi colonne (X)
    meta = []
    for i, (zc, xc, g, rel) in enumerate(info):
        name = f'{pre}_{i}'; ntri, kb, size = write(name, P, N, UV, T[g], tex, os.path.join(od, f'm3d_{name}.js'), target)
        meta.append({'name': name, 'x': round(float(xc), 3), 'z': round(float(zc), 3), 'size': [round(s, 3) for s in size], 'tris': ntri, 'kb': kb})
    json.dump(meta, open(os.path.join(od, pre + '_meta.json'), 'w'), indent=0); print(len(meta), 'oggetti')
