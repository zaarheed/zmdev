"""The Finger Frame loader: the mark opening, closing, and turning a quarter.

Choreography, one cycle:

    hold shut -> the grips part and the band is revealed -> hold open
              -> the grips shut -> the pair turns 90 degrees, still shut

Four cycles is a full turn, so the loop is 4 x CYCLE long even though the eye
reads it at CYCLE.

Nothing here is a new shape. It is the splash's own construction -- the mark at
a band width, with every other quantity following from it -- animated between
the same two states the splash's beats 1 and 2 use. Because only `bandWidth`
moves, the two grips keep their exact geometry and merely translate, which is
what keeps this cheap enough to run as a spinner.
"""
import math

import marks as M

# ------------------------------------------------------------- optical sizes ---
#
# The loader has to work from full-screen down to 5x5, and that is not a scaling
# problem. At 5px square the mark's grip stroke is 0.35px and its slot of ground
# is 0.13px: both vanish, and what renders is a grey smudge. The binding
# constraint is the GAP, not the stroke -- it is the thinnest feature and it is
# the one doing the most work, because with it closed the grips fuse to the band
# and the mark stops being a bracket pair at all.
#
# So the geometry is redrawn per size band, the way a type family cuts optical
# sizes: as the box shrinks, the stroke and the ground get FATTER relative to it
# and the band gives up the room. Below the point where even that fails, the
# mark is dropped for the thing that still reads at three pixels -- its colour.

class Optical:
    """One cut of the mark. T, GAP and RET are in the mark's own 372x138 units."""

    def __init__(self, name, t, gap, ret, hb, min_px, shear=M.SHEAR, split=True):
        self.name, self.min_px, self.shear, self.split = name, min_px, shear, split
        self.T, self.GAP, self.RET, self.HB = t, gap, ret, hb
        # Band width open: the mark's own width less what the grips and ground take.
        self.OPEN = M.W - 2 * (t + gap)
        # Shut to where the arms would touch plus one slot of ground.
        self.SHUT = 2 * (ret - t - gap) + gap + t / 2
        self.GRIP_W = ret + t / 2
        self.GRIP_H = hb + 2 * gap + t
        self.HALF_W = self.OPEN / 2 + t + gap + t / 2


# DISPLAY is the mark exactly. The rest thicken the stroke and open the ground,
# and shorten the arms so the grips do not swallow the band as it narrows.
DISPLAY = Optical("display", 30, 11, 86, M.H - 22, min_px=44)
SMALL   = Optical("small",   46, 20, 96, 150, min_px=17)
MICRO   = Optical("micro",   66, 30, 104, 178, min_px=9, shear=0, split=False)
CUTS    = [DISPLAY, SMALL, MICRO]

# Under this, no arrangement of two brackets and a band survives -- three pixels
# cannot hold five features. What survives is the duo-tone itself.
DOT_MAX_PX = 9


def cut_for(px, turning=True):
    """The optical size for a rendered box of `px`.

    `px` is the square's side when turning and the HEIGHT when not, since that
    is the dimension the thin features live in either way.
    """
    for c in CUTS:
        if px >= c.min_px:
            return c
    return MICRO


# Defaults, so the module still reads as one mark at its display cut.
T, GAP, RET, HB, OPEN, SHUT = (DISPLAY.T, DISPLAY.GAP, DISPLAY.RET,
                               DISPLAY.HB, DISPLAY.OPEN, DISPLAY.SHUT)
GRIP_W, GRIP_H, HALF_W = DISPLAY.GRIP_W, DISPLAY.GRIP_H, DISPLAY.HALF_W
DIAG, AT = M.DIAG, M.AT

CYCLE = 1.75                            # seconds per quarter turn
P_CLOSE_END = 0.78

# The splash overshoots the opening with a keySpline whose control point sits at
# 1.28. That is legal CSS and illegal SMIL -- keySplines values must all be in
# 0..1, and a browser that finds one outside drops the whole animation with no
# error. So the overshoot is a real keyframe here. `_check_splines` makes the
# rule enforced rather than remembered.
OVERSHOOT = 1.045

