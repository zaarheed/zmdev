"""Emit ios/FingerFrame/HandFrameGlyph.swift from the same geometry as the SVG."""
import os
import build, final

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
TARGET = os.path.join(REPO, "ios", "FingerFrame", "HandFrameGlyph.swift")

POSES = [("open", build.OPEN), ("rest", build.MID), ("pinch", build.PINCH)]
# Index into POSES for each keyframe of the cycle, matching build.CYCLE.
CYCLE_IDX = [0, 0, 1, 2, 2, 1, 0, 0]


def fmt_points(pts, per_line=6):
    out, line = [], []
    for x, y in pts:
        line.append(f"{x:.2f}, {y:.2f},")
        if len(line) == per_line:
            out.append("        " + " ".join(line))
            line = []
    if line:
        out.append("        " + " ".join(line))
    return "\n".join(out).rstrip(",")


def main():
    POINT_COUNT = len(final.build()["left"])
    tables, frames = [], []
    for name, pose in POSES:
        g = final.build(*pose)
        x, y, w, h = final.frame_rect(g)
        x += build.INSET
        w -= 2 * build.INSET
        tables.append(f"    /// {name} — index {pose[0]:+.1f}°, thumb {pose[1]:+.1f}°\n"
                      f"    static let {name}: [CGFloat] = [\n{fmt_points(g['left'])}\n    ]")
        frames.append(f"        CGRect(x: {x:.2f}, y: {y:.2f}, width: {w:.2f}, height: {h:.2f})")

    key_times = ", ".join(build.KEY_TIMES.split(";"))
    splines = ",\n".join(
        "        (" + ", ".join(s.split()) + ")" for s in build.KEY_SPLINE.split(";"))

    src = f'''import SwiftUI

// Camera screen illustration for "Throw your hands up" — two hands making a
// rectangular frame with index finger and thumb, pinching on a loop.
//
// GENERATED. The pose tables and the timing below come out of
// design/hand-frame/tools/ (`python3 generate.py`), which is also what builds
// design/hand-frame/preview.html. Change a joint angle there and re-run it;
// editing the numbers here by hand desynchronises the app from the design.
//
// Each pose is the same {POINT_COUNT}-point outline of the LEFT hand, resampled so that a
// given index is the same piece of anatomy in every pose — which is what lets
// the glyph interpolate between them and read as fingers bending rather than
// as the outline melting. The right hand is the same table mirrored about the
// middle of the box.
//
// The frame is not decoration laid on top: it is redrawn from where the
// fingertips land, the same relationship FrameTracker uses, where the quad
// corners are [leftIndex, rightIndex, rightThumb, leftThumb]. Pinching
// therefore shrinks the frame, which is what the gesture really does.

/// Pose tables and timing for `HandFrameGlyph`.
private enum HandFramePose {{
    /// The coordinate box the tables are authored in.
    static let box = CGSize(width: {final.VB_W}, height: {final.VB_H})
    static let cycle: Double = {build.CYCLE_SECONDS}
    static let strokeWidth: CGFloat = 2.3
    static let cornerRadius: CGFloat = 2

{chr(10).join(tables)}

    static let tables = [open, rest, pinch]

    /// Frame rectangles for the poses above, in the same order.
    static let frames = [
{",\n".join(frames)}
    ]

    // The pinch cycle: which pose each keyframe holds, when it lands, and the
    // cubic-bezier easing into it. Mirrors the SMIL in hand-frame.svg exactly.
    static let keyTimes: [Double] = [{key_times}]
    static let keyPoses: [Int] = {CYCLE_IDX}
    static let easings: [(Double, Double, Double, Double)] = [
{splines}
    ]

    /// Vertical drift, so the hands are never perfectly still.
    static let breatheTimes: [Double] = [0, 0.31, 0.6, 1]
    static let breatheValues: [CGFloat] = [0, -0.9, 0.3, 0]

    // MARK: Sampling

    /// Solve a CSS-style cubic-bezier easing for `x`, then return its `y`.
    static func ease(_ c: (Double, Double, Double, Double), _ x: Double) -> Double {{
        if x <= 0 {{ return 0 }}
        if x >= 1 {{ return 1 }}
        let bez = {{ (a: Double, b: Double, t: Double) -> Double in
            let u = 1 - t
            return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t
        }}
        // Newton first; it converges in two or three steps for these curves,
        // and bisection is only there so a degenerate control point cannot
        // spin the loop.
        var t = x
        for _ in 0..<6 {{
            let dx = bez(c.0, c.2, t) - x
            if abs(dx) < 1e-5 {{ return bez(c.1, c.3, t) }}
            let u = 1 - t
            let slope = 3 * u * u * c.0 + 6 * u * t * (c.2 - c.0) + 3 * t * t * (1 - c.2)
            if abs(slope) < 1e-6 {{ break }}
            t -= dx / slope
        }}
        var lo = 0.0, hi = 1.0
        t = x
        for _ in 0..<20 {{
            let v = bez(c.0, c.2, t)
            if abs(v - x) < 1e-5 {{ break }}
            if v < x {{ lo = t }} else {{ hi = t }}
            t = (lo + hi) / 2
        }}
        return bez(c.1, c.3, t)
    }}

    /// Piecewise-linear lookup, for the drift.
    static func ramp(_ times: [Double], _ values: [Double], _ phase: Double) -> Double {{
        for i in 0..<(times.count - 1) where phase < times[i + 1] {{
            let span = times[i + 1] - times[i]
            let t = span > 0 ? (phase - times[i]) / span : 0
            return values[i] + (values[i + 1] - values[i]) * t
        }}
        return values[values.count - 1]
    }}

    /// The interpolated outline and frame at a point in the cycle.
    static func sample(_ phase: Double) -> (points: [CGPoint], frame: CGRect) {{
        var seg = keyTimes.count - 2
        for i in 0..<(keyTimes.count - 1) where phase < keyTimes[i + 1] {{
            seg = i
            break
        }}
        let span = keyTimes[seg + 1] - keyTimes[seg]
        let local = span > 0 ? (phase - keyTimes[seg]) / span : 0
        let t = CGFloat(ease(easings[seg], local))

        let a = tables[keyPoses[seg]], b = tables[keyPoses[seg + 1]]
        var pts = [CGPoint]()
        pts.reserveCapacity(a.count / 2)
        for i in stride(from: 0, to: a.count, by: 2) {{
            pts.append(CGPoint(x: a[i] + (b[i] - a[i]) * t,
                               y: a[i + 1] + (b[i + 1] - a[i + 1]) * t))
        }}
        let fa = frames[keyPoses[seg]], fb = frames[keyPoses[seg + 1]]
        let frame = CGRect(x: fa.minX + (fb.minX - fa.minX) * t,
                           y: fa.minY + (fb.minY - fa.minY) * t,
                           width: fa.width + (fb.width - fa.width) * t,
                           height: fa.height + (fb.height - fa.height) * t)
        return (pts, frame)
    }}

    /// Closed Catmull-Rom through the outline, as cubics. The 0.62 tension is
    /// the same one the SVG is fitted with, so both draw the identical curve.
    static func outline(_ pts: [CGPoint], _ m: CGAffineTransform) -> Path {{
        var path = Path()
        guard pts.count > 3 else {{ return path }}
        let n = pts.count
        let k: CGFloat = 0.62 / 3
        let at = {{ (i: Int) in pts[((i % n) + n) % n].applying(m) }}
        path.move(to: at(0))
        for i in 0..<n {{
            let p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
            path.addCurve(to: p2,
                          control1: CGPoint(x: p1.x + (p2.x - p0.x) * k,
                                            y: p1.y + (p2.y - p0.y) * k),
                          control2: CGPoint(x: p2.x - (p3.x - p1.x) * k,
                                            y: p2.y - (p3.y - p1.y) * k))
        }}
        path.closeSubpath()
        return path
    }}
}}

/// Two hands framing a rectangle, pinching on a loop.
///
/// Sized by its container; author it at roughly 112x58 to keep the box's
/// aspect. Decorative — the instruction block around it is already one
/// combined accessibility element.
struct HandFrameGlyph: View {{
    /// Off draws the rest pose, for previews and for reduce-motion.
    var animated: Bool = true

    @Environment(\\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {{
        let moving = animated && !reduceMotion
        // 30fps rather than the display link: this sits on top of the camera
        // preview, the motion is slow enough that nobody can tell, and it
        // halves the redraws on the busiest screen in the app.
        TimelineView(.animation(minimumInterval: 1.0 / 30.0, paused: !moving)) {{ timeline in
            Canvas {{ context, size in
                let clock = timeline.date.timeIntervalSinceReferenceDate
                let phase = moving
                    ? clock.truncatingRemainder(dividingBy: HandFramePose.cycle)
                        / HandFramePose.cycle
                    : 0
                draw(&context, size: size, phase: phase, clock: moving ? clock : 0)
            }}
        }}
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }}

    private func draw(_ context: inout GraphicsContext, size: CGSize,
                      phase: Double, clock: Double) {{
        let s = size.width / HandFramePose.box.width
        let (pts, frame) = HandFramePose.sample(phase)
        let drift = CGFloat(HandFramePose.ramp(
            HandFramePose.breatheTimes,
            HandFramePose.breatheValues.map(Double.init), phase))

        let hands = CGAffineTransform(translationX: 0, y: drift * s)
        let toView = CGAffineTransform(scaleX: s, y: s)
        let left = toView.concatenating(hands)
        let right = CGAffineTransform(scaleX: -1, y: 1)
            .concatenating(.init(translationX: HandFramePose.box.width, y: 0))
            .concatenating(toView)
            .concatenating(hands)

        let lineWidth = HandFramePose.strokeWidth * s
        for m in [left, right] {{
            let path = HandFramePose.outline(pts, m)
            context.fill(path, with: .color(FF.handFill))
            context.stroke(path, with: .color(FF.handStroke),
                           style: StrokeStyle(lineWidth: lineWidth, lineJoin: .round))
        }}

        // The frame does not drift with the hands; it is what they are aiming at.
        let r = CGRect(x: frame.minX * s, y: frame.minY * s,
                       width: frame.width * s, height: frame.height * s)
        let rounded = Path(roundedRect: r, cornerRadius: HandFramePose.cornerRadius * s)

        // Marching ants, at the same 2.2s the SVG uses.
        let period = 8.0 * Double(s)
        let offset = (clock / 2.2 * 16.0 * Double(s)).truncatingRemainder(dividingBy: period)
        context.stroke(rounded, with: .color(FF.frameStroke),
                       style: StrokeStyle(lineWidth: lineWidth * 0.6,
                                          lineCap: .round,
                                          dash: [3 * s, 5 * s],
                                          dashPhase: CGFloat(-offset)))
    }}
}}

#Preview {{
    ZStack {{
        Color.black
        HandFrameGlyph().frame(width: 112, height: 58)
    }}
    .ignoresSafeArea()
}}
'''
    with open(TARGET, "w") as f:
        f.write(src)
    print(f"wrote {TARGET} ({len(src) // 1024} KB)")


if __name__ == "__main__":
    main()
