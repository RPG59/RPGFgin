import { Material } from "../../RPGFgin/src/core/material";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Shader } from "../../RPGFgin/src/core/shader";
import { gl } from "../../RPGFgin/src/main";
import { Camera } from "../../RPGFgin/src/core/camera";
import { Mesh } from "../../RPGFgin/src/core/mesh";
import { vec3 } from "../../RPGFgin/src/math/vec3";

export class LineGenerator extends RenderableObject {
  camera: Camera;

  constructor(shader: Shader, camera: Camera) {
    super([], new Material(shader, gl.LINES));
    this.camera = camera;
  }

  updateLine(intersectionPoint) {
    if (!this.meshes.length) {
      return;
    }

    const index = this.meshes.length - 1;
    const vertices = new Float32Array([
      ...this.meshes[index].vertices.slice(0, 3),
      intersectionPoint.x,
      intersectionPoint.y,
      intersectionPoint.z,
    ]);

    this.meshes[index].VBO.updateBufferData(vertices);
  }

  render() {
    // this.updateModelMatrix(mesh);
    const shader = this.material.getShader();

    this.meshes.forEach((mesh) => {
      this.updateModelMatrix(mesh);
      mesh.render(shader, this.material.renderMode);
    });
  }

  createLine(point: vec3) {
    const mesh = new Mesh(
      new Float32Array([point.x, point.y, point.z, point.x, point.y, point.z]),
      new Uint16Array([0, 1])
    );

    mesh.allowIntersections = false;

    this.meshes.push(mesh);
  }
}
