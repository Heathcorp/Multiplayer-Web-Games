const express = require("express")
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

//app.get("/", function (request, response) {
    //response.static(__dirname + "/public");
//});

server.listen(80);

io.on("connect", function (socket) {
    socket.on("new player", function(name)
    {
        console.log(name + " has connected");
        socket.name = name;
    });

    socket.on("disconnect", function()
    {
        console.log(socket.name + " has disconnected");
    });
});