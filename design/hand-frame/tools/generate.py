#!/usr/bin/env python3
"""Build the hand-glyph preview page and the standalone SVGs.

    cd design/hand-frame/tools && python3 generate.py

Writes ../preview.html, ../hand-frame.svg and ../hand-frame-static.svg.
Nothing here touches the app; the glyph is swapped in by hand when it is wanted.
"""
import html, json, os, sys
import build
import final
import emit_swift

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)

# The illustration as it ships today, transcribed from HandFrameGlyph in
# ios/FingerFrame/ControlsView.swift so the comparison is honest.
OLD = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 56" width="100" height="56" aria-hidden="true">
  <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1">
    <path d="M15 42 C15 30, 18 22, 24 19 L27 17 L29 26 L26 34 L18 42 Z"/>
    <path d="M85 42 C85 30, 82 22, 76 19 L73 17 L71 26 L74 34 L82 42 Z"/>
  </g>
  <g stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-linecap="round" fill="none">
    <path d="M24 19 L25 11"/><path d="M29 26 L37 21"/>
    <path d="M76 19 L75 11"/><path d="M71 26 L63 21"/>
  </g>
  <rect x="34" y="11" width="32" height="22" rx="2" fill="none"
        stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
</svg>'''


def main():
    animated = build.svg(ids="a")
    static = build.svg(ids="s", animated=False)

    with open(os.path.join(OUT, "hand-frame.svg"), "w") as f:
        f.write(animated + "\n")
    with open(os.path.join(OUT, "hand-frame-static.svg"), "w") as f:
        f.write(static + "\n")

    # The three poses as raw vertex lists. Same vertex order in each, so a port
    # can lerp between them without re-deriving any geometry -- and it is the
    # form a Lottie shape layer would want too.
    poses = {}
    for name, pose in (("open", build.OPEN), ("rest", (0.0, 0.0)),
                       ("pinch", build.PINCH)):
        g = final.build(*pose)
        x, y, w, h = final.frame_rect(g)
        poses[name] = {
            "indexCurl": pose[0], "thumbCurl": pose[1],
            "leftHand": [[round(px, 2), round(py, 2)] for px, py in g["left"]],
            "frame": [round(v, 2) for v in (x + build.INSET, y,
                                            w - 2 * build.INSET, h)],
        }
    with open(os.path.join(OUT, "hand-frame-poses.json"), "w") as f:
        json.dump({"viewBox": [0, 0, final.VB_W, final.VB_H],
                   "note": "leftHand is a closed loop; mirror x about viewBox "
                           "width for the right hand. Vertex i is the same "
                           "anatomy in every pose.",
                   "cycle": {"keyTimes": build.KEY_TIMES.split(";"),
                             "poses": ["open", "open", "rest", "pinch",
                                       "pinch", "rest", "open", "open"]},
                   "poses": poses}, f, indent=1)

    tpl = open(os.path.join(HERE, "page.html")).read()
    subs = {
        "__OLD__": OLD,
        "__HERO__": build.svg(ids="hero"),
        "__L1__": build.svg(ids="l1"),
        "__L2__": build.svg(ids="l2"),
        "__L3__": build.svg(ids="l3"),
        "__L4__": build.svg(ids="l4"),
        "__P_OPEN__": build.svg(ids="po", pose=build.OPEN),
        "__P_REST__": build.svg(ids="pr", pose=(0.0, 0.0)),
        "__P_PINCH__": build.svg(ids="pp", pose=build.PINCH),
        "__SRC__": html.escape(animated),
    }
    for k, v in subs.items():
        tpl = tpl.replace(k, v)
    left = [k for k in subs if k in tpl]
    if left:
        sys.exit(f"unsubstituted placeholders: {left}")

    path = os.path.join(OUT, "preview.html")
    with open(path, "w") as f:
        f.write(tpl)
    print(f"wrote {path} ({len(tpl) // 1024} KB)")
    print(f"wrote {os.path.join(OUT, 'hand-frame.svg')} ({len(animated) // 1024} KB)")
    print(f"wrote {os.path.join(OUT, 'hand-frame-poses.json')}")
    # The app draws from the same geometry, so it is emitted from here too and
    # cannot drift from the page above.
    emit_swift.main()


if __name__ == "__main__":
    main()
