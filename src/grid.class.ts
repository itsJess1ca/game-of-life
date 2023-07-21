export type State = (Cell | number)[][];

export class Cell {
  constructor(public alive: boolean = false) {
  }
}

export class Grid {
  grid: Cell[][] = [];
  speed = 200;
  constructor(public rows: number, public columns: number, state?: State) {
    this.grid = this.initGrid(state);
  }

  initGrid(state?: State): Cell[][] {
    let grid: Cell[][] = [];
    for (let i = 0; i < this.rows; i++) {
      grid[i] = [];
      for (let j = 0; j < this.columns; j++) {
        let alive = false;
        if (state) {
          const stateCell = state[i][j];
          if (typeof stateCell === 'number') {
            alive = Boolean(state[i][j]);
          } else {
            alive = stateCell.alive;
          }
        }
        grid[i][j] = new Cell(alive);
      }
    }
    return grid;
  }

  private getCell(r:number, c:number): Cell {
    return this.grid[r][c];
  }

  checkNeighbors(row: number, column: number): number[] {
    const neighborState = [];

    const possibleNeighbors = [
      [row-1, column-1], [row-1,column],  [row-1, column+1],
      [row, column-1],                    [row, column+1],
      [row+1, column-1], [row+1, column], [row+1, column+1]
    ]

    for (const [r, c] of possibleNeighbors) {
      if (r < 0 || r >= this.grid.length || c < 0 || c >= this.grid[0].length) {
        neighborState.push(0);
      } else {
        neighborState.push(this.getCell(r, c).alive ? 1 : 0);
      }
    }

    return neighborState;
  }

  next() {
    const newGrid = this.initGrid(this.grid);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const cell = this.getCell(row, col);
        const neighborState = this.checkNeighbors(row, col);
        const liveCount = neighborState.reduce((sum, state) => sum + state, 0);


        if (cell.alive) {
          if (liveCount < 2 || liveCount > 3) {
            newGrid[row][col] = new Cell(false);
            continue;
          }
          if (liveCount === 2 || liveCount === 3) {
            newGrid[row][col] = new Cell(true);
          }
        } else {
          if (liveCount === 3) {
            newGrid[row][col] = new Cell(true);
          } else {
            newGrid[row][col] = new Cell(false);
          }
        }
      }
    }
    this.grid = newGrid;
  }

  async renderGrid() {
    console.clear();
    for (let row = 0; row < this.rows; row++) {
      let rowStr = '';
      for (let col = 0; col < this.columns; col++) {
        const cell = this.getCell(row, col);
        rowStr += cell.alive ? '█' : ' ';
      }
      console.log(rowStr);
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.next();
        resolve();
      }, this.speed);
    });
  }
}