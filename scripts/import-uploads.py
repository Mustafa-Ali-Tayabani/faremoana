#!/usr/bin/env python3
"""
Copy the images the site uses from a WordPress `uploads` export into `public/images/`,
resized for the web and converted to the format each slot expects.

Usage:  python3 scripts/import-uploads.py ~/Downloads/uploads [--live]

Images are written as WebP (Pillow). Slot names in MAP may say .jpg/.png; the file is
always written with a .webp extension, matching the paths used in the content files. With `--live`, files missing from the local
export are downloaded from the site's own media library (https://faremoana.ch/wp-content/uploads/)
into `.cache/uploads/`; otherwise missing sources are reported and skipped.
"""
from __future__ import annotations

import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEST = ROOT / 'public' / 'images'
CACHE = ROOT / '.cache' / 'uploads'
LIVE_BASE = 'https://faremoana.ch/wp-content/uploads/'

HERO, CARD, LOGO = 1920, 720, 600
QUALITY = 80
MOBILE = 800

# slot (relative to public/images) -> (source relative to uploads, max edge in px)
MAP = {
    # Brand
    'brand/logo.png': ('2023/03/Design-sans-titre-2-copie-scaled.png', LOGO),
    'brand/padi-5-star-idc.jpg': ('2023/03/PRRA-501205StarIDC.jpg', LOGO),
    'brand/padi.png': ('2024/12/PADI-Horiz-e1734462475579.png', LOGO),
    'brand/dan.png': ('2024/07/DAN-business-partner-300x225-1.webp', LOGO),
    'brand/aware.png': ('2024/07/Project-AWARE-Logo-1-300x206-1.webp', LOGO),

    # Home
    'home/slide-decouvre.jpg': ('2023/03/scuba-diver-2022-03-07-23-59-34-utc.jpeg', HERO),
    'home/slide-apprends.jpg': ('2023/03/PADI_RescueDiver_Shutterstock-scaled-1.jpeg', HERO),
    'home/slide-explore.jpg': ('2023/03/PADI_ChaOcampo_SCUBA_1.jpeg', HERO),
    'home/welcome-1.jpg': ('2026/02/Centre-Fare-Moana.png', CARD),
    'home/welcome-2.jpg': ('2026/02/Frame-273k-1024x1024.png', CARD),
    'home/welcome-3.jpg': ('2026/02/Fare_Moana-1-1024x680.png', CARD),
    'home/service-formations.jpg': ('2023/04/sVAbjUhS.png', CARD),
    'home/service-pro.jpg': ('2023/04/Instructeur-1.jpeg', CARD),
    'home/service-secourisme.jpg': ('2023/03/first-aid-training-2021-12-17-03-42-55-utc.png', CARD),
    'home/service-voyages.jpg': ('2023/03/a-sea-turtle-swims-underwater-2023-01-13-23-57-38-utc.jpg', CARD),
    'home/service-club.jpg': ('2023/03/underwater-shot-of-two-people-diving-2022-03-07-22-43-05-utc.png', CARD),
    'home/promo-bg.jpg': ('2026/02/fare.png', HERO),
    'home/why-bg.png': ('2026/03/Background-1.png', HERO),
    'home/videos-bg.png': ('2026/03/Background-2.png', HERO),
    'home/services-bg.jpg': ('2026/02/Background.png', HERO),

    # Events
    'events/philippines.jpg': ('2026/03/ea2f66dfce74ede167abf8ab0447de28c1efad3c.png', CARD),
    'events/vevey.jpg': ('2026/01/Vevey-1024x683.jpg', CARD),
    'events/blausee.jpg': ('2026/03/abb6be955ead0380b56c5044a3917a69bce7ea37.png', CARD),
    'events/rivaz.jpg': ('2026/01/Rivaz-1024x683.jpg', CARD),

    # Page banners
    'heroes/default.jpg': ('2023/03/dolphins-swimming-underwater-in-ocean-2023-02-14-20-34-17-utc-scaled.jpg', HERO),
    'heroes/formations-loisirs.jpg': ('2023/04/1hT3q3Vw-scaled.jpeg', HERO),
    'heroes/elearning.jpg': ('2023/04/Fond-de-page-2.jpeg', HERO),
    'heroes/services.jpg': ('2023/04/Fond-de-page-3.jpeg', HERO),
    'heroes/club.jpg': ('2025/07/IMG_6698-scaled.jpeg', HERO),
    'heroes/gonflage.jpg': ('2023/04/three-oxygen-tanks-at-poolside-diving-equipment-2021-09-18-05-51-48-utc-scaled.jpg', HERO),
    'heroes/location.jpg': ('2023/06/equipment-for-snorkeling-2023-05-10-17-44-07-utc-scaled.jpg', HERO),
    'heroes/partenaires.jpg': ('2023/04/agreement-partnership-or-deal-concept-2022-12-16-11-16-25-utc-scaled.jpg', HERO),
    'heroes/voyages.jpg': ('2023/04/tropical-white-sand-with-red-starfish-in-clear-wat-2021-08-26-20-24-31-utc-scaled.jpg', HERO),
    'heroes/evenements.jpg': ('2023/04/open-diary-and-calendar-with-passport-2021-10-06-09-51-02-utc-scaled.jpg', HERO),
    'heroes/contact.jpg': ('2023/04/ishan-seefromthesky-KgWufDEcKGg-unsplash.jpg', HERO),

    # Services cards
    'services/gonflage.jpg': ('2023/04/three-oxygen-tanks-at-poolside-diving-equipment-2021-09-18-05-51-48-utc.png', CARD),
    'services/location.jpg': ('2023/06/equipment-for-snorkeling-2023-05-10-17-44-07-utc-scaled.jpg', CARD),
    'services/partenaires.jpg': ('2023/04/agreement-partnership-or-deal-concept-2022-12-16-11-16-25-utc.png', CARD),

    # Partner logos
    'partners/into-the-blue.png': ('elementor/thumbs/302716190_387195770245151_5711301714568500621_n-r65lfl4ztr1k6u05f27jnjliij5vd7p2piv7i9s2si.png', LOGO),
    'partners/padi.png': ('2023/04/PADI-Horiz.png', LOGO),
    'partners/dan.png': ('2023/04/Unknown.png', LOGO),
    'partners/aqualung.png': ('2023/04/Logotype_AQUALUNG.png', LOGO),
    'partners/thonex.png': ('2023/04/1c.Thonex-logo_fond-transparent-CMJN.png', LOGO),
    'partners/abyssworld.png': ('2025/05/Logo-Black-700x700px-copie.jpg', LOGO),
    'partners/ultramarina.png': ('2025/05/Capture-decran-2025-05-22-a-00.09.54.png', LOGO),
}

