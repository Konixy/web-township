import $ from "jquery";
import { createGame, ToolId } from "./game";
import { createScene } from "./scene";

let selectedControl = document.getElementById("button-bulldoze");
$(() => {
  window.scene = createScene();
  window.game = createGame(window.scene);
});

window.setActiveTool = (event: MouseEvent, toolId: ToolId) => {
  if (selectedControl) {
    selectedControl.classList.remove("selected");
  }
  selectedControl = event.target as HTMLElement;
  selectedControl?.classList.add("selected");

  window.game.setActiveToolId(toolId);
};
