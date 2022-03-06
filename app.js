let gameState = {};

function resetGameState() {
  gameState = gameState = {
    gameType: null,
    player1: null,
    player2: null,
    winner: null,
    currentPlayer: "x",
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };
}

function resetGame() {
  resetGameState();
  renderState();
}

function randomlyChooseEmptySpot() {
  const emptySpaces = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cellState = gameState.board[i][j];
      if (!cellState) {
        emptySpaces.push([i, j]);
      }
    }
  }
  const randomEmptySpot =
    emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  return randomEmptySpot;
}

function checkNoWinner() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cellState = gameState.board[j][i];
      if (!cellState) {
        return false;
      }
    }
  }
  return true;
}

function choosePlayerVsPlayer() {
  gameState.gameType = "PlayerVsPlayer";
  renderState();
}

function choosePlayerVsComputer() {
  gameState.gameType = "PlayerVsComputer";
  renderState();
}

function submitNames() {
  const player1Input = document.getElementById(`player1Input`);
  const player2Input = document.getElementById(`player2Input`);
  gameState.player1 = player1Input.value;
  gameState.player2 = player2Input.value;
  if (gameState.gameType === "PlayerVsComputer") {
    gameState.player2 = "Computer";
  }
  renderState();
}

// render
function renderState() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cellState = gameState.board[j][i];
      const XCell = document.getElementById(`X${j},${i}`);
      const OCell = document.getElementById(`O${j},${i}`);
      if (cellState === "x") {
        XCell.classList.remove("off");
        OCell.classList.add("off");
      } else if (cellState === "o") {
        XCell.classList.add("off");
        OCell.classList.remove("off");
      } else {
        XCell.classList.add("off");
        OCell.classList.add("off");
      }
    }
  }
  const winnerAnnouncement = document.getElementById("winnerAnnouncement");
  const submitNamesSection = document.getElementById("submitNamesSection");
  const chooseGameTypeSection = document.getElementById(
    "chooseGameTypeSection"
  );
  const board = document.getElementById("board");
  const resetButton = document.getElementById("resetButton");
  const player1Input = document.getElementById(`player1Input`);
  const player2Input = document.getElementById(`player2Input`);
  const player2NamesSection = document.getElementById(`player2NamesSection`);

  player1Input.value = "";
  player2Input.value = "";

  resetButton.classList.add("off");
  submitNamesSection.classList.add("off");
  board.classList.add("off");
  chooseGameTypeSection.classList.add("off");
  player2NamesSection.classList.add("off");

  winnerAnnouncement.innerText = "";

  //Users need to choose game type
  if (!gameState.gameType) {
    chooseGameTypeSection.classList.remove("off");
  }
  //Users need to input names before playing
  else if (
    (gameState.gameType === "PlayerVsPlayer" &&
      (!gameState.player1 || !gameState.player2)) ||
    (gameState.gameType === "PlayerVsComputer" && !gameState.player1)
  ) {
    if (gameState.gameType === "PlayerVsPlayer") {
      player2NamesSection.classList.remove("off");
    }
    resetButton.classList.remove("off");
    submitNamesSection.classList.remove("off");
  } //Handle winning states
  else if (gameState.winner === "x") {
    winnerAnnouncement.innerText = `${gameState.player1} Wins!`;
    resetButton.classList.remove("off");
    board.classList.remove("off");
  } else if (gameState.winner === "o") {
    winnerAnnouncement.innerText = `${gameState.player2} Wins!`;
    resetButton.classList.remove("off");
    board.classList.remove("off");
  } else if (checkNoWinner()) {
    winnerAnnouncement.innerText = "Draw!";
    resetButton.classList.remove("off");
    board.classList.remove("off");
    //Handle playing
  } else {
    resetButton.classList.remove("off");
    board.classList.remove("off");
    if (gameState.currentPlayer === "x") {
      winnerAnnouncement.innerText = `${gameState.player1}'s turn!`;
    } else {
      winnerAnnouncement.innerText = `${gameState.player2}'s turn!`;
      if (gameState.gameType === "PlayerVsComputer") {
        setTimeout(function () {
          let blockSpot;
          if ((blockSpot = checkAlmostWin("x"))) {
            cellClicked(blockSpot[0], blockSpot[1]);
          } else if ((blockSpot = checkAlmostWin("o"))) {
            cellClicked(blockSpot[0], blockSpot[1]);
          } else {
            const randomEmptySpot = randomlyChooseEmptySpot();
            cellClicked(randomEmptySpot[0], randomEmptySpot[1]);
          }
        }, 1000);
      }
    }
    // console.log("block spot: ", checkAlmostWin());
  }
}

function winDiagonallyLeftToRight() {
  let xWon = true;
  let oWon = true;
  for (let i = 0; i < 3; i++) {
    const cell = gameState.board[i][i];
    if (cell !== "x") {
      xWon = false;
    }
  }
  for (let i = 0; i < 3; i++) {
    const cell = gameState.board[i][i];
    if (cell !== "o") {
      oWon = false;
    }
  }
  if (xWon) {
    return "x";
  } else if (oWon) {
    return "o";
  }
  return null;
}

