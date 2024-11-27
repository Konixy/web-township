import * as THREE from "three";

export type AssetId = "grass" | "residential" | "commercial" | "industrial" | "road";

const geometry = new THREE.BoxGeometry(1, 1, 1);

const assets: Record<AssetId, (x: number, y: number, data: { height: number }) => THREE.Mesh> = {
  grass: (x, y) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: "grass", x, y };
    mesh.position.set(x, -0.5, y);
    return mesh;
  },
  residential: (x, y, data) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: "residential", x, y };
    mesh.scale.set(1, data.height, 1);
    mesh.position.set(x, data.height / 2, y);
    return mesh;
  },
  commercial: (x, y, data) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: "commercial", x, y };
    mesh.scale.set(1, data.height, 1);
    mesh.position.set(x, data.height / 2, y);
    return mesh;
  },
  industrial: (x, y, data) => {
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: "industrial", x, y };
    mesh.scale.set(1, data.height, 1);
    mesh.position.set(x, data.height / 2, y);
    return mesh;
  },
  road: (x, y) => {
    const material = new THREE.MeshLambertMaterial({ color: 0x4444440 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: "road", x, y };
    mesh.scale.set(1, 0.1, 1);
    mesh.position.set(x, 0, y);
    return mesh;
  },
};

export function createAssetInstance(assetId: AssetId, x: number, y: number, data: { height: number }): THREE.Mesh | null {
  if (assetId in assets) {
    return assets[assetId](x, y, data);
  } else {
    console.warn(`Undefined assetId: ${assetId}`);
    return null;
  }
}
