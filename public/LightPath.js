class Vec2
{
    constructor(x, y)
    {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    IsEqual(other)
    {
        if(this.x == other.x && this.y == other.y)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

class LightPath
{
    //recursive light path object (like a linkedlist)
    //each time the player moves 1 square you set its currentPlayerPath to be new LightPath(newPosition, currentPlayerPath)
    constructor(position: Vec2, restOfPath: LightPath)
    {
        this.position = position;
        this.path = restOfPath;
    }

    //recursive check for collision with this path
    IsOverlapping(position)
    {
        if(position.IsEqual(this.position))
        {
            return true;
        } 
        else if(this.path == null) 
        {
            return false;
        }
        else
        {
            return this.path.IsOverlapping(position);
        }
    }

    //recursively returns a string representation of this path which can then be sent over internet
    stringify()
    {
        if(this.path == null)
        {
            return JSON.stringify(this.position);
        } else
        {
            return this.path.stringify() + "," + JSON.stringify(this.position);
        }
    }
}