import {MazeNode, NodeLocation, NodeLocation2D} from 'cm-maze';
import Vector2 = Phaser.Math.Vector2;

/**
 * Singleton class which can help ease integration of objects and systems into the MazeScene
 */
export class MazeSceneHelper {
  private static _instance: MazeSceneHelper;

  private constructor() {}

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
    return new Vector2(location2D.X * 32 + 16, location2D.Y * 32 + 16);
  }
}
