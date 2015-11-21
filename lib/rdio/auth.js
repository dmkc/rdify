var querystring = require('querystring');

const IMPLICIT_URL = 'https://www.rdio.com/oauth2/authorize';
var Auth = {};

/**
 * Get the implicit flow URL for authenticating user with Rdio
 */
Auth.getImplicitUrl = function(hostname, clientId) {
  if (!clientId) {
    throw "Client ID is necessary";
  }

  var params = {
    'response_type': 'token',
    'client_id': clientId,
    'redirect_uri': 'http://' + hostname,
  };

  return IMPLICIT_URL + '?' + querystring.stringify(params);
};

Auth.parseTokenFromURL = function(hash) {
  return querystring.parse(hash);
}

module.exports = Auth;