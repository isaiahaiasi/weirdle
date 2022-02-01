import { NUM_GUESSES, NUM_LETTERS } from '../utils/constants';
import createPublisher from '../utils/mini_pubsub';

export default function createGameManager() {
  const wordArray = [];
  const selectedWord = selectWord();

  for (let i = 0; i < NUM_GUESSES; i++) {
    wordArray.push([]);
  }

  let currentRow = 0;
  let currentCol = 0;

  const hooks = createGameManagerEventHooks();

  function selectWord() {
    return "deers"; // ! TEMP
    // ! BUG: currently "qwert" returns 00120, rather than 00220
  }

  function addLetter(letter) {
    if (currentCol < NUM_LETTERS) {
      wordArray[currentRow][currentCol] = letter;
      console.log(wordArray[currentRow].join(''));
      hooks.onLetterInput.pub();
      currentCol++;
    }
  }

  function checkWordValid(guess) {
    // see if guess is in valid words list
    // TODO
    return true;
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
      });
      hooks.onWin.pub();

    } else if (checkWordValid(guess)) {
      const scores = guessResult(guess);

      hooks.onSubmitGuess.pub({
        row: currentRow,
        scores
      });
      currentCol = 0;
      currentRow++;
    } else {
      console.log("not a valid word!");
    }
  }

  function guessResult(guess) {
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
      const guessLetterIndex = selectedWordArr.indexOf(guess[i]);

      if (guessLetterIndex > -1) {
        result[i] = 1;
        // guessed letter should show as possible for each instance it appears
        selectedWordArr[guessLetterIndex] = "*";
      }
    }

    return result;
  }

  return {
    addLetter,
    submitGuess,
    wordArray,
    hooks,
  }
}

function createGameManagerEventHooks() {
  return {
    onLetterInput: createPublisher(),
    onSubmitGuess: createPublisher(),
    onWin: createPublisher(),
    onLose: createPublisher(),
    onInvalidGuess: createPublisher(),
  }
}
