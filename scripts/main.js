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

    const playOneMove = (event) => {
        console.log(event);
        event.target.textContent = 'X';

    }

    return {
        playOneMove,
    }

})();

const displayController = (() => {
    const modeMenu = document.querySelector('#mode-menu');
    const twoPlayerMenu = document.querySelector('#two-player-menu');

    const twoPlayer = document.getElementById("2-player");
    const gameCells = document.querySelectorAll(".game-cell");

    const modeSelect = (mode) => {
        modeMenu.style.display = "none";
        if (mode === 1)
            twoPlayerMenu.style.display = "block";
    }

    const _init = () => {
        gameCells.forEach(cell => cell.addEventListener('click', ticTacFlow.playOneMove , {once: true}));

    }


    const renderState = function(node) {
        const [row, column] = [node.getAttribute('data-row'), node.getAttribute('data-column')];
        node.textContent = gameBoard.getState(row, column);
    }

    return {
        twoPlayer,
        gameCells,
        
        _init,
        renderState,
        modeSelect,
    }
})();

displayController.gameCells.forEach(displayController.renderState);
displayController._init();

displayController.twoPlayer.addEventListener('click', displayController.modeSelect.bind(displayController.twoPlayer, 1));