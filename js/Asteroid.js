class Asteroid {

    constructor(width, height, diameter) {
        this.width = width;
        this.height = height;
        this.diameter = diameter;
    } 

    respawn() {
        this.y = this.getRandomArb(5, this.height * 0.75);

        let spawnLeft = this.getRandomArb(0, 1) > 0.5;
        if (spawnLeft) {
            this.x = this.getRandomArb(-this.width, -7.5);
            this.goesLeft = false;
        } 
        else {
            this.x = this.getRandomArb(this.width + 7.5, this.width * 2);
            this.goesLeft = true;
        }
    }

    update(speed) {
        if (this.goesLeft) this.x -= speed;
        else this.x += speed;

        if (this.isOffCanvas()) this.respawn();
    }

    display() {
        circle(this.x, this.y, this.diameter);
    }

    isOffCanvas() {
        if (this.x < -3 && this.goesLeft) {
            return true; 
        } 
        else if (this.x > this.width + 3 && !this.goesLeft) {
            return true;
        }

        return false;
    }

    hitSpaceship(ship) {
        if (dist(this.x, this.y, ship.x, ship.y) < 29) {
            return true;
        } 
        else {
            return false;
        }
    }

    getRandomArb(min, max) {
        return (Math.random() * (max - min) + min);
    }

}