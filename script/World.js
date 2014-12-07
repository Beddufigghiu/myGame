(function (window) {
    function World(data) {
        this.initialize(data);
    }
     
    //Use Container as base class - prototype inheritance chain 
    World.prototype = new createjs.Container();
    //store the Container initialize method into Container_initialize and override Game.prototype.initialize
    World.prototype.Container_initialize = World.prototype.initialize;
    World.prototype.Container_tick = World.prototype._tick; 
    
    var count = 0;

    World.prototype.initialize = function (data) {
        
        this.Container_initialize();

        this.gravity = 2500;
        this.collision = false;
        //my extended Game class
        
        this.canvasW = data.canvasWidth;
        this.canvasH = data.canvasHeight;
        this.velX = 0;
        this.data = data;
        
        var width =  data.levelWidth;
        
        
        this.sky = new createjs.Shape();
        this.sky.graphics.beginLinearGradientFill(["#87cefa","#d7f6f6"], [0, 1], 0, 0, 0, 300).drawRect(0, 0, width, data.canvasHeight);
        this.sky.cache(0, 0, width, 600);
        this.addChild(this.sky);
        
        this.sun = new createjs.Bitmap(data.sun);        
        this.sun.velX = 0;
        this.addChild(this.sun);
        
        
        this.mountain = new createjs.Bitmap(data.mountain);
        this.mountain.velX = 0;
        this.addChild(this.mountain);
        
        this.mountain2 = new createjs.Bitmap(data.mountain2);
        this.mountain2.velX = 0;
        this.mountain2.alpha = 0.7;
        this.addChild(this.mountain2);
        
        this.hill = new createjs.Bitmap(data.hill);
        this.hill.velX = 0;
        this.addChild(this.hill);
        
        this.hill2 = new createjs.Bitmap(data.hill2);
        this.hill2.velX = 0;
        this.addChild(this.hill2);
        
        this.cloud1 = new createjs.Bitmap(data.cloud1);
        this.cloud1.velX = 0;
        
        this.cloud2 = new createjs.Bitmap(data.cloud2);
        this.cloud2.velX = 0;
        
        this.cloud3 = new createjs.Bitmap(data.cloud3);
        this.cloud2.velX = 0;
    
        this.cloud4 = new createjs.Bitmap(data.cloud4);
        this.cloud2.velX = 0;
        
        this.clouds = new createjs.Container();
        this.clouds.addChild(this.cloud1, this.cloud2, this.cloud3, this.cloud4);
        this.clouds.alpha = 0.8;
        this.addChild(this.clouds);
        
        this.initPosition(data);
        
        //arrays used to hanlde wrapping around function on background images
        this.array = [this.sun, this.hill, this.hill2, this.mountain, this.mountain2, this.cloud1, this.cloud2, this.cloud3, this.cloud4];
   
    }
    
    World.prototype.initPosition = function() {
        
        count = 0;
        this.sun.x = 700;
        this.sun.y = 50;
        
        this.mountain.setTransform(200, this.data.canvasHeight - this.mountain.image.height);
        this.mountain2.setTransform(400, this.data.canvasHeight - this.mountain2.image.height);
        this.hill.setTransform(0, this.data.canvasHeight - this.hill.image.height);
        this.hill2.setTransform(1200, this.data.canvasHeight - this.hill2.image.height);
        this.cloud1.setTransform(50, Math.random() * this.data.canvasHeight / 3);   
        this.cloud2.setTransform(300, Math.random() * this.data.canvasHeight / 3);
        this.cloud3.setTransform(700, Math.random() * this.data.canvasHeight / 3);
        this.cloud4.setTransform(1000, Math.random() * this.data.canvasHeight / 3);
        
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.collision = false;

    }
 
    
    World.prototype._tick = function () {
        
        this.Container_tick();
        
  
        //if game is active
        if(!game.paused)
        {
            
            this.sun.velX = - this.velX;
            this.cloud1.velX = - this.velX * 0.8;
            this.cloud2.velX = - this.velX * 0.75;
            this.cloud3.velX = - this.velX * 0.70;
            this.cloud4.velX = - this.velX * 0.65;
            this.hill.velX = - this.velX * 0.3;
            this.hill2.velX = - this.velX * 0.3;
            this.mountain.velX = - this.velX * 0.9;
            this.mountain2.velX = - this.velX * 0.85;
        }
        
        //while game is paused
        else { 
            
            this.sun.velX = 
            this.cloud1.velX = 
            this.cloud2.velX = 
            this.cloud3.velX = 
            this.cloud4.velX = 
            this.hill.velX = 
            this.hill2.velX = 
            this.mountain.velX = 
            this.mountain2.velX = 0;
            
        }
        
        this.sun.x += this.sun.velX * timeStep;
        this.cloud1.x += this.cloud1.velX * timeStep;
        this.cloud2.x += this.cloud2.velX * timeStep;
        this.cloud3.x += this.cloud3.velX * timeStep;        
        this.cloud4.x += this.cloud4.velX * timeStep;
        this.hill.x += this.hill.velX * timeStep;
        this.hill2.x += this.hill2.velX * timeStep;
        this.mountain.x += this.mountain.velX * timeStep;
        this.mountain2.x += this.mountain2.velX * timeStep;
        
        
        //hanlde the wrapping around of background elements
        for (var i = 0; i < this.array.length; i++) {
            
            if(!elementInView(this.array[i], this)) {
                this.array[i].x = this.array[i].x + (this.canvasW + this.array[i].image.width * 3/2);
            }
        }
        
        
            }
    
    //---------------------------
    //detect Object over which dino is at returns object ID
    World.prototype.detectObject = function (rect1, rect2) {
        
        this.objId = null;
        if ((rect1.right > (rect2.left - 20) && 
            rect1.left < rect2.right) && (rect1.top < rect2.top)) {  
            
            this.objId = rect2.id;
            this.objIdNext = rect2.id + 1;
        } 
        
        return this.objId;
        
}

    //intersectRect takes two rectangle objects
    World.prototype.interstectRect = function (rect1, rect2) {
    
    //are we in x range
        if (rect2.left < (rect1.right - rect1.width / 4) && 
            rect2.right > (rect1.left + rect1.width / 4)) {       
        
            //if feet on block bound the y to the block level
            var thr = (player.velY / 200 | 0 ) * 5 + 3;

            if ((rect2.top <= (rect1.bottom)) && !((rect2.top + thr) <= rect1.bottom)) {
            
                player.y = rect2.top - rect1.height / 2;
                player.onGround = true;
                player.velY = 0;
            }
            else {

                player.onGround = false;
            }
    }
    
    else player.onGround = false;
    
    //front collision - take only into account collision from front edge and top edge  of player
    this.collision = ((rect1.right > rect2.left)  && (rect1.bottom > (rect2.top + 15)));
        
    
    return  (rect2.left < rect1.right ||
             rect2.right > rect1.left ||
             rect2.top < rect1.bottom ||
             rect2.bottom > rect1.top);
    
}
    
    var elementInView = function(element, world) {
    
        if(element.x < (-(world.x + element.image.width + 50))) 
        {
            return false;
        }
        
        else 
            return true;
    
    }
    
    //shake will shake by the x and y intensities
    World.prototype.shake = function (x, y, time) {
        
        if(count < time) {
            this.x += game.getRandomArbitrary(-1, 1) * x;
            this.y += game.getRandomArbitrary(-1, 1) * y;
            count ++;
        }
        
        if (count == time) {
            this.y = 0;
        }

    }
    

        
    window.World = World;
} (window));