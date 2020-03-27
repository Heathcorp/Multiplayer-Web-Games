var socket = io.connect("http://127.0.0.1");
socket.on("connect", function() 
{
    socket.emit("new player", prompt("Player Name:"));
});





//testing lightpath functions
var lightPath = new LightPath(new Vec2(0, 0), null);
var lightPath = new LightPath(new Vec2(1, 0), lightPath);
var lightPath = new LightPath(new Vec2(2, 0), lightPath);
var lightPath = new LightPath(new Vec2(3, 0), lightPath);
var lightPath = new LightPath(new Vec2(3, -1), lightPath);
var lightPath = new LightPath(new Vec2(3, -2), lightPath);
var lightPath = new LightPath(new Vec2(4, -2), lightPath);
var lightPath = new LightPath(new Vec2(5, -2), lightPath);

console.log(lightPath.IsOverlapping(new Vec2(0, 1)));
console.log(lightPath.IsOverlapping(new Vec2(4, -2)));

console.log(lightPath.stringify());