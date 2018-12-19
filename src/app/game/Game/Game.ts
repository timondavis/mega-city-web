import {MazeNode, Maze, MazeBuilder} from 'cm-maze';
import {NameMap} from 'cm-dungeon';
import {MazeScene} from './Scene/MazeScene';

export class Game {

    private static instance: Game;

    public RoomData: NameMap<MazeNode>;
    public Game: Phaser.Game;
    public Maze: Maze;

    private constructor(canvasId: string) {

      const mazeBuilder = new MazeBuilder();
      this.Maze = mazeBuilder.buildMaze();
      const mazeScene = new MazeScene('MazeScene');

      this.Game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [mazeScene],
        parent: canvasId,
        canvasStyle: 'background:red;'
      });

      this.RoomData = new NameMap();
    }

    public static init(canvasId: string) {
      this.instance = new Game(canvasId);
    }

    public static get Instance(): Game {
      if ( !this.instance ) {
        throw new Error('Un-intialized game invoked.');
      }
      return this.instance;
    }
}
