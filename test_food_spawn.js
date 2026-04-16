const tileCount = 20;
let snake = [{x: 10, y: 10}];
let head = {x: 11, y: 10};
let food = {x: 11, y: 10};

// Mock Math.random to always return the food's coordinate once
let randomCalls = 0;
Math.random = function() {
    randomCalls++;
    if (randomCalls === 1) return 11 / tileCount; // x
    if (randomCalls === 2) return 10 / tileCount; // y
    // if loop continues, pick something else
    if (randomCalls === 3) return 0;
    if (randomCalls === 4) return 0;
    return 0;
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

placeFood();
console.log("Food placed at:", food);
console.log("New head will be at:", head);
if (food.x === head.x && food.y === head.y) {
    console.log("BUG: Food spawned at the new head position!");
}
