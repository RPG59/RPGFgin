import { GPUShader } from "../platform/webgpu/gpuShader";

export class Material {
  constructor(private shader: GPUShader) {}

  getShader(): GPUShader {
    return this.shader;
  }
}
