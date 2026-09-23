"""
Parametric hand-outline generator for the Finger Frame "throw your hands up" glyph.

The hand is described as a skeleton (joint chains + width profiles), and the
outline is walked once, anticlockwise, as a single closed path:

    index ulnar side -> index tip cap -> index radial side
      -> thumb web
      -> thumb dorsal side -> thumb tip cap -> thumb palmar side
      -> radial palm edge -> wrist -> ulnar palm edge
      -> curled knuckles -> back to the index base

Because the walk is deterministic, two different joint-angle poses produce two
point lists of identical length -- which is what lets the SVG morph the `d`
attribute between them for the pinch animation.
"""
import math

V = lambda x, y: (float(x), float(y))
def add(a, b):  return (a[0] + b[0], a[1] + b[1])
def sub(a, b):  return (a[0] - b[0], a[1] - b[1])
def mul(a, k):  return (a[0] * k, a[1] * k)
def length(a):  return math.hypot(a[0], a[1])
def norm(a):
    l = length(a) or 1e-9
    return (a[0] / l, a[1] / l)
def perp(a):    return (-a[1], a[0])
def lerp(a, b, t): return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
def rotate(p, pivot, deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    d = sub(p, pivot)
    return (pivot[0] + d[0] * c - d[1] * s, pivot[1] + d[0] * s + d[1] * c)


def catmull_sample(pts, per_seg=8):
    """Sample a Catmull-Rom spline through `pts` (open chain)."""
    if len(pts) < 3:
        out = []
        for i in range(len(pts) - 1):
            for j in range(per_seg):
                out.append(lerp(pts[i], pts[i + 1], j / per_seg))
        out.append(pts[-1])
        return out
    ext = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(len(ext) - 3):
        p0, p1, p2, p3 = ext[i:i + 4]
        for j in range(per_seg):
            t = j / per_seg
            t2, t3 = t * t, t * t * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t
                       + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2
                       + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t
                       + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2
                       + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    out.append(pts[-1])
    return out


def finger_sides(joints, w_base, w_tip, samples=22, cap_pts=11, tip_round=1.0):
    """Offset a finger centreline into (ulnar side, tip cap, radial side).

    Sides run base->tip and tip->base respectively, so concatenating
    ulnar + cap + reversed(radial) walks the finger outline in one direction.
    """
    center = catmull_sample(joints, per_seg=max(2, samples // (len(joints) - 1)))
    n = len(center)
    left, right = [], []
    for i, p in enumerate(center):
        t = i / (n - 1)
        # Fingers taper, and the pad just behind the tip is the widest part of
        # the last phalanx, so ease the taper rather than running it linearly.
        w = w_base + (w_tip - w_base) * (t ** 0.75)
        if i == 0:
            d = norm(sub(center[1], center[0]))
        elif i == n - 1:
            d = norm(sub(center[-1], center[-2]))
        else:
            d = norm(sub(center[i + 1], center[i - 1]))
        nrm = perp(d)
        left.append(add(p, mul(nrm, w / 2)))
        right.append(sub(p, mul(nrm, w / 2)))

    tip = center[-1]
    d = norm(sub(center[-1], center[-2]))
    r = (w_base + (w_tip - w_base)) / 2 * tip_round
    a0 = math.atan2(left[-1][1] - tip[1], left[-1][0] - tip[0])
    cap = []
    for k in range(1, cap_pts):
        a = a0 - math.pi * (k / cap_pts)
        cap.append((tip[0] + math.cos(a) * r, tip[1] + math.sin(a) * r))
    return left, cap, right


def arc_between(a, b, sagitta, outward, per=7):
    """Circular arc from a to b bulging `sagitta` along the `outward` normal."""
    chord = sub(b, a)
    c = length(chord)
    if c < 1e-6 or abs(sagitta) < 1e-6:
        return [a, b]
    R = (c * c / 4 + sagitta * sagitta) / (2 * sagitta)
    mid = lerp(a, b, 0.5)
    centre = add(mid, mul(outward, sagitta - R))
    a0 = math.atan2(a[1] - centre[1], a[0] - centre[0])
    a1 = math.atan2(b[1] - centre[1], b[0] - centre[0])
    # take the short way round, on the outward side
    while a1 - a0 > math.pi:  a1 -= 2 * math.pi
    while a0 - a1 > math.pi:  a1 += 2 * math.pi
    return [(centre[0] + math.cos(a0 + (a1 - a0) * i / per) * abs(R),
             centre[1] + math.sin(a0 + (a1 - a0) * i / per) * abs(R))
            for i in range(per + 1)]


def knuckle_chain(start, end, count, bulge, jitter=0.0, per=6):
    """Scalloped edge standing in for the curled middle, ring and pinky.

    The knuckles are drawn as shallow circular ridges rather than notches --
    a fist read from the back is a run of convex bumps, and getting the sign
    of this normal wrong is what makes an icon hand look like a cog.
    """
    axis = sub(end, start)
    out = mul(norm(perp(axis)), -1.0)     # away from the palm
    pts = []
    for i in range(count):
        a = add(start, mul(axis, i / count))
        b = add(start, mul(axis, (i + 1) / count))
        k = bulge * (1.0 + jitter * (i - (count - 1) / 2))
        seg = arc_between(a, b, k, out, per=per)
        pts.extend(seg if i == 0 else seg[1:])
    return pts


def resample_closed(points, n):
    """Even arc-length resampling of a closed loop.

    Two poses resampled to the same n give point lists that correspond, which
    is what makes `d`-attribute morphing between them look like articulation
    instead of soup.
    """
    pts = list(points) + [points[0]]
    seg = [length(sub(pts[i + 1], pts[i])) for i in range(len(pts) - 1)]
    total = sum(seg)
    step = total / n
    out, si, acc = [pts[0]], 0, 0.0
    for k in range(1, n):
        target = k * step
        while si < len(seg) - 1 and acc + seg[si] < target:
            acc += seg[si]
            si += 1
        t = (target - acc) / (seg[si] or 1e-9)
        out.append(lerp(pts[si], pts[si + 1], t))
    return out


def to_path(points, close=True, smooth=0.5, prec=1):
    """Catmull-Rom -> cubic beziers over a closed loop of points."""
    n = len(points)
    f = lambda v: f"{v:.{prec}f}".rstrip("0").rstrip(".") or "0"
    d = [f"M{f(points[0][0])} {f(points[0][1])}"]
    last = n if close else n - 1
    for i in range(last):
        p0 = points[(i - 1) % n]
        p1 = points[i % n]
        p2 = points[(i + 1) % n]
        p3 = points[(i + 2) % n]
        c1 = add(p1, mul(sub(p2, p0), smooth / 3))
        c2 = sub(p2, mul(sub(p3, p1), smooth / 3))
        d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    if close:
        d.append("Z")
    return "".join(d)


def signed_area(pts):
    a = 0.0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        a += x1 * y2 - x2 * y1
    return a / 2


def nearest_index(pts, target):
    best, bi = float("inf"), 0
    for i, p in enumerate(pts):
        d = (p[0] - target[0]) ** 2 + (p[1] - target[1]) ** 2
        if d < best:
            best, bi = d, i
    return bi


def resample_arc(pts, n):
    """Even arc-length resampling of an OPEN polyline into n points."""
    seg = [length(sub(pts[i + 1], pts[i])) for i in range(len(pts) - 1)]
    total = sum(seg) or 1e-9
    step = total / (n - 1)
    out, si, acc = [pts[0]], 0, 0.0
    for k in range(1, n - 1):
        target = k * step
        while si < len(seg) - 1 and acc + seg[si] < target:
            acc += seg[si]
            si += 1
        t = (target - acc) / (seg[si] or 1e-9)
        out.append(lerp(pts[si], pts[si + 1], t))
    out.append(pts[-1])
    return out


def anchored_resample(loop, anchors, counts):
    """Resample a closed loop so that named anchor points always land on the
    same vertex index, whatever the pose.

    Pure arc-length resampling would slide vertices around the outline as the
    fingers move, and a morph between two such lists shears the hand instead of
    bending it. Pinning the index and thumb tips keeps the correspondence.
    """
    if signed_area(loop) < 0:                  # normalise winding
        loop = list(reversed(loop))
    idxs = [nearest_index(loop, a) for a in anchors]
    start = idxs[0]
    loop = loop[start:] + loop[:start]
    idxs = [(i - start) % len(loop) for i in idxs]

    out = []
    for k in range(len(anchors)):
        i0 = idxs[k]
        i1 = idxs[(k + 1) % len(anchors)]
        arc = loop[i0:i1] + [loop[i1 % len(loop)]] if i0 < i1 else \
              loop[i0:] + loop[:i1 + 1]
        out.extend(resample_arc(arc, counts[k] + 1)[:-1])
    return out
