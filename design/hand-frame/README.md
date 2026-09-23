# Hand glyph — "throw your hands up"

A replacement for `HandFrameGlyph` in [ControlsView.swift](../../ios/FingerFrame/ControlsView.swift),
the illustration under the **Throw your hands up** title on the camera screen.

**Shipped.** `ios/FingerFrame/HandFrameGlyph.swift` and screens 2a / 2g of the
Claude Design canvas are both generated from here, so the three cannot drift.
`preview.html` stays as the place to judge the glyph without launching the app —
one file, no external requests, opens straight off disk.

```
open design/hand-frame/preview.html
```

## What changed

The shipping glyph draws each hand as one blobby closed path with two bare line
segments stuck on for the digits, which is why it reads as a potato with sticks in
it. This one is built from anatomy instead:

- a **disc skeleton** — palm, index, thumb, three curled knuckles — combined with a
  smooth minimum, so the thenar web and the knuckle valleys come out of the geometry
  rather than being drawn by hand. Those joins are exactly what the old outline got
  wrong.
- the silhouette is the **0-level contour** of that field, marched out and fitted with
  cubics.
- both hands are one path plus a mirrored `<use>`.

The glyph box grew from **100×56** to **232×104** (drawn at 125×56 pt), because the
frame needs somewhere to be — and because the frame itself is now sized to the
identity's band, **372:138**. The first version drew it at about 1.5:1; the reference
capture's band is nearer 3:1, and the illustration and the logo should not disagree
about the shape of the gesture. The frame treatment is a **dashed rectangle** — corner
brackets were prototyped and rejected; `preview.html` can still toggle them on.

The stroke weights moved with it: `FF.handStroke` 0.2 → 0.42, `FF.frameStroke`
0.3 → 0.5, `FF.handFill` 0.06 → 0.05, and `FF.handDigit` is gone. The old glyph was
two filled blobs, where a 0.2 outline is only an edge on a mass; this one is a line
drawing, and at 0.2 it disappears over a bright scene.

## The animation

Index and thumb rotate about their own knuckles, and the dashed frame is redrawn from
where the fingertips actually land — the same relationship `FrameTracker` uses, where
the quad corners are `[leftIndex, rightIndex, rightThumb, leftThumb]`. So pinching
shrinks the frame, which is what the gesture really does. The frame stays an outline
throughout — an earlier version flashed a white plate inside it at the tightest point,
which read as a glitch rather than a shutter.

It is plain SMIL: every pose is the same 112-point loop, resampled so that a given
vertex is the same piece of anatomy in every pose, so the whole thing is one
`<animate attributeName="d">`. No runtime, no dependency, and it works in Safari,
Chrome and Firefox.

**On Lottie:** it was considered and skipped. It would mean adding `lottie-ios` plus a
JSON asset to play back keyframes SwiftUI can interpolate itself — the poses are two
angles. If it is wanted later, `hand-frame-poses.json` already holds the three poses as
matching vertex lists, which is the shape a Lottie path keyframe takes.

## Files

| | |
|---|---|
| `preview.html` | the whole preview — context mock, controls, size ladder, stills, source |
| `hand-frame.svg` | standalone animated glyph |
| `hand-frame-static.svg` | rest pose, no animation |
| `hand-frame-poses.json` | the three poses as matching vertex lists, for a port or a Lottie export |
| `tools/` | the generator; `python3 tools/generate.py` rebuilds everything above **and** `ios/FingerFrame/HandFrameGlyph.swift` |

## Regenerating

```
cd design/hand-frame/tools && python3 generate.py
```

Needs `numpy`. Joint angles, widths and blend radii are all at the top of
`tools/hand2.py`; the composition (tilt, hand size, glyph box) is in `tools/final.py`,
and the pinch cycle and its timing are in `tools/build.py`.

## How it is wired in

- `ios/FingerFrame/HandFrameGlyph.swift` is **generated** — the pose tables and the
  timing come from `generate.py`. Change a joint angle in `tools/hand2.py` and re-run
  it; editing the Swift by hand desynchronises the app from the design.
- It bakes the three pose outlines and `lerp`s the point arrays inside a
  `TimelineView` capped at 30fps. The display link is wasted on motion this slow, and
  this is the busiest screen in the app.
- `HandFrameGlyph(animated: false)` holds the rest pose; the view also honours
  `accessibilityReduceMotion` on its own.
- The illustration is decorative, so it is `accessibilityHidden` inside the
  instruction block's existing `accessibilityElement(children: .combine)`.

## The Claude Design canvas

Screens **2a First open** and **2g Mic refused** carry this glyph. To push a change:

```
python3 tools/emit_canvas.py <canvas.html> <out.html>
```

Pull `Finger Frame v2.dc.html` from the design project first (the DesignSync
`get_file` method), run the above, then write it back. The script fails loudly if it
cannot find exactly two copies of the old glyph, so it will not half-apply. It also
resolves the preview page's CSS-variable colour hooks to the literal `enum FF`
values, since the canvas has nowhere to define them.
