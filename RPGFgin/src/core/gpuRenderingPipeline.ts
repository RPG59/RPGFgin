import { GPUShader } from "../platform/webgpu/gpuShader";

//@ts-ignore
import GPUShaderData from "../../../RPGFgin/shaders/default.wgsl";
import { GPUContext } from "../platform/webgpu/gpuContext";

const vertexBuffers: GPUVertexBufferLayout[] = [
  {
    attributes: [
      {
        shaderLocation: 0, // position
        offset: 0,
        format: "float32x3",
      },
      {
        shaderLocation: 1, // uv
        offset: 3 * 4,
        format: "float32x2",
      },
    ],
    arrayStride: 3 * 4 + 2 * 4,
    stepMode: "vertex",
  },
];

export class GPURenderingPipeline {
  shader: GPUShader;

  constructor() {
    this.shader = new GPUShader(GPUShaderData, vertexBuffers);
  }
}
