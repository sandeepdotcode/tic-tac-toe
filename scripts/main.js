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

    const switchPlayer = (player) => {
        _currentPlayer = player;
    }

    return {
        getState,
        changeState,
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

})();

const displayController = (() => {
    const gameCells = document.querySelectorAll(".game-cell");

    const _init = () => {
        gameCells.forEach(cell => addEventListener('click', ticTacFlow./* method */ , {once: true}));
    }


    const renderState = function(node) {
        const [row, column] = [node.getAttribute('data-row'), node.getAttribute('data-column')];
        node.textContent = gameBoard.getState(row, column);
    }

    return {
        gameCells,
        renderState,

    }
})();

displayController.gameCells.forEach(displayController.renderState);