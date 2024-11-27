import { Scene } from "./scene";
import { createCity } from "./city";
import $ from "jquery";
import buildingFactory from "./buildings";

export type Game = {
  update: () => void;
  setActiveToolId: (toolId: ToolId) => void;
};

export type ToolId = "bulldoze" | "residential" | "commercial" | "industrial" | "road";

export function createGame(scene: Scene) {
  let activeToolId: ToolId = "bulldoze";
  const city = createCity(16);

  scene.initialize(city);
  scene.onObjectSelected = (o) => {
    let { x, y } = o.userData;
    const tile = city.data[x][y];

    if (activeToolId === "bulldoze") {
      tile.building = undefined;
      scene.update(city);
    } else if (!tile.building) {
      tile.building = buildingFactory[activeToolId]();
      scene.update(city);
    }
  };

  $("#render-target").on("mousedown", scene.onMouseDown.bind(scene));
  $("#render-target").on("mouseup", scene.onMouseUp.bind(scene));
  $("#render-target").on("mousemove", scene.onMouseMove.bind(scene));
  $("body").on("contextmenu", (e) => e.preventDefault());

  const game: Game = {
    update() {
      city.update();
      scene.update(city);
    },
    setActiveToolId(toolId: ToolId) {
      activeToolId = toolId;
      console.log(activeToolId);
    },
  };

  setInterval(() => {
    game.update();
  }, 1000);

  scene.start();

  return game;
}
