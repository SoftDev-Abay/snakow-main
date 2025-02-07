import { makeAutoObservable } from "mobx";
import { FOOD_GROWTH, INITIAL_SNAKE_SIZE } from "../constants/constants";
class ConfigStore {
  foodGrowth = FOOD_GROWTH;
  initialSnakeSize = INITIAL_SNAKE_SIZE;

  constructor() {
    makeAutoObservable(this);
  }

  setFoodGrowth(value: number) {
    this.foodGrowth = value;
  }

  setInitialSnakeSize(value: number) {
    this.initialSnakeSize = value;
  }
}

export const configStore = new ConfigStore();
