#!/usr/bin/env python3
# GLB (Meshy) -> M3D js module: vertex-clustering decimation, quantized buffers, 1024 jpeg texture
import json, struct, sys, io, base64
import numpy as np
from PIL import Image

def load(path):
    f = open(path, 'rb'); f.read(12)
    L, _ = struct.unpack('<II', f.read(8)); j = json.loads(f.read(L))
    L2, _ = struct.unpack('<II', f.read(8)); binv = memoryview(f.read(L2))
    def acc(i):
        a = j['accessors'][i]; bv = j['bufferViews'][a['bufferView']]
        dt = {5126: np.float32, 5125: np.uint32, 5123: np.uint16, 5121: np.uint8}[a['componentType']]
        nc = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
        off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(binv, dtype=dt, count=a['count'] * nc, offset=off).reshape(-1, nc) if nc > 1 else np.frombuffer(binv, dtype=dt, count=a['count'], offset=off)
    P, I, NN, UV = [], [], [], []; base = 0
    for m in j['meshes']:
        for p in m['primitives']:
            pos = acc(p['attributes']['POSITION']).astype(np.float32)
            nor = acc(p['attributes']['NORMAL']).astype(np.float32) if 'NORMAL' in p['attributes'] else np.zeros_like(pos)
            uv = acc(p['attributes']['TEXCOORD_0']).astype(np.float32)
            idx = acc(p['indices']).astype(np.int64)
            P.append(pos); NN.append(nor); UV.append(uv); I.append(idx + base); base += len(pos)
    mat = j['materials'][0]; ti = mat['pbrMetallicRoughness']['baseColorTexture']['index']
    img = j['images'][j['textures'][ti]['source']]; bv = j['bufferViews'][img['bufferView']]
    tex = Image.open(io.BytesIO(bytes(binv[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]))).convert('RGB')
    return np.concatenate(P), np.concatenate(NN), np.concatenate(UV), np.concatenate(I).reshape(-1, 3), tex

def cluster(P, N, UV, T, G, uvb):
    mn = P.min(0); sz = (P.max(0) - mn).max()
    q = np.clip(((P - mn) / sz * G).astype(np.int64), 0, G)
    u = np.clip(UV * uvb, 0, uvb).astype(np.int64)
    key = ((q[:, 0] * (G + 1) + q[:, 1]) * (G + 1) + q[:, 2]) * ((uvb + 1) ** 2) + u[:, 0] * (uvb + 1) + u[:, 1]
    uk, inv = np.unique(key, return_inverse=True); n = len(uk)
    cnt = np.bincount(inv, minlength=n).astype(np.float64)
    Pc = np.stack([np.bincount(inv, P[:, k], n) for k in range(3)], 1) / cnt[:, None]
    Nc = np.stack([np.bincount(inv, N[:, k], n) for k in range(3)], 1); Nc /= np.maximum(1e-9, np.linalg.norm(Nc, axis=1))[:, None]
    UVc = np.stack([np.bincount(inv, UV[:, k], n) for k in range(2)], 1) / cnt[:, None]
    t = inv[T]; ok = (t[:, 0] != t[:, 1]) & (t[:, 1] != t[:, 2]) & (t[:, 0] != t[:, 2]); t = t[ok]
    t = t[np.unique(np.sort(t, 1), axis=0, return_index=True)[1]] if len(t) else t
    used = np.unique(t); remap = -np.ones(n, np.int64); remap[used] = np.arange(len(used))
    return Pc[used], Nc[used], UVc[used], remap[t]

def main(src, name, out, target_tris=16000, texsize=1024):
    P, N, UV, T, tex = load(src)
    print(name, 'in', len(P), 'verts', len(T), 'tris')
    lo, hi, best = 12, 200, None
    for _ in range(12):
        G = (lo + hi) // 2
        r = cluster(P, N, UV, T, G, 8)
        if len(r[3]) > target_tris or len(r[0]) > 65000: hi = G - 1
        else: best = r; lo = G + 1
        if lo > hi: break
    Pc, Nc, UVc, Tc = best
    print(name, 'out', len(Pc), 'verts', len(Tc), 'tris')
    mn = Pc.min(0); size = np.maximum(1e-6, Pc.max(0) - mn)
    pos = np.round((Pc - mn) / size * 65535).astype(np.uint16)
    nor = np.zeros((len(Nc), 4), np.int8); nor[:, :3] = np.round(Nc * 127).astype(np.int8)
    uv = np.round(np.clip(UVc, 0, 1) * 65535).astype(np.uint16)
    idx = Tc.astype(np.uint16)
    tex = tex.resize((texsize, texsize), Image.LANCZOS); bb = io.BytesIO(); tex.save(bb, 'JPEG', quality=82, optimize=True)
    b64 = lambda a: base64.b64encode(a.tobytes()).decode()
    js = (f"M3D.{name}={{min:{mn.tolist()},size:{size.tolist()},n:{len(Pc)},pos:'{b64(pos)}',nor:'{b64(nor)}',uv:'{b64(uv)}',idx:'{b64(idx)}',"
          f"tex:'data:image/jpeg;base64,{base64.b64encode(bb.getvalue()).decode()}'}};\n")
    open(out, 'w').write(js); print(name, 'KB', len(js) // 1024)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 16000)
