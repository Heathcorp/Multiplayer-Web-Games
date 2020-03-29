var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", playerName, colour);
});

socket.on("all players", function(allPlayers)
{
    players = allPlayers; //WIP

});

const playerName = prompt("Player Name:");
const colour = Colour.random;
var players; //dictionary of playerName keyed player objects

const gameCanvasRect = [new Vec2(0, 0), new Vec2(1024, 576)];
const gridSize = new Vec2(128, 72);
const cellWidth = (gameCanvasRect[1].x - gameCanvasRect[0].x) / gridSize.x;
const cellHeight = (gameCanvasRect[1].y - gameCanvasRect[0].y) / gridSize.y;

var gc; //game canvas

function setup()
{
    gc = createGraphics(cellWidth * gridSize.x, cellHeight * gridSize.y);
    gc.background(0);
    createCanvas(windowWidth, windowHeight);
}

function draw()
{    
    background(32, 32, 48);
    image(gc, 0, 0, cellWidth * gridSize.x, cellHeight * gridSize.y);
}

socket.on("update", function(newPositions)
{
    console.log(Object.entries(newPositions).length);
    for (let [key, value] of Object.entries(newPositions)) {
        console.log(key, value);
        let player = players.get(key);
        player.lightPath = new LightPath(value, player.lightPath);
        DrawHeadPosition(player);
    }
});

function DrawHeadPosition(player)
{
    let x = player.HeadPosition.x;
    let y = player.HeadPosition.y;
    let col = player.colour;
    gc.push();
    gc.noStroke();
    gc.rectMode(CORNER);
    gc.fill(col.r, col.g, col.b, col.a);
    gc.rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    gc.pop();
}

function keyPressed() {
    var newDir = 0;
    if (keyCode === 39 || keyCode === 68) {//D or Right arrow
        newDir = 0;
    } else if (keyCode === 38 || keyCode === 87) {//W or Up arrow
        newDir = 1;
    } else if (keyCode === 37 || keyCode === 65) {//A or Left arrow
        newDir = 2;
    } else if (keyCode === 40 || keyCode === 83) {//S or Down arrow
        newDir = 3;
    }
    socket.emit("change direction", newDir);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}