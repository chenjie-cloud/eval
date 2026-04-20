# Tasks
- [x] Task 1: 建立项目骨架与运行入口
  - [x] SubTask 1.1: 新增 `/workspace/snake/` 目录与静态入口（HTML/CSS/JS）
  - [x] SubTask 1.2: 提供本地运行说明（README 或页面内提示）

- [x] Task 2: 实现核心游戏逻辑（可测试）
  - [x] SubTask 2.1: 网格、蛇、食物、方向与步进状态机
  - [x] SubTask 2.2: 碰撞判定（墙体、自身）、得分与重置
  - [x] SubTask 2.3: 生成食物（保证不落在蛇身上）

- [x] Task 3: 实现浏览器渲染与交互
  - [x] SubTask 3.1: Canvas 渲染网格/蛇/食物与分数展示
  - [x] SubTask 3.2: 键盘控制（方向键 + WASD）与防 180° 掉头
  - [x] SubTask 3.3: 开始/暂停/重新开始与结束提示

- [x] Task 4: 增加最小化自动校验与手动验收步骤
  - [x] SubTask 4.1: 添加纯逻辑校验脚本（Node assert，无第三方依赖）
  - [x] SubTask 4.2: 自检：运行校验脚本 + 浏览器冒烟测试

# Task Dependencies
- Task 3 depends on Task 2
- Task 4 depends on Task 2
