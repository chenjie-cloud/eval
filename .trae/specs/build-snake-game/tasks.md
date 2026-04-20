# Tasks
- [ ] Task 1: 建立项目骨架（纯静态）
  - [ ] 创建 /workspace/snake 目录结构与基础页面（index.html、style.css、main.js）
  - [ ] 页面包含画布、分数面板、开始/暂停、重新开始按钮

- [ ] Task 2: 实现核心游戏逻辑
  - [ ] 网格化地图与渲染循环（requestAnimationFrame 或定时步进）
  - [ ] 蛇的数据结构、移动规则与方向锁（禁止立即反向）
  - [ ] 食物生成（不与蛇重叠）
  - [ ] 碰撞检测（边界/自身）与 game over 状态

- [ ] Task 3: 实现交互与体验
  - [ ] 键盘控制（方向键 + WASD）
  - [ ] 开始/暂停/重新开始按钮逻辑与状态显示
  - [ ] 难度变化：随分数提高移动速度（或缩短步进间隔）

- [ ] Task 4: 自检与运行方式
  - [ ] 增加最小自检脚本或说明：如何本地启动静态服务并试玩
  - [ ] 进行一次端到端试玩自检（移动、吃食物、死亡、暂停）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 1, Task 2, Task 3

