const {Vec2, Colour, LightPath, Player} = require('./public/classes.js');

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const players = new Array(0).fill(null);

app.use(express.static("public"));

server.listen(80);

io.on("connect", function (socket) {
    var player;
    socket.on("new player", function(name, colour)
    {
        console.log(name + " has connected");
        player = new Player(name, colour, new LightPath(new Vec2(15, 15), null));
        player.direction = Math.random() * 3;
        socket.emit("all players", players);
        players.push(player);
    });

    socket.on("change direction", function(newDir)
    {
        player.direction = newDir;
    });

    socket.on("disconnect", function()
    {
        console.log(player.name + " has disconnected");
    });
});

let timer = setInterval(Update, 5000);

function Update() //called each server "tick"
{
    newPositions = new Map();
    players.map(function(player)
    {
        player.Update();
        newPositions.set(player.name, player.HeadPosition);
    });
    io.emit("update", newPositions);
    //clearTimeout(timer);
}