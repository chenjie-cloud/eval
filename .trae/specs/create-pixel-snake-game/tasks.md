# Tasks
- [x] Task 1: 初始化项目结构与UI布局: 创建基础的HTML和CSS文件，设置像素风格的样式。
  - [x] SubTask 1.1: 创建 `index.html`，搭建游戏容器、得分面板和控制按钮。
  - [x] SubTask 1.2: 创建 `style.css`，引入像素字体，设置像素风格的配色方案和布局。
- [x] Task 2: 实现核心游戏逻辑: 编写JavaScript以处理游戏状态和渲染。
  - [x] SubTask 2.1: 创建 `script.js`，初始化Canvas或DOM网格以渲染游戏画面。
  - [x] SubTask 2.2: 实现蛇的移动、方向控制和键盘事件监听。
  - [x] SubTask 2.3: 实现食物生成逻辑和碰撞检测（吃食物变长、撞墙或撞自己结束游戏）。
- [x] Task 3: 完善游戏流程与细节: 添加计分系统、游戏状态控制和视觉反馈。
  - [x] SubTask 3.1: 实现分数和最高分数的计算与本地存储。
  - [x] SubTask 3.2: 完善开始、暂停、游戏结束界面的逻辑。
  - [x] SubTask 3.3: 优化像素风格细节，如蛇身分段绘制、简单的像素风音效或动画效果。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2

- [x] Task 4: Fix infinite loop on win: Handle the edge case in `spawnFood()` when the snake occupies the entire grid to prevent browser freeze.
- [x] Task 5: Fix local storage crash: Wrap `localStorage.getItem` and `setItem` in `try...catch` blocks to prevent the script from crashing in environments where storage is disabled.