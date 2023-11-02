import { WORDS } from "./dictionary.js"; // imports words from dictionary.js file

let result = document.getElementById("result"); // makes a variable with its value being the element with the ID 'result'
let retry = document.getElementById("retry"); // makes a variable with its value being the element with the ID 'retry'

// variable for current state of the game
let state = {
    grid: Array(6)
         .fill()
         .map(() => Array(5).fill("")), // creates 5x6 grid with empty strings in each box
    secretWord: WORDS[Math.floor(Math.random() * WORDS.length)], // gets a word from the dictionary and makes it the 'secret word'
    guessesLeft: 6, // establishes that the player has 6 guesses in total (moves down by 1 each guess)
    currentRow: 0, // current row player is on (current guess)
    currentCol: 0, // current column player is on (current letter)
    guessedLetters: [], // stores the letters guessed by the player
};

// updates grid UI with current state
function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) { // loops through each row in grid
        for (let j = 0; j < state.grid[i].length; j++) { // loops through each column in grid
            let box = document.getElementById("box" + i + j);
            box.textContent = state.grid[i][j]; // sets the text content of the box to be the corresponding value in grid
        }
    }
}

// function to create a box element and adds it to the grid
function drawBox(container, row, col, letter = "") {
    let box = document.createElement("div"); // creates box as a div
    box.className = "box"; // assigns box class to box variable
    box.id = "box" + row + col; // gives each box a unique ID dependant on its position on the grid
    box.textContent = letter;

    container.appendChild(box); // attaches boxes to container (which will be the grid)
    return box;
}

// creates a grid with boxes and adds it to the container
function drawGrid(container) {
    let grid = document.createElement("div"); // creates grid as a div
    grid.className = "grid"; // assigns grid class to grid variable

    // loop to draw grid (5x6)
    for (let i = 0; i < 6; i++) { // rows
        for (let j = 0; j < 5; j++) { // columns
            drawBox(grid, i, j); // draws box for each iteration (30 boxes in total (6 x 5 = 30))(container = grid, row = i, col = j)
        }
    }

    container.appendChild(grid); // attaches grid to container
}

// registers each input (enter, backspace, or letter)
function registerKeyPress() {
    document.body.onkeydown = (e) => { // adds an event listener to the body (onkeydown)
        let key = e.key; // getting key that was pressed
        // if statement for enter key
        if (key === "Enter") {
            if (state.currentCol === 5) { // only allows players to press enter once the current letter is on the 5th column
                let word = enter(); // calling enter function to get word entered by player
                if (isWordValid(word)) { // checks if word is valid (if the word is in the dictionary.js file)
                    revealWord(word);
                    state.currentRow++; // moves player to the next guess/row
                    state.currentCol = 0; // moves player to the first column since it's a new word
                    state.guessesLeft--; // removes 1 from the amount of guesses the player has left
                } else {
                    result.textContent = "Please enter a valid word"; // tells player to input a word from the dictionary.js file
                }
            }
        }
        // if statement for backspace key
        if (key === "Backspace") {
            removeLetter(); // calling function to remove most recent letter
            result.textContent = ""; // gets rid of any existing warning
        }
        // if statement for adding letters
        if (isLetter(key)) {
            addLetter(key); // calling function to add a letter
            result.textContent = ""; // gets rid of any existing warning
        }
        updateGrid(); // updates the grid UI after a keypress
    };
}

function enter() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr); // combines letters in current row to make a word
}

// function to check if word is valid
function isWordValid(word) {
    return WORDS.includes(word); // checking if the word exists in the dictionary.js file
}

// function to reveal the 'correctness' of the inputed word
function revealWord(guess) {
    let row = state.currentRow; // getting current row

    // looping through the columns to check each letter
    for (let i = 0; i < 5; i++) {
        // adds class to corresponding boxes
        let box = document.getElementById("box" + row + i);
        let letter = box.textContent;

        // checking if letter is in the correct spot, wrong spot, or absent from the word
        if (letter === state.secretWord[i]) {
            box.classList.add("right"); // adds the box to the class 'right'
        } else if (state.secretWord.includes(letter)) {
            box.classList.add("wrong"); // adds the box to the class 'wrong'
        } else {
            box.classList.add("absent"); // adds the box to the class 'absent'
        }

        state.guessedLetters.push(letter); // adds the guessed letters to the array of guessed letters

        let button = document.querySelector(`button[data-letter="${letter}"]`); // gets the button element with the corresponding letter

        // checking if letter is in the correct spot, wrong spot, or absent from the word
        if (button) {
            if (letter === state.secretWord[i]) {
                button.classList.add("right"); // adds the button to the class 'right'
            } else if (state.secretWord.includes(letter)) {
                    button.classList.add("wrong"); // adds the button to the class 'right'
            } else {
                button.classList.add("absent"); // adds the button to the class 'right'
            }
        }
    }

    let isWinner = state.secretWord === guess; // checks if player has won
    let isGameOver = state.currentRow === 5; // checks if player has lost
    let guessesUsed = 7 - state.guessesLeft; // calculates number of guesses used

    if (isWinner) { // if player has won...
        result.textContent = "You win! You guessed " + state.secretWord + " in " + guessesUsed + " guesses"; // makes the result text say that they won
        retry.textContent = "Play again?"; // makes the play again link visible
    } else if (isGameOver) { // if player has lost...
        result.textContent = "You lose. The correct word was " + state.secretWord; // makes the result text say that they lost
        retry.textContent = "Play again?"; // makes the play again link visible
    }
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i); // checks if the input is a single character and a letter from a to z
}

function addLetter(letter) {
    if (state.currentCol === 5) return; // checking if the column is at its maximum
    state.grid[state.currentRow][state.currentCol] = letter; // adds letter to the grid
    state.currentCol++; // moves player to next column
}

function removeLetter() {
    if (state.currentCol === 0) return; // checking if there is anything to delete
    state.grid[state.currentRow][state.currentCol - 1] = ""; // removes last letter from grid and replacing it with an empty string
    state.currentCol--; // moves player back a column
}

function startGame() {
    let game = document.getElementById("game"); // creates a variable with the "game" div being its value
    drawGrid(game); // draws grid in "game" which is the container

    registerKeyPress(); // calls keypress function

    console.log(state.secretWord); // logging secret word (TESTING PURPOSES)
}

startGame(); // starts the game