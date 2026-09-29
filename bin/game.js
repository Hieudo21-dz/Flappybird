const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const pauseBtn = document.getElementById("pauseBtn");

const images = {
    background: loadImage("flappybirdbg.png"),
    bird: loadImage("flappybird.png"),
    topPipe: loadImage("toppipe.png"),
    bottomPipe: loadImage("bottompipe.png")
};

const bird = { x: width / 8, y: height / 2, width: 34, height: 24 };
const birdStartY = bird.y;
const pipes = [];
const pipeWidth = 64;
const pipeHeight = 512;
const velocityX = -4;
const gravity = 1;
let velocityY = 0;
let score = 0;
let highScore = Number(localStorage.getItem("flappyBirdHighScore") || 0);
let gameOver = false;
let paused = false;
let lastPipeTime = 0;
let animationFrame;

function loadImage(source) {
    const image = new Image();
    image.src = source;
    return image;
}

function placePipes() {
    const topY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    const opening = height / 4;
    pipes.push({ x: width, y: topY, width: pipeWidth, height: pipeHeight, image: images.topPipe, passed: false });
    pipes.push({ x: width, y: topY + pipeHeight + opening, width: pipeWidth, height: pipeHeight, image: images.bottomPipe, passed: false });
}

function collides(first, second) {
    return first.x < second.x + second.width &&
        first.x + first.width > second.x &&
        first.y < second.y + second.height &&
        first.y + first.height > second.y;
}

function resetGame() {
    bird.y = birdStartY;
    velocityY = 0;
    score = 0;
    gameOver = false;
    paused = false;
    pipes.length = 0;
    lastPipeTime = performance.now();
}

function flap() {
    if (gameOver) {
        resetGame();
    } else if (!paused) {
        velocityY = -9;
    }
}

function togglePause() {
    if (!gameOver) {
        paused = !paused;
        pauseBtn.textContent = paused ? "Resume" : "Pause";
    }
}

function update(timestamp) {
    if (!paused && !gameOver) {
        velocityY += gravity;
        bird.y += velocityY;
        bird.y = Math.max(bird.y, 0);

        if (timestamp - lastPipeTime >= 1500) {
            placePipes();
            lastPipeTime = timestamp;
        }

        for (const pipe of pipes) {
            pipe.x += velocityX;
            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5;
                pipe.passed = true;
            }
            if (collides(bird, pipe)) {
                endGame();
            }
        }

        if (bird.y > height) {
            endGame();
        }
    }
}

function endGame() {
    gameOver = true;
    highScore = Math.max(highScore, Math.floor(score));
    localStorage.setItem("flappyBirdHighScore", String(highScore));
}

function drawText(text, x, y, size, bold = false) {
    context.font = `${bold ? "bold " : ""}${size}px Arial`;
    context.fillStyle = "white";
    context.fillText(text, x, y);
}

function draw() {
    context.drawImage(images.background, 0, 0, width, height);
    context.drawImage(images.bird, bird.x, bird.y, bird.width, bird.height);
    for (const pipe of pipes) {
        context.drawImage(pipe.image, pipe.x, pipe.y, pipe.width, pipe.height);
    }

    drawText(gameOver ? `Game Over: ${Math.floor(score)}` : String(Math.floor(score)), 10, 35, 32);
    drawText(`Best: ${highScore}`, 10, 58, 18);

    if (paused) {
        context.fillStyle = "rgba(0, 0, 0, 0.6)";
        context.fillRect(0, 0, width, height);
        drawText("Paused", 125, 285, 32, true);
        drawText("Press P or tap to resume", 82, 320, 18);
    } else if (gameOver) {
        drawText("Tap or press Space to restart", 60, 320, 18);
    }
}

function gameLoop(timestamp) {
    update(timestamp);
    draw();
    animationFrame = requestAnimationFrame(gameLoop);
}

canvas.addEventListener("pointerdown", () => {
    if (paused) {
        togglePause();
    } else {
        flap();
    }
});

pauseBtn.addEventListener("click", togglePause);

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        flap();
    } else if (event.code === "KeyP") {
        togglePause();
    }
});

requestAnimationFrame(gameLoop);
