# Service Template Style Refactor Playbook

How we moved Service pages from inline/Tailwind-heavy styles to the shared CSS module + utilities architecture. Use this as a reference for other templates.

## Goals
- Unify style source: fonts, colors, spacing from global tokens/utilities.
- Make styles discoverable and scoped: one module per section, plus shared base.
- Preserve visuals: keep critical sizes/animations while moving classes.

## Target Architecture
- Global: tokens + utilities (font-types, containers, etc.).
- Theme-level: `src/styles/4-themes/service.css` (kept for layout/spacing theme vars).
- Per-section CSS modules:
  - `hero-section.module.css`
  - `methodology-section.module.css`
  - `engine-section.module.css`
  - `data-section.module.css`
  - `gallery-section.module.css`
  - `cta-section.module.css`
  - `timeline-section.module.css`
- Shared base module:
  - `service-shared.module.css` (sectionBase*, padLg, light/subtle/dark backgrounds).

## Timeline Section Refactor Notes (实战复盘)
- 主题变量：section 背景/上下 padding 使用 `--service-section` / `--service-section-lg`（定义于 `src/styles/4-themes/service.css`），保持与主题一致。
- 容器与字体：`service-shell`、`font-label-sm`、``、`font-body-base` 继续在 TSX 里直接用全局 utility class，模块不再 `composes` 这些全局样式。
- 模块负责的样式：进度线、节点、布局间距、颜色（使用语义色 `var(--text-strong/sub/muted)`）、内联/桌面断点的 margin/padding、dot 阴影等组件级样式。
- TSX 仍保留的内联：动画 variants、关键渐变/阴影（若与 motion 强绑定）、外部传入的 section 标题 class (`sectionTitleClass`)。
- Props 精简：移除颜色类 props，颜色转为模块内的语义 token，减少 TSX 拼接。
- 断点策略：移动端垂直线在模块内隐藏于 `48em` 以上；桌面进度线仅在断点后显示。

## Step-by-Step Migration
1) **Identify shared patterns**
   - Find repeated section wrappers (min-height, bg, padding) and move to `service-shared.module.css`.
   - Keep global utilities (e.g., `.service-shell`, font type classes) untouched.

2) **Create per-section modules**
   - For each section, create a module file and move structural/layout classes (grids, dividers, media wrappers) into it.
   - Keep font sizing that was inline if it is highly tuned; otherwise rely on font-type utilities.

3) **Swap imports in TSX**
   - Replace `service-template.module.css` imports with section-specific modules and the shared module where needed.
   - Update `className` to combine shared base + section module + existing utilities. Example:
     ```tsx
     import shared from "./service-shared.module.css";
     import styles from "./methodology-section.module.css";

     <section className={`${shared.sectionBase} ${shared.sectionBaseLight}`}>
       <div className={`service-shell ${shared.padLg}`}>
         <div className={styles.methodGrid}>…</div>
       </div>
     </section>
     ```

4) **Preserve behaviors**
   - Keep animation-related classes (`group-hover`, motion variants) in TSX.
   - Retain special sizes (e.g., clamp on hero titles) inline if moving them would risk visual drift.

5) **Remove the monolithic module**
   - Delete `service-template.module.css` after all imports point to the new modules.

6) **Verify**
   - Run lint/build to catch missing imports or class names.
   - Manual QA at key breakpoints: 1024–1599 (laptop protection) and ≥1600 (desktop).

## Checklist for Other Templates
- [ ] Shared base styles extracted (section wrappers, padding).
- [ ] One CSS module per major section; names mirror component files.
- [ ] Global utilities (font types, containers, theme vars) still referenced directly.
- [ ] Animations and special sizing preserved.
- [ ] Old inline/Tailwind reduced to semantic combinations of module classes + utilities.
- [ ] Obsolete monolithic module removed.
- [ ] Lint/build pass; visual check at laptop/desktop breakpoints.
