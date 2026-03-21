"""
Kylin-PBC Logo Generator
Design Philosophy: Crystalline Continuum
Creates a logo that fuses the Qilin motif with periodic boundary condition lattice structures.
"""

import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

COBALT_BLUE = (26, 93, 171)
DARK_NAVY = (12, 48, 96)
LIGHT_AZURE = (70, 140, 210)
ICE_BLUE = (180, 210, 240)
PALE_SILVER = (220, 230, 240)
WHITE = (255, 255, 255)
TRANSPARENT = (255, 255, 255, 0)

WIDTH = 2400
HEIGHT = 2400
CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT // 2


def hex_lattice_points(cx, cy, radius, spacing):
    """Generate hexagonal lattice points within a radius."""
    points = []
    a1 = (spacing, 0)
    a2 = (spacing * 0.5, spacing * math.sqrt(3) / 2)
    n = int(radius / spacing) + 2
    for i in range(-n, n + 1):
        for j in range(-n, n + 1):
            x = cx + i * a1[0] + j * a2[0]
            y = cy + i * a1[1] + j * a2[1]
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            if dist <= radius:
                points.append((x, y))
    return points


def draw_hexagon(draw, cx, cy, size, outline_color, outline_width=2, fill=None):
    """Draw a regular hexagon."""
    pts = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        px = cx + size * math.cos(angle)
        py = cy + size * math.sin(angle)
        pts.append((px, py))
    draw.polygon(pts, outline=outline_color, fill=fill, width=outline_width)


def draw_lattice_connections(draw, points, spacing, color, width=1):
    """Draw connections between lattice points within spacing distance."""
    threshold = spacing * 1.15
    for i, p1 in enumerate(points):
        for j, p2 in enumerate(points):
            if j <= i:
                continue
            dist = math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)
            if dist <= threshold:
                draw.line([p1, p2], fill=color, width=width)


def create_radial_gradient(size, center, inner_color, outer_color, inner_radius, outer_radius):
    """Create a radial gradient image."""
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    for y in range(size[1]):
        for x in range(size[0]):
            dist = math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2)
            if dist <= inner_radius:
                t = 0.0
            elif dist >= outer_radius:
                t = 1.0
            else:
                t = (dist - inner_radius) / (outer_radius - inner_radius)
            t = t * t
            r = int(inner_color[0] + (outer_color[0] - inner_color[0]) * t)
            g = int(inner_color[1] + (outer_color[1] - inner_color[1]) * t)
            b = int(inner_color[2] + (outer_color[2] - inner_color[2]) * t)
            a = int(inner_color[3] + (outer_color[3] - inner_color[3]) * t)
            img.putpixel((x, y), (r, g, b, a))
    return img


def draw_unit_cell_highlight(draw, cx, cy, size, color, width=3):
    """Draw a highlighted unit cell (parallelogram) at position."""
    a1 = (size, 0)
    a2 = (size * 0.5, size * math.sqrt(3) / 2)
    p0 = (cx, cy)
    p1 = (cx + a1[0], cy + a1[1])
    p2 = (cx + a1[0] + a2[0], cy + a1[1] + a2[1])
    p3 = (cx + a2[0], cy + a2[1])
    draw.line([p0, p1], fill=color, width=width)
    draw.line([p1, p2], fill=color, width=width)
    draw.line([p2, p3], fill=color, width=width)
    draw.line([p3, p0], fill=color, width=width)