# Course photos (scripts/scrape-courses.py) and page images (cards, galleries, banners, misc).
import json
for _extra in ('course-images.json', 'page-images.json'):
    _file = ROOT / 'scripts' / _extra
    if _file.exists():
        for _slot, _src in json.loads(_file.read_text()).items():
            MAP.setdefault(_slot, (_src, HERO if _slot.startswith('heroes/') else CARD))

SIZE_SUFFIX = re.compile(r'-\d+x\d+(?=\.[a-z]+$)', re.I)


def resolve(uploads: pathlib.Path, rel: str) -> pathlib.Path | None:
    """Find the source file, preferring the original over WordPress's resized copies."""
    if '*' in rel:
        hits = sorted(uploads.rglob(rel.strip('*') + '*'), key=lambda p: -p.stat().st_size)
        return hits[0] if hits else None
    path = uploads / rel
    if path.exists():
        return path
    # Try the original (strip -WxH) or any resized copy with the same stem.
    original = uploads / SIZE_SUFFIX.sub('', rel)
    if original.exists():
        return original
    stem = pathlib.Path(SIZE_SUFFIX.sub('', rel))
    hits = sorted((uploads / stem.parent).glob(stem.stem + '*'), key=lambda p: -p.stat().st_size)
    return hits[0] if hits else None


def convert(src: pathlib.Path, dest: pathlib.Path, max_edge: int) -> None:
    """Resize (never upscale) and save as WebP, keeping transparency."""
    from PIL import Image, ImageOps

    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((max_edge, max_edge), Image.LANCZOS)
        has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
        im = im.convert('RGBA' if has_alpha else 'RGB')
        im.save(dest, 'WEBP', quality=QUALITY, method=6)
        # Full-width banners also get an 800px variant for phones (used via srcset).
        if max_edge == HERO and im.width > MOBILE:
            small = im.copy()
            small.thumbnail((MOBILE, MOBILE * 4), Image.LANCZOS)
            small.save(dest.with_name(dest.stem + f'-{MOBILE}.webp'), 'WEBP', quality=QUALITY, method=6)


def fetch_live(rel: str) -> pathlib.Path | None:
    """Download `rel` (or its full-size original) from the live media library into the cache."""
    candidates = [SIZE_SUFFIX.sub('', rel), rel] if SIZE_SUFFIX.search(rel) else [rel]
    for candidate in candidates:
        dest = CACHE / candidate
        if dest.exists():
            return dest
        try:
            url = LIVE_BASE + urllib.parse.quote(candidate, safe='/')
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
        except urllib.error.URLError:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return dest
    return None


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    live = '--live' in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    uploads = pathlib.Path(args[0]).expanduser()
    missing = []
    for slot, (rel, max_edge) in MAP.items():
        src, origin = resolve(uploads, rel), 'export'
        if not src and live:
            src, origin = fetch_live(rel), 'live'
        if not src:
            missing.append(f'{slot} <- {rel}')
            continue
        try:
            convert(src, DEST / pathlib.Path(slot).with_suffix('.webp'), max_edge)
        except OSError:
            missing.append(f'{slot} <- {rel} (unreadable image)')
            continue
        print(f'ok   {slot:40} <- [{origin}] {rel}')
    for m in missing:
        print(f'MISS {m}')
    print(f'\n{len(MAP) - len(missing)}/{len(MAP)} images imported into {DEST.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
