class Vec2 {
    constructor(x, y) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    IsEqual(other) {
        if (this.x == other.x && this.y == other.y) {
            return true;
        }
        else {
            return false;
        }
    }

    Add(Vector) {
        this.x += Math.floor(Vector.x);
        this.y += Math.floor(Vector.y);
    }

    static Add(v1, v2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }
}

class Colour {
    constructor(r, g, b, a) {
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
        this.a = Math.floor(a);
    }

    static FromObject(obj) {
        return new Colour(obj.r, obj.g, obj.b, obj.a);
    }

    static white = new Colour(255, 255, 255, 255);
    static random = new Colour(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
}

class Player {
    static FromObject(obj) {
        return new Player(obj.name, obj.colour, LightPath.FromObject(obj.lightPath));
    }

    constructor(name, colour, lightPath) {
        this.name = name;
        this.colour = colour;
        this.lightPath = lightPath;
        this.playerDirection = 1; //turn direction into radians from the x-axis by multiplying direction by PI/2
    }

    set direction(newDir) {
        //dont parse negative numbers
        newDir = Math.floor(newDir);
        if (!(this.playerDirection == (newDir % 4) || (this.playerDirection + 2) % 4 == (newDir % 4))) {
            this.playerDirection = (newDir % 4);
        }
    }

    get direction() {
        return this.playerDirection;
    }

    get HeadPosition() {
        return this.lightPath.position;
    }

    Update() {
        let unitVec;
        switch (this.direction) {
            case 0:
                unitVec = new Vec2(1, 0);
                break;

            case 1:
                unitVec = new Vec2(0, -1);
                break;

            case 2:
                unitVec = new Vec2(-1, 0);
                break;

            case 3:
                unitVec = new Vec2(0, 1);
                break;
        }
        this.lightPath = new LightPath(Vec2.Add(this.HeadPosition, unitVec), this.lightPath);
    }
}

class LightPath {
    //recursive light path object (like a linkedlist)
    //each time the player moves 1 square you set its currentPlayerPath to be new LightPath(newPosition, currentPlayerPath)
    constructor(position, restOfPath) {
        this.position = position;
        this.lightPath = restOfPath;
    }

    //recursively convert js object into es6 class
    static FromObject(obj) {
        if (obj.lightPath != null) {
            return new LightPath(obj.position, LightPath.FromObject(obj.lightPath));
        }
        else {
            return new LightPath(obj.position, null);
        }
    }

    //recursive check for collision with this path
    IsOverlapping(position) {
        if (position.IsEqual(this.position)) {
            return true;
        }
        else if (this.lightPath == null) {
            return false;
        }
        else {
            return this.lightPath.IsOverlapping(position);
        }
    }

    //recursively returns a string representation of this path which can then be sent over internet
    stringify() {
        if (this.lightPath == null) {
            return JSON.stringify(this.position);
        } else {
            return this.lightPath.stringify() + "," + JSON.stringify(this.position);
        }
    }

    //recursively calls given function on each element
    map(callback) {
        if (this.lightPath != null) {
            this.lightPath.map(callback);
        }
        callback(this);
    }
}

//required if the server wants to access these classes
try {
    exports.Vec2 = Vec2;
    exports.Colour = Colour;
    exports.LightPath = LightPath;
    exports.Player = Player;
}
catch (error) { }