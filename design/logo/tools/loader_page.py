"""A focused, live preview of the loader — every size on one screen, in motion."""
import loader as LD
import marks as M

GROUNDS = [("ink", M.INK), ("cream", M.CREAM), ("mid", "#545860"), ("white", "#ffffff")]


def _row(label, items, note=""):
    figs = "".join(
        f'<figure><div class="slot">{svg}</div><figcaption>{cap}</figcaption></figure>'
        for svg, cap in items)
    n = f'<p class="note">{note}</p>' if note else ""
    return f'<section><h2>{label}</h2>{n}<div class="row">{figs}</div></section>'


def page():
    turning = _row("Turning &mdash; 44pt and up",
                   [(LD.svg(f"t{px}", px), f"{px} pt") for px in (160, 112, 88, 64, 44)],
                   "Square, because it has to hold the open mark in either orientation.")
    compact = _row("Compact &mdash; buttons and rows",
                   [(LD.svg(f"c{px}", px, turning=False), f"{px} pt")
                    for px in (44, 36, 28, 22, 17, 14, 11, 9)],
                   "Drops the turn, so it needs only the mark's own 2:1 bounds and is "
                   "drawn about twice as large in the same height.")
    dot = _row("The floor &mdash; under 9pt",
               [(LD.svg(f"d{px}", px), f"{px} pt") for px in (8, 6, 5)],
               "Three pixels cannot hold five features, so the mark stands down and the "
               "square crossfades between the two hues. Shown at true size &mdash; and "
               "again at 8&times;, which is the only way to see what it is doing.")
    dot_big = "".join(
        f'<figure><div class="slot" style="transform:scale(8);transform-origin:center">'
        f'{LD.svg(f"dz{px}", px)}</div><figcaption>{px} pt at 8&times;</figcaption></figure>'
        for px in (8, 6, 5))

    swatches = "".join(
        f'<button data-bg="{hexv}" class="{ "on" if i == 0 else "" }">{name}</button>'
        for i, (name, hexv) in enumerate(GROUNDS))

    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Finger Frame — loader</title>
<style>
:root{{--ink:{M.INK};--line:#232b34;--dim:#7d8894}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--ink);color:#E8ECF0;padding:34px 30px 90px;
 font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
 -webkit-font-smoothing:antialiased;transition:background .18s}}
h1{{font-size:20px;margin:0 0 4px;letter-spacing:-.3px}}
h2{{font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;
 text-transform:uppercase;color:var(--dim);margin:40px 0 12px;padding-bottom:8px;
 border-bottom:1px solid var(--line)}}
p.lede,p.note{{color:var(--dim);margin:0 0 14px;max-width:74ch;font-size:14px}}
.row{{display:flex;gap:34px;align-items:center;flex-wrap:wrap}}
figure{{margin:0;text-align:center}}
figcaption{{font:10px ui-monospace,monospace;color:var(--dim);margin-top:10px}}
.slot{{display:flex;align-items:center;justify-content:center;min-height:44px}}
.bar{{display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:16px;
 padding:12px 14px;border:1px solid var(--line);border-radius:10px}}
button{{font:11px ui-monospace,monospace;color:#E8ECF0;background:#1b222b;
 border:1px solid var(--line);border-radius:7px;padding:6px 11px;cursor:pointer}}
button.on{{background:#FF2E7E;border-color:#FF2E7E;color:#22060f}}
label{{font:10px ui-monospace,monospace;letter-spacing:.1em;color:var(--dim);
 text-transform:uppercase}}
.zoomrow{{display:flex;gap:120px;align-items:center;margin-top:56px;margin-bottom:40px}}
body.light{{color:#14181d}} body.light h1{{color:#14181d}}
</style></head>
<body>
<h1>Finger Frame &mdash; loader</h1>
<p class="lede">Live. Everything on this page is the same animation at different sizes,
running in sync. Rebuild with <code>python3 tools/generate.py</code>.</p>

<div class="bar">
  <label>Ground</label><div id="bg">{swatches}</div>
  <label style="margin-left:14px">Speed</label>
  <div id="sp"><button data-mul="0.35">0.35&times;</button>
  <button data-mul="1" class="on">1&times;</button>
  <button data-mul="2">2&times;</button></div>
  <button id="pp" style="margin-left:14px">pause</button>
</div>

{turning}
{compact}
{dot}
<div class="zoomrow">{dot_big}</div>

<script>
const svgs = () => [...document.querySelectorAll('svg')];
document.getElementById('bg').addEventListener('click', e => {{
  const b = e.target.closest('button'); if (!b) return;
  [...e.currentTarget.children].forEach(c => c.classList.toggle('on', c === b));
  document.body.style.background = b.dataset.bg;
  document.body.classList.toggle('light', ['#ffffff', '{M.CREAM}'].includes(b.dataset.bg));
}});
document.getElementById('sp').addEventListener('click', e => {{
  const b = e.target.closest('button'); if (!b) return;
  [...e.currentTarget.children].forEach(c => c.classList.toggle('on', c === b));
  const mul = parseFloat(b.dataset.mul);
  document.querySelectorAll('animate, animateTransform').forEach(a => {{
    const base = a.dataset.dur || (a.dataset.dur = a.getAttribute('dur'));
    a.setAttribute('dur', (parseFloat(base) / mul).toFixed(3) + 's');
  }});
  svgs().forEach(s => s.setCurrentTime(0));
}});
let playing = true;
document.getElementById('pp').onclick = e => {{
  playing = !playing;
  e.target.textContent = playing ? 'pause' : 'play';
  svgs().forEach(s => playing ? s.unpauseAnimations() : s.pauseAnimations());
}};
</script>
</body></html>'''
