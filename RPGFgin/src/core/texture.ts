import { FileLoader } from "../loaders/fileLoader";
import { GPUContext } from "../platform/webgpu/gpuContext";

export class Texture {
  private blobLoaedr: FileLoader;
  private type: string;
  private texture: GPUTexture | undefined;

  constructor(path: string, type: string) {
    this.type = type;
    this.blobLoaedr = new FileLoader(path, "blob");
  }

  getTexture() {
    return this.texture;
  }

  async create() {
    const blob = await this.blobLoaedr.load();
    const bitmap = await createImageBitmap(blob, { imageOrientation: "flipY", colorSpaceConversion: "none" });

    this.texture = GPUContext.getDevice().createTexture({
      label: this.type,
      format: "rgba8unorm",
      size: [bitmap.width, bitmap.height],
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    GPUContext.getDevice().queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture: this.texture },
      { width: bitmap.width, height: bitmap.height }
    );
  }
}
