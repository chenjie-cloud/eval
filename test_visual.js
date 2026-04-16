const tileCount = 5;
let snake = [{x: 2, y: 2}];
let dx = 1;
let dy = 0;
let head = {x: 3, y: 2};
let food = {x: 3, y: 2};

// force random to return the head's coordinates
Math.random = function() {
    if (!this.called) {
        this.called = true;
        return 3 / tileCount; // x = 3
    }
    return 2 / tileCount; // y = 2
};

function placeFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
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

// simulate eating food
placeFood();
let ateFood = true;

if (!ateFood) {
    snake.pop();
}
snake.unshift(head);

console.log("Tick 1 ends. Snake:", JSON.stringify(snake), "Food:", food);

// Tick 2
dx = 1;
dy = 0;
head = {x: snake[0].x + dx, y: snake[0].y + dy}; // {x: 4, y: 2}

ateFood = false;
if (head.x === food.x && head.y === food.y) {
    ateFood = true;
}

if (!ateFood) {
    snake.pop();
}
snake.unshift(head);

console.log("Tick 2 ends. Snake:", JSON.stringify(snake), "Food:", food);
// Check if food is inside snake
let foodInsideSnake = false;
for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
        foodInsideSnake = true;
    }
}
console.log("Is food inside snake body?", foodInsideSnake);
