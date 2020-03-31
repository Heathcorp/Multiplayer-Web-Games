const {Vec2, Colour, LightPath, Player} = require('./public/classes.js');

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const players = new Object();

app.use(express.static("public"));

server.listen(80);

io.on("connect", function (socket) {
    var player;

    socket.emit("all players", players);
    socket.on("player joined", function(name, colour, position, direction)
    {
        console.log(name + " has joined the game");
        player = new Player(name, Colour.FromObject(colour), new LightPath(position, null));
        player.direction = direction;
        player.Update();
        players[player.name] = player;
        io.emit("player joined", player);
    });

    socket.on("change direction", function(newDir)
    {
        //console.log(player.name + " has changed direction to " + newDir);
        player.direction = newDir;
    });

    socket.on("disconnect", function()
    {
        if (player != null)
        {
            console.log(player.name + " has disconnected");
            io.emit("player disconnected", player.name);
            delete players[player.name];
        }
    });
});

let timer = setInterval(Update, 50);

function Update() //called each server "tick"
{
    newPositions = new Object();
    for (let [name, player] of Object.entries(players))
    {
        //check for collisions
        if (player.lightPath.lightPath.IsOverlapping(player.HeadPosition))
        {
            player.isDead = true;
        }
        if (!player.isDead)
        {
            for (let [otherName, otherPlayer] of Object.entries(players))
            {
                if (name != otherName)
                {
                    let collisionPos = otherPlayer.lightPath.IsOverlapping(player.HeadPosition);
                    if (collisionPos != null)
                    {
                        player.isDead = true;
                        if (Vec2.IsEqual(collisionPos, otherPlayer.HeadPosition))
                        {
                            otherPlayer.isDead = true;
                        }
                    }
                }
            }
        }
        if (!player.isDead)
        {
            player.Update();
            newPositions[name] = player.HeadPosition;
        }
    }
    io.emit("update", newPositions);
}