import { NUM_GUESSES, NUM_LETTERS } from '../utils/constants';
import { assignClassByScore, createElement } from '../utils/dom_utils';

export default function createGameboard(boardContainer, gameManager) {
  const board = [];

  function handleGuessResult({ row, scores }) {
    for (let i = 0; i < NUM_LETTERS; i++) {
      const cell = board[row][i];

      if (cell) {
        assignClassByScore(cell, scores[i], {
          0: "game-board__cell--wrong",
          1: "game-board__cell--close",
          2: "game-board__cell--correct",
        })
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