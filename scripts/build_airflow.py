"""Genera las líneas de flujo (representación visual, no CFD) a partir de la geometría real
del GLB: cada línea sigue el perfil de la carrocería a una distancia constante."""
import json, struct, numpy as np, sys
SRC = 'public/models/GT3RS.source.glb'
d = open(SRC, 'rb').read()
cl = struct.unpack('<I', d[12:16])[0]
j = json.loads(d[20:20+cl]); binoff = 20 + cl + 8
N, M, A, BV = j['nodes'], j['meshes'], j['accessors'], j['bufferViews']

def local(n):
    if 'matrix' in n: return np.array(n['matrix']).reshape(4, 4).T
    T = np.eye(4); R = np.eye(4); S = np.eye(4)
    if 'translation' in n: T[:3, 3] = n['translation']
    if 'rotation' in n:
        x, y, z, w = n['rotation']
        R[:3, :3] = [[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]]
    if 'scale' in n: S[[0, 1, 2], [0, 1, 2]] = n['scale']
    return T @ R @ S
W = {}
def walk(i, P, top):
    W[i] = (P @ local(N[i]), top)
    for c in N[i].get('children', []): walk(c, W[i][0], top if top is not None else (N[c]['name'] if i == 2 else None))
walk(0, np.eye(4), None)

def positions(acc):
    a = A[acc]; bv = BV[a['bufferView']]
    off = binoff + bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = bv.get('byteStride', 12)
    raw = np.frombuffer(d, dtype=np.uint8, count=stride * a['count'], offset=off).reshape(a['count'], stride)
    return raw[:, :12].copy().view(np.float32).reshape(-1, 3)

pts, tags = [], []
for i, (Mw, top) in W.items():
    n = N[i]
    if 'mesh' not in n or top is None: continue
    for p in M[n['mesh']]['primitives']:
        v = positions(p['attributes']['POSITION'])
        v = (np.c_[v, np.ones(len(v))] @ Mw.T)[:, :3]
        pts.append(v); tags += [top] * len(v)
P = np.concatenate(pts); T = np.array(tags)
wing = np.isin(T, ['TwiXeR_992_gt3rs_carbon_Wing', 'TwiXeR_992_gt3rs_left_leg', 'TwiXeR_992_gt3rs_right_leg'])
mirror = np.char.startswith(T.astype(str), 'TwiXeR_992_mirror')
print('verts', len(P), 'bounds', P.min(0).round(3), P.max(0).round(3), file=sys.stderr)

Z = np.arange(-2.45, 2.30, 0.025)
def smooth(y, s=3):
    k = np.exp(-0.5 * (np.arange(-3*s, 3*s+1) / s) ** 2); k /= k.sum()
    pad = np.pad(y, 3*s, mode='edge'); return np.convolve(pad, k, 'valid')
def dilate(y, r=5):
    pad = np.pad(y, r, mode='edge'); return np.array([pad[i:i+2*r+1].max() for i in range(len(y))])

def top_line(x0, include_wing, clear):
    sel = (np.abs(P[:, 0] - x0) < 0.07) & ~mirror & (include_wing | ~wing)
    Q = P[sel]; y = np.full(len(Z), np.nan)
    for k, z in enumerate(Z):
        m = np.abs(Q[:, 2] - z) < 0.02
        if m.any(): y[k] = Q[m, 1].max()
    y = np.interp(Z, Z[~np.isnan(y)], y[~np.isnan(y)])
    y = smooth(dilate(y, 6), 4) + clear
    if not include_wing:  # nunca atraviesa el plano principal: pasa por debajo
        wz = (Z > -2.32) & (Z < -1.78); y[wz] = np.minimum(y[wz], 1.08)
        y = smooth(y, 3)
    z = list(Z); yy = list(y)
    # Entrada: el aire llega casi horizontal y se eleva justo antes del morro.
    for zf in np.arange(2.32, 3.9, 0.06):
        t = min(1, (zf - 2.3) / 1.5); yy.append(y[-1] - 0.10 * (t * t * (3 - 2 * t))); z.append(zf)
    # Salida: la estela sube ligeramente (el alerón empuja el aire hacia arriba → el coche hacia abajo).
    z0, y0 = z[0], yy[0]
    head_z, head_y = [], []
    for zr in np.arange(-2.5, -4.4, -0.06):
        t = min(1, (-2.45 - zr) / 1.9)
        lift = (0.20 if include_wing else 0.12) * (t * t * (3 - 2 * t))
        head_z.append(zr); head_y.append(y0 + lift)
    z = head_z[::-1] + z; yy = head_y[::-1] + yy
    return [[round(float(x0), 3), round(float(b), 4), round(float(a), 4)] for a, b in sorted(zip(z, yy), key=lambda t: -t[0])]

