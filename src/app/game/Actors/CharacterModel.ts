import { Character } from 'cm-dungeon';
export class CharacterModel extends Character {

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

    public Sprite: Phaser.GameObjects.Sprite;

    public static get CoreAttributes() { return CharacterModel.coreAttributes; }
    public static get PrimaryAttributes() { return CharacterModel.primaryAttributes; }

    constructor() {
        super();
        this.InitializeAttributes();
    }

    private InitializeAttributes() {

        Object.keys(CharacterModel.PrimaryAttributes).forEach((key) => {
            this.attributes.add( (<any>CharacterModel.PrimaryAttributes)[key], 0 );
        });

        Object.keys(CharacterModel.CoreAttributes).forEach((key) => {
            this.attributes.add( (<any>CharacterModel.CoreAttributes)[key], 0 );
        });
    }
}
