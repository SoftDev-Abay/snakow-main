import { extendObservable } from "mobx";
import { Coords, Direction } from "../types/types";
import { moveCellInDir, snakeBodyCollisionHappened } from "../utils/helpers";
import { BodyCell } from "./BodyCell";

export class Snake {
  dir: Direction;
  rows: number;
  cols: number;
  res: number;
  bodyColor: string;
  headColor: string;
  x: number;
  y: number;
  bodyCells: BodyCell[] = [];
  pendingGrowth: number = 0;
  points: number = 0;
  initialSize: number = 1;

  constructor({
    rows,
    cols,
    res,
    dir,
    bodyColor,
    headColor,
    x = 0,
    y = 0,
    size,
  }: {
    rows: number;
    cols: number;
    res: number;
    dir: Direction;
    bodyColor: string;
    headColor: string;
    x?: number;
    y?: number;
    size: number;
  }) {
    this.rows = rows;
    this.cols = cols;
    this.res = res;
    this.dir = dir;
    this.headColor = headColor;
    this.bodyColor = bodyColor;
    this.x = x;
    this.y = y;
    this.initialSize = size;

    extendObservable(this, {
      dir: this.dir,
      x: this.x,
      y: this.y,
      bodyCells: this.bodyCells,
      pendingGrowth: this.pendingGrowth,
      points: this.points,
    });

    this.initializeBody();
  }

  get length(): number {
    return this.bodyCells.length + 1;
  }

  initializeBody() {
    let posX = this.x;
    let posY = this.y;

    for (let i = 0; i < this.initialSize; i++) {
      switch (this.dir) {
        case "left":
          posX += 1;
          break;
        case "right":
          posX -= 1;
          break;
        case "up":
          posY += 1;
          break;
        case "down":
          posY -= 1;
          break;
      }
      this.bodyCells.push(new BodyCell({ dir: this.dir, x: posX, y: posY }));
    }
  }

  feed(foodGrowth: number) {
    this.pendingGrowth += foodGrowth;
    this.points += 1;
  }

  move() {
    const positions = [{ x: this.x, y: this.y, dir: this.dir }].concat(
      this.bodyCells.map((cell) => ({ x: cell.x, y: cell.y, dir: cell.dir }))
    );

    moveCellInDir(this);

    if (this.x < 0) {
      this.x = this.cols - 1;
    } else if (this.x >= this.cols) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = this.rows - 1;
    } else if (this.y >= this.rows) {
      this.y = 0;
    }

    for (let i = 0; i < this.bodyCells.length; i++) {
      this.bodyCells[i].x = positions[i].x;
      this.bodyCells[i].y = positions[i].y;
      this.bodyCells[i].dir = positions[i].dir;
    }

    if (snakeBodyCollisionHappened(positions)) {
      this.points = 0;
      this.pendingGrowth = 0;

      const excessCells = this.length - this.initialSize;

      if (excessCells > 0) {
        this.bodyCells.splice(this.initialSize, excessCells);
      }
    }

    if (this.pendingGrowth > 0) {
      const lastPos = positions[positions.length - 1];
      this.bodyCells.push(
        new BodyCell({ x: lastPos.x, y: lastPos.y, dir: lastPos.dir })
      );
      this.pendingGrowth--;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.headColor;
    ctx.fillRect(this.x * this.res, this.y * this.res, this.res, this.res);

    ctx.fillStyle = this.bodyColor;
    for (const cell of this.bodyCells) {
      ctx.fillRect(cell.x * this.res, cell.y * this.res, this.res, this.res);
    }
    ctx.restore();
  }
}
