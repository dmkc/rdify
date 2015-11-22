var PouchDB = require('pouchdb');
var Tracks;
var Playlists;
var App;
var Artists;
var Collection;

function init() {
  Tracks = PouchDB('tracks');
  App = PouchDB('rdify');
  Playlists = PouchDB('playlists');
  Artists = PouchDB('artists');
  Collection = PouchDB('collection');

  var settings = settings || {};

  return initTracks()
    .then(initPlaylists)
    .then(initCollection)
    .then(function(){
      App.put({
          _id: 'settings',
          installed: true
        })
    })
    .then(function(){
      return {
        Tracks,
        App,
        Playlists,
        destroy,
      };
    })
    .catch(function(e) {
      console.log('App initialized already');
      return {
        Tracks,
        App,
        Playlists,
        Collection,
        destroy,
      };
    });
}

function destroy() {
  Tracks.destroy();
  Playlists.destroy();
  App.destroy();
  Collection.destroy();
}

function initTracks() {
  // Indeces
  var design = {
    _id: '_design/tracks',
    views: {
      by_rdio_key: {
        map: function (doc) { emit(doc.key); }.toString()
      },
      by_isrc: {
        map: function (doc) { emit(doc.isrcs.join(',')); }.toString()
      }
    }
  };

  // Force-initialize the indeces
  return Tracks.put(design)
    .then(function() {
      return Tracks.query('tracks/by_rdio_key', {limit: 0});
    })
    .then(function() {
      return Tracks.query('tracks/by_isrc', {limit: 0});
    });
}

function initPlaylists() {
  var design = {
    _id: '_design/playlists',
    views: {
      by_rdio_key: {
        map: function (doc) { emit(doc.key); }.toString()
      },
    }
  };

  // Force-initialize the indeces
  return Playlists.put(design)
    .then(function() {
      return Playlists.query('playlists/by_rdio_key', {limit: 0});
    });
}

function initCollection() {
  var design = {
    _id: '_design/collection',
    views: {
      by_track_id: {
        map: function (doc) { emit(doc.trackId); }.toString()
      },
    }
  };

  return Collection.put(design)
    .then(function() {
      return Collection.query('collection/by_track_id', {limit: 0});
    });
}

module.exports = init;