import { CellsType } from "../GameOfLife";

export const getNumberOfNeighbours = (
  { x, y }: { x: number; y: number },
  cells: CellsType
) => {
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

  return directions.reduce((count, [dx, dy]) => {
    if (cells[`${x + dx},${y + dy}`]) {
      count++;
    }
    return count;
  }, 0);
};
