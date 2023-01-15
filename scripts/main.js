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
        ['X', 'O', 'X'],
        ['O', 'O', 'X'],
        ['X', 'X', 'O']
    ];

    _currentPlayer = undefined;

    function getState(row, column) {
        return _gameState[row - 1][column - 1];
    }

    function changeState(row, column, symbol) {
        _gameState[row - 1][column - 1] = symbol;
    }

    const getCurrentPlayer = () => {
        return _currentPlayer;
    }

    // switchPlayer()

    return {
        getState,
        changeState,
        getCurrentPlayer,
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
    }

    const playOneMove = (event) => {
        console.log(event);
        event.target.textContent = 'X';

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
