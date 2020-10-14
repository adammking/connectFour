/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let h = 0; h < HEIGHT; h++) {
    board.push([]);
    for (let w = 0; w < WIDTH; w++) {
      board[h].push(null);
    }
  } return board; 
} 

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    let htmlBoard = document.querySelector("#board")
    let emptyTop = makeTopRow() 
    let filledTop = fillTopRow(emptyTop)
    htmlBoard.append(filledTop);
    completeBoard(htmlBoard);
    restartButton()
}

  //Creates top row for user to select where piece will be played
function makeTopRow() {
    let top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);
  return top
}

  //creates the cells within the row that user will interact with
function fillTopRow(top) {
    for (let x = 0; x < WIDTH; x++) {
      let headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    return top
}

  //creates the HTML tags for the table that represents the gameboard
function completeBoard(htmlBoard) {
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}



/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let tblePlace = document.getElementById(`${y}-${x}`)
  let divPiece = createGamePiece()
  tblePlace.append(divPiece);
}

/**Create's game piece used by player */
function createGamePiece() {
    let divPiece = document.createElement("div");
    divPiece.classList.add("piece");
    divPiece.classList.add(`player${currPlayer}`);
    return divPiece
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg)
  let topRow = document.querySelector("#column-top")
  topRow.removeEventListener("click", handleClick)
}

/** restartGame: creates new board in memory and html to start a new game */
function restartGame() {
  let htmlBoard = document.querySelectorAll("tr");
    for (let itm of htmlBoard) {
      itm.remove()
    }
    board = []
    makeBoard()
    makeHtmlBoard()
}

/** restartButton: assigns listener to restart game button */
function restartButton() {
  let restart = document.querySelector(".restart")
  restart.addEventListener("click", restartGame); 
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return setTimeout(function() {endGame(`Player ${currPlayer} won!`)}, 2000);
  }

  // check for tie
  if (board.every( val => val.every(spot => spot))) {
    return setTimeout(function() {endGame("It's a Tie!")}, 2000);
  } 
  
  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  //loops through every cell of JS gameboard
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //checks cells for patterns to determine winner
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();