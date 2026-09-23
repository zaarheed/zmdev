# Finger Frame — the mark

    open design/logo/identity.html

A proposal, not a swap. Nothing here is wired into the app or the site yet.

## The read

The spec describes a rectangle framed by two hands. The reference capture
(`ssstwitter.com_1786434988519.mp4`) shows something more specific, and more
ownable: a **wide, slightly sheared band across the eyes** — photographic above
and below, illustrated inside. The hands do not surround it. One makes the left
edge, one makes the right.

So the mark is a **bracket pair holding a band**. `[` band `]`.

That is why it is not the four corner brackets the site currently uses. Corner
brackets say *crop tool* — a shape a hundred apps already own. A bracket pair
says *held between two hands*, and it happens to be how you would write the
app's initials in code.

## What makes it last

- **Flat colour, not gradient.** A gradient collapses into one muddy mid-tone at
  29px and dates itself besides. Two flat blocks meeting on a slant survive the
  reduction and read as the product's actual claim: two states, one frame.
- **A gap between grip and band.** 11 units of ground, in every version. Flush,
  the one-colour version fuses into a single slab and the mark stops being a
  mark. This is the detail that makes it work in embroidery, in a partner's
  monochrome footer, and anywhere a system tints everything one colour.
- **The band is a container.** The grip is constant; what sits between the
  brackets can be flat colour or a real frame of restyled video. Every style the
  app ships is a new poster without redrawing the logo — which is how the
  identity stays alive as the trend that inspired it passes.
- **Never level.** −4°, because the gesture never is.

## Palette

Sampled from the stylised frames of the capture, not invented.

| | | |
|---|---|---|
| Ink | `#07090C` | ground |
| Signal pink | `#FF2E7E` | off the Spider-Gwen mask |
| Signal cyan | `#17C8FF` | the dominant vivid hue in the capture |
| Cream | `#FFF4E8` | the grip |

## The wordmark

The name is set in the **system face** — SF Pro on Apple platforms, the page's own
stack on the web — semibold, tracked slightly tight, mixed case. It is type, not
artwork: nothing ships as outlines, and each surface sets it in whatever the platform
provides.

The mark carries the identity. A neutral, well-hinted face beside it costs nothing to
license, renders correctly at every size on every device, and never falls back to
something unintended.

Two custom faces were built and neither was better than this. They are kept in
`tools/` so the work is recoverable, but **nothing imports them**:

| | |
|---|---|
| `wordmark_stroked.py` | letterforms from stroked centrelines, plus a stroke-to-outline expansion |
| `wordmark_typeset.py` | Satoshi Bold, outlined |
| `wordmark_drawn.py` | the same custom idea rebuilt as solid filled shapes |
| `bake_wordmark.py`, `TextToPath.swift` | outline any installed face, if that route is ever taken |

## The loader

The mark opening, shutting, and turning a quarter, on a loop — the splash's own moves,
for anywhere that needs a loading state.

One cycle (1.75s): hold shut, the grips part and the band is revealed, hold open, the
grips snap shut, then the shut pair swings 90°. Four cycles is a full turn, so the loop
is 7s even though the eye reads it at 1.75s.

```swift
BrandLoader()                              // 64pt, turning
BrandLoader(style: .compact, size: 22)     // inline, in a button
BrandLoader(size: 5)                       // the floor; see below
```

### Full screen to 5×5

Not a scaling problem. At 5px the grip stroke is 0.35px and the slot of ground between
grip and band is 0.13px: both vanish, and what renders is a grey smudge. The binding
feature is **the ground, not the stroke** — it is the thinnest thing in the mark and the
one doing the most work, because with it closed the grips fuse to the band and it stops
being a bracket pair at all.

So the geometry is **redrawn per size band**, the way a type family cuts optical sizes: as
the box shrinks, the stroke and the ground get fatter relative to it and the band gives up
the room. The cut is chosen by **point size, not device pixels** — a 10pt mark on a 3×
screen has plenty of pixels and is still tiny to the eye, and picking by pixels would make
the loader look different on different hardware.

