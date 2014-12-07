// loading layers
function initLayers(i) {
    
 //for (var i = 0; i < mapData.tilesets.length; i++) {
       var w = mapData.tilesets[i].tilewidth;
	   var h = mapData.tilesets[i].tileheight;
	   
    var imageData = {
		  images : [  mapData.tilesets[i].image ],
		  frames : {
			 width : w,
             height : h
          }
         
       };

    
    // create spritesheet
	tilesetSheet = new createjs.SpriteSheet(imageData);
	
	// loading each layer at a time
	for (var idx = 0; idx < mapData.layers.length; idx++) {
		var layerData = mapData.layers[idx];
		if (layerData.type == 'tilelayer') {
            initLayer(layerData, tilesetSheet, w, h);
        }
   
	}
    

}

// layer initialization
function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {
	for ( var row = 0; row < layerData.height; row++) {
		for ( var col = 0; col < layerData.width; col++) {
			// create a new Bitmap for each cell
			cellBitmap = new createjs.Sprite(tilesetSheet);
			// layer data has single dimension array
			var idx = col + row * layerData.width;
			// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
			cellBitmap.gotoAndStop(layerData.data[idx] - 1);

            //forget about isometrix now it's orthogonal
            cellBitmap.x = col * tilewidth;
			cellBitmap.y = row * tileheight;
			// add bitmap to stage  
            
			stage.addChild(cellBitmap);
            

		}
	}
}

//NOT USED
/*
// utility function for loading assets from server
function httpGet(theUrl) {
	var xmlHttp = null;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

// utility function for loading json data from server
function httpGetData(theUrl) {
	var responseText = httpGet(theUrl);
	return JSON.parse(responseText);
}
*/