// Outline a string in an installed typeface and print it as SVG path data.
//
//     swiftc -O TextToPath.swift -o /tmp/t2p
//     /tmp/t2p "DIN Alternate" 100 0.04 "FINGER FRAME"
//
// A wordmark has to be artwork, not a font call: outlines carry no licensing or
// loading question at runtime, and they can be nudged afterwards. This exists so
// the outlines come from the real face rather than from something hand-drawn to
// look like one.
import CoreText
import CoreGraphics
import Foundation

let args = CommandLine.arguments
guard args.count >= 5,
      let size = Double(args[2]), let tracking = Double(args[3]) else {
    FileHandle.standardError.write("usage: t2p <family> <capSize> <tracking-em> <text>\n".data(using: .utf8)!)
    exit(2)
}
let family = args[1], text = args[4]

// Optional 5th arg: a variable font's weight axis (e.g. 700).
var base = CTFontCreateWithName(family as CFString, size, nil)
if args.count >= 6, let wght = Double(args[5]) {
    let varDesc = CTFontDescriptorCreateCopyWithAttributes(
        CTFontCopyFontDescriptor(base),
        [kCTFontVariationAttribute: [2003265652: wght]] as CFDictionary)  // 'wght'
    base = CTFontCreateWithFontDescriptor(varDesc, size, nil)
}
// Confirm we actually got the face asked for; CoreText substitutes silently, and
// a silent fallback to Helvetica is exactly the kind of thing that ships.
let actual = CTFontCopyFamilyName(base) as String
let postScript = CTFontCopyPostScriptName(base) as String
if postScript.lowercased() != family.lowercased()
    && actual.lowercased() != family.lowercased() {
    FileHandle.standardError.write(
        "substituted: asked \(family), got \(postScript)\n".data(using: .utf8)!)
}

let attributed = NSAttributedString(string: text, attributes: [
    NSAttributedString.Key(kCTFontAttributeName as String): base,
    NSAttributedString.Key(kCTKernAttributeName as String): size * tracking,
])
let line = CTLineCreateWithAttributedString(attributed)

var out = ""
var minX = Double.infinity, minY = Double.infinity
var maxX = -Double.infinity, maxY = -Double.infinity

for run in (CTLineGetGlyphRuns(line) as! [CTRun]) {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRangeMake(0, count), &glyphs)
    CTRunGetPositions(run, CFRangeMake(0, count), &positions)
    let font = unsafeBitCast(
        CFDictionaryGetValue(CTRunGetAttributes(run),
                             unsafeBitCast(kCTFontAttributeName, to: UnsafeRawPointer.self)),
        to: CTFont.self)

    for i in 0..<count {
        guard let path = CTFontCreatePathForGlyph(font, glyphs[i], nil) else { continue }
        let dx = positions[i].x, dy = positions[i].y
        // y is flipped: CoreText is y-up, SVG is y-down.
        path.applyWithBlock { e in
            let p = e.pointee.points
            func fmt(_ i: Int) -> String {
                let x = p[i].x + dx, y = -(p[i].y + dy)
                minX = min(minX, x); maxX = max(maxX, x)
                minY = min(minY, y); maxY = max(maxY, y)
                return String(format: "%.2f %.2f", x, y)
            }
            switch e.pointee.type {
            case .moveToPoint:     out += "M\(fmt(0))"
            case .addLineToPoint:  out += "L\(fmt(0))"
            case .addQuadCurveToPoint: out += "Q\(fmt(0)) \(fmt(1))"
            case .addCurveToPoint: out += "C\(fmt(0)) \(fmt(1)) \(fmt(2))"
            case .closeSubpath:    out += "Z"
            @unknown default: break
            }
        }
    }
}

let json: [String: Any] = [
    "d": out,
    "minX": minX, "minY": minY,
    "width": maxX - minX, "height": maxY - minY,
    "family": actual, "postScript": postScript,
]
print(String(data: try! JSONSerialization.data(withJSONObject: json), encoding: .utf8)!)
