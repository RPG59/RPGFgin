import { nanoid } from "nanoid";

import { Texture } from "./texture";
import { float4x4 } from "../math/float4x4";
import { float3 } from "../math/float3";

export enum TEXTURE_TYPES {
  DIFFUSE = "texture_diffuse",
  SPECULAR = "texture_specular",
  NORMAL = "texture_normal",
  HEIGHT = "texture_height",
}

export class Mesh {
  bindGroup: GPUBindGroup;
  id: string;

  constructor(
    public name: string,
    public vertices: Float32Array,
    public indices: Uint16Array,
    public texCoords: Float32Array = new Float32Array([]),
    private textures: Texture[] = [],
    private position: float3 = new float3()
  ) {
    this.id = nanoid();
  }

  getTextures(): Texture[] {
    return this.textures;
  }

  getModelMatrix(): float4x4 {
    return new float4x4().translate(this.position);
  }
}
