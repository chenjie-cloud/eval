# Tasks
- [x] Task 1: 项目初始化与配置: 使用 Vite 创建 React + TailwindCSS 项目。
  - [x] SubTask 1.1: 执行 vite 初始化命令并安装依赖
  - [x] SubTask 1.2: 配置 TailwindCSS 及自定义霓虹主题颜色
  - [x] SubTask 1.3: 引入特色字体（如 Google Fonts 上的复古字体）
- [x] Task 2: 游戏核心逻辑实现 (Hooks): 编写管理游戏状态的自定义 Hook。
  - [x] SubTask 2.1: 定义网格、蛇的初始状态和食物生成逻辑
  - [x] SubTask 2.2: 实现游戏循环（使用 `requestAnimationFrame` 或 `setInterval`）和碰撞检测
  - [x] SubTask 2.3: 实现键盘事件监听，控制移动方向
- [x] Task 3: 游戏 UI 组件开发: 开发符合复古霓虹美学的视觉组件。
  - [x] SubTask 3.1: 开发顶部计分板和标题栏
  - [x] SubTask 3.2: 开发游戏网格和蛇身/食物的渲染逻辑（使用 CSS 阴影实现霓虹发光）
  - [x] SubTask 3.3: 开发游戏结束/开始的 Overlay 覆盖层
- [x] Task 4: 整合与视觉打磨: 将逻辑与 UI 结合，添加动画细节。
  - [x] SubTask 4.1: 整合组件，确保游戏流程顺畅（开始 -> 游玩 -> 结束 -> 重玩）
  - [x] SubTask 4.2: 增加食物的呼吸动画和得分的视觉反馈

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]