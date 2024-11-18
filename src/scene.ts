import * as THREE from "three";

export type Scene = {
  start: () => void;
  stop: () => void;
};

export function createScene(): Scene {
  const gameWindow = document.getElementById("render-target") as HTMLDivElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#777777");

  const camera = new THREE.PerspectiveCamera(
    75,
    gameWindow?.offsetWidth / gameWindow?.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function draw() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  return {
    start,
    stop,
  };
}
