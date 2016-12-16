var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var keys = require('./keys');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

// Function for searching spotify
function searchSpotify(song) {
	spotify.search({type: 'track', query: song.search}, function(err, data) {
			// Log any errors
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    // get data
	    } else {
	    	// set tracks to the appropriate JSON property
		    var track = data.tracks.items[0];

		    // Log data to the console
		    var logSpotify = 'Artist: ' + track.artists[0].name +
		    	'\nSong name: ' + track.name +
		    	'\nA preview link: ' + track.preview_url +
		    	'\nThe album title: ' + track.album.name;

		    console.log(logSpotify);
		}
	});
}

// Function for searching OMDB
function searchOMDB(movie) {
	// Set searchReady to movie with spaces replaced to +'s
	var searchReady = movie.search.replace(/ /g,'+');
	// Then run a request to the OMDB API with the movie specified
	request('http://www.omdbapi.com/?t=' + searchReady + '&y=&plot=full&tomatoes=true&r=json', function(err, response, body) {
		// Log any errors
		if (err) {
        console.log('Error occurred: ' + err);
        return;
    // If the request is successful
    } else if (!err && response.statusCode === 200) {

	    // Logs the requested data to console
	    var logOMDB = 'Title of the movie: ' + JSON.parse(body).Title +
		    '\nYear the movie came out: ' + JSON.parse(body).Year +
		    '\nIMDB Rating of the movie: ' + JSON.parse(body).imdbRating +
		    '\nCountry where the movie was produced: ' + JSON.parse(body).Country +
		    '\nLanguage of the movie: ' + JSON.parse(body).Language +
		    '\nPlot of the movie: ' + JSON.parse(body).Plot +
		    '\nActors in the movie: ' + JSON.parse(body).Actors +
		    '\nRotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating +
		    '\nRotten Tomatoes URL: ' + JSON.parse(body).tomatoURL;

		  console.log(logOMDB);
	  }
	});
}

// Function to grab tweets from my Twitter account :(
function grabMyTweets() {
	// Set params to equal the requested data sought.
	var params = {screen_name: 'a_ashbeck', count: 20};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {
		// Log any errors
		if (err) {
        console.log('Error occurred: ' + err);
        return;
    // If the request is successful
    } else if (!err) {
    	// Log the tweets and created time to console
	  	tweets.forEach(function(tweet) {
	  		console.log('Tweet: ' + tweet.text + ' --Created at: ' + tweet.created_at);
	  	});
	  }
	});
}

// LIRI's logic engine
function liriBrains(user) {
	if (user.technology === 'spotify-this-song') {
		searchSpotify(user);

	} else if (user.technology === 'movie-this') {
		searchOMDB(user);

	} else if (user.technology === 'my-tweets') {
		grabMyTweets();

	} else {
		// If the other options weren't chosem, LIRI takes a command pre-written in random.txt
		fs.readFile('./random.txt', 'utf8', function(err, data) {
			// Log any errors to the console
			if (err) {
				console.log(err);
			} else {
			  // Break the string down by comma separation and store the contents into the output array.
			  var output = data.split(',');

			  // set the user keys of importance to the piece in the array
			  user.technology = output[0];
			  user.search = output[1];

			  // Recursively summon the brains
			  liriBrains(user);
			}
		});
	}

	// Log searches to log.txt
	var logTxt = 'A user entered: ' + user.technology + ' ' + user.search + '\n';

  fs.appendFile('log.txt', logTxt);
}

// LIRI's CLI functionality
inquirer.prompt([
	{
		type: 'list',
		message: 'From where do you seek your answer?',
		choices: ['spotify-this-song', 'my-tweets', 'movie-this', 'do-what-it-says'],
		name: 'technology'
	},
	// Only displays if spotify was selected
	{
		type: 'input',
		message: 'What song you want me to look for, bruh?',
		name: 'search',
		default: 'The Sign Ace of Base',
		when: function(answers){
	    return answers.technology === 'spotify-this-song';
	  }
	},
	// Only displays if OMDB was selected
	{
		type: 'input',
		message: 'What movie you want me to look for, bruh?',
		name: 'search',
		default: 'Mr. Nobody',
		when: function(answers){
	    return answers.technology === 'movie-this';
	  }
	},
	// Asks for confirmation 
	{
		type: 'confirm',
		message: 'Are you sure:',
		name: 'confirm',
		default: true

	}
]).then(function (user) {
	// If the user confirms, this is promised to happen next
	if (user.confirm){
		// Call the brains
		liriBrains(user);

		// Log some cool stuff
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
		// Logs some cool stuff
		console.log('');
		console.log('');
		console.log('(╯°□°）╯︵ ┻━┻');
		console.log('');
		console.log('Later, bruh. ಠ_ಠ');
		console.log('');
		console.log('');
	}
// Catches any errors the promise would have otherwise swallowed and logs it
}).catch(function(e) {
	console.log(e);
});
