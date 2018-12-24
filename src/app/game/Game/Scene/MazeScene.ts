import {MazeGame} from '../MazeGame';
import {MazeNode} from 'cm-maze';
import {GroupMap} from '../GameObjects/GroupMap';
import {HeroService} from '../../Actors/HeroService';
import {TileSprite} from '../GameObjects/Sprite/Setting/TileSprite';
import {MazeSceneHelper} from './MazeSceneHelper';
import {HeroSprite} from '../GameObjects/Sprite/Actor/HeroSprite';

export class MazeScene extends Phaser.Scene {

    private tiles: GroupMap;
    private walls: GroupMap;
    private monsters: GroupMap;
    private hero: HeroSprite;

    private cameraZoom: number;

    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private zoomInKey: Phaser.Input.Keyboard.Key;
    private zoomOutKey: Phaser.Input.Keyboard.Key;

    init() {
        this.tiles = new GroupMap(this);
        this.walls = new GroupMap(this);
        this.monsters = new GroupMap(this);
        this.cameraZoom = 1;
    }

    preload() {
        this.load.image('floor1', 'resource/floor/tile-floor.gif');
        this.load.image('wall1', 'resource/wall/wall1.png');
        this.load.image('boulder2', 'resource/boulder/boulder2.png');
        this.load.image('boulder3', 'resource/boulder/boulder3.png');

        this.load.spritesheet('hero-up', 'resource/actor/player/player1up_strip16.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hero-left', 'resource/actor/player/player1left_strip16.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hero-down', 'resource/actor/player/player1down_strip16.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hero-right', 'resource/actor/player/player1right_strip16.png', {frameWidth: 32, frameHeight: 32});
    }

    create() {
        this.createTilesAndWalls();
        this.createStartAndFinishIndicators();

        Phaser.Actions.SetScale(this.tiles.getChildren(), MazeSceneHelper.TILE_SCALE);
        Phaser.Actions.SetDepth(this.tiles.getChildren(), MazeSceneHelper.TILE_DEPTH);
        Phaser.Actions.SetDepth(this.walls.getChildren(), MazeSceneHelper.WALL_DEPTH);

        // Create hero and put in start node
        const startPosition = MazeSceneHelper.getInstance().nodeToPixel2D(MazeGame.getInstance().getMaze().getStartNode());
        this.hero = <HeroSprite>this.add.sprite(startPosition.x, startPosition.y, 'hero-down', 1);
        this.hero.setScale(MazeSceneHelper.GLOBAL_SCALE);
        this.hero.actor = HeroService.GenerateRandom();
        this.hero.setDepth(MazeSceneHelper.ACTOR_DEPTH);

        // Create Keyboard Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey('z');
        this.zoomOutKey = this.input.keyboard.addKey('q');
    }

    update() {

       this.doAllCameraControls();
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
            this.tiles.add(tileSprite, true, tileSprite.getName());
            tileSprite.getWalls().forEach(wall => this.walls.add(wall, true, wall.getName()));
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

