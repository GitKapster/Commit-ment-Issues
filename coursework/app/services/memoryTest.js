document.addEventListener('DOMContentLoaded', () => {
  const difficulty = window.location.pathname.split('/')[2];
  let rows, cols;
  let baseScore, timeLimit;
  
  // Set grid size based on difficulty
  switch(difficulty) {
    case 'easy':
      rows = 2;
      cols = 3;
      baseScore = 600;
      timeLimit = 6; // seconds
      break;
    case 'medium':
      rows = 2;
      cols = 4;
      baseScore = 800;
      timeLimit = 8; // seconds
      break;
    case 'hard':
      rows = 2;
      cols = 5;
      baseScore = 1000;
      timeLimit = 10; // seconds
      break;
    default:
      rows = 2;
      cols = 3;
      baseScore = 600;
      timeLimit = 15; // seconds
  }
  
  const totalCards = rows * cols;
  const minMoves = (totalCards / 2); // Minimum possible moves (perfect play)
  const symbols = ['★', '☀', '♫', '☂', '♠', '♥', '♦', '♣', '☎', '✈', '☯', '⚓'];
  const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    canFlip: false,
    startTime: null,
    timerInterval: null,
    moves: 0,
    currentScore: baseScore
  };
  
  const cardsGrid = document.getElementById('cardsGrid');
  const difficultyInfo = document.getElementById('difficultyInfo');
  const timerElement = document.getElementById('time');
  const gameStatsElement = document.getElementById('gameStats');
  const scoreElement = document.getElementById('score');
  const scoreModal = document.getElementById('scoreModal');
  const finalStatsElement = document.getElementById('finalStats');
  const saveStatusElement = document.getElementById('saveStatus');
  
  // Initialize the game
  function initGame() {
    // Clear previous game
    cardsGrid.innerHTML = '';
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.canFlip = false;
    gameState.moves = 0;
    gameState.currentScore = baseScore;
    scoreModal.style.display = 'none';
    
    // Set grid style
    cardsGrid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    
    // Create pairs of symbols
    const pairsNeeded = totalCards / 2;
    const selectedSymbols = symbols.slice(0, pairsNeeded);
    const cardValues = [...selectedSymbols, ...selectedSymbols];
    
    // Shuffle the cards
    shuffleArray(cardValues);
    
    // Create card elements
    cardValues.forEach((value, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = index;
      
      const cardFront = document.createElement('div');
      cardFront.className = 'card-face card-front';
      
      const cardBack = document.createElement('div');
      cardBack.className = 'card-face card-back';
      cardBack.textContent = value;
      
      card.appendChild(cardFront);
      card.appendChild(cardBack);
      
      card.addEventListener('click', () => handleCardClick(card));
      
      cardsGrid.appendChild(card);
      gameState.cards.push({
        element: card,
        value: value,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Show cards for memorization
    flipAllCards(true);
    difficultyInfo.textContent = `Memorize the cards! They'll flip back in 3 seconds... Time limit: ${timeLimit} seconds`;
    
    // Display initial score
    updateScore();
    
    // Start timer for memorization
    setTimeout(() => {
      flipAllCards(false);
      gameState.canFlip = true;
      difficultyInfo.textContent = `Find all matching pairs! Time limit: ${timeLimit} seconds`;
      startTimer();
      updateStats();
    }, 3000);
  }
  
  // Handle card clicks
  function handleCardClick(card) {
    if (!gameState.canFlip) return;
    
    const index = parseInt(card.dataset.index);
    const cardState = gameState.cards[index];
    
    // Don't allow flipping if already flipped or matched
    if (cardState.isFlipped || cardState.isMatched) return;
    
    // Flip the card
    flipCard(cardState, true);
    gameState.flippedCards.push(cardState);
    gameState.moves++;
    
    // Calculate score
    if (gameState.moves + 1 > minMoves) {
      // Only deduct points for moves beyond the minimum
      const movesPenalty = Math.floor((gameState.moves - minMoves) / 2) * 25;
      gameState.currentScore = Math.max(0, baseScore - movesPenalty);
      
      // Also check for time penalties
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - gameState.startTime) / 1000);
      if (elapsedSeconds > timeLimit) {
        const timePenalty = (elapsedSeconds - timeLimit) * 10;
        gameState.currentScore = Math.max(0, gameState.currentScore - timePenalty);
      }
    }
    
    updateStats();
    updateScore();
    
    // Check for match if two cards are flipped
    if (gameState.flippedCards.length === 2) {
      gameState.canFlip = false;
      
      if (gameState.flippedCards[0].value === gameState.flippedCards[1].value) {
        // Match found
        gameState.flippedCards.forEach(card => {
          card.isMatched = true;
          card.element.classList.add('matched');
        });
        gameState.matchedPairs++;
        gameState.flippedCards = [];
        gameState.canFlip = true;
        
        // Check if game is complete
        if (gameState.matchedPairs === totalCards / 2) {
          endGame();
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          gameState.flippedCards.forEach(card => flipCard(card, false));
          gameState.flippedCards = [];
          gameState.canFlip = true;
        }, 1000);
      }
    }
  }
  
  // Flip a card
  function flipCard(cardState, isFlipped) {
    cardState.isFlipped = isFlipped;
    cardState.element.classList.toggle('flipped', isFlipped);
  }
  
  // Flip all cards (for memorization phase)
  function flipAllCards(show) {
    gameState.cards.forEach(card => {
      flipCard(card, show);
    });
  }
  
  // Update game stats
  function updateStats() {
    gameStatsElement.textContent = `Moves: ${gameState.moves} | Matched: ${gameState.matchedPairs}/${totalCards/2}`;
  }
  
  // Update score display
  function updateScore() {
    scoreElement.textContent = gameState.currentScore;
  }
  
  // Timer functions
  function startTimer() {
    gameState.startTime = new Date();
    gameState.timerInterval = setInterval(() => {
      updateTimer();
      
      // Check if time limit exceeded and apply score penalty
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - gameState.startTime) / 1000);
      
      if (elapsedSeconds > timeLimit && gameState.canFlip) {
        const timePenalty = (elapsedSeconds - timeLimit) * 10;
        const movesPenalty = Math.floor(Math.max(0, gameState.moves - minMoves) / 2) * 25;
        gameState.currentScore = Math.max(0, baseScore - movesPenalty - timePenalty);
        updateScore();
      }
    }, 1000);
  }
  
  function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - gameState.startTime) / 1000);
    timerElement.textContent = elapsedSeconds;
  }
  
  async function endGame() {
    clearInterval(gameState.timerInterval);
    const finalTime = parseInt(timerElement.textContent);
    
    // Calculate final score
    let timePenalty = 0;
    if (finalTime > timeLimit) {
      timePenalty = (finalTime - timeLimit) * 10;
    }
    
    const movesPenalty = Math.floor(Math.max(0, gameState.moves - minMoves) / 2) * 25;
    gameState.currentScore = Math.max(0, baseScore - movesPenalty - timePenalty);
    
    updateScore();
    
    // Show final stats in modal
    finalStatsElement.textContent = `Time: ${finalTime}s | Moves: ${gameState.moves} | Score: ${gameState.currentScore}`;
    scoreModal.style.display = 'flex';
    
    // Set up close button
    document.getElementById('closeModal').addEventListener('click', () => {
      scoreModal.style.display = 'none';
    }, { once: true });
    
    // Save score if user is logged in
    try {
      const response = await fetch('/check-auth');
      const authData = await response.json();
      
      if (authData.isAuthenticated) {
        saveStatusElement.textContent = 'Saving your score...';
        const saveResponse = await fetch('/memory-test/save-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: gameState.currentScore,
            difficulty: difficulty
          })
        });
        
        const saveResult = await saveResponse.json();
        if (saveResult.success) {
          saveStatusElement.textContent = 'Score saved successfully!';
        } else {
          saveStatusElement.textContent = 'Failed to save score. Please try again.';
        }
      }
    } catch (error) {
      console.error('Error saving score:', error);
      if (saveStatusElement) {
        saveStatusElement.textContent = 'Error saving score. Please try again.';
      }
    }
  }
  
  // Utility function to shuffle array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Initialize the game
  initGame();
});