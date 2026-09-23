"""Emit the animated glyph: one left-hand path plus a mirrored <use>, with the
pose keyframes driving `d` on the hand, the frame and the corner brackets."""
import final
from gen import to_path

VB_W, VB_H = final.VB_W, final.VB_H
INSET = 3.0            # keeps the dashed edges off the fingertips themselves
ARM_H, ARM_V = 12.0, 5.0   # corner brackets: generated but off by default

# The pinch cycle. Negative index_curl opens the L away from the thumb.
OPEN  = (-6.0,  6.0)
MID   = ( 1.5, -1.5)
PINCH = ( 8.0, -7.0)

CYCLE_SECONDS = 3.6
KEY_TIMES  = "0;0.18;0.245;0.31;0.44;0.52;0.60;1"
KEY_SPLINE = ";".join(["0 0 1 1",            # hold open
                       "0.5 0 0.35 1",       # start closing
                       "0.2 0 0.2 1",        # snap shut
                       "0 0 1 1",            # hold pinched
                       "0.4 0 0.4 1",        # start releasing
                       "0.25 0 0.2 1",       # settle open
                       "0 0 1 1"])           # hold open
CYCLE = [OPEN, OPEN, MID, PINCH, PINCH, MID, OPEN, OPEN]


def geom(pose):
    g = final.build(*pose)
    x, y, w, h = final.frame_rect(g)
    x += INSET
    w -= 2 * INSET
    return g, (x, y, w, h)


def rect_path(x, y, w, h, r=2.0):
    return (f"M{x+r:.2f} {y:.2f}H{x+w-r:.2f}A{r} {r} 0 0 1 {x+w:.2f} {y+r:.2f}"
            f"V{y+h-r:.2f}A{r} {r} 0 0 1 {x+w-r:.2f} {y+h:.2f}"
            f"H{x+r:.2f}A{r} {r} 0 0 1 {x:.2f} {y+h-r:.2f}"
            f"V{y+r:.2f}A{r} {r} 0 0 1 {x+r:.2f} {y:.2f}Z")


def bracket_path(x, y, w, h, ah=ARM_H, av=ARM_V):
    # The arms shrink with the frame, so a tight pinch does not end up with
    # four brackets welded into a solid rectangle.
    ah = min(ah, w * 0.30)
    av = min(av, h * 0.22)
    x1, y1 = x + w, y + h
    return (f"M{x:.2f} {y+av:.2f}V{y:.2f}H{x+ah:.2f} "
            f"M{x1-ah:.2f} {y:.2f}H{x1:.2f}V{y+av:.2f} "
            f"M{x1:.2f} {y1-av:.2f}V{y1:.2f}H{x1-ah:.2f} "
            f"M{x+ah:.2f} {y1:.2f}H{x:.2f}V{y1-av:.2f}")


def keyframes():
    hands, rects, bracks = [], [], []
    cache = {}
    for pose in CYCLE:
        if pose not in cache:
            g, (x, y, w, h) = geom(pose)
            cache[pose] = (to_path(g["left"], close=True, smooth=0.62),
                           rect_path(x, y, w, h), bracket_path(x, y, w, h))
        d, r, b = cache[pose]
        hands.append(d); rects.append(r); bracks.append(b)
    return hands, rects, bracks


def anim(attr, values, dur, extra=""):
    return (f'<animate attributeName="{attr}" dur="{dur}" repeatCount="indefinite"\n'
            f'      calcMode="spline" keyTimes="{KEY_TIMES}" keySplines="{KEY_SPLINE}"\n'
            f'      values="{";".join(values)}" {extra}/>')


def svg(dur=f"{CYCLE_SECONDS}s", sw=2.3, animated=True, ids="ff", pose=None):
    hands, rects, bracks = keyframes()
    if pose is not None:                      # a single still, for stills sheets
        g, (x, y, w, h) = geom(pose)
        hands = [to_path(g["left"], close=True, smooth=0.62)]
        rects = [rect_path(x, y, w, h)]
        bracks = [bracket_path(x, y, w, h)]
        animated = False
    a = (lambda attr, v: anim(attr, v, dur)) if animated else (lambda attr, v: "")
    breathe = ('<animateTransform attributeName="transform" type="translate" additive="sum"'
               f' dur="{dur}" repeatCount="indefinite" calcMode="spline"'
               ' keyTimes="0;0.31;0.6;1" keySplines="0.4 0 0.4 1;0.4 0 0.4 1;0.4 0 0.4 1"'
               ' values="0 0;0 -0.9;0 0.3;0 0"/>') if animated else ''
    ants = ('<animate attributeName="stroke-dashoffset" values="0;-16" dur="2.2s"'
            ' repeatCount="indefinite"/>') if animated else ''

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB_W} {VB_H}"
     width="{VB_W}" height="{VB_H}" role="img"
     aria-label="Two hands making a rectangular frame with index finger and thumb">
  <defs>
    <path id="{ids}-hand" d="{hands[0]}">{a("d", hands)}</path>
  </defs>

  <g class="hands" fill="var(--ff-hand-fill, rgba(255,255,255,0.07))"
     stroke="var(--ff-hand-stroke, rgba(255,255,255,0.82))" stroke-width="{sw}"
     stroke-linejoin="round">{breathe}
    <use href="#{ids}-hand"/>
    <use href="#{ids}-hand" transform="translate({VB_W},0) scale(-1,1)"/>
  </g>

  <g class="frame">
    <path class="dash" d="{rects[0]}" fill="none"
          stroke="var(--ff-frame-dash, rgba(255,255,255,0.5))" stroke-width="{sw*0.6:.2f}"
          stroke-dasharray="3 5" stroke-linecap="round">{a("d", rects)}{ants}</path>
    <path class="bracket" d="{bracks[0]}" fill="none" display="none"
          stroke="var(--ff-frame, rgba(255,255,255,0.62))" stroke-width="{sw*0.87:.2f}"
          stroke-linecap="round" stroke-linejoin="round">{a("d", bracks)}</path>
  </g>
</svg>'''


if __name__ == "__main__":
    open("anim.svg", "w").write(svg())
    print("bytes", len(svg()))
