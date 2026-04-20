# Tasks
- [x] Task 1: 初始化 Todo 应用目录与页面骨架
  - [x] 创建 /workspace/todo/ 目录结构（index.html、styles.css、app.js）
  - [x] 页面包含标题、输入区、列表区、筛选区与批量操作区

- [x] Task 2: 实现核心数据模型与本地存储
  - [x] 定义 Todo 数据结构（id、title、completed、createdAt、updatedAt）
  - [x] 实现增删改查与状态切换的纯函数/模块
  - [x] 实现 localStorage 读写与容错（空值、坏数据）

- [x] Task 3: 连接 UI 与交互
  - [x] 新增 Todo（按钮与 Enter）
  - [x] 完成/撤销完成
  - [x] 删除 Todo
  - [x] 编辑 Todo（例如双击或“编辑”按钮进入编辑态并保存/取消）

- [x] Task 4: 筛选与批量操作
  - [x] 全部/未完成/已完成筛选
  - [x] 清空已完成
  - [x] 显示未完成计数

- [x] Task 5: 视觉样式与响应式
  - [x] 清晰的完成态样式（划线、淡化等）
  - [x] 移动端可用（窄屏布局不溢出）
  - [x] 交互状态（hover/focus/active）可见

- [x] Task 6: 自动化验证
  - [x] 为数据模型与存储层编写最小单元测试（node 可运行）
  - [x] 增加 README 说明如何启动与运行测试

# Task Dependencies
- Task 3 depends on Task 2
- Task 4 depends on Task 2, Task 3
- Task 5 depends on Task 1, Task 3
- Task 6 depends on Task 2
