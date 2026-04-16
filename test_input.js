let dx = 1;
let dy = 0;
let snake = [1, 2];
let changingDirection = false;

function keydown(key) {
    if (changingDirection) return;
    switch (key) {
        case 'ArrowUp':
            if (dy === 1 && snake.length > 1) break;
            dx = 0;
            dy = -1;
            changingDirection = true;
            break;
        case 'ArrowRight':
            if (dx === -1 && snake.length > 1) break;
            dx = 1;
            dy = 0;
            changingDirection = true;
            break;
    }
}

// Tick starts
changingDirection = false;
keydown('ArrowRight');
console.log("After ArrowRight: dx=", dx, "dy=", dy, "changingDirection=", changingDirection);
keydown('ArrowUp');
console.log("After ArrowUp: dx=", dx, "dy=", dy, "changingDirection=", changingDirection);
