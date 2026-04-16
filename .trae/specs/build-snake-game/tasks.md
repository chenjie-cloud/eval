# Tasks
- [x] Task 1: 初始化项目基础结构：创建 HTML 文件、引入 CSS 样式和 JS 脚本。
  - [x] SubTask 1.1: 编写 index.html，包含游戏画布（canvas）和分数显示。
  - [x] SubTask 1.2: 编写 style.css，实现页面居中、基础美化和游戏结束弹窗样式。
- [x] Task 2: 实现基础渲染与核心数据结构：定义蛇、食物、网格大小，并在画布上绘制它们。
  - [x] SubTask 2.1: 初始化 game.js 中的基础变量（网格大小、蛇的初始坐标、初始食物）。
  - [x] SubTask 2.2: 实现绘制蛇和食物的函数。
- [x] Task 3: 实现游戏主循环与键盘控制。
  - [x] SubTask 3.1: 监听键盘事件（方向键），更新移动方向。
  - [x] SubTask 3.2: 设置定时器（requestAnimationFrame 或 setInterval），使蛇自动按照当前方向移动。
- [x] Task 4: 实现核心游戏逻辑：吃食物、成长、碰撞检测。
  - [x] SubTask 4.1: 实现蛇吃到食物后的身体增长和分数增加。
  - [x] SubTask 4.2: 实现食物被吃掉后在随机位置重新生成的逻辑。
  - [x] SubTask 4.3: 实现碰撞检测（撞墙或撞到自己的身体），触发游戏结束。
- [x] Task 5: 完善游戏流程：开始、结束与重置。
  - [x] SubTask 5.1: 实现游戏结束画面的显示逻辑。
  - [x] SubTask 5.2: 实现点击或按键重新开始游戏的功能。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
- Task 5 depends on Task 4

- [x] Task 6: 修复验证发现的问题
  - [x] SubTask 6.1: 修复 `placeFood()` 逻辑，防止食物生成在新蛇头（即未来的蛇身）上，导致食物被困在蛇体内。
  - [x] SubTask 6.2: 补充实现原 Task 5.2 中的“按键重新开始游戏的功能”（目前仅支持点击）。
