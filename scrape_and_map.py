#!/usr/bin/env python3
import os
import re
import sys
import json
import time
import html
import hashlib
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser

BASE_URL = "https://powderblue-sheep-617190.hostingersite.com"
OUTPUT_DIR = "/Users/dev/Desktop/Caters"

PAGES = [
    {"url": f"{BASE_URL}/", "local": "index.html", "category": "Core"},
    {"url": f"{BASE_URL}/index.html", "local": "index.html", "category": "Core"},
    {"url": f"{BASE_URL}/home-modern.html", "local": "home-modern.html", "category": "Core"},
    {"url": f"{BASE_URL}/about.html", "local": "about.html", "category": "Core"},
    {"url": f"{BASE_URL}/contact.html", "local": "contact.html", "category": "Core"},
    {"url": f"{BASE_URL}/catering.html", "local": "catering.html", "category": "Core"},
    {"url": f"{BASE_URL}/hospitality.html", "local": "hospitality.html", "category": "Core"},
    {"url": f"{BASE_URL}/photography.html", "local": "photography.html", "category": "Core"},
    {"url": f"{BASE_URL}/corporate-events.html", "local": "corporate-events.html", "category": "Specialized"},
    {"url": f"{BASE_URL}/baraat-and-decor.html", "local": "baraat-and-decor.html", "category": "Specialized"},
    {"url": f"{BASE_URL}/barat-and-decor.html", "local": "barat-and-decor.html", "category": "Specialized"},
    {"url": f"{BASE_URL}/sfx-fireworks.html", "local": "sfx-fireworks.html", "category": "Specialized"},
    {"url": f"{BASE_URL}/artists.html", "local": "artists.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/ap-dhillon.html", "local": "artists/ap-dhillon.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/b-praak.html", "local": "artists/b-praak.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/diljit-dosanjh.html", "local": "artists/diljit-dosanjh.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/gurdas-maan.html", "local": "artists/gurdas-maan.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/harshdeep-kaur.html", "local": "artists/harshdeep-kaur.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/jasmine-sandlas.html", "local": "artists/jasmine-sandlas.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/karan-aujla.html", "local": "artists/karan-aujla.html", "category": "Artists"},
    {"url": f"{BASE_URL}/artists/sunanda-sharma.html", "local": "artists/sunanda-sharma.html", "category": "Artists"},
    {"url": f"{BASE_URL}/wedding-events.html", "local": "wedding-events.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/roka.html", "local": "wedding-events/roka.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/engagement.html", "local": "wedding-events/engagement.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/pre-wedding.html", "local": "wedding-events/pre-wedding.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/haldi.html", "local": "wedding-events/haldi.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/mehendi.html", "local": "wedding-events/mehendi.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/sangeet.html", "local": "wedding-events/sangeet.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/chooda.html", "local": "wedding-events/chooda.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/jaggo.html", "local": "wedding-events/jaggo.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/cocktail.html", "local": "wedding-events/cocktail.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/wedding-ceremony.html", "local": "wedding-events/wedding-ceremony.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/reception.html", "local": "wedding-events/reception.html", "category": "Wedding"},
    {"url": f"{BASE_URL}/wedding-events/vidaai.html", "local": "wedding-events/vidaai.html", "category": "Wedding"},
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
}

def clean_url_join(base, raw_path):
    raw_path = html.unescape(raw_path.strip().strip("'\""))
    if not raw_path or raw_path.startswith("data:") or raw_path.startswith("javascript:") or raw_path.startswith("#"):
        return None
    joined = urllib.parse.urljoin(base, raw_path)
    parts = urllib.parse.urlsplit(joined)
    # keep only path and query
    quoted_path = urllib.parse.quote(urllib.parse.unquote(parts.path))
    quoted_query = urllib.parse.quote(urllib.parse.unquote(parts.query), safe="=&?/") if parts.query else ""
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, quoted_path, quoted_query, ""))

def fetch_url(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=25) as response:
                return response.read()
        except Exception as e:
            if attempt == retries - 1:
                print(f"[ERROR] Failed to fetch {url}: {e}", file=sys.stderr)
                return None
            time.sleep(1)

