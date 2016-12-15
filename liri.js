var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

function searchSpotify(song) {
	spotify.search({type: 'track', query: song.search}, function(err, data) {
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    }

	    var track = data.tracks.items[0];

	    console.log('Artist(s): ' + track.artists[0].name);
		  console.log('The song\'s name: ' + track.name);
		  console.log('A preview link of the song from Spotify: ' + track.preview_url);
		  console.log('The album that the song is from: ' + track.album.name);

	});
}

function searchOMDB(movie) {
	var searchReady = movie.search.replace(/ /g,'+');
	// Then run a request to the OMDB API with the movie specified
	request('http://www.omdbapi.com/?t=' + searchReady + '&y=&plot=full&tomatoes=true&r=json', function(err, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!err && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log('Title of the movie: ' + JSON.parse(body).Title);
	    console.log('Year the movie came out: ' + JSON.parse(body).Year);
	    console.log('IMDB Rating of the movie: ' + JSON.parse(body).imdbRating);
	    console.log('Country where the movie was produced: ' + JSON.parse(body).Country);
	    console.log('Language of the movie: ' + JSON.parse(body).Language);
	    console.log('Plot of the movie: ' + JSON.parse(body).Plot);
	    console.log('Actors in the movie: ' + JSON.parse(body).Actors);
	    console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating);
	    console.log('Rotten Tomatoes URL: ' + JSON.parse(body).tomatoURL);
	  }
	});
}

function grabMyTweets() {
	var params = {screen_name: 'a_ashbeck', count: 20};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {
	  if (!err) {

	  	tweets.forEach(function(tweet) {
	  		console.log('Tweet: ' + tweet.text + ' --Created at: ' + tweet.created_at);
	  	});
	    
	  }
	});
}

function liriBrains(user) {
	if (user.technology === 'spotify-this-song') {
		searchSpotify(user);

	} else if (user.technology === 'movie-this') {
		searchOMDB(user);

	} else if (user.technology === 'my-tweets') {
		grabMyTweets();

	} else {
		// Running the readFile module that's inside of fs.
		// Stores the read information into the variable 'data'
		fs.readFile('./random.txt', 'utf8', function(err, data) {
			if (err) {
				console.log(err);
			}
			
		  // Break the string down by comma separation and store the contents into the output array.
		  var output = data.split(',');

		  user.technology = output[0];
		  user.search = output[1];

		  liriBrains(user);
		});
	}
}

inquirer.prompt([
	{
		type: 'list',
		message: 'From where do you seek your answer?',
		choices: ['spotify-this-song', 'my-tweets', 'movie-this', 'do-what-it-says'],
		name: 'technology'
	},
	{
		type: 'input',
		message: 'What song you want me to look for, bruh?',
		name: 'search',
		default: 'The Sign Ace of Base',
		when: function(answers){
	    return answers.technology === 'spotify-this-song';
	  }
	},
	{
		type: 'input',
		message: 'What movie you want me to look for, bruh?',
		name: 'search',
		default: 'Mr. Nobody',
		when: function(answers){
	    return answers.technology === 'movie-this';
	  }
	},
	{
		type: 'confirm',
		message: 'Are you sure:',
		name: 'confirm',
		default: true

	}

// Once we are done with all the questions... 'then' we do stuff with the answers
// In this case, we store all of the answers into a 'user' object that inquirer makes for us. 
]).then(function (user) {
	// If the user confirms, we displays the user's name and pokemon from the answers. 
	if (user.confirm){
		liriBrains(user);

		console.log('');
		console.log('');
		console.log('( •_•)');
		console.log('( •_•)>⌐■-■');
		console.log('(⌐■_■)');
		console.log('');
		console.log('');
		console.log('Here\'s the goods, bruh:');
		console.log('');
		console.log('');

	// If the user does not confirm, then a message is provided and the program quits. 
	}

	else {

		console.log('');
		console.log('');
		console.log('(╯°□°）╯︵ ┻━┻');
		console.log('');
		console.log('Later, bruh. ಠ_ಠ');
		console.log('');
		console.log('');

	}

});