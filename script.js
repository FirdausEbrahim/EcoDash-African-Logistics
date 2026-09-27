let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 140;

class Player {

    constructor(x,y) {
        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 35;

        this.velocityX = 0;
        this.velocityY = 0;
        
        this.angle = 0;
    }

    draw() {
        ctx.save();

        ctx.translate(
            this.x + this.width /2,
            this.y + this.height /2
        );

        ctx.rotate(this.angle);
        ctx.fillStyle = "#7F5539"
        
        ctx.fillRect(
            -this.width /2,
            -this.height /2,
            this.width,
            this.height
        );

        ctx.restore();
    }

    move(){

        if(keys["ArrowLeft"]) {
            this.angle -= turnSpeed;
        }

        if (keys["ArrowRight"]) {
            this.angle += turnSpeed;
        }

        if (keys["ArrowDown"] && batteryLevel > 0) {
            this.velocityX -= Math.cos(this.angle) * acceleration;
            this.velocityY -= Math.sin(this.angle) * acceleration;
        }

        if (keys["ArrowUp"] && batteryLevel > 0) {
             this.velocityX += Math.cos(this.angle) * acceleration;
             this.velocityY += Math.sin(this.angle) * acceleration;
        }

        this.velocityX *= friction;
        this.velocityY *= friction;

        if (this.velocityX > maxSpeed){
            this.velocityX = maxSpeed;
        }

        if (this.velocityX < -maxSpeed){
            this.velocityX = -maxSpeed;
        }

        if (this.velocityY > maxSpeed) {
            this.velocityY = maxSpeed;
        }

        if (this.velocityY < -maxSpeed) {
            this.velocityY = -maxSpeed;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }

        if (this.x + this.width > canvas.width){
            this.x = canvas.width - this.width;
            this.velocityX = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
    }
}

let player = new Player(100, canvas.height /2);

let acceleration = 0.3; 
let friction = 0.95;
let maxSpeed = 6;

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
let potholeHeight = 45;

let wildLifeX = 800;
let wildLifeY = 180;
let wildLifeRadius = 35;

let distanceTravelled = 0;

let score = 0;

let energyUsed = 0;
let energyEfficiency = 0;

let highScore = localStorage.getItem("ecoDashHighScore");

if (highScore == null) {
    highScore = 0;
}
else {
    highScore = Number(highScore);
}

let gameState = "start";

document.getElementById("highScore").textContent = highScore;

let keys = {};

function drawBackground() {
   ctx.fillStyle = "#D8A47F";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSolarZone() {
    ctx.fillStyle = "#F4D35E";
    ctx.fillRect(solarX, solarY, solarWidth, solarHeight);
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Solar Charging point", solarX + 20, solarY + 40);
   }

function drawPothole() {
    ctx.fillStyle = "#4A2C20";

    ctx.fillRect(
        potholeX, potholeY, potholeWidth, potholeHeight);
}

function drawWildLife() {
    ctx.beginPath();
    ctx.arc(wildLifeX, wildLifeY, wildLifeRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#A2674A";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("WildLife", wildLifeX - 20, wildLifeY + 5);
}

function checkWildLifeCollision() {
    let playerCenterX = player.x + player.width /2;
    let playerCenterY = player.y + player.height /2;

    let distanceX = playerCenterX - wildLifeX;
    let distanceY = playerCenterY - wildLifeY;

    let distance = Math.sqrt(
        distanceX * distanceX + 
        distanceY * distanceY
    );

    if (distance < wildLifeRadius + 30) {
       player.velocityX *= 0.2;
       player.velocityY *= 0.2;
    }
}

function checkPotholeCollision(){

    if (
        player.x < potholeX + potholeWidth &&
        player.x + player.width > potholeX &&
        player.y < potholeY + potholeHeight &&
        player.y + player.height > potholeY
    ){
        player.velocityX *= 0.4;
        player.velocityY *= 0.4;
    }
}

function checkChargingZone() {

    if (
        player.x < solarX + solarWidth &&
        player.x + player.width > solarX &&
        player.y < solarY + solarHeight &&
        player.y + player.height > solarY
    ){
        batteryLevel += rechargeRate;
    }

    if (batteryLevel > 100) {
        batteryLevel = 100;
    }

        document.getElementById("battery").textContent =
        Math.round(batteryLevel);

}


function updateBattery() {

        if ((keys["ArrowUp"] || keys["ArrowDown"]) && batteryLevel > 0) {
            batteryLevel -= batteryDrain;
            energyUsed += batteryDrain;
    }

    if (batteryLevel < 0) {
        batteryLevel = 0;
    }

    document.getElementById("battery").textContent = Math.round(batteryLevel);
}

function updateScoreAndDistance() {
    let speed = Math.sqrt(
        player.velocityX * player.velocityX +
        player.velocityY * player.velocityY 
    );

    distanceTravelled += speed * 0.05;
    score = Math.floor(distanceTravelled * 10);
    document.getElementById("distance").textContent = 
        Math.floor(distanceTravelled);

    document.getElementById("score").textContent = score;
}

function updateEfficiency() {
    if (energyUsed > 0) {
    energyEfficiency = distanceTravelled / energyUsed;
}
else {
    energyEfficiency = 0;
}
    document.getElementById("efficiency").textContent =
    energyEfficiency.toFixed(1);
}

function drawStartScreen() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "EcoDash",
        canvas.width /2,
        canvas.height /2 -40
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Press Enter to Start",
        canvas.width /2,
        canvas.height /2 
    );

    ctx.restore();
}

function drawPauseScreen() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Paused",
        canvas.width /2,
        canvas.height /2 
    );

     ctx.font = "18px Arial";

    ctx.fillText(
        "Press P to Continue",
        canvas.width /2,
        canvas.height /2 + 40
    );

    ctx.restore();
}

