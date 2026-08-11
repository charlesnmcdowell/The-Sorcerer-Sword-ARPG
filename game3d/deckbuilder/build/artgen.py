#!/usr/bin/env python3
"""
artgen.py — shared art-generation module (2026-08-11: OpenAI replaces xAI Grok).

Workflow is unchanged from the Grok era, only the backend moved:
  * generate(prompt)          -> fresh image (new characters / backgrounds)
  * edit(prompt, ref_path)    -> ref-anchored edit (ON-MODEL consistency: pass the
                                 character's anchor frame, describe the new pose)
  * key_crop(raw, out_path)   -> magenta chroma-key -> RGBA -> TIGHT-CROP to the
                                 silhouette (REQUIRED: the bundler's centroid
                                 registration expects individually-cropped frames)

Model: gpt-image-1.  Portrait size 1024x1536 (matches the old 9:16 sprites).
Key:   game3d/tools/openai_key.txt  (the old xai_key.txt is retired).

Usage in a generator script:
    from artgen import generate, edit, key_crop
    raw = edit(f"{BIBLE}. Now shown mid-animation: {pose}. {STYLE_L}, {MAGENTA}", anchor)
    key_crop(raw, "assets/sprites/enemies/foo/foo_walk_2.png")
"""
import os, io, json, base64, time, uuid, urllib.request

API = "https://api.openai.com/v1"
MODEL = "gpt-image-1"
SIZE = "1024x1536"          # portrait, closest to the old 9:16 sprite canvas

def _key():
    for p in ("/mnt/user-data/uploads/game3d/tools/openai_key.txt",
              os.path.join(os.path.dirname(os.path.abspath(__file__)), "openai_key.txt"),
              os.path.expanduser("~/openai_key.txt")):
        if os.path.exists(p):
            return open(p).read().strip()
    raise RuntimeError("openai_key.txt not found (game3d/tools/ or build/)")

# The standard prompt fragments every generator script shares.
MAGENTA = ("on a perfectly FLAT, UNIFORM, highly SATURATED pure MAGENTA background (hex FF00FF), "
           "the magenta covering EVERY pixel of the background right to all four corners and edges, "
           "no gradient, no scenery, no ground, no cast shadow, no text, no extra characters")
STYLE_R = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING RIGHT")
STYLE_L = ("clean anime cel-shaded dark-fantasy style, crisp lineart, dramatic rim light, "
           "full body head to feet, single character, centered, side view FACING LEFT")

def _req(url, data, headers, tries=3):
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=headers)
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")[:400]
            if attempt == tries - 1:
                raise RuntimeError(f"OpenAI {e.code}: {body}")
            time.sleep(10)
        except Exception:
            if attempt == tries - 1:
                raise
            time.sleep(10)

def generate(prompt, size=SIZE, quality="high"):
    """Fresh image from a prompt. Returns raw PNG bytes."""
    r = _req(API + "/images/generations",
             json.dumps({"model": MODEL, "prompt": prompt, "size": size,
                         "quality": quality, "n": 1}).encode(),
             {"Authorization": "Bearer " + _key(), "Content-Type": "application/json"})
    return base64.b64decode(r["data"][0]["b64_json"])

def edit(prompt, ref_path, size=SIZE, quality="high"):
    """Ref-anchored edit (multipart form). Returns raw PNG bytes."""
    boundary = uuid.uuid4().hex
    parts = []
    def field(name, value):
        parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n').encode())
    field("model", MODEL); field("prompt", prompt); field("size", size)
    field("quality", quality); field("n", "1")
    img = open(ref_path, "rb").read()
    parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="image[]"; '
                  f'filename="ref.png"\r\nContent-Type: image/png\r\n\r\n').encode() + img + b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())
    body = b"".join(parts)
    r = _req(API + "/images/edits", body,
             {"Authorization": "Bearer " + _key(),
              "Content-Type": f"multipart/form-data; boundary={boundary}"})
    return base64.b64decode(r["data"][0]["b64_json"])

def key_crop(raw, out_path):
    """Magenta chroma-key -> RGBA -> tight-crop to silhouette bbox. Same as ever."""
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    a = np.array(im); R, G, B = (a[:, :, i].astype(int) for i in range(3))
    corners = [a[0:6, 0:6, :3].reshape(-1, 3).mean(0), a[0:6, -6:, :3].reshape(-1, 3).mean(0),
               a[-6:, 0:6, :3].reshape(-1, 3).mean(0), a[-6:, -6:, :3].reshape(-1, 3).mean(0)]
    c = np.median(np.array(corners), axis=0)
    bgmask = (abs(a[:, :, :3].astype(int) - c).sum(2) < 70)
    hot = (R > 120) & (B > 110) & (G < 0.55 * np.minimum(R, B))
    lbl, _ = ndimage.label(bgmask | hot)
    edge = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1]); edge.discard(0)
    bg = np.isin(lbl, list(edge)) | hot
    bg = ndimage.binary_dilation(bg, iterations=1)
    alpha = np.where(bg, 0, 255).astype("uint8")
    band = ndimage.binary_dilation(bg, iterations=3) & ~bg
    pink = band & (R > G + 60) & (B > G + 60)
    a[:, :, 0] = np.where(pink, np.minimum(R, G + 60), a[:, :, 0])
    a[:, :, 2] = np.where(pink, np.minimum(B, G + 60), a[:, :, 2])
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8)))
    a[:, :, 3] = alpha
    ys, xs = np.where(alpha > 40)
    y0, y1 = max(0, ys.min() - 10), min(im.height, ys.max() + 10)
    x0, x1 = max(0, xs.min() - 10), min(im.width, xs.max() + 10)
    Image.fromarray(a, "RGBA").crop((x0, y0, x1, y1)).save(out_path)

if __name__ == "__main__":
    print("artgen.py is a module — import generate/edit/key_crop from a generator script.")
