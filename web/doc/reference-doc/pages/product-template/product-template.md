Visual Design Specification: AIP Enterprise Autonomy Landing Page

1. Core Visual Identity

Theme: "High-Tech Minimalist" & "Immersive Cinematic".

Color Palette:

Dark Mode (Hero/Transition): Deep Navy (#1E1F2B) - used for immersive backgrounds.

Light Mode (Content): Pale Grey (#F2F2F2) - used for readability in feature sections.

Accent: Blue-Purple Gradient (Linear Gradient 93deg: #9881F3 to #13C9BA) - used sparingly for key text highlights.

Typography:

Massive, structural headings (up to 20vw).

Tight letter-spacing (tracking-tighter) for a modern, compact feel.

Clean sans-serif fonts (Inter/Segoe UI).

2. Section-by-Section Visual Breakdown

A. The Hero Section (The Underlayer)

Concept: A static, majestic foundation that sits behind the scrolling content.

Visuals:

Background: Full-screen, looping abstract tech video (dark tones).

Overlay: Subtle bottom-to-top gradient shadow to ensure text legibility.

Logo: Massive "AIP" typography (20vw size) anchored at bottom-left. Pure white.

Metadata: Minimalist, right-aligned text list at bottom-right. Small, uppercase, low-opacity (70%). NO icons/arrows here.

Behavior: Sticky position (z-index: 0). It stays fixed while the next section slides over it like a shutter.

B. The Narrative Track (The Transition Layer)

Concept: A tall scroll track that drives the storytelling transition.

Scroll Interaction:

Slide-Over: This section slides up from the bottom, covering the Hero Section.

Sticky Stage: Once it covers the screen, the content centers and "sticks" while the user continues scrolling to play animations.

Color Transition:

Starts as Deep Navy (#1E1F2B) to seamlessly blend with the Hero.

Smoothly fades to Pale Grey (#F2F2F2) as the user scrolls deeper.

Text Animations (Scrollytelling):

"Go beyond chat.":

Effect: Staggered Letter Reveal. Letters slide up and fade in one by one (wave effect).

Color: Transitions from White to Dark as the background turns Light.

"Enterprise Autonomy":

Effect: Whole line floats up (Block Fade).

Color: Starts Solid Black -> Cross-fades to Blue-Purple Gradient upon full reveal.

Description & Footer:

Effect: Floats up as a unified block.

Elements: Centered small text + Custom Chevron Arrow + "SCROLL TO EXPLORE" label.

C. Feature Sections (The Content)

Layout: Two-column asymmetric grid.

Left Column (Sticky): Holds the Section Index and Giant Heading.

Right Column (Scrollable): Holds description, toggle buttons, and media cards.

Sticky Navigation:

The Left Column (Title + Index) sticks to the viewport top while the Right Column scrolls.

Index Animation (The "[0.1] —— 0.2" Component):

Structure: Current number in brackets [0.1], followed by a long horizontal line, followed by inactive numbers.

Trigger: Reversible Scroll Trigger (Enter/Exit viewport).

Entrance:

Container fades in and slides down slightly.

The Line: Grows horizontally from left to right (ScaleX 0 -> 1) with elegant easing.

Exit: Reverses the animation (shrinks and fades out).

Media Cards:

Clean, white-bordered cards with 16:10 aspect ratio.

Subtle hover lift effects.

"Video | Details" Pill Toggle switch above media.

3. Motion Principles

Timing: Animations should feel "heavy" and premium (e.g., cubic-bezier easing), not bouncy or instant.

Reversibility: All scroll-triggered effects (lines growing, text fading) must reverse smoothly when scrolling back up.

**Continuity