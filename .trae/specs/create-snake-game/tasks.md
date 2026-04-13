# Tasks
- [x] Task 1: 初始化项目与环境
  - [x] SubTask 1.1: 使用 vite-init react-ts 模板初始化项目
  - [x] SubTask 1.2: 清理默认模板，配置基础的全局 CSS（包括霓虹发光样式和深色背景）
- [x] Task 2: 实现状态管理与游戏核心逻辑
  - [x] SubTask 2.1: 使用 Zustand 创建 store，包含蛇坐标、方向、食物、分数、游戏状态（开始/暂停/结束）
  - [x] SubTask 2.2: 实现游戏主循环自定义 Hook（移动计算、碰撞检测、吃食物判定）
- [x] Task 3: 构建 UI 组件与渲染层
  - [x] SubTask 3.1: 构建游戏主界面布局（Header、计分板）
  - [x] SubTask 3.2: 构建游戏区域（网格渲染，蛇身与食物的发光渲染）
  - [x] SubTask 3.3: 构建游戏结束与控制面板（霓虹按钮）
- [x] Task 4: 添加交互控制与响应式支持
  - [x] SubTask 4.1: 绑定全局键盘事件（WASD/方向键）控制方向
  - [x] SubTask 4.2: 实现移动端屏幕控制（虚拟方向键）以支持多端游玩

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
