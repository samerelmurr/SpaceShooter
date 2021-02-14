/**
 * ****************************************************************************
 * Name: Samer El-Murr*********************************************************
 * Date: 17/11/2020************************************************************
 * Course: Computer Graphics***************************************************
 * Intructor: Dr Danni Nini****************************************************
 * Project: SpaceShooter*******************************************************
 * ****************************************************************************
 * This project is to make pong copy of the original Atari Game****************
 * ****************************************************************************
 */


let score = 0; // default score = 0
let Health = 20; // default health = 3 
const keys = []; // the keys for event listener 
let gameOver = false;

//event listeners for the keystrokes 
addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
});

addEventListener("keyup", function (e) {
	keys[e.keyCode] = false;
    ship.flyingForward = false;
});

/**
 * *****************************************************************
 * Game class that contains and calls all the objects to update and 
 * draw. It has a no-arg constructor that constructs the canvas and 
 * initiates the onbject array, the update method calls all objects
 * update methods to update the game, and Draw which calls all obj-
 * ects draw methods.
 * ****************************************************************
 */
class Game{

    //default constructor 
    constructor(){
        this.width = 800; //width of the canvas
        this.height = 500; // height of the canvas
        this.canvas = document.getElementById("SpaceForce"); //calling the canvas
        this.ctx = this.canvas.getContext("2d"); //calling the context
        this.objects = []; //object array
        this.canvas.width = this.width; //assigning canvas width 
        this.canvas.height = this.height; //assigning canvas height 
    }

    //Update methods that takes parameter delta and calls all object's updates
    update(delta){

        if(Health > 0){ //if health call all game updates

            //for loop to loop through the array of objects 
            for(let i = 0; i < this.objects.length; ++i){

                    //if it is object Spaceship
                    if(this.objects[i] instanceof SpaceShip){

                        //let bullets be the object after and alien after that
                        let bullets = this.objects[i + 1];
                        let alien = this.objects[i + 2];

                        //call spaceship update 
                        this.objects[i].update(keys, delta, bullets, alien, this.canvas);
                    } 
                    
                    else if(this.objects[i] instanceof Bullet){  //if object is bullet

                        //let ship be before it and alien after
                        let ship = this.objects[i - 1];
                        let alien = this.objects[i + 1];

                        //call bullet update
                        this.objects[i].update(delta, ship, alien, this.canvas, keys);
                    } 
                    
                    else if(this.objects[i] instanceof Alien){ //if object is alien

                        //let ship be 2 objects before alien
                        let ship = this.objects[i - 2];
                        let alienBullet = this.objects[i + 1];
                        //call alien update
                        this.objects[i].update(alienBullet, ship, delta, this.canvas);
                    } 
                    
                    else if(this.objects[i] instanceof AlienBullet){ //if object is alienBullet

                        //let ship be 3 objects behind alien
                        let ship = this.objects[i - 3];
                        let alien = this.objects[i - 1];
                        this.objects[i].update(delta, alien, ship, this.canvas);

                    } 

                    else{
                        //Calling the general update function incase no specific object has been called
                        this.objects[i].update(delta);
                    }

                }
        } 
    }

    //drawing all objects on the screen 
    draw(){

        //loop to go through array to draw objects on screen
        for(let i = 0; i < this.objects.length; ++i){
            this.objects[i].draw(this.ctx);
        }
    }

    //Adding objects to object array
    addObject(obj){
        this.objects.push(obj);
    }
}

/**
 * Object class which is a parent class for all objects in the game
 *  
 */
class Object{
    constructor(){

    }

    update(){

    }

    draw(){

    }
}

/**
 * *************************************************************************
 * Spacehsip class for the player that extends object has a constructor that 
 * takes the position of the player, update that updates the activity of the
 * player with the world its in, reset to reset the player when dead, and 
 * draw which draws the sprite of the ship.
 * ************************************************************************* 
 */
class SpaceShip extends Object{

    //default constructor 
    constructor(x, y) {

        //calling object supper 
        super();

        //creating ship image and its atributes 
        this.shipImage = new Image();
        this.shipReady = false;
        this.shipImage.onload = () =>{
            this.shipReady = true;
        };
        this.shipImage.src = "Assets/SpaceShip.png";

        //initiating x and y
        this.x = x; 
        this.y = y;

        this.speed = 200; //speed of player

        this.size = 64; //the size of player 64*64
        
    }

    reset(canvas){ 
        
        //resetting the player after death centering the player in canvas
        this.x = canvas.width/2;
        this.y = canvas.height/2;

    }

