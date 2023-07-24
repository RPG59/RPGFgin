import { GPUContext } from "./gpuContext";

export class GPUShader {
  private shader: GPUShaderModule;
  private pipeline: GPURenderPipeline;
  private bindGroup: GPUBindGroup;
  private pipelineLayout: GPUPipelineLayout;
  private bindGroupLayout: GPUBindGroupLayout;

  constructor(code: string, vertexBuffers: GPUVertexBufferLayout[]) {
    this.shader = GPUContext.getDevice().createShaderModule({
      code,
    });

    // this.bindGroupLayout = GPUContext.getDevice().createBindGroupLayout({
    //   entries: [
    //     {
    //       binding: 0, // camera uniforms
    //       visibility: GPUShaderStage.VERTEX,
    //       buffer: {},
    //     },
    //     {
    //       binding: 1,
    //       visibility: GPUShaderStage.FRAGMENT,
    //       sampler: {},
    //     },
    //     {
    //       binding: 2,
    //       visibility: GPUShaderStage.FRAGMENT,
    //       texture: {},
    //     },
    //   ],
    // });

    // this.pipelineLayout = GPUContext.getDevice().createPipelineLayout({
    //   bindGroupLayouts: [this.bindGroupLayout],
    // });

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
        cullMode: "none", // front and back
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
      // layout: this.pipelineLayout,
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

  createBindGroup(entries: GPUBindGroupEntry[]) {
    const layout = this.pipeline.getBindGroupLayout(0);

    this.bindGroup = GPUContext.getDevice().createBindGroup({
      // FIXME: dont use auto layout!
      layout,
      entries,
    });
  }

  getBindGroup(): GPUBindGroup {
    return this.bindGroup;
  }
}
