import { AssetId } from "./assets";
import { Building } from "./buildings";

export type City = {
  size: number;
  data: CityMat;
};

export type CityMat = Tile[][];

export type Tile = {
  x: number;
  y: number;
  terrainId: "grass";
  building?: Building;
};

export function createCity(size: number) {
  const data: CityMat = [];

  initialize();

  function initialize() {
    for (let x = 0; x < size; x++) {
      const column = [];
      for (let y = 0; y < size; y++) {
        const tile = createTile(x, y);

        column.push(tile);
      }
      data.push(column);
    }
  }

  function update() {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        data[x][y].building?.update();
      }
    }
  }

  return {
    size,
    data,
    update,
  };
}

function createTile(x: number, y: number): Tile {
  return {
    x,
    y,
    terrainId: "grass",
    building: undefined,
  };
}
