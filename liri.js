var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');

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
		name: 'search'
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

		} else if (user.technology === 'OMDB') {
			// Then run a request to the OMDB API with the movie specified
			request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&r=json", function(error, response, body) {

			  // If the request is successful (i.e. if the response status code is 200)
			  if (!error && response.statusCode === 200) {

			    // Parse the body of the site and recover just the imdbRating
			    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			    console.log('The movie\'s rating is: ' + JSON.parse(body).imdbRating);
			    console.log('Title of the movie: ' + JSON.parse(body).);
			    console.log('Year the movie came out: ' + JSON.parse(body).);
			    console.log('IMDB Rating of the movie: ' + JSON.parse(body).);
			    console.log('Country where the movie was produced: ' + JSON.parse(body).);
			    console.log('Language of the movie: ' + JSON.parse(body).);
			    console.log('Plot of the movie: ' + JSON.parse(body).);
			    console.log('Actors in the movie: ' + JSON.parse(body).);
			    console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).);
			    console.log('Rotten Tomatoes URL: ' + JSON.parse(body).);
			  }
			});

		} else if (user.technology === 'Twitter') {

		} else {
			// Running the readFile module that's inside of fs.
			// Stores the read information into the variable 'data'
			fs.readFile('best_things_ever.txt', 'utf8', function(err, data) {

			  // Break the string down by comma separation and store the contents into the output array.
			  var output = data.split(',');

			  // Loop Through the newly created output array
			  for (var i = 0; i < output.length; i++) {

			    // Print each element (item) of the array/
			    console.log(output[i]);
			  }

			});
		}


		console.log('==============================================');
		console.log('');
		console.log('Welcome ' + user.name);
		console.log('Your ' + user.pokemon + ' is ready for battle!');
		console.log('');
		console.log('==============================================');

	// If the user does not confirm, then a message is provided and the program quits. 
	}

	else {

		console.log('');
		console.log('');
		console.log('That\'s okay ' + user.name + ', come again when you are more sure.');
		console.log('');
		console.log('');

	}

});