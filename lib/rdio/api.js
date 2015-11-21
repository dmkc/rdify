'use strict';

var reqwest = require('reqwest');
var q = require('q');

var endpoints = require('./endpoints');

const BASE_URL = 'https://services.rdio.com/api/1/';

// function API () {}

// API.prototype.request = function request() {

// };

class RdioAPI {
  constructor(token) {
    this.token = token;
  }

  request(endpoint, data) {
    data = data || {};
    data.method = endpoint;

    return reqwest({
      url: BASE_URL + endpoint,
      data: data,
      crossOrigin: true,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token['access_token']
      }
    })
  }

  bulkRequest(endpoint, data) {
    var deferred = q.defer();
    var fullResponse = [];
    var data = data || {};
    var count = 50;

    // Recursively call
    function _makeRequest(start, count) {
      data.start = start;
      data.count = count;

      this.request(endpoint, data)
        .then(function(data) {
          if (!data.result.length) {
            deferred.resolve(fullResponse);
          } else {
            deferred.notify(data);
            fullResponse = fullResponse.concat(data.result);
            start += data.result.length;

            _makeRequest.apply(this, [start, count]);
          }
        }.bind(this));
    }

    _makeRequest.apply(this, [0, count]);

    return deferred.promise;
  }
}

// Auto-create methods for each API endpoint
Object.keys(endpoints).forEach(function(endpoint) {
  var requiredKeys = endpoints[endpoint].required || [];

  RdioAPI.prototype[endpoint] = function(data) {
    var args = Array.prototype.slice.apply(arguments);

    // Check that any required params to the API are passed in
    requiredKeys.forEach(function(required) {
      if (data[required] === undefined) {
        throw '`' + required + '` is a required parameter to the API';
      }
    });

    return this.bulkRequest.apply(this, [endpoint].concat(args));
  };
});

module.exports = RdioAPI;
