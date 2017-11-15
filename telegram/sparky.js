const Slimbot = require('slimbot');
const FS = require('fs');
const Path = require('path');
const PM = require('./privateConversation.js');
const chats = require('./configChats.js');
const TelegramConfig = require('../config/telegram_config');

// rachins bot 
const OfficiaLSimpLeToken_bot = "330790032:AAH2l8hR3bw2t3yM_mRalgQKTQty1qH5h1Q";
// @benjaminbollens_bot  t.me/benjaminbollens_bot
const BEN_BADBOT_ID = 383374001;
const BOT_BENJAMINBOLLEN = "438311760:AAEZnwm-sPvkcCBMRlgswO38VNuh_bcODmI";
// const BOT_BENSBADBOT = "346673403:AAHVb0cQaI2UsQP1Ae34ePuGP6pFIjDL3-Q";

const sparky = new Slimbot(BOT_BENJAMINBOLLEN);


var users = require('./users.json');
var kickedBots = require('./kickedbots.json');

const scamAlert = '***************************************************\n\n' +
"THE ONLY PLACE YOU CAN PURCHASE SIMPLE TOKENS IS AT https://sale.simpletoken.org  Please be sure you are logged in using your username and password. IF YOU SAW A DEPOSIT ADDRESS AND YOU WERE NOT LOGGED IN AT https://sale.simpletoken.org -- IGNORE IT, IT IS A SCAM.\n\n" + 
"PHISHING SCAM ALERT\n" + 
"👀We will NEVER send you a private or direct message to share information or click through a link.\n" + 
"👉Please beware of scammers posing as Simple Token execs and admins.\n\n" +
"The only way to buy Simple Token is at https://sale.simpletoken.org\n\n" +
"Please refer to official materials only. The Token Sale Registration Guide and the Purchase Guide can be found on https://sale.simpletoken.org\n\n";

// Make announcement
function makeAnnoucement(message) {
	return "Join the Official Simple Token announcement channel!\n" +
		"https://t.me/"+ message.chat.username +"/" + message.message_id
}


function reportBadBot(badbot, date) {
	kickedBots[date] = {badbot, date};
    const json = JSON.stringify(kickedBots, null, 4);
    sparky.sendMessage(chats.CHAT_REPORT, "kicked bot " + badbot.username +
    	" with id " + badbot.id);
    FS.writeFile(Path.join(__dirname, 'kickedbots.json'), json, function(err) {
	    if(err) {
	        return console.log(err);
	    }
    });
};

function humansOnlyPolicy(badbot) {
	return scamAlert + 
		"For your safety we kicked " + badbot.username + " out because it was a telegram bot.\n\n" +
		"***************************************************";
}


/// @dev whitelist our own bots if we have more than sparky
function kickIfNewUserIsBot(message) {
	if (message.chat && message.new_chat_member) {
		if (message.new_chat_member.is_bot) {
			sparky.kickChatMember(message.chat.id, message.new_chat_member.id);
			reportBadBot(message.new_chat_member, message.date);
			return message.new_chat_member;
		};
	}
};

// Register listeners
sparky.on('message', message => {
	// Announcement channel
	if (message.chat && message.chat.id == chats.CHAT_ANNOUNCEMENTS) {
		// Announcement channel
		// if (message.message_id) {
			// const announcement = makeAnnoucement(message);
		 //  	sparky.sendMessage(CHAT_COMMUNITY, makeAnnoucement(message));
			// console.log("announced:", announcement);
		// }
	} else if (message.chat) { // && message.chat.id == CHAT_COMMUNITY) {
	 	{
		 	sparky.sendMessage(message.chat.id, "Hello. I'm Sparky.");
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