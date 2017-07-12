// NPM requirements
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var Twit = require('twit');

// NPM setup modules
require('dotenv').config();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// declare app Routers
var homeRouter = require('./routes/home');

// Set view engine to .ejs and tell app where these files are placed
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Tell express which static files to serve
app.use(express.static('public'));

// Declare routes for the app to listen to
app.get('/', homeRouter);

app.get('/*', function(req, res){
	res.render('404');
});

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

io.on('connection', function(socket){
    socket.on('disconnected', function(room, user) {
        console.log( user + ' disconnected');
        socket.broadcast.to(room).emit('notifications', user, 'left the room');
    });
    socket.on('join room', function(room, user){
        socket.join(room);
        socket.broadcast.to(room).emit('notifications', user, 'joined the room')
        socket.on('search tweet', function(query){
            twitter.get('search/tweets', { q: query, count: 100 }, function(err, data, response) {
                if (err){
                    console.log(err);
                } else {
                    socket.emit('tweets', data)
                }
            })
        })
    	socket.on('chat message', function(msg, name, type){
    		io.to(room).emit('chat message', msg, name, this.id, type);
    	});
    })
    socket.on('leave room', function(room, user){
        socket.leave(room);
        socket.broadcast.to(room).emit('notifications', user, 'left the room');
    })
});

http.listen(process.env.PORT || 3000, function(req, res){
	console.log('App is running at localhost:3000')
});
