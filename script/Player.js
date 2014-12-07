(function (window) {
    function Player(frameData) {
        this.initialize(frameData);
    }
    
    var count = 0;
     
    //Initialize Player object
    //Use Container as base class - prototype inheritance chain 
    Player.prototype = new createjs.Container();
    //store the Container initialize method into Container_initialize and override Player.prototype.initialize
    Player.prototype.Container_initialize = Player.prototype.initialize;
    Player.prototype.Container_tick = Player.prototype._tick; 

    Player.prototype.initialize = function (frameData) {
        
        this.Container_initialize();
        
        this.spriteSheet = new createjs.SpriteSheet(frameData);
        this.sprite      = new createjs.Sprite(this.spriteSheet);
        
        this.sprite.regX = this.spriteSheet._frameWidth / 2 | 0;
        this.sprite.regY = this.spriteSheet._frameHeight / 2 | 0;
        this.sprite.gotoAndStop("walk");        
        this.addChild(this.sprite);

        this.alive = true;
        this.onGround = false;
        this.walking = false;
        this.freeze = false;
        
        this.initPosition();      
        this.updateRectangle();
        
    }
    

    //Player Movement
    Player.prototype._tick = function() {
        
        this.Container_tick();
        
        //player has floor contact and he's running
        if(this.velY == 0 && !this.walking && this.onGround && this.alive) {
            
            this.sprite.gotoAndPlay("walk");
            this.walking = true;
        
        }
 
        //while player in the air
        if (this.velY != 0 && this.alive) {
        
            this.sprite.gotoAndStop("jump");
            this.walking = false;
        }
        
        //jump function 
        if(keyDn && this.onGround) {
            
            this.velY = -600;
            createjs.Sound.play("soundJump");
            //keyDn = false; I tried this to avoid hold button mutiples jumps
        }
    
        
        //monitor the player status, if falls off the platform then Game Over
        if(this.y > canvas.height + 30) {
            
            game.gameover(); 
            this.alive = false;
            world.collision = false;
            count = 0;
        }
        

    }
    
    Player.prototype.updateRectangle = function() {
        
            this.Rect = {
                top: this.y - this.spriteSheet._frameHeight / 2 | 0,      // The y-value of the top of the rectangle
                bottom: this.y + this.spriteSheet._frameHeight / 2 | 0,   // the y-value of the bottom of the rectangle
                right: this.x + this.spriteSheet._frameWidth / 2 | 0,     // the x-value of the right side of the rectangle
                left: this.x - this.spriteSheet._frameWidth / 2 | 0,       // the x-value of the left side of the rectangle
                width: this.spriteSheet._frameWidth,
                height: this.spriteSheet._frameHeight
            };
    }
    
    Player.prototype.initPosition = function() {
        
        this.x = 150;
        this.y = -30;
        this.velX = 0;
        this.velY = 0;
        this.rotation = 0;
        this.alive = true;
        this.freeze = false;
        count = 0;
    }
    
    //world class detects collision and player will handle the effects (shake + toss dino as dead)
    Player.prototype.impact = function(collision) {
        
        
        //use dummy counter to execute the collision flow
        //at first set freeze then stop sprite to ""dead"
        if(collision && count < 7) {

            this.freeze = true;
  
        }
                
        //when counet reaches set value unfreeze player
        //kick up dino, set alive = false
         if(count == 7) {
             
             this.freeze = false;
             this.velY = -800;
             
         }

        //rotation effect after the kickup (vely = -800)
        else if(count > 7) {
            
            this.rotation += 10;

        }
        count += 1;

    }

    window.Player= Player;
} (window));