import { gl } from "../main";

export class StaticVerticesBuffer {
  private id: WebGLBuffer;
  constructor(data: ArrayBuffer) {
    this.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  bind(): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
  }

  unbind(): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  updateBufferData(data: ArrayBuffer): void {
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }
}
