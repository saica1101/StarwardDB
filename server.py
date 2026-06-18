from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen
import base64
import io
import json
import os
import re
import subprocess


class GuideHandler(SimpleHTTPRequestHandler):
    SAVE_TARGETS = {
        "/api/save/contributors": "contributors-data.json",
        "/api/save/streamers": "streamers-data.json",
        "/api/save/videos": "video-library-data.json",
        "/api/save/page-edits": "page-edits-data.json",
        "/api/save/wiki-moves": "wiki-move-data.json",
        "/api/save/update-edits": "tools/starward_update_edits.json",
        "/api/save/site-order": "site-order-data.json",
        "/api/save/background": "background-media-data.json",
        "/api/save/background-media": "background-media-data.json",
        "/api/save/allstar-characters": "tools/apps/allstar/allstar-characters.json",
    }

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/youtube-date":
            self.handle_youtube_date(parsed)
            return
        if parsed.path == "/api/youtube-latest":
            self.handle_youtube_latest(parsed)
            return
        if parsed.path == "/api/x-posts":
            self.handle_x_posts(parsed)
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/api/save/background", "/api/save/background-media"):
            self.handle_save_json(parsed.path)
            return
        if parsed.path in self.SAVE_TARGETS:
            self.handle_save_json(parsed.path)
            return
        if parsed.path == "/api/save/page-edit":
            self.handle_save_page_edit()
            return
        if parsed.path == "/api/save/update-edits":
            self.handle_save_update_edits()
            return
        if parsed.path == "/api/upload/background-media":
            self.handle_upload_background_media()
            return
        if parsed.path == "/api/upload/allstar-character-image":
            self.handle_upload_allstar_character_image()
            return
        self.write_json({"ok": False, "error": "not found"}, status=404)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def handle_save_json(self, path):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > 5 * 1024 * 1024:
            self.write_json({"ok": False, "error": "invalid body size"}, status=400)
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.write_json({"ok": False, "error": "invalid json"}, status=400)
            return

        if path in ("/api/save/contributors", "/api/save/streamers"):
            if not isinstance(payload, list):
                self.write_json({"ok": False, "error": "expected list"}, status=400)
                return
        elif path == "/api/save/videos":
            if (
                not isinstance(payload, dict) or
                not isinstance(payload.get("channels"), list) or
                not isinstance(payload.get("videos"), dict)
            ):
                self.write_json({"ok": False, "error": "expected video library"}, status=400)
                return
        elif path == "/api/save/page-edits":
            if not isinstance(payload, dict):
                self.write_json({"ok": False, "error": "expected page edit map"}, status=400)
                return
        elif path == "/api/save/wiki-moves":
            if not isinstance(payload, dict):
                self.write_json({"ok": False, "error": "expected move data map"}, status=400)
                return
        elif path == "/api/save/site-order":
            if not isinstance(payload, dict):
                self.write_json({"ok": False, "error": "expected order map"}, status=400)
                return
        elif path in ("/api/save/background", "/api/save/background-media"):
            if not isinstance(payload, dict):
                self.write_json({"ok": False, "error": "expected background media config"}, status=400)
                return
        elif path == "/api/save/allstar-characters":
            if not isinstance(payload, list) or not all(is_valid_allstar_character(item) for item in payload):
                self.write_json({"ok": False, "error": "expected allstar character list"}, status=400)
                return

        filename = self.SAVE_TARGETS[path]
        target = Path(__file__).resolve().parent / filename
        if is_empty_payload(payload) and target.exists():
            try:
                existing = json.loads(target.read_text(encoding="utf-8"))
            except Exception:
                existing = None
            if existing is not None and not is_empty_payload(existing):
                self.write_json({"ok": False, "error": "refuse empty overwrite"}, status=409)
                return

        if target.exists():
            try:
                existing = json.loads(target.read_text(encoding="utf-8"))
            except Exception:
                existing = None
            if existing is not None and not is_empty_payload(existing):
                backup = target.with_suffix(target.suffix + ".bak")
                backup.write_text(
                    json.dumps(existing, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )

        target.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        docs_file = self.write_docs_json(filename, payload)
        generated = False
        if path == "/api/save/wiki-moves":
            generated = self.rebuild_publish_docs()
        self.write_json({"ok": True, "file": filename, "docsFile": docs_file, "generated": generated})

    def handle_save_page_edit(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > 5 * 1024 * 1024:
            self.write_json({"ok": False, "error": "invalid body size"}, status=400)
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.write_json({"ok": False, "error": "invalid json"}, status=400)
            return

        page = normalize_page_path(str(payload.get("page", "")))
        edits = payload.get("edits")
        if not page or not isinstance(edits, dict):
            self.write_json({"ok": False, "error": "expected page and edits"}, status=400)
            return

        root = Path(__file__).resolve().parent
        target = root / "page-edits-data.json"
        try:
            current = json.loads(target.read_text(encoding="utf-8")) if target.exists() else {}
        except Exception:
            current = {}
        if not isinstance(current, dict):
            current = {}

        current[page] = normalize_page_edits(edits)
        target.write_text(
            json.dumps(current, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        docs_file = self.write_docs_json("page-edits-data.json", current)
        self.write_json({"ok": True, "file": "page-edits-data.json", "docsFile": docs_file, "page": page})

    def write_docs_json(self, filename, payload):
        root = Path(__file__).resolve().parent
        docs = root / "docs"
        if not docs.exists():
            return ""
        target = docs / filename
        target.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return str(target.relative_to(root)).replace("\\", "/")

    def handle_upload_background_media(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > 110 * 1024 * 1024:
            self.write_json({"ok": False, "error": "invalid body size"}, status=400)
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.write_json({"ok": False, "error": "invalid json"}, status=400)
            return

        name = str(payload.get("name", "")).strip()
        media_type = str(payload.get("type", "")).strip().lower()
        data_url = str(payload.get("dataUrl", ""))
        if not re.fullmatch(r"(video/(webm|mp4)|image/(webp|png|jpeg))", media_type):
            self.write_json({"ok": False, "error": "unsupported media type"}, status=400)
            return
        match = re.match(r"^data:[^;]+;base64,(.+)$", data_url, re.S)
        if not match:
            self.write_json({"ok": False, "error": "invalid data url"}, status=400)
            return
        try:
            data = base64.b64decode(match.group(1), validate=True)
        except Exception:
            self.write_json({"ok": False, "error": "invalid base64"}, status=400)
            return
        if not data or len(data) > 80 * 1024 * 1024:
            self.write_json({"ok": False, "error": "file too large"}, status=400)
            return

        extension_by_type = {
            "video/webm": ".webm",
            "video/mp4": ".mp4",
            "image/webp": ".webp",
            "image/png": ".png",
            "image/jpeg": ".jpg",
        }
        ext = extension_by_type[media_type]
        stem = Path(name).stem.lower()
        stem = re.sub(r"[^a-z0-9._-]+", "-", stem).strip(".-") or "background-media"
        filename = f"{stem}{ext}"

        root = Path(__file__).resolve().parent
        target = root / "assets" / "background-media" / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        final = target
        counter = 2
        while final.exists() and final.read_bytes() != data:
            final = target.with_name(f"{target.stem}-{counter}{target.suffix}")
            counter += 1
        final.write_bytes(data)
        relative = final.relative_to(root)

        docs_root = root / "docs"
        if docs_root.exists():
            docs_target = docs_root / relative
            docs_target.parent.mkdir(parents=True, exist_ok=True)
            docs_target.write_bytes(data)

        self.write_json({
            "ok": True,
            "path": str(relative).replace("\\", "/"),
            "bytes": len(data),
            "type": media_type,
        })

    def handle_upload_allstar_character_image(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > 35 * 1024 * 1024:
            self.write_json({"ok": False, "error": "invalid body size"}, status=400)
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.write_json({"ok": False, "error": "invalid json"}, status=400)
            return

        cost = str(payload.get("cost", "")).strip()
        file_id = sanitize_allstar_file_id(str(payload.get("file", "")))
        data_url = str(payload.get("dataUrl", ""))
        if cost not in {"30", "25", "20", "15"} or not file_id:
            self.write_json({"ok": False, "error": "invalid cost or file id"}, status=400)
            return
        match = re.match(r"^data:image/(png|jpeg|webp);base64,(.+)$", data_url, re.S)
        if not match:
            self.write_json({"ok": False, "error": "invalid image data url"}, status=400)
            return
        try:
            data = base64.b64decode(match.group(2), validate=True)
        except Exception:
            self.write_json({"ok": False, "error": "invalid base64"}, status=400)
            return
        if not data or len(data) > 25 * 1024 * 1024:
            self.write_json({"ok": False, "error": "image too large"}, status=400)
            return

        try:
            from PIL import Image
            image = Image.open(io.BytesIO(data)).convert("RGBA")
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            out = io.BytesIO()
            image.save(out, format="PNG", optimize=True, compress_level=9)
            data = out.getvalue()
        except Exception:
            pass

        root = Path(__file__).resolve().parent
        relative = Path("tools") / "apps" / "shared" / "characters" / cost / f"{file_id}.png"
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)

        docs_root = root / "docs"
        if docs_root.exists():
            docs_target = docs_root / relative
            docs_target.parent.mkdir(parents=True, exist_ok=True)
            docs_target.write_bytes(data)

        self.write_json({
            "ok": True,
            "path": str(relative).replace("\\", "/"),
            "bytes": len(data),
        })

    def handle_save_update_edits(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > 5 * 1024 * 1024:
            self.write_json({"ok": False, "error": "invalid body size"}, status=400)
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.write_json({"ok": False, "error": "invalid json"}, status=400)
            return

        edits = payload.get("edits") if isinstance(payload, dict) and "edits" in payload else payload
        if not isinstance(edits, dict):
            self.write_json({"ok": False, "error": "expected update edits map"}, status=400)
            return

        root = Path(__file__).resolve().parent
        output = {
            "version": 1,
            "edits": edits,
        }
        targets = [
            root / "tools" / "starward_update_edits.json",
            root / "docs" / "tools" / "starward_update_edits.json",
        ]
        written = []
        for target in targets:
            if target.parent.exists():
                target.write_text(
                    json.dumps(output, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
                written.append(str(target.relative_to(root)).replace("\\", "/"))
        self.write_json({"ok": True, "files": written})

    def rebuild_publish_docs(self):
        root = Path(__file__).resolve().parent
        try:
            subprocess.run(["node", "generate-character-pages.js"], cwd=root, check=True, timeout=30)
            subprocess.run(["node", "build-publish-folder.js"], cwd=root, check=True, timeout=60)
            return True
        except Exception:
            return False

    def handle_youtube_date(self, parsed):
        video_id = parse_qs(parsed.query).get("id", [""])[0].strip()
        if not re.fullmatch(r"[\w-]{6,}", video_id):
            self.write_json({"publishedAt": ""}, status=400)
            return

        published_at = ""
        try:
            url = f"https://r.jina.ai/http://https://www.youtube.com/watch?v={quote(video_id)}"
            req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=18) as response:
                text = response.read().decode("utf-8", "ignore")
            published_at = extract_publish_date(text)
        except Exception:
            published_at = ""

        self.write_json({"publishedAt": published_at})

    def handle_youtube_latest(self, parsed):
        handle = parse_qs(parsed.query).get("handle", ["StarWard_jp"])[0].strip().lstrip("@")
        if not re.fullmatch(r"[\w.-]{2,64}", handle):
            self.write_json({"id": "", "title": "", "url": "", "publishedText": ""}, status=400)
            return

        payload = {"id": "", "title": "", "url": "", "publishedText": ""}
        try:
            url = f"https://www.youtube.com/@{quote(handle)}/videos"
            req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=18) as response:
                text = response.read().decode("utf-8", "ignore")
            payload = extract_latest_video(text)
        except Exception:
            pass

        self.write_json(payload)

    def handle_x_posts(self, parsed):
        handle = parse_qs(parsed.query).get("handle", ["StarWard_JP"])[0].strip().lstrip("@")
        if not re.fullmatch(r"[\w_]{2,32}", handle):
            self.write_json({"posts": []}, status=400)
            return

        posts = []
        try:
            url = f"https://r.jina.ai/http://https://x.com/{quote(handle)}"
            req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=18) as response:
                text = response.read().decode("utf-8", "ignore")
            posts = extract_x_posts(text, handle)
        except Exception:
            pass

        self.write_json({"posts": posts})

    def write_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def extract_publish_date(text):
    patterns = [
        r"views\s*[•·]\s*([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\s*[•·]",
        r"(?:Premiered|Streamed live on|Published on|Released on)\s+([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})",
        r'"publishDate"\s*:\s*"(\d{4}-\d{2}-\d{2})"',
        r'"uploadDate"\s*:\s*"(\d{4}-\d{2}-\d{2})"',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if not match:
            continue
        raw = match.group(1)
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", raw):
            return raw
        try:
            from email.utils import parsedate_to_datetime
            # Not used for ordinary YouTube text, but keeps date parsing dependency-free.
            return parsedate_to_datetime(raw).date().isoformat()
        except Exception:
            pass
        try:
            from datetime import datetime
            return datetime.strptime(raw, "%b %d, %Y").date().isoformat()
        except Exception:
            pass
    return ""


def is_empty_payload(payload):
    if isinstance(payload, list):
        return len(payload) == 0
    if isinstance(payload, dict) and "channels" in payload and "videos" in payload:
        has_channels = bool(payload.get("channels"))
        has_videos = any(
            isinstance(entries, list) and entries
            for entries in payload.get("videos", {}).values()
        )
        return not has_channels and not has_videos
    return False


def normalize_page_path(page):
    page = (page or "").split("?", 1)[0].split("#", 1)[0].strip()
    if not page:
        return ""
    if not page.startswith("/"):
        page = "/" + page
    if page == "/":
        return "/index.html"
    if page.endswith("/"):
        return page + "index.html"
    return page


def normalize_page_edits(edits):
    return {
        "text": edits.get("text") if isinstance(edits.get("text"), dict) else {},
        "hidden": edits.get("hidden") if isinstance(edits.get("hidden"), dict) else {},
        "added": edits.get("added") if isinstance(edits.get("added"), list) else [],
    }


def sanitize_allstar_file_id(value):
    value = str(value or "").strip()
    value = re.sub(r"[^\w.\-·]+", "-", value, flags=re.UNICODE).strip(".-")
    return value[:80]


def is_valid_allstar_character(item):
    if not isinstance(item, dict):
        return False
    cost = str(item.get("cost", "")).strip()
    file_id = sanitize_allstar_file_id(item.get("file", ""))
    name = str(item.get("name", "")).strip()
    return cost in {"30", "25", "20", "15"} and bool(file_id) and bool(name)


def extract_latest_video(text):
    video_id = ""
    for match in re.finditer(r'"videoId"\s*:\s*"([\w-]{6,})"', text):
        candidate = match.group(1)
        if candidate:
            video_id = candidate
            break

    if not video_id:
        return {"id": "", "title": "", "url": "", "publishedText": ""}

    position = text.find(f'"videoId":"{video_id}"')
    if position < 0:
        position = text.find(f'"videoId": "{video_id}"')
    snippet = text[max(0, position - 400):position + 5000]

    title = ""
    title_match = re.search(r'"title"\s*:\s*\{\s*"content"\s*:\s*"([^"]+)"', snippet)
    if title_match:
        title = decode_json_string(title_match.group(1))
    if not title:
        alt_match = re.search(r'"title"\s*:\s*\{\s*"runs"\s*:\s*\[\s*\{\s*"text"\s*:\s*"([^"]+)"', snippet)
        if alt_match:
            title = decode_json_string(alt_match.group(1))

    published_text = ""
    published_match = re.search(r'"text"\s*:\s*\{\s*"content"\s*:\s*"([^"]*(?:前|ago|日前|時間前)[^"]*)"', snippet)
    if published_match:
        published_text = decode_json_string(published_match.group(1))

    return {
        "id": video_id,
        "title": title,
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "publishedText": published_text,
    }


def decode_json_string(value):
    try:
        return json.loads(f'"{value}"')
    except Exception:
        return value.replace(r"\/", "/")


def extract_x_posts(text, handle):
    section_match = re.search(r"## .+?posts\s*(.+?)(?:## New to X\?|$)", text, re.S)
    section = section_match.group(1) if section_match else text
    pattern = re.compile(
        rf"\[@{re.escape(handle)}\]\(https://x\.com/{re.escape(handle)}\)\s*"
        r"\n\s*\n\[(?P<date>[^\]]+)\]\((?P<url>https://x\.com/[^)]+/status/\d+)\)\s*"
        r"\n\s*\n(?P<body>.*?)(?=\n\[星の翼【公式】\]\(https://x\.com/StarWard_JP\)|\n## New to X\?|$)",
        re.S,
    )
    posts = []
    seen = set()
    for match in pattern.finditer(section):
        url = match.group("url")
        if url in seen:
            continue
        seen.add(url)
        body = match.group("body").strip()
        image = ""
        image_match = re.search(r"https://pbs\.twimg\.com/[^)\s]+", body)
        if image_match:
            image = image_match.group(0)
        body = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", body)
        body = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", body)
        body = re.sub(r"\[\]\([^)]+\)", "", body)
        body = re.sub(r"\n+", " ", body)
        body = re.sub(r"\s+", " ", body).strip()
        body = re.sub(r"(?:\d+:\d+\s+)?\d+(?:\.\d+)?[KM]?$", "", body).strip()
        if not body:
            continue
        posts.append({
            "date": match.group("date"),
            "url": url,
            "text": body[:280],
            "image": image,
        })
        if len(posts) >= 4:
            break
    return posts


if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parent)
    server = ThreadingHTTPServer(("127.0.0.1", 8766), GuideHandler)
    print("Serving Starward guide at http://127.0.0.1:8766/")
    server.serve_forever()
