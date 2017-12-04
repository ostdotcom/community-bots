const logger = require('../helpers/CustomConsoleLogger');
const config = require('../config/telegram_config');
function Repeater( chatId, message, repeateDurationInSec, slimbot) {
  this.message = message;
  this.repeateDurationInSec = repeateDurationInSec;
  this.slimbot = slimbot;
  this.chatId = chatId;
}
Repeater.prototype = {
  slimbot: null,
  message: null,
  chatId: null,
  repeateDurationInSec: -1,
  isPaused: true,
  start: function () {
    if ( !this.isPaused ) {
      return;
    }
    this.isPaused = false;
    this.performNext();
  },
  stop: function () {
    if ( this.isPaused ) {
      return;
    }
    this.isPaused = true;
  },
  performNext: async function () {
    var oThis = this;
    var messageToSend = oThis.message;

    if ( oThis.isPaused ) {
      return;
    }
    logger.info("\t\tSending Message to chatId : " , oThis.chatId );


    if ( config.REPEATED_CHAT_PIN_MSG_ID ) {
       await new Promise( function (resolve, reject ) {
        //Query for pined message and update the message for repeater.
        oThis.slimbot.getChat(config.REPEATED_CHAT_PIN_MSG_ID, function(error, response) {
          if (response.result && response.result.pinned_message) {
              console.log("\n\n\n\n\npinned message data");
              console.log(response.result.pinned_message);
              messageToSend = "t.me/"+config.PUBLIC_COMMUNITY_USERNAME + "/" + response.result.pinned_message.message_id;
          }
          resolve( messageToSend );
        });
      });
    }
    

    //Send the message.
    oThis.slimbot
      .sendMessage( oThis.chatId, messageToSend )
      .then(_ => {
        logger.info("\t\tSRepeated message on chatId : " , oThis.chatId );
      })
      .catch(reason => {
        logger.error("\t\tSFailed to repeate message for chatId : " , oThis.chatId );
      })

    ;

    //Schedule next.
    if ( oThis.repeateDurationInSec > 0 ) {      
      setTimeout(function () {
        oThis.performNext();
      }, oThis.repeateDurationInSec * 1000);
    }

  }
}

module.exports = Repeater;