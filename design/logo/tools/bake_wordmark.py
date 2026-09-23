#!/usr/bin/env python3
"""Outline the wordmark once and check the result in.

    swiftc -O TextToPath.swift -o /tmp/t2p && python3 bake_wordmark.py

A wordmark is artwork, not a font call. Baking the outlines means the app, the
site and the exported video all draw identical letterforms with no font to
load, no fallback to go wrong, and no licence question at runtime.

WHY THIS FACE. Satoshi Bold (Indian Type Foundry, via Fontshare) is licensed
for commercial use, which matters because the alternative was Apple's DIN
Alternate: the better formal pairing with the mark -- squarer, more engineered
-- but bundled with macOS under a licence that does not cover outlining it into
someone's trademark. If FF DIN or DIN Next is ever licensed properly, re-bake
with `DINAlternate-Bold` at tracking 0.045 and everything downstream follows.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "wordmark-outlines.json")

FACE = "SatoshiVariable-Bold_Bold"
TRACKING = 0.03
STRINGS = ["FINGER FRAME", "FINGERFRAME.APP"]


def outline(text):
    r = subprocess.run(["/tmp/t2p", FACE, "100", str(TRACKING), text],
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"outliner failed for {text!r}: {r.stderr}")
    if r.stderr.strip():
        sys.exit(f"font substituted, refusing to bake: {r.stderr.strip()}")
    return json.loads(r.stdout)


def main():
    baked = {"face": FACE, "tracking": TRACKING, "cap": 100, "strings": {}}
    for s in STRINGS:
        d = outline(s)
        baked["strings"][s] = {k: d[k] for k in ("d", "minX", "minY", "width", "height")}
        print(f"  {s:18} {d['width']:7.1f} x {d['height']:6.1f}  ({len(d['d'])} chars)")
    baked["postScript"] = outline("F")["postScript"] if False else FACE
    with open(OUT, "w") as f:
        json.dump(baked, f, indent=1)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
