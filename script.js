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

let solarX = canvas.width - 180;
let solarY = canvas.height - 120;

let solarWidth = 130;
let solarHeight = 70;

let rechargeRate = 0.08;

let potholeX = 450;
let potholeY = 250;

let potholeWidth = 70;
let potholeheight = 45;

let keys = {};

function drawBackground() {
   ctx.fillStyle = "#D8A47F";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSolarZone() {
    ctx.fillStyle = "#F4D35E";
    ctx.fillRect(solarX, solarY, solarWidth, solarHeight);
    ctx.fillStyle = "black";
    ctx.fillText("Solar Charging point", solarX + 20, solarY + 40);
   }

function drawPothole() {
    ctx.fillStyle = "#4A2C20";

    ctx.fillRect(
        potholeX, potholeY, potholeWidth, potholeheight);
}

function checkPotholeCollision(){

    if (
        playerX < potholeX + potholeWidth &&
        playerX + 60 > potholeX &&
        playerY < potholeY + potholeheight &&
        playerY + 35 > potholeY
    ){
        velocityX *= 0.4;
        velocityY *= 0.4;
    }
}

function checkChargingZone() {

    if (
        playerX < solarX + solarWidth &&
        playerX + 60 > solarX &&
        playerY < solarY + solarHeight &&
        playerY + 35 > solarY
    ){
        batteryLevel += rechargeRate;
    }

    if (batteryLevel > 100) {
        batteryLevel = 100;
    }

        document.getElementById("battery").textContent = Math.round(batteryLevel);

}

function drawPlayer() {
    ctx.save();
    ctx.translate(playerX + 30, playerY + 17.5);
    ctx.rotate(playerAngle);
    ctx.fillStyle = "#7F5539"; 
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
drawSolarZone();
drawPothole();
movePlayer();
updateBattery();
checkChargingZone();
checkPotholeCollision();
drawPlayer();



requestAnimationFrame(animate);

}

animate();