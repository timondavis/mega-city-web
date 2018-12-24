import {MazeGame} from '../MazeGame';
import {MazeNode, C4} from 'cm-maze';
import {GroupMap} from '../GameObjects/GroupMap';
import {HeroService} from '../../Actors/HeroService';
import {MazeService} from '../MazeService';
import {TileSprite} from '../GameObjects/Sprite/Setting/TileSprite';
import {HeroSprite} from '../GameObjects/Sprite/HeroSprite';
export class MazeScene extends Phaser.Scene {

    private tiles: GroupMap;
    private walls: GroupMap;
    private hero: HeroSprite;

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

        Phaser.Actions.SetScale(this.tiles.getChildren(), .24);
        Phaser.Actions.SetDepth(this.tiles.getChildren(), 0);
        Phaser.Actions.SetDepth(this.walls.getChildren(), 100 );

        // Create hero and put in start node
        const startPosition = MazeService.getInstance().nodeToPixel2D(MazeGame.getInstance().getMaze().getStartNode());
        this.hero = <HeroSprite>this.add.sprite( startPosition.x, startPosition.y, 'hero-down', 1 );
        this.hero.Model = HeroService.GenerateRandom();
        this.hero.setDepth(1000);
    }

    update() {
    }

  /**
   * Create the walls and tiles for the maze.  Walls are created with tiles, but not strictly bound, so they both get their own grouping.
   */
  private createTilesAndWalls() {
        MazeGame.getInstance().getMaze().forEachNode((node: MazeNode) => {
          // Derive new location from maze node, invoke new Tile (and wall) sprites.
          const location = MazeService.getInstance().nodeToPixel2D(node);
          const tileSprite = new TileSprite(this, location.x, location.y, 'floor1', node);

          // Add tile and wall sprites to scene collection.
          this.tiles.add(tileSprite, true, tileSprite.getName());
          tileSprite.getWalls().forEach(wall => this.walls.add(wall, true, wall.getName()));
        });
    }


    private createStartAndFinishIndicators() {

      const finishPoint = MazeService.getInstance().nodeToPixel2D(MazeGame.getInstance().getMaze().getFinishNode());
      this['finishBoulder'] = this.add.sprite( finishPoint.x, finishPoint.y, 'boulder3' );
      this['finishBoulder'].depth = 100;
    }
}

