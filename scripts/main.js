const menuElements = (() => {
    const p1NameInput = document.querySelector('#p1-name');
    const p2NameInput = document.querySelector('#p2-name');

    return {
        p1NameInput,
        p2NameInput,
    }
})();

const gameBoard = (() => {
    let _gameState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let _currentPlayer = undefined;

    function getState(row, column) {
        return _gameState[row - 1][column - 1];
    }

    function changeState(row, column) {
        _gameState[row - 1][column - 1] = _currentPlayer.symbol;
    }

    const getCurrentPlayer = () => {
        return _currentPlayer;
    }

    const setCurrentPlayer = () => {
        _currentPlayer = playerX;
    }

    const switchPlayer = () => {
        if (_currentPlayer == playerX) 
            _currentPlayer = playerO;
        else
            _currentPlayer = playerX;
    }

    const reset = () => {
        _gameState = _gameState.map(() => ['', '', '']);
        _currentPlayer = undefined;
    }

    return {
        getState,
        changeState,
        setCurrentPlayer,
        getCurrentPlayer,
        switchPlayer,
        reset,
    };
})();

const playerFactory = (symbol, name, type = 'player') => {
    return {
        name,
        symbol,
        type,
    }
}

const ticTacFlow = (function() {
    let moves = 0;

    const setUpGame = (mode) => {
        const p1Name = (menuElements.p1NameInput.textContent || "Player 1");
        console.log(p1Name);
        if (mode === 0)
        {
            const p2Name = "AI";
        }
        else if (mode === 1)
        {
            const p2Name = (menuElements.p2NameInput.textContent || "Player 2");
            playerX = playerFactory('X', p1Name);
            playerO = playerFactory('O', p2Name);
        }
        gameBoard.setCurrentPlayer();
    }

    checkThreeInRow = (arr) => {
        return arr.some(subArr => {
            return subArr[0] == subArr[1] == subArr[2];
        });
    }

    checkWinRow = () => {
        rows = [];
        for (let i = 1; i <= 3; i++)
            rows.push(gameBoard.getRow(i));

        return checkThreeInRow(rows);
    }

    checkWinCol = () => {
        columns = [];
        for (let i = 1; i <= 3; i++)
            columns.push(gameBoard.getCol(i));

        return checkThreeInRow(columns);
    }

    checkWinDiag = () => {
        diags = gameBoard.getDiags();

        return checkThreeInRow(diags);
    }

    const checkForWin = () => {
        if (checkWinRow || checkWinCol || checkWinDiag)
            return true;
        else
            return false;
    }

    const checkForGameEnd = () => {
        const winStatus = checkForWin();

        if (winStatus)
            return "win";
        else if (!winStatus && moves == 9)
            return "draw";
        else
            return "continue";
    }

    const endGame = () => {
        
    }

    const playOneMove = (event) => {
        console.log(event);
        let row = event.target.getAttribute('data-row');
        let column = event.target.getAttribute('data-column');

        gameBoard.changeState(row, column);
        displayController.renderState(event.target);
        moves += 1;

        let roundEnd =  checkForGameEnd();  // to be built
        if (roundEnd === "win") {
            alert(`${gameBoard._currentPlayer} Won!`);
            endGame();
        }
        else if (roundEnd === "draw") {
            alert("It's a Draw");
            endGame();
        }
        else {
            gameBoard.switchPlayer();
        }
    }

    return {
        setUpGame,
        playOneMove,
    }

})();

const displayController = (() => {
    const modeMenu = document.querySelector('#mode-menu');
    const twoPlayerMenu = document.querySelector('#two-player-menu');

    const twoPlayerBtn = document.getElementById("2-player");
    const twoStartBtn = document.querySelector("#two-player-start");
    
    const playerXStat = document.querySelector(".playerX-name");
    const playerOStat = document.querySelector(".playerO-name");
    const gameCells = document.querySelectorAll(".game-cell");

    const showModeSubMenu = (mode) => {
        modeMenu.style.display = "none";
        if (mode === 1)
        {
            twoPlayerMenu.style.display = "flex";
        }
    }

    const _init = (mode) => {
        if (mode === 0)
            return;
        else if (mode === 1)
        {
            twoPlayerMenu.style.display = "none";
        }
        playerXStat.textContent = playerX.name;
        playerOStat.textContent = playerO.name;

        gameCells.forEach(cell => cell.addEventListener('click', ticTacFlow.playOneMove , {once: true}));

    }


    const renderState = function(node) {
        const [row, column] = [node.getAttribute('data-row'), node.getAttribute('data-column')];
        node.textContent = gameBoard.getState(row, column);
    }

    return {
        twoPlayerBtn,
        twoStartBtn,
        gameCells,
        
        _init,
        renderState,
        showModeSubMenu,
    }
})();

// displayController.gameCells.forEach(displayController.renderState);
// displayController._init();

let playerX, playerO;

// displayController.singlePlayerBtn.addEventListener('click', displayController.showModeSubmenu.bind(displayController.singlePlayerBtn, 0));
displayController.twoPlayerBtn.addEventListener('click', displayController.showModeSubMenu.bind(displayController.twoPlayerBtn, 1));
displayController.twoStartBtn.addEventListener('click', (event) => {
    event.preventDefault();
    ticTacFlow.setUpGame(1);
    displayController._init(1);
});
