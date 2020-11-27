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
var answer = "HELLO";
/*  pool.query('SELECT id, s_name FROM students WHERE id=3', function (error, results, fields) {
  if (error) throw error;
  console.log("Raw Results")
  console.log("------------")
  console.log(results)
  answer=results;
      pool.end();
})*/
app.get('/', function(req, res) {
    res.render('homepage')
})
app.get('/bet', [genreTable], function(req, res) {
    var max = 0;
    for (var x = 1; x < 4; x++) {
        console.log(res.locals.genres[x].name + " vs " + res.locals.genres[max].name)
        if (res.locals.genres[x].rating > res.locals.genres[max].rating) {
            max = x;
        }
    }
    res.locals.mess = "Wrong. " + res.locals.genres[max].name + " has the highest average rating."
    if (res.locals.genres[max].name == req.query.genre) {
        res.locals.mess = "Correct!"
    }
    res.send(res.locals.mess)
})
app.get('/login', function(req, res) {
    if (typeof req.session.token == 'undefined') {
        console.log("authorizationUri" + authorizationUri)
        res.render('step1', {
            authUri: authorizationUri
        })
    } else {
        console.log("Defined token: " + req.session.token.access_token)
        res.render('ratings')
    }
});
app.get('/tables', [createTable, genreTable], function(req, res) {
    res.render('tables', {
        message: "",
        movie: res.locals.table,
        genre: res.locals.genres
    });

})
app.get('/ratings', [retrieveData, changeData, createTable, genreTable], function(req, res) {
    res.render('tables', {
        message: res.locals.message,
        movie: res.locals.table,
        genre: res.locals.genres
    });

})

function createTable(req, res, next) {
    res.locals.message = req.query.movie + " has average rating of " + res.locals.avgrate + " and " + res.locals.count + " votes."
    pool.query('select * from genres join movies on genres.genre_id=movies.genre;', function(error, results, fields) {
        if (error) throw error;

        res.locals.table = [];
        for (var x = 0; x < results.length; x++) {
            res.locals.table[x] = {
                name: results[x].movie_id,
                rating: results[x].rating,
                genre: results[x].name
            }
        }
        console.log("TABLE")
        console.log(res.locals.table);
        next();
    })
}

function genreTable(req, res, next) {
    pool.query('select name, avg(rating) from genres join movies on genres.genre_id=movies.genre group by genre_id;', function(error, results, fields) {
        if (error) throw error;
        console.log("results");
        console.log(results);
        res.locals.genres = results
        for (var x = 0; x < results.length; x++) {
            res.locals.genres[x] = {
                name: results[x].name,
                rating: results[x]['avg(rating)'],
            }
        }
        console.log("TABLE")
        console.log(res.locals.genres);
        next();
    })
}

function changeData(req, res, next) {
    console.log("NEW RATING")
    var count = res.locals.count
    var avgrate = res.locals.avgrate
    var rate = res.locals.rate;
    var sum = avgrate * count + rate;
    console.log("Count " + count)
    console.log("Avgrate " + avgrate)
    console.log("Rate " + rate)
    console.log("Sum " + sum)

    count = count + 1;
    avgrate = sum / count;
    //        console.log(movie+ " has average rating of " + res.locals.avgrate + " and count of " + res.locals.count);

    var new_rating = {
        rating: avgrate,
        count: count,
    }
    console.log(new_rating)
    pool.query('UPDATE movies SET ? WHERE movie_id= ?', [new_rating, req.query.movie], function(error, results, fields) {
        if (error) throw error;
        next();
    })
}

function retrieveData(req, res, next) {
    var movie = req.query.movie;
    var rate = req.query.rate;
    pool.query('SELECT * from movies where movie_id=?', movie, function(error, results, fields) {
        if (error) throw error;
        console.log("Raw results")
        console.log(results)
        var avgrate = results[0].rating;
        var count = results[0].count;
        console.log(movie + " has average rating of " + avgrate + " and count of " + count);
        res.locals.avgrate = Number(avgrate);
        if (count == 'undefined') {
            count = 0;
        }
        res.locals.count = Number(count);
        res.locals.rate = Number(req.query.rate)
        next();
    })
}
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