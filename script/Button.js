(function (window) {
    function Button(x, y, img, id, padding, alpha) {
        this.initialize(x, y, img, id, padding, alpha);
    }
     
    //Use Container as base class - prototype inheritance chain 
    Button.prototype = new createjs.Container();
    //store the Container initialize method into Container_initialize and override Button.prototype.initialize
    Button.prototype.Container_initialize = Button.prototype.initialize;
    Button.prototype.Container_tick = Button.prototype._tick; 

    Button.prototype.initialize = function (x, y, img, id, padding, alpha) {
        
        this.Container_initialize();
        
        this.on("mouseover", this.handleMouseOver);      
        
        //my extended Button class    
    
        //EaselJs settings to handle mouse events
        this.mouseChildren = false; //to avoid children events (example click at sub elements like inside glyphs)
        stage.enableMouseOver(10);

        this.padding = padding || 0;
        this.x = x;
        this.y = y;
        this.id = id;
        
        var btnWidth; 
        var btnHeight;
        

 
        //process the LEVEL buttons
        if(id == "LEVEL" ) {
            
            //extract the level index
            this.levelSelected = eval(img.valueOf());
            
            this.levelField = new createjs.Text("" + this.levelSelected, "40px Verdana", "#000");
            this.levelField.textAlign = "center";
            this.levelField.x = x ;
            this.levelField.y = y;
            btnWidth = 80; 
            btnHeight = 65;
            this.addChild(this.levelField);
        }

        else {
            
            //buttons glyphs assets by id
            this.glyphImg   = new createjs.Bitmap(img);
            btnWidth = this.glyphImg.image.width + this.padding;
	        btnHeight = this.glyphImg.image.height + this.padding;
            this.glyphImg.x = x - this.glyphImg.image.width / 2;
            this.glyphImg.y = y - this.glyphImg.image.height / 10;

        }
    
        //Button shape and Background
         this.rect = new createjs.Shape();
         this.rect.graphics.beginFill("#000").drawRoundRect(0, 0, btnWidth, btnHeight, 3);
         this.rect.alpha = alpha || 0;
         this.rect.x = this.x - btnWidth / 2;
         this.rect.y = this.y - btnHeight / 8;
            
         this.addChild(this.rect, this.glyphImg);
   

  
   
    }
    
    Button.prototype._tick = function () {
        
        this.Container_tick();    
    
    }
    
    Button.prototype.handleMouseOver = function(event) {
        
        //do something like enlarge button or glow etc...
        
    }

        
    window.Button= Button;
} (window));