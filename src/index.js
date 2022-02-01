import './style.css';
import { populateHtml } from './views/viewManager';
import createGameManager from './controllers/gameManager';


function main() {
  const gameManager = createGameManager();
  populateHtml(gameManager);
}

main();
