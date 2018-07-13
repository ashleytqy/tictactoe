const GameHelper = require("./GameHelper");
const { buildErrorMsg } = require("./messageBuilder");

const HELP = "help";
const CHALLENGE = "challenge";
const ACCEPT = "accept";
const REJECT = "reject";
const MOVE = "move";
const SHOW = "show";

/*
This function parses the request body
and calls GameHelper with the appropriate method
*/
const commandParser = body => {
  return new Promise((resolve, reject) => {
    let channelId = body.channel_id;
    let userId = body.user_id;

    // split input by whitespace
    let inputArray = body.text.split(/[ ]+/);
    let command = inputArray[0];
    let option = inputArray[1];

    switch (command) {
      case HELP:
        resolve(GameHelper.help());
        break;

      case SHOW:
        resolve(GameHelper.show(channelId));
        break;

      case CHALLENGE:
        resolve(GameHelper.challenge(channelId, userId, option));
        break;

      case ACCEPT:
        resolve(GameHelper.accept(channelId, userId, option));
        break;

      case REJECT:
        resolve(GameHelper.reject(channelId, userId, option));
        break;

      case MOVE:
        resolve(GameHelper.move(channelId, userId, option));
        break;

      default:
        resolve(buildErrorMsg(`Sorry command – ${command} – not recognized!`));
    }

    resolve(buildErrorMsg("Sorry, something went wrong!"));
  });
};

module.exports = commandParser;
