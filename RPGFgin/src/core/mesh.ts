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
    console.log(this.vertices);

    this.vertexBuffer = GPUContext.getDevice().createBuffer({
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    this.indexBuffer = GPUContext.getDevice().createBuffer({
      size: this.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    GPUContext.getDevice().queue.writeBuffer(this.vertexBuffer, 0, this.vertices, 0, this.vertices.length);
    GPUContext.getDevice().queue.writeBuffer(this.indexBuffer, 0, this.indices, 0, this.indices.length);
  }
}
