import { extendObservable } from "mobx";
import { Direction } from "../types/types";

export class BodyCell {
  dir: Direction;
  x: number;
  y: number;

  constructor({ dir, x, y }: { dir: Direction; x: number; y: number }) {
    this.dir = dir;
    this.x = x;
    this.y = y;
    extendObservable(this, {
      dir: this.dir,
      x: this.x,
      y: this.y,
    });
  }
}
