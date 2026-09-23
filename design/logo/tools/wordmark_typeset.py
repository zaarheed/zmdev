"""Rejected wordmark, second attempt: Satoshi Bold, outlined.

Kept so identity.html can show all three attempts at matched size. Competently
drawn -- it is a real typeface -- but anonymous: beside a mark this particular,
a neutral geometric grotesque says nothing, which is the note that killed it.

The tooling is still here (bake_wordmark.py, TextToPath.swift) because the
typeset route is the one to take if the wordmark is ever handed to a type
designer, or if FF DIN gets licensed.
"""
import json, os

_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                     "wordmark-outlines.json")
with open(_PATH) as _f:
    DATA = json.load(_f)

CAP = DATA["cap"]
FACE = DATA["face"]
NAME = "FINGER FRAME"
URL = "FINGERFRAME.APP"


def outline(text=NAME):
    try:
        return DATA["strings"][text.upper()]
    except KeyError:
        raise KeyError(f"{text!r} is not baked; add it to bake_wordmark.py "
                       f"and re-run") from None


def svg(text=NAME, height=44, colour="#FFF4E8", pad=0.0):
    o = outline(text)
    s = height / o["height"]
    vb = (f'{o["minX"] - pad:.2f} {o["minY"] - pad:.2f} '
          f'{o["width"] + 2 * pad:.2f} {o["height"] + 2 * pad:.2f}')
    w = (o["width"] + 2 * pad) * s
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
            f'width="{w:.1f}" height="{height * (o["height"] + 2 * pad) / o["height"]:.1f}" '
            f'role="img" aria-label="{text}"><path d="{o["d"]}" fill="{colour}"/></svg>')


def width_of(text=NAME, height=None):
    o = outline(text)
    return o["width"] if height is None else o["width"] * height / o["height"]
