import {CharacterSprite} from './CharacterSprite';
import {TileSprite} from '../../Setting/TileSprite';
import {C4} from 'cm-maze';
import {GroupMap} from '../../../GroupMap';

export class MonsterSprite extends CharacterSprite {


    private _framePrefix: string;
    public get framePrefix(): string { return this.framePrefix; }

    private _frameSuffix: string;
    public get frameSuffix(): string { return this._frameSuffix; }

    private _frameNames: AnimationFrameConfig[];
    public get frameNames(): AnimationFrameConfig[] { return this._frameNames; }

    private _atlasName: string;
    public get atlasName(): string { return this._atlasName; }

    private _turnDirection: C4;
    private _targetTile: TileSprite;

    public get turnDirection(): C4 {
        return this._turnDirection;
    }

    public get targetTile(): TileSprite {
        return this._targetTile;
    }

    /**
     * Walk in the given direction on the next turn
     * @param currentTile
     * @param direction
     */
    public walk(currentTile: TileSprite, direction: C4): void {
        if (currentTile.getMazeNode().isConnectionPointOccupied(direction)) {
            this._turnDirection = direction;
            this._targetTile = this.scene.data.get('tiles').getByName(
                'MazeNode@' + currentTile.getMazeNode().getNeighborAt(direction).getName()
            );
        }
    }

    /**
     * Walk in a random direction on the next turn.
     * @param currentTile
     */
    public walkRandom(currentTile: TileSprite): void {
        this.walk(currentTile, Phaser.Math.RND.pick([
            C4.E, C4.W, C4.N, C4.S
        ]));
    }

    public loadAnimationFrames( framePrefix: string, frameSuffix: string, atlasName: string, start: number, stop: number) {
        const texture = this.texture.key;

        this._framePrefix = framePrefix;
        this._frameSuffix = frameSuffix;
        this._atlasName = atlasName;

        // Create monster animation fames
        this._frameNames =  this.scene.anims.generateFrameNames( texture, {
            start: start,
            end: stop,
            prefix: framePrefix,
            suffix: frameSuffix,
        });

    }
}
