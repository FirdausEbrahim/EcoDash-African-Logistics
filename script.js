let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 140;

let playerX = 100;
let playerY = canvas.height / 2;
let playerSpeed = 5;

function drawBackground() {
    ctx.fillStyle = "#d6b87c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(playerX, playerY, 60, 35);
}

document.addEventListener("keydown", function(event) {

    if (event.key == "ArrowRight") {
        playerX += playerSpeed;
    }

    if (event.key == "ArrowLeft") {
        playerX -= playerSpeed;
    }

    if (event.key == "ArrowUp") {
        playerY -= playerSpeed;
    }

    if (event.key == "ArrowDown") {
        playerY += playerSpeed
    }
});


function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBackground();
drawPlayer();

requestAnimationFrame(animate);

}

animate();