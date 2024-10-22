const fs = require('fs');

const st_dev_community_1 = -1001233882429;
const st_dev_report_chat = -1001161646688;

const development = {
  BOT_TOKEN: "494907220:AAHMhxNkcnatkyhzqwuGtbUS-U6AvDg0MO4"
  ,ENV: "development"
  ,POLICE_COMMUNITIES: [ st_dev_community_1 ]
  ,ANNOUNCEMENTS_CHAT_ID : -1001320680086
  ,REPORT_CHAT_ID : st_dev_report_chat
  ,CHAT_TYPE_SUPERGROUP : 'supergroup'
  ,CHAT_TYPE_GROUP : 'group'
  ,CHAT_TYPE_PRIVATE : 'private'

  //Scam Alert Config
  ,MESSAGE_ON_KICK: fs.readFileSync('../telegram/messages/KickedMessage.txt', 'utf8')
  ,HOLD_OFF_SCAM_ALERT_SEC: 10

  //Repeate Message Config
  ,REPEATE_IN_CHATS : [ st_dev_community_1 ]
  ,REPEATE_MESSAGE_SEC: 1 * 10
  ,MESSAGE_TO_REPEATE: fs.readFileSync('../telegram/messages/ScamAlert.txt', 'utf8')

  //Scan user chats
  ,SCAN_USERS_CHATS : [ st_dev_community_1 ]

  //Scan link in chats
  ,SCAN_LINKS_CHATS : [ st_dev_community_1 ]

  //REPEATED CHAT PIN MSG ID
  ,REPEATE_PINNED_MSG_TEXT : "Thanks for a successful token sale! The sale has ended. The Simple Token team has provided answers to many of the most common questions. [link]"
  ,REPEATED_CHAT_PIN_MSG_ID : st_dev_community_1

  ,PUBLIC_COMMUNITY_USERNAME : "stdevcommunity"

  ,REPEATED_CHAT_MSG_LIMIT : 2

};

/* BEGIN : DO NOT TOUCH THESE */
const CHAT_SIMPLETOKEN_COMMUNITY = -1001138398611;
const CHAT_ST_BOT_ACTIVITY_REPORTS = -1001376936450;
/* END OF: DO NOT TOUCH THESE */

const production = {
  BOT_TOKEN: "448852266:AAHQ1IGFBMfyx_XCtLFzE6b1XvVY6V5S3Ls"
  ,ENV: "production"
  ,POLICE_COMMUNITIES: [ CHAT_SIMPLETOKEN_COMMUNITY ]
  ,ANNOUNCEMENTS_CHAT_ID : -1001320680086
  ,REPORT_CHAT_ID : CHAT_ST_BOT_ACTIVITY_REPORTS
  ,CHAT_TYPE_SUPERGROUP : 'supergroup'
  ,CHAT_TYPE_GROUP : 'group'
  ,CHAT_TYPE_PRIVATE : 'private'

  //Scam Alert Config
  ,MESSAGE_ON_KICK: fs.readFileSync('../telegram/messages/KickedMessage.txt', 'utf8')
  ,HOLD_OFF_SCAM_ALERT_SEC: 300

  //Repeate Message Config
  ,REPEATE_IN_CHATS : [ CHAT_SIMPLETOKEN_COMMUNITY ]
  ,REPEATE_MESSAGE_SEC: 3*60*60
  ,MESSAGE_TO_REPEATE: fs.readFileSync('../telegram/messages/ScamAlert.txt', 'utf8')

  //Scan user chats
  ,SCAN_USERS_CHATS : [CHAT_SIMPLETOKEN_COMMUNITY]
  //Scan link in chats
  ,SCAN_LINKS_CHATS : [CHAT_SIMPLETOKEN_COMMUNITY]

  //Repeate Pinned Message.

  ,REPEATED_CHAT_PIN_MSG_ID : null

  ,PUBLIC_COMMUNITY_USERNAME : "stofficial"

  ,REPEATED_CHAT_MSG_LIMIT : 10
};


const availableConfigs = {
  "production": production,
  "development": development
};

var commandArgs = process.argv.slice(2);
var exportedConfig = development;

if ( commandArgs && commandArgs.length > 0 )  {
  var configFlavour = commandArgs[0].toLowerCase();
  exportedConfig = availableConfigs[ configFlavour ] || exportedConfig;
}
module.exports = exportedConfig;

/* Other Thinngs that might be usefull. */

// rachins bot
const OfficiaLSimpLeToken_bot = "330790032:AAH2l8hR3bw2t3yM_mRalgQKTQty1qH5h1Q";
// @benjaminbollens_bot  t.me/benjaminbollens_bot
const BEN_BADBOT_ID = 383374001;
const BOT_BENJAMINBOLLEN = "438311760:AAEZnwm-sPvkcCBMRlgswO38VNuh_bcODmI";


