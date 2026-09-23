"""Splice the new glyph into the Claude Design canvas HTML.

The canvas is the design source of truth the app was built from, so the SVG it
carries has to be the same geometry the app now draws, at the same weights --
the CSS-variable hooks the preview page uses are resolved to literals here
because the canvas has nowhere to define them.
"""
import re, sys
import build

# ControlsView.swift `enum FF`, so the canvas and the app agree.
COLOURS = {
    "var(--ff-hand-fill, rgba(255,255,255,0.07))": "rgba(255,255,255,0.05)",
    "var(--ff-hand-stroke, rgba(255,255,255,0.82))": "rgba(255,255,255,0.42)",
    "var(--ff-frame-dash, rgba(255,255,255,0.5))": "rgba(255,255,255,0.5)",
    "var(--ff-frame, rgba(255,255,255,0.62))": "rgba(255,255,255,0.5)",
}


def canvas_svg(ids):
    s = build.svg(ids=ids)
    for var, literal in COLOURS.items():
        s = s.replace(var, literal)
    s = s.replace(f'width="{build.VB_W}" height="{build.VB_H}"', 'width="125" height="56"')
    # the corner-bracket layer is not the chosen treatment; drop it entirely
    s = re.sub(r'\n *<path class="bracket".*?</path>', "", s, flags=re.S)
    return s


# Matches both the original hand-drawn glyph and anything this script has
# already emitted, so the canvas can be re-synced as the geometry changes.
OLD = re.compile(
    r'<svg[^>]*?(?:width="100" height="56"|width="112" height="58"'
    r'|width="125" height="56")[^>]*>.*?</svg>', re.S)


def main(path, out):
    html = open(path).read()
    hits = OLD.findall(html)
    if len(hits) != 2:
        sys.exit(f"expected the glyph twice (2a, 2g); found {len(hits)}")

    n = 0
    def sub(_m):
        nonlocal n
        n += 1
        return canvas_svg(f"ff{n}")
    html = OLD.sub(sub, html)
    open(out, "w").write(html)
    print(f"replaced {n} glyphs -> {out} ({len(html) // 1024} KB)")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
