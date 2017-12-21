const logger = require('../helpers/CustomConsoleLogger');
const config = require('../config/telegram_config');
function Repeater( chatId, message, repeateDurationInSec, slimbot, sendOptions) {
  this.message = message;
  this.repeateDurationInSec = repeateDurationInSec;
  this.slimbot = slimbot;
  this.chatId = chatId;
  this.sendOptions = sendOptions;
}
Repeater.prototype = {
  slimbot: null,
  message: null,
  chatId: null,
  sendOptions: null,
  repeateDurationInSec: -1,
  isPaused: true,
  shouldSend: true,
  messageCount: 0,
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

    if ( !oThis.shouldSend ) {
      //Schedule next.
      if ( oThis.repeateDurationInSec > 0 ) {      
        setTimeout(function () {
        oThis.performNext();
        }, oThis.repeateDurationInSec * 1000);
        }
        return;
    }

    if ( oThis.isPaused ) {
      return;
    }
    logger.info("\t\tSending Message to chatId : " , oThis.chatId );

    // Update message sending variables
    oThis.shouldSend = false;
    oThis.messageCount = 0;


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
      .sendMessage( oThis.chatId, messageToSend, oThis.sendOptions )
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

  },

  updateMessageCounter: function() {
      this.messageCount++;
      if (config.REPEATED_CHAT_MSG_LIMIT < this.messageCount) {
          this.shouldSend = true;
      }
      logger.info("MessageCounter : " , this.messageCount, this.shouldSend );

  }
}

module.exports = Repeater;