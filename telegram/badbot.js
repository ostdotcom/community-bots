const Slimbot = require('slimbot');
const FS = require('fs');
const Path = require('path');
const PM = require('./privateConversation.js');
const chats = require('./configChats.js');

// rachins bot !!!! is in COMMUNITY
// const OfficiaLSimpLeToken_bot = "330790032:AAH2l8hR3bw2t3yM_mRalgQKTQty1qH5h1Q";
// @benjaminbollens_bot  t.me/benjaminbollens_bot
const BOT_BENSBADBOT ="383374001:AAG_yd10lbQ8Vru029CXGf-os6b8Gy9UvQE";

const badbot = new Slimbot(BOT_BENSBADBOT);

var users = require('./users.json')

// Make announcement
function makeAnnoucement(message) {
	return "Join the Official Simple Token announcement channel!\n" +
		"https://t.me/"+ message.chat.username +"/" + message.message_id
}


function checkUserForBot(message) {

}


// Register listeners
badbot.on('message', message => {
	if (message.chat) {// && message.chat.id == chats.CHAT_COMMUNITY) {
	 	badbot.sendMessage(message.chat.id, "Look at this other ICO!!")

	 	// if (message.chat.text == 'leave') {
	 		console.log("MOVE OUT");
	 		badbot.leaveChat(message.chat.id);
	 	// }
	} 

	console.log("Received a message");
		    console.dir(message);
});


// Call API

badbot.startPolling();
