import { Mesh } from "../../RPGFgin/src/core/mesh";
import { Shader } from "../../RPGFgin/src/core/shader";
import { gl } from "../../RPGFgin/src/main";
import { vec3 } from "../../RPGFgin/src/math/vec3";

enum LineUniform {
  StartPoint = "u_startPoint",
  EndPoint = "u_endPoint",
}

export class LineMesh extends Mesh {
  startPoint: vec3;
  endPoint: vec3;

  constructor(startPoint: vec3) {
    super(
      new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
      new Uint32Array([0, 1, 2, 2, 1, 3])
    );

    this.startPoint = startPoint;
    this.endPoint = startPoint;
  }

  render(shader: Shader, renderMode: number): void {
    shader.setUniform3(LineUniform.StartPoint, this.startPoint);
    shader.setUniform3(LineUniform.EndPoint, this.endPoint);

    gl.bindVertexArray(this.VAO);
    gl.drawElements(renderMode, this.numIndices, gl.UNSIGNED_INT, 0);
  }
}
