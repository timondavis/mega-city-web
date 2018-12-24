import {MazeGame} from '../MazeGame';
import {MazeNode, C4} from 'cm-maze';
import {GroupMap} from '../GameObjects/GroupMap';
import {HeroService} from '../../Actors/HeroService';
import {TileSprite} from '../GameObjects/Sprite/Setting/TileSprite';
import {HeroSprite} from '../GameObjects/Sprite/HeroSprite';
import {MazeSceneHelper} from './MazeSceneHelper';
export class MazeScene extends Phaser.Scene {

    private tiles: GroupMap;
    private walls: GroupMap;
    private hero: HeroSprite;

    private zoomLevel = 1;

    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private zoomInKey: Phaser.Input.Keyboard.Key;
    private zoomOutKey: Phaser.Input.Keyboard.Key;


    init() {
      this.tiles = new GroupMap(this);
      this.walls = new GroupMap(this);
    }

    preload() {
        this.load.image( 'floor1', 'resource/floor/tile-floor.gif' );
        this.load.image( 'wall1', 'resource/wall/wall1.png' );
        this.load.image( 'boulder2', 'resource/boulder/boulder2.png' );
        this.load.image( 'boulder3', 'resource/boulder/boulder3.png' );

        this.load.spritesheet( 'hero-up', 'resource/actor/player/player1up_strip16.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet( 'hero-left', 'resource/actor/player/player1left_strip16.png', { frameWidth: 32, frameHeight: 32 } );
        this.load.spritesheet( 'hero-down', 'resource/actor/player/player1down_strip16.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet( 'hero-right', 'resource/actor/player/player1right_strip16.png', { frameWidth: 32, frameHeight: 32 } );
    }

    create() {
        this.createTilesAndWalls();
        this.createStartAndFinishIndicators();

        Phaser.Actions.SetScale( this.tiles.getChildren(), MazeSceneHelper.TILE_SCALE );
        Phaser.Actions.SetDepth( this.tiles.getChildren(), MazeSceneHelper.TILE_DEPTH );
        Phaser.Actions.SetDepth( this.walls.getChildren(), MazeSceneHelper.WALL_DEPTH );

        // Create hero and put in start node
        const startPosition = MazeSceneHelper.getInstance().nodeToPixel2D(MazeGame.getInstance().getMaze().getStartNode());
        this.hero = <HeroSprite>this.add.sprite( startPosition.x, startPosition.y, 'hero-down', 1 );
        this.hero.setScale(MazeSceneHelper.GLOBAL_SCALE);
        this.hero.Model = HeroService.GenerateRandom();
        this.hero.setDepth(MazeSceneHelper.ACTOR_DEPTH);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.zoomInKey = this.input.keyboard.addKey('z');
        this.zoomOutKey = this.input.keyboard.addKey('q');

    }

    update() {

        // Camera Scroll Speed
        const scrollSpeed = 5;

        if (this.cursors.up.isDown) {
          this.cameras.main.scrollY -= scrollSpeed;
        }
        if (this.cursors.down.isDown) {
          this.cameras.main.scrollY += scrollSpeed;
        }
        if (this.cursors.left.isDown) {
          this.cameras.main.scrollX -= scrollSpeed;
        }
        if (this.cursors.right.isDown) {
          this.cameras.main.scrollX += scrollSpeed;
        }

        let newZoomLevel = this.zoomLevel;
        if (this.zoomInKey.isDown ) {
          newZoomLevel += .01;
        }
        if (this.zoomOutKey.isDown) {
          newZoomLevel -= .01;
        }
        this.zoomLevel = Phaser.Math.Clamp(newZoomLevel, 0.5, 2);

        this.cameras.main.setZoom(this.zoomLevel);
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


    private createStartAndFinishIndicators() {

      const finishPoint = MazeSceneHelper.getInstance().nodeToPixel2D(MazeGame.getInstance().getMaze().getFinishNode());
      this['finishBoulder'] = this.add.sprite( finishPoint.x, finishPoint.y, 'boulder3' );
      this['finishBoulder'].depth = MazeSceneHelper.ACTOR_DEPTH;
      this['finishBoulder'].setScale(MazeSceneHelper.GLOBAL_SCALE);
    }
}

