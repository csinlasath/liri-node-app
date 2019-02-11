require("dotenv").config();
var keys = require("./keys.js");
var moment = require("moment");
var axios = require('axios');
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
var fs = require("fs");

var lineBreak = "\n<---------------------------------------------------->\n";

var searchType = process.argv[2].toLowerCase().trim();
var searchTopic;
var textArray = [];

function mainLogic() {
    if (textArray.length > 0) {
        searchType = textArray[0].toLowerCase();
        searchTopic = textArray[1];
    }
    else {
        searchTopic = process.argv.slice(3).join(" ");
    }


    if (searchType === "concert-this") {
        var searchArtist = searchTopic;
        var concertURL = "https://rest.bandsintown.com/artists/" + searchArtist + "/events?app_id=codingbootcamp";

        axios.get(concertURL).then(function (response) {
            var date = response.data[0].datetime;

            console.log(lineBreak);
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
            console.log("Venue Date: " + moment(date).format("MM/DD/YYYY"));
            console.log(lineBreak);
        });
    }

    if (searchType === "spotify-this-song") {
        spotify.search({ type: "track", query: searchTopic, limit: 1 }).then(function (response) {
            console.log(lineBreak);
            console.log("Artists: " + response.tracks.items[0].artists[0].name);
            console.log("Song Name: " + response.tracks.items[0].name);
            console.log("Preview Link: " + response.tracks.items[0].preview_url);
            console.log("Album: " + response.tracks.items[0].album.name);
            console.log(lineBreak);
        }).catch(function (err) {
            console.log(err);
        });
    }

    if (searchType === "movie-this") {
        var movieName = searchTopic;
        var omdbAPIKey = "&apikey=trilogy";
        var omdbURL = "http://www.omdbapi.com/?t=" + movieName + omdbAPIKey;

        axios.get(omdbURL).then(function (response) {
            console.log(lineBreak);
            console.log(response.data.Title);
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Origin Country: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors/Actresses: " + response.data.Actors);
            console.log(lineBreak);
        });
    }
}

if (process.argv.length <= 3) {
    if (searchType === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }
            else {
                textArray = data.split(",")
                mainLogic();
            }
        });
    }

    if (searchType === "spotify-this-song") {
        spotify.search({ type: "track", query: "The Sign by Ace of Base", limit: 1 }).then(function (response) {
            console.log(lineBreak);
            console.log("Artists: " + response.tracks.items[0].artists[0].name);
            console.log("Song Name: " + response.tracks.items[0].name);
            console.log("Preview Link: " + response.tracks.items[0].preview_url);
            console.log("Album: " + response.tracks.items[0].album.name);
            console.log(lineBreak);
        }).catch(function (err) {
            console.log(err);
        });
    }
    if (searchType === "movie-this") {

        var omdbAPIKey = "&apikey=trilogy";
        var omdbURL = "http://www.omdbapi.com/?i=tt0485947" + omdbAPIKey;

        axios.get(omdbURL).then(function (response) {
            console.log(lineBreak);
            console.log(response.data.Title);
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Origin Country: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors/Actresses: " + response.data.Actors);
            console.log(lineBreak);
        });
    }
}
else {
    mainLogic();
}