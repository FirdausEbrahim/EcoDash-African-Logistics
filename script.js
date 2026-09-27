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

let potholeX = canvas.width * 0.38;
let potholeY = canvas.height * 0.58;

let potholeWidth = 70;
let potholeHeight = 45;

let wildLifeX = canvas.width * 0.70;
let wildLifeY = canvas.height * 0.55;
let wildLifeRadius = 35;

let deliveryX = canvas.width * 0.62;
let deliveryY = canvas.height * 0.72;
let deliveryWidth = 110;
let deliveryHeight = 70;
let deliveries = 0;
let deliveiriesBonus = 0;

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

document.addEventListener("keydown", function(event) {
    keys[event.keys] = true;

    if (event.key == "Enter" && gameState == "start") {
        gameState = "playing";
    }

    if (event.key == "p" || event.key == "P") {
        if (gameState == "playing") {
            gameState = "paused";
        }

        else if (gameState == "paused") {
            gameState = "playing";
        }
    }

    if ((event.key == "r" || event.key == "R") && gameState == "gameOver") {
        restartGame();
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

function drawBackground() {
   ctx.fillStyle = "#D8A47F";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHouse(x, y) {
    //homes
    ctx.fillStyle = "#E9C46A"
    ctx.fillRect(x, y, 90, 65);
    //roof
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 45, y - 40);
    ctx.lineTo(x + 100, y);
    ctx.closePath();

    ctx.fillStyle = "#9C6644";
    ctx.fill();

    //door
    ctx.fillStyle = "#6F4518";
    ctx.fillRect(x + 35, y + 30, 20, 35);

    //windows
    ctx.fillStyle = "#A8DADC";
    ctx.fillRect(x + 10, y + 20, 18, 18);
    ctx.fillRect(x + 63, y + 20, 18, 18);
}

function drawVillage() {
    drawHouse(100, 100);
    drawHouse(300, 130);
    drawHouse(520, 90);

}

function drawTree(x, y) {
    ctx.fillStyle = "#6B4423"
    ctx.fillRect(x, y, 12, 40);
    ctx.beginPath();
    ctx.arc(x + 6, y - 5, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#588157";
    ctx.fill();
}

function drawTrees() {
    drawTree(60, 210);
    drawTree(240, 80);
    drawTree(700, 130);
    drawTree(920, 200);
}

function drawClinic() {
    let clinicX = canvas.width - 190;
    let clinicY = 90;

    ctx.fillStyle ="#F1FAEE";
    ctx.fillRect(clinicX, clinicY, 150, 90);

    ctx.fillStyle = "#457B9D";
    ctx.fillRect(clinicX + 60, clinicY + 50, 30, 40);

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Community Clinic",
        clinicX + 25,
        clinicY + 108
    );

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

function drawDeliveryPoint() {
    ctx.fillStyle = "#6B8E23";
    ctx.fillRect(
        deliveryX,
        deliveryY,
        deliveryWidth,
        deliveryHeight
    );

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Delivery Point",
        deliveryX + 15,
        deliveryY + 40
    );
}

function checkDelivery() {
    
    if (
        player.x < deliveryX + deliveryWidth &&
        player.x + player.width > deliveryX &&
        player.y < deliveryY + deliveryHeight &&
        player.y + player.height > deliveryY 
    ) {
        deliveries += 1;
        deliveiriesBonus += 500;
        document.getElementById("deliveries").textContent =
        deliveries;

        deliveryX = 
        Math.random() * (canvas.width - deliveryWidth);

        deliveryY = 
        Math.random() * (canvas.height - deliveryHeight);
    }
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
    score = Math.floor(distanceTravelled * 10) + deliveiriesBonus;
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

    deliveries = 0;
    deliveiriesBonus = 0;

    energyUsed = 0;
    energyEfficiency = 0;

    keys = {};

    document.getElementById("battery").textContent = 100;
    document.getElementById("distance").textContent = 0;
    document.getElementById("score").textContent = 0; 
    document.getElementById("efficiency").textContent = 0;
    document.getElementById("deliveries").textContent = 0;

    gameState = "playing";
}

function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBackground();
drawVillage();
drawTrees();
drawClinic();
drawSolarZone();
drawPothole();
drawWildLife();
drawDeliveryPoint();

if (gameState == "playing") {


    player.move();
    updateBattery();
    updateScoreAndDistance();
    updateEfficiency();
    checkChargingZone();
    checkPotholeCollision();
    checkWildLifeCollision();
    checkGameOver();
    checkDelivery();

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
