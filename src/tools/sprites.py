#!/usr/bin/env python3
# Sprite sheet romani -> atlante RATLAS di IMPERIUM (src/data_roman.js).
# Ogni foglio è una griglia di figure su fondo uniforme. Lo sfondo si toglie partendo dai bordi (il contorno nero
# protegge le parti chiare come la lama), le figure si trovano come componenti connesse e si allineano sui piedi.
# Uso: python3 src/tools/sprites.py [--preview cartella]
import sys, os, io, json, base64
import numpy as np
from PIL import Image
from collections import deque

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPR = os.path.join(REPO, 'src', 'sprites')
OUT_H = 132          # altezza in px dell'atlante per una figura in piedi (frontale)

# ---- che cosa contiene ogni foglio: righe di figure (sinistra -> destra) e a quali animazioni vanno
# animazioni: walkF walkS walkB (camminata frontale/di lato verso destra/di spalle), idleF idleS idleB,
# atkS atkF (attacco di lato verso destra / frontale), hit (colpito), death (caduta, l'ultimo fotogramma resta a terra)
SHEETS = {
    'legionario': [
        ('legionario_a.jpg', [
            ['atkS'] * 6,
            ['idleF', 'idleF', 'atkF', 'atkF', 'idleS', 'idleS'],
            ['hit', 'hit', 'hit', 'death', 'death', 'death'],
            ['idleB', 'idleB', 'idleB', 'idleB', 'idleB', 'deathEnd'],
        ]),
        ('legionario_b.jpg', [
            ['walkF'] * 6,
            ['walkS'] * 6,
            [None] * 6,          # camminata verso sinistra: si usa quella verso destra specchiata
            ['walkB'] * 6,
        ]),
    ],
}
# figure che si toccano nel foglio: funzione (x, y) -> True se il pixel appartiene alla figura di sinistra
SPLITS = {
    # riga 1 del primo foglio: la punta del gladio del colpo affondato tocca il mantello del fotogramma dopo
    ('legionario_a.jpg', 0): lambda x, y: (x < 1385) | ((x < 1508) & (y < 232 + (x - 1385) * (186 - 232) / (1505 - 1385))),
}
# unità del gioco che usano questi sprite (chiave interna -> personaggio)
UNITS = {'miliziano': 'legionario', 'uomoarme': 'legionario'}

