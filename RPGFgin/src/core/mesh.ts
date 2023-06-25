import { Texture } from "./texture";
import { float4x4 } from "../math/float4x4";
import { float3 } from "../math/float3";
import { GPUContext } from "../platform/webgpu/gpuContext";

export enum TEXTURE_TYPES {
  DIFFUSE = "texture_diffuse",
  SPECULAR = "texture_specular",
  NORMAL = "texture_normal",
  HEIGHT = "texture_height",
}

export class Mesh {
  hasLoaded = false;
  vertexBuffer: GPUBuffer | undefined;
  indexBuffer: GPUBuffer | undefined;

  constructor(
    public name: string,
    public vertices: Float32Array,
    public indices: Uint16Array,
    private texCoords: Float32Array = new Float32Array([]),
    private textures: Texture[] = [],
    private position: float3 = new float3()
  ) {}

  getTextures(): Texture[] {
    return this.textures;
  }

  getModelMatrix(): float4x4 {
    return new float4x4().translate(this.position);
  }

  uploadToGPU() {
    this.vertexBuffer?.destroy();
    this.indexBuffer?.destroy();

    this.vertexBuffer = GPUContext.getDevice().createBuffer({
      size: this.vertices.byteLength + this.texCoords.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });

    const view = new Float32Array(this.vertexBuffer.getMappedRange());

    for (let i = 0; i < this.vertices.length / 3; ++i) {
      let bufferCounter = i * 5;
      view[bufferCounter + 0] = this.vertices[i * 3 + 0];
      view[bufferCounter + 1] = this.vertices[i * 3 + 1];
      view[bufferCounter + 2] = this.vertices[i * 3 + 2];
    }

    for (let i = 0; i < this.texCoords.length / 2; ++i) {
      let bufferCounter = i * 5 + 3;
      view[bufferCounter + 0] = this.texCoords[i * 2 + 0];
      view[bufferCounter + 1] = this.texCoords[i * 2 + 1];
    }

    this.vertexBuffer.unmap();

    this.indexBuffer = GPUContext.getDevice().createBuffer({
      size: this.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    GPUContext.getDevice().queue.writeBuffer(this.indexBuffer, 0, this.indices, 0, this.indices.length);
  }
}
