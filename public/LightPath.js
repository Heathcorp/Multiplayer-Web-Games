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

    static Add(v1, v2)
    {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }
}

class Colour
{
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static White = new Colour(255, 255, 255, 255);
}

class Player {
    constructor(name, colour, lightPath)
    {
        this.name = name;
        this.colour = colour;
        this.lightPath = lightPath;
        this.snakeDirection = 1; //turn direction into radians from the x-axis by multiplying direction by PI/2
    }

    set direction(newDir)
    {
        //dont pass negative numbers
        if(!(this.snakeDirection == (newDir % 4) || (this.snakeDirection + 2) % 4 == (newDir % 4)))
        {
            this.snakeDirection = (newDir % 4);
        }
    }

    get direction()
    {
        return this.snakeDirection;
    }

    HeadPosition()
    {
        return this.path.position;
    }

    Update()
    {
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
        this.lightPath = new LightPath(Vec2.Add(this.lightPath.position, unitVec), this.lightPath);
    }
}

class LightPath {
    //recursive light path object (like a linkedlist)
    //each time the player moves 1 square you set its currentPlayerPath to be new LightPath(newPosition, currentPlayerPath)
    constructor(position, restOfPath) {
        this.position = position;
        this.path = restOfPath;
    }
    //Hey yo

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

    //recursively calls given function on each element
    map(callback)
    {
        if(this.path != null)
        {
            this.path.map(callback);
        }
        callback(this);
    }
}