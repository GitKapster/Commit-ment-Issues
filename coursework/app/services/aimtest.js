var app = new Vue({
    el: '#app',
    data: {
      started: false,
      finished: false,
      scoresCount: 0,
      finalScores: 0,
      mode: 'Easy', // Default
      targetsCreated: 0,
      maxTargets: 30,
      targetInterval: null
    },
    mounted() {
      // Set the mode based on the URL difficulty
      this.mode = gameDifficulty.charAt(0).toUpperCase() + gameDifficulty.slice(1);
      
      // Start the game automatically
      this.startGame();
    },
    methods: {
      startGame: function() {
        this.started = true;
        this.scoresCount = 0;
        this.targetsCreated = 0;
        
        // Get game area dimensions
        const gameArea = document.querySelector('.game-area');
        const targetsContainer = document.querySelector('.targets-container');
        
        // Set speed based on difficulty
        const speed = this.mode.toLowerCase() === 'easy' ? 1500 : 1000;
        
        // Start creating targets
        this.targetInterval = setInterval(() => {
          if (this.targetsCreated < this.maxTargets) {
            this.createTarget(gameArea.offsetWidth, gameArea.offsetHeight, targetsContainer);
            this.targetsCreated++;
          } else {
            // Game finished
            clearInterval(this.targetInterval);
            
            if (document.querySelectorAll('.target').length === 0) {
              // If all targets were hit, end the game
              this.endGame();
            }
          }
        }, speed);
      },
      
      createTarget: function(maxWidth, maxHeight, container) {
        // Create a new target at random position
        const target = document.createElement('div');
        target.className = 'target';
        
        // Ensure targets aren't too close to edges
        const margin = 50;
        const size = 40;
        
        // Random position
        const x = margin + Math.random() * (maxWidth - size - (margin * 2));
        const y = margin + Math.random() * (maxHeight - size - (margin * 2));
        
        // Set position
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
        
        // Add click event
        target.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          this.scoresCount++;
          target.remove();
          
          // If all targets are gone and we've created the max number, end the game
          if (this.targetsCreated >= this.maxTargets && document.querySelectorAll('.target').length === 0) {
            this.endGame();
          }
        });
        
        // Add to container
        container.appendChild(target);
      },
      
      mouseDown: function(e) {
        // Handle clicks on game area (misses)
        if (e.target.classList.contains('game-area') || e.target.classList.contains('score-display')) {
          // Misses don't do anything in this version
        }
      },
      
      endGame: function() {
        // End the game and show results
        this.finalScores = this.scoresCount;
        this.started = false;
        this.finished = true;
        
        // Save score to database
        this.saveScore();
      },
      
      saveScore: function() {
        // Only try to save if score is greater than 0
        if (this.finalScores > 0) {
          fetch('/aim-trainer/save-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              score: this.finalScores,
              difficulty: this.mode.toLowerCase()
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Score saved:', data);
          })
          .catch(error => {
            console.error('Error saving score:', error);
          });
        }
      },
      
      resetGame: function() {
        // Reset game state
        clearInterval(this.targetInterval);
        this.started = false;
        this.finished = false;
        this.scoresCount = 0;
        this.targetsCreated = 0;
        
        // Redirect back to tasks page
        window.location.href = '/tasks';
      }
    }
});