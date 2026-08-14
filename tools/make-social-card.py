#!/usr/bin/env python3
"""Render a Transition OPS social card from an image brief.

The PAO packet emits one image brief per draft. This turns a brief into the
PNG that ships with it. It is deliberately NOT wired into the scheduled
workflow: the workflow holds no credential that can write a ref, so it cannot
commit an image, and rendering in CI would produce an artifact nobody looks at.
Dean runs this locally against the brief in the packet issue.

    python3 tools/make-social-card.py brief.json out.png
    python3 tools/make-social-card.py --self-test

BRIEF SCHEMA — every field required except panel_lines, which may be empty:

    {
      "channel":     "tops-facebook" | "vbs-linkedin" | "vbs-facebook",
      "headline":    "one line, the claim",
      "chips":       ["FREE", "ACTIVE", "VETERAN"],
      "panel_lines": ["supporting line", "second line"],
      "footer":      "transitionops.org"
    }

WHY IT VALIDATES INSTEAD OF COPING. A card that silently truncates a headline
ships a sentence that changes meaning. Every overflow condition is an error
with the measured width in the message, never a quiet ellipsis. The caller
shortens the text; the renderer does not decide what to drop.

Palette is the app's, so a card and the app read as one system:
canvas #0E120B, surface #161B11, ink #EDE7D4, dim #9C9577, gold #F0C419,
green #8BB83C. Do not introduce a colour that is not in index.html.
"""
import json
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("FAIL: Pillow is not installed. python3 -m pip install --user pillow")

CANVAS = (14, 18, 11)
SURFACE = (22, 27, 17)
INK = (237, 231, 212)
DIM = (156, 149, 119)
GOLD = (240, 196, 25)
GREEN = (139, 184, 60)

CHANNELS = {
    "tops-facebook": {"size": (1080, 1080), "label": "TRANSITION OPS"},
    "vbs-facebook": {"size": (1080, 1080), "label": "VETERAN BRIDGE SOLUTIONS"},
    "vbs-linkedin": {"size": (1200, 630), "label": "VETERAN BRIDGE SOLUTIONS"},
}

REQUIRED = ("channel", "headline", "chips", "footer")

