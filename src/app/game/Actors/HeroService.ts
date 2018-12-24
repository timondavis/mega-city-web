import {DieBag} from 'cm-check';
import {CharacterModel} from './CharacterModel';
import {HeroModel} from './HeroModel';
export class HeroService {

    public static GenerateRandom():  HeroModel {
        const hero = new CharacterModel();

        Object.keys(HeroModel.CoreAttributes).forEach((key) => {
            hero.attributes.replace( (<any>CharacterModel.CoreAttributes)[key], HeroService.Roll3d6());
        });

        Object.keys(HeroModel.PrimaryAttributes).forEach((key) => {
            hero.attributes.replace( (<any>CharacterModel.PrimaryAttributes)[key], HeroService.Roll3d6());
        });

        return hero;
    }

    private static Roll3d6(): number {
        const statRoll = new DieBag();

        statRoll.add(3, 6);
        return statRoll.getTotal();
    }
}
