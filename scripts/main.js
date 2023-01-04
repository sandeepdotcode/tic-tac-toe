const gameBoard = (() => {
    let _gameState = [
        ['X', 'O', 'X'],
        ['O', 'O', 'X'],
        ['X', 'X', 'O']
    ];

    function getState(row, column) {
        return _gameState[row - 1][column - 1];
    }

    function changeState(row, column, symbol) {
        _gameState[row - 1][column - 1] = symbol;
    }

    return {
        getState,
        changeState,
    };
})();

const playerFactory = () => {
}

const ticTacFlow = (function() {

})();

const displayController = (function() {
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