function drawGameOverScreen() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Game Over!",
        canvas.width /2,
        canvas.height /2 - 40
    );

     ctx.font = "18px Arial";

    ctx.fillText(
        "Final Score: " + score,
        canvas.width /2,
        canvas.height /2
    );
    
    ctx.fillText(
        "Efficiency: " + energyEfficiency.toFixed(1),
        canvas.width /2,
        canvas.height /2 + 30
    );
   
    ctx.fillText(
        "Press R to Restart",
        canvas.width /2,
        canvas.height /2 + 70
    );


    ctx.restore();
}

function checkGameOver() {
    if (batteryLevel <= 0) {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("ecoDashHighScore", highScore);
                document.getElementById("highScore").textContent = highScore;
            }
            gameState = "gameOver";
        }  
    }

function restartGame() {
    player.x = 100;
    player.y = canvas.height /2;

    player.velocityX = 0;
    player.velocityY = 0;

    player.angle = 0;
    batteryLevel = 100;

    distanceTravelled = 0;
    score = 0;

    energyUsed = 0;
    energyEfficiency = 0;

    keys = {};

    document.getElementById("battery").textContent = 100;
    document.getElementById("distance").textContent = 0;
    document.getElementById("score").textContent = 0; 
    document.getElementById("efficiency").textContent = 0;

    gameState = "playing";
}

function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBackground();
drawSolarZone();
drawPothole();
drawWildLife();

if (gameState == "playing") {


    player.move();
    updateBattery();
    updateScoreAndDistance();
    updateEfficiency();
    checkChargingZone();
    checkPotholeCollision();
    checkWildLifeCollision();
    checkGameOver();

}

player.draw();

if (gameState == "start") {
    drawStartScreen();

}

if (gameState == "paused") {
    drawPauseScreen();

}

if (gameState == "gameOver") {
    drawGameOverScreen();

}

requestAnimationFrame(animate);

}

animate();
