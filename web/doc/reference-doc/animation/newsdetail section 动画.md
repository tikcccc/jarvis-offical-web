评价这个动画方案：News Detail Page: Scroll-Based Section Numbering Animation
Executive Summary
Implement a scroll-triggered progressive section numbering system for the newsroom detail page. As the user scrolls through the article, the sidebar "Section 01" label should automatically update to "Section 02", "Section 03", etc., based on which content section is currently in view. Key Requirements:Detect H2 headings in the article body as section markers
Track scroll position using IntersectionObserver
Update sidebar label dynamically ("Section 01" → "Section 02" → "Section 03"...)
Follow existing patterns from feature-section.tsx for consistency
Smooth animations when section number changes
Current Implementation Analysis
Current "Section 01" Implementation
File: src/app/(website)/newsroom/[slug]/news-detail-client.tsx (Lines 191-196)<div className="hidden md:block newsroom-detail-sidebar">
  <div className="newsroom-detail-sticky">
    <div className="newsroom-section-marker"></div>
    <MonoLabel>Section 01</MonoLabel>  {/* ← STATIC, never changes */}
  </div>
</div>
Current Behavior:Static text label that always displays "Section 01"
Styled with .newsroom-detail-sticky (position: sticky)
Located in left sidebar of 2-column grid layout
Never updates based on scroll position
Article Content Structure
File: src/app/(website)/newsroom/[slug]/news-detail-client.tsx (Lines 198-203)<div className="newsroom-prose max-w-none">
  <PortableText
    value={newsDetail.body || []}
    components={portableTextComponents}
  />
</div>
PortableText Structure:newsDetail.body is a PortableTextBlock[] array
Each block has a style property: 'normal', 'h2', 'h3', 'blockquote'
H2 headings rendered as: <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
H3 headings rendered as: <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
Existing Scroll Animation Patterns
Pattern 1: useInView Hook (src/hooks/use-in-view.ts)IntersectionObserver wrapper
Returns { ref, inView, entry }
Configurable threshold (e.g., 0.1, 0.3)
Can trigger once or repeatedly
Pattern 2: Multi-Threshold Feature Section (src/components/product-template/feature-section.tsx, Lines 134-280)Uses multiple thresholds: [0.1, 0.3]
Tracks scroll direction (up/down)
intersectionRatio determines which animation stage to trigger
State management for different animation modes
Implementation Plan
Step 1: Add Section IDs to H2 Headings
Goal: Attach unique IDs to each H2 heading so IntersectionObserver can track them. Location: src/app/(website)/newsroom/[slug]/news-detail-client.tsx (Lines 349-376) Current H2 Component:h2: ({ children }: { children?: ReactNode }) => (
  <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
),
Updated H2 Component:h2: ({ children, value }: { children?: ReactNode; value?: any }) => {
  // Generate unique ID from heading text
  const headingText = children?.toString() || '';
  const sectionId = `section-${headingText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 50)}`;

  return (
    <h2
      id={sectionId}
      data-section-heading
      className="text-2xl font-bold mt-8 mb-4"
    >
      {children}
    </h2>
  );
},
Key Changes:Add unique id attribute to each H2
Add data-section-heading attribute for querySelector
ID is slug-ified from heading text
Step 2: Create Section Tracking State
Goal: Track which section is currently active (in view). Location: src/app/(website)/newsroom/[slug]/news-detail-client.tsx (After line 70) Add imports:import { useState, useEffect, useRef, useMemo } from 'react';
Add state:const [activeSection, setActiveSection] = useState<number>(1);
const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
State Management:activeSection: Current section number (1-based index)
sectionRefs: Map of section number → DOM element reference
Step 3: Implement IntersectionObserver for Section Tracking
Goal: Detect when each H2 heading enters/exits the viewport and update active section. Location: src/app/(website)/newsroom/[slug]/news-detail-client.tsx (After state declarations) Implementation:useEffect(() => {
  // Find all H2 headings in the article
  const headings = document.querySelectorAll('[data-section-heading]');
  if (headings.length === 0) return;

  // Store refs
  headings.forEach((heading, index) => {
    sectionRefs.current.set(index + 1, heading as HTMLElement);
  });

  // Create IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Find which section number this heading corresponds to
          const headingElement = entry.target as HTMLElement;
          const sectionNumber = Array.from(headings).indexOf(headingElement) + 1;

          if (sectionNumber > 0) {
            setActiveSection(sectionNumber);
          }
        }
      });
    },
    {
      // Trigger when heading is 30% visible from top of viewport
      threshold: 0.3,
      rootMargin: '-20% 0px -70% 0px', // Bias towards top of viewport
    }
  );

  // Observe all headings
  headings.forEach((heading) => observer.observe(heading));

  // Cleanup
  return () => {
    headings.forEach((heading) => observer.unobserve(heading));
    observer.disconnect();
  };
}, [newsDetail.body]); // Re-run when article body changes
Key Configuration:threshold: 0.3 - Trigger when 30% of heading is visible
rootMargin: '-20% 0px -70% 0px' - Creates a "hot zone" at top 30% of viewport
Updates activeSection state when a new heading enters the zone
Step 4: Update Sidebar Label with Active Section
Goal: Replace static "Section 01" with dynamic section number. Location: src/app/(website)/newsroom/[slug]/news-detail-client.tsx (Lines 191-196) Current Code:<div className="hidden md:block newsroom-detail-sidebar">
  <div className="newsroom-detail-sticky">
    <div className="newsroom-section-marker"></div>
    <MonoLabel>Section 01</MonoLabel>
  </div>
