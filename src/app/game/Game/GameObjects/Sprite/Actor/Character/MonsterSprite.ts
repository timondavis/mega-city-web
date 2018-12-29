import {CharacterSprite} from './CharacterSprite';
import {TileSprite} from '../../Setting/TileSprite';
import {C4} from 'cm-maze';
import {MazeSceneHelper} from '../../../../Scene/MazeSceneHelper';

export class MonsterSprite extends CharacterSprite {

    private _framePrefix: string;
    public get framePrefix(): string { return this.framePrefix; }

    private _frameSuffix: string;
    public get frameSuffix(): string { return this._frameSuffix; }

    private _frameNames: AnimationFrameConfig[];
    public get frameNames(): AnimationFrameConfig[] { return this._frameNames; }

    private _atlasName: string;
    public get atlasName(): string { return this._atlasName; }

    /**
     * Walk in the given direction on the next turn
     * @param currentTile
     * @param direction
     */
    public walk(currentTile: TileSprite, direction: C4): TileSprite {
        if (currentTile.getMazeNode().isConnectionPointOccupied(direction)) {
            const newTile = this.scene.data.get('tiles').getByName(
                'MazeNode@' + currentTile.getMazeNode().getNeighborAt(direction).getName()
            );

            const monsterIndex = currentTile.monsters.indexOf(this);
            currentTile.monsters.splice(monsterIndex, 1);

            const monsterMovement = <any[]>this.scene.data.get('monsterMovement');
            monsterMovement.push({
                oldTile: currentTile,
                newTile: newTile,
                monster: this,
            });

            return newTile;
        }
    }

    /**
     * Walk in a random direction.
     * @param currentTile
     */
    public walkRandom(currentTile: TileSprite): TileSprite {

        const possibleDirections = currentTile.getMazeNode().getOccupiedConnectionPoints();

        if ( possibleDirections.length ) {

            const chosenDirection = Phaser.Math.RND.pick(possibleDirections);
            return this.walk(currentTile, chosenDirection);
        }
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

    public toString(): string {
        return this.texture.key;
    }
}