E_OUT  = "0.2 0 0.35 1"                 # parts fast, decelerating
E_BACK = "0.3 0 0.3 1"                  # settles off the overshoot
E_SHUT = "0.6 0 0.9 0.25"               # snaps closed
E_TURN = "0.5 0 0.15 1"                 # the quarter turn, weighted late
E_HOLD = "0 0 1 1"


def _check_splines(splines, times):
    if len(splines) != len(times) - 1:
        raise ValueError(f"{len(splines)} keySplines for {len(times)} keyTimes")
    for s in splines:
        vals = [float(v) for v in s.split()]
        if len(vals) != 4 or any(not 0 <= v <= 1 for v in vals):
            raise ValueError(f"keySplines out of SMIL's 0..1 range: {s!r}")


def _extent(w, h, deg):
    r = math.radians(deg)
    return (abs(w * math.cos(r)) + abs(h * math.sin(r)),
            abs(w * math.sin(r)) + abs(h * math.cos(r)))


def boxes(cut):
    """Square box for the turning form, and the wide box for the compact one.

    The obvious size for the square is the circle the OPEN mark's corner sweeps,
    and it is wrong: the mark only ever turns while it is SHUT. It has to hold
    the open mark at rest in either orientation, and the shut mark at any angle
    -- and the first of those is the larger.
    """
    open_w, open_h = 2 * cut.HALF_W, cut.GRIP_H
    shut_w = cut.SHUT + 2 * (cut.GAP + cut.GRIP_W - cut.GAP)
    at_rest = max(_extent(open_w, open_h, cut.shear))
    turning = max(max(_extent(shut_w, cut.GRIP_H, cut.shear + a))
                  for a in range(0, 91, 5))
    box = round(max(at_rest, turning) + 12)
    return box, round(at_rest + 12), round(min(_extent(open_w, open_h, cut.shear)) + 12)


def keyframes(cut=None):
    cut = cut or DISPLAY
    widths = [cut.SHUT, cut.SHUT, cut.OPEN * OVERSHOOT, cut.OPEN,
              cut.OPEN, cut.SHUT, cut.SHUT]
    times = [0, 0.06, 0.34, 0.44, 0.56, P_CLOSE_END, 1]
    splines = [E_HOLD, E_OUT, E_BACK, E_HOLD, E_SHUT, E_HOLD]
    _check_splines(splines, times)
    return widths, times, splines


# The mono treatment, from marks.mono_two: one colour, with the split surviving
# as a sliver of GROUND rather than as a hue change. Needed wherever the loader
# sits on a filled surface -- on the pink CTA a pink band is invisible, and the
# mark reads as half a bracket pair.
MONO_SLIVER = 13.0 / 290


def mono_paths(cut, bw, C):
    top, bot = AT - (DIAG / 2) / DISPLAY.OPEN, AT + (DIAG / 2) / DISPLAY.OPEN
    x, y, h = C - bw / 2, C - cut.HB / 2, cut.HB
    s = bw * MONO_SLIVER / 2
    return (f"M{x:.2f} {y:.2f} H{x + bw * top - s:.2f} L{x + bw * bot - s:.2f} "
            f"{y + h:.2f} H{x:.2f} Z",
            f"M{x + bw * top + s:.2f} {y:.2f} H{x + bw:.2f} V{y + h:.2f} "
            f"H{x + bw * bot + s:.2f} Z")


def band_paths(cut, bw, C):
    """The duo-tone band at this width: a block, and the slant over it.

    The split is held as FRACTIONS of the band, not as an absolute 44 units: the
    mark breaks its cyan path at 39.4% and 54.6% across, and holding those as
    the band grows is what stops the slant shearing flatter as it opens.
    SplashView does the same, for the same reason.
    """
    top, bot = AT - (DIAG / 2) / DISPLAY.OPEN, AT + (DIAG / 2) / DISPLAY.OPEN
    x, y, h = C - bw / 2, C - cut.HB / 2, cut.HB
    return (dict(x=f"{x:.2f}", width=f"{bw:.2f}", y=f"{y:.2f}", height=f"{h:.2f}"),
            (f"M{x + bw * top:.2f} {y:.2f} H{x + bw:.2f} V{y + h:.2f} "
             f"H{x + bw * bot:.2f} Z"))


