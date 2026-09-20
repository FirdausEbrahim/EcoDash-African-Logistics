let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 140;

let playerX = 100;
let playerY = canvas.height / 2;

let velocityX = 0;
let velocityY = 0;

let acceleration = 0.3; 
let friction = 0.95;
let maxSpeed = 6;

let keys = {};

function drawBackground() {
    ctx.fillStyle = "#d6b87c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(playerX, playerY, 60, 35);
}

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

function movePlayer() {


 if (keys["ArrowRight"]) {
        velocityX += acceleration;
    }

    if (keys["ArrowLeft"]) {
        velocityX -= acceleration;
    }

    if (keys["ArrowUp"]) {
      velocityY -= acceleration;
    }

   if (keys["ArrowDown"]) {
      velocityY += acceleration;
   }


velocityX *= friction;
velocityY *= friction;

if (velocityX > maxSpeed) {
    velocityX = maxSpeed;

}

if (velocityX < -maxSpeed) {
    velocityX = -maxSpeed;
    
}

if (velocityY > maxSpeed) {
    velocityY = maxSpeed;
    
}

if (velocityY < -maxSpeed) {
    velocityY = -maxSpeed;
    
}

playerX += velocityX;
playerY += velocityY;

}

function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBackground();
drawPlayer();
movePlayer();

requestAnimationFrame(animate);

}

animate();