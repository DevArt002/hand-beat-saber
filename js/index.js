import Game from "./game/index.js";
import { GAME_EVENTS } from "./constants/index.js";

const root = document.getElementById("root");

const game = new Game(root);
game.init();

game.addEventListener(GAME_EVENTS.INITIALIZED, () => {
  game.play();
});
