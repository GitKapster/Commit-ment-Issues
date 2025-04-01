document.addEventListener('DOMContentLoaded', () => {
   
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty') || 'easy'; // Default to easy if not specified
    
    const gameContainer = document.querySelector('.game-container');
    const gameInfo = document.querySelector('.game-info');
    const gameBoard = document.querySelector('.game-board');
    const timer = document.querySelector('.timer');
    const moves = document.querySelector('.moves');
    const restartBtn = document.querySelector('.restart-btn');
    const gameOver = document.querySelector('.game-over');
    const finalTime = document.querySelector('.final-time');
    const finalMoves = document.querySelector('.final-moves');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let movesCount = 0;
    let timeElapsed = 0;
    let timerInterval;
    let gameStarted = false;
    let canFlip = false;

    // Symbols for the cards
    const symbols = ['★', '♥', '♦', '♠', '♣', '⚡', '☀', '☁', '☂'];

    // Set up difficulty levels
    const difficulties = {
        easy: { rows: 2, cols: 3 },
        medium: { rows: 2, cols: 4 },
        hard: { rows: 2, cols: 5 }
    };

    // Initialize the game with the selected difficulty
    function initGame(difficulty) {
        const { rows, cols } = difficulties[difficulty];
        totalPairs = (rows * cols) / 2;
        matchedPairs = 0;
        movesCount = 0;
        timeElapsed = 0;
        flippedCards = [];
        gameStarted = false;
        canFlip = false;

        // Reset UI
        gameBoard.innerHTML = '';
        moves.textContent = `Moves: ${movesCount}`;
        timer.textContent = `Time: ${timeElapsed}s`;
        if (gameOver) gameOver.classList.add('hidden');
        
        // Create cards
        cards = createCards(rows, cols);
        
        // Set up the game board grid
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
        // Add cards to the board
        cards.forEach(card => {
            gameBoard.appendChild(card);
        });

        // Show all cards for 3 seconds
        cards.forEach(card => card.classList.add('flipped'));
        
        setTimeout(() => {
            cards.forEach(card => card.classList.remove('flipped'));
            canFlip = true;
            startTimer();
        }, 3000);
    }

    // Create cards with random symbols
    function createCards(rows, cols) {
        const totalCards = rows * cols;
        const cardSymbols = [];
        
        // Generate pairs of symbols
        for (let i = 0; i < totalCards / 2; i++) {
            const symbol = symbols[i];
            cardSymbols.push(symbol, symbol);
        }
        
        // Shuffle the symbols
        shuffleArray(cardSymbols);
        
        // Create card elements
        return cardSymbols.map((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">${symbol}</div>
                </div>
            `;
            
            card.addEventListener('click', () => flipCard(card));
            
            return card;
        });
    }

    // Shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Handle card flipping
    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        if (!gameStarted) {
            gameStarted = true;
        }
        
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            movesCount++;
            moves.textContent = `Moves: ${movesCount}`;
            canFlip = false;
            
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                // Cards match
                matchedPairs++;
                flippedCards.forEach(card => {
                    card.classList.add('matched');
                });
                flippedCards = [];
                canFlip = true;
                
                if (matchedPairs === totalPairs) {
                    endGame();
                }
            } else {
                // Cards don't match
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }

    // Start the timer
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeElapsed++;
            timer.textContent = `Time: ${timeElapsed}s`;
        }, 1000);
    }

    // End the game
    function endGame() {
        clearInterval(timerInterval);
        if (finalTime && finalMoves) {
            finalTime.textContent = `${timeElapsed} seconds`;
            finalMoves.textContent = `${movesCount}`;
            gameOver.classList.remove('hidden');
        } else {
            alert(`Congratulations! You completed the game in ${timeElapsed} seconds with ${movesCount} moves.`);
        }
    }

    // Event listener for restart button
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            // Redirect back to the main page
            window.location.href = 'index.html';
        });
    }

    // Initialize game on page load with difficulty from URL parameter
    initGame(difficulty);
});