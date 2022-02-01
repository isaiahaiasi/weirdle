import { NUM_GUESSES, NUM_LETTERS } from '../utils/constants';
import { createElement } from '../utils/dom_utils';

export default function createGameboard(boardContainer, gameManager) {
  const board = [];

  function handleGuessResult({ row, scores }) {
    for (let i = 0; i < NUM_LETTERS; i++) {
      const cell = board[row][i];
      switch (scores[i]) {
        case 0:
          cell?.classList.add("game-board__cell--wrong");
          break;
        case 1:
          cell?.classList.add("game-board__cell--close");
          break;
        case 2:
          cell?.classList.add("game-board__cell--correct");
          break;
        default:
          console.error("UNHANDLED VALUE IN RESULT");
      }
    }
  }

  gameManager.hooks.onSubmitGuess.sub(handleGuessResult);

  for (let row = 0; row < NUM_GUESSES; row++) {
    const gameBoardRowEl = createElement('div', ['game-board__row']);
    const rowArray = [];

    for (let col = 0; col < NUM_LETTERS; col++) {
      const gameBoardCellEl = createElement('div', ["game-board__cell"]);
      gameBoardCellEl.setAttribute("data-cell", `${row},${col}`);
      gameManager.hooks.onLetterInput.sub(() => {
        gameBoardCellEl.textContent = gameManager.wordArray[row][col];
      });

      gameBoardRowEl.appendChild(gameBoardCellEl);
      rowArray.push(gameBoardCellEl);
    }

    boardContainer.appendChild(gameBoardRowEl);
    board.push(rowArray);
  }
}