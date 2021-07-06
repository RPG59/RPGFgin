import { v4 as uuidv4 } from "uuid";

import { gl } from "../main";
import { StaticVerticesBuffer } from "./staticVerticesBuffer";
import { StaticIndexBuffer } from "./staticIndexBuffer";
import { mat4, vec3 } from "glm-js";
import { Shader } from "./shader";
import { Renderer } from "./renderer";
import { ITexture } from "../types/ITexture";

export const VERTEX_SIZE = 32;

export enum TEXTURE_TYPES {
  DIFFUSE = "texture_diffuse",
  SPECULAR = "texture_specular",
  NORMAL = "texture_normal",
  HEIGHT = "texture_height",
  CUBE = "cube",
}

export class Mesh {
  textures: ITexture[];
  numIndices: number;
  VAO: WebGLVertexArrayObject;
  VBO: StaticVerticesBuffer;
  TBO: StaticVerticesBuffer;
  NBO: StaticVerticesBuffer;
  EBO: StaticIndexBuffer;
  allowIntersections: boolean = true;
  uuid: string;
  modelMatrix = new mat4();

  constructor(
    public vertices: Float32Array,
    public indices: Uint32Array,
    public texCoords: Float32Array = new Float32Array([]),
    public normals: Float32Array = new Float32Array([]),
    textures: ITexture[] = [],
    private position: vec3 = new vec3()
  ) {
    this.uuid = uuidv4();
    this.textures = textures;
    this.numIndices = indices.length;

    this.VAO = gl.createVertexArray();
    gl.bindVertexArray(this.VAO);
    this.VBO = new StaticVerticesBuffer(vertices);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, null); // Positions

    if (normals.length) {
      this.NBO = new StaticVerticesBuffer(normals);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, null);
    }

    // this.TBO = new StaticVerticesBuffer(texCoords);
    // gl.enableVertexAttribArray(2);
    // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, null);

    this.EBO = new StaticIndexBuffer(indices);
    // gl.enableVertexAttribArray(1);
    // gl.vertexAttribPointer(1, 3, gl.FLOAT, false, VERTEX_SIZE, 4 * 3); // Normal
    // gl.enableVertexAttribArray(2);
    // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, VERTEX_SIZE, 4 * 6); // TexCoord

    gl.bindVertexArray(null);
  }

  getTextures(): ITexture[] {
    return this.textures;
  }

  getModelMatrix(): mat4 {
    return this.modelMatrix;
  }

  render(shader: Shader, renderMode: number): void {
    if (!Renderer.activeMeshesMap[this.uuid] && this.allowIntersections) {
      return;
    }

    // this.textures.forEach((texture, i) => {
    //   shader.setUniform1i("mainSampler", i);
    //   gl.bindTexture(gl.TEXTURE_2D, texture.id);
    // });

    gl.bindVertexArray(this.VAO);
    gl.drawElements(renderMode, this.numIndices, gl.UNSIGNED_INT, 0);
    gl.activeTexture(gl.TEXTURE0);
  }
}
