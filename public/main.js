const playerName = prompt("Player Name:");
const colour = Colour.random;
var players; //dictionary of playerName keyed player objects

const gameCanvasRect = [new Vec2(0, 0), new Vec2(1024, 576)];
const gridSize = new Vec2(512,288);
const cellWidth = (gameCanvasRect[1].x - gameCanvasRect[0].x) / gridSize.x;
const cellHeight = (gameCanvasRect[1].y - gameCanvasRect[0].y) / gridSize.y;

var gc; //game canvas

function DrawPosition(pos, col)
{
    let x = pos.x;
    let y = pos.y;
    gc.push();
    gc.noStroke();
    gc.rectMode(CORNER);
    gc.fill(col.r, col.g, col.b, col.a);
    gc.rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    gc.pop();
}


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

const socket = io.connect("http://101.186.164.176");
socket.on("connect", function() 
{
    socket.emit("player connected", playerName, colour);
    socket.on("all players", function(allPlayers)
    {
        players = new Object();
        for (let [key, value] of Object.entries(allPlayers))
        {
            let player = Player.FromObject(value)
            players[key] = player;
            player.lightPath.map(function(lightPath)
            {
                DrawPosition(lightPath.position, player.colour);
            });
        }

        //draw all of them WIP

        socket.on("update", function(newPositions)
        {
            for (let [key, value] of Object.entries(newPositions))
            {
                let player = players[key];
                player.lightPath = new LightPath(value, player.lightPath);
                DrawPosition(player.HeadPosition, player.colour);
            }
        });

        socket.on("player connected", function(newPlayer)
        {
            players[newPlayer.name] = Player.FromObject(newPlayer);
        });

        socket.on("player disconnected", function(name)
        {
            delete players[name];
        });
    });
});