</div>
Updated Code:<div className="hidden md:block newsroom-detail-sidebar">
  <div className="newsroom-detail-sticky">
    <div className="newsroom-section-marker"></div>
    <m.div
      key={activeSection}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <MonoLabel>
        Section {String(activeSection).padStart(2, '0')}
      </MonoLabel>
    </m.div>
  </div>
</div>
Key Changes:Wrapped in <m.div> for Framer Motion animation
key={activeSection} forces re-render when section changes
Fade + slide animation (y: -10 → 0 → 10)
padStart(2, '0') ensures "01", "02", "03" format
Implementation Sequence
Phase 1: Core Functionality
✅ Add section IDs to H2 headings (Step 1)
✅ Create section tracking state (Step 2)
✅ Implement IntersectionObserver (Step 3)
✅ Update sidebar label with active section (Step 4)
Phase 2: Testing
Test with articles containing 1, 3, 5+ sections
Test scroll up/down behavior
Test on mobile (sidebar is hidden, feature should not error)
Test articles with no H2 headings
Verify animation smoothness
Technical Details
IntersectionObserver Configuration
Threshold: 0.3 (30% visibility)Triggers when heading is 30% visible
Good balance between too early/too late
Root Margin: '-20% 0px -70% 0px'Creates a "hot zone" at top 30% of viewport
Headings entering this zone become "active"
Prevents flickering as user scrolls
Why this config?Similar to feature-section.tsx pattern (uses 0.3 threshold)
Ensures section changes feel intentional, not jumpy
Animation Timing
Duration: 0.3s (matches newsroom motion tokens)Fade + slide animation
Smooth transition without being slow
Easing: 'easeOut'Starts fast, ends slow
Feels natural and responsive
Files to Modify
Primary File:
src/app/(website)/newsroom/[slug]/news-detail-client.tsx
Add imports: useState, useEffect, useRef, useMemo
After line 70: Add activeSection state and sectionRefs ref
After state: Add IntersectionObserver useEffect
Lines 191-196: Update sidebar section label with animation
Lines 349-376: Update portableTextComponents h2 renderer to add IDs
No CSS Changes Required:
Existing .newsroom-detail-sticky styling works as-is
Existing .newsroom-section-marker styling works as-is
Framer Motion handles animations
Expected Behavior
Scenario 1: Article with 3 H2 Headings
Introduction text...

