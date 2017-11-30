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
var scanUsersChats = (config.POLICE_COMMUNITIES || []).concat([]);

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

function shouldScanUsersInChat( chatId ) {
	return scanUsersChats.includes( chatId );
}


var CHAT_ANNOUNCEMENTS = config.ANNOUNCEMENTS_CHAT_ID;
var CHAT_REPORT = config.REPORT_CHAT_ID;
const HOLD_OFF_SCAM_ALERT_SEC = config.HOLD_OFF_SCAM_ALERT_SEC;

var lastShownKickAlert = 0;


const kickAlert = config.MESSAGE_ON_KICK;

function seconds_now(){ return Math.floor( Date.now() / 1000 ) }

function reportBadBot(badbot, date) {
    sparky.sendMessage(CHAT_REPORT, "kicked out bot " + badbot.username +
    	" with id " + badbot.id + "");
   	kickedBots[date] = {badbot, date};
   	updateKickedBotsData();
};

function humansOnlyPolicy(badbot) {
	return kickAlert + 
		"\n\nThis bot just banned an intruder " + badbot.username 
		+"\nWe do our best to protect the community. If you see a scammer, please report them."
		+ "\n***********************"
		+ "\nST BOT PROTECTOR"
		+ "\n***********************";
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

function kickIfBlackListedUser(message) {
	if (message.chat && (message.new_chat_member || message.from)){
		var firstName = null;
		var lastName = null;
        var userName = null;
		if (message.new_chat_member) {
		 	firstName = message.new_chat_member.first_name;
		 	lastName = message.new_chat_member.last_name;
		 	userName = message.new_chat_member.username;
		 	if (isUserBlackListed(firstName,lastName,userName)) {
			logger.info("kick user");
			//sparky.kickChatMember(message.chat.id, message.new_chat_member.id);
			return message.new_chat_member;
		  }
		} else if (message.from) {
		 	firstName = message.from.first_name;
		  	lastName = message.from.last_name;
		 	userName = message.from.username;
		 	if (isUserBlackListed(firstName,lastName,userName)) {
			logger.info("kick user");
			//sparky.kickChatMember(message.chat.id, message.new_chat_member.id);
			return message.from;
			}
		}
	}
}


/******************* Read Blocked Users ***********************/
var csv = require("fast-csv");

const blackListedUsers = [];
csv
 .fromPath("./data/blacklistedusers.csv")
 .on("data", function(data){
 	 console.log(data);
     blackListedUsers.push(data[0].toUpperCase());
 })
 .on("end", function(){
    
 });


 function  isUserBlackListed(firstName, lastName, username) {
    logger.info(firstName + " "+ lastName + " "+ username );
    for (var i=0;i<blackListedUsers.length; i++) {
    	var data = blackListedUsers[i];
    	logger.info(data);
    	if (checkNormalisedName(firstName, data) || checkNormalisedName(lastName,data) || checkNormalisedName(username,data)) {
    		return true;
    	}
    }
    return false;
  }

  function checkNormalisedName(name, data) {
  	if (name == undefined || data == undefined) {
  		return false;
  	}
  	if (name.toUpperCase() === data) {
  			return true;
  	}
  	var nameArray = name.split(/[0-9\*\!\@\#\$\%\^\&\(\)\_\-\+\=\~\~\:\"\'\/\.\>\,\<\[\{\]\}\ `]/)
  	
  	var nameNormalised = nameArray.join("").toUpperCase();
  	if(nameNormalised.includes(data)) {
     		return true;
    }
  	return false;
  }

  function handleChatCommand(message) {
  	if (message.chat && message.text) {
		var command = message.text.split(' ');
		if(command[0] == '/test') {
			if(isUserBlackListed(message.text, undefined, undefined)) {
				sparky.sendMessage(message.chat.id,  command[1] + " is a potential scam user");
			} else {
				sparky.sendMessage(message.chat.id,  command[1] + " is not a scam user");
			}
			return true;
		}
	}
	return false;
  }
/************************* End **********************************/


/******************* Read WhiteListed Users ***********************/

const whiteListedUsers = [];
csv
 .fromPath("./data/whitelistedusers.csv")
 .on("data", function(data){
 	 console.log(data);
     whiteListedUsers.push(data[0].toUpperCase());
 })
 .on("end", function(){
    
 });


function  isUserWhiteListed(username) {
	logger.info( username );
	if (username == undefined) {
		return false;
	}
    for (var i=0;i < whiteListedUsers.length; i++) {
    	var data = whiteListedUsers[i];
    	logger.info(data);
    	if (checkNormalisedName(username, data)) {
    		return true;
    	}
    }
    return false;
  }


/*********************** End *****************************/
var csv = require("fast-csv");

function holdOffKickAlert() {
	if (lastShownKickAlert + HOLD_OFF_SCAM_ALERT_SEC > seconds_now()) {
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
	logger.info(message);
	logger.info("Chat : ", message.chat.id, " :: ", message.chat.title );

	// Commad Test
	if (config.ENV === "development" && handleChatCommand(message)) {
		return;
	}

	// Announcement channel
	if (message.chat.id == CHAT_ANNOUNCEMENTS) {
		// BotPolice ignores Annnouncement channel for now
		return;
	// Simple Token community channel
	} else if (message.chat && (shouldPoliceChat( message.chat.id ) || shouldScanUsersInChat(message.chat.id) )) {
		if( (message.from && isUserWhiteListed(message.from.username)) || (message.new_chat_member && isUserWhiteListed(message.new_chat_member.username))) {
			logger.win("A whitelisted user detected");
			return;
		}
	 	badbot = kickIfNewUserIsBot(message);
	 	if (badbot != undefined) {
	 		logger.win(" a bot was kicked.", badbot );
	 		if (!holdOffKickAlert()) {
		 		const humansOnly = humansOnlyPolicy(badbot);
		 		sparky.sendMessage(message.chat.id, humansOnly);
		 		lastShownKickAlert = seconds_now();
		 	}
	 	} 
	 	blacklistedUser = kickIfBlackListedUser(message);
	 	if (blacklistedUser != undefined) {
	 		logger.win("A potential scammer is detected.", blacklistedUser );

	 		sparky.sendMessage(CHAT_REPORT,  
	 			"[" + blacklistedUser.first_name + "]" + "(tg://user?id="+ blacklistedUser.id + ")"
	 			+ " potential scam user is detected", { parse_mode: "Markdown" });

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

function reportBotBoot() {
	var msgRepeaterText = "Message Repeater is not running on any chat.";
	if ( config.REPEATE_IN_CHATS.length ) {
		msgRepeaterText = "Message Repeater is ACTIVE for " + config.REPEATE_IN_CHATS.length + " chat(s)";
	}
	sparky.sendMessage(CHAT_REPORT, "Sparky is now online.\n" + msgRepeaterText );

}
reportBotBoot();

sparky.startPolling();
