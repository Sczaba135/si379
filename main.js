//I used chat gpt in order to ask it how it would tackle finishing the javascript, and taking advice from the steps it gave

let score = 0;
const maxScore = 45;

// Function to update the score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

// Write code that *every second*, picks a random unwhacked hole (use getRandomUnwhackedHoleId)
// and adds the "needs-whack" class
const interval = setInterval(() => {
    const holeId = getRandomUnwhackedHoleId();

    if (holeId) {
        const holeElement = document.getElementById(holeId);
        holeElement.classList.add("needs-whack");
    }
}, 1000);

for(const id of getAllHoleIds()) {
    const holeElement = document.getElementById(id);

    holeElement.addEventListener("click", () => {
        if (holeElement.classList.contains("needs-whack")) {
            // Remove the mole
            holeElement.classList.remove("needs-whack");

            // Add the animating-whack class for 500ms
            holeElement.classList.add("animating-whack");
            setTimeout(() => {
                holeElement.classList.remove("animating-whack");
            }, 500);

            // Increment the score
            score++;
            updateScoreDisplay();

            // Stop the game if the score reaches maxScore
            if (score >= maxScore) {
                clearInterval(interval);
            }
        }
    });
}

/**
 * @returns a random ID of a hole that is "idle" (doesn't currently contain a mole/buckeye). If there are none, returns null
 */
function getRandomUnwhackedHoleId() {
    const inactiveHoles = document.querySelectorAll('.hole:not(.needs-whack)');  // Selects elements that have class "hole" but **not** "needs-whack"

    if(inactiveHoles.length === 0) {
        return null;
    } else {
        const randomIndex = Math.floor(Math.random() * inactiveHoles.length);
        return inactiveHoles[randomIndex].getAttribute('id');
    }
}

/**
 * @returns a list of IDs (as strings) for each hole DOM element
 */
function getAllHoleIds() {
    const allHoles = document.querySelectorAll('.hole'); 
    const ids = [];
    for(const hole of allHoles) {
        ids.push(hole.getAttribute('id'));
    }
    return ids;
}