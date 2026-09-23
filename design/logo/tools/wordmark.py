"""The shipping wordmark.

Three were built and compared side by side:

  1. wordmark_stroked  -- custom letterforms from stroked centrelines.
  2. wordmark_typeset  -- Satoshi Bold, outlined.
  3. wordmark_drawn    -- custom letterforms redrawn as filled outlines.

**(1) ships**, chosen on the look with all three in front of us. It goes out as
expanded outlines rather than as strokes -- identical artwork, one filled path,
nothing to scale wrong at small sizes. See wordmark_stroked.py.

The other two stay in the tree so the comparison in identity.html keeps working
and so the alternatives are recoverable rather than remembered.
"""
from wordmark_stroked import (CAP, FACE, G as GLYPHS, NAME, URL,  # noqa: F401
                              filled_svg as svg, outline, path_for, shapes_for,
                              strings, width_of)
