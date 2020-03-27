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
}

class Player {
    constructor(Name, Colour, Path = null) {
        this.name = Name;
        this.colour = Colour;
        this.path = LightPath;
    }

    currentPosition() {
        return this.path.position;
    }

    move(Vector) {
        this.path = LightPath(Vector, this.path);
    }
}

class LightPath {
    //recursive light path object (like a linkedlist)
    //each time the player moves 1 square you set its currentPlayerPath to be new LightPath(newPosition, currentPlayerPath)
    constructor(position, restOfPath) {
        this.position = position;
        this.path = restOfPath;
    }
    //Hey

    //recursive check for collision with this path
    IsOverlapping(position) {
        if (position.IsEqual(this.position)) {
            return true;
        }
        else if (this.path == null) {
            return false;
        }
        else {
            return this.path.IsOverlapping(position);
        }
    }

    //recursively returns a string representation of this path which can then be sent over internet
    stringify() {
        if (this.path == null) {
            return JSON.stringify(this.position);
        } else {
            return this.path.stringify() + "," + JSON.stringify(this.position);
        }
    }
}