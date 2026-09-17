let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 140;

function drawBackground() {
    ctx.fillStyle = "#d6b87c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(100, canvas.height / 2, 60, 35);
}

function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawBackground();
drawPlayer();

requestAnimationFrame(animate);

}

animate();