def determine_asset_type(path):
    lower = path.lower()
    if any(lower.endswith(ext) for ext in [".mp4", ".webm", ".mov", ".m4v"]):
        return "video"
    if any(lower.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".ico"]):
        return "image"
    if lower.endswith(".css"):
        return "stylesheet"
    if lower.endswith(".js"):
        return "script"
    if any(lower.endswith(ext) for ext in [".woff", ".woff2", ".ttf", ".eot", ".otf"]):
        return "font"
    if lower.endswith(".pdf"):
        return "document"
    return "other"

class SimpleContentExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta_desc = ""
        self.meta_keywords = ""
        self.og_tags = {}
        self.headings = []
        self.paragraphs = []
        self.links = []
        self.buttons = []
        self.forms = []
        self.images = []
        self.videos = []
        
        self.current_tag = None
        self.current_text = []
        self.in_title = False
        self.in_h = None
        self.in_p = False
        self.in_btn = False
        self.in_form = None

    def handle_starttag(self, tag, attrs):
        attr_dict = {k.lower(): v for k, v in attrs if v is not None}
        self.current_tag = tag

        if tag == "title":
            self.in_title = True
            self.current_text = []
        elif tag == "meta":
            name = attr_dict.get("name", "").lower()
            prop = attr_dict.get("property", "").lower()
            content = attr_dict.get("content", "")
            if name == "description":
                self.meta_desc = content
            elif name == "keywords":
                self.meta_keywords = content
            elif prop.startswith("og:"):
                self.og_tags[prop] = content
        elif tag in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            self.in_h = tag
            self.current_text = []
        elif tag == "p":
            self.in_p = True
            self.current_text = []
        elif tag == "button" or (tag == "a" and "btn" in attr_dict.get("class", "")):
            self.in_btn = True
            self.current_text = []
        elif tag == "a":
            href = attr_dict.get("href", "")
            if href:
                self.links.append({
                    "href": href,
                    "text": "",
                    "class": attr_dict.get("class", ""),
                    "id": attr_dict.get("id", "")
                })
        elif tag == "img":
            src = attr_dict.get("src") or attr_dict.get("data-src")
            alt = attr_dict.get("alt", "")
            if src:
                self.images.append({"src": src, "alt": alt})
        elif tag == "video":
            src = attr_dict.get("src", "")
            poster = attr_dict.get("poster", "")
            self.videos.append({"src": src, "poster": poster, "sources": []})
        elif tag == "source":
            if self.videos:
                src = attr_dict.get("src", "")
                type_ = attr_dict.get("type", "")
                if src:
                    self.videos[-1]["sources"].append({"src": src, "type": type_})
        elif tag == "form":
            self.in_form = {
                "id": attr_dict.get("id", ""),
                "action": attr_dict.get("action", ""),
                "method": attr_dict.get("method", "POST"),
                "inputs": []
            }
        elif tag in ["input", "textarea", "select"] and self.in_form is not None:
            self.in_form["inputs"].append({
                "tag": tag,
                "name": attr_dict.get("name", ""),
                "type": attr_dict.get("type", "text"),
                "placeholder": attr_dict.get("placeholder", ""),
                "required": "required" in attr_dict
            })

    def handle_endtag(self, tag):
        text = " ".join("".join(self.current_text).split()).strip()
        if tag == "title" and self.in_title:
            self.title = text
            self.in_title = False
        elif tag in ["h1", "h2", "h3", "h4", "h5", "h6"] and self.in_h == tag:
            if text:
                self.headings.append({"level": tag, "text": text})
            self.in_h = None
        elif tag == "p" and self.in_p:
            if text and len(text) > 3:
                self.paragraphs.append(text)
            self.in_p = False
        elif (tag == "button" or self.in_btn) and text:
            self.buttons.append(text)
            self.in_btn = False
        elif tag == "a" and self.links:
            if not self.links[-1]["text"]:
                self.links[-1]["text"] = text
        elif tag == "form" and self.in_form is not None:
            self.forms.append(self.in_form)
            self.in_form = None
        self.current_tag = None

    def handle_data(self, data):
        if self.in_title or self.in_h or self.in_p or self.in_btn:
            self.current_text.append(data)
        elif self.links and not self.links[-1]["text"]:
            clean = data.strip()
            if clean:
                self.links[-1]["text"] = clean

