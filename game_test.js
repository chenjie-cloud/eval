
global.document = {
    getElementById: (id) => {
        return {
            getContext: () => ({
                fillRect: () => {},
                clearRect: () => {}
            }),
            width: 400,
            height: 400,
            classList: {
                add: () => {},
                remove: () => {}
            },
            addEventListener: () => {}
        };
    },
    addEventListener: () => {}
};

global.clearInterval = () => {};
global.setInterval = (fn, time) => { return 1; };
global.scoreElement = { innerText: '' };
global.finalScoreElement = { innerText: '' };

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let isGameOver = false;
let changingDirection = false;

function initGame() {
    snake = [
        { x: 10, y: 10 }
    ];
    placeFood();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.innerText = score;
    isGameOver = false;
    changingDirection = false;
    gameOverModal.classList.add('hidden');
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, 100);
    
    draw(); // 绘制初始状态
}

function update() {
    if (isGameOver) return;
    
    // 允许在下一个tick处理新的方向输入
    changingDirection = false;
    
    if (dx === 0 && dy === 0) {
        return; // 初始状态不移动
    }
    
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // 墙壁碰撞检测
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // 检查是否吃到食物
    let ateFood = false;
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        ateFood = true;
    }
    
    // 如果没有吃到食物，移除尾部（模拟移动）
    if (!ateFood) {
        snake.pop();
    }
    
    // 添加新头部
    snake.unshift(head);
    
    // 自身碰撞检测
    let selfCollision = false;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            selfCollision = true;
            break;
        }
    }
    
    if (selfCollision) {
        draw();
        gameOver();
        return;
    }

    // 放置新食物
    if (ateFood) {
        placeFood();
    }
    
    draw();
}

function placeFood() {
    if (snake.length === tileCount * tileCount) {
        // 游戏胜利，不再生成食物
        return;
    }
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // 确保食物不会生成在蛇身上
        let onSnake = false;
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                onSnake = true;
                break;
            }
        }
        if (!onSnake) break;
    }
    food = newFood;
}

function draw() {
    // 清空画布 (使用与CSS相同的背景色)
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    
    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
        // 头部颜色稍浅以示区分
        ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    finalScoreElement.innerText = score;
    gameOverModal.classList.remove('hidden');
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    // 如果游戏结束，按回车或空格重新开始
    if (isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
            initGame();
        }
        return;
    }

    // 阻止方向键默认的滚动行为
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    
    // 防止在一个tick内多次改变方向导致蛇头反向撞击自己
    if (changingDirection) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy === 1 && snake.length > 1) break;
            dx = 0;
            dy = -1;
            changingDirection = true;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === -1 && snake.length > 1) break;
            dx = 0;
            dy = 1;
            changingDirection = true;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx === 1 && snake.length > 1) break;
            dx = -1;
            dy = 0;
            changingDirection = true;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === -1 && snake.length > 1) break;
            dx = 1;
            dy = 0;
            changingDirection = true;
            break;
    }
});

// 重新开始按钮事件
restartBtn.addEventListener('click', initGame);

// 启动游戏
initGame();

console.log("=== Testing eating food ===");
initGame();
food.x = snake[0].x + 1;
food.y = snake[0].y;
dx = 1;
dy = 0;
update();
console.log("Score after eat:", score, "Length:", snake.length);

console.log("=== Testing wall collision ===");
initGame();
snake[0].x = tileCount - 1;
snake[0].y = 5;
dx = 1;
dy = 0;
update();
console.log("isGameOver after hitting wall:", isGameOver);

console.log("=== Testing self collision ===");
initGame();
snake = [{x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5}];
dx = -1; // Moving left, body is on the left! So it will crash into body.
dy = 0;
update();
console.log("isGameOver after crashing into body:", isGameOver);

console.log("=== Testing tail chasing ===");
initGame();
snake = [{x: 5, y: 5}, {x: 4, y: 5}, {x: 4, y: 4}, {x: 5, y: 4}];
// Head is 5,5. Tail is 5,4. 
// Move up (dy=-1). Next head is 5,4, which is the tail!
dx = 0;
dy = -1;
update();
console.log("isGameOver after moving into tail position:", isGameOver);
