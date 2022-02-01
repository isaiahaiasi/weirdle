import createKeyboard from './keyboard';
import createGameboard from './gameboard';

export function populateHtml(gameManager) {
  createGameboard(document.querySelector('.game-board'), gameManager);
  createKeyboard(document.querySelector('.keyboard'), gameManager);
}
