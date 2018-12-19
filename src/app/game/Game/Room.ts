import { MazeNode } from 'cm-maze';
import { NameMap } from 'cm-dungeon';

export class Room {
  public contents: NameMap<any>;
  public constructor() {
    this.contents = new NameMap();
  }
}
