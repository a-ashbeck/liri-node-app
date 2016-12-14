var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var regEx = require('escape-string-regexp');

inquirer.prompt([
	{
		type: 'list',
		message: 'From where do you seek your answer?',
		choices: ['Spotify', 'Twitter', 'OMDB', 'I\'m Feeling lucky, punk.'],
		name: 'technology'
	},
	{
		type: 'input',
		message: 'What would you like me to look for, bruh?',
		name: 'search',
		when: function(answers){
	    return answers.technology === 'Spotify' || 'OMDB';
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
		if (user.technology === 'Spotify') {
			spotify.search({type: 'track', query: user.search}, function(err, data) {
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

		} else if (user.technology === 'OMDB') {
			var searchReady = user.search.replace(/ /g,'+');
			// Then run a request to the OMDB API with the movie specified
			request('http://www.omdbapi.com/?t=' + searchReady + '&y=&plot=full&tomatoes=true&r=json', function(error, response, body) {

			  // If the request is successful (i.e. if the response status code is 200)
			  if (!error && response.statusCode === 200) {

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

		} else if (user.technology === 'Twitter') {

		} else {
			// Running the readFile module that's inside of fs.
			// Stores the read information into the variable 'data'
			fs.readFile('random.txt', 'utf8', function(err, data) {

			  // Break the string down by comma separation and store the contents into the output array.
			  var output = data.split(',');

			  // Loop Through the newly created output array
			  for (var i = 0; i < output.length; i++) {

			    // Print each element (item) of the array/
			    console.log(output[i]);
			  }

			});
		}

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