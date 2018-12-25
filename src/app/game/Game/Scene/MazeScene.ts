import {MazeGame} from '../MazeGame';
import {MazeNode, C4} from 'cm-maze';
import {GroupMap} from '../GameObjects/GroupMap';
import {TileSprite} from '../GameObjects/Sprite/Setting/TileSprite';
import {MazeSceneHelper} from './MazeSceneHelper';
import {HeroSprite} from '../GameObjects/Sprite/Actor/HeroSprite';
import {MonsterSprite} from '../GameObjects/Sprite/Actor/Character/MonsterSprite';
import {WallSprite} from '../GameObjects/Sprite/Setting/WallSprite';

export class MazeScene extends Phaser.Scene {

    public get tiles(): GroupMap<TileSprite> {
        return this.data.get('tiles');
    }

    public set tiles(value: GroupMap<TileSprite>) {
        this.data.set('tiles', value);
    }

    public get walls(): GroupMap<WallSprite> {
        return this.data.get('walls');
    }

    public set walls(value: GroupMap<WallSprite>) {
        this.data.set('walls', value);
    }

    public get monsters(): GroupMap<MonsterSprite> {
        return this.data.get('monsters');
    }

    public set monsters(value: GroupMap<MonsterSprite>) {
        this.data.set('monsters', value);
    }

    private isControlsLocked = false;
    private isProcessingTurn = false;

    private monstersProcessingTurns: MonsterSprite[];

    private cameraZoom: number;

    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private zoomInKey: Phaser.Input.Keyboard.Key;
    private zoomOutKey: Phaser.Input.Keyboard.Key;
    private turnKey: Phaser.Input.Keyboard.Key;

    init() {
        this.tiles = new GroupMap(this);
        this.walls = new GroupMap(this);
        this.monsters = new GroupMap(this);
        this.monstersProcessingTurns = [];
        this.cameraZoom = .5;
    }

    preload() {
        this.load.image('floor1', 'resource/floor/tile-floor.gif');
        this.load.image('wall1', 'resource/wall/wall1.png');
        this.load.image('boulder2', 'resource/boulder/boulder2.png');
        this.load.image('boulder3', 'resource/boulder/boulder3.png');

        this.load.multiatlas('gernard', 'resource/monster/gernard/gernard.json', 'resource/monster/gernard/');
        this.load.multiatlas('bug3', 'resource/monster/Bug3/bug.json', 'resource/monster/Bug3/');
    }

    create() {
        this.createTilesAndWalls();
        this.createStartAndFinishIndicators();

        Phaser.Actions.SetScale(this.tiles.getChildren(), MazeSceneHelper.TILE_SCALE);
        Phaser.Actions.SetDepth(this.tiles.getChildren(), MazeSceneHelper.TILE_DEPTH);
        Phaser.Actions.SetDepth(this.walls.getChildren(), MazeSceneHelper.WALL_DEPTH);

        // Create Keyboard Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey('z');
        this.zoomOutKey = this.input.keyboard.addKey('q');

        this.turnKey = this.input.keyboard.addKey('space');

        // Create Monster
        const tile = MazeSceneHelper.getRandomTile(this.tiles);
        let monster = new MonsterSprite(this, tile.x, tile.y, 'gernard', 'Gernard-0.png');
        tile.monsters.add(monster.texture.key, monster);
        this.monsters.add(monster, true, 'gernard');
        this.monsters.setDepth(1001, 1);

        monster = (<MonsterSprite>this.monsters.getChildren()[0]);

        monster.loadAnimationFrames(
            'Gernard-',
            '.png',
            'gernard',
            0, 3
        );

        const animation = this.anims.create({
            key: 'gernard-walk',
            frames: monster.frameNames,
            frameRate: 3,
            repeat: -1
        });

        monster.setScale(1);

    }

    update() {

        if (!this.isProcessingTurn) {

            if (!this.isControlsLocked) {
                this.doAllCameraControls();
                this.doPlayerCommands();
                return;
            }
        } else {
            this.processTurn();
        }

    }

