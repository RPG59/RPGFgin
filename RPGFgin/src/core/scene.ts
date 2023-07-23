import { Mesh } from "./mesh";

export class Scene {
  constructor(public meshes: Mesh[] = []) {}

  push(obj: Mesh) {
    this.meshes.push(obj);
  }
}
