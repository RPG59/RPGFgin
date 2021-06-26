import { Material } from "../../RPGFgin/src/core/material";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Shader } from "../../RPGFgin/src/core/shader";
import { gl } from "../../RPGFgin/src/main";
import { vec3 } from "glm-js";
import { Camera } from "../../RPGFgin/src/core/camera";
import { Mesh } from "../../RPGFgin/src/core/mesh";
import { Game } from "./game";
import { normalizeMouseCoords } from "../../RPGFgin/src/utils/convert";

export class LineGenerator extends RenderableObject {
  camera: Camera;

  constructor(shader: Shader, camera: Camera) {
    super([], new Material(shader, gl.LINES));
    this.camera = camera;

    Game.userEvents.addControl({
      onPointerMove: this.onPointerMove,
      onPointerDown: () => {},
      onPointerUp: () => {},
    });
  }

  onPointerMove({ clientX, clientY }) {
    // if (!this.meshes.length) {
    //   return;
    // }
    // const index = this.meshes.length - 1;
    // const mouseCoords = normalizeMouseCoords(clientX, clientY);
    // const vertices = new Float32Array([
    //   ...this.meshes[index].vertices.slice(0, 3),
    // ]);
    // this.meshes[index] = new Mesh(this.meshes[index]);
  }

  render() {
    // this.updateModelMatrix(mesh);
    const shader = this.material.getShader();

    this.meshes.forEach((mesh) => {
      this.updateModelMatrix(mesh);
      mesh.render(shader, this.material.renderMode);
    });
  }

  createLine(intersectionPoint: vec3, normal) {
    const mesh = new Mesh(
      new Float32Array([
        intersectionPoint.x,
        intersectionPoint.y,
        intersectionPoint.z,
        normal.x,
        normal.y,
        normal.z,
        // this.camera.position.x,
        // this.camera.position.y,
        // this.camera.position.z,
      ]),
      new Uint16Array([0, 1])
    );

    mesh.allowIntersections = false;

    this.meshes.push(mesh);
  }
}
