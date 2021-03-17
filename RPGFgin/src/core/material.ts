import { Shader } from "./shader";

export class Material {

    constructor(private shader: Shader) {
    }

    getShader(): Shader {
        return this.shader;
    }
}
