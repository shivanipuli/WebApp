#!/usr/bin/nodejs

var request = require('request');
var express=require('express');
var app=express();
var path=require('path');
var hbs=require('hbs');
var fs=require('fs')
var states = require('./js/statesInfo.js')
var cookieSession = require('cookie-session')
app.set('trust proxy', 1)
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'hbs');
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use(cookieSession({ name: 'snorkles',
    keys: ['enc_key_01_blah', 'enkey2_foo'] }))


var countRep=0;
var countDem=0;
app.get('/message',function(req,res){
    res.render("oneline", {message: req.query.message})
})
app.get('/illegal',[getState], function(req,res){
    party=req.query.party;
    wrongparty="democrat";
    if(party=="democrat"){
        wrongparty="republican";
    }
    var params = {
        party : party,
        wrongparty : wrongparty,
        state: res.locals.state
    }
    res.render("illegalvote", params)
})
app.get('/gameover', function(req, res){
    var message="";
    if(countDem>270){
        message="Democrats Win!"
    }
    else if(countRep>270){
        message="Republicans Win!"
    }
    if (countRep<270 & countDem<270)
    {
        message="Too slow, try again!"
    }
    countDem=0;
    countRep=0;
    res.render("gameover", {"message": message})
})
app.get('/', function(req,res){
    count=0;
    res.render('map.hbs')
})
app.get('/elect',[getState,getElect], function(req,res){
    var elements={"state": res.locals.state,
    "number": res.locals.elect, "rep": countRep, "dem": countDem}
    console.log(elements)
    res.render("sendmessage", elements)
    //res.send("HI" + res.locals.state)
})

function getState(req,res,next){
    console.log(states.stateObj)
    res.locals.state=states.stateObj[req.query.state]
    next();
}
function getElect(req,res,next){
    res.locals.elect=Number(states.stateElect[res.locals.state])
    if(req.query.dem=="true"){
    countDem=countDem+res.locals.elect;
    }
    else {
        countRep=countRep+res.locals.elect;
    }
    next();
}

app.get('/:error', function(req,res){
    res.render("homepage")
})
var listener = app.listen(app.get('port'), function(){
    console.log("Express server started on port: " + listener.address().port);
});