import { GPUContext } from "./gpuContext";

export class GPUShader {
  shader: GPUShaderModule;

  constructor(code: string) {
    this.shader = GPUContext.getDevice().createShaderModule({
      code,
    });
  }
}
