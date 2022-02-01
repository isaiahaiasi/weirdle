const NUM_GUESSES = 6;
const NUM_LETTERS = 5;

// populate html (game-board, game-keyboard)

const populateHtml = (() => {
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
        gameBoardRow.appendChild(gameBoardCell);
      }
      boardContainer.appendChild(gameBoardRow);
    }
  }

  function populateGameKeyboard(keyboardContainer) {
    const KEYBOARD = [
      "QWERTYUIOP",
      "ASDFGHJKL",
      "ZXCVBNM"
    ];

    function fillLetterKeys(rowElement, charStr) {
      for (ch of charStr.split('')) {
        const kbKey = createElement("button", ["keyboard__key"]);
        kbKey.textContent = ch.toUpperCase();
        // other stuff, eg event handler
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
    const delBtn = createElement("button", ["keyboard__key--extrawidth"]);

    kbRowBottom.appendChild(enterBtn);
    fillLetterKeys(kbRowBottom, "ZXCVBNM");
    kbRowBottom.appendChild(delBtn);


    keyboardContainer.appendChild(kbRowTop);
    keyboardContainer.appendChild(kbRowMid);
    keyboardContainer.appendChild(kbRowBottom);
  }

  return {
    populateGameBoard,
    populateGameKeyboard,
  };
})();

function main() {
  populateHtml.populateGameBoard(document.querySelector(".game-board"));
  populateHtml.populateGameKeyboard(document.querySelector(".keyboard"));
}

main();
