import { NUM_GUESSES, NUM_LETTERS } from '../utils/constants';
import { createElement } from '../utils/dom_utils';
import createKeyboard from './keyboard';

export function populateHtml(gameManager) {
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

  populateGameBoard(document.querySelector('.game-board'));
  createKeyboard(document.querySelector('.keyboard'), gameManager);
}
