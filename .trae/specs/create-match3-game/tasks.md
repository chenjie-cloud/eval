# Tasks

- [x] Task 1: 初始化项目与基础设施
  - [x] SubTask 1.1: 创建 React + Vite + Tailwind CSS 项目。
  - [x] SubTask 1.2: 安装必要的依赖，如 `framer-motion` 和 `lucide-react`。
  - [x] SubTask 1.3: 配置全局CSS变量、玻璃质感主题和动态渐变背景动画。

- [x] Task 2: 实现核心游戏逻辑引擎 (Hooks)
  - [x] SubTask 2.1: 实现网格生成算法 `initializeBoard`（确保初始状态无任何可消除的匹配）。
  - [x] SubTask 2.2: 实现消除检测算法 `checkForMatches`（横向和纵向的3连、4连及以上）。
  - [x] SubTask 2.3: 实现方块下落算法 `moveDown` 及顶部新方块生成算法 `fillEmpty`。

- [x] Task 3: 构建基础游戏 UI 组件
  - [x] SubTask 3.1: 创建顶部高颜值计分板（当前分数、最高分展示，霓虹发光文字）。
  - [x] SubTask 3.2: 创建 8x8 游戏面板组件（网格布局、半透明磨砂玻璃质感样式）。
  - [x] SubTask 3.3: 创建方块元素组件，应用 6 种不同的高饱和发光样式和形状/图标。

- [x] Task 4: 实现交互与核心动画系统
  - [x] SubTask 4.1: 实现方块的交换逻辑（点击选中两个相邻方块，或拖拽互换）。
  - [x] SubTask 4.2: 引入 Framer Motion 为方块添加丝滑的交换、下落和复原动画（spring 弹簧物理引擎）。
  - [x] SubTask 4.3: 添加消除时的炸裂缩放特效和得分飘字动画。

- [x] Task 5: 游戏状态机与连环消除处理
  - [x] SubTask 5.1: 整合逻辑与UI，实现完整的连环消除（Combo）循环：消除 -> 下落 -> 再次检测消除，直至稳定。
  - [x] SubTask 5.2: 完善状态锁 `isProcessing`，防止在动画/消除期间玩家乱点导致状态错乱。
  - [x] SubTask 5.3: 实现“重新开始”功能，并保存最高分到 LocalStorage。

- [x] Task 6: 响应式与细节打磨
  - [x] SubTask 6.1: 响应式优化，确保在手机端和桌面端均有完美的视觉呈现和 Touch 事件支持。
  - [x] SubTask 6.2: 最后的样式打磨（阴影、边框透明度、色彩搭配）以达到最高美学标准。

- [ ] Task 7: 修复 Framer Motion 动画问题
  - [ ] SubTask 7.1: 修复方块交换和下落没有滑动动画的问题（需使用 `layoutId` 或将方块改为绝对定位以追踪位置）。
  - [ ] SubTask 7.2: 修复消除时没有炸裂退出动画的问题（需确保 `AnimatePresence` 正确追踪方块组件的挂载/卸载）。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2] and [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]
