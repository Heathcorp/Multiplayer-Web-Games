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
    socket.on("player connected", function(name, colour)
    {
        console.log(name + " has connected");
        player = new Player(name, Colour.FromObject(colour), new LightPath(new Vec2(15, 15), null));
        player.direction = Math.random() * 3;
        player.Update();
        players[player.name] = player;
        socket.emit("all players", players);
        socket.broadcast.emit("player connected", player);
    });

    socket.on("change direction", function(newDir)
    {
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

let timer = setInterval(Update, 25);

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
        else
        {
            for (let [otherName, otherPlayer] of Object.entries(players))
            {

                if (player.isDead)
                {
                    break;
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
    //clearTimeout(timer);
}