let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 140;

class Drone {

    constructor(x, y) {
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
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        ctx.rotate(this.angle);

        // Drone arms
        ctx.strokeStyle = "#3B2A24";
        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(-12, -7);
        ctx.lineTo(-28, -20);

        ctx.moveTo(12, -7);
        ctx.lineTo(28, -20);

        ctx.moveTo(-12, 7);
        ctx.lineTo(-28, 20);

        ctx.moveTo(12, 7);
        ctx.lineTo(28, 20);

        ctx.stroke();

        // Drone body
        ctx.fillStyle = "#7F5539";

        ctx.fillRect(
            -18,
            -10,
            36,
            20
        );

        // Rotors
        ctx.fillStyle = "#2F3E46";

        ctx.beginPath();
        ctx.arc(-28, -20, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(28, -20, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-28, 20, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(28, 20, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    move() {

        if (keys["ArrowLeft"]) {
            this.angle -= turnSpeed;
        }

        if (keys["ArrowRight"]) {
            this.angle += turnSpeed;
        }

        if (keys["ArrowUp"] && batteryLevel > 0) {
            this.velocityX += Math.cos(this.angle) * acceleration;
            this.velocityY += Math.sin(this.angle) * acceleration;
        }

        if (keys["ArrowDown"] && batteryLevel > 0) {
            this.velocityX -= Math.cos(this.angle) * acceleration;
            this.velocityY -= Math.sin(this.angle) * acceleration;
        }


        this.velocityX *= friction;
        this.velocityY *= friction;

        if (this.velocityX > maxSpeed) {
            this.velocityX = maxSpeed;
        }

        if (this.velocityX < -maxSpeed) {
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

        if (this.x + this.width > canvas.width) {
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

class Bird {

    constructor(x, y, width, height, speed) {

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.speed = speed;

        this.color = ["brown", "black", "grey"][
            Math.floor(Math.random() * 3)
        ];
    }


    update() {

        this.x += this.speed;

        this.y +=
            Math.sin(
                Date.now() * 0.002 +
                this.x * 0.01
            ) * 0.5;


        if (
            this.speed > 0 &&
            this.x > canvas.width + this.width
        ) {

            this.x = -this.width;

            this.y =
                80 + Math.random() * 250;
        }

        else if (
            this.speed < 0 &&
            this.x < -this.width
        ) {

            this.x =
                canvas.width + this.width;

            this.y =
                80 + Math.random() * 250;
        }
    }


    draw() {

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );


        // Bird body
        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            12,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Wings
        let flap =
            Math.sin(Date.now() * 0.02) * 8;

        ctx.strokeStyle = "#5C4033";
        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(-5, 0);
        ctx.lineTo(-15, flap);

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(5, 0);
        ctx.lineTo(15, flap);

        ctx.stroke();


        // Beak
        ctx.fillStyle = "orange";

        ctx.beginPath();

        ctx.moveTo(12, 0);
        ctx.lineTo(18, -2);
        ctx.lineTo(18, 2);

        ctx.closePath();

        ctx.fill();


        ctx.restore();
    }


    collides(drone) {

        let droneCenterX =
            drone.x + drone.width / 2;

        let droneCenterY =
            drone.y + drone.height / 2;


        let dx =
            droneCenterX - this.x;

        let dy =
            droneCenterY - this.y;


        let distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        return distance < 30;
    }
}

let birds = [];

for (let i = 0; i < 5; i++) {

    birds.push(

        new Bird(

            Math.random() * canvas.width,

            80 + Math.random() * 250,

            40,

            20,

            Math.random() > 0.5
                ? 2 + Math.random() * 2
                : -(2 + Math.random() * 2)

        )

    );
}

let drone = new Drone(100, canvas.height / 2);

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

let deliveryX = canvas.width * 0.62;
let deliveryY = canvas.height * 0.72;
let deliveryWidth = 110;
let deliveryHeight = 70;
let deliveries = 0;
let deliveiriesBonus = 0;
let wasInDeliveryPoint = false;

let distanceTravelled = 0;

let score = 0;

let energyUsed = 0;
let energyEfficiency = 0;

let windStrength = 0.015;
let rainActive = true;

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

let audioContext;

document.addEventListener("keydown", function (event) {
    keys[event.code] = true;


    if (
        event.code == "ArrowUp" ||
        event.code == "ArrowDown" ||
        event.code == "ArrowLeft" ||
        event.code == "ArrowRight"
    ) {
        event.preventDefault();
    }

    if (event.code == "Enter" && gameState == "start") {

        if (!audioContext) {
            audioContext =
                new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state == "suspended") {
            audioContext.resume();
        }

        gameState = "playing";
    }

    if (event.code == "KeyP") {

        if (gameState == "playing") {
            gameState = "paused";
        }

        else if (gameState == "paused") {
            gameState = "playing";
        }
    }

    if (event.code == "KeyR" && gameState == "gameOver") {
        restartGame();
    }
});

document.addEventListener("keyup", function (event) {
    keys[event.code] = false;
});

function drawBackground() {
    ctx.fillStyle = "#D8A47F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDustyRoad() {

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(
        -50,
        canvas.height * 0.75
    );

    ctx.bezierCurveTo(
        canvas.width * 0.25,
        canvas.height * 0.55,

        canvas.width * 0.55,
        canvas.height * 0.85,

        canvas.width + 50,
        canvas.height * 0.65
    );

    ctx.strokeStyle = "#B08968";
    ctx.lineWidth = 130;
    ctx.lineCap = "round";

    ctx.stroke();

    ctx.restore();
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
    drawHouse(530, 415);
    drawHouse(330, 375);
    drawHouse(130, 400);
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

    ctx.fillStyle = "#F1FAEE";
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

function playSound(frequency, duration) {

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

    }

    let oscillator = audioContext.createOscillator();
    let gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(
        audioContext.currentTime + duration
    );
}

function checkDelivery() {

    let insideDeliveryPoint =

        drone.x < deliveryX + deliveryWidth &&
        drone.x + drone.width > deliveryX &&
        drone.y < deliveryY + deliveryHeight &&
        drone.y + drone.height > deliveryY;

    if (insideDeliveryPoint && wasInDeliveryPoint == false) {

        deliveries += 1;

        deliveiriesBonus += 500;

        document.getElementById("deliveries").textContent =
            deliveries;

        playSound(700, 0.2);
    }

    wasInDeliveryPoint = insideDeliveryPoint;
}


function checkChargingZone() {

    if (
        drone.x < solarX + solarWidth &&
        drone.x + drone.width > solarX &&
        drone.y < solarY + solarHeight &&
        drone.y + drone.height > solarY
    ) {
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
        drone.velocityX * drone.velocityX +
        drone.velocityY * drone.velocityY
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
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Press Enter to Start",
        canvas.width / 2,
        canvas.height / 2
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
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Press P to Continue",
        canvas.width / 2,
        canvas.height / 2 + 40
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
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Final Score: " + score,
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.fillText(
        "Efficiency: " + energyEfficiency.toFixed(1),
        canvas.width / 2,
        canvas.height / 2 + 30
    );

    ctx.fillText(
        "Press R to Restart",
        canvas.width / 2,
        canvas.height / 2 + 70
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
        playSound(200, 0.5);
        gameState = "gameOver";
    }
}

function restartGame() {
    drone.x = 100;
    drone.y = canvas.height / 2;

    drone.velocityX = 0;
    drone.velocityY = 0;

    drone.angle = 0;
    batteryLevel = 100;

    distanceTravelled = 0;
    score = 0;

    deliveries = 0;
    deliveiriesBonus = 0;

    energyUsed = 0;
    energyEfficiency = 0;

    wasInDeliveryPoint = false;

    keys = {};

    document.getElementById("battery").textContent = 100;
    document.getElementById("distance").textContent = 0;
    document.getElementById("score").textContent = 0;
    document.getElementById("efficiency").textContent = 0;
    document.getElementById("deliveries").textContent = 0;

    gameState = "playing";
}

function applyWind() {

    drone.velocityX += windStrength;
}

function drawRainEffect() {

    if (rainActive == true) {

        ctx.fillStyle = "rgba(70, 90, 110, 0.15)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}

function updateBirds() {

    birds.forEach(function (bird) {

        bird.update();

        bird.draw();


        if (
            gameState == "playing" &&
            bird.collides(drone)
        ) {

            playSound(200, 0.5);


            if (score > highScore) {

                highScore = score;

                localStorage.setItem(
                    "ecoDashHighScore",
                    highScore
                );

                document.getElementById(
                    "highScore"
                ).textContent = highScore;
            }


            gameState = "gameOver";
        }

    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawDustyRoad();
    drawVillage();
    drawTrees();
    drawClinic();
    drawSolarZone();
    drawDeliveryPoint();
    

    if (gameState == "playing") {

        updateBirds();
        drone.move();
        applyWind();
        updateBattery();
        updateScoreAndDistance();
        updateEfficiency();
        checkChargingZone();
        checkGameOver();
        checkDelivery();

    }

    drone.draw();

    drawRainEffect();

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
