// 赛博贪吃蛇 - JavaScript 逻辑入口

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const hiScoreElement = document.getElementById('hi-score');
const levelElement = document.getElementById('level');
const overlay = document.querySelector('.overlay');
const glitchText = document.querySelector('.glitch');
const blinkText = document.querySelector('.blink');

// 游戏配置
const gridSize = 20;
let tileCountX = 30; // 600 / 20
let tileCountY = 20; // 400 / 20

// 游戏状态
let snake = [];
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let score = 0;
let hiScore = localStorage.getItem('cyber-snake-hiscore') || 0;
let level = 1;
let gameSpeed = 150; // 每帧间隔毫秒数
let lastRenderTime = 0;
let gameState = 'START'; // START, PLAYING, PAUSED, GAMEOVER
let animationFrameId;
let nextDx = gridSize;
let nextDy = 0;

// 初始化高分
hiScoreElement.textContent = String(hiScore).padStart(4, '0');

function resizeCanvas() {
    // 保持内部逻辑分辨率为 600x400
    canvas.width = 600;
    canvas.height = 400;
    tileCountX = canvas.width / gridSize;
    tileCountY = canvas.height / gridSize;
}

function initGame() {
    snake = [
        { x: 5 * gridSize, y: 10 * gridSize },
        { x: 4 * gridSize, y: 10 * gridSize },
        { x: 3 * gridSize, y: 10 * gridSize }
    ];
    dx = gridSize;
    dy = 0;
    nextDx = gridSize;
    nextDy = 0;
    score = 0;
    level = 1;
    gameSpeed = 150;
    updateScoreBoard();
    placeFood();
}

function placeFood() {
    let valid = false;
    while (!valid) {
        food.x = Math.floor(Math.random() * tileCountX) * gridSize;
        food.y = Math.floor(Math.random() * tileCountY) * gridSize;
        valid = true;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                valid = false;
                break;
            }
        }
    }
}

function updateScoreBoard() {
    scoreElement.textContent = String(score).padStart(4, '0');
    levelElement.textContent = level;
    if (score > hiScore) {
        hiScore = score;
        localStorage.setItem('cyber-snake-hiscore', hiScore);
        hiScoreElement.textContent = String(hiScore).padStart(4, '0');
    }
}

function showOverlay(title, subtitle) {
    overlay.style.display = 'flex';
    glitchText.textContent = title;
    glitchText.setAttribute('data-text', title);
    blinkText.textContent = subtitle;
}

function hideOverlay() {
    overlay.style.display = 'none';
}

function gameLoop(currentTime) {
    animationFrameId = window.requestAnimationFrame(gameLoop);

    if (gameState !== 'PLAYING') return;

    const secondsSinceLastRender = currentTime - lastRenderTime;
    if (secondsSinceLastRender < gameSpeed) return;

    lastRenderTime = currentTime;

    update();
    draw();
}

function update() {
    // 更新方向
    dx = nextDx;
    dy = nextDy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 碰撞检测：墙壁
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
        return;
    }

    // 碰撞检测：自身
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // 碰撞检测：食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        // 每 50 分升一级，速度加快
        if (score % 50 === 0) {
            level++;
            gameSpeed = Math.max(50, gameSpeed - 15);
        }
        updateScoreBoard();
        placeFood();
    } else {
        snake.pop();
    }
}

function draw() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景 (增强赛博朋克感)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // 绘制食物
    ctx.fillStyle = 'var(--neon-magenta, #f0f)';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'var(--neon-magenta, #f0f)';
    ctx.fillRect(food.x + 2, food.y + 2, gridSize - 4, gridSize - 4);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头
            ctx.fillStyle = 'var(--neon-yellow, #ff0)';
            ctx.shadowColor = 'var(--neon-yellow, #ff0)';
        } else {
            // 蛇身
            ctx.fillStyle = 'var(--neon-cyan, #0ff)';
            ctx.shadowColor = 'var(--neon-cyan, #0ff)';
        }
        ctx.shadowBlur = 10;
        ctx.fillRect(segment.x + 1, segment.y + 1, gridSize - 2, gridSize - 2);
    });
    
    // 重置阴影
    ctx.shadowBlur = 0;
}

function gameOver() {
    gameState = 'GAMEOVER';
    showOverlay('GAME OVER', 'PRESS SPACE TO RESTART');
}

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        showOverlay('PAUSED', 'PRESS P TO RESUME');
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        hideOverlay();
    }
}

// 键盘控制
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy === 0) { nextDx = 0; nextDy = -gridSize; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === 0) { nextDx = 0; nextDy = gridSize; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx === 0) { nextDx = -gridSize; nextDy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === 0) { nextDx = gridSize; nextDy = 0; }
            break;
        case ' ':
            // 空格键：开始或重新开始
            if (gameState === 'START' || gameState === 'GAMEOVER') {
                initGame();
                gameState = 'PLAYING';
                hideOverlay();
            }
            break;
        case 'p':
        case 'P':
            // P键：暂停/继续
            if (gameState === 'PLAYING' || gameState === 'PAUSED') {
                togglePause();
            }
            break;
    }
});

// 初始化
resizeCanvas();
showOverlay('READY', 'PRESS SPACE TO START');
window.requestAnimationFrame(gameLoop);
