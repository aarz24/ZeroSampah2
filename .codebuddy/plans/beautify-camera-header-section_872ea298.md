---
name: beautify-camera-header-section
overview: Redesign the "Unggah Foto Sampah" header section with centered text, decorative frame, and camera icon pattern background (3 rows, tightly arranged, semi-transparent).
design:
  architecture:
    framework: react
  styleKeywords:
    - Modern Minimalism
    - Geometric Decoration
    - Icon Pattern Background
  fontSystem:
    fontFamily: Inter
    heading:
      size: 20px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#10B981"
    background:
      - "#FFFFFF"
      - "#F9FAFB"
    text:
      - "#111827"
      - "#6B7280"
    functional:
      - "#D1D5DB"
todos:
  - id: add-background-pattern
    content: 在"Unggah Foto Sampah"区块添加3行紧密排列的相机图标背景图案，设置为半透明
    status: completed
  - id: center-align-text
    content: 将标题和描述文字设置为居中对齐
    status: completed
  - id: add-decorative-frame
    content: 在文字周围添加虚线装饰边框和圆角效果
    status: completed
    dependencies:
      - center-align-text
  - id: adjust-spacing
    content: 调整内边距和图标间距，优化视觉平衡
    status: completed
    dependencies:
      - add-decorative-frame
      - add-background-pattern
---

## Product Overview

优化报告页面"Unggah Foto Sampah"区块的视觉呈现，提升用户体验和界面美观度。

## Core Features

- 标题和描述文字居中对齐，提升视觉平衡感
- 在文字周围添加装饰性边框，突出重点内容
- 使用相机图标作为背景装饰图案，排列成紧密的3行网格，半透明显示，营造专业摄影主题氛围

## Tech Stack

- Frontend framework: React + TypeScript + Next.js
- Styling: Tailwind CSS
- Icons: Lucide React (Camera icon)

## Tech Architecture

### System Architecture

本次优化为现有项目的UI改进，仅涉及单个组件的样式调整，不改变整体架构。

### Module Division

- **UI Components Module**: 修改 `src/app/report/page.tsx` 中的相机上传区块组件
- **Styling Module**: 使用 Tailwind CSS 实现居中对齐、装饰边框和背景图案

### Data Flow

无数据流变化，仅涉及UI样式优化。

## Implementation Details

### Core Directory Structure

```
src/
└── app/
    └── report/
        └── page.tsx  # 修改：优化"Unggah Foto Sampah"区块样式（lines 616-628）
```

### Key Code Structures

**相机图标背景图案**: 使用绝对定位创建3行紧密排列的相机图标网格，通过 opacity 和 z-index 实现半透明背景效果。

```
// 背景图案层
<div className="absolute inset-0 overflow-hidden opacity-10">
  {[0, 1, 2].map(row => (
    <div key={row} className="flex justify-center gap-2">
      {[...Array(5)].map((_, i) => (
        <Camera key={i} className="w-8 h-8" />
      ))}
    </div>
  ))}
</div>
```

**装饰边框**: 使用 Tailwind CSS 的 border 和 rounded 类创建美观的边框效果，搭配 padding 确保内容与边框的合理间距。

```
// 内容容器
<div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6">
  {/* 居中文字内容 */}
</div>
```

### Technical Implementation Plan

1. **背景图案实现**

- 策略: 使用绝对定位创建独立背景层，避免影响内容布局
- 关键技术: Flexbox 布局、Array.map 动态渲染、opacity 控制透明度
- 实现步骤:

    1. 创建绝对定位的背景容器
    2. 使用嵌套循环生成3行相机图标网格
    3. 调整 gap 和 opacity 实现紧密排列和半透明效果

- 验证: 背景图案不遮挡文字，视觉层次清晰

2. **文字居中和装饰边框**

- 策略: 使用 Tailwind CSS 的 flexbox 工具类实现居中，border 类创建装饰边框
- 关键技术: text-center、flex items-center、border-dashed
- 实现步骤:

    1. 为标题和描述添加 text-center 类
    2. 为容器添加装饰性虚线边框
    3. 调整 padding 和 rounded 优化视觉效果

- 验证: 文字完全居中，边框美观协调

### Performance Optimization

- 使用 CSS 类而非内联样式，提升渲染性能
- 图标数量控制在合理范围（3行×5列），避免过度渲染

## Design Style

采用现代简约风格，通过几何装饰和图案元素提升视觉层次感。使用虚线边框营造轻松友好的氛围，半透明相机图标背景强化功能主题，同时不干扰主要内容的可读性。

## Page Planning

本次仅优化单个区块（"Unggah Foto Sampah"标题区），不涉及整页设计。

## Block Design

### 相机上传标题区块

- **布局**: 相对定位容器，包含背景图案层和前景内容层
- **背景层**: 绝对定位，3行紧密排列的相机图标（每行5个），半透明显示（opacity: 0.1），使用灰色调
- **内容层**: 居中对齐的标题和描述文字，外围包裹虚线装饰边框（圆角矩形），内边距充足
- **交互**: 静态展示，无交互效果