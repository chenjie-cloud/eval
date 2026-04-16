const fs = require('fs');

let code = `
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

`;

code += fs.readFileSync('game.js', 'utf8');

code += `
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
`;

fs.writeFileSync('game_test.js', code);