    private doPlayerCommands() {

        if (this.turnKey.isDown) {
            this.isControlsLocked = true;
            this.isProcessingTurn = true;
            Phaser.Actions.Call(this.tiles.getChildren(), (tile: TileSprite) => {
                Phaser.Actions.Call(tile.monsters.toArray(), (monster: MonsterSprite) => {
                    this.monstersProcessingTurns.push(monster);
                    monster.walkRandom(tile);
                    monster.anims.play('gernard-walk');
                }, this);
            }, this);
        }
    }

    private processTurn() {
        this.isProcessingTurn = true;

        if (this.monstersProcessingTurns.length === 0) {
            this.isProcessingTurn = false;
            this.isControlsLocked = false;
            return;
        }

        this.monstersProcessingTurns.forEach((monster, index) => {
            switch (monster.turnDirection) {
                case C4.N:
                    monster.y -= 0.1;
                    break;
                case C4.E:
                    monster.x += 0.1;
                    break;
                case C4.S:
                    monster.y += 0.1;
                    break;
                case C4.W:
                    monster.x -= 0.1;
                    break;
                default: break;
            }

            if (monster.x === monster.targetTile.x && monster.y === monster.targetTile.y) {
                this.monstersProcessingTurns.splice(index, 1);
            }
        });
    }

    /**
     * Create the walls and tiles for the maze.  Walls are created with tiles, but not strictly bound, so they both get their own grouping.
     */
    private createTilesAndWalls() {
        MazeGame.getInstance().getMaze().forEachNode((node: MazeNode) => {
            // Derive new location from maze node, invoke new Tile (and wall) sprites.
            const location = MazeSceneHelper.getInstance().nodeToPixel2D(node);
            const tileSprite = new TileSprite(this, location.x, location.y, 'floor1', node);

            // Add tile and wall sprites to scene collection.
            this.tiles.add(tileSprite, true, tileSprite.name);
            tileSprite.getExistingWalls().forEach(wall => this.walls.add(wall, true, wall.name));
        });
    }


    /**
     *  Temporary method to print the start and finish indicators on the map
     */
    private createStartAndFinishIndicators() {

        const finishPoint = MazeSceneHelper.getInstance().nodeToPixel2D(MazeGame.getInstance().getMaze().getFinishNode());
        this['finishBoulder'] = this.add.sprite(finishPoint.x, finishPoint.y, 'boulder3');
        this['finishBoulder'].depth = MazeSceneHelper.ACTOR_DEPTH;
        this['finishBoulder'].setScale(MazeSceneHelper.GLOBAL_SCALE);
    }

    /**
     * Proces camera controls.  Designed for calls from the scene update loop.
     */
    private doAllCameraControls() {
        this.doCameraScroll();
        this.doCameraZoom();
    }

    /**
     * Process camera scrolling inputs
     */
    private doCameraScroll() {
        if (this.cursors.up.isDown) {
            this.cameras.main.scrollY -= MazeSceneHelper.CAMERA_SCROLL_RATE;
        }
        if (this.cursors.down.isDown) {
            this.cameras.main.scrollY += MazeSceneHelper.CAMERA_SCROLL_RATE;
        }
        if (this.cursors.left.isDown) {
            this.cameras.main.scrollX -= MazeSceneHelper.CAMERA_SCROLL_RATE;
        }
        if (this.cursors.right.isDown) {
            this.cameras.main.scrollX += MazeSceneHelper.CAMERA_SCROLL_RATE;
        }
    }

    /**
     * Process camera scroll inputs.
     */
    private doCameraZoom() {

        if (this.zoomInKey.isDown) {
            this.cameraZoom += MazeSceneHelper.CAMERA_ZOOM_INCREMENT;
        }

        if (this.zoomOutKey.isDown) {
            this.cameraZoom -= MazeSceneHelper.CAMERA_ZOOM_INCREMENT;
        }

        this.cameraZoom = Phaser.Math.Clamp(
            this.cameraZoom,
            MazeSceneHelper.CAMERA_MIN_ZOOM,
            MazeSceneHelper.CAMERA_MAX_ZOOM
        );

        this.cameras.main.setZoom(this.cameraZoom);
    }
}

