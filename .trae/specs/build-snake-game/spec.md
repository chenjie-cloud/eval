# 贪吃蛇游戏 Spec

## Why
用户希望在浏览器中玩一个经典的贪吃蛇游戏。

## What Changes
- 创建一个基于 Web 技术（HTML/CSS/JS）的贪吃蛇游戏。
- 包含完整的游戏循环、分数统计、碰撞检测和重新开始功能。

## Impact
- Affected specs: 游戏渲染、按键控制、碰撞逻辑
- Affected code: `index.html`, `style.css`, `game.js`

## ADDED Requirements
### Requirement: 游戏界面
系统应提供一个居中的游戏画布，显示当前分数和游戏状态（进行中、游戏结束）。

#### Scenario: 游戏启动
- **WHEN** 用户打开页面
- **THEN** 显示游戏初始界面，等待用户按键开始游戏。

### Requirement: 蛇的移动与控制
系统应允许用户通过方向键（上下左右）控制蛇的移动方向。

#### Scenario: 改变方向
- **WHEN** 用户按下与当前移动方向不平行的方向键
- **THEN** 蛇转向新的方向移动。

### Requirement: 碰撞检测与成长
系统应检测蛇头与食物、墙壁或自身的碰撞。

#### Scenario: 吃到食物
- **WHEN** 蛇头坐标与食物坐标重合
- **THEN** 蛇的长度增加，分数增加，并在画布上的随机空闲位置生成新的食物。

#### Scenario: 游戏结束
- **WHEN** 蛇头超出画布边界或与蛇身重合
- **THEN** 停止游戏循环，显示游戏结束提示和最终分数，并提供重新开始选项。
