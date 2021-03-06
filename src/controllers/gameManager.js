import { NUM_GUESSES, NUM_LETTERS } from '../utils/constants';
import createPublisher from '../utils/mini_pubsub';
import wordlist from "../word-list";

export default function createGameManager() {
  let wordArray = [];
  let selectedWord = "";
  let currentRow = 0;
  let currentCol = 0;

  const hooks = {
    onLetterInput: createPublisher(),
    onSubmitGuess: createPublisher(),
    onWin: createPublisher(),
    onLose: createPublisher(),
    onInvalidGuess: createPublisher(),
    onRestart: createPublisher(),
  };

  function initializeBoard() {
    currentRow = 0;
    currentCol = 0;

    wordArray = [];
    for (let i = 0; i < NUM_GUESSES; i++) {
      wordArray.push([]);
    }

    selectedWord = chooseWinningWord();

    hooks.onRestart.pub();
  }

  function chooseWinningWord() {
    const wordIndex = Math.floor(Math.random() * wordlist.answerList.length);
    return wordlist.answerList[wordIndex];
  }

  function getWord(row) {
    return wordArray[row] 
  }

  function addLetter(letter) {
    if (currentCol < NUM_LETTERS) {
      wordArray[currentRow][currentCol] = letter;
      hooks.onLetterInput.pub();
      currentCol++;
    }
  }

  function removeLetter() {
    console.log("remove")
    if (currentCol > 0) {
      wordArray[currentRow].pop();
      hooks.onLetterInput.pub();
      currentCol--;
    }
  }

  function checkWordValid(guess) {
    return wordlist.answerList.includes(guess)
      || wordlist.sourceList.includes(guess);
  }

  function submitGuess() {
    const guess = wordArray[currentRow].join('').toLowerCase();

    if (currentCol < NUM_LETTERS - 2) {
      console.log("not enough letters!")
      hooks.onInvalidGuess.pub();
    } else if (guess === selectedWord) {
      console.log("win");
      hooks.onSubmitGuess.pub({
        row: currentRow,
        scores: new Array(NUM_LETTERS).fill(2),
        guess
      });
      hooks.onWin.pub();

    } else if (checkWordValid(guess)) {
      const scores = scoreGuess(guess);

      hooks.onSubmitGuess.pub({
        row: currentRow,
        scores,
        guess
      });
      currentCol = 0;
      currentRow++;
    } else {
      console.log("not a valid word!");
    }
  }

  function scoreGuess(guess) {
    let selectedWordArr = selectedWord.split("");

    // 0 = miss, 1 = adjacent, 2 = hit
    let result = new Array(NUM_LETTERS).fill(0);
    
    // find hits
    for (let i = 0; i < NUM_LETTERS; i++) {
      if (guess[i] === selectedWordArr[i]) {
        result[i] = 2;
        selectedWordArr[i] = "*"; // "hit" letters should be taken off board for yellows
      }
    }

    // find "adjacent" letters (where they're in the word but wrong place)
    for (let i = 0; i < NUM_LETTERS; i++) {
      if (result[i] == 2) {
        continue;
      }

      const guessLetterIndex = selectedWordArr.indexOf(guess[i]);

      if (guessLetterIndex > -1) {
        result[i] = 1;
        // guessed letter should show as possible for each instance it appears
        selectedWordArr[guessLetterIndex] = "*";
      }
    }

    return result;
  }

  initializeBoard();

  return {
    addLetter,
    removeLetter,
    submitGuess,
    getWord,
    hooks,
    initializeBoard
  }
}

