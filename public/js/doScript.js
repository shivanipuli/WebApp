var states=document.getElementById('outlines');
var dem=true;
let intervalID=null;
var threeMinutes = 60;
document.getElementById("repBut").onclick=function(){
    console.log("Republican Button")
    dem=false;
}
document.getElementById("demBut").onclick=function(){
        console.log("Democratic Button")
    dem=true;
}
states.onclick=function(ev){
    if(intervalID===null){
        var ajax_params = {
        'url'     : "https://user.tjhsst.edu/2021spuli/message",
        'type'    : "get",
        'data'    : ("message=Click start to start the game."),
        'success' : onServerResponse
        }
        $.ajax( ajax_params )
    }
    else{
    state=document.getElementById(ev.path[0].id);
    console.log(state.className.baseVal)
    if(dem===true && (state.className.baseVal=="democrat" ||state.className.baseVal=="swing" )){
            state.style['fill']='blue'
            fetchVotes();
    }
    else if(dem===false & state.className.baseVal=="republican"||state.className.baseVal=="swing" ){
            state.style['fill']='red'
            fetchVotes();
        }
    else
        {
            illegalVotes(state.id, state.className.baseVal);
        }
}
}

document.getElementById("start-btn").onclick = function () {
        display = document.querySelector('#time');
    var myTime=startTimer(threeMinutes, display);
};
document.getElementById("stop-btn").onclick=function(){
    clearInterval(intervalID);
}
document.getElementById("reset-btn").onclick=function(){
    if(intervalID!==null) {
    clearInterval(intervalID);
    document.getElementById("time").innerHTML="0:00"
    threeMinutes=60;
    }
}
function illegalVotes(statename, party){
    var ajax_params = {
        'url'     : "https://user.tjhsst.edu/2021spuli/illegal",
        'type'    : "get",
        'data'    : ("state=" + statename + "&party=" + party),
        'success' : onServerResponse
    }

    $.ajax( ajax_params )
}
function myFunction() {
  var form_string = ""//("state=" + state.id + "&dem=" + dem);
    console.log(form_string)
    var ajax_params = {
        'url'     : "https://user.tjhsst.edu/2021spuli/gameover",
        'type'    : "get",
        'data'    : form_string,
        'success' : onServerResponse
    }

    $.ajax( ajax_params )
        clearInterval(intervalID);

}
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    intervalID=setInterval(function(){
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        threeMinutes=timer;
        timer--;
        if (timer < 0) {
            myFunction();

            display.textContent="00:00";
        }
    }, 1000);
}
function fetchVotes() {
    var form_string = ("state=" + state.id + "&dem=" + dem);
    console.log(form_string)
    var ajax_params = {
        'url'     : "https://user.tjhsst.edu/2021spuli/elect",
        'type'    : "get",
        'data'    : form_string,
        'success' : onServerResponse
    }

    $.ajax( ajax_params )
}
function onServerResponse (responseObject) {
    // Jquery will automatically convert text to an object if it
    //  recognizes that the result is JSON
    //console.log(responseObject)
    document.getElementById("count").innerHTML = responseObject;//.result;

}