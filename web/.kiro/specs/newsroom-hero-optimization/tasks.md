# Implementation Plan: Newsroom Hero Section Optimization

## Overview

将 Newsroom 页面的 Hero Section 从头条新闻展示转变为纯品牌展示区域。主要工作包括重构 HeroSection 组件、添加多语言 tagline、添加滚动提示、更新父组件 props。

## Tasks

- [ ] 1. 添加多语言 tagline 配置
  - 在 `messages/en.json` 添加 `newsroom_hero_tagline` 
  - 在 `messages/zh.json` 添加对应中文翻译
  - _Requirements: 3.1, 3.2_

- [ ] 2. 重构 HeroSection 组件
  - [ ] 2.1 移除新闻数据依赖
    - 修改 HeroSection props，移除 `post` 和 `readFeaturedLabel`
    - 只保留 `locale` prop
    - 移除 Link 包装，使 hero 不可点击
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.2_

  - [ ] 2.2 更新背景图片配置
    - 使用静态背景图片路径 `/images/newsroom.jpg`
    - 保留 Next.js Image 组件和 priority 加载
    - 添加图片加载失败的 fallback 渐变背景
    - _Requirements: 2.2, 6.1, 6.4_

  - [ ] 2.3 简化内容区域
    - 保留 "Newsroom" 大标题
    - 添加 tagline 副标题（使用 paraglide 多语言）
    - 移除 category badge、tags、date、subtitle、Read More CTA
    - _Requirements: 2.1, 3.1_

  - [ ] 2.4 添加滚动提示组件
    - 在 hero 底部添加 scroll indicator
    - 使用 CSS 动画实现上下浮动效果
    - _Requirements: 4.2, 4.4_

  - [ ] 2.5 保留并优化动画效果
    - 保留背景图片的 zoom 入场动画
    - 保留标题的 fade-in 动画
    - 为 tagline 添加 staggered fade-in 动画
    - _Requirements: 2.5, 3.4, 6.3_

- [ ] 3. 更新响应式样式
  - 调整 hero 高度：mobile 50vh, tablet 60vh, desktop 70vh
  - 确保 tagline 在移动端可读
  - 调整 scroll indicator 在不同设备上的位置
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 4. 更新父组件和数据流
  - [ ] 4.1 更新 NewsroomPageClient
    - 修改 HeroSection 调用，传入 locale 而非 post
    - 移除 heroPost 相关逻辑
    - _Requirements: 6.2_

  - [ ] 4.2 更新 NewsListView
    - 移除 featuredNews prop
    - 调整 listWithoutHero 逻辑（不再需要排除 hero post）
    - _Requirements: 6.2_

  - [ ] 4.3 更新 page.tsx 服务端组件
    - 移除 FEATURED_NEWS_QUERY 的 fetch
    - 更新 NewsroomPageClient props
    - _Requirements: 6.2_

- [ ] 5. Checkpoint - 验证基本功能
  - 确保页面正常渲染
  - 确保 hero section 显示正确
  - 确保 newsfeed 显示所有新闻（不再排除 featured）
  - 确保多语言切换正常

- [ ]* 6. 编写单元测试
  - [ ]* 6.1 测试 HeroSection 不包含新闻元素
    - **Property 1: Hero Section 不包含新闻数据元素**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

  - [ ]* 6.2 测试 HeroSection 不可点击
    - **Property 2: Hero Section 不可点击导航**
    - **Validates: Requirements 1.5**

  - [ ]* 6.3 测试核心元素存在
    - **Property 3: 核心视觉元素存在性**
    - **Validates: Requirements 2.1, 3.1, 4.2**

- [ ] 7. Final checkpoint - 完成验证
  - 确保所有测试通过
  - 验证响应式布局
  - 验证动画效果
  - 如有问题请询问用户

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 背景图片使用现有的 `/images/newsroom.jpg`，如需更换可后续调整
- Scroll indicator 可复用现有的 `src/components/sections/scroll-prompt.tsx` 组件
- 动画使用 Framer Motion (m from lazy-motion) 保持与现有代码一致