# Ordered by preference. The app uses Oswald; a box without it falls back to a
# condensed grotesque, then to whatever Pillow has. The card still renders.
FONT_CANDIDATES = [
    "/Library/Fonts/Oswald-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def text_width(draw, text, font):
    return draw.textbbox((0, 0), text, font=font)[2]


def wrap(draw, text, font, max_w):
    """Greedy wrap. Raises if a single word cannot fit - that is the caller's
    problem to fix, not something to solve by shrinking type silently."""
    words = text.split()
    if not words:
        return []
    lines, cur = [], words[0]
    for w in words[1:]:
        trial = cur + " " + w
        if text_width(draw, trial, font) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    for ln in lines:
        wpx = text_width(draw, ln, font)
        if wpx > max_w:
            raise ValueError(
                "word too long for the card: %r is %dpx, limit %dpx" % (ln, wpx, max_w)
            )
    return lines


def validate(brief):
    if not isinstance(brief, dict):
        raise ValueError("brief must be a JSON object")
    missing = [k for k in REQUIRED if k not in brief]
    if missing:
        raise ValueError("brief missing required field(s): %s" % ", ".join(missing))
    if brief["channel"] not in CHANNELS:
        raise ValueError(
            "unknown channel %r; known: %s"
            % (brief["channel"], ", ".join(sorted(CHANNELS)))
        )
    if not isinstance(brief["headline"], str) or not brief["headline"].strip():
        raise ValueError("headline must be a non-empty string")
    if not isinstance(brief["chips"], list):
        raise ValueError("chips must be a list")
    if len(brief["chips"]) > 5:
        raise ValueError("at most 5 chips; got %d" % len(brief["chips"]))
    for c in brief["chips"]:
        if not isinstance(c, str) or not c.strip():
            raise ValueError("every chip must be a non-empty string")
    panel = brief.get("panel_lines", [])
    if not isinstance(panel, list):
        raise ValueError("panel_lines must be a list")
    if len(panel) > 4:
        raise ValueError("at most 4 panel lines; got %d" % len(panel))
    return brief


def render(brief, out_path):
    validate(brief)
    spec = CHANNELS[brief["channel"]]
    W, H = spec["size"]
    pad = int(W * 0.075)
    inner = W - 2 * pad

    img = Image.new("RGB", (W, H), CANVAS)
    d = ImageDraw.Draw(img)

    # Gold rule down the left edge: the app's card idiom.
    d.rectangle([0, 0, max(6, int(W * 0.008)), H], fill=GOLD)

    eyebrow_f = load_font(int(H * 0.026))
    head_f = load_font(int(H * 0.072))
    chip_f = load_font(int(H * 0.024))
    panel_f = load_font(int(H * 0.030))
    foot_f = load_font(int(H * 0.024))

    y = pad
    d.text((pad, y), spec["label"], font=eyebrow_f, fill=GOLD)
    y += int(H * 0.055)

    for ln in wrap(d, brief["headline"], head_f, inner):
        d.text((pad, y), ln, font=head_f, fill=INK)
        y += int(H * 0.085)

    y += int(H * 0.012)
    x = pad
    chip_h = int(H * 0.048)
    for chip in brief["chips"]:
        cw = text_width(d, chip, chip_f) + int(W * 0.030)
        if x + cw > W - pad:
            x = pad
            y += chip_h + int(H * 0.012)
        d.rounded_rectangle([x, y, x + cw, y + chip_h], radius=int(chip_h * 0.28),
                            fill=SURFACE, outline=DIM)
        d.text((x + int(W * 0.015), y + int(chip_h * 0.26)), chip, font=chip_f, fill=GREEN)
        x += cw + int(W * 0.012)
    y += chip_h + int(H * 0.040)

    panel = brief.get("panel_lines", [])
    if panel:
        lines = []
        for raw in panel:
            lines.extend(wrap(d, raw, panel_f, inner - int(W * 0.04)))
        box_h = len(lines) * int(H * 0.045) + int(H * 0.036)
        d.rounded_rectangle([pad, y, W - pad, y + box_h], radius=12, fill=SURFACE)
        ty = y + int(H * 0.018)
        for ln in lines:
            d.text((pad + int(W * 0.020), ty), ln, font=panel_f, fill=INK)
            ty += int(H * 0.045)
        y += box_h + int(H * 0.030)

    foot_y = H - pad - int(H * 0.030)
    if y > foot_y:
        raise ValueError(
            "content overflows the card: content ends at %dpx, footer begins at %dpx. "
            "Shorten the headline or drop a panel line." % (y, foot_y)
        )
    d.text((pad, foot_y), brief["footer"], font=foot_f, fill=DIM)

    img.save(out_path, "PNG")
    return out_path, (W, H)


def self_test():
    """Render one card per channel plus every failure mode. Exit non-zero on
    the first surprise. This is what the packet harness calls."""
    import tempfile

    ok = True

    def check(name, cond, detail=""):
        nonlocal ok
        print(("  PASS  " if cond else "  FAIL  ") + name + ("  " + detail if detail and not cond else ""))
        if not cond:
            ok = False

    tmp = tempfile.mkdtemp()
    good = {
        "channel": "tops-facebook",
        "headline": "Free year of ChatGPT Plus for transitioning members",
        "chips": ["FREE", "ACTIVE", "VETERAN"],
        "panel_lines": ["Renews at the paid rate after year one.", "ID.me verification required."],
        "footer": "transitionops.org",
    }

    for ch, (w, h) in ((c, CHANNELS[c]["size"]) for c in sorted(CHANNELS)):
        b = dict(good, channel=ch)
        p = os.path.join(tmp, ch + ".png")
        try:
            _, size = render(b, p)
            check("renders %s at %dx%d" % (ch, w, h),
                  size == (w, h) and os.path.getsize(p) > 2000)
        except Exception as e:  # noqa: BLE001 - self-test reports, never masks
            check("renders %s" % ch, False, repr(e))

    def expect_error(name, brief, needle):
        try:
            render(brief, os.path.join(tmp, "x.png"))
            check(name, False, "no error raised")
        except ValueError as e:
            check(name, needle in str(e), "message was: %s" % e)
        except Exception as e:  # noqa: BLE001
            check(name, False, "wrong exception type: %r" % e)

    expect_error("missing headline rejected",
                 {k: v for k, v in good.items() if k != "headline"}, "missing required")
    expect_error("unknown channel rejected", dict(good, channel="tiktok"), "unknown channel")
    expect_error("empty headline rejected", dict(good, headline="   "), "non-empty")
    expect_error("too many chips rejected", dict(good, chips=["A"] * 6), "at most 5 chips")
    expect_error("too many panel lines rejected",
                 dict(good, panel_lines=["x"] * 5), "at most 4 panel lines")
    expect_error("unrenderable long word rejected",
                 dict(good, headline="A" * 200), "word too long")
    # Landscape is the tightest canvas: 630px tall against 1200px wide, so each
    # wrapped panel line costs proportionally more vertical budget. Measured,
    # not guessed: 3 headline lines + 4 panel lines that DO NOT wrap ends at
    # 497px against a 522px footer and is legal. The same 4 panel lines wrapped
    # to 8 rendered lines ends at 609px and must be refused. The fixture below
    # is the second case; shortening these strings makes the test vacuous.
    expect_error("overflowing content rejected",
                 dict(good, channel="vbs-linkedin",
                      headline="A deliberately long headline that occupies several full lines "
                               "of the landscape card and pushes the content downward",
                      panel_lines=[
                          ("Panel line %d " % i)
                          + ("wraps repeatedly across the entire width of this "
                             "landscape card and keeps going " * 2)
                          for i in range(1, 5)
                      ]),
                 "overflows the card")

    # No panel lines at all must still render.
    try:
        b = dict(good)
        b["panel_lines"] = []
        _, _ = render(b, os.path.join(tmp, "nopanel.png"))
        check("renders with no panel lines", True)
    except Exception as e:  # noqa: BLE001
        check("renders with no panel lines", False, repr(e))

    print()
    print("SELF-TEST " + ("PASSED" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    args = sys.argv[1:]
    if args and args[0] == "--self-test":
        sys.exit(self_test())
    if len(args) != 2:
        sys.exit(__doc__.strip().splitlines()[0] + "\n\n"
                 "usage: make-social-card.py <brief.json> <out.png>\n"
                 "       make-social-card.py --self-test")
    brief = json.load(open(args[0], encoding="utf-8"))
    path, size = render(brief, args[1])
    print("wrote %s (%dx%d)" % (path, size[0], size[1]))


if __name__ == "__main__":
    main()
