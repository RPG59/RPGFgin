import { Mesh } from "./mesh";
import { Renderer } from "./renderer";

export class RenderableObject {
  constructor(public meshes: Mesh[] = [], public material) {}

  render() {
    const shader = this.material.getShader();

    this.meshes.forEach((mesh, i) => {
      this.updateModelMatrix(mesh);
      mesh.render(shader, this.material.renderMode);
    });
  }

  updateModelMatrix(mesh: Mesh) {
    this.material
      .getShader()
      .setUniformMatrix4f("u_modelMatrix", mesh.getModelMatrix().elements);
  }
}
