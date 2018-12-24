import {Maze, MazeBuilder} from 'cm-maze';

export class MazeGame extends Phaser.Game {

    private static instance: MazeGame;
    private maze: Maze;

    private constructor(config: GameConfig) {
      super(config);

      const mazeBuilder = new MazeBuilder();
      this.maze = mazeBuilder.buildMaze();
    }

    public static initialize(config: GameConfig): MazeGame {
      this.instance = new MazeGame(config);
      return this.instance;
    }

    public static getInstance(): MazeGame {
      if ( !this.instance) {
        throw new Error('MazeGame not initialized.  See initialize() method');
      }
      return this.instance;
    }

    public getMaze() {
      return this.maze;
    }
}
