#!/usr/bin/nodejs

var express = require('express')
var simpleoauth2 = require("simple-oauth2");
var mysql = require('mysql');
var app = express();
var hbs = require('hbs')
var request = require('request');
var cookieSession = require('cookie-session')
var path = require('path');

app.set('trust proxy', 1)
app.set('port', process.env.PORT || 8080)
app.set('view engine', 'hbs');
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))

app.use(cookieSession({
    name: 'shivscookie',
    keys: ['key1', 'secondkey']
}))

var months=[{name: "January", start:-2, days: 31},
{name: "February", start:-5, days: 29},
{name: "March", start:1, days: 31},
{name: "April", start:-2, days: 30},
{name: "May", start:-4, days: 31},
{name: "June", start:0, days: 30},
{name: "July", start:-2, days: 31},
{name: "August", start:-5, days: 31},
{name: "September", start:-1, days: 30},
{name: "October", start:-3, days: 31},
{name: "November", start:1, days: 30},
{name: "December", start:-1, days: 31}]

var ion_client_id = "abcdefg"
var ion_client_secret = "qwertyuiop"
var ion_redirect_uri = "https://user.tjhsst.edu/2021spuli/oauthworker";
var oauth2 = simpleoauth2.create({
    client: {
        id: ion_client_id,
        secret: ion_client_secret,
    },
    auth: {
        tokenHost: 'https://ion.tjhsst.edu/oauth/',
        authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
        tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
    }
});
var authorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uri
});

var pool = mysql.createPool({
    connectionLimit: 10,
    user: 'site_2021spuli',
    password: 'Xp5CWhT6tJwk5zPLEJkjYeen',
    host: 'mysql1.csl.tjhsst.edu',
    port: 3306,
    database: 'site_2021spuli'
});
app.get('/', function(req, res) {
    if (typeof req.session.token == 'undefined') {
        console.log("authorizationUri" + authorizationUri)
        res.render('step1', {
            authUri: authorizationUri
        })
    } else {
        console.log("Defined token: " + req.session.token.access_token)
        res.render('calendar')
    }
});

app.get('/oauthworker', [helper], function(req, res) {
    console.log("In worker: " + res.locals.token);
    req.session.token = res.locals.token.token;
    res.redirect('https://user.tjhsst.edu/2021spuli/login');
    //res.send('complete',{token: token} )
})
app.get('/logout', function(req, res) {
    req.session.token = undefined;
    res.render('homepage', {
            message: "You are now logged out. Go back to ratings page to login again"
        })
        //res.redirect('https://user.tjhsst.edu/2021spuli/')
})
app.get('/addEvent',[newEvent], function(req,res){
    var month=(Number(req.query.month)/100)-1;
    //res.send(res.locals.date + ":" + req.query.event)
    res.redirect("https://user.tjhsst.edu/2021spuli/" + month)
})
app.get('/:month',[createEvents,createDates], function(req,res){
    var prev="/2021spuli/"+ (Number(req.params.month)-1);
    var next="/2021spuli/"+ (Number(req.params.month)+1);
    if(Number(req.params.month)===0){
        prev=null;
    }
    if(Number(req.params.month)===11){
        next=null;
    }
    res.render("calendar", {prev: prev, next: next, month: res.locals.month.name, dates: res.locals.dates})
})
async function helper(req,res,next){

        var theCode=req.query.code;
        var options={
            'code': theCode,
            'redirect_uri': ion_redirect_uri,
            'scope': 'read',
        };

        try{
    var result=await oauth2.authorizationCode.getToken(options);
    var token=oauth2.accessToken.create(result);
    next();
}
    catch(error){
        console.log("error " + error)
        res.send(error)
    }
}
function createEvents(req,res,next){
        var lower=(Number(req.params.month)+1)*100;
        var upper=lower+100;
        console.log("LOWER" + lower);
        console.log("UPPER" + upper)
    pool.query('select * from calendar where date between ? AND ? order by date',[lower,upper], function(error, results, fields) {
            if(error) throw error;
            var string=JSON.stringify(results);
            res.locals.events=JSON.parse(string);
            console.log("in pool")
            console.log(res.locals.events)
            next();
        })
}
function newEvent(req,res,next){
    res.locals.date=Number(req.query.month)+Number(req.query.day);
    pool.query('insert into calendar(date, event) values (?, ?)',[res.locals.date,req.query.event], function(error,results,fields){
        if(error) throw error;
    console.log(res.locals.date + " : " + req.query.event)
    next();
    })
}

function createDates(req,res,next){
    var month=months[Number(req.params.month)];
    var dates=[];
    var day=month.start;
    var eventIndex=0;
    while(day<=month.days){
        var week=[];
        for(var y=0;y<7;y++){
        if(day<=0){
            week.push(null)
        }
        else if(day<=month.days){
            var myEvents=[];
            var date=0;
            if(eventIndex<res.locals.events.length){
            date=res.locals.events[eventIndex].date%100;
            }
            if(date==day){
            do{
                myEvents.push(res.locals.events[eventIndex].event)
                eventIndex++;
                if(eventIndex<res.locals.events.length){
                date=res.locals.events[eventIndex].date%100;
                }
            }while(date==day & eventIndex<res.locals.events.length)
            }
                var d={
                date: day,
                events : myEvents
                };
                week.push(d);
        myEvents=[];
        }
            day++;
        }
        dates.push(week);
    }
    //console.log(dates);
    res.locals.dates=dates;
    res.locals.month=month
    next();
}
async function helper(req, res, next) {

    var theCode = req.query.code;
    var options = {
        'code': theCode,
        'redirect_uri': ion_redirect_uri,
        'scope': 'read',
    };

    try {
        var result = await oauth2.authorizationCode.getToken(options);
        var token = oauth2.accessToken.create(result);
        res.locals.token = token
        next();
    } catch (error) {
        console.log("error " + error)
        res.send(error)
    }
}

var listener = app.listen(app.get('port'), function() {
    console.log('Express server started on port: ' + listener.address().port);
});