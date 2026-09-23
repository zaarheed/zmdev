"""The Finger Frame wordmark: custom letterforms, built as filled outlines.

The first attempt stroked centrelines. That is a skeleton, not type: no control
of the joins, no real counters, and every diagonal throws an artefact. This
draws each glyph as filled shapes -- overlapping rectangles and parallelograms
unioned by the nonzero winding rule -- so every vertex is placed on purpose.

The construction rules come off the mark: one stem width, terminals cut flat
and square like the grip's returns, counters rectangular, diagonals cut
vertically top and bottom the way a real face cuts them.
"""

CAP = 100.0
STEM = 21.0          # one stem width, everywhere
BAR = 19.0           # horizontals sit slightly lighter than stems, as they must:
                     # a horizontal of equal measure reads heavier than a vertical
MID = 41.0           # waist -- above centre, which keeps the caps from sagging
TRACK = 15.0
SPACE = 34.0


def _cw(poly):
    """Force clockwise winding.

    Shapes are unioned by the nonzero rule, and nonzero only unions when the
    contours agree: a clockwise rectangle overlapping an anticlockwise
    parallelogram cancels to a hole. That was the notch in the A.
    """
    area = sum((poly[i][0] * poly[(i + 1) % len(poly)][1]
                - poly[(i + 1) % len(poly)][0] * poly[i][1])
               for i in range(len(poly)))
    return poly if area >= 0 else poly[::-1]


def rect(x, y, w, h):
    return _cw([(x, y), (x + w, y), (x + w, y + h), (x, y + h)])


def diag(x1, y1, x2, y2, w):
    """A diagonal cut vertically at both ends, as type cuts them."""
    return _cw([(x1 - w / 2, y1), (x1 + w / 2, y1),
                (x2 + w / 2, y2), (x2 - w / 2, y2)])


S, B = STEM, BAR

GLYPHS = {
 "F": (60, [rect(0, 0, S, CAP), rect(0, 0, 60, B), rect(0, MID, 46, B)]),
 "I": (S,  [rect(0, 0, S, CAP)]),
 "N": (70, [rect(0, 0, S, CAP), rect(49, 0, S, CAP),
            diag(S / 2, 0, 49 + S / 2, CAP, S * 1.02)]),
 "E": (60, [rect(0, 0, S, CAP), rect(0, 0, 60, B),
            rect(0, MID, 46, B), rect(0, CAP - B, 60, B)]),
 "G": (70, [rect(0, 0, S, CAP), rect(0, 0, 70, B), rect(0, CAP - B, 70, B),
            rect(70 - S, 54, S, CAP - 54), rect(40, 54, 30, B * 0.92)]),
 "R": (68, [rect(0, 0, S, CAP), rect(0, 0, 56, B), rect(68 - S, 0, S, 55),
            rect(0, 55 - B, 58, B), diag(40, 55 - B, 68 - S / 2, CAP, S * 1.1)]),
 # The apex is cut flat rather than pointed: at this weight a true point fills
 # in, and a flat cut is the same decision the grip's returns make.
 "A": (70, [diag(35 - 26, CAP, 35 - 2, 0, S * 1.06),
            diag(35 + 26, CAP, 35 + 2, 0, S * 1.06),
            rect(35 - 2 - S / 2 * 1.06, 0, (2 + S / 2 * 1.06) * 2, B * 0.86),
            rect(13, 58, 44, B * 0.86)]),
 "M": (86, [rect(0, 0, S, CAP), rect(86 - S, 0, S, CAP),
            diag(S / 2, 0, 43, 70, S * 0.96),
            diag(86 - S / 2, 0, 43, 70, S * 0.96)]),
 "P": (66, [rect(0, 0, S, CAP), rect(0, 0, 56, B), rect(66 - S, 0, S, 55),
            rect(0, 55 - B, 58, B)]),
 ".": (S,  [rect(0, CAP - S, S, S)]),
}


def path_for(text, tracking=TRACK):
    out, x = [], 0.0
    for ch in text.upper():
        if ch == " ":
            x += SPACE
            continue
        adv, shapes = GLYPHS[ch]
        for poly in shapes:
            pts = " ".join(f"{px + x:.2f} {py:.2f}" for px, py in poly)
            first, *rest = pts.split("  ") if False else [pts]
            coords = [(px + x, py) for px, py in poly]
            out.append("M" + " L".join(f"{a:.2f} {b:.2f}" for a, b in coords) + "Z")
        x += adv + tracking
    return " ".join(out), x - tracking


def svg(text="FINGER FRAME", height=44, colour="#FFF4E8", tracking=TRACK):
    d, width = path_for(text, tracking)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {CAP}" '
            f'width="{width * height / CAP:.1f}" height="{height}" role="img" '
            f'aria-label="{text}"><path d="{d}" fill="{colour}"/></svg>')


# ---------------------------------------------------------------------------
# The interface the emitters use. Two strings exist, and only two: the name and
# the url. Everything downstream -- the app, the site, the exported video --
# draws these same paths.

NAME, URL = "FINGER FRAME", "FINGERFRAME.APP"
FACE = "custom, built from the mark's construction"


def outline(text=NAME):
    """Path data plus its box, in the 100-cap space the glyphs are drawn in."""
    d, width = path_for(text)
    return {"d": d, "minX": 0.0, "minY": 0.0, "width": width, "height": CAP}


def strings():
    return {s: outline(s) for s in (NAME, URL)}


def width_of(text=NAME, height=None):
    w = outline(text)["width"]
    return w if height is None else w * height / CAP