## Heading 1           ← Section 01 shows when this is in view
Content for section 1...

## Heading 2           ← Section 02 shows when this is in view
Content for section 2...

## Heading 3           ← Section 03 shows when this is in view
Content for section 3...
Scenario 2: Article with No H2 Headings
Introduction text...
Main body content...
Conclusion...
Sidebar shows: "Section 01" (no headings detected, stays at 01)Scenario 3: Scrolling Behavior
User scrolls down → Section number increases (01 → 02 → 03)
User scrolls up → Section number decreases (03 → 02 → 01)
Smooth fade + slide animation on each change
Risk Assessment
Low Risk ✅
Adding IDs to H2 headings (non-breaking change)
IntersectionObserver is well-supported (95%+ browser support)
Framer Motion already used throughout codebase
Sidebar is desktop-only (hidden on mobile, no risk of mobile errors)
Medium Risk ⚠️
Article without H2 headings → will show "Section 01" but won't change (acceptable)
IntersectionObserver firing too frequently → mitigated with rootMargin config
Mitigation Strategies
Test with real Sanity article data
Add null checks for newsDetail.body
Ensure cleanup in useEffect to prevent memory leaks
Testing Checklist
 Article with 1 H2 heading → "Section 01" only
 Article with 5 H2 headings → Counts 01-05 correctly
 Article with no H2 headings → Shows "Section 01" (static)
 Scroll down through sections → Numbers increment
 Scroll up through sections → Numbers decrement
 Animation is smooth and not jumpy
 No console errors on mount/unmount
 Mobile view (sidebar hidden) → No errors
 Fast scrolling → Section tracking keeps up
Summary
This implementation follows existing codebase patterns:Uses IntersectionObserver (like feature-section.tsx)
Uses Framer Motion (already in newsroom-page-client.tsx)
Minimal changes to existing code
No new dependencies required
Works gracefully with articles that have no H2 headings
Single File Change: news-detail-client.tsx Estimated Time: 30-45 minutes including testing Complexity: Medium (involves state management + IntersectionObserver)

关键风险与修正 (Critical Fixes)
在开始编码之前，请务必处理以下两个问题：

1. H2 标题内容重复导致的 ID 冲突
问题： 方案中 ID 生成逻辑是基于标题文本 (slug-ified)。如果文章中有两个 H2 叫 "Conclusion" 或 "Summary"，它们会拥有相同的 ID（例如 id="section-summary"）。 后果： 虽然 IntersectionObserver 依然能工作（因为它是基于 DOM 节点的），但 document.querySelectorAll 在某些特定选择器逻辑下可能会混淆，且重复 ID 违反 HTML 标准，会破坏锚点链接功能。 建议修复： 在 ID 后追加哈希或随机字符，或者接受这个限制（在 CMS 层面要求标题唯一）。

2. "Section 01" 的计数逻辑悖论 (The Index Logic Trap)
问题： 方案中的逻辑是：activeSection = index + 1。

用户打开页面（在 Intro 部分）：显示 Section 01。

用户滚动经过 第 1 个 H2：index 为 0，activeSection 设置为 1 -> 显示 Section 01。

用户滚动经过 第 2 个 H2：index 为 1，activeSection 设置为 2 -> 显示 Section 02。

结果： 当用户从 Intro 滚动到第一个 H2 下方时，数字不会发生变化。这在视觉上会感觉“坏掉了”或者动画缺失。 建议修复： 通常文章结构是：Intro (Sec 01) -> H2 (开始 Sec 02) -> H2 (开始 Sec 03)。 你应该将逻辑改为 setActiveSection(index + 2)，或者保留 index + 1 但明确只要检测到第一个 H2 离开视口顶部，就进入 Section 02。