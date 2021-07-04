import { Material } from "../../RPGFgin/src/core/material";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Shader } from "../../RPGFgin/src/core/shader";
import { gl } from "../../RPGFgin/src/main";
import { Camera } from "../../RPGFgin/src/core/camera";
import { vec3 } from "../../RPGFgin/src/math/vec3";
import { LineMesh } from "./lineMesh";

export class LineGenerator extends RenderableObject {
  camera: Camera;
  meshes: LineMesh[];

  constructor(shader: Shader, camera: Camera) {
    super([], new Material(shader, gl.TRIANGLES));
    this.camera = camera;
  }

  updateLine(intersectionPoint) {
    if (!this.meshes.length) {
      return;
    }

    const index = this.meshes.length - 1;
    this.meshes[index].endPoint = intersectionPoint;
  }

  render() {
    const shader = this.material.getShader();

    this.meshes.forEach((mesh) => {
      this.updateModelMatrix(mesh);
      mesh.render(shader, this.material.renderMode);
    });
  }

  createLine(point: vec3) {
    const mesh = new LineMesh(point);

    mesh.allowIntersections = false;

    this.meshes.push(mesh);
  }
}
