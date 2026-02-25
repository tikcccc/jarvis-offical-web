Vibe Coding Task: Implement "Wide-Format Narrative Text Aggregation"

Role: Vibe Coding Architect (Expert in Next.js, GSAP, Lenis, Tailwind CSS)
Objective: Create a high-end, narrative scroll animation where a large text block "aggregates" from a sparse, ethereal state into a dense, readable headline as the user scrolls down.

1. Tech Stack & Constraints (Strict)

Styling: Tailwind CSS (No custom CSS files, use <style> only if absolutely necessary for specific font imports).

Animation: GSAP + ScrollTrigger.

Smooth Scroll: Lenis (Mandatory for syncing with ScrollTrigger).

Font: Inter or similar high-readability sans-serif.

2. Architecture & Behavior Specifications

Phase 1: Foundation (Layout & Width)

Viewport Strategy: The text container MUST utilize the full width of modern high-res screens.

Rule: Set width to 90vw and max-width: 1800px. Do NOT constrain to small columns (e.g., 800px) which creates awkward white space.

Typography: Use large, impactful fonts (text-4xl md:text-7xl).

Wrapping Logic: Prioritize filling the line over balancing it. Do NOT use text-wrap: balance if it sacrifices line density.

Phase 3: Experience Layer (The Animation Logic)

Core Effect: "Sparse to Dense" (由疏到密).
Direction: Scroll Down -> Text aggregates.

Critical Stability Rules (Anti-Layout-Thrashing):

Decouple Trigger & Target:

Trigger: Create a wrapper .trigger-zone with a fixed height (e.g., 130vh) to define the scroll distance. Use Flexbox to center content.

Target: The actual text element .text-content sits inside.

Why: Changing line-height changes element height. If the trigger is on the element itself, the start/end points will jump, causing glitches.

Force State with fromTo:

Do not rely on CSS for the initial state. Use gsap.fromTo() to rigorously define both start and end values to prevent CSS specificity wars.

No Width/Kerning Animation:

Do NOT animate letter-spacing significantly. It causes words to jump between lines (reflow). Animate line-height only.

3. Implementation Details (Code Blueprint)

HTML Structure:

<div class="trigger-zone h-[130vh] flex items-center justify-center relative">
    <h1 class="text-content text-4xl md:text-7xl font-semibold width-[90vw] max-w-[1800px] text-center text-black leading-tight">
        [Content Here]
    </h1>
</div>


GSAP Logic (gsap.fromTo):

Start State (From):

lineHeight: "2.2" (Sparse, ethereal)

opacity: 0.5 (Faint)

y: 60 (Slight offset from bottom)

End State (To):

lineHeight: "1.1" (Dense, readable headline standard)

opacity: 1 (Solid)

y: 0

ease: "power2.out"

ScrollTrigger Config:

trigger: ".trigger-zone" (The wrapper, NOT the text)

start: "top 65%" (Start animation when content enters lower-mid view)

end: "center center" (Finish when centered)

scrub: 1 (Smooth scrubbing)


h1的文字内容：
We catalyze digital transformation across the global construction industry—delivering infrastructure that is faster, cheaper, safer, and greener.