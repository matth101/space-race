class Spaceship {

    constructor(width, height, shipImage, ship) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.shipImage = shipImage;
        this.ship = ship;
        this.lap = 0;
        this.score = 0;
        this.win = false;
    }

    respawn() {
        if (this.ship === "L") {
            this.x = this.width * 0.25;
            this.y = this.height * 0.9;
        } 
        else if (this.ship === "R") {
            this.x = this.width * 0.75;
            this.y = this.height * 0.9;
        }
        
        this.state = "NEUTRAL";
    }

    update(speed, limit) {
        this.speed = speed;
        switch (this.state) { 
            case "MOVING_UP":
                this.y -= this.speed;
                break;
            case "MOVING_DOWN":
                if (this.y + 24 > this.height) {
                    this.speed = 0;
                }
                this.y += this.speed;
                break;
            case "NEUTRAL": // fall-through case
            default:
                this.y += 0;
        }
        this.state = "NEUTRAL";

        if (this.y < -15) {
            this.y = this.height + 24;
            this.lap++;

            if (this.lap === limit) {
                this.win = true;
                this.lap = limit - 1;
            } 
        }
    }

    display() {
        imageMode(CENTER);
        image(this.shipImage, this.x, this.y);
    }

}