import * as THREE from "three";

const DEG2RAD = Math.PI / 180.0;
const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 1;
const MIDDLE_MOUSE_BUTTON = 2;

const MIN_CAMERA_RADIUS = 10;
const MAX_CAMERA_RADIUS = 20;
const MIN_CAMERA_ELEVATION = 30;
const MAX_CAMERA_ELEVATION = 90;
const ROTATION_SENSITIVITY = 0.5;
const ZOOM_SENSITIVITY = 0.02;
const PAN_SENSITIVITY = -0.01;

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export function createCamera(gameWindow: HTMLDivElement) {
  const camera = new THREE.PerspectiveCamera(75, gameWindow?.offsetWidth / gameWindow?.offsetHeight, 0.1, 1000);
  let cameraOrigin = new THREE.Vector3();
  let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
  let cameraAzimuth = 135;
  let cameraElevation = 45;
  let isLeftMouseDown = false;
  let isRightMouseDown = false;
  let isMiddleMouseDown = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  updateCameraPosition();

  function onMouseDown(e: JQuery.MouseDownEvent) {
    if (e.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = true;
    } else if (e.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = true;
    } else if (e.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = true;
    }
  }

  function onMouseUp(e: JQuery.MouseUpEvent) {
    if (e.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = false;
    } else if (e.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = false;
    } else if (e.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = false;
    }
  }

  function onMouseMove(event: JQuery.MouseMoveEvent) {
    const deltaX = event.clientX - prevMouseX;
    const deltaY = event.clientY - prevMouseY;

    // Handles the rotation of the camera
    if (isLeftMouseDown) {
      cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
      cameraElevation += deltaY * ROTATION_SENSITIVITY;
      cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
    }

    // Handles the panning of the camera
    if (isMiddleMouseDown) {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
      cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
      cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
    }

    // Handles the zoom of the camera
    if (isRightMouseDown) {
      cameraRadius += deltaY * ZOOM_SENSITIVITY;
      cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
    }

    updateCameraPosition();
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
  }

  function updateCameraPosition() {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin);
    camera.updateMatrix();
  }

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