    /**
     * update function to update the state of the ship
     */
    update(keys, delta, bullets, alien, canvas, score) {
        
        if(keys[87]){ //up
            this.y -= this.speed * delta;
        }

        if(keys[83]){ //down
            this.y += this.speed * delta;
        }

        if(keys[68]){ //right
            this.x += this.speed * delta;
        }

        if(keys[65]){ //left
            this.x -= this.speed * delta;
        }

        if(keys[32]){ //space shoot
            bullets.update(delta, this, alien, canvas, keys, score);
        }

        /**
         * If the ship hits a side of the screen I would wrap it to the 
         * other side 
         */    
        if (this.x < this.size) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.size;
        }
        if (this.y < this.size) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.size;
        }

        //collision with alien same as from goblin
        if (
            this.x <= (alien.x + 32)
            && alien.x <= (this.x + 32)
            && this.y <= (alien.y + 32)
            && alien.y <= (this.y + 32)
        ) {
            --Health;

            if(Health == 0){
                gameOver = true;
                alert("Game Over!!! Press enter to continue");
                location.reload();
            }

            this.reset(canvas);
            alien.reset(canvas);
        }
    }

    draw(ctx){ 
        //draws the ship sprite image 
        if (this.shipReady) {
            ctx.beginPath();
            ctx.drawImage(this.shipImage, this.x, this.y, this.size, this.size);
        }
    }
}

/**
 * ********************************
 * Class for drawing the background
 * ******************************** 
 */
class background extends Object{

    //default constructor 
    constructor(canvas){

        super(); //calling supper of object

        //getting the bg image
        this.bgReady = false;
        this.bgImage = new Image();
        this.bgImage.onload = () => {
            this.bgReady = true;
        };
        this.bgImage.src = "Assets/background.png";

        //giving the image the size 
        this.sizeWidth = canvas.width;
        this.sizeHeight = canvas.height;

    }

    update(){

    }

    //drawing the image 
    draw(ctx){
        if (this.bgReady) {
            ctx.beginPath();
            ctx.drawImage(this.bgImage, 0, 0, this.sizeWidth, this.sizeHeight);
        }
    }
}

/**
 * **************************************************************************
 * Class for ship Bullet has a default constructor that takes x and y, update
 * for behavior, reset for it to reset with the ship if ship resets, draw for
 * drawing the bullet.
 * **************************************************************************
 */
class Bullet extends Object{

    //default constructor 
    constructor(x, y){

        super(); //calling super

        //x and y values for the bullet
        this.x = x;
        this.y = y;

        this.speed = 500; // bullet speed

        //Making the bullet image 
        this.bulletImg = new Image();
        this.bulletReady = false;
        this.bulletImg.onload = () => {
            this.bulletReady = true;
        };
        this.bulletImg.src = "Assets/bullets.png"; 

        //size of image 
        this.sizeWidth = 20;
        this.sizeHeight = 40;

    }

    /**
     * ******************************************************************
     * updates the bullet when the player shoots and what happens when it 
     * collides with a alien.
     * *****************************************************************
     */
    update(delta, ship, alien, canvas, keys){

        if(keys[32]){ //space to shoot
            this.y -= this.speed * delta;

            if(this.y <= 0){
                this.reset(ship);// for it to follow the ship
            } 
            
        } else {
            this.y -= this.speed * delta;
        }

        //collision with alien
        if (
            this.x <= (alien.x + 50)
            && alien.x <= (this.x + 50)
            && this.y <= (alien.y + 50)
            && alien.y <= (this.y + 50)
        ) {
            score += 10; //increases score by 10
            alien.reset(canvas); //resspawns the alien
        }
    }

    //resets to the position of the ship
    reset(ship){
        this.x = ship.x + 20;
        this.y = ship.y + 20;
        this.speed = 500;
    }

    //draws the ship
    draw(ctx){
        if (this.bulletReady) {
            ctx.beginPath();
            ctx.drawImage(this.bulletImg, this.x, this.y, this.sizeWidth, this.sizeHeight);
        }
    }
}

/**
 * *****************************************************************
 * Class Alien is the alien that spawn for the player to kill, has a 
 * deafult constructor that takes the canvas param, update to update 
 * behavior of the alien, reset to reset the alien when killed and 
 * draw which is to draw the alien sprite.
 * *****************************************************************
 */
class Alien extends Object {

    //default constructor 
    constructor(canvas){

        super(); //calling super

        //letting the alien spawn anywhere on teh screen 
        this.x = canvas.width/2;
        this.y = Math.random() * 500;

        this.speed = 80; //initiating speed
        
        //Getting alien image 
        this.alienImg = new Image();
        this.alienReady = false;
        this.alienImg.onload = () => {
            this.alienReady = true;
        };
        this.alienImg.src = "Assets/Alien.png"; 

        //getting alien size
        this.sizeWidth = 110;
        this.sizeHeight = 100;

    }

