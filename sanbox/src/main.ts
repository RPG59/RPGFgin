import { initWebGL } from "../../RPGFgin/src/main";
import { Game } from "./game";

initWebGL("canvas3d");

function main() {
  const game = new Game();

  const mainLoop = () => {
    game.render();

    requestAnimationFrame(mainLoop);
  };

  mainLoop();
}

main();
