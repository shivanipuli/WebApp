#!/usr/bin/nodejs

var express = require('express')
var simpleoauth2 = require("simple-oauth2");
var app = express();
var cookieSession = require('cookie-session')
var hbs=require('hbs')
var request = require('request');

app.set('trust proxy', 1)
app.set('port', process.env.PORT || 8080)
app.set('view engine', 'hbs');
app.use(cookieSession({ name: 'shivscookie',
    keys: ['key1', 'secondkey']}))


var ion_client_id="abcdefg"
var ion_client_secret="qwertyuiop"
var ion_redirect_uri="https://user.tjhsst.edu/2021spuli/oauthworker";
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
app.get('/', function(req,res){
    if (typeof req.session.token == 'undefined'){
        console.log("authorizationUri" + authorizationUri)
    res.render('step1', {authUri: authorizationUri})
    }
    else{
        console.log("Defined token: "+ req.session.token.access_token)
        res.render('complete', {token: req.session.token.access_token})
    }
});

app.get('/oauthworker',[helper], function(req,res){
    console.log("In worker: "+ res.locals.token);
    req.session.token=res.locals.token.token;
    res.redirect('https://user.tjhsst.edu/2021spuli/');
    //res.send('complete',{token: token} )
})
app.get('/logout', function(req,res){
    req.session.token=undefined;
    res.redirect('https://user.tjhsst.edu/2021spuli/')
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
var listener = app.listen(app.get('port'), function(){
console.log("Express server started on port: " + listener.address().port);
});