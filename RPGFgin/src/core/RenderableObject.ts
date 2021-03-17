import { Mesh } from "./mesh";

export class RenderableObject {

    constructor(public meshes: Mesh[] = [], public material) {
    }
}
