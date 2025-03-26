import { CellsType } from "../GameOfLife";
import { getNumberOfNeighbours } from "./getNumberOfNeighbours";

export const getNextGeneration = (cells: CellsType) => {
  const newCells: CellsType = {};
  const deadCandidates: Record<string, number> = {};

  Object.keys(cells).forEach((key) => {
    const [x, y] = key.split(",").map(Number);
    const numNeighbours = getNumberOfNeighbours({ x, y }, cells);

    if (numNeighbours === 2 || numNeighbours === 3) {
      newCells[key] = true;
    }

    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    directions.forEach(([directionX, directionY]) => {
      const deadKey = `${x + directionX},${y + directionY}`;
      if (!cells[deadKey]) {
        deadCandidates[deadKey] = (deadCandidates[deadKey] || 0) + 1;
      }
    });
  });

  Object.keys(deadCandidates).forEach((key) => {
    if (deadCandidates[key] === 3) {
      newCells[key] = true;
    }
  });
  return newCells;
};
