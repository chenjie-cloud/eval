# Tasks
- [ ] Task 1: 初始化项目脚手架
  - [ ] 使用 Vite 创建 TypeScript Web 项目并确保可本地启动与构建
  - [ ] 定义基础页面结构与主题样式变量（用于游戏面板与控制区）
- [ ] Task 2: 实现核心游戏引擎（纯逻辑）
  - [ ] 定义网格尺寸、蛇身数据结构、食物生成与随机数策略
  - [ ] 实现 tick 更新：移动、增长、碰撞检测、状态切换
  - [ ] 实现速度/难度参数对 tick 频率的影响
- [ ] Task 3: 实现渲染层（Canvas）
  - [ ] Canvas 尺寸与网格缩放策略（自适应容器但保持像素对齐）
  - [ ] 绘制蛇、食物、背景网格与状态覆盖层（暂停/结束）
- [ ] Task 4: 实现 UI 与交互
  - [ ] 开始、暂停/继续、重新开始按钮
  - [ ] 得分、最高分展示与 localStorage 持久化
  - [ ] 速度/难度选择控件与生效策略
- [ ] Task 5: 输入控制（桌面与移动端）
  - [ ] 键盘：方向键与 WASD
  - [ ] 移动端：滑动手势或方向按钮（实现一种即可，需在 spec 约束内可玩）
  - [ ] 防反向与输入缓冲策略（每 tick 最多接收一次转向）
- [ ] Task 6: 测试与校验
  - [ ] 为核心引擎添加可重复的逻辑测试（例如移动、增长、撞墙/自撞）
  - [ ] 确保 build 与 test 在 CI/无交互环境可运行
- [ ] Task 7: 补充使用说明
  - [ ] 更新 README：本地运行、构建、操作方式与移动端说明

# Task Dependencies
- Task 3 depends on Task 2
- Task 4 depends on Task 2 and Task 3
- Task 5 depends on Task 2
- Task 6 depends on Task 2
- Task 7 depends on Task 1 and Task 4

