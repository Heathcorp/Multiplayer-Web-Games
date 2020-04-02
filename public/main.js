var playerName = prompt("Player Name:");
var playerColour = Colour.random;
var startPosition;
var startDirection;

var players; //dictionary of playerName keyed player objects

const gameCanvasRect = [new Vec2(0, 0), new Vec2(1024, 576)];
const gridSize = new Vec2(128, 72);
const cellWidth = (gameCanvasRect[1].x - gameCanvasRect[0].x) / gridSize.x;
const cellHeight = (gameCanvasRect[1].y - gameCanvasRect[0].y) / gridSize.y;

var gc; //game canvas

function DrawPosition(pos, col) {
    let x = pos.x;
    let y = pos.y;
    gc.push();
    gc.noStroke();
    gc.rectMode(CORNER);
    gc.fill(col.r, col.g, col.b, col.a);
    gc.rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    gc.pop();
}

function DrawPlayer(player)
{
    player.lightPath.map(function (lightPath) {
        DrawPosition(lightPath.position, player.colour);
    });
}

var canvas;

function setup() {
    gc = createGraphics(cellWidth * gridSize.x, cellHeight * gridSize.y);
    gc.background(0);
    canvas = createCanvas(cellWidth * gridSize.x, cellHeight * gridSize.y);

    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
    canvas.parent('holder');

    canvas.mousePressed(function () {
        startPosition = new Vec2(mouseX / cellWidth, mouseY / cellHeight);
    });
}

function draw() {
    background(32, 32, 48);
    image(gc, 0, 0, cellWidth * gridSize.x, cellHeight * gridSize.y);
}

function keyPressed() {
    var newDir;
    if (keyCode === 39 || keyCode === 68) {//D or Right arrow
        newDir = 0;
    } else if (keyCode === 38 || keyCode === 87) {//W or Up arrow
        newDir = 1;
    } else if (keyCode === 37 || keyCode === 65) {//A or Left arrow
        newDir = 2;
    } else if (keyCode === 40 || keyCode === 83) {//S or Down arrow
        newDir = 3;
    }
    if (newDir != null) {
        if (startDirection != null) {
            socket.emit("change direction", newDir);
        }
        else if (startPosition != null) {
            startDirection = newDir;
            JoinGame();
        }
    }
}

//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//}

function DrawToTable(PlayerToDraw) {
    var table = document.getElementById("PlayerTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    // Add some text to the new cells:
    cell1.innerHTML = PlayerToDraw.name;
    //cell2.innerHTML = PlayerToDraw.colour;
    cell2.style.background = PlayerToDraw.colour.ToHex();
    cell3.innerHTML = PlayerToDraw.kills;
}

const serverAddr = "http://101.186.164.176";
//const serverAddr = "https://multiplayerwebgames.web.app/";

const socket = io.connect(serverAddr);
//const socket = io.connect("https://multiplayerwebgames.web.app/");
//aids
//const socket = io.connect("http://101.186.164.176");
//const socket = io.connect("http://localhost/");

var JoinGame; //JoinGame function

socket.on("connect", function () {
    console.log("connected to server");
    JoinGame = function() {
        socket.emit("player joined", playerName, playerColour, startPosition, startDirection);
        console.log("joined the game");
    }
    socket.on("all players", function (allPlayers) {
        console.log("received other player data");
        players = new Object();
        for (let [key, value] of Object.entries(allPlayers)) {
            let player = Player.FromObject(value)
            players[key] = player;
            DrawPlayer(player);
            DrawToTable(player);
        }

        socket.on("update", function (newPositions) {
            for (let [key, value] of Object.entries(newPositions)) {
                let player = players[key];
                player.lightPath = new LightPath(value, player.lightPath);
                DrawPosition(player.HeadPosition, player.colour);
            }
        });

        socket.on("player joined", function (newPlayer) {
            console.log("new player joined");
            let player = Player.FromObject(newPlayer);
            players[newPlayer.name] = player;
            DrawToTable(player);
            DrawPlayer(player);
        });

        socket.on("player eliminated", function(name)
        {
            console.log("player eliminated");
            console.log(players[name].HeadPosition);
            players[name].lightPath.map(function (lightPath) 
            {
                DrawPosition(lightPath.position, Colour.black);
            });
            delete players[name];
        });

        socket.on("player disconnected", function(name) {
            console.log("player disconnected");
        });
    });
});