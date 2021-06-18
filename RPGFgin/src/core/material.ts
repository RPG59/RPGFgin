import { gl } from "../main";
import { Shader } from "./shader";

export class Material {
  constructor(private shader: Shader, public renderMode = gl.TRIANGLES) {}

  getShader(): Shader {
    return this.shader;
  }
}
