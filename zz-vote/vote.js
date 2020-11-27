#!/usr/bin/nodejs

var request = require('request');
var express=require('express');
var app=express();
var path=require('path');
var hbs=require('hbs');
var fs=require('fs')
var states = require('./js/statesInfo.js')
var cookieSession = require('cookie-session')

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'hbs');
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use(cookieSession({ name: 'snorkles',
    keys: ['enc_key_01_blah', 'enkey2_foo'] }))


var countRep=0;
var countDem=0;
var username="";
app.get('/', function(req,res){
     res.render('homepage');
    console.log('Default');
})

app.get('/login',[user,count], function(req,res){
    res.render('login', {name: username, limit: "false"})

})
app.get('/logout', function(req,res){
    username="";
    req.session.views=0;
    res.render('login')
})
app.get('/content',[user,count], function(req,res){

  if(req.session.views>5 ){
      res.render("login", {name: username, limit: "true"})
}
else{
res.render('login', {limit: "false"})
}
 })

app.get('/reset', function(req,res){
    req.session.views=0;
    res.redirect("https://user.tjhsst.edu/2021spuli/")
})

function user(req,res,next){
    if(req.query.username!==undefined){
        username=req.query.username;
        console.log("stage 1")
    }
    else if(username===undefined){
        username="";
        console.log('stage 2')
    }
    else{
        console.log('stage 3')
    }
    console.log("Name: " + username)
    next();
}

function count(req,res,next){
if( typeof(req.session.views)===undefined) {            // if the cookie has not been set
      req.session.views = 1;                                //   set it to 1;
  } else {                                                  // otherwise,
      req.session.views++;                                  //   increment its value
  }
if(username!==""){
    req.session.views=0;
}
  console.log("Views: " + req.session.views)
  next();
}
app.get('/gameover', function(req, res){
    message="";
    if(countDem>270){
        message="Democrats Win!"
    }
    else if(countRep>270){
        message="Republicans Win!"
    }
    else{
        message="Too slow, try again!"
    }
    countDem=0;
    countRep=0;
    res.render("gameover", {"message": message})
})
app.get('/map', function(req,res){
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
app.get('/voting_form', function(req,res){
    console.log("default")
    res.render('voting')
})
app.get('/voting_worker', function(req,res){
    console.log("In voting worker")
    var sent="She sells sea shells by the sea store";
    if(req.query.letter=="P"){
        sent="Peter Piper picked a pipe of pickled peppers";
    }
    else if(req.query.letter=="D"){
        sent="Down the deep damp dark dank den";
    }
    else if(req.query.letter=="G"){
        sent="Gale’s great glass globe glows green";
    }
    res.render("sendmessage", {message: sent})
})

app.get("/madlib", function(req,res){
    res.render("madlib", {})
})
app.get("/getMadLib", function(req,res){
    var gender=req.query.gender;
    var g1="Girl";
        var g2="her";
        var g3="her";
        var g4="she";
    if(gender=="boy"){
        g1="Guy";
        g2="him";
        g3="his";
        g4="he";
    }
    var variables={"adv": req.query.adv,
                    "v": req.query.v,
                    "clothing": req.query.clothing,
                    "bodypart": req.query.bodypart,
                    "noun2": req.query.noun2,
                    "pnoun": req.query.pnoun,
                    "bodypart2": req.query.bodypart2,
                    "adj2": req.query.adj2,
                    "v2": req.query.v2,
                    "g1": g1, "g2":g2, "g3": g3, "g4": g4
    }
    res.render("fillin", variables)
})

app.get('/:error', function(req,res){
    res.render("homepage")
})
var listener = app.listen(app.get('port'), function(){
    console.log("Express server started on port: " + listener.address().port);
});