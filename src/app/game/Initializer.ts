import {HeroService} from './Actors/HeroService';
import {HeroModel} from './Actors/HeroModel';
import {MazeBuilder, Maze} from 'cm-maze';
import {Game} from './Game/Game';
import {MazeScene} from './Game/Scene/MazeScene';
export class Initializer {

    public static Initialize(canvasId: string): Game {

      const mazeBuilder = new MazeBuilder();
      const hero = new HeroModel();

      Game.init(canvasId);
      Initializer.createRoomData();
      return Game.Instance;
    }

    private static CreateHero(): HeroModel {
        return HeroService.GenerateRandom();
    }

    private static createRoomData() {
    }
}
