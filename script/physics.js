//---------------------------
//detect Object over which dino is at returns object ID
function detectObject(rect1, rect2) {

var objId = -1;
    
     if (rect2.left < rect1.right && 
        rect2.right > rect1.left) {  
        
         objId = rect2.id;
     } 
    
    return objId;
         

}

//intersectRect takes two rectangle objects
function interstectRect(rect1, rect2) {
    
    //are we in x range
   if (rect2.left < (rect1.right - rect1.width / 4) && 
        rect2.right > (rect1.left + rect1.width / 4)) {       
        
        //if feet on block bound the y to the block level
       var thr = (player.velY/200 | 0 )*5 + 3;

       if ((rect2.top <= (rect1.bottom)) && !((rect2.top + thr) <= rect1.bottom)) {
            
            player.sprite.y = rect2.top - rect1.height / 2 | 0;
            onGround = true;
            player.velY = 0;
        }
        else {

            onGround = false;
        }
   }
    
    else onGround = false;
    
    
    return  (rect2.left < rect1.right ||
             rect2.right > rect1.left ||
             rect2.top < rect1.bottom ||
             rect2.bottom > rect1.top);
    
}
