import {Game} from '../Game';
import {MazeNode, C4} from 'cm-maze';
import {GroupMap} from '../../GameObjects/GroupMap';
import {HeroService} from '../../Actors/HeroService';
import {Hero} from '../../Actors/Hero';
export class MazeScene extends Phaser.Scene {

    private tiles: GroupMap;
    private walls: GroupMap;
    private hero: Hero;

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
        this.createStartAndFinishIndicators();
        this.createTilesAndWalls();

        Phaser.Actions.SetScale(this.tiles.getChildren(), .24);
        Phaser.Actions.SetDepth(this.tiles.getChildren(), 0);
        Phaser.Actions.SetDepth(this.walls.getChildren(), 100 );

        // Create hero and put in start node
        const startNode = Game.Instance.Maze.getStartNode();
        this.hero = <Hero>this.add.sprite(
          startNode.getLocation().position[0] * 32 + 16,
          startNode.getLocation().position[1] * 32 + 16,
        'hero-down', 1 );
        this.hero.Model = HeroService.GenerateRandom();
        this.hero.setDepth(1000);
    }

    update() {
    }

  /**
   * Create the walls and tiles for the maze
   */
  private createTilesAndWalls() {
      Game.Instance.Maze.forEachNode((node: MazeNode) => {
        const spriteName = 'mazeNode@' + '[' + node.getLocation().position.toString() + ']';

        this.createTile(node, spriteName);
        this.createWallsForTile(node, spriteName);
      });
    }

  /**
   * Create a tile (sprite) and add it to the scene, based on the maze node passed in.
   * @param node
   * @param spriteName
   */
    private createTile(node: MazeNode, spriteName: string) {
      let tile: Phaser.GameObjects.Sprite;
      tile = this.add.sprite(
        node.getLocation().position[0] * 32 + 16,
        node.getLocation().position[1] * 32 + 16,
        'floor1'
      );
      tile.name = spriteName;
      this.tiles.add(tile, true, tile.name);
    }

  /**
   * Given a tile sprite, creaate and add the wall sprites to suit it (based on MazeNode)
   * @param node
   * @param spriteName
   */
    private createWallsForTile(node: MazeNode, spriteName: string) {
      node.getOpenConnectionPoints().forEach((value) => {
        const tileCenter = <Phaser.GameObjects.Sprite>this.tiles.getByName(spriteName);
        const wallName = spriteName + '@wall[' + value + ']';
        const smallSideScale = 0.1;
        let wall: Phaser.GameObjects.Sprite;
        switch (value) {
          case (C4.NORTH):
            wall = this.createWall( tileCenter.x, tileCenter.y - 16, value, 'wall1' );
            break;
          case (C4.EAST):
            wall = this.createWall(tileCenter.x + 16, tileCenter.y, value,  'wall1' );
            break;
          case (C4.SOUTH):
            wall = this.createWall( tileCenter.x, tileCenter.y + 16, value,  'wall1' );
            break;
          case (C4.WEST):
            wall = this.createWall(tileCenter.x - 16, tileCenter.y, value, 'wall1' );
            break;
          default:
            throw Error('Direction Not Valid: ' + value);
        }

        wall.name = wallName;
        this.walls.add(wall, true, wall.name);
      });
    }

    private createWall(x: number, y: number, direction: C4, textureName: string): Phaser.GameObjects.Sprite {
      const smallSideScale = 0.1;
      const wall = this.add.sprite(x, y, textureName);
      if (direction === C4.NORTH || direction === C4.SOUTH ) {
        wall.setScale(1, smallSideScale);
      } else {
        wall.setScale( smallSideScale, 1 );
      }
      return wall;
    }


    private createStartAndFinishIndicators() {

      const finishNode = Game.Instance.Maze.getFinishNode();

      this['finishBoulder'] = this.add.sprite(
        finishNode.getLocation().position[0] * 32 + 16,
        finishNode.getLocation().position[1] * 32 + 16,
        'boulder3'
      );
      this['finishBoulder'].depth = 100;
    }
}