def cutout(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.int32); H, W, _ = im.shape
    bg = np.median(np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)]), 0)
    d = np.abs(im - bg).sum(2)
    near = d < 34                                # pixel simili allo sfondo
    # flood fill dello sfondo dai bordi
    bgm = np.zeros((H, W), bool); q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if near[y, x] and not bgm[y, x]: bgm[y, x] = True; q.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if near[y, x] and not bgm[y, x]: bgm[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < H and 0 <= xx < W and near[yy, xx] and not bgm[yy, xx]: bgm[yy, xx] = True; q.append((yy, xx))
    fg = ~bgm
    # alone chiaro della compressione JPEG attorno al contorno: via i pixel di bordo quasi uguali allo sfondo
    edge = fg & (np.roll(bgm, 1, 0) | np.roll(bgm, -1, 0) | np.roll(bgm, 1, 1) | np.roll(bgm, -1, 1)) & (d < 70)
    fg &= ~edge
    return im.astype(np.uint8), fg

def components(fg, min_area=600):
    H, W = fg.shape; lab = np.zeros((H, W), np.int32); comps = []; n = 0
    ys, xs = np.nonzero(fg)
    for y0, x0 in zip(ys, xs):
        if lab[y0, x0]: continue
        n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
        while q:
            y, x = q.popleft(); pts.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < H and 0 <= xx < W and fg[yy, xx] and not lab[yy, xx]: lab[yy, xx] = n; q.append((yy, xx))
        if len(pts) >= min_area:
            p = np.array(pts); comps.append(dict(id=n, n=len(p), y0=p[:, 0].min(), y1=p[:, 0].max(), x0=p[:, 1].min(), x1=p[:, 1].max(), cy=p[:, 0].mean(), cx=p[:, 1].mean()))
    return lab, comps

def frames_of(path, rows):
    im, fg = cutout(path); H, W = fg.shape; lab, comps = components(fg)
    rh = H / len(rows); out = []
    for r, names in enumerate(rows):
        inrow = [c for c in comps if r * rh <= c['cy'] < (r + 1) * rh]
        want = len(names)
        # figure che si toccano (es. la lama che arriva sul mantello vicino): divido la più larga nella colonna più vuota
        while len([c for c in inrow if c['n'] > 6000]) < want:
            wide = max(inrow, key=lambda c: c['x1'] - c['x0']); m = lab == wide['id']
            sp = SPLITS.get((os.path.basename(path), r))
            if sp:
                yy, xx = np.mgrid[0:H, 0:W]; right = m & ~sp(xx, yy); nid = lab.max() + 1; lab[right] = nid; inrow.remove(wide)
                for idd in (wide['id'], nid):
                    ys, xs = np.nonzero(lab == idd); inrow.append(dict(id=idd, n=len(ys), y0=ys.min(), y1=ys.max(), x0=xs.min(), x1=xs.max(), cy=ys.mean(), cx=xs.mean()))
                continue
            cols = m[wide['y0']:wide['y1'] + 1, :].sum(0); a = wide['x0'] + int((wide['x1'] - wide['x0']) * 0.3); b = wide['x0'] + int((wide['x1'] - wide['x0']) * 0.7)
            mn = cols[a:b].min(); thin = np.nonzero(cols[a:b] <= mn + 10)[0]; cut = a + int(thin.max()) + 1; nid = lab.max() + 1   # taglio dove finisce la parte sottile (la lama)
            right = m.copy(); right[:, :cut] = False
            # della parte destra tengo solo il pezzo connesso più grande: il resto (la punta della lama) torna a sinistra
            sub, sc_ = components(right, 1)
            if sc_: keep = max(sc_, key=lambda c: c['n'])['id']; right = sub == keep
            lab[right] = nid; inrow.remove(wide)
            for idd in (wide['id'], nid):
                ys, xs = np.nonzero(lab == idd); inrow.append(dict(id=idd, n=len(ys), y0=ys.min(), y1=ys.max(), x0=xs.min(), x1=xs.max(), cy=ys.mean(), cx=xs.mean()))
        big = sorted(inrow, key=lambda c: -c['n'])[:len(names)]
        big = sorted(big, key=lambda c: c['cx'])
        small = [c for c in inrow if c not in big]
        for i, (c, name) in enumerate(zip(big, names)):
            if name is None: continue
            ids = [c['id']]
            # pezzi staccati vicini (es. la spada caduta) ma non quelli sopra la testa (scarti del foglio)
            for s in small:
                if s['y0'] >= c['y0'] - 4 and s['x0'] <= c['x1'] + 60 and s['x1'] >= c['x0'] - 60 and s['y0'] <= c['y1'] + 40: ids.append(s['id'])
            m = np.isin(lab, ids)
            # via i frammenti minuscoli rimasti dai tagli
            ys, xs = np.nonzero(m); sub = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; sl, sc_ = components(sub, 1)
            for c2 in sc_:
                if c2['n'] < 250: sub[sl == c2['id']] = False
            ys, xs = np.nonzero(m)
            y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
            rgba = np.zeros((y1 - y0 + 1, x1 - x0 + 1, 4), np.uint8)
            rgba[..., :3] = im[y0:y1 + 1, x0:x1 + 1]; rgba[..., 3] = m[y0:y1 + 1, x0:x1 + 1] * 255
            # punto d'appoggio: centro dei piedi (pixel del 12% più basso della figura), fondo = pixel più basso
            h = y1 - y0 + 1; low = m[y1 - int(h * 0.12):y1 + 1, x0:x1 + 1]; fx = np.nonzero(low)[1]
            ax = int(np.median(fx)) if len(fx) else (x1 - x0) // 2
            out.append(dict(name=name, img=rgba, ax=ax))
    return out

def build():
    anims = {}; scale_ref = {}
    for ch, sheets in SHEETS.items():
        A = {}
        for fn, rows in sheets:
            for f in frames_of(os.path.join(SPR, fn), rows): A.setdefault(f['name'], []).append(f)
        if 'deathEnd' in A: A['death'] = A.get('death', []) + A.pop('deathEnd')
        ref = np.median([f['img'].shape[0] for f in A.get('idleF', A.get('walkF'))])
        anims[ch] = (A, OUT_H / ref)
    # impacchetta: ogni fotogramma ridimensionato e allargato perché il punto d'appoggio sia al centro in basso
    tiles = []
    for ch, (A, s) in anims.items():
        for name, fl in A.items():
            for i, f in enumerate(fl):
                im = Image.fromarray(f['img']); w, h = im.size; nw, nh = max(1, round(w * s)), max(1, round(h * s))
                im = im.resize((nw, nh), Image.LANCZOS); ax = f['ax'] * s
                half = int(np.ceil(max(ax, nw - ax))) + 1; canvas = Image.new('RGBA', (half * 2, nh), (0, 0, 0, 0))
                canvas.alpha_composite(im, (int(round(half - ax)), 0))
                a = np.asarray(canvas).copy(); a[..., 3] = np.where(a[..., 3] > 110, 255, 0)   # bordi netti (pixel art)
                tiles.append((ch, name, i, Image.fromarray(a)))
    # scaffali
    AW = 2048; x = y = rowh = 0; place = []
    for t in sorted(tiles, key=lambda t: -t[3].size[1]):
        w, h = t[3].size
        if x + w > AW: x = 0; y += rowh + 2; rowh = 0
        place.append((t, x, y)); x += w + 2; rowh = max(rowh, h)
    AH = y + rowh; atlas = Image.new('RGBA', (AW, AH), (0, 0, 0, 0)); RFR = {}
    for (ch, name, i, im), x, y in place:
        atlas.alpha_composite(im, (x, y)); RFR.setdefault(ch, {}).setdefault(name, [None] * len(anims[ch][0][name]))[i] = [x, y, im.size[0], im.size[1]]
    return atlas, RFR

def main():
    atlas, RFR = build()
    b = io.BytesIO(); atlas.save(b, 'WEBP', lossless=True, method=6)
    src = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    js = ('// generato da src/tools/sprites.py: sprite romani (personaggi e animazioni)\n'
          f'const RATLAS_SRC = "{src}";\nconst RFR = {json.dumps(RFR)};\nconst RUNIT = {json.dumps(UNITS)};\n')
    open(os.path.join(REPO, 'src', 'data_roman.js'), 'w').write(js)
    print('atlante', atlas.size, len(b.getvalue()) // 1024, 'KB;', {ch: {k: len(v) for k, v in a.items()} for ch, a in RFR.items()})
    if '--preview' in sys.argv:
        pv = sys.argv[sys.argv.index('--preview') + 1]; os.makedirs(pv, exist_ok=True)
        bgc = Image.new('RGBA', atlas.size, (96, 124, 58, 255)); bgc.alpha_composite(atlas); bgc.save(os.path.join(pv, 'ratlas.png'))

if __name__ == '__main__': main()
