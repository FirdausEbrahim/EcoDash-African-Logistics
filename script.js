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

let playerAngle = 0;
let turnSpeed = Math.PI / 36;

let batteryLevel = 100;
let batteryDrain = 0.02;

let keys = {};

function drawBackground() {
   ctx.fillStyle = "#d6b87c";
   ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawPlayer() {
    ctx.save();
    ctx.translate(playerX + 30, playerY + 17.5);
    ctx.rotate(playerAngle);
    ctx.fillStyle = "green"; 
    ctx.fillRect(-30, -17.5, 60, 35);
    ctx.restore();
}

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

function movePlayer() {


 if (keys["ArrowLeft"]) {
        playerAngle -= turnSpeed;
    }  

    if (keys["ArrowRight"]) {
        playerAngle += turnSpeed;
    }

    if (keys["ArrowUp"] && batteryLevel > 0) {
      velocityX += Math.cos(playerAngle) * acceleration;
      velocityY += Math.sin(playerAngle) * acceleration;
    }

   if (keys["ArrowDown"] && batteryLevel > 0) {
      velocityX -= Math.cos(playerAngle) * acceleration;
      velocityY -= Math.sin(playerAngle) * acceleration;
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

function updateBattery() {

        if ((keys["ArrowUp"] || keys["ArrowDown"]) && batteryLevel > 0) {
            batteryLevel -= batteryDrain;
    }

    if (batteryLevel < 0) {
        batteryLevel = 0;
    }

    document.getElementById("battery").textContent = Math.round(batteryLevel);
}

function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBackground();
movePlayer();
updateBattery();
drawPlayer();



requestAnimationFrame(animate);

}

animate();