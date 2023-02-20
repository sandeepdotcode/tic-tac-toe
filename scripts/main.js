const menuElements = (() => {
  const p1NameInput = document.querySelector("#p1-name");
  const p2NameInput = document.querySelector("#p2-name");

  const nextBtn = document.querySelector(".next-btn");
  const restartBTn = document.querySelector(".restart-btn");

  return {
    p1NameInput,
    p2NameInput,
    nextBtn,
    restartBTn,
  };
})();

const gameBoard = (() => {
  let _gameState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let _currentPlayer = null;

  function getState(row, column) {
    return _gameState[row - 1][column - 1];
  }

  function changeState(row, column) {
    _gameState[row - 1][column - 1] = _currentPlayer.symbol;
  }

  const getCurrentPlayer = () => _currentPlayer;

  const setCurrentPlayer = () => {
    _currentPlayer = playerX;
  };

  const switchPlayer = () => {
    if (_currentPlayer == playerX) _currentPlayer = playerO;
    else _currentPlayer = playerX;
  };

  const reset = () => {
    _gameState = _gameState.map(() => ["", "", ""]);
    _currentPlayer = null;
  };

  const getRow = (num) => _gameState[num - 1];

  const getCol = (num) => {
    col = [];
    for (let i = 0; i < 3; i++) {
      col.push(_gameState[i][num - 1]);
    }

    return col;
  };

  const getDiags = () => {
    diag1 = [];
    diag2 = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === j) diag1.push(_gameState[i][j]);
        if (i + j == 2) diag2.push(_gameState[i][j]);
      }
    }
    return [diag1, diag2];
  };

  return {
    getState,
    changeState,
    setCurrentPlayer,
    getCurrentPlayer,
    switchPlayer,
    getRow,
    getCol,
    getDiags,
    reset,
  };
})();

const playerFactory = (symbol, name, type = "player") => {
  let _score = 0;

  const getScore = () => _score;

  const updateScore = () => {
    _score++;
  };

  return {
    name,
    symbol,
    type,

    getScore,
    updateScore,
  };
};

const ticTacFlow = (function () {
  let moves = 0;

  const setUpGame = (mode) => {
    const p1Name = menuElements.p1NameInput.value || "Player 1";
    menuElements.p1NameInput.value = "";
    if (mode === 0) {
      const p2Name = "AI";
    } else if (mode === 1) {
      const p2Name = menuElements.p2NameInput.value || "Player 2";
      menuElements.p2NameInput.value = "";
      playerX = playerFactory("X", p1Name);
      playerO = playerFactory("O", p2Name);
    }
    gameBoard.setCurrentPlayer();
  };

  checkThreeInRow = (arr) =>
    arr.some((subArr) => {
      const threeFields = subArr[0] + subArr[1] + subArr[2];
      return threeFields === "XXX" || threeFields === "OOO";
    });

  checkWinRow = () => {
    rows = [];
    for (let i = 1; i <= 3; i++) rows.push(gameBoard.getRow(i));

    return checkThreeInRow(rows);
  };

  checkWinCol = () => {
    columns = [];
    for (let i = 1; i <= 3; i++) columns.push(gameBoard.getCol(i));

    return checkThreeInRow(columns);
  };

  checkWinDiag = () => {
    diags = gameBoard.getDiags();

    return checkThreeInRow(diags);
  };

  const checkForWin = () => {
    if (checkWinRow() || checkWinCol() || checkWinDiag()) {
      return true;
    }
    return false;
  };

  const checkForGameEnd = () => {
    const winStatus = checkForWin();

    if (winStatus) return "win";
    if (!winStatus && moves == 9) return "draw";
    return "continue";
  };

  const endGame = (win = false) => {
    displayController.deactivateFields();
    if (win) {
      winner = gameBoard.getCurrentPlayer();
      winner.updateScore();
      displayController.displayScore();
    }
  };

  const newRound = () => {
    gameBoard.reset();
    displayController.resetFields();
    moves = 0;

    displayController.activateFields();
    gameBoard.setCurrentPlayer();
    displayController.showStatus();
  };

  const playOneMove = (event) => {
    const row = event.target.getAttribute("data-row");
    const column = event.target.getAttribute("data-column");

    gameBoard.changeState(row, column);
    displayController.renderState(event.target);
    moves += 1;

    const roundEnd = checkForGameEnd();
    if (roundEnd === "win") {
      endGame(true);
    } else if (roundEnd === "draw") {
      endGame();
    } else {
      gameBoard.switchPlayer();
    }
    displayController.showStatus(roundEnd);
  };

  const restartGame = () => {
    gameBoard.reset();
    displayController.resetFields();
    moves = 0;

    displayController.showModeSelect();
  };

  return {
    setUpGame,
    playOneMove,
    newRound,
    restartGame,
  };
})();

