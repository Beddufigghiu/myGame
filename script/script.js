var canvas;
var stage;

var player;
var platform;
var game;
var world;
var contentManager;

//config
var SPEED = -400;
var timeStep = 0.018;
var keyDn = false;
    
function init() {
    
    canvas = document.getElementById("myCanvas");
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    contentManager = new ContentManager();
    contentManager.SetDownloadComplete(openGame); 

}

function openGame() {
    
    
    //clearInterval(loadingInterval);

    // start the music
	//createjs.Sound.play("music", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.4);

    //make game object
    game = new Game(contentManager.gameAssets);

    //initialize player x, y and frameData for the sprite
    player = new Player(contentManager.spriteAssets);

    //initialize the platform from the loaded json tile map
    platform = new Platform(game.level);

    //add elements to world
    world = new World(contentManager.worldAssets);

    world.addChild(player, platform);

    //add world and game to stage
    stage.addChild(world, game);

    //RAF will used supported browser frame rate
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);//not sure I need this for compatibily
    createjs.Ticker.addEventListener("tick", handleTick);
    game.paused = true;

}

function handleTick(event) {
 
    //handle the world and player motion
    //if game is not paused set the player speed from world
    if(!game.paused && !player.freeze) {
        
        timeStep = 1 / createjs.Ticker.getMeasuredFPS();
        
        if(timeStep > 0.018) timeStep = 0.018;
        
        //manage velocities
        if(player.alive) {
            world.velX = SPEED;
            player.velX = - world.velX;
        }
        else {
            world.velX = 0;
            player.velX = 0;
        }
            
        player.velY += world.gravity * timeStep;
        
        //clamp vertical speed
        if(player.velY > 800) player.velY = 800;
        
        //manage positions   
        world.x += world.velX * timeStep;
        player.x += player.velX * timeStep;
        player.y += (player.velY + 0.5 * world.gravity * timeStep) * timeStep;
        

    }
    //game is paused
    else if (game.paused || player.freeze) {
        //velocities are zero while paused
        world.velX = 0;
        player.velX = 0;
        player.velY = 0;
        
        //freeze positions to current   
        world.x = world.x;
        player.x = player.x;
        player.y = player.y;

    }

    
    player.updateRectangle();
   
    //handle collisions with platform objects
    for (var obj = 0; obj < game.level.layers[1].objects.length; obj++) {
        
        platform.updateRect(obj);
   
        //detect over which element dino is at and return the id (index position of the objects array
        world.detectObject(player.Rect, platform.Rect);

        if(world.objId != null && player.alive) {
            
            world.interstectRect(player.Rect, platform.Rect);
            
        }
    }

    //handle collision effect
    if(world.collision) {
        
        if(player.alive)  {
            
            createjs.Sound.play("soundCrash");
            player.sprite.gotoAndStop("dead");
            player.freeze = true; 
            player.alive = false;
            
        }
        world.shake(35, 5, 7);
        createjs.Tween.get(this).wait(300).call(player.impact, [world.collision], player);
            
        
    }


    stage.update(event);

}