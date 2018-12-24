import { C4 } from 'cm-maze';
import {TileSprite} from './TileSprite';
export class WallSprite extends Phaser.GameObjects.Sprite {

  private exitPosition: C4;
  private readonly pairedTileName: string;

  public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tile: TileSprite, exitPosition: C4) {
    super(scene, x, y, texture);
    this.pairedTileName = tile.getName();
    this.setExitPositionOnTile(exitPosition, tile);
  }

  public setExitPositionOnTile(exitPosition: C4, tile: TileSprite): WallSprite {
      this.exitPosition = exitPosition;
        switch (this.exitPosition) {
          case (C4.NORTH):
            this.setPosition(tile.x, tile.y - 16);
            this.setScale(1, .1);
            break;
          case (C4.EAST):
            this.setPosition(tile.x + 16, tile.y );
            this.setScale(.1, 1);
            break;
          case (C4.SOUTH):
            this.setPosition( tile.x, tile.y + 16 );
            this.setScale(1, .1);
            break;
          case (C4.WEST):
            this.setPosition( tile.x - 16, tile.y );
            this.setScale(.1, 1);
            break;
          default:
            throw Error('Direction Not Valid: ' + exitPosition);
        }
      return this;
  }

  public getExitPosition(): C4 {
    return this.exitPosition;
  }

  public getName(): string {
    return this.pairedTileName + '@wall[' + this.getExitPosition() + ']';
  }
}
