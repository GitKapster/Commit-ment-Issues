document.addEventListener("DOMContentLoaded", () => {
    const reactionBox = document.getElementById("reaction-box");
    const reactionTimeDisplay = document.getElementById("reaction-time");

    let startTime;
    let timeoutID;

    function resetGame() {
        reactionBox.style.backgroundColor = "turquoise";
        reactionBox.innerText = "Ready to Start";
        reactionTimeDisplay.innerText = "Click to Start!";
        reactionBox.addEventListener("click", startCountdown); // Reattach event listener
    }

    function startCountdown() {
        reactionBox.removeEventListener("click", startCountdown); // Prevent multiple starts
        reactionBox.style.backgroundColor = "turquoise";
        reactionBox.innerText = "Get Ready!";

        let countdown = 3;
        let countdownInterval = setInterval(() => {
            reactionBox.innerText = countdown;
            countdown--;

            if (countdown < 0) {
                clearInterval(countdownInterval);
                startReactionTest();
            }
        }, 1000);
    }

    function startReactionTest() {
        reactionBox.style.backgroundColor = "red";
        reactionBox.innerText = "Wait...";

        let delay = Math.floor(Math.random() * 2000) + 3000; // 3-5 sec delay

        timeoutID = setTimeout(() => {
            reactionBox.style.backgroundColor = "green";
            reactionBox.innerText = "CLICK!";
            startTime = Date.now();

            // Allow click to measure reaction time
            reactionBox.addEventListener("click", recordReaction, { once: true });
        }, delay);
    }

    function recordReaction() {
        let reactionTime = (Date.now() - startTime) / 1000;
        reactionTimeDisplay.innerText = `Time: ${reactionTime.toFixed(3)} seconds`;

        // Reset game after displaying result
        setTimeout(resetGame, 2000);
    }

    // Initialize the game with the first event listener
    resetGame();
});