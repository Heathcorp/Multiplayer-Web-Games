var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", playerName);
});

const playerName = prompt("Player Name:");
const players = new Array(16);
//players[0] is the client
players[0] = new Player(playerName, new Colour(15, 63, 255, 255), new LightPath(new Vec2(15, 15), null));

function setup()
{
    createCanvas(window.innerWidth, window.innerHeight);
}

const gridRect = [new Vec2(0, 0), new Vec2(1024, 576)];
const gridSize = new Vec2(128, 72);
var grid = new Array(gridSize.y).fill(null).map(() => new Array(gridSize.x).fill(Colour.White));
const cellWidth = (gridRect[1].x - gridRect[0].x) / gridSize.x;
const cellHeight = (gridRect[1].y - gridRect[0].y) / gridSize.y;

function draw()
{
    //this update loop thingy should probs be server-side btw, this is temporary
    //this basically draws each lightPath on the grid
    players.map(function(player)
    {
        player.Update();
        player.lightPath.map(function(lightPath)
        {
            grid[lightPath.position.y][lightPath.position.x] = player.colour;
        });
    });

    background(32, 32, 48);

    fill(255);

    for(let y = 0; y < gridSize.y; y++)
    {
        for(let x = 0; x < gridSize.x; x++)
        {
            push();
            noStroke();
            fill(grid[y][x].r, grid[y][x].g, grid[y][x].b, grid[y][x].a);
            rect(gridRect[0].x + x * cellWidth, gridRect[0].y + y * cellHeight, cellWidth, cellHeight);
            pop();
            grid[y][x] = Colour.White;
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed() {
    if (keyCode === 39 || keyCode === 68) {//D or Right arrow
        players[0].direction = 0;
    } else if (keyCode === 38 || keyCode === 87) {//W or Up arrow
        players[0].direction = 1;
    } else if (keyCode === 37 || keyCode === 65) {//A or Left arrow
        players[0].direction = 2;
    } else if (keyCode === 40 || keyCode === 83) {//S or Down arrow
        players[0].direction = 3;
    }
}