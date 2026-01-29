const choices = ["Stone", "Paper", "Scissor"];
const choiceButtons = document.querySelectorAll(".choice");
const resultMsg = document.querySelector("#msg");
const playerScore = document.querySelector("#player-score");
const computerScore = document.querySelector("#comp-score");
const resetBtn = document.querySelector("#reset-game");

let playerWins = 0;
let computerWins = 0;

const determineWinner = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) {
        return "Draw!";
    }
    
    const winConditions = {
        "Stone": "Scissor",
        "Paper": "Stone",
        "Scissor": "Paper"
    };
    
    return winConditions[playerChoice] === computerChoice ? "Player wins!" : "Computer wins!";
};

choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const playerChoice = button.id;
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        const result = determineWinner(playerChoice, computerChoice);
        
        if (result === "Draw!") {
            resultMsg.textContent = `You: ${playerChoice} | Computer: ${computerChoice} | Draw!`;
        } else if (result === "Player wins!") {
            playerWins++;
            playerScore.textContent = playerWins;
            resultMsg.textContent = `You: ${playerChoice} | Computer: ${computerChoice} | Player wins!`;
        } else {
            computerWins++;
            computerScore.textContent = computerWins;
            resultMsg.textContent = `You: ${playerChoice} | Computer: ${computerChoice} | Computer wins!`;
        }
    });
});

resetBtn.addEventListener("click", () => {
    playerWins = 0;
    computerWins = 0;
    playerScore.textContent = "0";
    computerScore.textContent = "0";
    resultMsg.textContent = "Make your choice";
});