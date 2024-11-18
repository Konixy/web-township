import type { Scene } from "./scene";

declare global {
  interface Window {
    scene: Scene;
  }
}
