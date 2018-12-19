import { Character } from 'cm-dungeon';
export class HeroModel extends Character {

    private static coreAttributes = {
        'STR' : 'Strength',
        'DEX' : 'Dexterity',
        'CON' : 'Constitution',
        'WIS' : 'Wisdom',
        'INT' : 'Intelligence',
        'CHA' : 'Charisma'
    };

    private static primaryAttributes = {
        'HP' : 'Hit Points',
        'MAX_HP' : 'Maximum Hit Points',
        'AC' : 'Armor Class'
    };

    public static get CoreAttributes() { return HeroModel.coreAttributes; }
    public static get PrimaryAttributes() { return HeroModel.primaryAttributes; }

    constructor() {
        super();
        this.InitializeAttributes();
    }

    private InitializeAttributes() {

        Object.keys(HeroModel.PrimaryAttributes).forEach((key) => {
            this.attributes.add( (<any>HeroModel.PrimaryAttributes)[key], 0 );
        });

        Object.keys(HeroModel.CoreAttributes).forEach((key) => {
            this.attributes.add( (<any>HeroModel.CoreAttributes)[key], 0 );
        });
    }
}