# 贪吃蛇（Snake）小游戏 Spec

## Why
实现一个可在浏览器中运行的经典贪吃蛇小游戏，用于演示基础交互、动画循环与简单状态管理。

## What Changes
- 新增一个可直接打开运行的贪吃蛇网页小游戏（HTML/CSS/JS）
- 支持键盘方向键/WASD 控制
- 支持开始/暂停/重新开始
- 支持计分与最高分（本地存储）
- 支持碰撞检测（撞墙/撞到自己）与游戏结束提示

## Impact
- Affected specs: 浏览器端小游戏、输入控制、渲染循环、状态管理
- Affected code: 新增独立前端文件（不修改既有业务代码）

## ADDED Requirements
### Requirement: Snake Game
系统 SHALL 提供一个可在浏览器中运行的贪吃蛇小游戏。

#### Scenario: 基本游玩（成功）
- **WHEN** 用户打开页面并点击开始（或按空格开始）
- **THEN** 蛇开始移动，用户可使用方向键/WASD 改变方向
- **AND** 蛇吃到食物后长度增加、分数增加、食物重新生成

#### Scenario: 暂停与继续（成功）
- **WHEN** 用户点击暂停（或按空格）
- **THEN** 游戏停止更新；再次触发后继续

#### Scenario: 游戏结束（成功）
- **WHEN** 蛇撞到墙或撞到自身
- **THEN** 游戏结束并显示结果与重新开始入口

#### Scenario: 最高分（成功）
- **WHEN** 游戏结束且本局得分高于历史最高分
- **THEN** 最高分被更新并持久化到本地存储

## MODIFIED Requirements
（无）

## REMOVED Requirements
（无）
