const FS = require('fs');
const Path = require('path');

var announcements = require('./knowledge.json');

function seconds_now(){ return Math.floor( Date.now() / 1000 ) }

function newAnnouncement(name, message) {
	// store message and when last sent
	announcements[name] = createAnnouncement( name, message )
	FS.writeFile(Path.join(__dirname, 'knowledge.json'), json, function(err) {
	    if(err) throw err;
	    console.log("Updated knowledge.json");
    });
};


/// @ dev provide warning if only recently sent
function getAnnouncement(name) {

}


function createAnnouncement( name, message ) {
  return {
    "name": name,
    "message": message,
    "lastSent": 0,
    "created": (new Date()).getTime()
  };
}

