const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const unitSize = 25;

let boardBackground = "white";
let snakeColor = "black";
let snakeBorder = "lightcoral";
let foodColor = "red";

let running = false;
let gameStarted = false;
let xVelocity = unitSize;
let yVelocity = 0;
let nextXVelocity = xVelocity;
let nextYVelocity = yVelocity;

let foodX;
let foodY;
let score = 0;

let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];


window.addEventListener("keydown", startOrChangeDirection);
resetBtn.addEventListener("click", resetGame);


drawBoard();
drawSnake();
createFood();
drawFood();
displayStartMessage();



function startOrChangeDirection(event) {
    event.preventDefault();
    const keyPressed = event.key;

   
    if (!gameStarted && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(keyPressed)) {
        gameStarted = true;
        running = true;
        nextTick();
    }

    changeDirection(event);
}

function gameStart() {
    running = true;
    gameStarted = false; 
    score = 0;
    scoreText.textContent = score;

   
    xVelocity = unitSize;
    yVelocity = 0;
    nextXVelocity = xVelocity;
    nextYVelocity = yVelocity;

    
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];

    drawBoard();
    drawSnake();
    createFood();
    drawFood();
    displayStartMessage();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            drawBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    } else {
        displayGameOver();
    }
}

function drawBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    
    xVelocity = nextXVelocity;
    yVelocity = nextYVelocity;

    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);


    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeRect(part.x, part.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    event.preventDefault();
    const keyPressed = event.key;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === "ArrowLeft" && !goingRight):
            nextXVelocity = -unitSize;
            nextYVelocity = 0;
            break;
        case (keyPressed === "ArrowUp" && !goingDown):
            nextXVelocity = 0;
            nextYVelocity = -unitSize;
            break;
        case (keyPressed === "ArrowRight" && !goingLeft):
            nextXVelocity = unitSize;
            nextYVelocity = 0;
            break;
        case (keyPressed === "ArrowDown" && !goingUp):
            nextXVelocity = 0;
            nextYVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    const head = snake[0];

    
    if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight) {
        running = false;
        gameStarted = false;
    }

    
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            running = false;
            gameStarted = false;
        }
    }

   
    if (!running) {
        drawBoard();
        drawFood();
        drawSnake();
       // displayStartMessage();
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2 - 20);
    resetMessage(); 
}

function displayStartMessage() {
    ctx.font = "20px MV Boli";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.fillText("Press any arrow key to start", gameWidth / 2, gameHeight / 2 + 20);
}

function resetMessage() {
    ctx.font = "20px MV Boli";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.fillText("Press the reset button to start again", gameWidth / 2, gameHeight / 2 + 20);
}
function resetGame() {
    gameStart();
}

