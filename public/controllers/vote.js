#!/usr/bin/nodejs

var request = require('request');
var express=require('express');
var app=express();
var path=require('path');
var hbs=require('hbs');
var fs=require('fs')

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'hbs');
app.use('/css', express.static(path.join(__dirname, 'css')))

app.get('/', function(req,res){
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
var listener = app.listen(app.get('port'), function(){
    console.log("Express server started on port: " + listener.address().port);
});