def under_line(x0):
    sel = (np.abs(P[:, 0] - x0) < 0.07); Q = P[sel]; y = np.full(len(Z), np.nan)
    for k, z in enumerate(Z):
        m = np.abs(Q[:, 2] - z) < 0.02
        if m.any(): y[k] = Q[m, 1].min()
    y = np.interp(Z, Z[~np.isnan(y)], y[~np.isnan(y)])
    y = -dilate(-y, 4); y = smooth(y, 5) - 0.035; y = np.maximum(y, -0.06)
    z = list(Z); yy = list(y)
    for zf in np.arange(2.32, 3.9, 0.06): z.append(zf); yy.append(y[-1] + 0.06 * min(1, (zf - 2.3) / 1.5))
    hz, hy = [], []
    for zr in np.arange(-2.5, -4.2, -0.06):
        t = min(1, (-2.45 - zr) / 1.7); hz.append(zr); hy.append(yy[0] + 0.22 * t * t)
    z = hz[::-1] + z; yy = hy[::-1] + yy
    return [[round(float(x0), 3), round(float(b), 4), round(float(a), 4)] for a, b in sorted(zip(z, yy), key=lambda t: -t[0])]

def side_line(y0, clear):
    sel = (np.abs(P[:, 1] - y0) < 0.06) & (P[:, 0] > 0) & ~mirror; Q = P[sel]; x = np.full(len(Z), np.nan)
    for k, z in enumerate(Z):
        m = np.abs(Q[:, 2] - z) < 0.02
        if m.any(): x[k] = Q[m, 0].max()
    x = np.interp(Z, Z[~np.isnan(x)], x[~np.isnan(x)])
    x = smooth(dilate(x, 6), 5) + clear
    z = list(Z); xx = list(x)
    for zf in np.arange(2.32, 3.9, 0.06):
        t = min(1, (zf - 2.3) / 1.5); z.append(zf); xx.append(x[-1] - 0.25 * (t * t * (3 - 2 * t)))
    hz, hx = [], []
    for zr in np.arange(-2.5, -4.2, -0.06):
        t = min(1, (-2.45 - zr) / 1.7); hz.append(zr); hx.append(xx[0] - 0.3 * t * t)
    z = hz[::-1] + z; xx = hx[::-1] + xx
    return [[round(float(b), 4), round(float(y0), 3), round(float(a), 4)] for a, b in sorted(zip(z, xx), key=lambda t: -t[0])]

lines = []
for i, x0 in enumerate([-0.62, -0.42, -0.22, 0.0, 0.22, 0.42, 0.62]):
    over = i % 2 == 1
    lines.append({'kind': 'over-wing' if over else 'under-wing', 'tier': 'all' if i in (1, 3, 5) else 'full',
                  'points': top_line(x0, over, 0.06 if over else 0.035)})
for x0 in (-0.42, 0.0, 0.42):
    lines.append({'kind': 'underbody', 'tier': 'all' if x0 == 0 else 'full', 'points': under_line(x0)})
for y0, c in ((0.42, 0.05), (0.7, 0.06)):
    lines.append({'kind': 'side', 'tier': 'all' if y0 == 0.42 else 'full', 'points': side_line(y0, c)})

# Simplifica a ~70 puntos por línea (la curva se reconstruye con CatmullRom en runtime)
for l in lines:
    p = l['points']; step = max(1, len(p) // 70); l['points'] = p[::step] + ([p[-1]] if (len(p) - 1) % step else [])
json.dump({'note': 'Representación visual derivada del perfil del modelo. No es una simulación CFD.',
           'space': 'GLB world, Y up, +Z front, metres', 'lines': lines}, open('src/data/airflow.json', 'w'))
print('lines', len(lines), [len(l['points']) for l in lines], file=sys.stderr)
