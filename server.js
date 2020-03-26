const express = require("express");
const io = require("socket.io");
const app = express();
const port = 7070;

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/game/index.html");
});

app.listen(port);