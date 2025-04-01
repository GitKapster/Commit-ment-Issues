document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const reactionBox = document.getElementById("reaction-box");
    const reactionTimeDisplay = document.getElementById("reaction-time");

    let startTime;
    let timeoutID;

    if (!startButton || !reactionBox || !reactionTimeDisplay) {
        console.error("Missing required elements!");
        return;
    }

    startButton.addEventListener("click", () => {
        // Reset state
        reactionBox.style.backgroundColor = "red";
        reactionBox.innerText = "Wait...";
        reactionTimeDisplay.innerText = "Time: 0.00 seconds";

        // Remove previous click listener to prevent multiple triggers
        reactionBox.removeEventListener("click", recordReaction);

        // Random delay before turning green
        let delay = Math.floor(Math.random() * 2000) + 3000; // 3-5 sec

        timeoutID = setTimeout(() => {
            reactionBox.style.backgroundColor = "green";
            reactionBox.innerText = "CLICK!";
            startTime = Date.now();

            // Add click event once reaction box turns green
            reactionBox.addEventListener("click", recordReaction, { once: true });
        }, delay);
    });

    function recordReaction() {
        let reactionTime = (Date.now() - startTime) / 1000;
        reactionTimeDisplay.innerText = `Time: ${reactionTime.toFixed(3)} seconds`;

        // Reset game after displaying result
        setTimeout(() => {
            reactionBox.style.backgroundColor = "red";
            reactionBox.innerText = "Wait...";
            reactionTimeDisplay.innerText = "Click Start to Begin";
        }, 2000);
    }
});