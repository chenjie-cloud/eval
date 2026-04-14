// script.js

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const currentScoreEl = document.getElementById('current-score');
const bestScoreEl = document.getElementById('best-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

// 游戏配置
const gridSize = 20; // 假设canvas是400x400，即20x20的网格
const tileCount = canvas.width / gridSize;
const gameSpeed = 100; // 游戏速度（毫秒）

// 游戏状态变量
let snake = [];
let food = { x: 0, y: 0 };
let dx = 1;
let dy = 0;
let nextDx = 1;
let nextDy = 0;
let score = 0;
let bestScore = 0;
try {
    bestScore = localStorage.getItem('pixelSnakeBestScore') || 0;
} catch (e) {
    console.warn('localStorage is disabled', e);
}
bestScoreEl.textContent = bestScore;

let gameInterval = null;
let isPaused = false;
let isGameOver = false;
let isStarted = false;

// 绘制初始背景
function drawBackground() {
    ctx.fillStyle = '#000'; // 深色背景，与CSS匹配
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 随机生成食物
function spawnFood() {
    if (snake.length >= tileCount * tileCount) {
        return;
    }

    let newFood;
    let isOnSnake;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // 检查是否生成在蛇的身体上
        isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isOnSnake);
    
    food = newFood;
}

// 初始化游戏
function initGame() {
    // 初始化蛇的身体（初始长度为3，头部在左侧向右移动）
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    // 初始化方向向右
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    
    // 初始化得分
    score = 0;
    currentScoreEl.textContent = score;
    
    // 确保最高分正确显示
    try {
        bestScore = localStorage.getItem('pixelSnakeBestScore') || 0;
    } catch (e) {
        console.warn('localStorage is disabled', e);
    }
    bestScoreEl.textContent = bestScore;
    
    // 重置状态
    isPaused = false;
    isGameOver = false;
    isStarted = true;
    
    pauseBtn.textContent = 'PAUSE';
    gameOverScreen.classList.add('hidden');
    
    // 生成第一个食物
    spawnFood();
    
    // 清除可能存在的旧定时器
    if (gameInterval) clearInterval(gameInterval);
    
    // 启动游戏循环
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// 游戏主循环
function gameLoop() {
    if (isPaused || isGameOver) return;
    
    update();
    draw();
}

// 处理游戏结束
function handleGameOver() {
    isGameOver = true;
    isStarted = false;
    clearInterval(gameInterval);
    
    // 更新最高分
    if (score > bestScore) {
        bestScore = score;
        bestScoreEl.textContent = bestScore;
        try {
            localStorage.setItem('pixelSnakeBestScore', bestScore);
        } catch (e) {
            console.warn('localStorage is disabled', e);
        }
    }
    
    // 显示结束面板
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// 更新游戏逻辑
function update() {
    // 应用最新的方向（防止在一次tick内连续变向导致反向咬到自己）
    dx = nextDx;
    dy = nextDy;
    
    // 计算新头部位置
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // 碰撞检测：撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        handleGameOver();
        return;
    }
    
    // 碰撞检测：撞到自己 (不包括当前的尾巴，因为如果不吃食物，尾巴会向前移动)
    for (let i = 0; i < snake.length - 1; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            handleGameOver();
            return;
        }
    }
    
    // 移动：将新头部加入数组
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 得分增加
        score += 10;
        currentScoreEl.textContent = score;
        
        // 实时更新最高分
        if (score > bestScore) {
            bestScore = score;
            bestScoreEl.textContent = bestScore;
            try {
                localStorage.setItem('pixelSnakeBestScore', bestScore);
            } catch (e) {
                console.warn('localStorage is disabled', e);
            }
        }
        
        // 生成新食物
        spawnFood();
    } else {
        // 如果没吃到食物，移除尾部（保持长度不变）
        snake.pop();
    }
}

// 绘制游戏画面
function draw() {
    drawBackground();
    
    if (!isStarted && !isGameOver) {
        // 开始画面提示
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P", cursive';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS START', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // 绘制食物（像素风格：类似一个带有叶子的苹果）
    const fx = food.x * gridSize;
    const fy = food.y * gridSize;
    
    // 苹果红色主体 (占用中间部分，留下边缘空白)
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(fx + 2, fy + 4, 16, 14);
    ctx.fillRect(fx + 4, fy + 2, 12, 16);
    
    // 苹果叶子 (绿色)
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(fx + 10, fy + 2, 4, 4);
    
    // 苹果高光 (浅红色)
    ctx.fillStyle = '#ff9999';
    ctx.fillRect(fx + 4, fy + 6, 4, 4);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        const sx = segment.x * gridSize;
        const sy = segment.y * gridSize;
        
        if (index === 0) {
            ctx.fillStyle = '#4ade80'; // 蛇头亮绿
            ctx.fillRect(sx + 1, sy + 1, gridSize - 2, gridSize - 2);
            
            // 蛇头眼睛
            ctx.fillStyle = '#000';
            if (dx === 1) { // 向右
                ctx.fillRect(sx + 12, sy + 4, 4, 4);
                ctx.fillRect(sx + 12, sy + 12, 4, 4);
            } else if (dx === -1) { // 向左
                ctx.fillRect(sx + 4, sy + 4, 4, 4);
                ctx.fillRect(sx + 4, sy + 12, 4, 4);
            } else if (dy === 1) { // 向下
                ctx.fillRect(sx + 4, sy + 12, 4, 4);
                ctx.fillRect(sx + 12, sy + 12, 4, 4);
            } else if (dy === -1) { // 向上
                ctx.fillRect(sx + 4, sy + 4, 4, 4);
                ctx.fillRect(sx + 12, sy + 4, 4, 4);
            }
        } else {
            ctx.fillStyle = '#22c55e'; // 蛇身暗绿
            // 加入间隙(gap)体现分段，这里绘制比格子稍小的矩形
            ctx.fillRect(sx + 2, sy + 2, gridSize - 4, gridSize - 4);
        }
    });

    if (isPaused) {
        // 绘制半透明黑色遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制暂停文本
        ctx.fillStyle = '#fff';
        ctx.font = '24px "Press Start 2P", cursive';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// 监听键盘事件：控制方向
document.addEventListener('keydown', (e) => {
    // 阻止方向键滚动页面
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) > -1) {
        e.preventDefault();
    }

    // 如果游戏未开始、已暂停或已结束，不响应方向键
    if (!isStarted || isPaused || isGameOver) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            // 只有当当前不在垂直移动时，才能向上移动（防止直接反向）
            if (dy === 0) {
                nextDx = 0;
                nextDy = -1;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === 0) {
                nextDx = 0;
                nextDy = 1;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            // 只有当当前不在水平移动时，才能向左移动
            if (dx === 0) {
                nextDx = -1;
                nextDy = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === 0) {
                nextDx = 1;
                nextDy = 0;
            }
            break;
    }
});

// 绑定按钮事件
startBtn.addEventListener('click', () => {
    // 点击开始按钮始终重新开始游戏
    initGame();
});

pauseBtn.addEventListener('click', () => {
    if (!isStarted || isGameOver) return;
    
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'RESUME' : 'PAUSE';
    
    // 如果暂停或恢复，都立即重绘一次以显示或隐藏暂停画面
    draw();
});

// 初始状态下绘制一次画面（显示 PRESS START）
// 这里稍微延迟一点点，以确保字体加载完成（如果有更好的字体加载检测机制更好，这里简单处理）
document.fonts.ready.then(() => {
    draw();
});
