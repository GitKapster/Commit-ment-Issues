document.addEventListener("DOMContentLoaded", function() {
    const reactionBox = document.getElementById("reaction-box");
    const reactionTimeDisplay = document.getElementById("reaction-time");
  
    let startTime;
  
    // Reset game to initial state
    function resetGame() {
      reactionBox.style.backgroundColor = "turquoise";
      reactionBox.innerText = "Click to Start";
      reactionTimeDisplay.innerText = "Ready to Start!";
      
      // Set up click listener for the first click to start the countdown
      reactionBox.addEventListener("click", startCountdown, { once: true });
    }
  
    // Start the countdown after the first click
    function startCountdown() {
      reactionBox.style.backgroundColor = "turquoise";
      reactionBox.innerText = "Get Ready!";
      
      let countdown = 3;
      let countdownInterval = setInterval(function() {
        reactionBox.innerText = countdown;
        countdown--;
        if (countdown < 0) {
          clearInterval(countdownInterval);
          startReactionTest();
        }
      }, 1000);
    }
  
    // Start the reaction test with a random delay
    function startReactionTest() {
      reactionBox.style.backgroundColor = "red";
      reactionBox.innerText = "Wait...";
  
      let delay = Math.floor(Math.random() * 2000) + 3000; // Random delay between 3 and 5 seconds
  
      setTimeout(function() {
        reactionBox.style.backgroundColor = "green";
        reactionBox.innerText = "CLICK!";
        startTime = Date.now();
        
        // Set up listener to track when the box is clicked
        reactionBox.addEventListener("click", recordReaction, { once: true });
      }, delay);
    }
  
    // Record the reaction time when the user clicks the green box
    function recordReaction() {
      let reactionTime = (Date.now() - startTime) / 1000;
      reactionTimeDisplay.innerText = `Time: ${reactionTime.toFixed(3)} seconds`;
      setTimeout(resetGame, 2000); // Reset the game after 2 seconds
    }
  
    // Start the game
    resetGame();
  });  