def grip_path(cut, left_edge, opens_right, C):
    """A `[` as one closed shape, so its corners are the mark's mitres exactly
    and not a stroke's idea of a join."""
    t = cut.T
    x0, x1 = left_edge, left_edge + cut.GRIP_W
    y0, y1 = C - cut.GRIP_H / 2, C + cut.GRIP_H / 2
    if opens_right:
        pts = [(x0, y0), (x1, y0), (x1, y0 + t), (x0 + t, y0 + t),
               (x0 + t, y1 - t), (x1, y1 - t), (x1, y1), (x0, y1)]
    else:
        pts = [(x1, y0), (x0, y0), (x0, y0 + t), (x1 - t, y0 + t),
               (x1 - t, y1 - t), (x0, y1 - t), (x0, y1), (x1, y1)]
    return "M" + " L".join(f"{px:.2f} {py:.2f}" for px, py in pts) + "Z"


def _spline_at(t, s):
    """y of a keySpline at x=t, by bisection on the cubic."""
    x1, y1, x2, y2 = (float(v) for v in s.split())
    lo, hi = 0.0, 1.0
    for _ in range(24):
        u = (lo + hi) / 2
        x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3
        lo, hi = (u, hi) if x < t else (lo, u)
    u = (lo + hi) / 2
    return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3


def angle_at(p, cut=DISPLAY):
    """Shear, plus however much of this cycle's quarter turn has happened."""
    if p <= P_CLOSE_END:
        return cut.shear
    return cut.shear + 90 * _spline_at((p - P_CLOSE_END) / (1 - P_CLOSE_END), E_TURN)


def width_at(p, cut=DISPLAY):
    widths, times, splines = keyframes(cut)
    for i in range(len(times) - 1):
        if times[i] <= p <= times[i + 1]:
            span = (p - times[i]) / (times[i + 1] - times[i] or 1)
            return widths[i] + (widths[i + 1] - widths[i]) * _spline_at(span, splines[i])
    return widths[-1]


# --------------------------------------------------------------------- svg ---

def _anim(attr, values, times, splines, dur, tag="animate", extra=""):
    return (f'<{tag} attributeName="{attr}" dur="{dur}" repeatCount="indefinite" '
            f'calcMode="spline" keyTimes="{";".join(f"{t:g}" for t in times)}" '
            f'keySplines="{";".join(splines)}" '
            f'values="{";".join(values)}"{extra}/>')


def _turn(cut, C, cycle, turns=4):
    """The quarter turns, held flat while the mark is opening and shutting."""
    vals, times = [], []
    for i in range(turns):
        a0 = cut.shear + 90 * i
        vals += [f"{a0:g} {C} {C}", f"{a0:g} {C} {C}"]
        times += [i / turns, (i + P_CLOSE_END) / turns]
    vals.append(f"{cut.shear + 90 * turns:g} {C} {C}")
    times.append(1.0)
    splines = [E_HOLD, E_TURN] * turns
    _check_splines(splines, times)
    return (f'<animateTransform attributeName="transform" type="rotate" '
            f'dur="{cycle * turns:g}s" repeatCount="indefinite" calcMode="spline" '
            f'keyTimes="{";".join(f"{t:.4f}" for t in times)}" '
            f'keySplines="{";".join(splines)}" values="{";".join(vals)}"/>')


def _dot(size, cycle, pink, cyan, animated, at):
    """The floor. Under ~9px no arrangement of two brackets and a band survives:
    three pixels cannot hold five features, and every faithful rendering is a
    grey smudge.

    What still reads at three pixels is the duo-tone and the fact that it is
    moving, so the mark stands down and the colour keeps working. Not a sweeping
    split -- at 5px that is two pixels of travel and reads as nothing -- but the
    whole square crossfading between the two brand hues.
    """
    mid = f"{cycle / 2:g}s"
    a = ("" if not animated else
         f'<animate attributeName="fill" dur="{cycle:g}s" repeatCount="indefinite" '
         f'calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.4 1;0.4 0 0.4 1" '
         f'values="{pink};{cyan};{pink}"/>')
    still = pink if at is None or at < 0.25 or at > 0.75 else cyan
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"
     width="{size}" height="{size}" role="img" aria-label="Loading">
  <rect width="10" height="10" fill="{still}">{a}</rect>
