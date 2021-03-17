import { RenderableObject } from "./RenderableObject";

export class Scene {
    constructor(public renderableObjects: RenderableObject[] = []) {
    }

    push(obj: RenderableObject) {
        this.renderableObjects.push(obj);
    }
}
