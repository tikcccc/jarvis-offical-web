Role: You are a world-class UI/UX Designer and Creative Developer specializing in "Scrollytelling" and high-end corporate editorial design.

Objective: Implement a stunning, responsive single-page application based on the provided content structure. The goal is Visual Impact and Editorial Elegance. Focus entirely on the look, feel, and motion.

1. Design Language & Vibe (Core Aesthetic)

Style: "Industrial Luxury" meets "Swiss International Style." Think Monocle Magazine mixed with Stark Industries.

Keywords: Brutalist, Precision, Cinematic, Clean, Grid-based, High-Contrast.

Whitespace: Use aggressive negative space. Do not clutter. Sections should breathe with 80px-120px padding.

2. Typography System

Headings (Display): Massive, imposing sans-serif fonts. The Hero title should be viewport-dependent (huge, taking up 80% width), extremely tight tracking (letters almost touching), and heavy weight.

Body Text: Clean, highly readable neo-grotesque sans-serif (e.g., Inter or Helvetica Neue). High line-height (1.6 to 1.8) for readability.

Meta/Tags: Exclusively Monospace (e.g., JetBrains Mono or SF Mono). Small font size (10-12px), uppercase, generous letter-spacing (widest), used for labels like "01", "HKD 500M", "ESG COMPLIANT".

3. Color Palette & Texture

Primary: Stark Black (#18181b) and Pure White.

Accents: Cool Grays (#94a3b8) and "Slate" tones for borders.

Modes:

Hero & Gallery: Dark Mode (White text on deep charcoal backgrounds).

Narrative & Stats: Light Mode (Dark text on off-white/gray backgrounds).

Borders: Ultra-thin "Hairline" borders (1px opacity 0.1 or 0.2) to define grids.

4. Component Visuals (Specific Instructions)

Navigation (Sticky):

Starts transparent. Upon scrolling, transforms into a frosted glass (backdrop-blur) strip with a subtle hairline border.

Links should have a "magnetic" hover effect or a moving underline indicator.

The Hero Section:

Background: Full viewport height (100vh). High-resolution background image with a subtle "Ken Burns" slow zoom effect.

Overlay: A dark gradient scrim from the bottom up to ensure text readability.

Text: The title "JPM" (or BIM/VENTURES) should be a massive architectural element, partially transparent or using mix-blend-mode: overlay to blend with the image.

The Engine (List View):

A list of items separated by horizontal lines.

Interaction: Hovering over a row should dim all other rows slightly and highlight the active row (maybe expand it vertically or reveal an arrow icon).

The Stats Grid:

Bento-box style grid. Sharp corners or very subtle rounding (2px).

Big Data Numbers: Huge, bold font.

Labels: Small, uppercase, monospace.

The Gallery:

Layout: Alternating "Zig-Zag" layout. (Row 1: Image Left, Text Right. Row 2: Text Left, Image Right).

Images: 3:4 or 4:3 aspect ratios. On hover, the image should slightly scale up (zoom in) within its container while the container remains fixed (masking effect). Greyscale to Color transition on hover is desirable.

5. Motion & Physics (Crucial)

Scroll Animations: Elements should not just "appear." Use framer-motion style entry animations.

Text: Staggered reveal (lines sliding up and fading in).

Images: Parallax scrolling (images move slightly slower than the scroll speed).

Smoothness: The whole page should feel heavy and premium. No jerky movements. Easing should be [0.6, 0.01, -0.05, 0.9].

