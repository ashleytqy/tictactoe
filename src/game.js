// Game Object
// has 2 users
// who's turn?
// board state

class Game {
  constructor(playerX, playerO, channel) {
    this.playerX = playerX
    this.playerO = playerO
    this.currentPlayer = playerX

    // map players to their marks
    this.playerMark = {}
    this.playerMark[playerX] = 'x'
    this.playerMark[playerO] = 'o'

    this.channel = channel
    // board as its own object?
    // player as own object?
    
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    this.hasEnded = false
  }

  displayBoard() {
    for (let i = 0; i < this.board.length; i++) {
      if (i % 3 === 0) {
        console.log('')
      }
      process.stdout.write(this.board[i] + ' ')
    }
  }

  setPlayerMove(cell) {
    // set board cell
    this.board[cell] = this.getCurrentMark()

    // check if win
    let won = this.checkWin()

    if (won) {
      // endGame
      console.log('game ended!')
      console.log(`winner is ${this.currentPlayer}`)
      this.hasEnded = true
    } else {
      this.updateCurrentPlayer()
    }
  }

  getCurrentMark() {
    return this.playerMark[this.currentPlayer]
  }

  updateCurrentPlayer() {
     this.currentPlayer = (this.currentPlayer === this.playerX) ? this.playerO : this.playerX
  }

  // returns true if there is any win
  // returns false otherwise
  checkWin() {
    // check horizontal equality
    for (let i = 0; i < 9; i += 3) {
      if (this.board[i] === this.board[i + 1] && this.board[i + 1] === this.board[i + 2])
        return true
    }

    // check vertical equality
    for (let i = 0; i < 3; i++) {
      if (this.board[i] === this.board[i + 3] && this.board[i + 3] === this.board[i + 6])
        return true
    }

    // check diagonal equality
    if (this.board[0] === this.board[4] && this.board[4] === this.board[8])
      return true

    if (this.board[2] === this.board[4] && this.board[4] === this.board[6])
      return true

    return false 
  }
}

let x = new Game('ash', 'nic', 'petshop');
x.setPlayerMove(2);
console.log(x.displayBoard())

x.setPlayerMove(4);
console.log(x.displayBoard())

x.setPlayerMove(6);
console.log(x.displayBoard())