const NUM_GUESSES = 6;
const NUM_LETTERS = 5;

// general helpers
// really crummy pubsub sub-factory
function createPublisher(...args) {
  const listeners = [];

  function sub(listener) {
    listeners.push(listener);
  }

  function pub() {
    listeners.forEach(listener => listener(...args));
  }

  return { sub, pub };
}

// populate html (game-board, game-keyboard)

function populateHtml(gameManager) {
  // minor helper; volatile api
  function createElement(tag, classes = []) {
    const el = document.createElement(tag);

    for (c of classes) {
      el.classList.add(c);
    }

    return el;
  }

  function populateGameBoard(boardContainer) {
    for (let row = 0; row < NUM_GUESSES; row++) {
      const gameBoardRow = createElement('div', ['game-board__row']);
      for (let col = 0; col < NUM_LETTERS; col++) {
        const gameBoardCell = createElement('div', ["game-board__cell"]);
        gameBoardCell.setAttribute("data-cell", `${row},${col}`);
        gameManager.boardUpdatePublisher.sub(() => {
          gameBoardCell.textContent = gameManager.wordArray[row][col];
        });
        gameBoardRow.appendChild(gameBoardCell);
      }
      boardContainer.appendChild(gameBoardRow);
    }
  }

  function populateGameKeyboard(keyboardContainer) {
    function fillLetterKeys(rowElement, charStr) {
      for (ch of charStr.split('')) {
        const kbKey = createElement("button", ["keyboard__key"]);
        kbKey.textContent = ch.toUpperCase();
        kbKey.addEventListener("click", gameManager.handleLetterClick)
        rowElement.appendChild(kbKey);
      }
    }

    function createKbRow() {
      return createElement("div", ["keyboard__row"]);
    }

    // row 1: no special case
    const kbRowTop = createKbRow();
    fillLetterKeys(kbRowTop, "QWERTYUIOP");
    
    // row 2: needs halfwidth spacer on each side
    const kbRowMid = createKbRow();
    kbRowMid.appendChild(createElement("div", ["keyboard__key--halfwidth"]));
    fillLetterKeys(kbRowMid, "ASDFGHJKL");
    kbRowMid.appendChild(createElement("div", ["keyboard__key--halfwidth"]));

    // row 3: needs extrawidth enter & delete keys on each side
    const kbRowBottom = createKbRow();
    const enterBtn = createElement("button", ["keyboard__key--extrawidth"]);
    enterBtn.addEventListener("click", gameManager.handleSubmit);
    const delBtn = createElement("button", ["keyboard__key--extrawidth"]);

    kbRowBottom.appendChild(enterBtn);
    fillLetterKeys(kbRowBottom, "ZXCVBNM");
    kbRowBottom.appendChild(delBtn);


    keyboardContainer.appendChild(kbRowTop);
    keyboardContainer.appendChild(kbRowMid);
    keyboardContainer.appendChild(kbRowBottom);
  }

  populateGameBoard(document.querySelector('.game-board'));
  populateGameKeyboard(document.querySelector('.keyboard'));
}

function createGameManager() {
  const wordArray = [];
  const selectedWord = selectWord();

  for (let i = 0; i < NUM_GUESSES; i++) {
    wordArray.push([]);
  }

  let currentRow = 0;
  let currentCol = 0;

  const boardUpdatePublisher = createPublisher();
  const guessSubmitPublisher = createPublisher();

  function selectWord() {
    return "deers"; // ! TEMP
  }

  function addLetter(letter) {
    if (currentCol < NUM_LETTERS) {
      wordArray[currentRow][currentCol] = letter;
      console.log(wordArray[currentRow].join(''));
      boardUpdatePublisher.pub();
      currentCol++;
    }
  }

  function handleLetterClick(e) {
    const letter = e.target.textContent;
    addLetter(letter);
  }

  function checkWordValid(guess) {
    // see if guess is in valid words list
    return true;
  }

  function handleSubmit() {
    const guess = wordArray[currentRow].join('').toLowerCase();

    if (currentCol < NUM_LETTERS - 2) {
      console.log("not enough letters!")
    } else if (guess === selectedWord) {
      console.log("win");
    } else if (checkWordValid(guess)) {
      console.log("keep trying");
      console.log(guessResult(guess));
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
    handleLetterClick,
    handleSubmit,
    wordArray,
    boardUpdatePublisher,
    guessSubmitPublisher,
  }
}

function main() {
  const gameManager = createGameManager();
  populateHtml(gameManager);
}

main();
