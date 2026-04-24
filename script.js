const canva = document.querySelector(".game-canvas");
const COLS = 31;
const ROWS = 21;
var current_Score = 0;
var highest_score = 0;
var length_of_your_snake = 0;

var highest = document.querySelector("#highest");
var current = document.querySelector("#current");
var play_again = document.querySelector(".play-again");
var lengthOfSnake = document.querySelector("#lengthOfSnake");
var startTheGame = document.querySelector(".start-the-game");
const bgAudio = new Audio("bgMusic.mp3");
const gameOverAudio = new Audio("gameOverMusic.mp3");

// MOVED outside moveSnake so it doesn't stack up on every play
let directionOfSnake = { col: 0, row: 1 };
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown" && directionOfSnake.row !== -1) {
    directionOfSnake = { col: 0, row: 1 };
  }
  if (e.code === "ArrowUp" && directionOfSnake.row !== 1) {
    directionOfSnake = { col: 0, row: -1 };
  }
  if (e.code === "ArrowLeft" && directionOfSnake.col !== 1) {
    directionOfSnake = { col: -1, row: 0 };
  }
  if (e.code === "ArrowRight" && directionOfSnake.col !== -1) {
    directionOfSnake = { col: 1, row: 0 };
  }
});

for (let col = 0; col < COLS; col++) {
  let column = document.createElement("div");
  column.classList.add("pixel-wrapper", `column-${col}`);
  for (let row = 0; row < ROWS; row++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.id = `cell-${col}-${row}`;
    column.appendChild(pixel);
  }
  canva.appendChild(column);
}

function moveSnake() {
  let colCellFood;
  let rowCellFood;
  let foodEaten = false;

  // FIXED: reset scores on every new game
  current_Score = 0;
  length_of_your_snake = 0;
  current.textContent = `Current score : 0`;
  lengthOfSnake.textContent = `Length of your snake : 0 cm`;

  directionOfSnake = { col: 0, row: 1 }; // reset direction too
  let snake = [{ col: 1, row: 1 }];

  function moveTheSnake() {
    const movingSnake = setInterval(() => {
      let newHead = {
        col: snake[0].col + directionOfSnake.col,
        row: snake[0].row + directionOfSnake.row,
      };

      // FIXED: check collision BEFORE unshifting so head isn't in array yet
      if (
        newHead.col >= COLS ||
        newHead.col < 0 ||
        newHead.row >= ROWS ||
        newHead.row < 0 ||
        snake.some(
          (bodyPart) =>
            bodyPart.row === newHead.row && bodyPart.col === newHead.col,
        )
      ) {
        clearInterval(movingSnake);
        bgAudio.pause();
        gameOverAudio.play();
        play_again.style.display = "flex";
        highest_score =
          current_Score > highest_score ? current_Score : highest_score;
        highest.textContent = `Highest score : ${highest_score}`; // FIXED: was highest_Score
        return;
      }

      snake.unshift(newHead); // add head after collision check

      if (foodEaten === false) {
        let tail = snake[snake.length - 1];
        document
          .querySelector(`#cell-${tail.col}-${tail.row}`)
          .classList.remove("snake");
        snake.pop();
      }
      foodEaten = false;

      document
        .querySelector(`#cell-${snake[0].col}-${snake[0].row}`)
        .classList.add("snake");
      eatAndGrow();
    }, 250);
  }

  function generateFood() {
    colCellFood = Math.floor(Math.random() * COLS);
    rowCellFood = Math.floor(Math.random() * ROWS);
    document
      .querySelector(`#cell-${colCellFood}-${rowCellFood}`)
      .classList.add("food");
  }

  function eatAndGrow() {
    if (snake[0].col === colCellFood && snake[0].row === rowCellFood) {
      foodEaten = true;
      document
        .querySelector(`#cell-${colCellFood}-${rowCellFood}`)
        .classList.remove("food");
      generateFood();
      current_Score += 10;
      length_of_your_snake += 1;
      current.textContent = `Current score : ${current_Score}`;
      lengthOfSnake.textContent = `Length of your snake : ${length_of_your_snake} cm`;
    }
  }

  moveTheSnake();
  generateFood();
}

startTheGame.addEventListener("click", () => {
  startTheGame.style.display = "none";
  bgAudio.play();
  moveSnake();
});

document.querySelector(".play").addEventListener("click", () => {
  document
    .querySelectorAll(".snake")
    .forEach((cell) => cell.classList.remove("snake"));
  document
    .querySelectorAll(".food")
    .forEach((cell) => cell.classList.remove("food"));
  play_again.style.display = "none";

  bgAudio.play();

  moveSnake();
});

// let startX = 0;
// let startY = 0;
