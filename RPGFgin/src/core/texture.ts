import { gl } from "../main";
import { FileLoader } from "../loaders/fileLoader";
import { ITexture } from "../types/ITexture";

export class Texture implements ITexture {
  id: WebGLTexture;
  blobLoaedr: FileLoader;
  type: string;
  img: any;

  constructor(type: string) {
    this.type = type;
  }

  create(path: string): Promise<void> {
    this.id = gl.createTexture();
    this.blobLoaedr = new FileLoader(path, "blob");

    return new Promise((res) => {
      this.blobLoaedr.load().then((blob) => {
        //@ts-ignore
        createImageBitmap(blob, { imageOrientation: "flipY" }).then(
          (bitmap) => {
            // createImageBitmap(blob).then(bitmap => {
            // this.img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.id);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGB,
              gl.RGB,
              gl.UNSIGNED_BYTE,
              bitmap
            );
            res();
          }
        );
      });
    });
  }
}
