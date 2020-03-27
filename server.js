const express = require("express")
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

//app.get("/", function (request, response) {
    //response.static(__dirname + "/public");
//});

server.listen(80);

io.on("connection", function (socket) {
    io.on("new player", function(name)
    {
        console.log(name + "has connected");
    });
});