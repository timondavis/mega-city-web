import {MazeNode, NodeLocation, NodeLocation2D} from 'cm-maze';
import Vector2 = Phaser.Math.Vector2;

/**
 * Singleton class which can help ease integration of objects and systems into the MazeScene
 */
export class MazeSceneHelper {

  public static GLOBAL_SCALE = 2;

  private static _instance: MazeSceneHelper;

  private constructor() {}

  public static get TILE_SCALE(): number { return MazeSceneHelper.GLOBAL_SCALE * 0.24; }
  public static get TILE_DEPTH():  number { return 0; }
  public static get TILE_WIDTH():  number { return MazeSceneHelper.GLOBAL_SCALE * 32; }

  public static get WALL_DEPTH():  number { return 100; }
  public static get WALL_WIDE_SCALE(): number { return MazeSceneHelper.GLOBAL_SCALE; }
  public static get WALL_THIN_SCALE(): number { return MazeSceneHelper.GLOBAL_SCALE * 0.1; }

  public static get ACTOR_DEPTH(): number { return 1000; }

  public static getInstance(): MazeSceneHelper {
    if (!this._instance) {
      this._instance = new MazeSceneHelper();
    }
     return this._instance;
  }

  public nodeToPixel2D(location: MazeNode): Vector2 {
    return this.gridToPixel2D(location.getLocation());
  }

  public gridToPixel2D(location: NodeLocation): Vector2 {
    const location2D = <NodeLocation2D>location;
    const tileWidth = MazeSceneHelper.TILE_WIDTH;
    return new Vector2(
      location2D.X * tileWidth + (tileWidth / 2),
      location2D.Y * tileWidth + (tileWidth / 2));
  }
}