    //resetting it on the canvas 
    reset(canvas){
        this.y = canvas.width/2;
        this.x = 1 + (Math.random() * (canvas.width));
        this.speed = 80;
    }

    //updating the behavior of the alien
    update(alienBullet, ship, delta, canvas){

        // subtract (= difference vector)
        let dx = ship.x - this.x;
        let dy = ship.y - this.y;

        // normalize (= direction vector)
        // (a direction vector has a length of 1)
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length) {
        dx /= length;
        dy /= length;
        }
    
        var now = Date.now();
        var delta = now - then;
        then = now;
           
        // move
        // delta is the elapsed time in seconds
        // SPEED is the speed in units per second(UPS)
        this.x += dx * (delta/1000) * this.speed;
        this.y += dy * (delta/1000) * this.speed;

        /**
         * If the alien hits a side of the screen I would wrap it to the 
         * other side 
         */    
        if (this.x < this.size) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.size;
        }
        if (this.y < this.size) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.size;
        }


        alienBullet.update(delta, this, ship, canvas);
    }
    
    //drawing the alien
    draw(ctx){ 
        if (this.alienReady) {
            ctx.beginPath();
            ctx.drawImage(this.alienImg, this.x, this.y, this.sizeWidth, this.sizeHeight);
        }
    }
}

/**
 * **************************************************************************
 * Class for alien Bullet has a default constructor that takes x and y, update
 * for behavior, reset for it to reset with the alien if alien resets, draw for
 * drawing the bullet.
 * **************************************************************************
 */
class AlienBullet extends Object{
    //default constructor 
    constructor(x, y){

        super(); //calling super

        //x and y values for the bullet
        this.x = x;
        this.y = y;

        this.speed = 1; // bullet speed

        //Making the bullet image 
        this.bulletImg = new Image();
        this.bulletReady = false;
        this.bulletImg.onload = () => {
            this.bulletReady = true;
        };
        this.bulletImg.src = "Assets/alienBullets.png"; 

        //size of image 
        this.sizeWidth = 20;
        this.sizeHeight = 40;

    }

    /**
     * ******************************************************************
     * updates the bullet when the alien shoots and what happens when it 
     * collides with a alien.
     * *****************************************************************
     */
    update(delta, alien, ship, canvas){

        let shoot = Math.floor(Math.random() * 100);
       
        if(shoot == 1){
            this.y += this.speed * delta;

            if(this.y >= canvas.height){
                        this.reset(alien);// for it to follow the alien
            }
        } else {
            this.y += this.speed * delta;
        }
        
            
        //collision with ship
        if (
            this.x <= (ship.x + 50)
            && ship.x <= (this.x + 50)
            && this.y <= (ship.y + 50)
            && ship.y <= (this.y + 50)
        ) {
            ship.reset(canvas); //resspawns the alien
            --Health; //decreses health
            if(Health == 0){
                gameOver = true;
                alert("Game Over!!! Press enter to continue");
                location.reload();
            }
        }
    }

    //resets to the position of the ship
    reset(alien){
        this.x = alien.x + 45;
        this.y = alien.y + 45;
        this.speed = 1;
    }

    //draws the alienBullet
    draw(ctx){
        if (this.bulletReady) {
            ctx.beginPath();
            ctx.drawImage(this.bulletImg, this.x, this.y, this.sizeWidth, this.sizeHeight);
        }
    }
}

//calling all game objects
let game = new Game();
let bg = new background(game.canvas);
let ship = new SpaceShip(game.canvas.width/2, game.canvas.height/2);
let bullets = new Bullet(ship.x, ship.y);
let alien = new Alien(game.canvas);
let alienBullet = new AlienBullet(alien.x, alien.y);

//adding game objects to the object array
game.addObject(bg);
game.addObject(ship);
game.addObject(bullets);
game.addObject(alien);
game.addObject(alienBullet);


//the game loop
let animate = function (){

    //setting up the time for the engine 
    let now = Date.now();
    let delta = now - then;

    game.update(delta/1000);
    game.draw();

    then = now;

    //if(Health > 0){
        // Score for the player
        game.ctx.fillStyle = "rgb(250, 250, 250)";
        game.ctx.font = "24px Helvetica";
        game.ctx.textAlign = "left";
        game.ctx.textBaseline = "top";
        game.ctx.fillText("Score: " + score, 32, 32);

        // Score for the lives
        game.ctx.fillStyle = "rgb(250, 250, 250)";
        game.ctx.font = "24px Helvetica";
        game.ctx.textAlign = "left";
        game.ctx.textBaseline = "top";
        game.ctx.fillText("Health: " + Health, 32, 64);

        requestAnimationFrame(animate);
        
}

//making sure everything is compatable 
var w = window; 
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame 
|| w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

let then = Date.now();

animate(); //calling animate function






