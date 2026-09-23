#!/usr/bin/env python3
"""Build the Finger Frame identity page and the mark exports.

    cd design/logo/tools && python3 generate.py

Writes ../identity.html plus the SVG masters. Nothing here touches the app; the
mark is swapped in by hand when it is chosen.
"""
import base64, mimetypes, os, subprocess, sys
import loader as LD
import loader_page
import marks as M

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
REF = os.path.join(REPO, "ssstwitter.com_1786434988519.mp4")

def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()

def frame(t, crop, out, size="744:276", q="4"):
    """Pull one frame out of the reference capture."""
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t), "-i", REF,
                    "-frames:v", "1", "-vf", f"crop={crop},scale={size}",
                    "-q:v", q, out], check=True)
    return out

def icon(uid, size, rx="22.37%", **kw):
    return M.svg(uid, size=size, **kw)

def truepx_strip():
    """Each size rendered at its true pixel size, then blown up with nearest
    neighbour. Anything else flatters it."""
    import base64, subprocess, tempfile
    out = []
    for px in (24, 20, 17, 14, 12, 10, 9, 7, 5):
        svg = LD.svg(f"tp{px}", px, turning=False, animated=False, at=0.5)
        with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as f:
            f.write(svg)
            src = f.name
        png = src.replace(".svg", ".png")
        subprocess.run(["rsvg-convert", "-b", M.INK, src, "-o", png], check=True)
        b64 = base64.b64encode(open(png, "rb").read()).decode()
        out.append(f'<figure><img src="data:image/png;base64,{b64}" '
                   f'style="image-rendering:pixelated;height:{px * 7}px" alt="">'
                   f'<figcaption>{px} px</figcaption></figure>')
    return ('<div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap">'
            + "".join(out) + "</div>")


