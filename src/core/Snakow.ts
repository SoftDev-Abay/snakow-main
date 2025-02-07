import { extendObservable } from "mobx";
import { Direction, Coords } from "../types/types";
import {
  SOUNDS,
  INITIAL_SNAKE_SIZE,
  FOOD_GROWTH,
} from "../constants/constants";
import { moveCellInDir } from "../utils/helpers";
import { BodyCell } from "../models/BodyCell";
import { Snake } from "../models/Snake";
import { configStore } from "../store/configStore";

export class Snakow {
  canvas: HTMLCanvasElement;
  running = true;
  speed = 50;
  foodAddDelay = 1000;
  context: CanvasRenderingContext2D;
  snakes: Snake[] = [];
  animal: Coords = { x: 0, y: 0 };
  width: number;
  height: number;
  rows: number = 100;
  cols: number = 100;
  foods: Coords[] = [];
  res: number;
  timeouts: NodeJS.Timeout[] = []; 

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.width = Math.round(canvas.getBoundingClientRect().width);
    this.height = Math.round(canvas.getBoundingClientRect().height);
    canvas.width = this.width;
    canvas.height = this.height;
    this.res = this.width / this.cols;

    this.initializeGame();

    window.addEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (ev: KeyboardEvent) => {
    const [snake1, snake2] = this.snakes;
    if (ev.key === "ArrowUp") {
      snake1.dir = "up";
    } else if (ev.key === "ArrowRight") {
      snake1.dir = "right";
    } else if (ev.key === "ArrowDown") {
      snake1.dir = "down";
    } else if (ev.key === "ArrowLeft") {
      snake1.dir = "left";
    } else if (ev.key === "w") {
      snake2.dir = "up";
    } else if (ev.key === "d") {
      snake2.dir = "right";
    } else if (ev.key === "s") {
      snake2.dir = "down";
    } else if (ev.key === "a") {
      snake2.dir = "left";
    }
  };

  start() {
    this.running = true;
    this.tick();
  }

  trigger() {
    if (this.running) {
      this.timeouts.push(setTimeout(this.tick, this.speed));
      this.timeouts.push(setTimeout(this.addFood, this.foodAddDelay));
    }
  }

  playFunnySound = () => {
    const sound = SOUNDS[Math.round(SOUNDS.length * Math.random())];
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/${sound}`);
    audio.play();
  };

  clearTimeouts() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  addFood = () => {
    if (this.foods.length === 0) {
      const newFood: Coords = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows),
      };
      this.foods.push(newFood);
    }
  };

  tick = () => {
    requestAnimationFrame(this.render);
    this.trigger();
  };

  initializeGame() {
    this.snakes = [
      new Snake({
        rows: this.rows,
        cols: this.cols,
        res: this.res,
        dir: "right",
        bodyColor: "red",
        headColor: "brown",
        x: Math.floor(this.cols / 2) + 10,
        y: Math.floor(this.rows / 2),
        size: configStore.initialSnakeSize,
      }),
      new Snake({
        rows: this.rows,
        cols: this.cols,
        res: this.res,
        dir: "left",
        bodyColor: "black",
        headColor: "brown",
        x: Math.floor(this.cols / 2) - 10,
        y: Math.floor(this.rows / 2),
        size: configStore.initialSnakeSize,
      }),
    ];
    this.foods = [];
  }

  restart = () => {
    this.running = false;
    this.clearTimeouts();
    this.initializeGame();
    this.running = true;
    this.start();
  };

  render = () => {
    const ctx = this.context;

    ctx.clearRect(0, 0, this.width, this.height);

    for (let food of this.foods) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "black";
      const rad = this.res / 2;
      ctx.arc(
        food.x * this.res + rad,
        food.y * this.res + rad,
        rad,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.restore();
    }

    this.snakes.forEach((snake) => {
      snake.render(ctx);
      snake.move();
      const lastFood = this.foods[this.foods.length - 1];
      if (lastFood && lastFood.x === snake.x && lastFood.y === snake.y) {
        snake.feed(configStore.foodGrowth);
        this.foods.pop();
        this.playFunnySound();
      }
    });
  };
}
