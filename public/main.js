var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", prompt("Player Name:"));
});

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function setup()
{
    createCanvas(window.innerWidth, window.innerHeight);
}
  
function draw()
{
    background(32, 32, 48);
}