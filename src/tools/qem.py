#!/usr/bin/env python3
# Riduzione dei poligoni a "quadriche" (Garland-Heckbert): toglie per primi gli spigoli che cambiano meno la forma,
# così archi e pilastri sottili restano in piedi (il raggruppamento su griglia di glb2m3d li cancellerebbe).
# Le coordinate di texture restano per angolo di triangolo, quindi le giunture della texture non si strappano.
import heapq, numpy as np

def weld(P, T, UV):
    """unisce i vertici con la stessa posizione; restituisce posizioni, triangoli e uv per angolo"""
    q = np.round(P * 1e5).astype(np.int64)
    _, first, inv = np.unique(q, axis=0, return_index=True, return_inverse=True)
    inv = inv.reshape(-1)
    return P[first].astype(np.float64), inv[T], UV[T].astype(np.float64)

def quadrics(P, F):
    a, b, c = P[F[:, 0]], P[F[:, 1]], P[F[:, 2]]
    n = np.cross(b - a, c - a); area = np.linalg.norm(n, axis=1); n = n / np.maximum(area, 1e-20)[:, None]
    d = -np.einsum('ij,ij->i', n, a); pl = np.concatenate([n, d[:, None]], 1)
    K = np.einsum('i,ij,ik->ijk', area, pl, pl)          # pesato per area
    Q = np.zeros((len(P), 4, 4))
    for k in range(3): np.add.at(Q, F[:, k], K)
    return Q

def boundary_quadrics(P, F, Q, w=4.0):
    """bordi aperti: piani perpendicolari al bordo, perché la sagoma non si ritiri"""
    E = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]); fi = np.tile(np.arange(len(F)), 3)
    key = np.sort(E, 1); _, idx, cnt = np.unique(key, axis=0, return_index=True, return_counts=True)
    be = idx[cnt == 1]
    for e in be:
        i, j = E[e]; f = F[fi[e]]
        a, b, c = P[f[0]], P[f[1]], P[f[2]]; fn = np.cross(b - a, c - a); fl = np.linalg.norm(fn)
        if fl < 1e-20: continue
        fn /= fl; ed = P[j] - P[i]; L = np.linalg.norm(ed)
        if L < 1e-20: continue
        n = np.cross(ed / L, fn); d = -n @ P[i]; pl = np.append(n, d); K = np.outer(pl, pl) * L * L * w
        Q[i] += K; Q[j] += K

