const Slimbot = require('slimbot');
const FS = require('fs');
const Path = require('path');
const PM = require('./privateConversation.js');
const chats = require('./configChats.js');

// rachins bot 
const OfficiaLSimpLeToken_bot = "330790032:AAH2l8hR3bw2t3yM_mRalgQKTQty1qH5h1Q";
// @benjaminbollens_bot  t.me/benjaminbollens_bot
const BEN_BADBOT_ID = 383374001;
const BOT_BENJAMINBOLLEN = "438311760:AAEZnwm-sPvkcCBMRlgswO38VNuh_bcODmI";

const sparky = new Slimbot(BOT_BENJAMINBOLLEN);

var kickedBots = require('./kickedbots.json');

var lastShownScamAlert = 1510713686; // 2:41:26 am UTC  |  Wednesday, November 15, 2017
const HOLD_OFF_SCAM_ALERT_MIN = 10; // hold off for 5 min between alerts minimum

const scamAlert = '***************************************************\n\n' +
"THE ONLY PLACE YOU CAN PURCHASE SIMPLE TOKENS IS AT https://sale.simpletoken.org  Please be sure you are logged in using your username and password. IF YOU SAW A DEPOSIT ADDRESS AND YOU WERE NOT LOGGED IN AT https://sale.simpletoken.org -- IGNORE IT, IT IS A SCAM.\n\n" + 
"PHISHING SCAM ALERT\n" + 
"👀We will NEVER send you a private or direct message to share information or click through a link.\n" + 
"👉Please beware of scammers posing as Simple Token execs and admins.\n\n" +
"The only way to buy Simple Token is at https://sale.simpletoken.org\n\n" +
"Please refer to official materials only. The Token Sale Registration Guide and the Purchase Guide can be found on https://sale.simpletoken.org\n\n";

function seconds_now(){ return Math.floor( Date.now() / 1000 ) }

function reportBadBot(badbot, date) {
	kickedBots[date] = {badbot, date};
    const json = JSON.stringify(kickedBots, null, 4);
    sparky.sendMessage(-227418557, "kicked bot "); //+ badbot.username +
    	// " with id " + badbot.id);
    FS.writeFile(Path.join(__dirname, 'kickedbots.json'), json, function(err) {
	    if(err) throw err;
	    console.log("Updated kickedbots.json");
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

function holdOffScamAlert() {
	if (lastShownScamAlert + HOLD_OFF_SCAM_ALERT_MIN > seconds_now()) {
		return true;
	}
	return false;
}

// Register listeners
sparky.on('message', message => {
	// Announcement channel
	if (message.chat && message.chat.id == chats.CHAT_ANNOUNCEMENTS) {
		// BotPolice ignores Annnouncement channel for now
		return;
	// Simple Token community channel
	} else if (message.chat) { // && message.chat.id == CHAT_COMMUNITY) {
	 	badbot = kickIfNewUserIsBot(message);
	 	if (badbot != undefined) {
	 		if (!holdOffScamAlert()) {
		 		const humansOnly = humansOnlyPolicy(badbot);
		 		sparky.sendMessage(message.chat.id, humansOnly);
		 		lastShownScamAlert = seconds_now();
		 	}
	 	}

	 	if (!holdOffScamAlert()) {
	 		sparky.sendMessage(message.chat.id, "hello Im a repeating bot;");
	 		lastShownScamAlert = seconds_now();
	 	}
	}
});

// Call API

sparky.startPolling();