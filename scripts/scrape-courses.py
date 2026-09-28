#!/usr/bin/env python3
"""
Migrate course content from the live WordPress/Elementor site into the Angular content files.

Usage:  python3 scripts/scrape-courses.py

For every `course` node in src/app/core/content/catalog.ts it fetches the live page and extracts:
eyebrow, title, main photo, YouTube video, description (paragraphs + bullets), “Inclus” and
“Conditions” lists, and the price list. Output:

  src/app/core/content/course-details.generated.ts   (merged into the catalogue at runtime)
  scripts/course-images.json                         (photo slots, consumed by import-uploads.py)
"""
from __future__ import annotations

import html
import json
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'src/app/core/content/catalog.ts'
OUT_TS = ROOT / 'src/app/core/content/course-details.generated.ts'
OUT_IMAGES = ROOT / 'scripts/course-images.json'
SITE = 'https://faremoana.ch'

WIDGET = re.compile(
    r'<div class="elementor-element elementor-element-\w+[^"]*elementor-widget elementor-widget-([\w-]+)[^"]*"'
    r'(.*?)(?=<div class="elementor-element elementor-element-\w+[^"]*elementor-widget |\Z)',
    re.S,
)


def text(fragment: str) -> str:
    fragment = re.sub(r'<br\s*/?>', ' ', fragment)
    fragment = html.unescape(re.sub(r'<[^>]+>', ' ', fragment))
    # WordPress content often carries zero-width spaces/joiners; drop them.
    return re.sub(r'\s+', ' ', re.sub(r'[\u200b-\u200d\ufeff]', '', fragment)).strip()


def course_paths() -> list[str]:
    src = CATALOG.read_text()
    paths = []
    for m in re.finditer(r"course\(\s*`([^`]+)`", src):
        paths.append(m.group(1).replace('${LOISIR}', '/formations-loisirs'))
    for m in re.finditer(r"course\(\s*'([^']+)'", src):
        paths.append(m.group(1))
    return paths


def fetch(path: str) -> str:
    req = urllib.request.Request(f'{SITE}{path}/', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode('utf-8', 'replace')


def parse(page: str) -> dict:
    main = page[page.find('<main'):page.find('</main>')]
    main = re.sub(r'<(script|style|svg|noscript).*?</\1>', '', main, flags=re.S)
    widgets = [(m.group(1), m.group(2)) for m in WIDGET.finditer(main)]

    data: dict = {}
    headings: list[str] = []
    last_heading = ''
    # “PLUS DE COURS”: hand-picked related courses (image + “Plus d’infos” button), in order.
    more_at = next((i for i, (k, b) in enumerate(widgets) if 'PLUS DE COURS' in text(b).upper()), None)
    if more_at is not None:
        related, images = [], []
        for kind, body in widgets[more_at + 1:]:
            if kind == 'image':
                src = re.search(r'wp-content/uploads/([^"\s]+?\.(?:png|jpe?g|webp))', body)
                if src:
                    images.append(src.group(1))
            elif kind == 'button':
                href = re.search(r'href="https://faremoana\.ch(/[^"#?]*)"', body)
                if href:
                    related.append(href.group(1).rstrip('/'))
        data['related'] = list(dict.fromkeys(related))
        data['relatedImages'] = dict(zip(related, images))
        widgets = widgets[:more_at]
    for kind, body in widgets:
        if kind == 'heading':
            last_heading = text(body)
            headings.append(last_heading)
        elif kind == 'image' and 'image' not in data:
            src = re.search(r'wp-content/uploads/([^"\s]+?\.(?:png|jpe?g|webp))', body)
            if src:
                data['imageSource'] = src.group(1)
        elif kind == 'video' and 'videoId' not in data:
            vid = re.search(r'(?:watch\?v=|embed/|youtu\.be/)([\w-]{11})', body.replace('\\/', '/'))
            if vid:
                data['videoId'] = vid.group(1)
        elif kind == 'text-editor' and 'included' not in data:
            paras = [text(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', body, re.S)]
            items = [text(li) for li in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S)]
            # Drop section labels rendered by the site as text (category eyebrow, “PLUS DE COURS”).
            paras = [p for p in paras if p and not (p.isupper() and len(p) < 40)]
            if paras and paras != data.get('intro'):
                data.setdefault('intro', [])
                data['intro'] += [p for p in paras if p not in data['intro']]
            if items:
                data.setdefault('introList', [])
                data['introList'] += [i for i in items if i not in data['introList']]
        elif kind == 'icon-list':
            items = [text(li) for li in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S)]
            items = [i for i in items if i]
            key = 'requirements' if last_heading.lower().startswith('condition') else 'included'
            if items and key not in data:
                data[key] = items
        elif kind == 'price-list' and 'prices' not in data:
            prices = []
            for li in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S):
                label = re.search(r'elementor-price-list-title">(.*?)</span>', li, re.S)
                amount = re.search(r'elementor-price-list-price">(.*?)</span>', li, re.S)
                note = re.search(r'elementor-price-list-description">(.*?)</p>', li, re.S)
                if label and amount:
                    row = {'label': text(label.group(1)), 'amount': text(amount.group(1))}
                    if note and text(note.group(1)):
                        row['note'] = text(note.group(1)).lstrip('->').strip()
                    prices.append(row)
            if prices:
                data['prices'] = prices

    if headings:
        data['eyebrow'] = headings[0]
    return data


def main() -> None:
    details, images, failed = {}, {}, []
    card_images: dict[str, str] = {}
    for path in course_paths():
        try:
            data = parse(fetch(path))
        except Exception as exc:  # noqa: BLE001 — report and continue
            failed.append(f'{path}: {exc}')
            continue
        slug = path.rsplit('/', 1)[-1]
        source = data.pop('imageSource', None)
        if source:
            slot = f'courses/{slug}.jpg'
            images[slot] = source
            data['image'] = f'images/{slot}'.replace('.jpg', '.webp')
        data.pop('eyebrow', None)  # the parent category already provides the eyebrow
        for target, src in data.pop('relatedImages', {}).items():
            card_images.setdefault(target, src)
        details[path] = data
        print(f"ok  {path}  img={'y' if source else '-'} video={data.get('videoId', '-')} "
              f"intro={len(data.get('intro', []))} prices={len(data.get('prices', []))}")

    # Card photo used for a course in other pages’ “PLUS DE COURS” sections.
    for target, src in card_images.items():
        if target in details:
            slot = f'courses/card-{target.rsplit("/", 1)[-1]}.jpg'
            images[slot] = src
            details[target]['cardImage'] = f'images/{slot}'.replace('.jpg', '.webp')

    OUT_TS.write_text(
        '// Generated by scripts/scrape-courses.py — course content migrated from faremoana.ch.\n'
        '// Re-run the script to refresh; edit catalog.ts to override individual fields.\n'
        "import { CatalogNode } from '../models/content.models';\n\n"
        'export const COURSE_DETAILS: Record<string, Partial<CatalogNode>> = '
        + json.dumps(details, ensure_ascii=False, indent=2)
        + ';\n'
    )
    OUT_IMAGES.write_text(json.dumps(images, indent=2) + '\n')
    print(f'\n{len(details)} courses written, {len(images)} photos queued, {len(failed)} failed')
    for f in failed:
        print('FAIL', f)


if __name__ == '__main__':
    main()
