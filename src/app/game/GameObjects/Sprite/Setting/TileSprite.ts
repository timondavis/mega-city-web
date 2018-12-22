import { MazeNode, C4 } from 'cm-maze';
import {MazeService} from '../../../Game/MazeService';
import {WallSprite} from './WallSprite';
export class TileSprite extends Phaser.GameObjects.Sprite {
  private mazeNode: MazeNode;
  private walls: WallSprite[];

  public constructor( scene: Phaser.Scene, x: number, y: number, texture: string, mazeNode: MazeNode) {
    super(scene, x, y, texture);
    this.walls = [null, null, null, null];
    this.setMazeNode(mazeNode);
  }

  public getMazeNode(): MazeNode {
    return this.mazeNode;
  }

  public setMazeNode(mazeNode: MazeNode): TileSprite {
    this.mazeNode = mazeNode;
    this.setPosition(this.x, this.y);
    this.createWalls();
    return this;
  }

  public getName(): string {
    return 'mazeNode@' + '[' + this.mazeNode.getLocation().getPosition().toString() + ']';
  }

  public get x(): number {
    return MazeService.getInstance().nodeToPixel2D(this.mazeNode).x;
  }

  public get y(): number {
    return MazeService.getInstance().nodeToPixel2D(this.mazeNode).y;
  }

  public getWalls(): WallSprite[] {
    return this.walls.filter(x => x !== null );
  }

  private createWalls() {
    this.mazeNode.getOpenConnectionPoints().forEach((directionValue) => {
      this.walls[directionValue] = new WallSprite(this.scene, this.x, this.y, 'wall1', this, directionValue);
    });
  }
}
