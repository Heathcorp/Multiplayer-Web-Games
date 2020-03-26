const express = require("express");
const IO = require("socket.io");
const app = express();
const port = 7070;

app.get("/", function (request, response) {
    response.send("Hello World!");
});

app.listen(port);