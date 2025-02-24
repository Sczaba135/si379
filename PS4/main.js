const url = "https://the-trivia-api.com/v2/questions";

let correctAnswers = 0;
let totalAnswers = 0;

/**
 * Cache a fetch() request in localStorage and return the cached data if it's not expired.
 * Useful if you are doing live editing refreshes and don't want to query the API every time.
 * 
 * @param {string} url The URL to fetch
 * @param {*} options The options to pass to fetch()
 * @param {number} cacheDuration The maximum age to use for cached data, in milliseconds
 * @returns A Promise that resolves to a Response object
 */
function fetchWithCache(url, options = {}, cacheDuration = 1000 * 60 * 60) { // Default cache duration is 1 hour
    // Utility function to create a Response object from data (like fetch() would)
    function getResponseObject(data) {
        return new Response(new Blob([JSON.stringify(data)]));
    }

    const cachedData = localStorage.getItem(url); // Check if we have cached data for this URL

    if (cachedData) { // If we do...
        const { timestamp, data } = JSON.parse(cachedData); // Parse the data from the cache
        // Note: This uses destructuring syntax. It's equivalent to:
        // const parsedCachedData = JSON.parse(cachedData);
        // const timestamp = parsedCachedData.timestamp;
        // const data = parsedCachedData.data;

        if (Date.now() - timestamp < cacheDuration) { //...and it's not expired,
            return Promise.resolve(getResponseObject(data)); // Return a promise whose value is the stored data
        } else { // it has expired, so remove it
            localStorage.removeItem(url);
        }
    }

    // If we don't have cached data or it's expired, fetch it from the network
    return fetch(url, options)
        .then((response) => response.json()) // Parse the JSON data from the response
        .then((data) => {
            localStorage.setItem(url, JSON.stringify({ // Store the data in localStorage with a timestamp
                timestamp: Date.now(),
                data
            }));
            return getResponseObject(data);
        });
}

/**
 * A function to randomly shuffle the items in an array and return a copy of the shuffled array.
 */
function shuffleArray(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}


function getSearchResults() {
    return fetchWithCache(url).then(response => response.json());
}


function createQuestionElement(questionText) {
    const p = document.createElement("p");
    p.innerText = questionText;
    return p;
}


function createAnswerList(incorrectAnswers, correctAnswer) {
    const ul = document.createElement("ul");
    let answers = [...incorrectAnswers, correctAnswer];
    answers = shuffleArray(answers);

    answers.forEach(answer => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.innerText = answer;
        button.isCorrect = answer === correctAnswer; 
        button.addEventListener("click", handleAnswerClick);

        li.appendChild(button);
        ul.appendChild(li);
    });

    return ul;
}

function handleAnswerClick(event) {
    const selectedButton = event.target;
    const buttons = selectedButton.closest("ul").querySelectorAll("button");

    buttons.forEach(button => button.disabled = true);

    buttons.forEach(button => {
        if (button.isCorrect) {
            button.style.backgroundColor = "lightgreen"; 
        } else {
            button.style.backgroundColor = "lightcoral";
        }
    });

    if (selectedButton.isCorrect) {
        correctAnswers++;
    }
    totalAnswers++;
    updateScore();
}


function updateScore() {
    document.getElementById("score").innerText = `Your score: ${correctAnswers} of ${totalAnswers}`;
}


getSearchResults()
    .then(questions => {
        
        questions.forEach(q => {
            const questionElement = createQuestionElement(q.question.text);
            const answerList = createAnswerList(q.incorrectAnswers, q.correctAnswer);

            document.body.appendChild(questionElement);
            document.body.appendChild(answerList);
        });
    });