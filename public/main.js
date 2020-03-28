var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", playerName);
});

const playerName = prompt("Player Name:");
const players = new Array(16);
//players[0] is the client
players[0] = new Player(playerName, new Colour(15, 63, 255, 255), new LightPath(new Vec2(15, 15), null));
players[0].Update();

const gameCanvasRect = [new Vec2(0, 0), new Vec2(1024, 576)];
const gridSize = new Vec2(128, 72);
const cellWidth = (gameCanvasRect[1].x - gameCanvasRect[0].x) / gridSize.x;
const cellHeight = (gameCanvasRect[1].y - gameCanvasRect[0].y) / gridSize.y;

var gc; //game canvas

function setup()
{
    gc = createGraphics(cellWidth * gridSize.x, cellHeight * gridSize.y);
    createCanvas(windowWidth, windowHeight);
}

function draw()
{
    gc.background(0);

    players.map(function(player)
    {
        if(!(player.lightPath.path.IsOverlapping(player.lightPath.position)))
        {
            player.Update();
        }
        player.lightPath.map(function(lightPath)
        {
            let x = lightPath.position.x;
            let y = lightPath.position.y;
            let col = player.colour;
            gc.push();
            gc.noStroke();
            gc.rectMode(CORNER);
            gc.fill(col.r, col.g, col.b, col.a);
            gc.rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            gc.pop();
        });
    });
    
    background(32, 32, 48);
    image(gc, 0, 0, cellWidth * gridSize.x, cellHeight * gridSize.y);
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}