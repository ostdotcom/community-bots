const Slimbot = require('slimbot');
const FS = require('fs');
const Path = require('path');
const PM = require('./privateConversation.js');

// rachins bot !!!! is in COMMUNITY
// const OfficiaLSimpLeToken_bot = "330790032:AAH2l8hR3bw2t3yM_mRalgQKTQty1qH5h1Q";
// @benjaminbollens_bot  t.me/benjaminbollens_bot
const BOT_BENJAMINBOLLEN = "438311760:AAEZnwm-sPvkcCBMRlgswO38VNuh_bcODmI";
const BOT_BENSBADBOT ="453337344:AAErhzC7OgzmSBILge1rrCnMQ1TUwdOTzi0";

const badbot = new Slimbot(BOT_BENSBADBOT);

// const CHAT_SIMPLETOKEN_COMMUNITY = -1001138398611;

const CHAT_DEBUG_COMMUNITY = -182770788;
const CHAT_DEBUG_ANNOUNCEMENTS = -1001320680086;

const CHAT_COMMUNITY = CHAT_DEBUG_COMMUNITY;
const CHAT_ANNOUNCEMENTS = CHAT_DEBUG_ANNOUNCEMENTS;

const CHAT_TYPE_SUPERGROUP = 'supergroup';
const CHAT_TYPE_GROUP = 'group';
const CHAT_TYPE_PRIVATE = 'private';

var users = require('./users.json')

// Received a message
// { message_id: 6,
//   from: 
//    { id: 287665506,
//      is_bot: false,
//      first_name: 'Benjamin',
//      last_name: 'Bollen',
//      username: 'benjaminbollen' },
//   chat: 
//    { id: -265214519,
//      title: 'Announcements',
//      type: 'group',
//      all_members_are_administrators: true },
//   date: 1510691507,
//   text: 'hi' }


// Received a message
// { message_id: 12114,
//   from: 
//    { id: 467280401,
//      is_bot: false,
//      first_name: 'daniel',
//      last_name: 'ttberg',
//      username: 'danielttberg' },
//   chat: 
//    { id: -1001138398611,
//      title: 'Simple Token Community',
//      username: 'simpletoken',
//      type: 'supergroup' },
//   date: 1510691604,
//   new_chat_participant: 
//    { id: 467280401,
//      is_bot: false,
//      first_name: 'daniel',
//      last_name: 'ttberg',
//      username: 'danielttberg' },
//   new_chat_member: 
//    { id: 467280401,
//      is_bot: false,
//      first_name: 'daniel',
//      last_name: 'ttberg',
//      username: 'danielttberg' },
//   new_chat_members: 
//    [ { id: 467280401,
//        is_bot: false,
//        first_name: 'daniel',
//        last_name: 'ttberg',
//        username: 'danielttberg' } ] }


// Make announcement
function makeAnnoucement(message) {
	return "Join the Official Simple Token announcement channel!\n" +
		"https://t.me/"+ message.chat.username +"/" + message.message_id
}


function checkUserForBot(message) {

}


// Register listeners
badbot.on('message', message => {
	if (message.chat && message.chat.id == CHAT_COMMUNITY) {
	 	badbot.sendMessage(message.chat.id, "Look at this other ICO!!")
	} 

	console.log("Received a message");
		    console.dir(message);
});


// Call API

badbot.startPolling();
