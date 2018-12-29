import {MazeNode, C4} from 'cm-maze';
import {WallSprite} from './WallSprite';
import {MazeSceneHelper} from '../../../Scene/MazeSceneHelper';
import {NameMap} from 'cm-dungeon';
import {MonsterSprite} from '../Actor/Character/MonsterSprite';

export class TileSprite extends Phaser.GameObjects.Sprite {

    // get/set maze node
    public get mazeNode(): MazeNode {
        return this.getData('mazeNode');
    }
    public set mazeNode(value: MazeNode) {
        this.setData('mazeNode', value);
    }

    // get/set walls on tile
    public get walls(): WallSprite[] {
        return this.getData('walls');
    }
    public set walls(value: WallSprite[]) {
        this.setData('walls', value);
    }

    // get set name of tile
    public get name(): string {
        return this.getData('name');
    }
    public set name(value: string) {
        this.setData('name', value);
    }

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, mazeNode: MazeNode) {
        super(scene, x, y, texture);
        this.setData('walls', [null, null, null, null]);
        this.setData('mazeNode', mazeNode);
        this.setData('monsters', new Array<MonsterSprite>());
        this.setData('name', this.getName());
        this.setMazeNode(mazeNode);
    }

    public get monsters(): Array<MonsterSprite> {
        return this.data.get('monsters');
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

    private getName(): string {
        return 'MazeNode@' + this.mazeNode.getName();
    }

    public get x(): number {
        return MazeSceneHelper.getInstance().nodeToPixel2D(this.mazeNode).x;
    }

    public get y(): number {
        return MazeSceneHelper.getInstance().nodeToPixel2D(this.mazeNode).y;
    }

    public getExistingWalls(): WallSprite[] {
        return this.walls.filter(x => x !== null);
    }

    private createWalls() {
        this.mazeNode.getOpenConnectionPoints().forEach((directionValue) => {
            this.walls[directionValue] = new WallSprite(this.scene, this.x, this.y, 'wall1', this, directionValue);
        });
    }
}
