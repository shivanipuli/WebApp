#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF
var path=require('path');
var express = require('express')
var app = express();

// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM

app.set('port', process.env.PORT || 8080 );


// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages
app.get('/cats.jpg', function(req,res){
    res.sendFile(path.join(__dirname,'cant_even.jpeg'))
    console.log("user received dog");
});
app.get('/dog.jpg', function(req,res){
    res.sendFile(path.join(__dirname,'cat.jpeg'))
    console.log("cat image received");
});
app.get('/', function(req, res){
    //var fileName='index.html';
    //var fullPath = path.join(__dirname,fileName);
    //res.send('hola');
    res.sendFile(path.join(__dirname,'index.html'));
    console.log("default function used")
});
app.get('/fish.jpg', function(req, res){
    //var fileName='index.html';
    //var fullPath = path.join(__dirname,fileName);
    res.sendFile(path.join(__dirname,'index.html'));
    console.log('fish function');
});
app.get('/foo', function(req, res){
    res.send('requested foo');
});

app.get('/not_a_search', function(req, res){
    var Potato = req.query.potato;
    res.send('query parameter:' + Potato);
});
app.get('/pet', pet);

function pet(req,res){
    var type=req.query.type;
    if(type=='dog'){
       res.sendFile(path.join(__dirname,'cat.jpeg')); }
    if(type=='cat'){
        res.sendFile(path.join(__dirname,'cant_even.jpeg')); }
}




// -------------- listener -------------- //
// // The listener is what keeps node 'alive.'

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});