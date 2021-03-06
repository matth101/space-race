// Game constants
const CANVAS_HEIGHT = 675;
const CANVAS_WIDTH = 525;
const ASTEROID_DIAMETER = 10;
const SPACESHIP_SPEED = 2.25;

// DOM Elements
const tableP1 = document.getElementById("P1");
const tableP2 = document.getElementById("P2");

// Variable states
let canvas;
let spaceship;
let leftShip;
let rightShip;
let scoreP1 = 0;
let scoreP2 = 0;
let asteroidAmount;
let asteroids = [];
let asteroidSpeed = 1;
let winner;

// Specific game-managing states
let state;
let difficulty;
let lapLimit;

window.onload = function() {
    document.getElementById("playButton").onclick = start;
    document.getElementById("resetButton").onclick = reset;
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function preload() {
    spaceship = loadImage('media/spaceship.jpg'); // 35w * 48h  
}

function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('holder');

    leftShip = new Spaceship(width, height, spaceship, "L");
    rightShip = new Spaceship(width, height, spaceship, "R");

    reset();
}

function start() {
    asteroidAmount = 0;
    if (state !== "DRAWING") {
        let terminate;
        do {
            difficulty = String(prompt("Difficulty (easy, medium, hard): ")).toUpperCase();
            if (difficulty == null) {
                terminate = false;
            } 
            else if (difficulty !== "EASY" && difficulty !== "MEDIUM" && difficulty !== "HARD") {
                alert("Please enter one of the following options: easy, medium, or hard.")
                terminate = false;
            }
            else {
                switch (difficulty) {
                    case "EASY":
                        asteroidAmount = 35;
                        lapLimit = 3;
                        asteroidSpeed = 1;
                        break;
                    case "MEDIUM":
                        asteroidAmount = 45;
                        lapLimit = 4;
                        asteroidSpeed = 1.3;
                        break;
                    case "HARD":
                        asteroidAmount = 50;
                        lapLimit = 5;
                        asteroidSpeed = 2;
                        break;
                    default:
                        asteroidAmount = 35;
                        lapLimit = 3;
                        asteroidSpeed = 1;
                }
                terminate = true;
            }
        } while (!terminate);
    }

    if (state === "ENDING") {
        reset();
    } 
    else if (state !== "DRAWING") { 
        reset(); // spawn the sprites after grabbing difficulty again  
        state = "DRAWING";
        loop();
    }
}

function end() {
    state = "ENDING";
}

function reset() {
    asteroids = [];
    difficulty = null;

    leftShip.respawn();
    rightShip.respawn();

    leftShip.lap = 0;
    rightShip.lap = 0;

    for (var i = 0; i < asteroidAmount; i++) {
        asteroids.push(new Asteroid(width, height, ASTEROID_DIAMETER));
    }

    asteroids.forEach((function(asteroid) {
        asteroid.respawn();
    }));

    state = "STARTING"; // wait for user to press start button now
    noLoop();
}

function draw() {
    tableP1.textContent = scoreP1;
    tableP2.textContent = scoreP2;

    background(0);
    stroke('#FFFFFF');
    line(width * 0.5, height, width * 0.5, height * 0.8);

    switch (state) {
        case "STARTING":
            writeText(width * 0.5, height * 0.15, 25, "player 1: w, s keys", 255);
            writeText(width * 0.5, height * 0.23, 25, "player 2: up, down arrows", 255);
            writeText(width * 0.5, height * 0.4, 25, "race the fastest to win", 255);
            writeText(width * 0.5, height * 0.55, 25, "press start and choose", 255);
            writeText(width * 0.5, height * 0.6, 25, "difficulty (easy, medium,", 255);
            writeText(width * 0.5, height * 0.65, 25, "hard) to play", 255);
        case "DRAWING":
            checkHeldKeys();
            updateAndDisplaySprites();
            showScores();
            checkWinners();
            break;
        case "ENDING":
            writeText(width * 0.5, height * 0.5, 40, winner + " wins", 255);
            showScores();
            break;
    }
}

function updateAndDisplaySprites() {
    leftShip.update(SPACESHIP_SPEED, lapLimit);
    rightShip.update(SPACESHIP_SPEED, lapLimit);

    asteroids.forEach((function(asteroid) {
        asteroid.update(asteroidSpeed);
        asteroid.display();

        if (asteroid.hitSpaceship(leftShip)) {
            leftShip.respawn();
        } 
        else if (asteroid.hitSpaceship(rightShip)) {
            rightShip.respawn();
        }
    }));

    leftShip.display()
    rightShip.display();
}

function showScores() {
    if (state !== "STARTING") {
        writeText(width * 0.1225, height * 0.8, 40, leftShip.lap + "/" + lapLimit, 255);
        writeText(width * 0.8775, height * 0.8, 40, rightShip.lap + "/" + lapLimit, 255);
    }
}

function checkWinners() {
    if (leftShip.win) {
        winner = "player 1";
        scoreP1++;
        leftShip.win = false;
        end(); 
    } 
    else if (rightShip.win) {; 
        winner = "player 2";  
        scoreP2++;
        rightShip.win = false;
        end();
    }
}

function keyPressed() {
    if (keyCode === 87) leftShip.state = "MOVING_UP";
    else if (keyCode === 83) leftShip.state = "MOVING_DOWN";
    
    if (keyCode === UP_ARROW) rightShip.state = "MOVING_UP";
    else if (keyCode === DOWN_ARROW) rightShip.state = "MOVING_DOWN";
}

function checkHeldKeys() {
    if (keyIsDown(87)) leftShip.state = "MOVING_UP"
    else if (keyIsDown(83)) leftShip.state = "MOVING_DOWN";
    
    if (keyIsDown(UP_ARROW)) rightShip.state = "MOVING_UP";
    else if (keyIsDown(DOWN_ARROW)) rightShip.state = "MOVING_DOWN";
}

function writeText(x, y, size, input, color) {
    textFont('Major Mono Display');
    textSize(size);
    textAlign(CENTER, CENTER);
    fill(color);
    text(input, x, y);
}


