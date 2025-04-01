document.addEventListener("DOMContentLoaded", function() {
    const reactionBox = document.getElementById("reaction-box");
    const reactionTimeDisplay = document.getElementById("reaction-time");
  
    let startTime;
    let timeoutID;
  
    // Reset the game to its initial state
    function resetGame() {
      reactionBox.style.backgroundColor = "turquoise"; // Set initial color
      reactionBox.innerText = "Ready to Start"; // Display ready text
      reactionTimeDisplay.innerText = "Click to Start!"; // Display default text
  
      // Attach click event listener to start the countdown when clicked
      reactionBox.addEventListener("click", startCountdown, { once: true });
    }
  
    // Start countdown on first click
    function startCountdown() {
      reactionBox.style.backgroundColor = "turquoise"; // Ensure the color is turquoise
      reactionBox.innerText = "Get Ready!"; // Countdown starts
  
      let countdown = 3;
      let countdownInterval = setInterval(function() {
        reactionBox.innerText = countdown;
        countdown--;
        if (countdown < 0) {
          clearInterval(countdownInterval);
          startReactionTest(); // Start the reaction test after countdown
        }
      }, 1000);
    }
  
    // Start the reaction test with a random delay before changing to green
    function startReactionTest() {
      reactionBox.style.backgroundColor = "red"; // Start with red color
      reactionBox.innerText = "Wait..."; // Inform user to wait
  
      // Set a random delay between 3-5 seconds
      let delay = Math.floor(Math.random() * 2000) + 3000; // Random delay between 3 and 5 seconds
  
      timeoutID = setTimeout(function() {
        reactionBox.style.backgroundColor = "green"; // Change color to green
        reactionBox.innerText = "CLICK!"; // Prompt user to click
        startTime = Date.now(); // Record the time when the box turns green
  
        // Now track the user's click
        reactionBox.addEventListener("click", recordReaction, { once: true });
      }, delay);
    }
  
    // Record reaction time when user clicks the green box
    function recordReaction() {
      let reactionTime = (Date.now() - startTime) / 1000; // Calculate time in seconds
      reactionTimeDisplay.innerText = `Time: ${reactionTime.toFixed(3)} seconds`; // Show result
  
      // Reset the game after showing result
      setTimeout(resetGame, 2000); // Reset after 2 seconds
    }
  
    // Initialize the game
    resetGame();
  });  