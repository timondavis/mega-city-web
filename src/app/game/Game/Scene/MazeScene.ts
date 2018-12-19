import {Game} from '../Game';
import {MazeNode, C4} from 'cm-maze';
export class MazeScene extends Phaser.Scene {

    preload() {
        this.load.image( 'floor1', 'resource/floor/tile-floor.gif' );
        this.load.image( 'wall1', 'resource/wall/wall1.png' );
        this.load.image( 'boulder2', 'resource/boulder/boulder2.png' );
        this.load.image( 'boulder3', 'resource/boulder/boulder3.png' );
    }

    create() {
        const startNode = Game.Instance.Maze.getStartNode();
        const finishNode = Game.Instance.Maze.getFinishNode();

        this['startBoulder'] = this.add.sprite(
          startNode.getLocation().position[0] * 32 + 16,
          startNode.getLocation().position[1] * 32 + 16,
          'boulder2'
        );
        this['startBoulder'].depth = 100;

        this['finishBoulder'] = this.add.sprite(
          finishNode.getLocation().position[0] * 32 + 16,
          finishNode.getLocation().position[1] * 32 + 16,
          'boulder3'
        );
      this['finishBoulder'].depth = 100;

        Game.Instance.Maze.forEachNode((node: MazeNode) => {
          const spriteName = 'mazeNode@' + '[' + node.getLocation().position.toString() + ']';

          this[spriteName] = this.add.sprite(
            node.getLocation().position[0] * 32 + 16,
            node.getLocation().position[1] * 32 + 16,
            'floor1'
          );
          this[spriteName].setScale(0.24);

          node.getOpenConnectionPoints().forEach((value) => {
            const tileCenter = this[spriteName].getCenter();
            const wallName = spriteName + '@wall[' + value + ']';
            const smallSideScale = 0.1;
            switch (value) {
              case (C4.NORTH): {
                this[wallName] = this.add.sprite( tileCenter.x, tileCenter.y - 16, 'wall1' );
                this[wallName].setScale(1, smallSideScale);
                break;
              }
              case (C4.EAST): {
                this[wallName] = this.add.sprite( tileCenter.x + 16, tileCenter.y, 'wall1' );
                this[wallName].setScale(smallSideScale, 1);
                break;
              }
              case (C4.SOUTH): {
                this[wallName] = this.add.sprite( tileCenter.x, tileCenter.y + 16, 'wall1' );
                this[wallName].setScale(1, smallSideScale);
                break;
              }
              case (C4.WEST): {
                this[wallName] = this.add.sprite( tileCenter.x - 16, tileCenter.y, 'wall1' );
                this[wallName].setScale(smallSideScale, 1);
                break;
              }
              default: break;
            }

            this[wallName].depth = 10;
          });
        });
    }

    update() {
    }
}

