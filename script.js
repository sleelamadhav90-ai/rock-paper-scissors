
function getComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3);

    switch (randomNumber) {
        case 0:
            return "rock";
        case 1:
            return "paper";
        default:
            return "scissors";
    }
}

// Game state
let humanScore = 0;
let computerScore = 0;
let round = 0;
const totalRounds = 5;
let gameOver = false;

// Get HTML elements
const humanScoreDisplay = document.querySelector("#human-score");
const computerScoreDisplay = document.querySelector("#computer-score");
const roundCountDisplay = document.querySelector("#round-count");
const gameStatus = document.querySelector("#game-status");

const resultCard = document.querySelector(".battle-result");
const resultIcon = document.querySelector("#result-icon");
const resultLabel = document.querySelector("#result-label");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");

const logList = document.querySelector("#log-list");
const roundsPlayedDisplay = document.querySelector("#rounds-played");

const choiceButtons = document.querySelectorAll(".choice-card");
const restartButton = document.querySelector("#restart-button");

// Play one round when the player clicks a choice
function playRound(humanChoice) {
    if (gameOver) {
        return;
    }

    const computerChoice = getComputerChoice();
    round++;

    let outcome;
    let message;

    if (humanChoice === computerChoice) {
        outcome = "draw";
        message = "It's a draw!";
    } else if (
        (humanChoice === "rock" && computerChoice === "scissors") ||
        (humanChoice === "paper" && computerChoice === "rock") ||
        (humanChoice === "scissors" && computerChoice === "paper")
    ) {
        outcome = "win";
        humanScore++;
        message = `${capitalize(humanChoice)} beats ${computerChoice}.`;
    } else {
        outcome = "lose";
        computerScore++;
        message = `${capitalize(computerChoice)} beats ${humanChoice}.`;
    }

    updateScoreboard();
    showRoundResult(outcome, message, humanChoice, computerChoice);
    addLog(humanChoice, computerChoice, message, outcome);

    roundsPlayedDisplay.textContent = `${round} / ${totalRounds} PLAYED`;

    if (round === totalRounds) {
        endGame();
    } else {
        roundCountDisplay.textContent =
            `ROUND ${round + 1} / ${totalRounds}`;
        gameStatus.textContent = "CHOOSE YOUR NEXT MOVE";
    }
}

// Capitalize a choice for display
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Update the score numbers
function updateScoreboard() {
    humanScoreDisplay.textContent = String(humanScore).padStart(2, "0");
    computerScoreDisplay.textContent = String(computerScore).padStart(2, "0");
}

// Display the current round result
function showRoundResult(outcome, message, humanChoice, computerChoice) {
    resultCard.classList.remove("win", "lose", "draw");
    resultCard.classList.add(outcome);

    resultLabel.textContent = "ROUND RESULT";

    if (outcome === "win") {
        resultIcon.textContent = "★";
        resultTitle.textContent = "NICE MOVE!";
    } else if (outcome === "lose") {
        resultIcon.textContent = "×";
        resultTitle.textContent = "CPU SCORES!";
    } else {
        resultIcon.textContent = "=";
        resultTitle.textContent = "DRAW ROUND!";
    }

    resultMessage.textContent =
        `You: ${capitalize(humanChoice)} | CPU: ${capitalize(computerChoice)} — ${message}`;
}

// Add the round to the game history
function addLog(humanChoice, computerChoice, message, outcome) {
    if (round === 1) {
        logList.replaceChildren();
    }

    const entry = document.createElement("article");
    entry.classList.add("log-entry");

    const heading = document.createElement("p");
    heading.classList.add("log-round");
    heading.textContent = `▶ ROUND ${round}`;

    const choices = document.createElement("p");
    choices.classList.add("log-choices");
    choices.textContent =
        `YOU: ${humanChoice.toUpperCase()} / CPU: ${computerChoice.toUpperCase()}`;

    const result = document.createElement("p");
    result.classList.add("log-outcome", outcome);
    result.textContent = message;

    entry.append(heading, choices, result);
    logList.prepend(entry);
}

// Finish the game after five rounds
function endGame() {
    gameOver = true;

    choiceButtons.forEach(button => {
        button.disabled = true;
    });

    roundCountDisplay.textContent = "GAME COMPLETE";
    gameStatus.textContent = "MATCH OVER";
    resultCard.classList.remove("win", "lose", "draw");

    if (humanScore > computerScore) {
        resultCard.classList.add("win");
        resultIcon.textContent = "🏆";
        resultLabel.textContent = "FINAL RESULT";
        resultTitle.textContent = "YOU ARE THE CHAMPION!";
        resultMessage.textContent =
            `FINAL SCORE: ${humanScore} - ${computerScore}. YOU WIN!`;
    } else if (computerScore > humanScore) {
        resultCard.classList.add("lose");
        resultIcon.textContent = "▣";
        resultLabel.textContent = "FINAL RESULT";
        resultTitle.textContent = "CPU WINS THIS MATCH!";
        resultMessage.textContent =
            `FINAL SCORE: ${humanScore} - ${computerScore}. TRY AGAIN!`;
    } else {
        resultCard.classList.add("draw");
        resultIcon.textContent = "=";
        resultLabel.textContent = "FINAL RESULT";
        resultTitle.textContent = "PERFECTLY BALANCED!";
        resultMessage.textContent =
            `FINAL SCORE: ${humanScore} - ${computerScore}. IT'S A TIE!`;
    }

    restartButton.hidden = false;
}

// Start a new game
function restartGame() {
    humanScore = 0;
    computerScore = 0;
    round = 0;
    gameOver = false;

    updateScoreboard();

    roundCountDisplay.textContent = "ROUND 1 / 5";
    roundsPlayedDisplay.textContent = "0 / 5 PLAYED";
    gameStatus.textContent = "INSERT YOUR SKILL";

    resultCard.classList.remove("win", "lose", "draw");
    resultIcon.textContent = "★";
    resultLabel.textContent = "READY PLAYER ONE";
    resultTitle.textContent = "LET'S BATTLE!";
    resultMessage.textContent = "Choose your move to begin.";

    logList.replaceChildren();

    const emptyMessage = document.createElement("p");
    emptyMessage.classList.add("empty-log");
    emptyMessage.textContent = "YOUR BATTLES WILL APPEAR HERE...";
    logList.append(emptyMessage);

    choiceButtons.forEach(button => {
        button.disabled = false;
    });

    restartButton.hidden = true;
}

// Connect each card to the game
choiceButtons.forEach(button => {
    button.addEventListener("click", () => {
        playRound(button.dataset.choice);
    });
});

// Connect the restart button
restartButton.addEventListener("click", restartGame);
