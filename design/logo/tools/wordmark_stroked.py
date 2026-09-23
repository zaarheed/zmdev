"""The Finger Frame wordmark: letterforms built from stroked centrelines.

Chosen over both alternatives -- a Satoshi Bold setting, and a filled-outline
redraw -- after all three were seen side by side.

It ships as expanded OUTLINES rather than as strokes. Same artwork either way:
every join in these glyphs is a right angle between axis-aligned segments, so a
butt-capped rectangle per segment plus a square at each interior vertex
reproduces the mitre exactly. Doing it this way means the app, the site and the
exported video all fill one path, with no second drawing path to keep in step
and no stroke scaling to get wrong at small sizes.
"""
CAP, S, TRACK, SPACE = 100.0, 18.0, 18.0, 32.0
G = {
 "F": (58, [[(12, 0), (12, 100)], [(0, 12), (58, 12)], [(0, 50), (46, 50)]]),
 "I": (24, [[(12, 0), (12, 100)]]),
 "N": (72, [[(12, 100), (12, 0)], [(60, 100), (60, 0)], [(12, 9), (60, 91)]]),
 "G": (72, [[(60, 12), (12, 12), (12, 88), (60, 88), (60, 54), (38, 54)]]),
 "E": (58, [[(12, 0), (12, 100)], [(0, 12), (58, 12)],
            [(0, 50), (46, 50)], [(0, 88), (58, 88)]]),
 "R": (68, [[(12, 0), (12, 100)], [(0, 12), (54, 12), (54, 56), (0, 56)],
            [(30, 50), (64, 100)]]),
 "A": (66, [[(12, 100), (12, 12), (54, 12), (54, 100)], [(12, 58), (54, 58)]]),
 "M": (94, [[(12, 100), (12, 12)], [(82, 100), (82, 12)],
            [(12, 15), (47, 54)], [(47, 54), (82, 15)]]),
 # P and the full stop exist only for "FINGERFRAME.APP" on the end card.
 "P": (68, [[(12, 0), (12, 100)], [(0, 12), (54, 12), (54, 56), (0, 56)]]),
 ".": (20, [[(9, 91), (9, 100)]]),
}

NAME, URL = "FINGER FRAME", "FINGERFRAME.APP"
FACE = "custom, stroked centrelines expanded to outlines"


# --------------------------------------------------------------- expansion ---

def _cw(poly):
    """Nonzero fill only unions contours that agree, so force one winding."""
    area = sum(poly[i][0] * poly[(i + 1) % len(poly)][1]
               - poly[(i + 1) % len(poly)][0] * poly[i][1]
               for i in range(len(poly)))
    return poly if area >= 0 else poly[::-1]


def _segment(a, b, w):
    """A butt-capped stroke segment, as a rectangle."""
    (x1, y1), (x2, y2) = a, b
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5 or 1e-9
    nx, ny = -dy / length * w / 2, dx / length * w / 2
    return _cw([(x1 + nx, y1 + ny), (x2 + nx, y2 + ny),
                (x2 - nx, y2 - ny), (x1 - nx, y1 - ny)])


def _joint(p, w):
    """A mitre at a right-angled join between axis-aligned segments."""
    x, y = p
    return _cw([(x - w / 2, y - w / 2), (x + w / 2, y - w / 2),
                (x + w / 2, y + w / 2), (x - w / 2, y + w / 2)])


def shapes_for(ch, w=S):
    out = []
    for poly in G[ch][1]:
        for i in range(len(poly) - 1):
            out.append(_segment(poly[i], poly[i + 1], w))
        for p in poly[1:-1]:
            out.append(_joint(p, w))
    return out


def path_for(text, w=S):
    out, x = [], 0.0
    for ch in text.upper():
        if ch == " ":
            x += SPACE
            continue
        adv = G[ch][0]
        for poly in shapes_for(ch, w):
            out.append("M" + " L".join(f"{px + x:.2f} {py:.2f}" for px, py in poly) + "Z")
        x += adv + TRACK
    return " ".join(out), x - TRACK


def outline(text=NAME):
    """Path data plus its box. The stroke hangs half its width past the
    centrelines on every side, which the box has to include."""
    d, width = path_for(text)
    return {"d": d, "minX": -S / 2, "minY": -S / 2,
            "width": width + S, "height": CAP + S}


def strings():
    return {t: outline(t) for t in (NAME, URL)}


def width_of(text=NAME, height=None):
    o = outline(text)
    return o["width"] if height is None else o["width"] * height / o["height"]


def filled_svg(text=NAME, height=44, colour="#FFF4E8"):
    """The shipping form: one filled path."""
    o = outline(text)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'viewBox="{o["minX"]} {o["minY"]} {o["width"]:.2f} {o["height"]:.2f}" '
            f'width="{o["width"] * height / o["height"]:.1f}" height="{height}" '
            f'role="img" aria-label="{text}"><path d="{o["d"]}" fill="{colour}"/></svg>')


def svg(text="FINGER FRAME", height=44, colour="#FFF4E8"):
    out, x = [], 0.0
    for ch in text.upper():
        if ch == " ":
            x += SPACE
            continue
        adv, polys = G[ch]
        for poly in polys:
            out.append(" ".join(("M" if i == 0 else "L") + f"{px + x:.1f} {py:.1f}"
                                for i, (px, py) in enumerate(poly)))
        x += adv + TRACK
    width = x - TRACK
    half = S / 2
    return (f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'viewBox="{-half} {-half} {width + S} {CAP + S}" '
            f'height="{height * (CAP + S) / CAP:.1f}"><path d="{" ".join(out)}" '
            f'fill="none" stroke="{colour}" stroke-width="{S}" stroke-linecap="butt" '
            f'stroke-linejoin="miter" stroke-miterlimit="6"/></svg>')
