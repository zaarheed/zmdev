"""Final glyph composition + pose keyframes."""
import compose, hand2
from gen import to_path

# The fingertip frame is sized to the logo's band, 372:138 -- the illustration
# and the mark should not disagree about the shape of the gesture, and the
# capture's band is nearer 3:1 than the 1.5:1 this used to draw.
compose.VB_W = 232
VB_W, VB_H = 232, 104
TILT, HAND_H, MARGIN_X = 28.0, 62.0, 4.0


def build(index_curl=0.0, thumb_curl=0.0):
    g = compose.layout(TILT, hand_h=HAND_H, margin_x=MARGIN_X,
                       index_curl=index_curl, thumb_curl=thumb_curl)
    return g


def frame_rect(g):
    x0 = (g["li"][0] + g["lt"][0]) / 2
    y0, y1 = g["li"][1], g["lt"][1]
    return x0, y0, VB_W - 2 * x0, y1 - y0


def svg(index_curl=0.0, thumb_curl=0.0, sw=2.3, box=False):
    g = build(index_curl, thumb_curl)
    x, y, w, h = frame_rect(g)
    dl = to_path(g["left"], close=True, smooth=0.62)
    dr = to_path(g["right"], close=True, smooth=0.62)
    frame = "" if not box else f'<rect x="0" y="0" width="{VB_W}" height="{VB_H}" fill="none" stroke="#222a31" stroke-width="0.5"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB_W} {VB_H}" width="{VB_W}" height="{VB_H}">
 {frame}
 <g fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.82)" stroke-width="{sw}" stroke-linejoin="round">
  <path d="{dl}"/><path d="{dr}"/>
 </g>
 <rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="2" fill="none"
       stroke="rgba(255,255,255,0.5)" stroke-width="{sw*0.6:.2f}" stroke-dasharray="4 4" stroke-linecap="round"/>
</svg>'''


if __name__ == "__main__":
    open("final.svg", "w").write(svg(box=True))
    g = build()
    print("frame rect", [round(v, 1) for v in frame_rect(g)])
    print("hand width", round(g["w"], 1))