def simplify(P, F, CUV, target, log=print):
    nV = len(P); F = F.copy(); CUV = CUV.copy(); alive = np.ones(len(F), bool)
    # niente triangoli degeneri in partenza
    bad = (F[:, 0] == F[:, 1]) | (F[:, 1] == F[:, 2]) | (F[:, 0] == F[:, 2]); alive[bad] = False
    Q = quadrics(P, F[alive]) if alive.all() else quadrics(P, F[alive])
    boundary_quadrics(P, F[alive], Q)
    vf = [[] for _ in range(nV)]
    for f in np.nonzero(alive)[0]:
        for k in range(3): vf[F[f, k]].append(f)
    vf = [set(x) for x in vf]
    stamp = np.zeros(nV, np.int64)
    P = P.copy(); H4 = np.ones(4)

    def cost(u, v):
        Qs = Q[u] + Q[v]; best = None
        for tgt in (v, u):
            p = np.append(P[tgt], 1.0); c = p @ Qs @ p
            if best is None or c < best[0]: best = (c, tgt)
        return best

    # coda iniziale calcolata in blocco
    E = np.concatenate([F[alive][:, [0, 1]], F[alive][:, [1, 2]], F[alive][:, [2, 0]]]); E = np.unique(np.sort(E, 1), axis=0)
    u, v = E[:, 0], E[:, 1]; Qs = Q[u] + Q[v]
    pu = np.concatenate([P[u], np.ones((len(u), 1))], 1); pv = np.concatenate([P[v], np.ones((len(v), 1))], 1)
    cu = np.einsum('ij,ijk,ik->i', pu, Qs, pu); cv = np.einsum('ij,ijk,ik->i', pv, Qs, pv)
    heap = [(min(a, b), int(x), int(y), 0, 0) for a, b, x, y in zip(cu, cv, u, v)]; heapq.heapify(heap)
    nf = int(alive.sum()); log(f'  quadriche: {nf} triangoli -> {target}')
    step = 0
    while nf > target and heap:
        c, a, b, sa, sb = heapq.heappop(heap)
        if stamp[a] != sa or stamp[b] != sb: continue
        fa, fb = vf[a], vf[b]
        if not fa or not fb: continue
        shared = fa & fb
        if not shared: continue
        cc, keep = cost(a, b); rem = b if keep == a else a
        # il triangolo non deve ribaltarsi
        ok = True; newp = P[keep]
        for f in vf[rem] - shared:
            tri = F[f]; pts = P[tri].copy(); n0 = np.cross(pts[1] - pts[0], pts[2] - pts[0])
            pts[list(tri).index(rem)] = newp; n1 = np.cross(pts[1] - pts[0], pts[2] - pts[0])
            l0, l1 = np.linalg.norm(n0), np.linalg.norm(n1)
            if l1 < 1e-24 or (l0 > 1e-24 and n0 @ n1 < 0.3 * l0 * l1): ok = False; break
        if not ok:
            stamp[a] += 0; continue
        # coppie (uv del vertice tolto, uv di quello tenuto) nella stessa isola di texture, dai triangoli che spariscono
        pairs = []
        for f in shared:
            tl = list(F[f]); pairs.append((CUV[f, tl.index(rem)].copy(), CUV[f, tl.index(keep)].copy()))
        for f in shared:
            alive[f] = False; nf -= 1
            for k in F[f]: vf[k].discard(f)
        for f in list(vf[rem]):
            r = list(F[f]).index(rem); F[f, r] = keep; vf[keep].add(f)
            if rem != keep:
                ur = CUV[f, r]
                for a_uv, k_uv in pairs:
                    if abs(a_uv[0] - ur[0]) < 1e-6 and abs(a_uv[1] - ur[1]) < 1e-6: CUV[f, r] = k_uv; break
                else:
                    # angolo in un'altra isola: prendo l'uv di keep già usato in quell'isola se c'è
                    pass
        vf[rem] = set(); Q[keep] += Q[rem]; stamp[keep] += 1; stamp[rem] += 1
        nb = set()
        for f in vf[keep]: nb.update(F[f])
        nb.discard(keep)
        for w in nb:
            cw, _ = cost(keep, w); x, y = (keep, w) if keep < w else (w, keep)
            heapq.heappush(heap, (cw, int(x), int(y), int(stamp[x]), int(stamp[y])))
        step += 1
        if step % 50000 == 0: log(f'    ... {nf} triangoli')
    F = F[alive]; CUV = CUV[alive]
    ok = (F[:, 0] != F[:, 1]) & (F[:, 1] != F[:, 2]) & (F[:, 0] != F[:, 2]); F, CUV = F[ok], CUV[ok]
    return P, F, CUV

def unweld(P, F, CUV, uvq=2048):
    """un vertice per ogni coppia (posizione, uv): pronto per i buffer del gioco"""
    vid = F.reshape(-1); uv = CUV.reshape(-1, 2); qu = np.round(uv * uvq).astype(np.int64)
    key = vid * (uvq + 1) ** 2 + qu[:, 0].clip(0, uvq) * (uvq + 1) + qu[:, 1].clip(0, uvq)
    uk, first, inv = np.unique(key, return_index=True, return_inverse=True)
    Pv = P[vid[first]]; UVv = uv[first]; T = inv.reshape(-1, 3)
    # normali lisce per vertice di posizione (pesate per area), poi copiate
    a, b, c = P[F[:, 0]], P[F[:, 1]], P[F[:, 2]]; fn = np.cross(b - a, c - a)
    N = np.zeros_like(P)
    for k in range(3): np.add.at(N, F[:, k], fn)
    N /= np.maximum(np.linalg.norm(N, axis=1), 1e-20)[:, None]
    return Pv, N[vid[first]], UVv, T
