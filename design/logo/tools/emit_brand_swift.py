"""Emit ios/FingerFrame/BrandMark.swift — the mark, for the app.

CoreGraphics only, no UI framework, so BrandChecks can compile and render it on
the Mac and assert on actual pixels.
"""
import math, os
import marks as M

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
TARGET = os.path.join(REPO, "ios", "FingerFrame", "BrandMark.swift")


def rotated_bounds():
    """Tight bounds of the INKED mark once rotated.

    The grip is stroked on its centreline, so half its weight hangs outside the
    rectangle the geometry names. Leave that out and every caller that centres
    the mark puts it half a stroke off — which is exactly what BrandChecks
    caught on the end card.
    """
    half = M.T / 2
    x, y = (M.BOX - M.W) / 2 - half, (M.BOX - M.H) / 2 - half
    cx, cy = M.BOX / 2, M.BOX / 2
    a = math.radians(M.SHEAR)
    w, h = M.W + 2 * half, M.H + 2 * half
    pts = [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
    r = [(cx + (px - cx) * math.cos(a) - (py - cy) * math.sin(a),
          cy + (px - cx) * math.sin(a) + (py - cy) * math.cos(a)) for px, py in pts]
    xs, ys = [p[0] for p in r], [p[1] for p in r]
    return min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)


def rgb(hexv):
    h = hexv.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def colour(name, hexv):
    r, g, b = rgb(hexv)
    return (f"    /// `{hexv}`\n    static let {name} = CGColor(red: {r:.4f}, "
            f"green: {g:.4f}, blue: {b:.4f}, alpha: 1)")


def main():
    bx, by, bw, bh = rotated_bounds()
    x, y = (M.BOX - M.W) / 2, (M.BOX - M.H) / 2
    ix, iy = x + M.T + M.GAP, y + M.GAP
    iw, ih = M.W - 2 * (M.T + M.GAP), M.H - 2 * M.GAP
    mid = ix + iw * M.AT

    src = f'''import CoreGraphics

// The Finger Frame mark, in CoreGraphics.
//
// GENERATED from design/logo/tools/ (`python3 emit_brand_swift.py`), which is
// also what draws design/logo/identity.html. Change the geometry there and
// re-run it; editing these numbers by hand desynchronises the app from the
// identity.
//
// The mark only. The wordmark beside it is set in the platform's own system face
// by whoever is drawing — see RecordingBrand — rather than being shipped as
// artwork: custom letterforms were tried twice and neither earned its place.
//
// CoreGraphics only, deliberately. No UIKit, so ios/Tests/BrandChecks.swift can
// compile this on the Mac and assert on the pixels it actually produces.

enum BrandMark {{

    // MARK: Palette
    //
    // Sampled from the reference capture's stylised frames, not invented. The
    // film-amber this replaced was chosen before the product had a look, and is
    // gone from every surface rather than kept as an alternative.

{colour("ink", M.INK)}
{colour("pink", M.PINK)}
{colour("cyan", M.CYAN)}
{colour("cream", M.CREAM)}

    // MARK: Mark geometry
    //
    // Authored in a {M.BOX:.0f} box; see design/logo/README.md for why each number is
    // what it is. `bounds` is the mark's tight box AFTER the {M.SHEAR:.0f}° rotation, so
    // callers can fit it to a rect without leaving a rotated shape's slack.

    static let bounds = CGRect(x: {bx:.3f}, y: {by:.3f}, width: {bw:.3f}, height: {bh:.3f})
    /// Width over height of `bounds` — the mark is a wide band, never a square.
    static var aspect: CGFloat {{ bounds.width / bounds.height }}

    private static let shear: CGFloat = {M.SHEAR}
    private static let gripRect = CGRect(x: {x:.1f}, y: {y:.1f}, width: {M.W:.1f}, height: {M.H:.1f})
    private static let bandRect = CGRect(x: {ix:.1f}, y: {iy:.1f}, width: {iw:.1f}, height: {ih:.1f})
    private static let gripWidth: CGFloat = {M.T}
    private static let gripReturn: CGFloat = {M.RET}
    private static let splitMid: CGFloat = {mid:.2f}
    private static let splitLean: CGFloat = {M.DIAG}

    /// Draw the mark to fill `rect`, preserving its aspect and centring inside.
    ///
    /// `context` is expected to be a y-down bitmap, which is what
    /// `CGContext(data:...)` gives you — so the coordinates below are used exactly
    /// as the SVG masters state them.
    static func draw(in rect: CGRect, context: CGContext,
                     grip: CGColor = cream, left: CGColor = pink,
                     right: CGColor = cyan) {{
        let scale = min(rect.width / bounds.width, rect.height / bounds.height)
        let w = bounds.width * scale, h = bounds.height * scale

        context.saveGState()
        context.translateBy(x: rect.midX - w / 2, y: rect.midY - h / 2)
        context.scaleBy(x: scale, y: scale)
        context.translateBy(x: -bounds.minX, y: -bounds.minY)
        context.translateBy(x: {M.BOX/2:.0f}, y: {M.BOX/2:.0f})
        context.rotate(by: shear * .pi / 180)
        context.translateBy(x: -{M.BOX/2:.0f}, y: -{M.BOX/2:.0f})

        // The band: two flat colours meeting on a slant. Flat, because a gradient
        // collapses to one muddy mid-tone at the size a watermark actually is.
        context.setFillColor(left)
        context.fill(bandRect)
        context.setFillColor(right)
        context.beginPath()
        context.move(to: CGPoint(x: splitMid - splitLean / 2, y: bandRect.minY))
        context.addLine(to: CGPoint(x: bandRect.maxX, y: bandRect.minY))
        context.addLine(to: CGPoint(x: bandRect.maxX, y: bandRect.maxY))
        context.addLine(to: CGPoint(x: splitMid + splitLean / 2, y: bandRect.maxY))
        context.closePath()
        context.fillPath()

        // The grip: [ and ]. The ground showing between grip and band is what keeps
        // a one-colour version from fusing into a single slab.
        let g = gripRect
        context.setStrokeColor(grip)
        context.setLineWidth(gripWidth)
        context.setLineCap(.butt)
        context.setLineJoin(.miter)
        context.beginPath()
        context.move(to: CGPoint(x: g.minX + gripReturn, y: g.minY))
        context.addLine(to: CGPoint(x: g.minX, y: g.minY))
        context.addLine(to: CGPoint(x: g.minX, y: g.maxY))
        context.addLine(to: CGPoint(x: g.minX + gripReturn, y: g.maxY))
        context.move(to: CGPoint(x: g.maxX - gripReturn, y: g.minY))
        context.addLine(to: CGPoint(x: g.maxX, y: g.minY))
        context.addLine(to: CGPoint(x: g.maxX, y: g.maxY))
        context.addLine(to: CGPoint(x: g.maxX - gripReturn, y: g.maxY))
        context.strokePath()
        context.restoreGState()
    }}

}}
'''
    with open(TARGET, "w") as f:
        f.write(src)
    print(f"wrote {TARGET} ({len(src)//1024} KB)  mark bounds "
          f"{bw:.1f}x{bh:.1f} (aspect {bw/bh:.3f})")


if __name__ == "__main__":
    main()
