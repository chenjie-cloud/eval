# 像素风贪吃蛇网页游戏 Spec

## Why
用户需要一个基于Web的贪吃蛇游戏，并且要求具有独特的像素风格（Pixel Art Style）的视觉体验。

## What Changes
- 创建一个全新的Web项目结构，包含HTML, CSS和JavaScript。
- 实现经典的贪吃蛇游戏逻辑（移动、吃食物、变长、死亡判定、计分）。
- 设计并应用统一的像素风格UI/UX，包括字体、颜色、游戏区域和UI组件。
- 增加基础的游戏控制（开始、暂停、重新开始）和状态显示（当前分数、最高分数）。

## Impact
- Affected specs: 无（全新项目）
- Affected code: `/workspace/index.html`, `/workspace/style.css`, `/workspace/script.js`

## ADDED Requirements
### Requirement: 核心游戏逻辑与渲染
系统应提供一个可玩的贪吃蛇游戏，并在网页上渲染出像素风格的画面。

#### Scenario: 游戏循环与操作
- **WHEN** 用户在游戏进行中按下方向键
- **THEN** 蛇改变移动方向，且不能直接反向移动。

#### Scenario: 吃食物与计分
- **WHEN** 蛇头触碰到食物
- **THEN** 蛇身体变长一节，分数增加，并在随机空位置生成新食物。

#### Scenario: 游戏结束
- **WHEN** 蛇头撞墙壁或撞击自己的身体
- **THEN** 游戏结束，显示最终分数，并提供重新开始的选项。

## MODIFIED Requirements
无

## REMOVED Requirements
无