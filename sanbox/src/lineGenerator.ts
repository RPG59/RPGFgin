import { Material } from "../../RPGFgin/src/core/material";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Shader } from "../../RPGFgin/src/core/shader";
import { gl } from "../../RPGFgin/src/main";
import { Camera } from "../../RPGFgin/src/core/camera";
import { vec3 } from "../../RPGFgin/src/math/vec3";
import { Mesh } from "../../RPGFgin/src/core/mesh";

export class LineGenerator extends RenderableObject {
  camera: Camera;
  meshes: Mesh[];

  constructor(shader: Shader, camera: Camera) {
    super([], new Material(shader, gl.LINES));
    this.camera = camera;
  }

  updateLine(intersectionPoint: vec3) {
    if (!this.meshes.length) {
      return;
    }

    const index = this.meshes.length - 1;
    const vertices = this.meshes[index].vertices;

    vertices[3] = intersectionPoint.x;
    vertices[4] = intersectionPoint.y;
    vertices[5] = intersectionPoint.z;

    this.meshes[index].VBO.updateBufferData(vertices);
  }

  render() {
    const shader = this.material.getShader();

    this.meshes.forEach((mesh) => {
      this.updateModelMatrix(mesh);
      mesh.render(shader, this.material.renderMode);
    });
  }

  createLine(point: vec3) {
    const vertices = point.toArray().concat(point.toArray());
    const indices = [0, 1, 0, 1];
    const mesh = new Mesh(new Float32Array(vertices), new Uint32Array(indices));

    mesh.allowIntersections = false;

    this.meshes.push(mesh);
  }
}
