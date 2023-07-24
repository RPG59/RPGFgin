import { nanoid } from "nanoid";

import { Mesh } from "./mesh";

export class Scene {
  public id: string;

  constructor(public meshes: Mesh[] = []) {
    this.id = nanoid();
  }

  push(obj: Mesh) {
    this.meshes.push(obj);
  }
}