const displayController = (() => {
  const modeMenu = document.querySelector("#mode-menu");
  const twoPlayerMenu = document.querySelector("#two-player-menu");

  const twoPlayerBtn = document.getElementById("2-player");
  const twoStartBtn = document.querySelector("#two-player-start");

  const playerXStat = document.querySelector(".playerX-name");
  const playerXScore = document.querySelector(".playerX-score");
  const playerOStat = document.querySelector(".playerO-name");
  const playerOScore = document.querySelector(".playerO-score");
  const gameCells = document.querySelectorAll(".game-cell");

  const showModeSelect = () => {
    modeMenu.style.display = "flex";
  };

  const showModeSubMenu = (mode) => {
    modeMenu.style.display = "none";
    if (mode === 1) {
      twoPlayerMenu.style.display = "flex";
    }
  };

  const _init = (mode) => {
    if (mode === 0) return;
    if (mode === 1) {
      twoPlayerMenu.style.display = "none";
    }
    playerXStat.textContent = `${playerX.name} (X)`;
    playerOStat.textContent = `${playerO.name} (O)`;
    displayScore();

    activateFields();

    showStatus();

    menuElements.nextBtn.addEventListener("click", ticTacFlow.newRound);
    menuElements.restartBTn.addEventListener("click", ticTacFlow.restartGame);
  };

  const renderState = function (node) {
    const [row, column] = [
      node.getAttribute("data-row"),
      node.getAttribute("data-column"),
    ];
    node.textContent = gameBoard.getState(row, column);
  };

  const showStatus = (gameStatus) => {
    const statusDisplay = document.querySelector(".status-display");
    const player = gameBoard.getCurrentPlayer(); // either the winner or next player in case of continue

    if (gameStatus === "win") {
      statusDisplay.textContent = `${player.name} wins the game!`;
    } else if (gameStatus === "draw") {
      statusDisplay.textContent = "It's a Draw!";
    } else {
      /* gameStatus === "continues" */
      statusDisplay.textContent = `${player.name}'s turn.`;
    }
  };

  const resetFields = () => {
    gameCells.forEach((cell) => {
      cell.textContent = "";
    });
  };

  const activateFields = () => {
    gameCells.forEach((cell) =>
      cell.addEventListener("click", ticTacFlow.playOneMove, { once: true })
    );
  };

  const deactivateFields = () => {
    gameCells.forEach((cell) => {
      if (cell.textContent === "")
        cell.removeEventListener("click", ticTacFlow.playOneMove);
    });
  };

  const displayScore = () => {
    playerXScore.textContent = playerX.getScore();
    playerOScore.textContent = playerO.getScore();
  };

  return {
    twoPlayerBtn,
    twoStartBtn,
    gameCells,

    _init,
    renderState,
    showStatus,
    showModeSelect,
    showModeSubMenu,
    activateFields,
    deactivateFields,
    displayScore,
    resetFields,
  };
})();

// displayController.gameCells.forEach(displayController.renderState);
// displayController._init();

let playerX;
let playerO;

// displayController.singlePlayerBtn.addEventListener('click', displayController.showModeSubmenu.bind(displayController.singlePlayerBtn, 0));
displayController.twoPlayerBtn.addEventListener(
  "click",
  displayController.showModeSubMenu.bind(displayController.twoPlayerBtn, 1)
);
displayController.twoStartBtn.addEventListener("click", (event) => {
  event.preventDefault();
  ticTacFlow.setUpGame(1);
  displayController._init(1);
});
