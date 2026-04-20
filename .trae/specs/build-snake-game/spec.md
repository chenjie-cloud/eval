# 贪吃蛇（Web）Spec

## Why
用户需要一个可直接在浏览器运行的贪吃蛇小游戏，用于快速试玩与演示。

## What Changes
- 新增一个纯前端的贪吃蛇小游戏（HTML/CSS/JS），可本地静态打开或通过任意静态服务器访问
- 提供开始/暂停、重新开始、分数显示与基础难度变化

## Impact
- Affected specs: 浏览器端小游戏、输入控制、渲染循环
- Affected code: 新增目录 /workspace/snake/*

## ADDED Requirements
### Requirement: Snake Game
系统 SHALL 在浏览器中提供可玩的贪吃蛇游戏。

#### Scenario: Success case
- **WHEN** 用户打开游戏页面
- **THEN** 页面展示游戏画布、分数与控制按钮，并可开始游戏

#### Scenario: Movement
- **WHEN** 用户按下方向键（或 WASD）
- **THEN** 蛇改变移动方向且不会立即反向

#### Scenario: Eat food
- **WHEN** 蛇头与食物重合
- **THEN** 分数增加、蛇增长、刷新新的食物位置（不与蛇身重叠）

#### Scenario: Game over
- **WHEN** 蛇撞到边界或自身
- **THEN** 游戏停止并提示结束，用户可重新开始

#### Scenario: Pause/Resume
- **WHEN** 用户点击暂停/继续
- **THEN** 游戏渲染与移动按状态停止/恢复

## MODIFIED Requirements
无

## REMOVED Requirements
无

