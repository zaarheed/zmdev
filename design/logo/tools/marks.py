"""The Finger Frame mark.

Read off the reference capture rather than the spec: the product's signature is
not a tall rectangle between two hands, it is a wide, slightly sheared BAND
across the eyes -- photographic outside, illustrated inside. One hand makes the
left edge and one makes the right, which is a bracket pair, so the mark is a
bracket pair holding a band.

Palette sampled from the stylised frames of that capture: electric blue and hot
coral-magenta against near-black, with a cream highlight.
"""

# ---------------------------------------------------------------- palette ---
INK   = "#07090C"   # ground
PINK  = "#FF2E7E"   # hot magenta, off the Spider-Gwen mask
CYAN  = "#17C8FF"   # electric blue, the dominant vivid hue in the capture
CREAM = "#FFF4E8"   # the grip
CREAM_DIM = "#C9BEB0"   # cream, knocked back, for the quiet colourway

# ------------------------------------------------------------- geometry -----
# Frozen. W:H is 372:138, near the ~3:1 band the real gesture makes. The grip is
# 30 thick with an 86 return, long enough to visibly overhang the band -- at 50
# it read as two clamps rather than as brackets. GAP is 11 of ground between
# grip and band: with the two flush, a one-colour version fuses them into a
# single slab and the mark stops being a mark.
W, H, T, RET, GAP = 372.0, 138.0, 30.0, 86.0, 11.0
DIAG, AT = 44.0, 0.47      # the split: leans 44 off vertical, a touch left
SHEAR = -4.0               # the band is never level in the real gesture
BOX = 512.0


def grip(x, y, w, h, ret, t, colour):
    d = (f"M{x+ret} {y}H{x}V{y+h}H{x+ret} M{x+w-ret} {y}H{x+w}V{y+h}H{x+w-ret}")
    return (f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="{t}" '
            f'stroke-linecap="butt" stroke-linejoin="miter"/>')


def flat_two(a, b, diag=DIAG, at=AT):
    """Two flat colours meeting on a slant. Flat blocks still read at 32px where
    a gradient collapses into one muddy mid-tone, and they do not date."""
    def band(uid, x, y, w, h):
        mid = x + w * at
        return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{a}"/>'
                f'<path d="M{mid-diag/2:.1f} {y:.1f} H{x+w:.1f} V{y+h:.1f} '
                f'H{mid+diag/2:.1f} Z" fill="{b}"/>')
    return band


def mono_two(ink, split=13.0):
    """One colour: the split survives as a sliver of ground, not a hue change."""
    def band(uid, x, y, w, h):
        mid = x + w * AT
        return (f'<path d="M{x:.1f} {y:.1f} H{mid-DIAG/2-split/2:.1f} '
                f'L{mid+DIAG/2-split/2:.1f} {y+h:.1f} H{x:.1f} Z" fill="{ink}"/>'
                f'<path d="M{mid-DIAG/2+split/2:.1f} {y:.1f} H{x+w:.1f} V{y+h:.1f} '
                f'H{mid+DIAG/2+split/2:.1f} Z" fill="{ink}"/>')
    return band


def image_band(href):
    """The band as a container: it holds a real frame of restyled video. The
    form is fixed, the content is not -- which is how the identity stays alive
    without being redrawn."""
    def band(uid, x, y, w, h):
        return (f'<clipPath id="{uid}-c"><rect x="{x:.1f}" y="{y:.1f}" '
                f'width="{w:.1f}" height="{h:.1f}"/></clipPath>'
                f'<image href="{href}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" '
                f'height="{h:.1f}" preserveAspectRatio="xMidYMid slice" '
                f'clip-path="url(#{uid}-c)"/>')
    return band


def mark_body(uid, ground=INK, band=None, bracket=CREAM, shear=SHEAR,
              bleed=False, gap=GAP):
    """The mark, without its container. `gap` is exposed only so the misuse
    examples can show what closing it costs."""
    band = band or flat_two(PINK, CYAN)
    x, y = (BOX - W) / 2, (BOX - H) / 2
    ix, iy = x + T + gap, y + gap
    iw, ih = W - 2 * (T + gap), H - 2 * gap
    bg = "" if bleed else f'<rect width="{BOX:.0f}" height="{BOX:.0f}" fill="{ground}"/>'
    return f'''{bg}
  <g transform="rotate({shear} {BOX/2:.0f} {BOX/2:.0f})">
    {band(uid, ix, iy, iw, ih)}
    {grip(x, y, W, H, RET, T, bracket)}
  </g>'''


def svg(uid, size=512, rx=0, **kw):
    body = mark_body(uid, **kw)
    if rx:
        body = body.replace(f'<rect width="{BOX:.0f}" height="{BOX:.0f}"',
                            f'<rect width="{BOX:.0f}" height="{BOX:.0f}" rx="{rx}"', 1)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {BOX:.0f} {BOX:.0f}" '
            f'width="{size}" height="{size}" role="img" '
            f'aria-label="Finger Frame">{body}</svg>')


# The band is 372x138 inside a 512 box; cropped tight it is a wide lockup mark.
def wide_svg(uid, height=64, pad=14, **kw):
    body = mark_body(uid, bleed=True, **kw)
    x, y = (BOX - W) / 2 - pad, (BOX - H) / 2 - pad
    w, h = W + 2 * pad, H + 2 * pad
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.0f} {y:.0f} {w:.0f} {h:.0f}" '
            f'height="{height}" role="img" aria-label="Finger Frame">{body}</svg>')


# The film-amber the brand used to run on is gone, not demoted to a colourway:
# it predated the product having a look, and every surface has moved off it.
COLOURWAYS = [
    ("Signal", PINK, CYAN, "default — the two hues the capture actually runs on"),
    ("Flare", CREAM, PINK, "light-led; for dark, busy grounds"),
    ("Vapour", CYAN, CREAM, "quietest; for dense UI"),
]
