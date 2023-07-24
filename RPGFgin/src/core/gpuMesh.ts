import { GPUContext } from "../platform/webgpu/gpuContext";
import { Mesh } from "./mesh";
import { Texture } from "./texture";

export class GpuMesh {
  id: string;
  vertexBuffer: GPUBuffer | undefined;
  indexBuffer: GPUBuffer | undefined;
  bindGroup: GPUBindGroup;

  constructor(mesh: Mesh, layout: GPUBindGroupLayout) {
    this.id = mesh.id;

    this.vertexBuffer = GPUContext.getDevice().createBuffer({
      size: mesh.vertices.byteLength + mesh.texCoords.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });

    const view = new Float32Array(this.vertexBuffer.getMappedRange());

    for (let i = 0; i < mesh.vertices.length / 3; ++i) {
      let bufferCounter = i * 5;
      view[bufferCounter + 0] = mesh.vertices[i * 3 + 0];
      view[bufferCounter + 1] = mesh.vertices[i * 3 + 1];
      view[bufferCounter + 2] = mesh.vertices[i * 3 + 2];
    }

    for (let i = 0; i < mesh.texCoords.length / 2; ++i) {
      let bufferCounter = i * 5 + 3;
      view[bufferCounter + 0] = mesh.texCoords[i * 2 + 0];
      view[bufferCounter + 1] = mesh.texCoords[i * 2 + 1];
    }

    this.vertexBuffer.unmap();

    this.indexBuffer = GPUContext.getDevice().createBuffer({
      size: mesh.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    GPUContext.getDevice().queue.writeBuffer(this.indexBuffer, 0, mesh.indices, 0, mesh.indices.length);

    this.createBindGroup(mesh.getTextures(), layout, mesh.name);
  }

  createBindGroup(textures: Texture[], layout: GPUBindGroupLayout, meshName: string) {
    if (!textures.length) {
      return;
    }

    const sampler = GPUContext.getDevice().createSampler({
      minFilter: "linear",
    });

    this.bindGroup = GPUContext.getDevice().createBindGroup({
      label: `TEXTURE_${meshName}`,
      layout,
      entries: [
        {
          binding: 0,
          resource: textures[0].getTexture().createView(),
        },
        { binding: 1, resource: sampler },
      ],
    });
  }
}
