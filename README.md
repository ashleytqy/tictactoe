# Tic Tac Toe ✖️ ⚪️

`/ttt` is a Slack command that allows you to play TicTacToe wth anyone in the same channel. You can challenge them, wait for them to accept, and start playing!


| Commands               | Effect        |
| :----------------------| :-------------|
|`/ttt help` | Shows the list of possible commands |
|`/ttt challenge @user` | Challenge `@user` to a game |
|`/ttt accept @user`    | Accept `@user`'s challenge  |
|`/ttt reject @user`    | Reject `@user`'s challenge  |
|`/ttt move [num]`      | Make a move on cell [num]   |
|`/ttt show`            | Show the current game in the channel, and who's turn it is|

## Requirements
- Users can create a new game in any Slack channel by challenging another user (using their @username).
- A channel can have at most one game being played at a time.
- Anyone in the channel can run a command to display the current board and list whose turn it is.
- Users can specify their next move, which also publicly displays the board in the channel after the move with a reminder of whose turn it is.
- Only the user whose turn it is can make the next move.
- When a turn is taken that ends the game, the response indicates this along with who won.

## Running it locally
After you fill in the relevant environment variables in `.sample-env` and rename it to `.env`. In one terminal, do:
```
npm install
node src/server.js
```
In another terminal, do:
```
ngrok http 3000 
# get the generated URL and replace the `Request URL` field in your app's settings
```

## To-dos (in the future)
- Connect to a database instead of storing everything in memory
- Write tests!