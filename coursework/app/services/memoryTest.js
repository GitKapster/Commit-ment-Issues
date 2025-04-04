// public/memory-test.js
document.addEventListener('DOMContentLoaded', () => {
    const difficulty = window.location.pathname.split('/')[2];
    let rows, cols;
    
    // Set grid size based on difficulty
    switch(difficulty) {
      case 'easy':
        rows = 2;
        cols = 3;
        break;
      case 'medium':
        rows = 2;
        cols = 4;
        break;
      case 'hard':
        rows = 2;
        cols = 5;
        break;
      default:
        rows = 2;
        cols = 3;
    }
    
    const totalCards = rows * cols;
    const symbols = ['★', '☀', '♫', '☂', '♠', '♥', '♦', '♣', '☎', '✈', '☯', '⚓'];
    const gameState = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      canFlip: false,
      startTime: null,
      timerInterval: null,
      moves: 0
    };
    
    const cardsGrid = document.getElementById('cardsGrid');
    const difficultyInfo = document.getElementById('difficultyInfo');
    const timerElement = document.getElementById('time');
    const gameStatsElement = document.getElementById('gameStats');
    
    // Initialize the game
    function initGame() {
      // Clear previous game
      cardsGrid.innerHTML = '';
      gameState.cards = [];
      gameState.flippedCards = [];
      gameState.matchedPairs = 0;
      gameState.canFlip = false;
      gameState.moves = 0;
      
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
      difficultyInfo.textContent = "Memorize the cards! They'll flip back in 3 seconds...";
      
      // Start timer for memorization
      setTimeout(() => {
        flipAllCards(false);
        gameState.canFlip = true;
        difficultyInfo.textContent = "Find all matching pairs!";
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
      updateStats();
      
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
    
    // Timer functions
    function startTimer() {
      gameState.startTime = new Date();
      gameState.timerInterval = setInterval(updateTimer, 1000);
    }
    
    function updateTimer() {
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime - gameState.startTime) / 1000);
      timerElement.textContent = elapsedSeconds;
    }
    
    function endGame() {
      clearInterval(gameState.timerInterval);
      const finalTime = timerElement.textContent;
      difficultyInfo.textContent = `Congratulations! You completed the game in ${finalTime} seconds with ${gameState.moves} moves!`;
      gameState.canFlip = false;
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