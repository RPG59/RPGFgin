import { GPUContext } from "./gpuContext";

export class GPUShader {
  private shader: GPUShaderModule;
  private pipeline: GPURenderPipeline;

  constructor(code: string, vertexBuffers: GPUVertexBufferLayout[]) {
    this.shader = GPUContext.getDevice().createShaderModule({
      code,
    });

    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      vertex: {
        module: this.shader,
        entryPoint: "vtx_main",
        buffers: vertexBuffers,
      },
      fragment: {
        module: this.shader,
        entryPoint: "frag_main",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        // cullMode: "front",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
      layout: "auto",
    };

    this.pipeline = GPUContext.getDevice().createRenderPipeline(pipelineDescriptor);
  }

  getShader(): GPUShaderModule {
    return this.shader;
  }

  getPipeline(): GPURenderPipeline {
    return this.pipeline;
  }
}
