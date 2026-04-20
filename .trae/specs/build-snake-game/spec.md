# 贪吃蛇 Spec

## Why
提供一个可直接在浏览器运行的贪吃蛇小游戏，作为轻量级的交互示例，便于本地打开与二次修改。

## What Changes
- 新增一个独立的前端小游戏目录，包含静态页面与脚本即可运行
- 支持键盘方向键控制、计分、碰撞判定、重新开始
- 提供最小化的可验证逻辑（可在 Node 环境下运行的纯逻辑校验脚本）

## Impact
- Affected specs: 无（新功能）
- Affected code: 新增 `/workspace/snake/` 目录及静态资源

## ADDED Requirements
### Requirement: 贪吃蛇游戏
系统 SHALL 提供一个在浏览器中运行的贪吃蛇游戏页面。

#### Scenario: 正常游玩
- **WHEN** 用户打开页面并按下开始/重新开始
- **THEN** 游戏在固定网格中开始运行，蛇按当前方向移动
- **WHEN** 用户按下方向键（↑↓←→或WASD）
- **THEN** 蛇在下一步移动时改变方向（禁止 180° 直接掉头）
- **WHEN** 蛇头吃到食物
- **THEN** 蛇长度增加 1，分数增加，新的食物生成在空格子

#### Scenario: 失败结束
- **WHEN** 蛇头碰到自身或墙体边界
- **THEN** 游戏进入结束状态并提示分数，用户可重新开始

### Requirement: 运行方式
系统 SHALL 以纯静态资源形式提供游戏（无需构建），可用任意静态服务器运行。

#### Scenario: 本地运行
- **WHEN** 用户在目录内启动静态服务器（例如 `python -m http.server`）
- **THEN** 在浏览器访问后即可开始游戏

## MODIFIED Requirements
无

## REMOVED Requirements
无
