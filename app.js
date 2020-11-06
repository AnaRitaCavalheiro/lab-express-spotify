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
//it has the cardencials of the user. -> process.ENV.KEY_NAME <--- adds a new environmental key
//comes from .env and it's an environment fiel that lives ONLY ON THE LOCAL COMPUTER AND NOT GITHUB for security reasions
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  //it's important to lookup how a specific API is structured
  // every API is independent and different
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// entery point of our app, according to express
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req,res) => {
  //I want to get the text from the FORM INPUT, so we use REG.QUERY.INPUT-FIELD
console.log('artist-search route is working')
let artist = req.query.artistName //req.query because it comes from a form

spotifyApi.searchArtists(artist) //changes dynamicly depending on the input
// . then because it's returning a promise
//data is a name of our choice, just need to make sure it's the same on the rest of the code
  .then(data => {
// to get the artist results we have to look that the API sructure----> see on the terminal with console.log
    console.log('The received data from the API: '); //consolo.log the recived data from the API
    let artistsList = data.body.artists.items;
console.log(artistsList)            // it's always an object so use {} --> use hbs to display on the web
    res.render('artist-search-results', {artistsList:artistsList}); // rendering he view
    //   1- route you send the data --//--  2- the argument we are sendding
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

        //passes the id that comes from the link
        
app.get('/albums/:artistId', (req, res, next) => {
    let artistId = req.params.artistId; //href link -> req.params (artistId is the param we want to get)
    console.log(artistId); // turns the params into dynemic params
    spotifyApi.getArtistAlbums(artistId).then(
        (data) => {
         
          console.log('Artist albums', data.body.items); //recived data form the api
          let albums = data.body.items;
          //the moment we get the info from the API we can do whatever we want with it

          res.render('album', {albums:albums})
        },           //key from views:just and assigned name(could be an array)
        (err) => {
          console.error(err);
      });
});



app.get('/tracks/:albumTracks', (req, res) => {
let artistTracks = req.params.albumTracks;

spotifyApi.getAlbumTracks(artistTracks).then(
  (data) => {
    console.log('response from getAlbumTracks', data.body);
    let ArtistAlbumTracks = data.body.items;
    res.render('tracks', {albumTracks:ArtistAlbumTracks});
  }, 
  (err)  => {
    console.log('Something went wrong!', err);
  });

})

     

  
});


  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