def main():
    print("=" * 60)
    print("🚀 STARTING FULL DEEP SCRAPE & MAPPING")
    print(f"Target Base: {BASE_URL}")
    print(f"Destination: {OUTPUT_DIR}")
    print("=" * 60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Dictionary of all assets to download: remote_url -> local_rel_path
    asset_queue = {}
    content_map = {}
    html_pages_content = {}

    print(f"\n[PHASE 1] Fetching all {len(PAGES)} HTML pages & extracting content...")

    for page_info in PAGES:
        url = page_info["url"]
        local_rel = page_info["local"]
        category = page_info["category"]
        
        print(f"  Fetching: {url}")
        content = fetch_url(url)
        if not content:
            print(f"  [WARN] Could not fetch {url}")
            continue

        html_text = content.decode("utf-8", errors="ignore")
        html_pages_content[local_rel] = html_text

        # Save HTML locally
        local_full = os.path.join(OUTPUT_DIR, local_rel)
        os.makedirs(os.path.dirname(local_full), exist_ok=True)
        with open(local_full, "wb") as f:
            f.write(content)

        # Parse structured content
        parser = SimpleContentExtractor()
        try:
            parser.feed(html_text)
        except Exception as e:
            print(f"  [WARN] Parser error on {local_rel}: {e}")

        # Collect CTAs
        ctas = []
        for l in parser.links:
            href = l.get("href", "")
            txt = l.get("text", "")
            if "wa.me" in href or "whatsapp" in href.lower():
                ctas.append({"type": "whatsapp", "href": href, "text": txt})
            elif "tel:" in href:
                ctas.append({"type": "call", "href": href, "text": txt})
            elif "mailto:" in href:
                ctas.append({"type": "email", "href": href, "text": txt})
            elif "#enquiry" in href.lower() or "contact" in href.lower():
                ctas.append({"type": "enquiry", "href": href, "text": txt})

        content_map[local_rel] = {
            "page_url": url,
            "category": category,
            "local_file": local_rel,
            "title": parser.title,
            "meta_description": parser.meta_desc,
            "meta_keywords": parser.meta_keywords,
            "og_tags": parser.og_tags,
            "headings": parser.headings,
            "paragraphs_count": len(parser.paragraphs),
            "paragraphs": parser.paragraphs,
            "call_to_actions": ctas,
            "forms": parser.forms,
            "images_count": len(parser.images),
            "videos_count": len(parser.videos),
            "images": parser.images,
            "videos": parser.videos,
        }

        # Extract all asset links from raw HTML
        # 1. <img>, <script>, <link rel="stylesheet">, <video>, <source>
        found_srcs = re.findall(r'(?:src|href|poster|data-src)=[\"\'](.*?)[\"\']', html_text)
        for s in found_srcs:
            full = clean_url_join(url, s)
            if full and BASE_URL in full:
                p = urllib.parse.urlsplit(full).path
                p_unquoted = urllib.parse.unquote(p).lstrip("/")
                if any(p_unquoted.lower().endswith(ext) for ext in [
                    ".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico",
                    ".mp4", ".webm", ".mov", ".m4v",
                    ".css", ".js",
                    ".woff", ".woff2", ".ttf", ".otf", ".eot",
                    ".pdf"
                ]):
                    asset_queue[full] = p_unquoted

        # 2. CSS inline background url(...)
        css_urls = re.findall(r'url\([\'\"]?(.*?)[\'\"]?\)', html_text)
        for cu in css_urls:
            full = clean_url_join(url, cu)
            if full and BASE_URL in full:
                p = urllib.parse.urlsplit(full).path
                p_unquoted = urllib.parse.unquote(p).lstrip("/")
                if "." in p_unquoted:
                    asset_queue[full] = p_unquoted

    print(f"\n[PHASE 2] Inspecting CSS files for nested assets (fonts, background images)...")
    css_files = [u for u in asset_queue.keys() if u.lower().endswith(".css")]
    for css_url in css_files:
        print(f"  Parsing CSS: {css_url}")
        css_data = fetch_url(css_url)
        if css_data:
            css_text = css_data.decode("utf-8", errors="ignore")
            # Save CSS immediately or let downloader handle it
            sub_urls = re.findall(r'url\([\'\"]?(.*?)[\'\"]?\)', css_text)
            for su in sub_urls:
                full = clean_url_join(css_url, su)
                if full and BASE_URL in full:
                    p = urllib.parse.urlsplit(full).path
                    p_unquoted = urllib.parse.unquote(p).lstrip("/")
                    asset_queue[full] = p_unquoted

    # Asset summary
    images_count = sum(1 for p in asset_queue.values() if determine_asset_type(p) == "image")
    videos_count = sum(1 for p in asset_queue.values() if determine_asset_type(p) == "video")
    styles_count = sum(1 for p in asset_queue.values() if determine_asset_type(p) == "stylesheet")
    scripts_count = sum(1 for p in asset_queue.values() if determine_asset_type(p) == "script")
    fonts_count = sum(1 for p in asset_queue.values() if determine_asset_type(p) == "font")
    other_count = len(asset_queue) - (images_count + videos_count + styles_count + scripts_count + fonts_count)

    print(f"\n[FOUND ASSETS TOTAL: {len(asset_queue)}]")
    print(f"  Images: {images_count}")
    print(f"  Videos: {videos_count}")
    print(f"  Stylesheets: {styles_count}")
    print(f"  Scripts: {scripts_count}")
    print(f"  Fonts: {fonts_count}")
    print(f"  Other: {other_count}")

    print(f"\n[PHASE 3] Downloading all {len(asset_queue)} assets concurrently (12 threads)...")

    assets_manifest = {}
    completed_count = 0
    failed_count = 0
    total_bytes = 0

    def download_asset(item):
        remote_url, local_rel_path = item
        full_dest = os.path.join(OUTPUT_DIR, local_rel_path)
        os.makedirs(os.path.dirname(full_dest), exist_ok=True)

        data = fetch_url(remote_url)
        if data is None:
            return remote_url, local_rel_path, False, 0, None, "Failed to download"

        with open(full_dest, "wb") as f:
            f.write(data)

        size = len(data)
        sha256 = hashlib.sha256(data).hexdigest()
        return remote_url, local_rel_path, True, size, sha256, "OK"

    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_asset, item): item for item in asset_queue.items()}
        for future in as_completed(futures):
            remote_url, local_rel, success, size, sha256, msg = future.result()
            asset_type = determine_asset_type(local_rel)
            if success:
                completed_count += 1
                total_bytes += size
                assets_manifest[local_rel] = {
                    "remote_url": remote_url,
                    "local_path": local_rel,
                    "type": asset_type,
                    "size_bytes": size,
                    "size_formatted": f"{size / (1024*1024):.2f} MB" if size > 1024*1024 else f"{size / 1024:.1f} KB",
                    "sha256": sha256,
                    "status": "downloaded"
                }
                if completed_count % 25 == 0 or completed_count == len(asset_queue):
                    print(f"  Progress: {completed_count}/{len(asset_queue)} downloaded ({total_bytes / (1024*1024):.2f} MB total)")
            else:
                failed_count += 1
                assets_manifest[local_rel] = {
                    "remote_url": remote_url,
                    "local_path": local_rel,
                    "type": asset_type,
                    "size_bytes": 0,
                    "status": f"failed: {msg}"
                }

    print(f"\n[DOWNLOAD COMPLETED]")
    print(f"  Successfully downloaded: {completed_count}")
    print(f"  Failed: {failed_count}")
    print(f"  Total Data Downloaded: {total_bytes / (1024 * 1024):.2f} MB")

    # Write assets_manifest.json
    manifest_path = os.path.join(OUTPUT_DIR, "assets_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_assets": len(asset_queue),
            "downloaded": completed_count,
            "failed": failed_count,
            "total_size_bytes": total_bytes,
            "total_size_mb": round(total_bytes / (1024 * 1024), 2),
            "assets": assets_manifest
        }, f, indent=2)
    print(f"  Saved manifest: {manifest_path}")

    # Write content_map.json
    content_map_path = os.path.join(OUTPUT_DIR, "content_map.json")
    with open(content_map_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_pages": len(content_map),
            "base_url": BASE_URL,
            "crawled_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "pages": content_map
        }, f, indent=2)
    print(f"  Saved content map: {content_map_path}")

    # Generate sitemap_flow.md
    print(f"\n[PHASE 4] Generating sitemap_flow.md...")
    generate_sitemap_flow(content_map, assets_manifest)

