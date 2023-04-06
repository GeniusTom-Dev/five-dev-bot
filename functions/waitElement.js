waitForElement = function(variable){
    if(typeof variable !== "undefined"){
        console.log("granted")
    }
    else{
        setTimeout(waitForElement, 250);
    }
}

module.exports = {waitForElement}