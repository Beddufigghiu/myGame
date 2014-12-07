document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

//document.addEventListener("click", handleClick);
//document.addEventListener("pressup", handlePressup);
  
/*
function handleClick() {

    //do the click event
    if(!game.paused) keyDn = true;
}

function handlePressup() {

    //do the click event
    if(!game.paused) keyDn = false;
}
*/

function handleKeyDown(e) {
    
        if (!e) { var e = window.event; }
        switch (e.keyCode) {
            case 17: keyDn = true;
                break;
        }
}
    
function handleKeyUp(e) {
        if (!e) { var e = window.event; }
        switch (e.keyCode) {
            case 17: keyDn = false;
                break;

    }
}
