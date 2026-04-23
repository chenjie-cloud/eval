const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const startBtn = document.getElementById('startBtn');

// Grid and sizing
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Colors
const snakeHeadColor = '#00ff00';
const snakeBodyColor = '#05d9e8';
const foodColor = '#ff2a6d';

// Game state
let snake = [];
let food = { x: 10, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('neonSnakeHighScore') || 0;
let gameLoop;
let isPlaying = false;
let gameSpeed = 100;
let directionQueue = [];

// Initialize high score display
highScoreElement.textContent = highScore;

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
startBtn.addEventListener('click', startGame);

// Touch/Swipe variables
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

// D-pad controls
document.getElementById('btnUp').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(0, -1); });
document.getElementById('btnDown').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(0, 1); });
document.getElementById('btnLeft').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(-1, 0); });
document.getElementById('btnRight').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(1, 0); });

document.getElementById('btnUp').addEventListener('mousedown', () => changeDirection(0, -1));
document.getElementById('btnDown').addEventListener('mousedown', () => changeDirection(0, 1));
document.getElementById('btnLeft').addEventListener('mousedown', () => changeDirection(-1, 0));
document.getElementById('btnRight').addEventListener('mousedown', () => changeDirection(1, 0));

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    dx = 0;
    dy = -1; // Moving up initially
    directionQueue = [];
    score = 0;
    gameSpeed = 100;
    scoreElement.textContent = score;
    placeFood();
}

function startGame() {
    initGame();
    overlay.classList.add('hidden');
    isPlaying = true;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function gameOver(isWin = false) {
    isPlaying = false;
    clearInterval(gameLoop);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('neonSnakeHighScore', highScore);
        highScoreElement.textContent = highScore;
        overlayTitle.textContent = isWin ? 'YOU WIN! NEW HI-SCORE!' : 'NEW HI-SCORE!';
    } else {
        overlayTitle.textContent = isWin ? 'YOU WIN!' : 'GAME OVER';
    }
    
    startBtn.textContent = 'PLAY AGAIN';
    overlay.classList.remove('hidden');
}

function update() {
    if (directionQueue.length > 0) {
        const nextDir = directionQueue.shift();
        dx = nextDir.dx;
        dy = nextDir.dy;
    }

    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    checkFood();
    draw();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    // Tail removal is handled in checkFood() if food is not eaten
}

function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function checkFood() {
    const head = snake[0];
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        placeFood();
        
        // Slightly increase speed
        if (gameSpeed > 50) {
            clearInterval(gameLoop);
            gameSpeed -= 2;
            gameLoop = setInterval(update, gameSpeed);
        }
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

function placeFood() {
    if (snake.length === tileCount * tileCount) {
        gameOver(true);
        return;
    }

    let newFood;
    let validPlacement = false;
    
    while (!validPlacement) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        validPlacement = true;
        for (let part of snake) {
            if (part.x === newFood.x && part.y === newFood.y) {
                validPlacement = false;
                break;
            }
        }
    }
    
    food = newFood;
}

function draw() {
    // Clear canvas with a slightly transparent black for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw Grid (optional, can be commented out for cleaner look)
    /*
    ctx.strokeStyle = 'rgba(26, 26, 46, 0.5)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=gridSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    */

    // Setup neon glow
    ctx.shadowBlur = 15;
    
    // Draw Food
    ctx.shadowColor = foodColor;
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        const isHead = i === 0;
        const color = isHead ? snakeHeadColor : snakeBodyColor;
        
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        
        // Draw slightly smaller than grid size to see individual segments
        const padding = 1;
        
        if (isHead) {
            // Draw head slightly differently (rounded)
            ctx.beginPath();
            ctx.roundRect(
                snake[i].x * gridSize + padding, 
                snake[i].y * gridSize + padding, 
                gridSize - padding * 2, 
                gridSize - padding * 2,
                5
            );
            ctx.fill();
            
            // Draw eyes
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#000';
            let eyeOffsetX1, eyeOffsetY1, eyeOffsetX2, eyeOffsetY2;
            
            if (dx === 1) { // Right
                eyeOffsetX1 = 12; eyeOffsetY1 = 5; eyeOffsetX2 = 12; eyeOffsetY2 = 13;
            } else if (dx === -1) { // Left
                eyeOffsetX1 = 6; eyeOffsetY1 = 5; eyeOffsetX2 = 6; eyeOffsetY2 = 13;
            } else if (dy === 1) { // Down
                eyeOffsetX1 = 5; eyeOffsetY1 = 12; eyeOffsetX2 = 13; eyeOffsetY2 = 12;
            } else { // Up or default
                eyeOffsetX1 = 5; eyeOffsetY1 = 6; eyeOffsetX2 = 13; eyeOffsetY2 = 6;
            }
            
            ctx.fillRect(snake[i].x * gridSize + eyeOffsetX1, snake[i].y * gridSize + eyeOffsetY1, 3, 3);
            ctx.fillRect(snake[i].x * gridSize + eyeOffsetX2, snake[i].y * gridSize + eyeOffsetY2, 3, 3);
            ctx.shadowBlur = 15; // Reset glow
            
        } else {
            // Draw body
            ctx.fillRect(
                snake[i].x * gridSize + padding, 
                snake[i].y * gridSize + padding, 
                gridSize - padding * 2, 
                gridSize - padding * 2
            );
        }
    }
    
    // Reset shadow for next frame
    ctx.shadowBlur = 0;
}

function handleKeyPress(e) {
    if (!isPlaying) {
        if (e.code === 'Space' || e.code === 'Enter') {
            startGame();
        }
        return;
    }

    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            changeDirection(0, -1);
            break;
        case 'ArrowDown':
        case 'KeyS':
            changeDirection(0, 1);
            break;
        case 'ArrowLeft':
        case 'KeyA':
            changeDirection(-1, 0);
            break;
        case 'ArrowRight':
        case 'KeyD':
            changeDirection(1, 0);
            break;
    }
}

function changeDirection(newDx, newDy) {
    // Prevent moving if game is not playing
    if(!isPlaying) return;

    let lastDir = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : { dx, dy };

    // Prevent 180-degree turns
    if (newDx !== 0 && lastDir.dx !== 0) return;
    if (newDy !== 0 && lastDir.dy !== 0) return;

    directionQueue.push({ dx: newDx, dy: newDy });
}

function handleTouchStart(e) {
    if (e.target === canvas) {
        e.preventDefault(); // Prevent scrolling
    }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!isPlaying) return;
    if (e.target === canvas) {
        e.preventDefault();
    }
    
    if (!touchStartX || !touchStartY) return;

    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;

    let diffX = touchStartX - touchEndX;
    let diffY = touchStartY - touchEndY;

    // Minimum swipe distance
    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            changeDirection(-1, 0); // Left
        } else {
            changeDirection(1, 0); // Right
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            changeDirection(0, -1); // Up
        } else {
            changeDirection(0, 1); // Down
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

// Initial draw
draw();