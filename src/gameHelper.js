const _ = require("underscore");

const Game = require("./game");
const { buildSuccessMsg, buildErrorMsg } = require("./messageBuilder");
const SlackHelper = require("./SlackHelper");
const slack = new SlackHelper();

/*
This object stores a map of channel ID to an array of sorted pairs of user IDs
who have been challenged
e.g. { channelA': [['user1', 'user2'], ['user3', 'user4']] }
*/
let ongoingChallenges = {};

/*
This object  stores a map of channel ID to a sorted pair of user IDs in the game
e.g. { channelA': ['user1', 'user2'] }
*/
let activeGames = {};

/*
`help` returns the list of possible commands and wheh to use them
*/
function help() {
  let res = "To show a list of possible commands, use `/ttt help` \n";
  res += "To challenge `@user` to a game, use `/ttt challenge @user` \n";
  res += "To accept `@user`'s challenge, use `/ttt accept @user`\n";
  res += "To reject `@user`'s challenge , use `/ttt reject @user`\n";
  res += "To make a move on cell [num], use `/ttt move [num]`\n";
  res +=
    "To show the current game in the channel, and who's turn it is, use `/ttt show` \n\n";
  res += "Have fun with the game!";

  return buildSuccessMsg(res);
}

/*
`show` displays the state of the board and who's turn it is
of the active game in the channel specified
*/
function show(channelId) {
  let game = activeGames[channelId];

  if (game) {
    return buildSuccessMsg(
      `${game.displayBoard()} \n The current player is <@${game.currentPlayer}>`
    );
  }
  return buildErrorMsg("There are currently no active games in this channel.");
}

/*
`challenge` initiate a challenge in the specified channel
*/
function challenge(channelId, challengerId, option) {
  let isUserValid = validateUser(option);
  if (!isUserValid.valid) return isUserValid;

  let challengeeId = isUserValid.success_msg;
  let pair = [challengerId, challengeeId].sort();

  let isPairValid = validatePair(pair, challengeeId);
  if (!isPairValid.valid) return isPairValid;

  createChallenge(channelId, pair);
  return buildSuccessMsg(
    `Challenge initiated by <@${challengerId}>! Waiting for <@${challengeeId}> to respond.`
  );
}

/*
`accept` accepts the challenge initiated by the specified challenger
in the specified channel
*/
function accept(channelId, challengeeId, challengerName) {
  let isChallengerValid = validateUser(challengerName);
  if (!isChallengerValid.valid) return isChallengerValid;

  let challengerId = isValid.success_msg;

  if (activeGames[channelId])
    return buildErrorMsg("There is already an active game in this channel.");

  let pair = [challengerId, challengeeId].sort();
  if (!challengeToBeResponded(channelId, pair))
    return buildErrorMsg("There is no game to accept between the two of you.");

  removeFromOngoingChallenges(channelId, challengerId, challengeeId);

  let newGame = new Game(challengerId, challengeeId, channelId);
  activeGames[channelId] = newGame;
  return buildSuccessMsg(
    `Challenge accepted by <@${challengeeId}>! \n ${newGame.displayBoard()} ${newGame.showNextPlayer()}`
  );
}

/*
`reject` rejects the challenge initiated by the specified challenger
in the specified channel
*/
function reject(channelId, challengeeId, option) {
  let isUserValid = validateUser(option);
  if (!isUserValid.valid) return isUserValid;

  let challengerId = isUserValid.success_msg;

  let pair = [challengerId, challengeeId].sort();
  if (!challengeToBeResponded(channelId, pair))
    return buildErrorMsg("There is no game to reject between the two of you.");

  removeFromOngoingChallenges(channelId, challengerId, challengeeId);

  return buildSuccessMsg(
    `<@${challengeeId}> has successfully rejected <@${challengerId}>'s challenge.`
  );
}

/*
`move` carries out a move on the specified cell number
by the user in the specified channel
*/
function move(channelId, userId, number) {
  let game = activeGames[channelId];
  let response;

  if (!game.isUserInGame(userId))
    return buildErrorMsg(
      "You are not in this game, so you cannot make a move."
    );

  if (game.currentPlayer !== userId)
    return buildErrorMsg("Please wait for your turn!");

  if (!game.isMoveValid(number))
    return buildErrorMsg("This is not a valid move.");

  game.setPlayerMove(number);
  response = game.displayBoard();

  if (game.checkWin()) {
    response += `\nCongrats <@${game.currentPlayer}>!!!`;

    // remove from active game so there can be another game
    delete activeGames[channelId];
  } else if (game.checkTie()) {
    response += "\nThe game has ended with no winners :-(";
    delete activeGames[channelId];
  } else {
    response += game.showNextPlayer();
  }

  return buildSuccessMsg(response);
}

/*
This helper function removes a challenge from the `ongoingChallenges` object
*/
function removeFromOngoingChallenges(channelId, challengerId, challengeeId) {
  let pair = [challengerId, challengeeId].sort;
  let index;

  ongoingChallenges[channelId].forEach((currentPair, i) => {
    if (_.isEqual(currentPair, pair)) index = i;
  });
  ongoingChallenges[channelId].splice(index);
}

/*
This helper function checks if the pair exists in the specified channel
*/
function challengeToBeResponded(channelId, pair) {
  if (_.isEmpty(ongoingChallenges)) return false;

  if (ongoingChallenges[channelId]) {
    ongoingChallenges[channelId].forEach(currentPair => {
      if (!_.isEqual(currentPair, pair)) return false;
    });
  }
  return true;
}

/*
This helper function creates a challenge with the two users (in the `pair` array)
and adds the pair to the `ongoingChallenges` object
*/
function createChallenge(channelId, pair) {
  if (ongoingChallenges[channelId] === undefined) {
    ongoingChallenges[channelId] = [];
  }

  ongoingChallenges[channelId].push(pair);
}

/*
This helper function checks that the usernameWithSymbol is an existing user
*/
function validateUser(usernameWithSymbol) {
  if (usernameWithSymbol && usernameWithSymbol.substring(0, 1) !== "@")
    return buildErrorMsg("Please challenge a user, by @-ing them.");

  let userId = slack.getUserId(usernameWithSymbol.substring(1));

  if (!userId) return buildErrorMsg("That user does not seem to exist...");

  return buildSuccessMsg(userId);
}

/*
This helper function checks if the pair of user IDs is valid in the specified channel
*/
function validatePair(pair, channelId) {
  if (pair[0] == pair[1])
    return buildErrorMsg("You cannot challenge yourself.");

  if (challengeToBeResponded(channelId, pair)) {
    return buildErrorMsg(
      `A challenge already exists between <@${pair[0]}> and <@${pair[1]}>`
    );
  }

  return buildSuccessMsg("Pair is valid.");
}

module.exports = {
  help: help,
  show: show,
  challenge: challenge,
  accept: accept,
  reject: reject,
  move: move
};
