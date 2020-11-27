var weather=require('./weather.js');
var cookie=require('./cookie.js');
var foo=require('./foo.js');
var dogcat=require('./dogcat.js');
var map=require('./map.js');
var vote=require('./vote.js');
var numbers=require('./numbers.js');
var oauth=require('./oauth.js');

module.exports.set=function(app){

dogcat.set(app);

app.get('/', function(req,res){
    res.render('homepage');
});

};