# Minor - Real Time Web

## Introduction
In this project I'm going to build a real time web application. I'm going to make a
website that visually represents a real-time data source. Nowadays people expect websites
to be real-time. Think about all the social media platforms. When someone posts something, you want
to see it immediately. Just like whatsapp, when someone sends you a message, you want to see it
directly, you don't want to wait around for multiple seconds.

This is why real-time is very popular right now. It's fast and more importantly, it's what people
expect, and as a frontend developer this is what should trigger you.

## Live Link
The live Twitter-chat can be found on the following link: <br/>
[Live Chatroom with Socket.io](https://minor-realtimeweb-twitterchat.herokuapp.com/)

## What did I make
For this project we worked with socket.io. I made a chat app, working with socket.io.
First I made the basics of a chat app. Online people can send a chat to other online people.
After that I added some features, such as, styling for the chat.
Also I checked if the message was send by yourself or by someone else, so I could style the
messages. What is send by yourself will be on the right side of the screen. And the received
messages will be on the left. Each message contains the username, and a day and time of when the message was send.

To make the chat a bit more special, I made a Twitter-chat. So, besides sending a normal chat.
You can also send tweets as a chat. On the panel on the left, you can search tweets that include
a word, hashtag or mention. You can select one tweet and send this in the chat. So you have to
find a tweet that actually says, what you want to say. This to make the chat a bit more challeging.

## Features
-	Live Chat
-	Twitter API
-	Day and Time per message
-	Styling, depending if send by you or someone else
-	Autoscrolling
-   Notification when someone enters or leaves the chat
-   Notification when user lost service or connection with the server
-   Chatrooms that have different subjects. So people know what kind of chats they can expect.

## Wishes
-   /

## Known Bugs
-   Notifications when someone enters or leavers the room, isn't working smoothly in the different rooms.
-   When a user leaves, and joines another room.

## How to install the project
### Create an app
Create an app on your twitter account. Your twitter account gives you some keys, which are
needed to communicate with the twitter API.

### Get code and set it up
To fetch the code from this repo run the following line in your terminal
```
git clone https://github.com/shyanta/minor-RealTimeWeb-twitterChat.git
```

When you have the code, run npm install to install al the npm packages
```
npm install
```

To get the API accessable, you have to create a .env file to set up some variables.
Place the .env file in the root of your app.
Set them op in the following way:
```
TWITTER_CONSUMER_KEY= yourConsumerKey
TWITTER_CONSUMER_SECRET= yourConsumerSecret
TWITTER_ACCESS_TOKEN= yourAccesToken
TWITTER_TOKEN_SECRET= yourTokenSecret

```

To get your app running, run the following scripts
```
npm start
```

## How does the code work
### Connect with twitter API
```js
var Twit = require('twit');

var twitter = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_TOKEN_SECRET
});
```
### Get tweets from the RestAPI

ClientSided JS:
```JS
tweetForm.addEventListener('submit', function(){
    event.preventDefault();
    socket.emit('search tweet', query.value);
    query.value = "";
});
```
When a person submits the form to search for tweets. The 'search tweet' emit is called with the
keyword inside. On the serverside the API call can be done with this keyword.

Serversided JS:
```js
socket.on('search tweet', function(query){
    twitter.get('search/tweets', { q: query , count: 100 }, function(err, data, response) {
        if (err){
            console.log(err);
        } else {
            socket.emit('tweets', data)
        }
    })
})
```
The 'search tweet' socket is received right here. The query is placed in a parameter in the
function. Inside this socket the API-call is done. The link that the twitter API handles to
search for tweets is a GET to 'search/tweets'. Inside this call the query is placed, so the API
knows for what keyword it has to search.

## Sources
-	[Get started chat - Socket.io](https://socket.io/get-started/chat/)
-   Twitter API
-   Stackoverflow
-   https://socket.io/docs/rooms-and-namespaces/