| cut | from | stroke / ground | what changes |
|---|---|---|---|
| `display` | 44 pt | 30 / 11 units | the mark exactly |
| `small` | 17 pt | 46 / 20 units | stroke and ground opened up; arms shortened |
| `micro` | 9 pt | 66 / 30 units | opened again; the duo-tone split and the −4° shear both drop |
| `dot` | under 9 pt | — | the mark stands down; the square crossfades pink to cyan |

Two forms, because a 2.4:1 mark inside a square is small by construction:

| | |
|---|---|
| **turning** | square; opens, shuts and turns. 44pt and up — below that it falls back to compact rather than turning illegibly |
| **compact** | wide; opens and shuts without turning. For buttons and rows |

**Use turning wherever there is room.** The compact form has no rotation in it at all —
it is not a slower turn, it is a different animation — so choosing it in a spot that
could have turned quietly loses half the loader. The rule is whether the context can
give up a square:

| where | form | why |
|---|---|---|
| `web/c` loading panel, `web/ugc` "Adding the effect" | turning, 56pt | centred blocks with room to spare |
| `web/ugc` upload progress row | compact, 17pt | inline beside a line of text; a square box there puts the band under 7pt |
| the app's primary button | compact, 20pt mono | a 52pt button spends more than half its height on rotation clearance |

- Nothing in it is a new shape. It is `SplashFrame` — the mark at a band width, every
  other quantity following from it — moving between the same two states the splash's
  beats 1 and 2 use. Only the band width changes, so the grips keep their geometry and
  merely translate.
- It turns **only while shut**, which is what sizes the box: it needs the open mark at
  rest, not the circle the open mark's corner would sweep.
- The split holds as a *fraction* of the band (39.4% / 54.6%) so the slant does not shear
  flatter as it opens, matching `SplashView`.
- Reduce Motion holds it open and pulses the opacity instead.

`ios/FingerFrame/Screens/BrandLoader.swift` and `tools/loader.py` are two implementations
of one animation, checked against each other numerically — 90 values across all three
cuts — so they cannot drift into two things that merely look alike.

## Where it is used

The mark is no longer a proposal in isolation — it is generated into every surface
from one source:

| | |
|---|---|
| App icon | `ios/.../AppIcon.appiconset/AppIcon-1024.png`, written by `generate.py` |
| Recorded video | `ios/FingerFrame/BrandMark.swift` — watermark and end-card draw the mark from it; the name beside it is CoreText and the system font |
| Website | `web/*.html`, recoloured and re-marked by `tools/emit_web.py` |
| Identity doc | `identity.html` |

The film-amber `#F0A22E` the brand started on is **gone**, not demoted to a
colourway: it predated the product having a look, and every surface has moved off it.

## Files

| | |
|---|---|
| `identity.html` | the whole proposal — rationale, icon sizes, durability tests, colourways, lockups, construction, misuse |
| `mark.svg` | the mark, full colour |
| `mark-mono.svg` | one colour |
| `loader.svg`, `loader-compact.svg` | the loader, standalone |
| `mark-wide.svg` | cropped tight, for lockups |
| `app-icon-1024.png` | ready for `AppIcon.appiconset` if the mark is chosen |
| `tools/` | `python3 tools/generate.py` rebuilds all of the above **and** the app icon |
| `tools/emit_brand_swift.py` | writes `ios/FingerFrame/BrandMark.swift` |
| `tools/emit_web.py` | recolours and re-marks the website |
| `tools/wordmark*.py` | unused custom wordmark attempts, kept for the record |

Regenerating needs `ffmpeg` (it pulls its reference frames out of the capture)
and `rsvg-convert` (the PNG export). Geometry is at the top of `tools/marks.py`.
Nothing extra is needed for the wordmark — it is not generated.

## Still open

- **Whether the wordmark should ever be drawn.** It is the system face today, which
  is a defensible answer and not a placeholder. If it is ever handed to a type
  designer, `tools/bake_wordmark.py` outlines any licensed face into the pipeline.
- **The design canvas.** `Finger Frame v2.dc.html` in the Claude Design project still
  draws its nine screens on the old amber and slate. Recolouring them is a design
  decision, not a mechanical one — the accent carries real weight on the paywall and
  the record button, and pink at `#FF2E7E` is louder than amber was.
