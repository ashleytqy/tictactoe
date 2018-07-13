const _ = require("underscore");

let X = 'x'
let O = 'o'

/*
Represents a TicTacToe game
*/
class Game {
  constructor(challenger, challengee, channel) {
    this.playerX = challenger;
    this.playerO = challengee;
    this.currentPlayer = challenger;

    // map players to their symbols
    this.playerSymbol = {};
    this.playerSymbol[this.playerX] = X;
    this.playerSymbol[this.playerO] = O;

    this.channel = channel;
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.hasEnded = false;
  }

  /*
  Returns a String that represents the state of the board
  wrapped in backticks to be formatted by Markdown
  */
  displayBoard() {
    let visualBoard = "```";
    for (let i = 0; i < this.board.length; i++) {
      // add a pipe at every first line
      if (i % 3 === 0) {
        visualBoard += "|";
      }

      visualBoard += ` ${this.board[i]} |`;

      // add a line break at every end of line
      if (i % 3 === 2) {
        visualBoard += `\n|---+---+---|\n`;
      }
    }

    return visualBoard + "```";
  }

  /*
  Returns a String that displays information of the current player and their symbol
  */
  showNextPlayer() {
    if (this.getValidMoves().length === 9) {
      return `\nFirst up: <@${this.currentPlayer}> (Player ${this.getCurrentSymbol()})!`;
    }
    return `\nNext up: <@${this.currentPlayer}> (Player ${this.getCurrentSymbol()})!`;
  }

  /*
  Makes a move in `cell` for the current player
  */
  setPlayerMove(cell) {
    // set board cell
    this.board[cell] = this.getCurrentSymbol();

    if (this.checkWin() || this.checkTie()) {
      this.hasEnded = true;
    } else {
      this.updateCurrentPlayer();
    }
  }

  /*
  Gets the symbol of the current player, either X or O
  */
  getCurrentSymbol() {
    return this.playerSymbol[this.currentPlayer];
  }

  /*
  Updates the current player
  */
  updateCurrentPlayer() {
    this.currentPlayer = this.currentPlayer === this.playerX
      ? this.playerO
      : this.playerX;
  }

  /*
  Returns true if the current player has a win
  Returns false otherwise
  */
  checkWin() {
    // check horizontal equality
    for (let i = 0; i < 9; i += 3) {
      if (
        this.board[i] === this.board[i + 1] &&
        this.board[i + 1] === this.board[i + 2]
      )
        return true;
    }

    // check vertical equality
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i] === this.board[i + 3] &&
        this.board[i + 3] === this.board[i + 6]
      )
        return true;
    }

    // check diagonal equality
    if (this.board[0] === this.board[4] && this.board[4] === this.board[8])
      return true;

    if (this.board[2] === this.board[4] && this.board[4] === this.board[6])
      return true;

    return false;
  }

  /*
  Returns true if the game has ended and there is no winner
  Returns false otherwise
  */
  checkTie() {
    return !this.checkWin() && this.getValidMoves().length === 0;
  }

  /*
  Returns true if `userId` is one of the players in the game
  Returns false otherwise
  */
  isUserInGame(userId) {
    return this.playerX == userId || this.playerO == userId;
  }

  /*
  Returns true if `move` is valid
  Returns false otherwise
  */
  isMoveValid(move) {
    return _.contains(this.getValidMoves(), move);
  }

  /*
  Returns an array of valid moves
  */
  getValidMoves() {
    let validMoves = _.reject(this.board, function(cell) {
      return cell === X || cell === O;
    });
    return _.map(validMoves, num => num.toString());
  }
}

module.exports = Game;
