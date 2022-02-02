import { createElement } from '../utils/dom_utils';

export default function createKeyboard(keyboardContainer, gameManager) {
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
    }
  }

  function fillKeyboard() {
    // row 1: no special case
    const kbRowTop = createKbRow();
    fillKeybaordRowLetters(kbRowTop, "QWERTYUIOP");
    keyboardContainer.appendChild(kbRowTop);

    // row 2: needs halfwidth spacer on each side
    const kbRowMid = createKbRow();
    kbRowMid.appendChild(createElement("div", ["keyboard__key--halfwidth"]));
    fillKeybaordRowLetters(kbRowMid, "ASDFGHJKL");
    kbRowMid.appendChild(createElement("div", ["keyboard__key--halfwidth"]));
    keyboardContainer.appendChild(kbRowMid);

    // row 3: needs extrawidth enter & delete keys on each side
    const kbRowBottom = createKbRow();

    const enterBtn = createElement("button", ["keyboard__key--extrawidth"]);
    enterBtn.addEventListener("click", gameManager.submitGuess);

    const delBtn = createElement("button", ["keyboard__key--extrawidth"]);
    delBtn.addEventListener("click", gameManager.removeLetter);

    kbRowBottom.appendChild(enterBtn);
    fillKeybaordRowLetters(kbRowBottom, "ZXCVBNM");
    kbRowBottom.appendChild(delBtn);
    keyboardContainer.appendChild(kbRowBottom);
  }

  fillKeyboard();
}