def create_kylin_pbc_logo():
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), WHITE + (255,))
    draw = ImageDraw.Draw(canvas)

    # --- Layer 1: Subtle background lattice pattern (full canvas, very faint) ---
    bg_spacing = 80
    bg_points = hex_lattice_points(CENTER_X, CENTER_Y, 1800, bg_spacing)
    for pt in bg_points:
        dist = math.sqrt((pt[0] - CENTER_X) ** 2 + (pt[1] - CENTER_Y) ** 2)
        fade = max(0, min(255, int(25 * (1 - dist / 1800))))
        if fade > 3:
            draw_hexagon(draw, pt[0], pt[1], bg_spacing * 0.55,
                         outline_color=COBALT_BLUE[:3] + (fade,), outline_width=1)

    # --- Layer 2: Main periodic lattice ring ---
    ring_inner = 500
    ring_outer = 950
    lattice_spacing = 120
    lattice_points = hex_lattice_points(CENTER_X, CENTER_Y, ring_outer + 50, lattice_spacing)

    ring_points = []
    for pt in lattice_points:
        dist = math.sqrt((pt[0] - CENTER_X) ** 2 + (pt[1] - CENTER_Y) ** 2)
        if ring_inner - 30 <= dist <= ring_outer + 30:
            ring_points.append(pt)

    for pt in ring_points:
        dist = math.sqrt((pt[0] - CENTER_X) ** 2 + (pt[1] - CENTER_Y) ** 2)
        dist_to_mid = abs(dist - (ring_inner + ring_outer) / 2)
        max_dist = (ring_outer - ring_inner) / 2
        intensity = max(0.15, 1.0 - (dist_to_mid / max_dist) ** 1.5)
        alpha = int(180 * intensity)
        hex_size = lattice_spacing * 0.52
        draw_hexagon(draw, pt[0], pt[1], hex_size,
                     outline_color=COBALT_BLUE[:3] + (alpha,), outline_width=2)

    draw_lattice_connections(draw, ring_points, lattice_spacing,
                             color=LIGHT_AZURE[:3] + (60,), width=1)

    for pt in ring_points:
        dist = math.sqrt((pt[0] - CENTER_X) ** 2 + (pt[1] - CENTER_Y) ** 2)
        dist_to_mid = abs(dist - (ring_inner + ring_outer) / 2)
        max_dist = (ring_outer - ring_inner) / 2
        intensity = max(0.1, 1.0 - (dist_to_mid / max_dist) ** 1.5)
        node_r = int(5 * intensity) + 2
        alpha = int(220 * intensity)
        draw.ellipse([pt[0] - node_r, pt[1] - node_r, pt[0] + node_r, pt[1] + node_r],
                     fill=COBALT_BLUE[:3] + (alpha,))

    # --- Layer 3: Highlighted unit cells ---
    uc_positions = [
        (CENTER_X - 300, CENTER_Y - 700),
        (CENTER_X + 400, CENTER_Y - 600),
        (CENTER_X + 550, CENTER_Y + 200),
        (CENTER_X - 600, CENTER_Y + 350),
    ]
    for pos in uc_positions:
        dist = math.sqrt((pos[0] - CENTER_X) ** 2 + (pos[1] - CENTER_Y) ** 2)
        if ring_inner - 50 <= dist <= ring_outer + 50:
            draw_unit_cell_highlight(draw, pos[0], pos[1], lattice_spacing,
                                     color=LIGHT_AZURE[:3] + (100,), width=3)

    # --- Layer 4: Qilin motif in center ---
    script_dir = os.path.dirname(os.path.abspath(__file__))
    kylin_path = os.path.join(script_dir, "kylin_logo.png")

    if os.path.exists(kylin_path):
        kylin_orig = Image.open(kylin_path).convert("RGBA")
        kw, kh = kylin_orig.size

        # Extract just the blue Qilin figure (mask out white/near-white background)
        kylin_data = kylin_orig.load()
        for y in range(kh):
            for x in range(kw):
                r, g, b, a = kylin_data[x, y]
                brightness = (r + g + b) / 3
                blue_ratio = b / max(1, (r + g + b))
                if brightness > 200 and blue_ratio < 0.5:
                    kylin_data[x, y] = (r, g, b, 0)
                elif brightness > 180:
                    fade = max(0, int(a * (1 - (brightness - 180) / 75)))
                    kylin_data[x, y] = (r, g, b, fade)

        # Resize to fit center area
        target_size = 700
        ratio = target_size / max(kw, kh)
        new_w = int(kw * ratio)
        new_h = int(kh * ratio)
        kylin_resized = kylin_orig.resize((new_w, new_h), Image.LANCZOS)

        # Position: center of canvas, slightly left and up to account for the "Kylin" text in original
        paste_x = CENTER_X - new_w // 2 - 40
        paste_y = CENTER_Y - new_h // 2 - 20

        canvas.paste(kylin_resized, (paste_x, paste_y), kylin_resized)

    # --- Layer 5: Periodic arrows (translational symmetry indicators) ---
    arrow_color = COBALT_BLUE[:3] + (120,)
    arrow_positions = [
        (CENTER_X, CENTER_Y - ring_outer - 80, 0, -60),
        (CENTER_X, CENTER_Y + ring_outer + 80, 0, 60),
        (CENTER_X - ring_outer - 80, CENTER_Y, -60, 0),
        (CENTER_X + ring_outer + 80, CENTER_Y, 60, 0),
    ]
    for ax, ay, dx, dy in arrow_positions:
        draw.line([(ax - dx, ay - dy), (ax + dx, ay + dy)], fill=arrow_color, width=3)
        angle = math.atan2(dy, dx)
        head_len = 18
        for side in [-1, 1]:
            ha = angle + math.pi + side * 0.4
            hx = ax + dx + head_len * math.cos(ha)
            hy = ay + dy + head_len * math.sin(ha)
            draw.line([(ax + dx, ay + dy), (hx, hy)], fill=arrow_color, width=3)

    # --- Layer 6: Boundary dashed circles ---
    for radius in [ring_inner - 20, ring_outer + 40]:
        n_dashes = 120
        for i in range(n_dashes):
            if i % 3 == 2:
                continue
            a1 = 2 * math.pi * i / n_dashes
            a2 = 2 * math.pi * (i + 0.7) / n_dashes
            x1 = CENTER_X + radius * math.cos(a1)
            y1 = CENTER_Y + radius * math.sin(a1)
            x2 = CENTER_X + radius * math.cos(a2)
            y2 = CENTER_Y + radius * math.sin(a2)
            alpha = 80 if radius < 600 else 50
            draw.line([(x1, y1), (x2, y2)], fill=COBALT_BLUE[:3] + (alpha,), width=2)

    # --- Layer 7: "Kylin-PBC" text ---
    try:
        font_large = ImageFont.truetype("arial.ttf", 110)
        font_sub = ImageFont.truetype("arial.ttf", 48)
    except OSError:
        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 110)
            font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
        except OSError:
            font_large = ImageFont.load_default()
            font_sub = ImageFont.load_default()

    title_text = "Kylin-PBC"
    bbox = draw.textbbox((0, 0), title_text, font=font_large)
    tw = bbox[2] - bbox[0]
    text_x = CENTER_X - tw // 2
    text_y = CENTER_Y + ring_outer + 120

    draw.text((text_x + 3, text_y + 3), title_text, fill=DARK_NAVY[:3] + (40,), font=font_large)
    draw.text((text_x, text_y), title_text, fill=COBALT_BLUE[:3] + (240,), font=font_large)

    sub_text = "Periodic Boundary Conditions"
    bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = bbox_sub[2] - bbox_sub[0]
    sub_x = CENTER_X - sw // 2
    sub_y = text_y + 130

    draw.text((sub_x, sub_y), sub_text, fill=LIGHT_AZURE[:3] + (180,), font=font_sub)

    # --- Layer 8: Corner periodic lattice fragments (showing infinite extension) ---
    corners = [(0, 0), (WIDTH, 0), (0, HEIGHT), (WIDTH, HEIGHT)]
    for corner in corners:
        corner_pts = hex_lattice_points(corner[0], corner[1], 300, 80)
        for pt in corner_pts:
            if 0 <= pt[0] <= WIDTH and 0 <= pt[1] <= HEIGHT:
                draw_hexagon(draw, pt[0], pt[1], 40,
                             outline_color=ICE_BLUE[:3] + (35,), outline_width=1)

    # --- Finalize: convert to RGB ---
    final = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    final.paste(canvas, mask=canvas.split()[3])

    output_path = os.path.join(script_dir, "kylin_pbc_logo.png")
    final.save(output_path, "PNG", dpi=(300, 300))
    print(f"Logo saved to: {output_path}")
    return output_path


if __name__ == "__main__":
    create_kylin_pbc_logo()
