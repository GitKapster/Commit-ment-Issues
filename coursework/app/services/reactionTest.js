document.addEventListener("DOMContentLoaded", function() {
    const reactionBox = document.getElementById("reaction-box");
    const reactionTimeDisplay = document.getElementById("reaction-time");
    
    if (!reactionBox || !reactionTimeDisplay) {
        console.error("Could not find required elements");
        return;
    }
    
    let startTime;
    
    // Try to get difficulty from the page heading
    let difficulty = "Medium"; // Default
    try {
        const heading = document.querySelector('h1');
        if (heading) {
            difficulty = heading.textContent.split('-')[1].trim().split(' ')[0];
            console.log("Detected difficulty:", difficulty);
        }
    } catch (e) {
        console.log("Using default difficulty:", difficulty);
    }
    
    // Initialize the box with proper state
    reactionBox.dataset.state = "ready";
    
    // Main click handler for the reaction box
    reactionBox.addEventListener("click", function() {
        console.log("Box clicked. Current state:", reactionBox.dataset.state);
        
        if (reactionBox.dataset.state === "ready") {
            startCountdown();
        } else if (reactionBox.dataset.state === "waiting" && reactionBox.style.backgroundColor === "green") {
            recordReaction();
        } else if (reactionBox.dataset.state === "finished") {
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
        
        let countdownInterval = setInterval(function() {
            reactionBox.textContent = countdown.toString();
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownInterval);
                startReactionTest();
            }
        }, 1000);
    }
    
    // Start the reaction test
    function startReactionTest() {
        reactionBox.style.backgroundColor = "red";
        reactionBox.textContent = "Wait...";
        reactionBox.dataset.state = "waiting";
        
        // Initial wait time (red screen)
        const initialDelay = getRandomDelay(2000, 4000);
        console.log("Initial delay:", initialDelay);
        
        setTimeout(function() {
            // After initial delay, show color sequence based on difficulty
            if (difficulty === "Easy") {
                // Easy mode: directly to green
                showGreen();
            } else if (difficulty === "Medium") {
                // Medium mode: 1-2 distractor colors
                const numColors = Math.floor(Math.random() * 2) + 1;
                const colors = pickRandomColors(["purple", "yellow"], numColors);
                console.log("Medium mode colors:", colors);
                showColorSequence(colors);
            } else if (difficulty === "Hard") {
                // Hard mode: 1-4 distractor colors
                const numColors = Math.floor(Math.random() * 4) + 1;
                const colors = pickRandomColors(["purple", "yellow", "pink", "orange"], numColors);
                console.log("Hard mode colors:", colors);
                showColorSequence(colors);
            } else {
                showGreen();
            }
        }, initialDelay);
    }
    
    // Show the sequence of distractor colors
    function showColorSequence(colors) {
        if (colors.length === 0) {
            showGreen();
            return;
        }
        
        let colorIndex = 0;
        
        function nextColor() {
            if (colorIndex < colors.length) {
                const color = colors[colorIndex];
                console.log("Showing color:", color);
                
                reactionBox.style.backgroundColor = color;
                reactionBox.textContent = "Not Yet!";
                
                // Delay before next color
                const colorDuration = (difficulty === "Hard") ? 
                    getRandomDelay(300, 800) : 
                    getRandomDelay(500, 1300);
                
                colorIndex++;
                setTimeout(nextColor, colorDuration);
            } else {
                // End of sequence, show green
                showGreen();
            }
        }
        
        // Start the color sequence
        nextColor();
    }
    
    // Show the green box and start timing
    function showGreen() {
        console.log("Showing green");
        reactionBox.style.backgroundColor = "green";
        reactionBox.textContent = "CLICK!";
        startTime = Date.now();
    }
    
    // Record the reaction time when the user clicks the green box
    function recordReaction() {
        const reactionTime = (Date.now() - startTime) / 1000;
        console.log("Reaction time:", reactionTime);
        
        reactionTimeDisplay.textContent = `Time: ${reactionTime.toFixed(3)} seconds`;
        reactionBox.style.backgroundColor = "lightblue";
        reactionBox.textContent = "Click to play again";
        reactionBox.dataset.state = "finished";
    }
    
    // Helper function to get random delay
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Helper function to pick random colors from the array
    function pickRandomColors(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // Start the game
    resetGame();
});