function winDiagonallyRightToLeft() {
  let xWon = true;
  let oWon = true;
  for (let i = 0; i < 3; i++) {
    const cell = gameState.board[i][2 - i];
    if (cell !== "x") {
      xWon = false;
    }
  }
  for (let i = 0; i < 3; i++) {
    const cell = gameState.board[i][2 - i];
    if (cell !== "o") {
      oWon = false;
    }
  }
  if (xWon) {
    return "x";
  } else if (oWon) {
    return "o";
  }
  return null;
}

function winHorizontally() {
  for (let i = 0; i < 3; i++) {
    let xWon = true;
    let oWon = true;
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[j][i];
      if (cell !== "x") {
        xWon = false;
      }
    }
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[j][i];
      if (cell !== "o") {
        oWon = false;
      }
    }
    if (xWon) {
      return "x";
    } else if (oWon) {
      return "o";
    }
  }
  return null;
}

function winVertically() {
  for (let i = 0; i < 3; i++) {
    let xWon = true;
    let oWon = true;
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[i][j];
      if (cell !== "x") {
        xWon = false;
      }
    }
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[i][j];
      if (cell !== "o") {
        oWon = false;
      }
    }
    if (xWon) {
      return "x";
    } else if (oWon) {
      return "o";
    }
  }
  return null;
}

function checkAlmostWinVertically(player) {
  for (let i = 0; i < 3; i++) {
    let winningSpace;
    let numberOfSpots = 0;
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[i][j];
      if (cell === player) {
        numberOfSpots++;
      } else if (!cell) {
        winningSpace = [i, j];
      }
    }
    if (numberOfSpots === 2) {
      return winningSpace;
    }
  }
  return null;
}

function checkAlmostWinHorizontally(player) {
  for (let i = 0; i < 3; i++) {
    let winningSpace;
    let numberOfSpots = 0;
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[j][i];
      if (cell === player) {
        numberOfSpots++;
      } else if (!cell) {
        winningSpace = [j, i];
      }
    }
    if (numberOfSpots === 2) {
      return winningSpace;
    }
  }
  return null;
}

function checkAlmostWinDiagonallyLeftToRight(player) {
  let winningSpace;
  let numberOfSpots = 0;
  for (let i = 0; i < 3; i++) {
    const cell = gameState.board[i][i];
    console.log("cell: ", cell);
    if (cell === player) {
      numberOfSpots++;
    } else if (!cell) {
      winningSpace = [i, i];
    }
  }
  if (numberOfSpots === 2) {
    return winningSpace;
  }
  return null;
}

function checkAlmostWinDiagonallyRightToLeft(player) {
  let winningSpace;
  let numberOfSpots = 0;
  for (let i = 0; i < 3; i++) {
    const cell = gameState.board[i][2 - i];
    if (cell === player) {
      numberOfSpots++;
    } else if (!cell) {
      winningSpace = [i, 2 - i];
    }
  }
  if (numberOfSpots === 2) {
    return winningSpace;
  }
  return null;
}

function checkAlmostWin(player) {
  let winningSpot;
  if ((winningSpot = checkAlmostWinHorizontally(player))) {
    return winningSpot;
  } else if ((winningSpot = checkAlmostWinVertically(player))) {
    return winningSpot;
  } else if ((winningSpot = checkAlmostWinDiagonallyLeftToRight(player))) {
    return winningSpot;
  } else if ((winningSpot = checkAlmostWinDiagonallyRightToLeft(player))) {
    return winningSpot;
  } else {
    return null;
  }
}

function checkWinner() {
  let winner;
  //combined assignment and if conditional
  if ((winner = winHorizontally())) {
    return winner;
  } else if ((winner = winVertically())) {
    return winner;
  } else if ((winner = winDiagonallyLeftToRight())) {
    return winner;
  } else if ((winner = winDiagonallyRightToLeft())) {
    return winner;
  } else {
    return null;
  }
}

function cellClicked(x, y) {
  if (gameState.board[x][y]) {
    return;
  }
  gameState.board[x][y] = gameState.currentPlayer;
  if (gameState.currentPlayer === "x") {
    gameState.currentPlayer = "o";
  } else {
    gameState.currentPlayer = "x";
  }
  gameState.winner = checkWinner();
  renderState();
}

// maybe a dozen or so helper functions for tiny pieces of the interface

// listeners
function onBoardClick() {
  // update state, maybe with another dozen or so helper functions...

  renderState(); // show the user the new state
}
window.onload = function () {
  // const board = document.getElementById("board");
  // console.log("board", board);
  resetGameState();
  renderState();
  // board.addEventListener("click", onBoardClick); // etc
};
