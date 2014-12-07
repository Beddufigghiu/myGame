(function (window) {
    function ContentManager() {
        this.initialize();
    }
     
    //The LoadQueue object to handle loading elements
    var preload = new createjs.LoadQueue();
    var preloadLevels = new createjs.LoadQueue();
    var TOTAL_LEVELS = 2;
    
    ContentManager.prototype.initialize = function () {

    
        ContentManager.prototype.Loading = new createjs.Text("LOADING", "bold 32px Arial", "#FFF");
        this.Loading.textAlign = "center";
        this.Loading.x = canvas.width / 2;
        this.Loading.y = canvas.height / 2 - 50;
        
        ContentManager.prototype.loaderWidth = 400;
		var barHeight = 30;

		//cretae a loader bar Object
		//Made of a bar= rectangle Shape + a bar background
        ContentManager.prototype.loaderBar = new createjs.Container();

        ContentManager.prototype.bar = new createjs.Shape();
        this.bar.graphics.beginFill("#FE011B").drawRect(0, 0, 1, barHeight).endFill();
        ContentManager.prototype.backgroundBar = new createjs.Shape();
        var padding = 3
        this.backgroundBar.graphics.beginFill("#FFF").drawRect(0, 0, ContentManager.prototype.loaderWidth, barHeight).endFill();

        this.loaderBar.x = canvas.width/2 - ContentManager.prototype.loaderWidth / 2;
        this.loaderBar.y = canvas.height/2 - barHeight / 2; 
		this.loaderBar.addChild(this.backgroundBar, this.bar);  
        
        
        
        stage.addChild(this.loaderBar, this.Loading);

        //manifest contains all the assets loaded by the preload
        manifest = [
            {src: "assets/dino_complete4.png", id: "dino"},
            {src: "assets/cloud1.png", id: "cloud1"},
            {src: "assets/cloud2.png", id: "cloud2"},
            {src: "assets/cloud3.png", id: "cloud3"},
            {src: "assets/cloud4.png", id: "cloud4"},
            {src: "assets/newMountain.png", id: "mountain"},
            {src: "assets/newMountain2.png", id: "mountain2"},
            {src: "assets/sun.png", id: "sun"},
            {src: "assets/hill.png", id: "hill"},
            {src: "assets/hill2.png", id: "hill2"},
     //       {src: "json/level1.json", id: "mapJSON"},
        
            //glyphs
            {src: "assets/glyphs/ic_play_arrow_black_48dp.png", id: "play"},
            {src: "assets/glyphs/ic_settings_black_48dp.png", id: "settings"},
            {src: "assets/glyphs/ic_pause_circle_outline_grey600_18dp.png", id: "pause"},
            {src: "assets/glyphs/ic_replay_black_48dp.png", id: "restart"},
            {src: "assets/glyphs/ic_home_black_48dp.png", id: "home"},
            {src: "assets/glyphs/ic_arrow_back_black_48dp.png", id: "back"},
            //sounds
            {src: "assets/sound/SFX_Jump_33.wav", id: "soundJump"},
            {src: "assets/sound/Click 001.wav", id: "soundClick"},
            {src: "assets/sound/Kick 005.wav", id: "soundCrash"},
            {src: "assets/sound/Zoom Down 001.wav", id: "soundLevelComplete"}
            ];
        
        var levels = [];
        for (var i = 1; i <= TOTAL_LEVELS; i++) {
            
            levels [i - 1] = [{src:"json/level" + i + ".json", id: "mapJSON" + i}];
            preloadLevels.addEventListener("complete", this.handleLevelComplete);
            preloadLevels.loadManifest(levels[i - 1]);
            
        }
        
    
        //createjs.Sound.alternateExtensions = ["wav"];	// add other extensions to try loading if the src file extension is not supported
        preload.installPlugin(createjs.Sound);
        
        preload.addEventListener("complete", this.handleComplete);
        preload.addEventListener("progress", this.handleProgress);
        preload.addEventListener("error", this.handleError);
        preload.loadManifest(manifest);
        

         
 
    }
    
    
    ContentManager.prototype.handleComplete = function(event) {
        
        
        //frameData contains assets for player sprite animation
        ContentManager.prototype.spriteAssets = { images: [ preload.getResult("dino") ], 
                      frames: {width: 48, height: 44},
                      animations: {walk: [0, 3, "walk", 0.13]
                                 , jump: [1]
                                 , dead: [4]}
        };
    
    
        ContentManager.prototype.worldAssets = {
        
            sun: preload.getResult("sun"),
            cloud1: preload.getResult("cloud1"),
            cloud2: preload.getResult("cloud2"),
            cloud3: preload.getResult("cloud3"),
            cloud4: preload.getResult("cloud4"),
            mountain: preload.getResult("mountain"),
            mountain2: preload.getResult("mountain2"),
            hill: preload.getResult("hill"),
            hill2: preload.getResult("hill2"),
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            levelWidth: ContentManager.prototype.mapData[0].layers[0].width*40
        };
    
        ContentManager.prototype.gameAssets = {
        
            play: preload.getResult("play"),
            settings: preload.getResult("settings"),
            pause: preload.getResult("pause"),
            restart: preload.getResult("restart"),
            home: preload.getResult("home"),
            back: preload.getResult("back"),
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
    
        };
      
        //the callback method gets call at the end of the content manager loader and children
        ContentManager.prototype.onComplete();
    }
    
ContentManager.prototype.handleLevelComplete = function(event) {
        
     ContentManager.prototype.mapData = [];
    
        for (var i = 1; i <= TOTAL_LEVELS; i++) {
            
             ContentManager.prototype.mapData[i-1] = preloadLevels.getResult("mapJSON" + i);
        }

      
    }
    
ContentManager.prototype.handleProgress = function (event) {
    
    ContentManager.prototype.bar.scaleX = event.loaded * ContentManager.prototype.loaderWidth;

    stage.update(event);
    
    if(ContentManager.prototype.bar.scaleX === ContentManager.prototype.loaderWidth) {
        
        stage.removeChild(ContentManager.prototype.loaderBar, ContentManager.prototype.Loading);
    }


}

ContentManager.prototype.handleFileLoad = function (event) {
           
   
    }
     
	
ContentManager.prototype.handleError = function(event) {
            
		console.log("error while loading assets: " + event.target.src);
	
    }

ContentManager.prototype.SetDownloadComplete = function (callback) {
		
		//grabbing the callback method which is then called at the end of the handleComplete()

        ContentManager.prototype.onComplete = callback;

    }

    window.ContentManager = ContentManager;
}(window));