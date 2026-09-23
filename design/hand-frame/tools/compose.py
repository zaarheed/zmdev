"""Compose the two-hand glyph and report the quad the fingertips make."""
import math, hand2
from gen import to_path, rotate, V

VB_W, VB_H = 200, 112


def hand_geometry(theta, index_curl=0.0, thumb_curl=0.0):
    """Outline + tips for the left hand, rotated `theta` degrees clockwise."""
    pts, itip, ttip = hand2.outline(index_curl, thumb_curl)
    c = V(58, 68)
    pts = [rotate(p, c, theta) for p in pts]
    return pts, rotate(itip, c, theta), rotate(ttip, c, theta)


def layout(theta, hand_h=80.0, margin_x=3.0, top=None, scale=None,
           index_tip_at=None, index_curl=0.0, thumb_curl=0.0, wrist=False):
    """Place the pair by bounding box: each hand `hand_h` tall, `margin_x` in
    from its side. The fingertip separations then fall out of the pose rather
    than being dialled in, which keeps the dashed quad honest."""
    prev = hand2.WITH_WRIST
    hand2.WITH_WRIST = wrist
    try:
        pts, itip, ttip = hand_geometry(theta, index_curl, thumb_curl)
    finally:
        hand2.WITH_WRIST = prev
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    s = scale if scale else hand_h / (max(ys) - min(ys))
    if index_tip_at is not None:
        ox = index_tip_at[0] - itip[0] * s
        oy = index_tip_at[1] - itip[1] * s
    else:
        ox = margin_x - min(xs) * s
        oy = (top if top is not None else (VB_H - hand_h) / 2) - min(ys) * s

    T = lambda p: (p[0] * s + ox, p[1] * s + oy)
    M = lambda p: (VB_W - p[0], p[1])          # mirror to the right hand

    L = [T(p) for p in pts]
    return dict(left=L, right=[M(p) for p in L],
                li=T(itip), lt=T(ttip), ri=M(T(itip)), rt=M(T(ttip)),
                s=s, w=(max(xs) - min(xs)) * s)


def report(theta, **kw):
    g = layout(theta, **kw)
    top = g["ri"][0] - g["li"][0]
    bot = g["rt"][0] - g["lt"][0]
    fh = g["lt"][1] - g["li"][1]
    inner = VB_W - 2 * (3 + g["w"])
    print(f"tilt {theta:4.0f} h {kw.get('hand_h',80):3.0f} | handw {g['w']:5.1f} "
          f"gap {inner:6.1f} | idx {top:6.1f} thumb {bot:6.1f} skew {top-bot:6.1f} "
          f"| frame {top:.0f}x{fh:.0f} ar {top/max(fh,1e-6):.2f}")
    return g


if __name__ == "__main__":
    for th in (20, 28, 32, 36, 40, 44):
        for hh in (72, 80, 88):
            report(th, hand_h=hh)
