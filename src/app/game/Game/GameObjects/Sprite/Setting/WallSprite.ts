import {C4} from 'cm-maze';
import {TileSprite} from './TileSprite';
import {MazeSceneHelper} from '../../../Scene/MazeSceneHelper';

export class WallSprite extends Phaser.GameObjects.Sprite {

    private exitPosition: C4;
    private readonly pairedTileName: string;

    public get name(): string {
        return this.getData('name');
    }
    public set name(value: string) {
        this.getData('name');
    }

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tile: TileSprite, exitPosition: C4) {
        super(scene, x, y, texture);
        this.pairedTileName = tile.name;
        this.setExitPositionOnTile(exitPosition, tile);
        this.setData('name', this.getName());
    }

    public setExitPositionOnTile(exitPosition: C4, tile: TileSprite): WallSprite {
        this.exitPosition = exitPosition;
        switch (this.exitPosition) {
            case (C4.NORTH):
                this.setPosition(tile.x, tile.y - (MazeSceneHelper.TILE_WIDTH / 2));
                this.setScale(MazeSceneHelper.WALL_WIDE_SCALE, MazeSceneHelper.WALL_THIN_SCALE);
                break;
            case (C4.EAST):
                this.setPosition(tile.x + (MazeSceneHelper.TILE_WIDTH / 2), tile.y);
                this.setScale(MazeSceneHelper.WALL_THIN_SCALE, MazeSceneHelper.WALL_WIDE_SCALE);
                break;
            case (C4.SOUTH):
                this.setPosition(tile.x, tile.y + (MazeSceneHelper.TILE_WIDTH / 2));
                this.setScale(MazeSceneHelper.WALL_WIDE_SCALE, MazeSceneHelper.WALL_THIN_SCALE);
                break;
            case (C4.WEST):
                this.setPosition(tile.x - (MazeSceneHelper.TILE_WIDTH / 2), tile.y);
                this.setScale(MazeSceneHelper.WALL_THIN_SCALE, MazeSceneHelper.WALL_WIDE_SCALE);
                break;
            default:
                throw Error('Direction Not Valid: ' + exitPosition);
        }
        return this;
    }

    public getExitPosition(): C4 {
        return this.exitPosition;
    }

    private getName(): string {
        return this.pairedTileName + '@wall[' + this.getExitPosition() + ']';
    }
}
