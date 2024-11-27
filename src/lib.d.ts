import type { Scene } from "./scene";
import type { Game, ToolId } from "./game";

declare global {
  interface Window {
    scene: Scene;
    game: Game;
    setActiveTool: (event: Event<HTMLButtonElement>, toolId: ToolId) => void;
  }
}
