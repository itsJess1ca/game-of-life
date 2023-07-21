import { Grid } from "./grid.class";
import { OSCILLATOR } from "./__tests__/oscillator";
import GospelGlider from "./__tests__/gospel-glider";


const testPattern = GospelGlider;
const grid = new Grid(testPattern.length, testPattern[0].length, testPattern);

async function start() {
  while(true) {
    await grid.renderGrid();
  }
}

start();