#!/usr/bin/nodejs

var request = require('request');
var express=require('express');
var app=express();
var path=require('path');
var hbs=require('hbs');
var fs=require('fs')
var http=require('http')

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/img', express.static(path.join(__dirname, 'img')))
app.use('/controllers', express.static(path.join(__dirname, 'controllers')))

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'hbs');

var controllers=require('./controllers');
controllers.set(app);


var listener = app.listen(app.get('port'), function(){
console.log("Express server started on port: " + listener.address().port);
});