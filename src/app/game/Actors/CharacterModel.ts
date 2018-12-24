import { Character } from 'cm-dungeon';
export class CharacterModel extends Character {

    /**
     * Intentionally open JSON so that it can be loaded from an outside source.
     * Properties are integrated into the model properly in the constructor.
     */
    private static coreAttributes = {
        'STR' : 'Strength',
        'DEX' : 'Dexterity',
        'CON' : 'Constitution',
        'WIS' : 'Wisdom',
        'INT' : 'Intelligence',
        'CHA' : 'Charisma'
    };

    /**
     * Intentionally open JSON so that it can be loaded from an outside source.
     * Properties are integrated into the model properly in the constructor.
     */
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
