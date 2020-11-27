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
app.use('/js', express.static(path.join(__dirname, 'js')))
app.get('/', function(req,res){
res.render('homepage');
//res.send('Here are the options:');
//res.send('getweather \n getweekly \n getweather?lat=xxx&long=xxx');
console.log('Default')
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
app.get('/getweekly', [getAPI, getTemp], function(req,res){
if(res.locals.message!==undefined){
res.render("weathers", {message: res.locals.message})
}
else {
res.render('weather', {"temp" : res.locals.temp})
}})
app.get('/getweather', [getAPI, getTemp], function(req,res){
if(res.locals.message===undefined){
console.log("TEMP" + res.locals.temp[0])
res.locals.message=("The weather today is " + res.locals.temp[0] + " F");
if(req.query.json!==undefined){
res.locals.message="JSON: " + res.json(res.locals.message)
}
}
res.render('weathers',{ "message": res.locals.message});
});
app.get('/weatherform', function(req,res){
res.render('weatherform');
//res.redirect("getweather")
})
app.get('/:error', function(req,res){
res.render("weathers", {message: "Try getweekly or getweather"})
})

function getAPI(req,res,next){
res.locals.lat=0.0
res.locals.long=0.0
res.locals.message;
if(req.query.lat===undefined&&req.query.long===undefined){
console.log("class 1")
res.locals.lat=38.9085;
res.locals.long=-77.2405;
}
else if(isNaN(req.query.lat)||isNaN(req.query.long)){
console.log("class 2")
res.locals.message="The latitude and longitude must both be numbers"
next();
}
else{
console.log("class 3")
res.locals.lat=Number(req.query.lat);
res.locals.long=Number(req.query.long);
}
console.log("Lat"+ res.locals.lat + "Long" + res.locals.long);
console.log("MESSAGE" + res.locals.message);
if(res.locals.message===undefined)
{
var URL='https://api.weather.gov/points/' + res.locals.lat + ',' + res.locals.long
var params = {
url: URL,
headers : {
'User-Agent': 'request'
}
}
request.get(params, function(e,r,body){
console.log("MESSAGE: "+ res.locals.message);
var obj = JSON.parse(body);
if(obj.properties===undefined||obj.properties.forecast===undefined)
{
res.locals.message="This coordinate is outside of the US";
}
else{
res.locals.forecast=obj.properties.forecast;
console.log("Forecast: " + res.locals.forecast);
}
next();
})
}
}
function getTemp(req,res,next){
console.log("Entered getTemp")
if(res.locals.message!==undefined){
console.log('in here');
next();
}
else{

var params= {
url: res.locals.forecast,
headers: {
'User-Agent': 'request'
}
}
request.get(params, function(e,r,body){
var obj=JSON.parse(body);
res.locals.temp=[0,0];
var day;
console.log(body);
for(day=0; day<14; day++){
res.locals.temp[day]=obj.properties.periods[day].temperature;
}
console.log('TEMP: ' + res.locals.temp)
next();
})
}
}
var listener = app.listen(app.get('port'), function(){
console.log("Express server started on port: " + listener.address().port);
});