var Importer = {};
var debug = require('debug')('rdify:rdio_importer');
/**
 * Import tracks from Rdio API, only inserting tracks that
 * aren't yet in the collection
 * @return {Promise} A promise object. Handle `.progress` events for updates
 *   on how many tracks are being currently processed
 */
Importer.importCollectionTracks = function importCollectionTracks(API, TracksDB) {
  return API.getTracksInCollection({'extras': 'isrcs'}, {pages: 2})
    .progress(function(res){
      res.result.forEach(function(track) {
        debug('Processing track', track.key);
        TracksDB.query('tracks/by_rdio_key', {
          startkey: track.key,
          endkey: track.key,
          limit: 1
        }).then(function(dbRes) {
          if (dbRes.rows.length > 0) {
            debug('Track already in library', track.key);
            return;
          }
          debug('Adding new track', track.key);
          return TracksDB.post(track);
        });
      });
    });
};

module.exports = Importer;