const Slimbot = require('slimbot');
const FS = require('fs');
const Path = require('path');
const PM = require('./privateConversation.js');

// rachins bot 
const OfficiaLSimpLeToken_bot = "330790032:AAH2l8hR3bw2t3yM_mRalgQKTQty1qH5h1Q";
// @benjaminbollens_bot  t.me/benjaminbollens_bot
const BOT_BENJAMINBOLLEN = "438311760:AAEZnwm-sPvkcCBMRlgswO38VNuh_bcODmI";
const BOT_BENSBADBOT ="346673403:AAHVb0cQaI2UsQP1Ae34ePuGP6pFIjDL3-Q";

const badbot = new Slimbot(BOT_BENSBADBOT);
const sparky = new Slimbot(BOT_BENJAMINBOLLEN);

// const CHAT_SIMPLETOKEN_COMMUNITY = -1001138398611;

const CHAT_DEBUG_COMMUNITY = -182770788;
const CHAT_DEBUG_ANNOUNCEMENTS = -1001320680086;
const CHAT_DEBUG_REPORTING = -227418557;

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


// { message_id: 61,
//   from: { id: 336537509, is_bot: false, first_name: 'Banks' },
//   chat: 
//    { id: -182770788,
//      title: 'BensBotchannel',
//      type: 'group',
//      all_members_are_administrators: true },
//   date: 1510702017,
//   new_chat_participant: 
//    { id: 330790032,
//      is_bot: true,
//      first_name: 'OfficiaLSimpLeTokenBot',
//      username: 'OfficiaLSimpLeToken_bot' },
//   new_chat_member: 
//    { id: 330790032,
//      is_bot: true,
//      first_name: 'OfficiaLSimpLeTokenBot',
//      username: 'OfficiaLSimpLeToken_bot' },
//   new_chat_members: 
//    [ { id: 330790032,
//        is_bot: true,
//        first_name: 'OfficiaLSimpLeTokenBot',
//        username: 'OfficiaLSimpLeToken_bot' } ] }

// function reportRestrictedBot(badbot, date) {
// 	badbot.rejectedTime = date
// 	users.

// };


function kickIfNewUserIsBot(message) {
	if (message.chat && message.new_chat_member) {
		if (message.new_chat_member.is_bot) {
			sparky.kickChatMember(message.chat.id, message.new_chat_member.id);
			// const report = reportRestrictedBot(message.new_chat_member, message.date);
			return true;
		};
	}
	return false;
};


// Register listeners
sparky.on('message', message => {
	// Announcement channel
	if (message.chat && message.chat.id == CHAT_ANNOUNCEMENTS) {
		// Announcement channel
		if (message.message_id) {
			const announcement = makeAnnoucement(message);
		  	sparky.sendMessage(CHAT_COMMUNITY, makeAnnoucement(message));
			console.log("announced:", announcement);
		}
	} else if (message.chat && message.chat.id == CHAT_COMMUNITY) {
	 	if (kickIfNewUserIsBot(message)) {
	 		sparky.sendMessage(message.chat.id, 
	 			"BOT WARNING: " + message.new_chat_member.username);
	 	}
	} //else if (message.chat && message.chat.type = CHAT_TYPE_PRIVATE) {

	// }

	console.log("Received a message");
		    console.dir(message);
});

// Because each inline keyboard button has callback data, you can listen for the callback data and do something with them
sparky.on('callback_query', query => {
  if (query.data === 'hello') {
    sparky.sendMessage(query.message.chat.id, 'Hello to you too!');
  }
});


// Call API

sparky.startPolling();
