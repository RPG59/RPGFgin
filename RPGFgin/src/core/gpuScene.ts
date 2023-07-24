import { GpuMesh } from "./gpuMesh";
import { Scene } from "./scene";

export class GPUScene {
  gpuMeshesMap = new Map<string, GpuMesh>();

  constructor(scene: Scene, layout: GPUBindGroupLayout) {
    for (const mesh of scene.meshes) {
      this.gpuMeshesMap.set(mesh.id, new GpuMesh(mesh, layout));
    }
  }
}
