require('dotenv').config();


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req,res) => {
console.log('artist-search route is working')
let artist = req.query.artistName
spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    let artistDisplay = data.body.artists.items;
console.log(artistDisplay)
    res.render('artist-search-results', {result:artistDisplay})
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

//res.render('index')

app.get('/albums/:artistId', (req, res, next) => {
    let artistAlbumId = req.params.artistId
    spotifyApi.getArtistAlbums('artistAlbumId').then(
        function(data) {
          console.log('Artist albums', data.body);
        },
        function(err) {
          console.error(err);
        }
      );
      res.render('artist-search-results', {result:artistAlbumId})
  });

});


  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
