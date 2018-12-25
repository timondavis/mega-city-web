import { NameMap } from 'cm-dungeon';
import GameObject = Phaser.GameObjects.GameObject;

/**
 * @class
 * Extends the Phaser Group, while adding some custom management properties and local methods.
 * Keeps a named map of all sprites in the group for quick reference.
 */
export class GroupMap<E extends GameObject> extends Phaser.GameObjects.Group {
  private map: NameMap<E>;

  public constructor(scene: Phaser.Scene, children?: Phaser.GameObjects.GameObject[] | GroupConfig | GroupCreateConfig,
                     config?: GroupConfig | GroupCreateConfig) {
    super(scene, children, config);
    this.map = new NameMap();
  }

  public add(child: GameObject, addToScene?: boolean, name?: string): Phaser.GameObjects.Group {
    const group = super.add(child, addToScene);
    if (name) {
      this.map.add(name, (<E>child));
    }
    return group;
  }

  /**
   * If a given child was mapped, get it here by name.
   * @param name
   * @return {GameObject}
   */
  public getByName(name: string): GameObject {
    return this.map.get(name);
  }
}
