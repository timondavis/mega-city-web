import {MazeGame} from '../MazeGame';
import {MazeNode, C4} from 'cm-maze';
import {GroupMap} from '../GameObjects/GroupMap';
import {TileSprite} from '../GameObjects/Sprite/Setting/TileSprite';
import {MazeSceneHelper} from './MazeSceneHelper';
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

    public get monsterMovement(): any[] {
        return this.data.get('monsterMovement');
    }


    private cameraZoom: number;

    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private zoomInKey: Phaser.Input.Keyboard.Key;
    private zoomOutKey: Phaser.Input.Keyboard.Key;
    private turnKey: Phaser.Input.Keyboard.Key;

    private isProcessingTurn: boolean;

    init() {
        this.tiles = new GroupMap(this);
        this.walls = new GroupMap(this);
        this.monsters = new GroupMap(this);
        this.data.set('monsterMovement', []);
        this.cameraZoom = .5;
    }

    preload() {
        this.load.image('floor1', 'resource/floor/tile-floor.gif');
        this.load.image('wall1', 'resource/wall/wall1.png');
        this.load.image('boulder2', 'resource/boulder/boulder2.png'); this.load.image('boulder3', 'resource/boulder/boulder3.png');

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
        tile.monsters.push(monster);
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
        this.doAllCameraControls();
        this.doPlayerCommands();
    }

    /**
     * Process player commands and inputs.
     */
    private doPlayerCommands() {

        if (this.turnKey.isDown && !this.isProcessingTurn) {
            this.isProcessingTurn = true;
            this.processTurn();
        }
        if (this.turnKey.isUp && this.isProcessingTurn) {
            this.isProcessingTurn = false;
        }
    }

    /**
     * Process the AI turn and execute regular effects, countdowns, etc
     */
    private processTurn() {
        this.doMonsterTurnMovement();
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
     * Process camera controls.  Designed for calls from the scene update loop.
     */
    private doAllCameraControls() {
        this.doCameraScroll();
        this.doCameraZoom();
    }

    /**
     * Process end-of-turn movements for monsters.  Picks them up from one tile and places them
     * on the next.
     */
    private doMonsterTurnMovement(): void {
        Phaser.Actions.Call(this.tiles.getChildren(), (tile: TileSprite) => {
            Phaser.Actions.Call(tile.monsters, (monster: MonsterSprite) => {
                const newTile = monster.walkRandom(tile);
                const newTilePosition = newTile.getMazeNode().getLocation().getPosition();
                console.log(newTile);
                console.log('x: ' + newTilePosition[0] + ', y: ' + newTilePosition[1]);
            }, this);
        }, this);

        Phaser.Actions.Call(this.monsterMovement, (item: any) => {
            const newTile = item.newTile;
            const monster = item.monster;

            const newNode = newTile.getMazeNode();
            const newPosition = MazeSceneHelper.getInstance().nodeToPixel2D(newNode);
            monster.setPosition(newPosition.x, newPosition.y);
            newTile.monsters.push(monster);
        }, this);

        this.clearMonsterMovement();
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

    public clearMonsterMovement(): void {
        this.data.set('monsterMovement', []);
    }
}

