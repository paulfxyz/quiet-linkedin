"""Rebuild the live two-badge screenshot card. Requires Pillow, not the extension."""

from pathlib import Path
from os import environ
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "screenshots" / "reference"


def font(size, bold=False):
    custom = environ.get("QUIET_FONT_BOLD" if bold else "QUIET_FONT")
    candidates = [
        custom,
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
        f"/System/Library/Fonts/Supplemental/Arial{' Bold' if bold else ''}.ttf",
        f"C:/Windows/Fonts/arial{'bd' if bold else ''}.ttf",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return ImageFont.truetype(candidate, size)
    raise FileNotFoundError("Set QUIET_FONT and QUIET_FONT_BOLD to TrueType fonts.")


def main():
    canvas = Image.new("RGB", (1600, 940), "#f3f6fa")
    draw = ImageDraw.Draw(canvas)
    draw.text((90, 64), "The same navigation. Without the nudge.", fill="#142d44",
              font=font(45, True))
    draw.text((92, 138), "Actual LinkedIn capture | Both badges active | October 25, 2026",
              fill="#556b7b", font=font(23))
    for name, label, y, color in [
        ("before.png", "BEFORE", 230, "#934345"),
        ("after.png", "AFTER", 500, "#0a66c2"),
    ]:
        image = Image.open(REF / name).convert("RGB")
        image = image.resize((1416, round(image.height * 1416 / image.width)),
                             Image.Resampling.LANCZOS)
        draw.text((92, y), label, fill=color, font=font(20, True))
        box = (90, y + 46, 1510, y + 46 + image.height + 24)
        draw.rounded_rectangle(box, 14, fill="#ffffff", outline="#d5dfe8", width=2)
        canvas.paste(image, (92, y + 58))
    draw.text((92, 840), "Both Home and Notifications badges are hidden.",
              fill="#556b7b", font=font(23))
    draw.text((92, 880), "Live stylesheet check in Comet; installed package tested separately in Chromium.",
              fill="#556b7b", font=font(19))
    canvas.save(ROOT / "screenshots" / "screenshot.png")
    print("Rebuilt screenshots/screenshot.png from cropped navigation references.")


if __name__ == "__main__":
    main()
