import { gl } from "../platform/webgl/utils";

export class Shader {
  program: WebGLProgram;
  fsId: WebGLShader;
  vsId: WebGLShader;

  constructor(vs: string, fs: string) {
    this.vsId = this.createShader(gl.VERTEX_SHADER, vs);
    this.fsId = this.createShader(gl.FRAGMENT_SHADER, fs);

    if (!this.compileShader(this.vsId)) return;
    if (!this.compileShader(this.fsId)) return;
    this.createProgram();
  }

  enable(): void {
    gl.useProgram(this.program);
  }

  disable(): void {
    gl.useProgram(null);
  }

  createShader(type: number, data): WebGLShader {
    const id = gl.createShader(type);
    gl.shaderSource(id, data);
    return id;
  }

  compileShader(shaderId: WebGLShader): boolean {
    gl.compileShader(shaderId);
    if (gl.getShaderParameter(shaderId, gl.COMPILE_STATUS)) {
      return true;
    }

    console.log(
      "%cSHADER COMPILE ERROR: " + gl.getShaderInfoLog(shaderId),
      "color: red"
    );
    return false;
  }

  createProgram(): void {
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vsId);
    gl.attachShader(this.program, this.fsId);
    gl.linkProgram(this.program);
    // TODO: link status

    gl.deleteShader(this.vsId);
    gl.deleteShader(this.fsId);
  }

  setUniform1i(name: string, data: number): void {
    const location = gl.getUniformLocation(this.program, name);
    gl.uniform1i(location, data);
  }

  setUniformMatrix4f(name: string, data: Float32Array): void {
    const location = gl.getUniformLocation(this.program, name);
    gl.uniformMatrix4fv(location, false, data);
  }
}
