require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var fs = require("fs");
var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");
var spacer = "\n" + "----------------------------------------------------------------------------------------------------------------------------------" + "\n" + "\n";

function checkAll(command, userInput) {

  switch (command) {
    case "concert-this":
      concertIt(userInput);
      break;

    case "spotify-this-song":
      spotifyIt(userInput);
      break;

    case "movie-this":
      movieIt(userInput);
      break;

    case "do-what-it-says":
      doIt();
      break;
  }

}


// Bands In Town Function - concert-this

function concertIt(userInput) {

  var queryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
  axios
    .get(queryUrl)
    .then(response => {
      this.data = response.data;
      console.log(spacer + "\n" + "Here are your Concert Results for " + userInput + "\n")
      fs.appendFile("log.txt", spacer + "Here are your Concert Results for " + userInput + "\n", function (err) {
        if (err) throw err;
      });
      this.data.forEach((item) => {
        console.log("Name of Venue: " + item.venue.name + " | " + "Venue Location: " + item.venue.city + " | " + "Date of Event: " + moment(item.datetime).format("MM-DD-YYYY LT"))
        var logFile = ("Name of Venue: " + item.venue.name + " | " + "Venue Location: " + item.venue.city + " | " + "Date of Event: " + moment(item.datetime).format("MM-DD-YYYY LT") + "\n")
        fs.appendFile("log.txt", logFile, function (err) {
          if (err) throw err;
        });

      });
      console.log(spacer)
      fs.appendFile("log.txt", spacer, function (err) {
        if (err) throw err;
      });
      console.log("\n");
    })
    .catch(error => {
      if (error.response === undefined) {
        console.log("No Results have been found for the search: " + userInput);
      }
    })
};


// Spotify Function - spotify-this-song

function spotifyIt(userInput) {

  var spotify = new Spotify(keys.spotify);

  if (userInput === "") {
    userInput = "The Sign";
  }

  spotify.search({
    type: 'track',
    query: userInput,
    limit: 3
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
    }
    var song = data.tracks.items;
    fs.appendFile("log.txt", spacer, function (err) {
      if (err) throw err;
    });
    console.log(spacer + "Spotify song list" + "\n")
    song.forEach(stuff => {
      console.log("Artist Name: " + stuff.artists[0].name + "\nSong Name: " + stuff.name + "\nPreview Song : " + stuff.preview_url + "\nAlbum: " + stuff.album.name + "\n");
      var logFile = ("Artist Name: " + stuff.artists[0].name + "\nSong Name: " + stuff.name + "\nPreview Song : " + stuff.preview_url + "\nAlbum: " + stuff.album.name + "\n\n")
      fs.appendFile("log.txt", logFile, function (err) {
        if (err) throw err;
      });

    })
    fs.appendFile("log.txt", spacer, function (err) {
      if (err) throw err;
    });
    console.log(spacer)
  })
}

//OMDB Function - movie-this

function movieIt(userInput) {

  if (userInput === "") {
    userInput = "Mr. Nobody";
  }

  var omdbURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=e6d6be5a";

  axios.get(omdbURL).then(
    function (response) {
      console.log(spacer);
      console.log("\n\n" + "Here are the OMDB results for " + userInput + "\n");
      console.log("Title of the movie: " + response.data.Title);
      console.log("Year the movie came out: " + response.data.Year);
      console.log("IMDB Rating of the movie: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
      console.log("Country where the movie was produced: " + response.data.Country);
      console.log("Language of the movie: " + response.data.Language);
      console.log("Plot of the movie: " + response.data.Plot);
      console.log("Actors in the movie: " + response.data.Actors + "\n");
      console.log(spacer);

      var logMovie = spacer + "\nMovie title: " + response.data.Title + "\nYear released: " + response.data.Year + "\nIMDB rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + response.data.Ratings[1].Value + "\nCountry where produced: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + spacer;

      fs.appendFile("log.txt", logMovie, function (err) {
        if (err) throw err;
      });
    });

};

//Using Random.txt file - do-what-it-says

function doIt() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);

    } else {
      var noCommands = data.split(",");
      checkAll(noCommands[0], noCommands[1]);
    }
  });

};

checkAll(command, userInput);