</svg>'''


def svg(uid="ld", size=96, cycle=CYCLE, pink=M.PINK, cyan=M.CYAN,
        bracket=M.CREAM, animated=True, at=None, ground=None, turning=True,
        cut=None, mono=None):
    """`size` is the square's side when turning, and the height when not.

    The optical size is chosen from `size` unless one is forced.
    """
    # The turn needs a square box, which costs more than half the height to the
    # rotation clearance. Below the display cut there is not enough left to read,
    # so the form falls back rather than turning illegibly.
    if turning and size < DISPLAY.min_px:
        turning = False
    cut = cut or cut_for(size, turning)
    if size < DOT_MAX_PX:
        return _dot(size, cycle, mono or pink, mono or cyan, animated, at)

    box, wide_w, wide_h = boxes(cut)
    C = box / 2
    widths, times, splines = keyframes(cut)
    if at is not None:
        widths, times, splines = [width_at(at, cut)], [0], []

    rects, slants = zip(*(band_paths(cut, w, C) for w in widths))
    dur = f"{cycle:g}s"
    # Only bandWidth moves, so each grip keeps its shape and just slides.
    shifts = [f"{-(w - cut.SHUT) / 2:.2f} 0" for w in widths]
    mirror = [f"{(w - cut.SHUT) / 2:.2f} 0" for w in widths]
    left_shut = C - (cut.SHUT / 2 + cut.T + cut.GAP + cut.T / 2)
    right_shut = C + cut.SHUT / 2 + cut.T + cut.GAP - cut.RET

    def a(attr, vals):
        return "" if not animated else _anim(attr, vals, times, splines, dur)

    def shift(vals):
        return ("" if not animated else
                _anim("transform", vals, times, splines, dur,
                      tag="animateTransform", extra=' type="translate"'))

    if turning:
        view, w, h = f"0 0 {box} {box}", size, size
    else:
        view = f"{C - wide_w / 2:g} {C - wide_h / 2:g} {wide_w} {wide_h}"
        h, w = size, round(size * wide_w / wide_h)
    tilt = cut.shear if (at is None or not turning) else angle_at(at, cut)
    bg = ("" if ground is None else
          f'<rect x="{C - box}" y="{C - box}" width="{2 * box}" '
          f'height="{2 * box}" fill="{ground}"/>')
    turn = _turn(cut, C, cycle) if (animated and turning) else ""
    slant = ("" if not cut.split else
             f'<path d="{slants[0]}" fill="{cyan}">{a("d", list(slants))}</path>')

    if mono:
        halves = [mono_paths(cut, w, C) for w in widths]
        band = (f'<path d="{halves[0][0]}" fill="{mono}">{a("d", [p[0] for p in halves])}</path>'
                f'<path d="{halves[0][1]}" fill="{mono}">{a("d", [p[1] for p in halves])}</path>')
        bracket = mono
    else:
        band = (f'<rect x="{rects[0]["x"]}" y="{rects[0]["y"]}" '
                f'width="{rects[0]["width"]}" height="{rects[0]["height"]}" fill="{pink}"'
                f'>{a("x", [r["x"] for r in rects])}'
                f'{a("width", [r["width"] for r in rects])}</rect>{slant}')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}"
     width="{w}" height="{h}" role="img" aria-label="Loading">{bg}
  <g transform="rotate({tilt:g} {C} {C})">{turn}
    {band}
    <g fill="{bracket}">
      <path d="{grip_path(cut, left_shut, True, C)}" transform="translate({shifts[0]})"
        >{shift(shifts)}</path>
      <path d="{grip_path(cut, right_shut, False, C)}" transform="translate({mirror[0]})"
        >{shift(mirror)}</path>
    </g>
  </g>
</svg>'''
