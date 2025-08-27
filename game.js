const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 15, paddleHeight = 100;
const ballSize = 16;

let leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight
};

let rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 6
};

let ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    size: ballSize,
    speedX: 6 * (Math.random() > 0.5 ? 1 : -1),
    speedY: 4 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp paddle within canvas
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Ball movement and collision
function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Wall collision
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Left paddle collision
    if (ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height) {
        ball.speedX = -ball.speedX;
        ball.x = leftPaddle.x + leftPaddle.width; // Prevent sticking
    }

    // Right paddle collision
    if (ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height) {
        ball.speedX = -ball.speedX;
        ball.x = rightPaddle.x - ball.size; // Prevent sticking
    }

    // AI for right paddle
    let target = ball.y + ball.size / 2;
    if (target < rightPaddle.y + rightPaddle.height / 2 - 10) {
        rightPaddle.y -= rightPaddle.speed;
    } else if (target > rightPaddle.y + rightPaddle.height / 2 + 10) {
        rightPaddle.y += rightPaddle.speed;
    }
    // Clamp right paddle
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));

    // Score check (reset if ball goes out)
    if (ball.x < 0 || ball.x > canvas.width) {
        // Reset ball to center
        ball.x = canvas.width / 2 - ballSize / 2;
        ball.y = canvas.height / 2 - ballSize / 2;
        ball.speedX = 6 * (Math.random() > 0.5 ? 1 : -1);
        ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();