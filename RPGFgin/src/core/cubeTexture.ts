import { FileLoader } from "../loaders/fileLoader";
import { gl } from "../main";
import { ITexture } from "../types/ITexture";
import { TextureSlotsMap, TextureTypes } from "./mesh";

export class CubeTexture implements ITexture {
  id: WebGLTexture;
  blobLoaedr: FileLoader;
  type: string;
  img: any;

  constructor() {
    this.type = TextureTypes.CUBE;
  }

  async loadCubeTexture(): Promise<void> {
    const textures = [
      "right.jpg",
      "left.jpg",
      "top.jpg",
      "bottom.jpg",
      "front.jpg",
      "back.jpg",
    ];
    this.id = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + TextureSlotsMap[this.type]);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);

    await Promise.all(
      textures.map((texture, index) => this.create(texture, index))
    );

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  }

  async create(path: string, index: number): Promise<void> {
    this.blobLoaedr = new FileLoader(`skybox/${path}`, "blob");
    const blob = await this.blobLoaedr.load();
    const bitmap = await createImageBitmap(blob);

    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + index,
      0,
      gl.RGB,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      bitmap
    );
  }
}
