# Tasks
- [ ] Task 1: 生成最小可运行的贪吃蛇页面骨架
  - [ ] SubTask 1.1: 确定渲染方式（Canvas）与网格尺寸、像素比例
  - [ ] SubTask 1.2: 实现基础页面结构与样式（画布、按钮、分数区）
  - [ ] SubTask 1.3: 提供本地开发启动方式（可选）与直接打开运行方式

- [ ] Task 2: 实现核心游戏逻辑
  - [ ] SubTask 2.1: 实现蛇的数据结构、移动与转向规则（防 180 度掉头）
  - [ ] SubTask 2.2: 实现食物生成（避开蛇身）与吃到后增长
  - [ ] SubTask 2.3: 实现得分、速度步进与游戏循环（requestAnimationFrame/定时步进）

- [ ] Task 3: 实现交互与状态
  - [ ] SubTask 3.1: 键盘方向键/WASD 控制
  - [ ] SubTask 3.2: 开始/暂停/重新开始（按钮 + 空格）
  - [ ] SubTask 3.3: 游戏结束提示与重开入口

- [ ] Task 4: 最高分持久化与基础可用性打磨
  - [ ] SubTask 4.1: 使用 localStorage 保存/读取最高分
  - [ ] SubTask 4.2: 适配不同窗口大小的居中展示（不要求响应式复杂布局）
  - [ ] SubTask 4.3: 基础可用性检查（不会卡死、不会生成无解食物）

- [ ] Task 5: 验证与简单测试
  - [ ] SubTask 5.1: 增加最小的逻辑自测（例如：食物不会生成在蛇身上）
  - [ ] SubTask 5.2: 运行一次构建/静态检查（如项目已有工具）或用脚本校验无语法错误

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
- Task 5 depends on Task 1, Task 2, Task 3, Task 4
