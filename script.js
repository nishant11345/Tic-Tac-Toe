// Global variables to store game state
let gridSize, winStreak;
let currentPlayer = 'X';
let moves = 0;
let gameBoard = [];
let savedGridSize, savedWinStreak;

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const startButton = document.getElementById('start-button');
    const gameSetupForm = document.getElementById('game-setup-form');
    const gridSizeInput = document.getElementById('grid-size');
    const winStreakInput = document.getElementById('win-streak');
    const newGameButton = document.getElementById('new-game-button');
    const restartButton = document.getElementById('restart-button');

    // Event listener for the start button to show the game setup screen
    startButton.addEventListener('click', () => {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('input-screen').classList.remove('hidden');
    });

    // Event listener for the game setup form submission
    gameSetupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        gridSize = parseInt(gridSizeInput.value);
        winStreak = parseInt(winStreakInput.value);

        // Validate win streak input
        if (winStreak < 3 || winStreak > gridSize) {
            alert('Win streak must be between 3 and the grid size.');
            return;
        }

        // Save grid size and win streak
        savedGridSize = gridSize;
        savedWinStreak = winStreak;

        // Hide input screen and show game screen
        document.getElementById('input-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');

        // Reset and initialize the game
        resetGame();
        initializeGame();
    });

    // Event listener for the new game button
    newGameButton.addEventListener('click', () => {
        // Hide game screen and show input screen
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('input-screen').classList.remove('hidden');
        // Reset the game
        resetGame();
    });

    // Event listener for the restart button
    restartButton.addEventListener('click', () => {
        // Reset the game and hide win message
        resetGame();
        document.getElementById('win-message').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
    });
});

// Initialize the game with saved grid size and win streak
function initializeGame() {
    gridSize = savedGridSize;
    winStreak = savedWinStreak;
    createGrid();
}

// Create the game grid dynamically based on the grid size
function createGrid() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear previous game grid if any
    for (let i = 0; i < gridSize; i++) {
        gameBoard[i] = [];
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < gridSize; j++) {
            gameBoard[i][j] = '';
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', handleMove);
            row.appendChild(cell);
        }
        gameContainer.appendChild(row);
    }
}

// Handle player move when a cell is clicked
function handleMove(event) {
    const row = event.target.getAttribute('data-row');
    const col = event.target.getAttribute('data-col');
    if (!gameBoard[row][col]) {
        event.target.textContent = currentPlayer;
        gameBoard[row][col] = currentPlayer;
        moves++;
        // Check for win or draw
        if (checkWin(row, col)) {
            document.getElementById('win-text').textContent = currentPlayer + ' wins!';
            document.getElementById('win-message').classList.remove('hidden');
        } else if (moves === gridSize * gridSize) {
            document.getElementById('win-text').textContent = 'It\'s a draw!';
            document.getElementById('win-message').classList.remove('hidden');
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Check if the current move results in a win
function checkWin(row, col) {
    return (
        checkDirection(row, col, 0, 1) || // Horizontal
        checkDirection(row, col, 1, 0) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal down-right
        checkDirection(row, col, 1, -1)   // Diagonal down-left
    );
}

// Check for win streak in a specific direction from the given row and column
function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    for (let i = 1; i < winStreak; i++) {
        const newRow = parseInt(row) + i * rowDir;
        const newCol = parseInt(col) + i * colDir;
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && gameBoard[newRow][newCol] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < winStreak; i++) {
        const newRow = parseInt(row) - i * rowDir;
        const newCol = parseInt(col) - i * colDir;
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && gameBoard[newRow][newCol] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    return count >= winStreak;
}

// Reset the game state
function resetGame() {
    gameBoard = [];
    currentPlayer = 'X';
    moves = 0;
    // Hide win message
    document.getElementById('win-message').classList.add('hidden');
    // Initialize the game again
    initializeGame();
}
