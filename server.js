const express = require("express")
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

server.listen(80);

io.on("connect", function (socket) {
    var colour;
    socket.on("new player", function(name, colour)
    {
        console.log(name + " has connected");
        socket.name = name;
        colour = colour;
    });

    socket.on("disconnect", function()
    {
        console.log(socket.name + " has disconnected");
    });
});

