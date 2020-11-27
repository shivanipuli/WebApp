#!/usr/bin/nodejs

var request = require('request');
var express=require('express');
var app=express();
var path=require('path');
var hbs=require('hbs');
var fs=require('fs')
var cookieSession = require('cookie-session')

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'hbs');
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use(cookieSession({ name: 'snorkles',
    keys: ['enc_key_01_blah', 'enkey2_foo'] }))


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

app.get('/:error', function(req,res){
    res.render("homepage")
})
var listener = app.listen(app.get('port'), function(){
    console.log("Express server started on port: " + listener.address().port);
});