import {HeroService} from './Actors/HeroService';
import {HeroModel} from './Actors/HeroModel';
import {MazeBuilder, Maze} from 'cm-maze';
import {MazeGame} from './Game/MazeGame';
import Game = Phaser.Game;
import {MazeScene} from './Game/Scene/MazeScene';
export class Initializer {

    public static Initialize(canvasId: string) {
      const mazeScene = new MazeScene('MazeScene');
      const game = MazeGame.initialize({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: canvasId,
        scene: [mazeScene]
      });
    }

    private static CreateHero(): HeroModel {
        return HeroService.GenerateRandom();
    }
}
