import { HeroModel } from './HeroModel';
import { DieBag } from 'cm-check';
export class HeroService {

    public static GenerateRandom():  HeroModel {
        const hero = new HeroModel();

        Object.keys(HeroModel.CoreAttributes).forEach((key) => {
            hero.attributes.replace( (<any>HeroModel.CoreAttributes)[key], HeroService.Roll3d6());
        });

        Object.keys(HeroModel.PrimaryAttributes).forEach((key) => {
            hero.attributes.replace( (<any>HeroModel.PrimaryAttributes)[key], HeroService.Roll3d6());
        });

        return hero;
    }

    private static Roll3d6(): number {
        const statRoll = new DieBag();

        statRoll.add(3, 6);
        return statRoll.getTotal();
    }
}
