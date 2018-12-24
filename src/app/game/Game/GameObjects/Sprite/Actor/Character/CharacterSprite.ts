import {ActorSprite} from '../ActorSprite';
import {Character} from 'cm-dungeon';

export abstract class CharacterSprite extends ActorSprite {
    public actor: Character;
}
