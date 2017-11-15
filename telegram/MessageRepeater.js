const logger = require('../helpers/CustomConsoleLogger');

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
  performNext: function () {
    var oThis = this;

    if ( oThis.isPaused ) {
      return;
    }
    logger.info("\t\tSending Message to chatId : " , oThis.chatId );
    //Send the message.
    oThis.slimbot
      .sendMessage( oThis.chatId, oThis.message )
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