#!/usr/bin/nodejs

var express=require('express')
var app=express();
var hbs=require('hbs');

var num_facts=[['there is only 1 Shivani Puli who loves watermelon like I do', '1 and l look the same'],[ "twins always come in 2s",'2 fingers up for peace'],["a tricycle", 'lucky number three'], ["quatros is the most famous spanish number", "four letter words: food rude crud brat"],[ '99% of humans have five fingers, the rest are fish', "5 has a shapely figure"]]

app.set('port',process.env.PORT || 8080 );
app.set('view engine', 'hbs');

app.get('/', function(req,res){
    res.send('Welcome, please enter a number 1-5')
    console.log('Default page')
})
app.get('/:n', function(req,res){
    var str=req.params.n
    numb=Number(str);
    if(isNaN(numb)){
        res.send('This is not a number');
    }
    else{
    amt=Number(req.query.num_facts);

    if(isNaN(amt)){
        amt=1;
    }

    console.log("number = " + numb + "times=" + amt);

    if(numb>5){
        res.send('Sorry, this number is too big. Try a number between 1-5')
    }
    else{
            var labels={num : numb, fact : num_facts[numb-1].slice(0,amt) }
        if(req.query.format==='json'){
            res.json(labels)
        }
        else{
            res.render('testing' , labels );
        }
    }}
});

/*app.get('/help', function(req,res){
    res.render('help' , {format : JSON, arr : ['apple, banana, carrot']})
});*/


var newfunct=app.get('port');
function listens() {
        console.log('Express server started on port" ' + listener.address().port);
}
var listener=app.listen(newfunct, listens);