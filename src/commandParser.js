const commandParser = (body) => {

  let instruction = body.text
  let channelId = body.channel_id
  let userId = body.user_id
  let userName = body.user_name

  // if (instruction === 'new') {
  //   playNewGame();
  // } else if (instruction === 'set') {
  //   // find game you're currently playing
  //   // update the mark
  // }


  // parse command
  // WHO is making the move
  // is the move valid?
  // if yes -> make the move
  // if no -> send error msg

  // if game has ended
  // happy message!
  // remove game.channel from channelsWithGames

  return new Promise((resolve, reject) => {
    resolve('hello')
  })
}


function playNewGame() {
  // check if valid
  let game = new Game(user1, user2, channelId);
}

// pregame
// ttt challenge @ashley
// ttt accept @nicole
// ttt reject @nicole

// actual game
// ttt 9
// ttt 3

module.exports = commandParser