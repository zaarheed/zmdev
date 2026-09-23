"""The Finger Frame hand: disc skeleton, posed by joint angles."""
import math
from sdf import bone, contour
from gen import V, rotate, anchored_resample, to_path

# Left hand, back of the hand to the viewer, index up, thumb extended toward
# +x (inward, toward the frame). Local box ~ 0..115 x 10..160.

IDX_MCP = V(57, 66)
IDX_JOINTS = [IDX_MCP, V(56.5, 50), V(56.5, 37), V(57, 28)]
IDX_R = [11.6, 10.4, 9.5, 8.9]

THB_CMC = V(56, 100)
THB_JOINTS = [THB_CMC, V(72, 88), V(87, 79), V(97, 74)]
THB_R = [13.8, 11.0, 9.6, 9.0]

PALM_SPINE = [                       # (a, b, ra, rb) -- a rounded box, so the
    (V(29, 85), V(57, 83), 11.5, 11.5),   # sides of the fist stay flat-ish
    (V(30, 106), V(57, 104), 12.0, 11.0),
    (V(29, 85), V(30, 106), 11.5, 12.0),
    (V(57, 83), V(57, 104), 11.5, 11.0),
]
# The curled middle, ring and pinky. They sit on the top edge of the fist so
# that about half of each disc stands proud of it, which is what reads as a
# knuckle; sunk any lower and the fist goes back to being a mitten.
KNUCKLES = [(V(46, 66), 10.2), (V(34, 70), 9.4), (V(23, 75), 8.6)]
WRIST = (V(44, 104), V(43, 126), 12.5, 10.5)
KNUCKLE_BLEND = 2.2
THUMB_BLEND = 8.0
INDEX_BLEND = 5.0
WRIST_BLEND = 5.0

BBOX = (-6, 8, 120, 148)
LOOP_POINTS = 112
WITH_WRIST = False


def _chain(joints, radii, curl, spread_first=0.0):
    """Rotate a joint chain about its root; distal joints add their own flexion."""
    out = [joints[0]]
    for k, p in enumerate(joints[1:], start=1):
        a = curl * (1 + 0.22 * k) + (spread_first if k == 1 else spread_first * 1.1)
        out.append(rotate(p, joints[0], a))
    return out


def parts(index_curl=0.0, thumb_curl=0.0):
    idx = _chain(IDX_JOINTS, IDX_R, index_curl)
    thb = _chain(THB_JOINTS, THB_R, thumb_curl)

    palm = []
    for a, b, ra, rb in PALM_SPINE:
        palm += bone(a, b, ra, rb, n=14)
    wrist = bone(*WRIST, n=14) if WITH_WRIST else None

    index = []
    for i in range(len(idx) - 1):
        index += bone(idx[i], idx[i + 1], IDX_R[i], IDX_R[i + 1], n=14)
    thumb = []
    for i in range(len(thb) - 1):
        thumb += bone(thb[i], thb[i + 1], THB_R[i], THB_R[i + 1], n=14)

    ps = [(palm, 0.0)]
    if wrist:
        ps.append((wrist, WRIST_BLEND))
    ps += [(thumb, THUMB_BLEND), (index, INDEX_BLEND)]
    for c, r in KNUCKLES:
        ps.append(([(c[0], c[1], r)], KNUCKLE_BLEND))
    return ps, idx[-1], thb[-1]


# How the outline's vertex budget is split between the two arcs the anchors
# cut it into. Fixed, so the vertex at a given index means the same thing in
# every pose -- see gen.anchored_resample.
ARC_SPLIT = 0.30


def outline(index_curl=0.0, thumb_curl=0.0, res=0.6):
    ps, itip, ttip = parts(index_curl, thumb_curl)
    loop = contour(ps, BBOX, res=res)
    n_a = int(LOOP_POINTS * ARC_SPLIT)
    pts = anchored_resample(loop, [itip, ttip], [n_a, LOOP_POINTS - n_a])
    return pts, itip, ttip


def path(index_curl=0.0, thumb_curl=0.0, res=0.6, smooth=0.62):
    pts, itip, ttip = outline(index_curl, thumb_curl, res)
    return to_path(pts, close=True, smooth=smooth), itip, ttip
