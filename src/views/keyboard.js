import { assignClassByScore, createElement } from '../utils/dom_utils';

export default function createKeyboard(keyboardContainer, gameManager) {
  const letterResults = {};
  const keyElements = {};

  function createKbRow() {
    return createElement("div", ["keyboard__row"]);
  }

  function fillKeybaordRowLetters(rowElement, charStr) {
    for (const ch of charStr.split('')) {
      const kbKey = createElement("button", ["keyboard__key"]);
      kbKey.textContent = ch.toUpperCase();
      kbKey.addEventListener(
        "click",
        (e) => gameManager.addLetter(e.target.textContent)
      );
      rowElement.appendChild(kbKey);
      keyElements[ch] = kbKey;
    }
  }

  function fillKeyboard() {
    // row 1: no special case
    const kbRowTop = createKbRow();
    fillKeybaordRowLetters(kbRowTop, "qwertyuiop");
    keyboardContainer.appendChild(kbRowTop);

    // row 2: needs halfwidth spacer on each side
    const kbRowMid = createKbRow();
    kbRowMid.appendChild(createElement("div", ["keyboard__key--halfwidth"]));
    fillKeybaordRowLetters(kbRowMid, "asdfghjkl");
    kbRowMid.appendChild(createElement("div", ["keyboard__key--halfwidth"]));
    keyboardContainer.appendChild(kbRowMid);

    // row 3: needs extrawidth enter & delete keys on each side
    const kbRowBottom = createKbRow();

    const enterBtn = createElement("button", ["keyboard__key--extrawidth"]);
    enterBtn.addEventListener("click", gameManager.submitGuess);
    kbRowBottom.appendChild(enterBtn);
    
    fillKeybaordRowLetters(kbRowBottom, "zxcvbnm");

    const delBtn = createElement("button", ["keyboard__key--extrawidth"]);
    delBtn.addEventListener("click", gameManager.removeLetter);
    kbRowBottom.appendChild(delBtn);
  
    keyboardContainer.appendChild(kbRowBottom);
  }

  function updateLetterResults({ scores, guess }) {
    for (let i = 0; i < guess.length; i++) {
      const ch = guess[i];
      if (!letterResults[ch] || scores[i] > letterResults[ch]) {
        letterResults[ch] = scores[i];
      }
    }
  }

  function updateKeyStyles() {
    for (let [ch, score] of Object.entries(letterResults)) {
      assignClassByScore(keyElements[ch], score, {
        0: "keyboard__key--wrong",
        1: "keyboard__key--close",
        2: "keyboard__key--correct",
      })
    }
  }

  gameManager.hooks.onSubmitGuess.sub(({ scores, guess }) => {
    updateLetterResults({ scores, guess });
    updateKeyStyles();
  })

  fillKeyboard();
}