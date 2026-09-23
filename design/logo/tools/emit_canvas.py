#!/usr/bin/env python3
"""Corrections applied to the design canvas.

    python3 emit_canvas.py <in.dc.html> <out.dc.html>

Two passes, both re-runnable:

1. `with_busy_screen` — adds 2c-busy, the paywall with the loader in its CTA.
2. `play_once` — stops the mark-to-tick morph looping on 2i-done and 2j-claiming.

The app draws the brand loader in every busy state now — see BrandLoader.swift
and GlassPanel's primary button. The canvas had no spinner at all to replace:
its only waiting state is 2c-loading, which is a skeleton pulse while prices
arrive, and no screen showed a purchase in flight. So matching the app means
ADDING that state rather than editing one, cloned off 2c-v2 with its CTA in the
busy form — label hidden rather than removed, so the button cannot resize.

Re-runnable: an existing 2c-busy is replaced, not duplicated.
"""
import re
import sys

import loader as LD

OPT = r'<div class="dv-opt" id="{0}"[^>]*>'
CTA = ('<span style="font:600 16px/1 system-ui;color:#07090C;'
       'letter-spacing:-0.2px">Get 200 credits</span>')


def block(html, screen_id):
    """A whole dv-opt block, from its opening tag to the start of the next."""
    start = re.search(OPT.format(screen_id), html)
    if not start:
        return None
    nxt = re.search(r'<div class="dv-opt" id="', html[start.end():])
    return start.start(), start.end() + (nxt.start() if nxt else 0)


def with_busy_screen(html):
    found = block(html, "2c-busy")
    if found:
        html = html[:found[0]] + html[found[1]:]

    found = block(html, "2c-v2")
    if not found:
        sys.exit("2c-v2 not found — the paywall screen has been renamed")
    a, b = found
    source = html[a:b]
    if CTA not in source:
        sys.exit("the paywall CTA has changed — update CTA in emit_canvas.py")

    # Mono, not duo-tone: the CTA capsule is pink, and a pink band on a pink
    # capsule is invisible — the mark comes out as half a bracket pair. One ink
    # colour with the split as a sliver of the button's own fill reads on pink
    # and on cream alike. Compact, because the turn needs a square box that would
    # spend more than half of a 52pt button's height on rotation clearance.
    loader = LD.svg("dcbusy", 20, turning=False, mono="#07090C")
    clone = (source
             .replace(CTA, f'<span style="opacity:0;position:absolute">Get 200 '
                           f'credits</span>{loader}')
             .replace('id="2c-v2"', 'id="2c-busy"', 1)
             .replace('data-screen-label="2c-v2 Paywall — brand palette"',
                      'data-screen-label="2c-busy Paywall — purchase in flight"', 1)
             .replace('href="#2c-v2">2c-v2</a>Paywall — brand palette',
                      'href="#2c-busy">2c-busy</a>Paywall — purchase in flight', 1))
    return html[:b] + clone + html[b:]


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    html = open(sys.argv[1]).read()
    out = with_busy_screen(html)
    out, stopped = play_once(out)
    for sid, (css, smil) in stopped.items():
        print(f"{sid}: stopped {css} css loops and {smil} smil loops")
    open(sys.argv[2], "w").write(out)
    added = "refreshed" if 'id="2c-busy"' in html else "added"
    print(f"{added} 2c-busy -> {sys.argv[2]} ({len(out) // 1024} KB)")




# ------------------------------------------------------- one-shot transitions ---
#
# The mark-to-tick morph is a CONFIRMATION: it plays when you join the waitlist or
# claim credits, and then it is done. WaitlistView runs it exactly once and holds
# -- `Beat.linear` clamps to 0...1, and its own comment says "nothing here loops".
#
# The canvas ran it `6s linear infinite`, so at the loop boundary the tick, the
# stroke colour, the disc and the duo-tone band all reset inside a single frame:
# the disc vanishes, the band flicks back on, and the tick snaps back to brackets.
# That is not a stylistic difference from the app, it is the canvas depicting
# behaviour the app does not have, and the snap was the symptom.
#
# Only these two screens. The splash beats, the skeleton pulse and the loader all
# loop on purpose and are left alone.
ONE_SHOT_SCREENS = ("2i-done", "2j-claiming")


def play_once(html):
    """Make the morph screens run once and freeze, as the app does."""
    changed = {}
    for sid in ONE_SHOT_SCREENS:
        found = block(html, sid)
        if not found:
            continue
        a, b = found
        blk = html[a:b]
        css = len(re.findall(r'animation:[^";]*?\binfinite\b', blk))
        smil = blk.count('repeatCount="indefinite"')
        # CSS keeps `both`, which already holds the 100% frame.
        blk = re.sub(r'(animation:[^";]*?)\s+infinite\b', r'\1', blk)
        # SMIL's equivalent of forwards fill.
        blk = blk.replace('repeatCount="indefinite"', 'fill="freeze"')
        html = html[:a] + blk + html[b:]
        changed[sid] = (css, smil)
    return html, changed

if __name__ == "__main__":
    main()
