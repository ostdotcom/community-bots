const Slimbot = require('slimbot');
const FS = require('fs');
const Path = require('path');
const config = require('../config/telegram_config');
const logger = require('../helpers/CustomConsoleLogger');
const Repeater = require('./MessageRepeater');

const kickedBotsDataFilePath  = './data/kickedbots.json';
var kickedBots = require(  kickedBotsDataFilePath );

const sparky = new Slimbot( config.BOT_TOKEN );

logger.log("Environment:" , config.ENV);


//A list of chatIds to police.
var policedChats = (config.POLICE_COMMUNITIES || []).concat([]);

//A method to add chatIds to police.
//Usage: addChatsToPolice(chatId1,chatId2.... );
function addChatsToPolice() {
	var args = Array.prototype.slice.call(arguments);
	args.forEach(function ( chatId ) {
		if ( policedChats.includes( chatId ) ) {
			return;
		}
		policedChats.push( chatId );
	});
}

//Remove ChatIds to Monitor.
//Usage: removeChatsToPolice(chatId1,chatId2.... );
function removeChatsToPolice() {
	var args = Array.prototype.slice.call(arguments);
	args.forEach(function ( chatId ) {
		var chatIndx = policedChats.indexOf( chatId );
		if ( chatIndx > -1 ) {
			policedChats.splice( chatIndx, 1 );
		}		
	});	
}

function shouldPoliceChat( chatId ) {
	return policedChats.includes( chatId );
}


var CHAT_ANNOUNCEMENTS = config.ANNOUNCEMENTS_CHAT_ID;
var CHAT_REPORT = config.REPORT_CHAT_ID;
const HOLD_OFF_SCAM_ALERT_SEC = config.HOLD_OFF_SCAM_ALERT_SEC;

var lastShownScamAlert = 0;


const scamAlert = config.SCAM_ALERT_MSG;

function seconds_now(){ return Math.floor( Date.now() / 1000 ) }

function reportBadBot(badbot, date) {
    sparky.sendMessage(CHAT_REPORT, "kicked out bot " + badbot.username +
    	" with id " + badbot.id + "");
   	kickedBots[date] = {badbot, date};
   	updateKickedBotsData();
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
	if (lastShownScamAlert + HOLD_OFF_SCAM_ALERT_SEC > seconds_now()) {
		return true;
	}
	return false;
}

// Register listeners
sparky.on('message', message => {
	logger.log("on message triggered.");
	if ( !message.chat ) {
		logger.info("message does not have chat");
		return;
	}
	logger.info("Chat : ", message.chat.id, " :: ", message.chat.title );
	// Announcement channel
	if (message.chat.id == CHAT_ANNOUNCEMENTS) {
		// BotPolice ignores Annnouncement channel for now
		return;
	// Simple Token community channel
	} else if (message.chat && shouldPoliceChat( message.chat.id ) ) {
	 	badbot = kickIfNewUserIsBot(message);
	 	if (badbot != undefined) {
	 		logger.win(" a bot was kicked.", badbot );
	 		if (!holdOffScamAlert()) {
		 		const humansOnly = humansOnlyPolicy(badbot);
		 		sparky.sendMessage(message.chat.id, humansOnly);
		 		lastShownScamAlert = seconds_now();
		 	}
	 	}
	}
});

function updateKickedBotsData() {
  const json = JSON.stringify(kickedBots);
  FS.writeFile(Path.join(__dirname, kickedBotsDataFilePath), json, function(err) {
    if(err) {
    	logger.error( err );
    } else {
    	logger.win("Updated kickedbots.json")
    }
  });
}


config.REPEATE_IN_CHATS.forEach(function ( chatId ) {
	var repeater =  new Repeater(chatId, config.MESSAGE_TO_REPEATE, config.REPEATE_MESSAGE_SEC, sparky);
	repeater.start();
});


sparky.startPolling();
