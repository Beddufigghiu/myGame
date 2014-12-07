(function (window) {
    function Game(assets) {
        this.initialize(assets);
    }
    
    //Use Container as base class - prototype inheritance chain 
    Game.prototype = new createjs.Container();
    //store the Container initialize method into Container_initialize and override Game.prototype.initialize
    Game.prototype.Container_initialize = Game.prototype.initialize;
    Game.prototype.Container_tick = Game.prototype._tick;
    Game.prototype.initialize = function (assets) {
        
        this.Container_initialize();
        
        //my extended Game class  
        this.level = contentManager.mapData[0];
        this.paused = true;
        
        //Transition fade background
        this.mask = new createjs.Shape();
        this.mask.graphics.beginFill("#000").drawRect(0, 0, canvas.width, canvas.height);
        this.mask.alpha = 0;
        this.mask.cache(0, 0, canvas.width, canvas.height);

        //debug info
        this.debug = new createjs.Text("frame rate", "bold 18px Verdana", "#000");
	    this.debug.textAlign = "left";
	    this.debug.x = 20;
	    this.debug.y = 10;
        this.debug.text = "***";

        //Score 
        this.scoreField = new createjs.Text("Score: 0", "bold 18px Arial", "#000");
        this.scoreField.textAlign = "right";
        this.scoreField.x = assets.canvasWidth - 10;
        this.scoreField.y = 22;
        this.addChild(this.scoreField);
   
        //Menu buttons
        this.startBtn = new Button(190, 140, contentManager.gameAssets.play , "PLAY", 5, 0.3);
        this.resumeBtn = new Button(190, 140, contentManager.gameAssets.play , "RESUME", 5, 0.3);
        this.settingsBtn = new Button(260, 140, contentManager.gameAssets.settings, "SETTINGS", 5, 0.3);
        this.backBtn = new Button(190, 140, contentManager.gameAssets.back, "BACK",  5, 0.3);
        this.restartBtn = new Button(260, 140, contentManager.gameAssets.restart, "RESTART", 5, 0.3);
        this.pauseBtn = new Button(30, 20, contentManager.gameAssets.pause, "PAUSE", 5, 0.2);
        this.homeBtn = new Button(260, 140, contentManager.gameAssets.home, "HOME", 5, 0.3);
        
        
        //level page
        this.levelPage = new createjs.Container();
        var  levelPageText = new createjs.Text("Select a level", "38px Verdana", "#000");
        levelPageText.textAlign = "center";
        levelPageText.x = assets.canvasWidth / 2;
        levelPageText.y = assets.canvasHeight / 5;
        this.levelPage.displayed = false;
        
        //make levels buttons
        var maxRow = 3;
        var maxCol = 5;
        for(var row = 0; row < maxRow; row++) {
            for(var col = 1; col <= maxCol; col++) {
                
                var id = col + row * (maxCol);// - 1);
                this.levelBtn = new Button(50 + 60 * col, 100 + 50 * row, "" + id, "LEVEL", 50, 0.2);
                this.levelPage.addChild(levelPageText, this.levelBtn);
            
            }//row
            
        }//column
        
        //Game pages
        
        //Main page
        this.mainPage = new createjs.Container();
        this.mainPage.addChild(this.startBtn, this.settingsBtn);
        this.mainPage.displayed = true;
    
        //Gameover page
        this.gameoverPage = new createjs.Container();
        var  gameOverText = new createjs.Text("GAME OVER", "38px Verdana", "#000");
        gameOverText.textAlign = "center";
        gameOverText.x =  assets.canvasWidth / 2;
        gameOverText.y = assets.canvasHeight / 4;
        this.gameoverPage.displayed = false;
        this.gameoverPage.addChild(gameOverText, this.restartBtn, this.backBtn);
        
        //Pause page
        this.pausePage = new createjs.Container();
        var pauseText = new createjs.Text("PAUSED", "32px Verdana", "#000");
        pauseText = "center";
        pauseText.x =  assets.canvasWidth / 2;
        pauseText.y = assets.canvasHeight / 3;
        this.pausePage.displayed = false; 

        this.pausePage.addChild(this.resumeBtn, this.homeBtn);
    
        this.addChild(this.mainPage, this.mask);

       
        //handle a click on any game element
        this.on("click", this.handleClick);
        this.addEventListener("touchstart", this.hanldeTouch);
        
        stage.update();

    }
    
    Game.prototype._tick = function () {
    
        this.Container_tick();
        
        this.debug.text = "Time: " + createjs.Ticker.getTime();//createjs.Ticker.getMeasuredFPS();
        this.scoreField.text = "Score: " + Math.abs(world.x / 100 | 0);
        
        if(!this.paused){ 
            this.addChild(this.pauseBtn);
        }
        else {
        
            
            if(this.pauseBtn.isVisible) 
                {
                    this.removeChild(this.pauseBtn);
                }
        
        }
    
    }
    
    Game.prototype.handleTouch = function(event) {
    
        this.handleClick(event);
    
    }


    Game.prototype.handleClick = function(event) {
		//prevent extra clicks and hide text
		canvas.onclick = null;
        createjs.Sound.play("soundClick");

        //get the ID of the click event
        var id = event.target.id;
        //cases to handle button actions
        switch (id) {
            case "PLAY":
                this.fadeInOut(this.start);
                break;
            case "RESTART":
                this.fadeInOut(this.restart);
                break;
            case "SETTINGS":
                this.fadeInOut(this.settings);
                break;
            case "CREDITS":
                this.fadeInOut(this.credits);
                break;
            case "LEVEL":
                this.fadeInOut(this.getLevel, event);
                break;
            case "BACK":
                this.fadeInOut(this.backToMain);
                break;
            case "PAUSE":
                this.pauseGame();
                break;
            case "RESUME":
                this.resumeGame();
                break;
            case "HOME":
                this.fadeInOut(this.backToMain);
                break;
            default:
                break;
        
        }
    }
    
    Game.prototype.pauseGame = function () {

        this.paused = true;
        this.addChild(this.pausePage);
        this.pausePage.displayed = true; 
    
    }
    
    Game.prototype.resumeGame = function () {
    
        this.paused = false;
        this.removeChild(this.pausePage);
        this.pausePage.displayed = false; 
    
    }
    
    Game.prototype.settings = function () {
        
        //will bring upp the settings page
    
    }
    
    
    Game.prototype.backToMain = function () {
    
        this.removeChild(this.gameoverPage);
        if(this.pausePage.displayed) {
            this.removeChild(this.pausePage);
            this.pausePage.displayed = false;
        }
        this.addChild(this.mainPage);
        this.mainPage.displayed = true;
        this.gameoverPage.displayed = false;
        this.reinit();
        this.removeChild(this.pauseBtn);
    
    }
    
    Game.prototype.getLevel = function (event) {
        
        //pass the index from the selcted level button
        var index = event.target.levelSelected - 1;
        
        //remove the existing platform
        world.removeChild(platform);
        //get the selected level tile map
        
        this.level = contentManager.mapData[index];
       
        //create the new platforl object
        platform = new Platform(this.level);
        
        world.addChild(platform);
        
        this.restart();
        
        
    }
    
	
    Game.prototype.start = function () {
        
        if (this.mainPage.displayed) {
            
            this.removeChild(this.mainPage);
            this.mainPage.displayed = false;
        }
        
        
        this.addChild(this.levelPage);
        this.levelPage.displayed = true;
    
        
    }
    
    
    Game.prototype.restart = function() {
        
        //hide anything on stage and show the score
        if(this.levelPage.displayed) {
            this.removeChild(this.levelPage);
            this.levelPage.displayed = false;
        }
        else if (this.gameoverPage.displayed)
        {
            this.removeChild(this.gameoverPage);
            this.gameoverPage.displayed = false;
        }
 
        
        this.reinit();
        this.paused = false;
                                      
    }

    
    Game.prototype.gameover = function() {

        this.addChild(this.gameoverPage);
        this.gameoverPage.displayed = true;
        this.paused = true;
        this.removeChild(this.pauseBtn);
        player.initPosition();
    
    }
    
    Game.prototype.reinit = function () {
    
        //reinit the player position and the world position//check if this implementation iis correct        
        player.initPosition();
        world.initPosition();
    }
  
    Game.prototype.getRandomArbitrary = function  (min, max) {
        
        return Math.random() * (max - min) + min;
    }
    
    Game.prototype.fadeInOut = function(callback, event) {
        
        var e = event || null;
        createjs.Tween.get(this.mask, {loop:false}, true)
			.to({alpha:1},300).wait(100).call(callback, [e], this).to({alpha:0}, 300); // tween /alpha properties over time on click


    }
    
    window.Game= Game;
} (window));