def generate_sitemap_flow(content_map, assets_manifest):
    flow_file = os.path.join(OUTPUT_DIR, "sitemap_flow.md")
    lines = []
    lines.append("# 🗺️ Panchi Entertainment — Comprehensive Site Map & Flow Architecture")
    lines.append(f"\n**Target Domain:** `{BASE_URL}`  ")
    lines.append(f"**Total Pages Analyzed & Mirrored:** {len(content_map)}  ")
    lines.append(f"**Total Media & Code Assets:** {len(assets_manifest)}  ")
    lines.append("\n---\n")

    lines.append("## 1. High-Level Site Hierarchy Tree\n")
    lines.append("```")
    lines.append("Panchi Entertainment (Root)")
    lines.append("│")
    lines.append("├── 🏠 Core Pages")
    lines.append("│   ├── / (index.html) — Master Homepage")
    lines.append("│   ├── /home-modern.html — Modern Homepage Variant")
    lines.append("│   ├── /about.html — Company Profile, Heritage & Leadership")
    lines.append("│   ├── /contact.html — Inquiries, Google Reviews & Office Details")
    lines.append("│   ├── /catering.html — Bespoke Catering, Live Counters & Tasting Bookings")
    lines.append("│   ├── /hospitality.html — Guest Hospitality, Logistics & VIP Concierge")
    lines.append("│   └── /photography.html — Cinematic Films & Pre-Wedding Shoots")
    lines.append("│")
    lines.append("├── 💍 Wedding Ceremonies Hub (/wedding-events.html)")
    lines.append("│   ├── /wedding-events/roka.html — Roka & Shagun Ceremony")
    lines.append("│   ├── /wedding-events/engagement.html — Ring Ceremony & Engagement")
    lines.append("│   ├── /wedding-events/pre-wedding.html — Pre-Wedding Celebrations")
    lines.append("│   ├── /wedding-events/haldi.html — Haldi & Floral Splash")
    lines.append("│   ├── /wedding-events/mehendi.html — Mehendi & Henna Evening")
    lines.append("│   ├── /wedding-events/sangeet.html — Sangeet Night Musical")
    lines.append("│   ├── /wedding-events/chooda.html — Chooda & Kaleerein Rituals")
    lines.append("│   ├── /wedding-events/jaggo.html — Traditional Punjabi Jaggo Night")
    lines.append("│   ├── /wedding-events/cocktail.html — Glamorous Cocktail Party")
    lines.append("│   ├── /wedding-events/wedding-ceremony.html — Main Wedding Ceremony / Sacred Pheras")
    lines.append("│   ├── /wedding-events/reception.html — Grand Wedding Reception")
    lines.append("│   └── /wedding-events/vidaai.html — Vidaai Farewell")
    lines.append("│")
    lines.append("├── 🎤 Celebrity Artists Hub (/artists.html)")
    lines.append("│   ├── /artists/diljit-dosanjh.html — Diljit Dosanjh Booking Portfolio")
    lines.append("│   ├── /artists/ap-dhillon.html — AP Dhillon Booking Portfolio")
    lines.append("│   ├── /artists/karan-aujla.html — Karan Aujla Booking Portfolio")
    lines.append("│   ├── /artists/b-praak.html — B Praak Booking Portfolio")
    lines.append("│   ├── /artists/gurdas-maan.html — Gurdas Maan Booking Portfolio")
    lines.append("│   ├── /artists/harshdeep-kaur.html — Harshdeep Kaur Booking Portfolio")
    lines.append("│   ├── /artists/jasmine-sandlas.html — Jasmine Sandlas Booking Portfolio")
    lines.append("│   └── /artists/sunanda-sharma.html — Sunanda Sharma Booking Portfolio")
    lines.append("│")
    lines.append("└── 🎆 Specialized Productions")
    lines.append("    ├── /corporate-events.html — Corporate Conferences, Galas & Summits")
    lines.append("    ├── /baraat-and-decor.html — Grand Baraat Entries & Luxury Floral Decor")
    lines.append("    ├── /barat-and-decor.html — Alternate Decor Showcase")
    lines.append("    └── /sfx-fireworks.html — Cold Pyro, Low-fog & Fireworks Displays")
    lines.append("```\n")

    lines.append("---\n")
    lines.append("## 2. Navigational Flow & User Journeys\n")
    lines.append("### Flow A: The Wedding Family Journey (High Ticket)")
    lines.append("1. **Discovery:** User lands on `index.html` → Captivated by hero showreel video.")
    lines.append("2. **Exploration:** Clicks **Wedding Events** dropdown → Navigates to `/wedding-events.html`.")
    lines.append("3. **Specific Ceremony Deep Dive:** Views ceremony specific pages (e.g. `/wedding-events/sangeet.html` or `/wedding-events/haldi.html`).")
    lines.append("4. **Conversion:** Clicks **\"Book Consultation on WhatsApp\"** CTA → Direct WhatsApp routing with pre-filled ceremony text.")
    lines.append("\n### Flow B: Celebrity Artist Booking Journey")
    lines.append("1. **Discovery:** User searches for Diljit Dosanjh or Karan Aujla wedding booking → Lands on `/artists.html` or `/artists/diljit-dosanjh.html`.")
    lines.append("2. **Credibility Building:** Watches performance highlights, reviews rider specs, sound & stage requirements.")
    lines.append("3. **Action:** Clicks **\"Check Artist Availability\"** → Instant routing to Panchi Entertainment celebrity management desk on WhatsApp.")
    lines.append("\n### Flow C: Corporate & Hospitality Funnel")
    lines.append("1. **Discovery:** Corporate brand manager lands on `/corporate-events.html` or `/hospitality.html`.")
    lines.append("2. **Evaluation:** Reviews VIP airport transfers, RSVP coordination, conference sound/AV.")
    lines.append("3. **Action:** Submits lead capture form or calls direct hotline `+91 7895040431`.")

    lines.append("\n---\n")
    lines.append("## 3. Comprehensive Page Inventory & Content Details\n")
    lines.append("| Page Path | Category | Title | Headings | Paragraphs | Media Assets | Primary CTAs |")
    lines.append("| :--- | :---: | :--- | :---: | :---: | :---: | :--- |")

    for local_file, data in sorted(content_map.items()):
        title = data.get("title", "No Title")
        category = data.get("category", "General")
        headings_cnt = len(data.get("headings", []))
        paras_cnt = data.get("paragraphs_count", 0)
        media_cnt = data.get("images_count", 0) + data.get("videos_count", 0)
        ctas = ", ".join(set(c["type"].upper() for c in data.get("call_to_actions", []))) or "Form/Standard"
        lines.append(f"| [`{local_file}`](file://{os.path.join(OUTPUT_DIR, local_file)}) | {category} | {title[:35]}... | {headings_cnt} | {paras_cnt} | {media_cnt} | {ctas} |")

    lines.append("\n---\n")
    lines.append("## 4. Key Lead Capture & Conversion Touchpoints\n")
    lines.append("Across all 33 pages, the site drives users to three primary action points:")
    lines.append("- **Direct WhatsApp Hotline:** `https://wa.me/917895040431` with pre-configured event query strings.")
    lines.append("- **Telephone Hotlink:** `tel:+917895040431`")
    lines.append("- **Email Inquiries:** `mailto:info@panchientertainment.com`")
    lines.append("- **Google Reviews Credibility Link:** `https://www.google.com/search?q=Panchi+Entertainment+Reviews`")

    with open(flow_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Saved sitemap flow: {flow_file}")
    print("\n✅ ALL TASKS COMPLETE!")

if __name__ == "__main__":
    main()
