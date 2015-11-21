'use strict';

var reqwest = require('reqwest');
var q = require('q');

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

  getOfflineTracks() {
    return this.bulkRequest('getOfflineTracks')
  }
}

module.exports = RdioAPI;
