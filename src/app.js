var Rdio = require('../lib/rdio');
var RdioImporter = require('./rdio_importer');
var DB = require('./db');
var CLIENT_ID = 'soo4vpjpozazhormtqzjqsv4sq';
var HOSTNAME = 'localhost:8000/';
var AUTH_URL = '#/auth/rdio';
var api;

console.log('initialized API', Rdio.Auth.getImplicitUrl(HOSTNAME+AUTH_URL, CLIENT_ID));

if (location.hash.indexOf(AUTH_URL) == 0) {
  var authUrl = location.hash.substr(AUTH_URL.length+1);
  var token = Rdio.Auth.parseTokenFromURL(authUrl);
  api = new Rdio.API(token);

  // XXX: debug
  window.API = api;
}

function getUserPlaylists() {
  return API.getPlaylists({'extras': 'trackKeys'});
}

// database ..........
DB().then(function(res){
  window.DB = res;

  RdioImporter.importCollectionTracks(api, res.Tracks);
});