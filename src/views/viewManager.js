import createKeyboard from './keyboard';
import createGameboard from './gameboard';
import createEndgameView from './endgameView';
import { removeChildren } from '../utils/dom_utils';

export function populateHtml(gameManager) {
  const htmlRoots = {
    keyboard: document.querySelector('.keyboard'),
    gameboard: document.querySelector('.game-board'),
  }

  function initializeHtml() {
    console.log("initializing html");
    removeChildren(htmlRoots.keyboard);
    removeChildren(htmlRoots.gameboard);

    createKeyboard(htmlRoots.keyboard, gameManager);
    createGameboard(htmlRoots.gameboard, gameManager);
  }

  gameManager.hooks.onWin.sub(() => {
    createEndgameView(htmlRoots.gameboard, gameManager);
  });

  gameManager.hooks.onRestart.sub(initializeHtml)

  initializeHtml();
}
