document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    
    const reactionBox = document.getElementById("reaction-box");
    const reactionTimeDisplay = document.getElementById("reaction-time");
    
    if (!reactionBox || !reactionTimeDisplay) {
        console.error("Could not find required elements:", {
            reactionBox: !!reactionBox,
            reactionTimeDisplay: !!reactionTimeDisplay
        });
        return; // Exit if elements not found
    }
    
    console.log("Found required elements, initializing game");
    
    let startTime;
    
    // Initialize the box with proper state
    reactionBox.dataset.state = "ready";
    
    // Main click handler for the reaction box
    reactionBox.addEventListener("click", function(e) {
        console.log("Box clicked. Current state:", reactionBox.dataset.state);
        
        // Prevent any default behaviors
        e.preventDefault();
        e.stopPropagation();
        
        if (reactionBox.dataset.state === "ready") {
            console.log("Starting countdown");
            startCountdown();
        } else if (reactionBox.dataset.state === "waiting" && reactionBox.style.backgroundColor === "green") {
            console.log("Recording reaction time");
            recordReaction();
        } else if (reactionBox.dataset.state === "finished") {
            console.log("Resetting game");
            resetGame();
        }
    });
    
    // Reset game to initial state
    function resetGame() {
        reactionBox.style.backgroundColor = "turquoise";
        reactionBox.textContent = "Click to Start";
        reactionTimeDisplay.textContent = "Ready to Start!";
        reactionBox.dataset.state = "ready";
    }
    
    // Start the countdown after the first click
    function startCountdown() {
        reactionBox.style.backgroundColor = "turquoise";
        reactionBox.textContent = "Get Ready!";
        reactionBox.dataset.state = "countdown";
        
        let countdown = 3;
        console.log("Countdown started:", countdown);
        
        let countdownInterval = setInterval(function() {
            reactionBox.textContent = countdown.toString();
            console.log("Countdown:", countdown);
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownInterval);
                console.log("Countdown complete, starting test");
                startReactionTest();
            }
        }, 1000);
    }
    
    // Start the reaction test with a random delay
    function startReactionTest() {
        reactionBox.style.backgroundColor = "red";
        reactionBox.textContent = "Wait...";
        reactionBox.dataset.state = "waiting";
        
        // Get delay based on difficulty 
        let minDelay = 3000;
        let maxDelay = 5000;
        
        // Try to parse difficulty from heading
        try {
            const heading = document.querySelector('h1');
            if (heading) {
                const difficultyText = heading.textContent.split('-')[1].trim().split(' ')[0];
                console.log("Detected difficulty:", difficultyText);
                
                if (difficultyText === "Easy") {
                    minDelay = 4000;
                    maxDelay = 6000;
                } else if (difficultyText === "Hard") {
                    minDelay = 2000;
                    maxDelay = 4000;
                }
            }
        } catch (e) {
            console.log("Using default difficulty", e);
        }
        
        let delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
        console.log("Waiting for", delay, "ms before showing green");
        
        setTimeout(function() {
            reactionBox.style.backgroundColor = "green";
            reactionBox.textContent = "CLICK!";
            startTime = Date.now();
            console.log("Box turned green at", startTime);
        }, delay);
    }
    
    // Record the reaction time when the user clicks the green box
    function recordReaction() {
        let endTime = Date.now();
        let reactionTime = (endTime - startTime) / 1000;
        console.log("Reaction recorded at", endTime, "Reaction time:", reactionTime);
        
        reactionTimeDisplay.textContent = `Time: ${reactionTime.toFixed(3)} seconds`;
        reactionBox.style.backgroundColor = "lightblue";
        reactionBox.textContent = "Click to play again";
        reactionBox.dataset.state = "finished";
    }
    
    // Start the game
    console.log("Initializing game");
    resetGame();
});