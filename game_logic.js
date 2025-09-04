// Game Configuration
const wordList = ["python", "computer", "programming", "gemini", "miniproject", "development", "challenge", "algorithm"];
const maxAttempts = 5;

// Game State
let currentGame = null;
let secretWord = null;
let secretNumber = null;
let wordAttempts = maxAttempts;
let numberAttempts = maxAttempts;
let wordHistory = [];
let numberHistory = [];

// Initialize the game
function initGame() {
    // Generate new secret values
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    secretNumber = Math.floor(Math.random() * 100) + 1;
    
    // Reset game state
    wordAttempts = maxAttempts;
    numberAttempts = maxAttempts;
    wordHistory = [];
    numberHistory = [];
    
    // Update UI
    updateAttemptsDisplay();
    clearHistory();
    clearHints();
    
    console.log('Game initialized:', { secretWord, secretNumber });
}

// Game Selection
function selectGame(gameType) {
    currentGame = gameType;
    
    // Hide all sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected game
    if (gameType === 'word') {
        document.getElementById('wordGame').classList.add('active');
        document.getElementById('wordInput').focus();
    } else if (gameType === 'number') {
        document.getElementById('numberGame').classList.add('active');
        document.getElementById('numberInput').focus();
    }
}

// Back to game selection
function backToSelection() {
    currentGame = null;
    
    // Hide all sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show game selection
    document.getElementById('gameSelection').classList.add('active');
}

// Word Game Logic
function submitWordGuess() {
    const input = document.getElementById('wordInput');
    const guess = input.value.trim().toLowerCase();
    
    if (!guess) {
        showHint('word', 'Please enter a word to guess!', 'error');
        return;
    }
    
    // Add to history
    const historyItem = {
        guess: guess,
        result: guess === secretWord ? 'correct' : 'incorrect',
        message: guess === secretWord ? 'Correct!' : 'Incorrect!'
    };
    
    wordHistory.push(historyItem);
    updateWordHistory();
    
    if (guess === secretWord) {
        // Win condition
        showGameOver('word', true);
        return;
    }
    
    // Decrease attempts
    wordAttempts--;
    updateAttemptsDisplay();
    
    // Show hint at 3 attempts
    if (wordAttempts === 3) {
        const hint = `Hint: The secret word starts with '${secretWord[0]}' and ends with '${secretWord[secretWord.length - 1]}'`;
        showHint('word', hint, 'hint');
    }
    
    // Check if game over
    if (wordAttempts <= 0) {
        showGameOver('word', false);
        return;
    }
    
    // Clear input and show message
    input.value = '';
    showHint('word', `Sorry, that's not it. You have ${wordAttempts} attempts left.`, 'info');
    
    input.focus();
}

// Number Game Logic
function submitNumberGuess() {
    const input = document.getElementById('numberInput');
    const guess = parseInt(input.value);
    
    if (!guess || guess < 1 || guess > 100) {
        showHint('number', 'Please enter a valid number between 1 and 100!', 'error');
        return;
    }
    
    // Add to history
    const historyItem = {
        guess: guess,
        result: guess === secretNumber ? 'correct' : 'incorrect',
        message: guess === secretNumber ? 'Correct!' : (guess < secretNumber ? 'Higher!' : 'Lower!')
    };
    
    numberHistory.push(historyItem);
    updateNumberHistory();
    
    if (guess === secretNumber) {
        // Win condition
        showGameOver('number', true);
        return;
    }
    
    // Decrease attempts
    numberAttempts--;
    updateAttemptsDisplay();
    
    // Show hint
    const hint = guess < secretNumber ? 'Hint: The secret number is higher.' : 'Hint: The secret number is lower.';
    showHint('number', hint, 'hint');
    
    // Check if game over
    if (numberAttempts <= 0) {
        showGameOver('number', false);
        return;
    }
    
    // Clear input and show message
    input.value = '';
    showHint('number', `Sorry, that's not it. You have ${numberAttempts} attempts left.`, 'info');
    
    input.focus();
}

// Update attempts display
function updateAttemptsDisplay() {
    document.getElementById('wordAttempts').textContent = wordAttempts;
    document.getElementById('numberAttempts').textContent = numberAttempts;
}

// Show hints
function showHint(gameType, message, type = 'info') {
    const hintElement = document.getElementById(`${gameType}Hint`);
    hintElement.textContent = message;
    hintElement.className = `hint hint-${type}`;
}

// Clear hints
function clearHints() {
    document.getElementById('wordHint').textContent = '';
    document.getElementById('numberHint').textContent = '';
}

// Update word game history
function updateWordHistory() {
    const historyContainer = document.getElementById('wordHistory');
    historyContainer.innerHTML = '';
    
    wordHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `guess-item guess-${item.result}`;
        historyItem.innerHTML = `
            <span>Guess: <strong>${item.guess}</strong></span>
            <span>${item.message}</span>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Update number game history
function updateNumberHistory() {
    const historyContainer = document.getElementById('numberHistory');
    historyContainer.innerHTML = '';
    
    numberHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `guess-item guess-${item.result}`;
        historyItem.innerHTML = `
            <span>Guess: <strong>${item.guess}</strong></span>
            <span>${item.message}</span>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Clear history
function clearHistory() {
    document.getElementById('wordHistory').innerHTML = '';
    document.getElementById('numberHistory').innerHTML = '';
}

// Show game over
function showGameOver(gameType, won) {
    // Hide all sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show game over section
    const gameOverSection = document.getElementById('gameOver');
    gameOverSection.classList.add('active');
    
    if (won) {
        document.getElementById('gameOverTitle').textContent = '🎉 Congratulations!';
        document.getElementById('gameOverMessage').textContent = `You've successfully guessed the ${gameType === 'word' ? 'word' : 'number'}!`;
    } else {
        document.getElementById('gameOverTitle').textContent = '😔 Game Over';
        document.getElementById('gameOverMessage').textContent = `You've run out of attempts. Better luck next time!`;
    }
    
    // Show final result
    const finalResult = document.getElementById('finalResult');
    if (gameType === 'word') {
        finalResult.innerHTML = `
            <strong>Secret Word:</strong> ${secretWord}<br>
            <strong>Your Attempts:</strong> ${maxAttempts - wordAttempts}
        `;
    } else {
        finalResult.innerHTML = `
            <strong>Secret Number:</strong> ${secretNumber}<br>
            <strong>Your Attempts:</strong> ${maxAttempts - numberAttempts}
        `;
    }
}

// Play again
function playAgain() {
    initGame();
    backToSelection();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (currentGame === 'word') {
            submitWordGuess();
        } else if (currentGame === 'number') {
            submitNumberGuess();
        }
    }
    
    if (event.key === 'Escape') {
        backToSelection();
    }
});

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // Add input event listeners for better UX
    document.getElementById('wordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitWordGuess();
    });
    
    document.getElementById('numberInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitNumberGuess();
    });
});

// Add some CSS classes for hint types
const style = document.createElement('style');
style.textContent = `
    .hint-error { color: #e74c3c !important; }
    .hint-info { color: #3498db !important; }
    .hint-hint { color: #f39c12 !important; }
`;
document.head.appendChild(style);
