import { Mesh } from "../../RPGFgin/src/core/mesh";
import { Shader } from "../../RPGFgin/src/core/shader";
import { gl } from "../../RPGFgin/src/main";

export class LineMesh extends Mesh {
  constructor() {
    super(
      new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
      new Uint32Array([0, 1, 2, 2, 1, 3])
    );
  }

  render(shader: Shader, renderMode: number): void {
    gl.bindVertexArray(this.VAO);
    gl.drawElements(renderMode, this.numIndices, gl.UNSIGNED_INT, 0);
  }
}
