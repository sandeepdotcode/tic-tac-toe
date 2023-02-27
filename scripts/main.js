const menuElements = (() => {
  const p1NameInput = document.querySelector("#p1-name");
  const p2NameInput = document.querySelector("#p2-name");

  const singleNameInput = document.querySelector("#player-name--single");
  const singleSymbol = document.querySelector("#player-symbol");

  const nextBtn = document.querySelector(".next-btn");
  const restartBTn = document.querySelector(".restart-btn");

  let isMenuSelected = false;

  const makeSelected = () => {isMenuSelected = true};
  const notSelected = () => {isMenuSelected = false};
  const getMenuSelected = () => isMenuSelected;

  return {
    p1NameInput,
    p2NameInput,
    singleNameInput,
    singleSymbol,
    nextBtn,
    restartBTn,

    makeSelected,
    notSelected,
    getMenuSelected
  };
})();

const gameBoard = (() => {
  let gameState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  let _currentPlayer = null;

  function getState(row, column) {
    return gameState[row - 1][column - 1];
  }

  function changeState(row, column) {
    gameState[row - 1][column - 1] = _currentPlayer.symbol;
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
    gameState = gameState.map(() => ["", "", ""]);
    _currentPlayer = null;
  };

  const getRow = (num) => gameState[num - 1];

  const getCol = (num) => {
    col = [];
    for (let i = 0; i < 3; i++) {
      col.push(gameState[i][num - 1]);
    }

    return col;
  };

  const getDiags = () => {
    diag1 = [];
    diag2 = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === j) diag1.push(gameState[i][j]);
        if (i + j == 2) diag2.push(gameState[i][j]);
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
    const p1Name = menuElements.p1NameInput.value || menuElements.singleNameInput.value || "Player 1";
    menuElements.p1NameInput.value = "";
    menuElements.singleNameInput.value = "";
    if (mode === 0) {
      const isSymbolChecked = menuElements.singleSymbol.checked;
      if (isSymbolChecked === true) {
        playerX = playerFactory("X", "Computer", "computer");
        playerO = playerFactory("O", p1Name);
        setTimeout(playComputerMove, 500);
      }
      else {
        playerX = playerFactory("X", p1Name);
        playerO = playerFactory("O", "Computer", "computer");
      }
    } 
    else if (mode === 1) {
      const p2Name = menuElements.p2NameInput.value || "Player 2";
      menuElements.p2NameInput.value = "";
      playerX = playerFactory("X", p1Name);
      playerO = playerFactory("O", p2Name);
    }
    gameBoard.setCurrentPlayer();
  };

  const checkThreeInRow = (arr) =>
    arr.some((subArr) => {
      const threeFields = subArr[0] + subArr[1] + subArr[2];
      return threeFields === "XXX" || threeFields === "OOO";
    });

  const checkWinRow = () => {
    rows = [];
    for (let i = 1; i <= 3; i++) rows.push(gameBoard.getRow(i));

    return checkThreeInRow(rows);
  };

  const checkWinCol = () => {
    columns = [];
    for (let i = 1; i <= 3; i++) columns.push(gameBoard.getCol(i));

    return checkThreeInRow(columns);
  };

  const checkWinDiag = () => {
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

  const getRandomNum = () => Math.floor(Math.random() * (4-1) + 1);

  const playComputerMove = () => {
    const [r, c] = [getRandomNum(3).toString(), getRandomNum(3).toString()];

    console.log({r, c});

    if (gameBoard.getState(r,c) === "") {
      const node = document.querySelector(`[data-row="${r}"][data-column="${c}"]`);
      console.log({node});
      node.removeEventListener("click", ticTacFlow.userClicked);
      setTimeout(() => {playOneMove(node)}, 800) ;
    } 
    else playComputerMove();
  }

  const playOneMove = (field) => {
    const row = field.getAttribute("data-row");
    const column = field.getAttribute("data-column");

    gameBoard.changeState(row, column);
    displayController.renderState(field);
    moves += 1;

    const roundEnd = checkForGameEnd();
    if (roundEnd === "win") {
      endGame(true);
    } else if (roundEnd === "draw") {
      endGame();
    } else {
      gameBoard.switchPlayer();
      if (gameBoard.getCurrentPlayer().type === "computer") playComputerMove();
    }
    displayController.showStatus(roundEnd);
  };

  const userClicked = (event) => {
    if (gameBoard.getCurrentPlayer().type === "computer") {
      event.target.addEventListener("click", ticTacFlow.userClicked, {once: true});
      return;
    }
    playOneMove(event.target);
  }

  const restartGame = () => {
    menuElements.notSelected();
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
    userClicked
  };
})();

const displayController = (() => {
  const modeMenu = document.querySelector("#mode-menu");
  const twoPlayerMenu = document.querySelector("#two-player-menu");
  const singleMenu = document.querySelector(".single-player-menu");

  const twoPlayerBtn = document.getElementById("2-player");
  const twoStartBtn = document.querySelector("#two-player-start");
  const singlePlayerBtn = document.getElementById("1-player");
  const singleStartBtn = document.querySelector("#single-player-start");


  const playerXStat = document.querySelector(".playerX-name");
  const playerXScore = document.querySelector(".playerX-score");
  const playerOStat = document.querySelector(".playerO-name");
  const playerOScore = document.querySelector(".playerO-score");
  const gameCells = document.querySelectorAll(".game-cell");

  const shrinkMenu = () => {
    modeMenu.classList.add("short-menu");
  }

  const showModeSelect = () => {
    modeMenu.style.display = "flex";
  };

  const showModeSubMenu = (mode) => {
    
    // modeMenu.style.display = "none";
    if (mode === 0) {
      twoPlayerMenu.style.display = "none";
      singleMenu.style.display = "flex";
    }
    else if (mode === 1) {
      singleMenu.style.display = "none";
      twoPlayerMenu.style.display = "flex";
    }
    
    if (!menuElements.getMenuSelected())
    {
      shrinkMenu();
      menuElements.makeSelected();
    }
  };

  const init = (mode) => {
    modeMenu.style.display = "none";
    modeMenu.classList.remove("short-menu");
    if (mode === 0) {
      singleMenu.style.display = "none";
    }
    else if (mode === 1) {
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
      cell.addEventListener("click", ticTacFlow.userClicked, { once: true })
    );
  };

  const deactivateFields = () => {
    gameCells.forEach((cell) => {
      if (cell.textContent === "")
        cell.removeEventListener("click", ticTacFlow.userClicked);
    });
  };

  const displayScore = () => {
    playerXScore.textContent = playerX.getScore();
    playerOScore.textContent = playerO.getScore();
  };

  return {
    twoPlayerBtn,
    singlePlayerBtn,
    twoStartBtn,
    singleStartBtn,
    gameCells,

    init,
    shrinkMenu,
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
// displayController.init();

let playerX;
let playerO;

displayController.singlePlayerBtn.addEventListener('click', displayController.showModeSubMenu.bind(displayController.singlePlayerBtn, 0));

displayController.singleStartBtn.addEventListener('click', (event) => {
  event.preventDefault();
  ticTacFlow.setUpGame(0);
  displayController.init(0);
})

displayController.twoPlayerBtn.addEventListener(
  "click",
  displayController.showModeSubMenu.bind(displayController.twoPlayerBtn, 1)
);

displayController.twoStartBtn.addEventListener("click", (event) => {
  event.preventDefault();
  ticTacFlow.setUpGame(1);
  displayController.init(1);
});
