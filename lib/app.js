var Rdio = require('./rdio.js');
var CLIENT_ID = 'soo4vpjpozazhormtqzjqsv4sq';
var HOSTNAME = 'localhost:8000/';
var AUTH_URL = '#/auth/rdio';

console.log('initialized API', Rdio.Auth.getImplicitUrl(HOSTNAME+AUTH_URL, CLIENT_ID));

if (location.hash.indexOf(AUTH_URL) == 0) {
  var authUrl = location.hash.substr(AUTH_URL.length+1);
  var token = Rdio.Auth.parseTokenFromURL(authUrl);
  var api = new Rdio.API(token);
  api.getOfflineTracks()
    .progress(function(chunk){
      console.log('Got a chunk of results', chunk);
    })
    .then(function(result){
      console.log(result);
      debugger;
    })
}