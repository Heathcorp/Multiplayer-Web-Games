var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", prompt("Player Name:"));
});

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

const gridRect = [new Vec2(0, 0), new Vec2(512, 512)];
const gridSize = new Vec2(32, 32);
const grid = new Array(gridSize.y);for(let i = gridSize.x; i < gridSize.x; i++){grid[i] = new Array(32);}
const cellWidth = (gridRect[1].x - gridRect[0].x) / gridSize.x;
const cellHeight = (gridRect[1].y - gridRect[0].y) / gridSize.y;

function setup()
{
    createCanvas(window.innerWidth, window.innerHeight);
}
  
function draw()
{
    background(32, 32, 48);

    fill(255);

    for(let y = 0; y < gridSize.y; y++)
    {
        for(let x = 0; x < gridSize.x; x++)
        {
            rect(gridRect[0].x + x * cellWidth, gridRect[0].y + y * cellHeight, cellWidth, cellHeight);
        }
    }
}