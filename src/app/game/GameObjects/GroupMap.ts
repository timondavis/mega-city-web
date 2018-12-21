import { NameMap } from 'cm-dungeon';
import GameObject = Phaser.GameObjects.GameObject;
export class GroupMap extends Phaser.GameObjects.Group {
  private _map: NameMap<GameObject>;

  public constructor(scene: Phaser.Scene, children?: Phaser.GameObjects.GameObject[] | GroupConfig | GroupCreateConfig,
                     config?: GroupConfig | GroupCreateConfig) {
    super(scene, children, config);
    this._map = new NameMap();
  }

  public add(child: GameObject, addToScene?: boolean, name?: string): Phaser.GameObjects.Group {
    const group = super.add(child, addToScene);
    if (name) {
      this._map.add(name, child);
    }
    return group;
  }

  /**
   * If a given child was mapped, get it here by name.
   * @param name
   * @return {GameObject}
   */
  public getByName(name: string): GameObject {
    return this._map.get(name);
  }
}
