var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", prompt("Player Name:"));
});

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

let gridSize = new Vec2(32, 32);
const grid = new Array(gridSize.y);for(let i = gridSize.x; i < gridSize.x; i++){grid[i] = new Array(32);}
const gridRect = [new Vec2(0, 0), new Vec2(512, 512)];

function setup()
{
    createCanvas(window.innerWidth, window.innerHeight);
}
  
function draw()
{
    background(32, 32, 48);

    fill(255);

    let xSize = grid[0].length;
    let ySize = grid.length;
    let cellWidth = (gridRect[1].x - gridRect[0].x) / xSize;
    let cellHeight = (gridRect[1].y - gridRect[0].y) / ySize;
    for(let y = 0; y < ySize; y++)
    {
        for(let x = 0; x < xSize; x++)
        {
            rect(gridRect[0].x + x * cellWidth, gridRect[0].y + y * cellHeight, cellWidth, cellHeight);
        }
    }
}