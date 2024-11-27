import * as THREE from "three";
import { createCamera } from "./camera";
import { City } from "./city";
import { AssetId, createAssetInstance } from "./assets";
import { Building } from "./buildings";

export type Scene = {
  initialize: (city: City) => void;
  update: (city: City) => void;
  start: () => void;
  stop: () => void;
  onMouseDown: (event: JQuery.MouseDownEvent) => void;
  onMouseUp: (event: JQuery.MouseUpEvent) => void;
  onMouseMove: (event: JQuery.MouseMoveEvent) => void;
  onObjectSelected: ((object: THREE.Mesh) => void) | undefined;
};

export function createScene(): Scene {
  const gameWindow = document.getElementById("render-target") as HTMLDivElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#777777");
  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject: THREE.Mesh | undefined = undefined;

  let terrain: (THREE.Mesh | null)[][] = [];
  let buildings: (THREE.Mesh | null)[][] = [];
  let onObjectSelected: ((object: THREE.Mesh) => void) | undefined = undefined;

  function initialize(city: City) {
    scene.clear();
    terrain = [];
    buildings = [];

    for (let x = 0; x < city.size; x++) {
      const column: (THREE.Mesh | null)[] = [];
      for (let y = 0; y < city.size; y++) {
        const terrainId = city.data[x][y].terrainId;
        const mesh = createAssetInstance(terrainId, x, y, { height: 1 }) as THREE.Mesh;

        scene.add(mesh);
        column.push(mesh);
      }
      terrain.push(column);
      buildings.push([...Array(city.size)]);
    }

    setupLights();
  }

  function update(city: City) {
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const tile = city.data[x][y];
        const existingBuildingMesh = buildings[x][y];

        if (!tile.building && existingBuildingMesh) {
          scene.remove(existingBuildingMesh as THREE.Mesh);
          buildings[x][y] = null;
        }

        if (tile.building && tile.building.updated) {
          if (existingBuildingMesh) scene.remove(buildings[x][y] as THREE.Mesh);
          buildings[x][y] = createAssetInstance(tile.building.id as AssetId, x, y, tile.building as Building);
          if (buildings[x][y]) scene.add(buildings[x][y] as THREE.Mesh);
          tile.building.updated = false;
        }
      }
    }
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight("#fff", 0.5),
      new THREE.DirectionalLight("#fff", 0.7),
      new THREE.DirectionalLight("#fff", 0.7),
      new THREE.DirectionalLight("#fff", 0.7),
    ];

    lights[1].position.set(0, 1, 0);
    lights[2].position.set(1, 1, 0);
    lights[3].position.set(0, 1, 1);

    scene.add(...lights);
  }

  function draw() {
    renderer.render(scene, camera.camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown(this: Scene, e: JQuery.MouseDownEvent) {
    camera.onMouseDown(e);

    mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      if (selectedObject) (selectedObject.material as THREE.MeshLambertMaterial).emissive.setHex(0);

      selectedObject = intersections[0].object as THREE.Mesh;
      (selectedObject.material as THREE.MeshLambertMaterial).emissive.setHex(0x555555);

      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject);
      }
    }
  }

  function onMouseUp(e: JQuery.MouseUpEvent) {
    camera.onMouseUp(e);
  }

  function onMouseMove(e: JQuery.MouseMoveEvent) {
    camera.onMouseMove(e);
  }

  return {
    initialize,
    update,
    start,
    stop,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onObjectSelected,
  };
}
