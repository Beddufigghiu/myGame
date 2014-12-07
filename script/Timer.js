(function (window) {
    function Timer() {
        this.initialize();
    }
   
    //Use Container as base class - prototype inheritance chain 
     //store the Container initialize method into Container_initialize and override Game.prototype.initialize
     
    var startTime;
    var firstPass;

    
    Timer.prototype.initialize = function () {

        this.time = 0;
        this.output = false;
        startTime = 0;
        firstPass = true;

    }

    
    Timer.prototype.delay = function (input, timeDelay) {
        
        this.time = createjs.Ticker.getTime();
    
        if(firstPass) {
            startTime = this.time;
            firstPass = false;
        }
        
        var elapsedTime = this.time - startTime;
        
        if(elapsedTime < timeDelay) {
            this.output = false;
        }
        else {
            this.output = input;
        }
        
        return this.output;
    
    }
    
    Timer.prototype.setReset = function (reset) {
        
        firstPass = true;
        
        return reset;
    }



    window.Timer = Timer;
} (window));