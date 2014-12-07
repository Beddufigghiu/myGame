(function (window) {
    function Platform(mapJSON) {
        this.initialize(mapJSON);
    }
     
    //Use Container as base class - prototype inheritance chain 
    Platform.prototype = new createjs.Container();
    //store the Container initialize method into Container_initialize and override Game.prototype.initialize
    Platform.prototype.Container_initialize = Platform.prototype.initialize;
    Platform.prototype.Container_tick = Platform.prototype._tick; 

    Platform.prototype.initialize = function (mapJSON) {
        
        this.Container_initialize();
       
        //my extended Game class      
        this.map = mapJSON;
        this.initLayers();



    }
    
    Platform.prototype.updateRect = function (obj) {
        
        //this.Container_tick();
       
            this.Rect = {
                
                top: this.map.layers[1].objects[obj].y,                                              // The y-value of the top of the rectangle
                bottom: this.map.layers[1].objects[obj].y + this.map.layers[1].objects[obj].height,   // the y-value of the bottom of the rectangle
                right: this.map.layers[1].objects[obj].x + this.map.layers[1].objects[obj].width,     // the x-value of the right side of the rectangle
                left: this.map.layers[1].objects[obj].x,                                              // the x-value of the left side of the rectangle
                id: obj,
                height:  this.map.layers[1].objects[obj].height,
                width:  this.map.layers[1].objects[obj].width
            };
     }
    
    Platform.prototype.initLayers = function () {
    
 //for (var i = 0; i < mapData.tilesets.length; i++) {
       this.width = this.map.tilesets[0].tilewidth;
	   this.height = this.map.tilesets[0].tileheight;
	   
       var imageData = {
           images : [  this.map.tilesets[0].image ],
		   frames : {
               width : this.width,
               height : this.height
           }
       };

    
    // create spritesheet
	this.tilesetSheet = new createjs.SpriteSheet(imageData);
	
	// loading each layer at a time
	for (var idx = 0; idx < this.map.layers.length; idx++) {
		var layerData = this.map.layers[idx];
		if (layerData.type == 'tilelayer') {
            this.initLayer(layerData, this.tilesetSheet, this.width, this.height);
        }
   
	}
    

}

// layer initialization
    Platform.prototype.initLayer = function (layerData, tilesetSheet, tileWidth, tileHeight) {
        for ( var row = 0; row < layerData.height; row++) {
            for ( var col = 0; col < layerData.width; col++) {
                // create a new Bitmap for each cell
                this.cellBitmap = new createjs.Sprite(tilesetSheet);
                // layer data has single dimension array
                var idx = col + row * layerData.width;
                // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
                this.cellBitmap.gotoAndStop(layerData.data[idx] - 1);

                //forget about isometrix now it's orthogonal
                this.cellBitmap.x = col * tileWidth;
                this.cellBitmap.y = row * tileHeight;
                // add bitmap to stage  
                this.addChild(this.cellBitmap);
            }
        }
    }
        
    window.Platform= Platform;
} (window));