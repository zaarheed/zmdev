"""Signed-distance construction of the hand silhouette.

Hand-authoring bezier outlines for a hand keeps producing cusps where the
thumb and the fingers meet the palm -- exactly the joins that make an icon
hand read as a potato with sticks in it. So the silhouette is built instead
from a disc skeleton: each part (palm, index, thumb, each curled knuckle) is a
run of circles, parts are combined with a smooth minimum whose blend radius is
tuned per join, and the 0-level contour is marched out and fitted with cubics.

The smooth union is what produces the thenar web and the knuckle valleys for
free, and because the whole pipeline is a pure function of the joint angles,
two poses come out as point lists of the same length -- so the SVG can morph
`d` between them and the fingers appear to articulate.
"""
import math
import numpy as np


# ------------------------------------------------------------------ shapes ---

def bone(a, b, ra, rb, n=26):
    """A tapered capsule as a run of discs."""
    return [(a[0] + (b[0] - a[0]) * t,
             a[1] + (b[1] - a[1]) * t,
             ra + (rb - ra) * t)
            for t in (i / (n - 1) for i in range(n))]


def part_sdf(discs, X, Y):
    d = None
    for (cx, cy, r) in discs:
        v = np.hypot(X - cx, Y - cy) - r
        d = v if d is None else np.minimum(d, v)
    return d


def smin(a, b, k):
    """Polynomial smooth minimum -- the fillet radius at the join is ~k."""
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b + (a - b) * h - k * h * (1.0 - h)


def field(parts, X, Y):
    """parts: list of (discs, blend_k). Blended in order onto the first part."""
    d = part_sdf(parts[0][0], X, Y)
    for discs, k in parts[1:]:
        d = smin(d, part_sdf(discs, X, Y), k)
    return d


# ------------------------------------------------------- contour extraction ---

def marching_squares(F, x0, y0, dx, dy):
    """0-level contour of F as ordered closed loops (list of point lists)."""
    segs = []

    def interp(pa, pb, va, vb):
        t = va / (va - vb) if (va - vb) != 0 else 0.5
        return (pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t)

    ny, nx = F.shape
    for j in range(ny - 1):
        for i in range(nx - 1):
            v = (F[j, i], F[j, i + 1], F[j + 1, i + 1], F[j + 1, i])
            if min(v) > 0 or max(v) < 0:
                continue
            p = ((x0 + i * dx,       y0 + j * dy),
                 (x0 + (i + 1) * dx, y0 + j * dy),
                 (x0 + (i + 1) * dx, y0 + (j + 1) * dy),
                 (x0 + i * dx,       y0 + (j + 1) * dy))
            crossings = []
            for e in range(4):
                p1, p2 = e, (e + 1) % 4
                if (v[p1] < 0) != (v[p2] < 0):
                    crossings.append((e, interp(p[p1], p[p2], v[p1], v[p2])))
            if len(crossings) == 2:
                segs.append((crossings[0][1], crossings[1][1]))
            elif len(crossings) == 4:
                # Saddle: the sign of the cell centre decides which pair of
                # crossings belong to the same piece of boundary.
                centre = 0.25 * sum(v)
                order = [0, 1, 2, 3] if centre < 0 else [1, 2, 3, 0]
                segs.append((crossings[order[0]][1], crossings[order[1]][1]))
                segs.append((crossings[order[2]][1], crossings[order[3]][1]))

    # stitch segments end-to-end into loops
    key = lambda p: (round(p[0], 5), round(p[1], 5))
    ends = {}
    for idx, (a, b) in enumerate(segs):
        ends.setdefault(key(a), []).append(idx)
        ends.setdefault(key(b), []).append(idx)

    def walk(cur, used):
        """Follow unused segments from `cur` until the chain runs out."""
        chain = []
        while True:
            nxt = None
            for idx in ends.get(key(cur), ()):
                if used[idx]:
                    continue
                s, e = segs[idx]
                nxt = (idx, e if key(s) == key(cur) else s)
                break
            if nxt is None:
                return chain
            used[nxt[0]] = True
            cur = nxt[1]
            chain.append(cur)

    loops, used = [], [False] * len(segs)
    for seed in range(len(segs)):
        if used[seed]:
            continue
        used[seed] = True
        a0, b0 = segs[seed]
        # A seed lands anywhere on the contour, so trace both ways from it.
        fwd = walk(b0, used)
        back = walk(a0, used)
        loop = list(reversed(back)) + [a0, b0] + fwd
        if len(loop) > 8:
            loops.append(loop)
    loops.sort(key=len, reverse=True)
    return loops


def contour(parts, bbox, res=1.0):
    """Extract the outer silhouette of a blended part list."""
    x0, y0, x1, y1 = bbox
    nx = int((x1 - x0) / res) + 1
    ny = int((y1 - y0) / res) + 1
    xs = np.linspace(x0, x1, nx)
    ys = np.linspace(y0, y1, ny)
    X, Y = np.meshgrid(xs, ys)
    F = field(parts, X, Y)
    loops = marching_squares(F, x0, y0, xs[1] - xs[0], ys[1] - ys[0])
    if not loops:
        raise RuntimeError("empty contour")
    return loops[0]
