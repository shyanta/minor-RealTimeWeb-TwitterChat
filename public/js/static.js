// variables for chat messages
var messageForm = document.getElementById('message_form');
var message = document.getElementById('field-message');
var messages = document.getElementById('messages');
// variables for tweet results
var tweetForm = document.getElementById('tweet_form');
var query = document.getElementById('tweet-query');
var tweetsList = document.getElementById('tweet-results');
var sendTweet = document.getElementById('send-tweet');
// Variable for username
var userNameInput = document.getElementById('username');
var userSection = document.getElementById('user');
var userForm = document.getElementById('user_form');
// Variable for connection bar
var noConnection = document.getElementById('connection');

var username ="";
var socket = io();
userSection.setAttribute("class", "");
sendTweet.setAttribute('class', 'hidden');

if (username === ""){
	userSection.setAttribute("class", "visible");
	userForm.addEventListener('submit', function(){
		event.preventDefault();
		username = userNameInput.value;
		userNameInput.value="";
		userSection.setAttribute("class","");
        var status = 'joined';
        socket.emit('notification', username, status);
	})
}
tweetForm.addEventListener('submit', function(){
    event.preventDefault();
    socket.emit('search tweet', query.value);
    query.value = "";
});

messageForm.addEventListener('submit', function(){
	event.preventDefault();
	socket.emit('chat message', message.value, username, 'chat');
	message.value = "";
	return false;
});

sendTweet.addEventListener('click', function(){
    var img = document.querySelector('.active img').getAttribute('src');
    var twitterName = document.querySelector('.active #twitter-name').innerHTML;
    var screenName = document.querySelector('.active #screen-name').innerHTML;
    var tweetBody = document.querySelector('.active #tweet-body').innerHTML;
    var active = {
        'img' : img,
        'name' : twitterName,
        'mention' : screenName,
        'body' : tweetBody
    }

    socket.emit('chat message', active, username, 'tweet');
})

socket.on('connect', function(){
    var status = 'joined';
    if (username !== ""){
        socket.emit('notification', username, status);
    }
	noConnection.removeAttribute("class", "visible");
})
socket.on('disconnect', function() {
	noConnection.setAttribute("class", "visible");
    var status = 'left';
    socket.emit('notification', username, status);
})

socket.on('notification', function(name, status) {
    messages.innerHTML += '<span class="notification">' + name + ' '+ status + ' the room</span>';
	messages.scrollTop = messages.scrollHeight;
})

socket.on('tweets', function(data){
    sendTweet.setAttribute('class', 'hidden');
    tweetsList.innerHTML = "";
    for (var i = 0; i < data.statuses.length; i++) {
    	tweetsList.innerHTML += '<li class="tweet"><header><img src="' + data.statuses[i].user.profile_image_url + '"/></header><div class="info"><p><span id="twitter-name">'+ data.statuses[i].user.name + '</span> <span id="screen-name">@'+ data.statuses[i].user.screen_name +'</span></p><p id="tweet-body">' + data.statuses[i].text  + '</p></div></li>';
    }
    var tweets = document.querySelectorAll('.tweet');
    tweets.forEach(function(tweet){
        tweet.addEventListener('click', function(){
            if (document.querySelector('.active') !== null){
                document.querySelector('.active').removeAttribute('class');
            }
            sendTweet.removeAttribute('class')
            this.setAttribute('class', 'active');
        })
    })
})

socket.on('chat message', function(msg, name, id, type){
	var status;
		if (socket.id === id) {
			status = "sent";
            name = "U";
		} else {
			status = "received";
		}
	var d = new Date();
	var day = d.getDay();
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var hour = d.getHours();
	var minute = d.getMinutes();
	var minuteString = minute.toString();
		if(minuteString.length == 1){
			minute = '0' + d.getMinutes();
		} else {
			minute = '' + d.getMinutes();
		}
    if (type === 'chat'){
    	messages.innerHTML += '<li data-status="' + status + '"><header>'+ name + ':</header><p>' + msg + '</p><footer><p> Posted on '+ days[day] + ', ' + hour + ':' + minute + '</footer></li>';
    } else if (type === 'tweet'){
    	messages.innerHTML += '<li data-status="' + status + '"><header>'+ name + ' says:</header><div id="tweet"><div class="image"><img src="' + msg.img + '"/></div><div class="info"><p>'+ msg.name +'<span id="screen-name">'+ msg.mention +'</span><p id="tweet-body">' + msg.body  + '</p></div></div><footer><p> Posted on '+ days[day] + ', ' + hour + ':' + minute + '</footer></li>';
    }
	messages.scrollTop = messages.scrollHeight;
});