def main():
    tmp = os.path.join(HERE, ".frames")
    os.makedirs(tmp, exist_ok=True)
    bands = [frame(t, c, os.path.join(tmp, f"b{i}.jpg"))
             for i, (t, c) in enumerate([(5.0, "232:96:232:118"),
                                         (21.5, "300:112:150:96"),
                                         (22.5, "290:108:170:150")])]
    ref = frame(5.0, "638:300:0:30", os.path.join(tmp, "ref.jpg"), size="900:-1", q="5")

    subs = {}
    subs["__ICON_HERO__"] = icon("hero", 184)
    subs["__ICON_HERO2__"] = icon("hero2", 260)
    subs["__REF__"] = data_uri(ref)

    # --- size ladder ---------------------------------------------------------
    cells = []
    for px, label in [(120, "120 — settings"), (76, "76 — iPad"),
                      (60, "60 — home screen"), (40, "40 — spotlight"),
                      (29, "29 — settings small"), (16, "16 — favicon")]:
        cells.append(f'<figure><span class="icon" style="width:{px}px">{icon(f"s{px}", px)}</span>'
                     f'<figcaption>{label}</figcaption></figure>')
    subs["__SIZES__"] = "".join(cells)

    # --- springboard ---------------------------------------------------------
    tiles = []
    for i in range(8):
        if i == 2:
            tiles.append(f'<div class="app"><span class="icon">{icon("sb", 128)}</span>'
                         f'<span>Finger Frame</span></div>')
        else:
            tiles.append('<div class="app"><div class="tile"></div><span>&nbsp;</span></div>')
    subs["__SPRINGBOARD__"] = "".join(tiles)

    # --- durability ----------------------------------------------------------
    dur = [
        ("one colour, cream on ink", icon("d1", 200, band=M.mono_two(M.CREAM))),
        ("one colour, ink on paper", icon("d2", 200, ground=M.CREAM,
                                          bracket=M.INK, band=M.mono_two(M.INK))),
        ("full colour on paper", icon("d3", 200, ground=M.CREAM, bracket=M.INK)),
    ]
    subs["__DURABILITY__"] = "".join(
        f'<figure class="fig"><span class="icon">{s}</span>'
        f'<figcaption>{c}</figcaption></figure>' for c, s in dur)

    small = [("squint test — the silhouette holds",
              f'<span class="icon squint" style="width:120px">{icon("d4", 120)}</span>'),
             ("one colour at 64",
              f'<span class="icon" style="width:64px">{icon("d5", 64, band=M.mono_two(M.CREAM))}</span>'),
             ("one colour at 29",
              f'<span class="icon" style="width:29px">{icon("d6", 29, band=M.mono_two(M.CREAM))}</span>'),
             ("one colour at 16",
              f'<span class="icon" style="width:16px">{icon("d7", 16, band=M.mono_two(M.CREAM))}</span>')]
    subs["__DURABILITY_SMALL__"] = "".join(
        f'<figure>{s}<figcaption>{c}</figcaption></figure>' for c, s in small)

    # --- colourways ----------------------------------------------------------
    cells = []
    for i, (name, a, b, note) in enumerate(M.COLOURWAYS):
        cells.append(f'<figure class="fig"><span class="icon">{icon(f"c{i}", 220, band=M.flat_two(a, b))}</span>'
                     f'<figcaption><b style="color:#E8ECF0">{name}</b> — {note}</figcaption></figure>')
    subs["__COLOURWAYS__"] = "".join(cells)

    # --- the band as a container --------------------------------------------
    cells = []
    for i, b in enumerate(bands):
        cells.append(f'<figure class="fig"><span class="icon">'
                     f'{icon(f"L{i}", 220, band=M.image_band(data_uri(b)))}</span>'
                     f'<figcaption>live band — a frame of the app\'s own output</figcaption></figure>')
    subs["__LIVE__"] = "".join(cells)

    subs["__LOADER_BIG__"] = LD.svg("ldA", 150)
    subs["__LOADER_SIZES__"] = "".join(
        f'<figure>{LD.svg(f"ldS{i}", px)}<figcaption>{px} pt</figcaption></figure>'
        for i, px in enumerate((88, 64, 44)))
    subs["__LOADER_CUTS__"] = "".join(
        f'<tr><td style="padding:6px 12px 6px 0"><code>{c.name}</code></td>'
        f'<td style="padding:6px 12px 6px 0">{c.min_px} pt</td>'
        f'<td style="padding:6px 12px 6px 0">{c.T:.0f} / {c.GAP:.0f} units</td>'
        f'<td style="padding:6px 0;color:#7d8894">{note}</td></tr>'
        for c, note in zip(LD.CUTS,
                           ("the mark exactly",
                            "stroke and ground opened up; arms shortened",
                            "opened again; the duo-tone split and the −4° shear both drop"))
    ) + ('<tr><td style="padding:6px 12px 6px 0"><code>dot</code></td>'
         '<td style="padding:6px 12px 6px 0">under 9 pt</td>'
         '<td style="padding:6px 12px 6px 0">—</td>'
         '<td style="padding:6px 0;color:#7d8894">the mark stands down; the square '
         'crossfades pink to cyan</td></tr>')
    subs["__LOADER_TRUEPX__"] = truepx_strip()
    subs["__LOADER_STRIP__"] = "".join(
        f'<figure>{LD.svg(f"ldF{i}", 92, animated=False, at=t)}'
        f'<figcaption>{t:.2f}</figcaption></figure>'
        for i, t in enumerate((0.0, 0.2, 0.34, 0.5, 0.7, 0.82, 0.9, 0.97)))
    subs["__WIDE1__"] = M.wide_svg("w1", height=54)
    subs["__WIDE2__"] = M.wide_svg("w2", height=54)

    # --- palette -------------------------------------------------------------
    sw = [("Ink", M.INK, "#8b95a1"), ("Signal pink", M.PINK, "#2a0713"),
          ("Signal cyan", M.CYAN, "#04222e"), ("Cream", M.CREAM, "#4a4136")]
    subs["__SWATCHES__"] = "".join(
        f'<div class="swatch" style="background:{hexv};color:{fg}">{name}<br>{hexv}</div>'
        for name, hexv, fg in sw)

    # --- construction --------------------------------------------------------
    x, y = (M.BOX - M.W) / 2, (M.BOX - M.H) / 2
    ix, iy = x + M.T + M.GAP, y + M.GAP
    # The guides rotate with the mark. Drawn level against a mark that is not,
    # they read as a mistake rather than as a construction.
    guides = (
        f'<g transform="rotate({M.SHEAR} 256 256)">'
        f'<g stroke="#2f6d8a" stroke-width="1.2" fill="none" stroke-dasharray="6 6">'
        f'<rect x="{x-M.RET}" y="{y-M.RET}" width="{M.W+2*M.RET}" height="{M.H+2*M.RET}"/>'
        f'<rect x="{x}" y="{y}" width="{M.W}" height="{M.H}"/>'
        f'<rect x="{ix}" y="{iy}" width="{M.W-2*(M.T+M.GAP)}" height="{M.H-2*M.GAP}"/>'
        f'<path d="M{x-M.RET-30} 256H{x+M.W+M.RET+30}M256 {y-M.RET-30}V{y+M.H+M.RET+30}"'
        f' stroke-opacity="0.4"/></g>'
        f'<g fill="#7fd4f0" font-family="ui-monospace,monospace" font-size="15">'
        f'<text x="{x-M.RET}" y="{y-M.RET-13}">clear space 86</text>'
        f'<text x="{x}" y="{y+M.H+M.RET+26}">372 × 138</text>'
        f'<text x="{x+M.W-116}" y="{y-14}">gap 11</text></g></g>'
        f'<g fill="#7fd4f0" font-family="ui-monospace,monospace" font-size="15">'
        f'<text x="-30" y="-16">rotated −4°</text></g>')
    subs["__CONSTRUCTION__"] = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-44 -44 600 600">'
        f'<rect x="-44" y="-44" width="600" height="600" fill="{M.INK}"/>'
        f'{M.mark_body("cn", bleed=True)}{guides}</svg>')

    # --- misuse --------------------------------------------------------------
    bad = [
        ("no gradients in the band — muddy at icon size",
         icon("x1", 200, band=lambda u, X, Y, Wd, Hh:
              f'<defs><linearGradient id="{u}-bg" x1="0" x2="1"><stop offset="0" stop-color="{M.PINK}"/>'
              f'<stop offset="1" stop-color="{M.CYAN}"/></linearGradient></defs>'
              f'<rect x="{X}" y="{Y}" width="{Wd}" height="{Hh}" fill="url(#{u}-bg)"/>')),
        ("do not close the gap — the one-colour version dies",
         icon("x2", 200, gap=0)),
        ("do not level it — the gesture is never level",
         icon("x3", 200, shear=0)),
        ("and what closing the gap costs, in one colour",
         icon("x4", 200, gap=0, band=M.mono_two(M.CREAM))),
    ]
    subs["__MISUSE__"] = "".join(
        f'<figure class="no fig"><span class="icon">{s}</span>'
        f'<figcaption>{c}</figcaption></figure>' for c, s in bad)

    tpl = open(os.path.join(HERE, "page.html")).read()
    for k, v in subs.items():
        tpl = tpl.replace(k, v)
    left = [k for k in subs if k in tpl]
    if left:
        sys.exit(f"unsubstituted: {left}")

    path = os.path.join(OUT, "identity.html")
    open(path, "w").write(tpl)

    # SVG masters
    open(os.path.join(OUT, "mark.svg"), "w").write(M.svg("m", 512) + "\n")
    open(os.path.join(OUT, "mark-mono.svg"), "w").write(
        M.svg("mm", 512, band=M.mono_two(M.CREAM)) + "\n")
    open(os.path.join(OUT, "mark-wide.svg"), "w").write(M.wide_svg("mw", 138) + "\n")
    open(os.path.join(OUT, "loader.html"), "w").write(loader_page.page())
    open(os.path.join(OUT, "loader.svg"), "w").write(LD.svg("ld", 128) + "\n")
    open(os.path.join(OUT, "loader-compact.svg"), "w").write(
        LD.svg("ldc", 64, turning=False) + "\n")

    # A 1024 PNG, ready to drop into AppIcon.appiconset when the mark is chosen.
    png = os.path.join(OUT, "app-icon-1024.png")
    src = os.path.join(tmp, "icon.svg")
    open(src, "w").write(M.svg("icon", 1024))
    subprocess.run(["rsvg-convert", "-w", "1024", "-h", "1024", src, "-o", png], check=True)
    print(f"wrote {png}")

    # …and straight into the asset catalogue. iOS applies its own mask, so the
    # square full-bleed art is what ships.
    shipped = os.path.join(REPO, "ios", "FingerFrame", "Assets.xcassets",
                           "AppIcon.appiconset", "AppIcon-1024.png")
    if os.path.isdir(os.path.dirname(shipped)):
        subprocess.run(["rsvg-convert", "-w", "1024", "-h", "1024", src, "-o", shipped],
                       check=True)
        print(f"wrote {shipped}")
    print(f"wrote {path} ({len(tpl)//1024} KB)")
    print("wrote mark.svg, mark-mono.svg, mark-wide.svg, loader.svg, "
          "loader-compact.svg, loader.html")

if __name__ == "__main__":
    main()
