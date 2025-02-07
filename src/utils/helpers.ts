import { Direction, Coords } from "../types/types";

function moveCellInDir(cell: { dir: Direction; x: number; y: number }) {
  switch (cell.dir) {
    case "up":
      cell.y -= 1;
      break;
    case "down":
      cell.y += 1;
      break;
    case "left":
      cell.x -= 1;
      break;
    case "right":
      cell.x += 1;
      break;
    default:
      break;
  }
}

function snakeBodyCollisionHappened(positions: Coords[]): boolean {
  const head = positions[0];

  for (let index = 1; index < positions.length; index++) {
    if (head.x === positions[index].x && head.y === positions[index].y) {
      return true;
    }
  }

  return false;
}

export { moveCellInDir, snakeBodyCollisionHappened };
