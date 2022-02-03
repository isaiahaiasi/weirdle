import { createElement } from '../utils/dom_utils';

export default function createEndgameView(container, gameManager) {
  createRestartButton(container, gameManager);
}

function createRestartButton(container, gameManager) {
  const restartBtn = createElement('button');
  restartBtn.addEventListener('click', gameManager.initializeBoard);
  restartBtn.textContent = "Restart?"
  container.appendChild(restartBtn);
}
