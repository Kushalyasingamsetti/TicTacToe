const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const setupScreen = document.getElementById("setup");
const startButton = document.getElementById("start-btn");
const roundsInput = document.getElementById("rounds");
const gameScreen = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const winnerDisplay = document.getElementById("winner-display");
const winnerMessage = document.getElementById("winner-message");

let currentPlayer = "X";
let board = Array(9).fill(null);
let gameActive = true;

let totalRounds = 3;
let currentRound = 0;
let score = { X: 0, O: 0 };

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "draw";
}

function handleClick(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  renderBoard();

  const result = checkWinner();
  if (result) {
    gameActive = false;
    if (result !== "draw") score[result]++;
    currentRound++;

    updateScoreDisplay();

    if (currentRound >= totalRounds) {
      showWinnerMessage(getMatchResult());
    } else {
      setTimeout(resetBoard, 1000);
    }
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function getMatchResult() {
  if (score.X > score.O) return "Player X wins the match!";
  if (score.O > score.X) return "Player O wins the match!";
  return "The match is a draw!";
}

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    if (cell) {
      div.textContent = cell;
      div.classList.add("taken");
    }
    div.addEventListener("click", () => handleClick(index));
    boardElement.appendChild(div);
  });
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Player X: ${score.X} | Player O: ${score.O}`;
}

function resetBoard() {
  board = Array(9).fill(null);
  currentPlayer = currentRound % 2 === 0 ? "X" : "O";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

function showWinnerMessage(message) {
  winnerMessage.textContent = message;
  winnerDisplay.style.display = "flex";
}

function closeWinnerMessage() {
  winnerDisplay.style.display = "none";
  resetMatch();
}

function resetMatch() {
  board = Array(9).fill(null);
  score = { X: 0, O: 0 };
  currentRound = 0;
  currentPlayer = "X";
  gameScreen.style.display = "none";
  setupScreen.style.display = "flex";
}

function startMatch() {
  totalRounds = parseInt(roundsInput.value);
  if (isNaN(totalRounds) || totalRounds < 1) {
    alert("Please enter a valid number of rounds.");
    return;
  }

  score = { X: 0, O: 0 };
  currentRound = 0;
  currentPlayer = "X";

  setupScreen.style.display = "none";
  gameScreen.style.display = "flex";

  updateScoreDisplay();
  resetBoard();
}

resetButton.addEventListener("click", resetBoard);
startButton.addEventListener("click", startMatch);
