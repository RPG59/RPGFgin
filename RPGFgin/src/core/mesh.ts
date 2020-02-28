import { gl } from "../main";
import { StaticVerticesBuffer } from "./staticVerticesBuffer";
import { StaticIndexBuffer } from "./staticIndexBuffer";
import { Shader } from "./shader";
import { Texture } from "./texture";

export const VERTEX_SIZE = 32;
export const TEXTURE_TYPES = {
    DIFFUSE: 'texture_diffuse',
    SPECULAR: 'texture_specular',
    NORMAL: 'texture_normal',
    HEIGHT: 'texture_height'
};

export class Mesh {
    vertices: Float32Array;
    texCoords: Float32Array;
    indices: Uint16Array;
    textures: Texture[];
    VAO: WebGLVertexArrayObject;
    VBO: StaticVerticesBuffer;
    TBO: StaticVerticesBuffer;
    EBO: StaticIndexBuffer;

    constructor(vertices: Float32Array, texCoords: Float32Array, indices: Uint16Array, textures: Texture[]) {
        this.vertices = vertices;
        this.indices = indices;
        this.textures = textures;
        this.texCoords = texCoords;

        this.initMesh();
    }

    initMesh(): void {
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        this.VBO = new StaticVerticesBuffer(this.vertices);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, null); // Positions

        this.TBO = new StaticVerticesBuffer(this.texCoords);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, null);

        this.EBO = new StaticIndexBuffer(this.indices);
        // gl.enableVertexAttribArray(1);
        // gl.vertexAttribPointer(1, 3, gl.FLOAT, false, VERTEX_SIZE, 4 * 3); // Normal
        // gl.enableVertexAttribArray(2);
        // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, VERTEX_SIZE, 4 * 6); // TexCoord

        gl.bindVertexArray(null);
    }

    draw(shader: Shader): void {
        let diffuseCount = 1;
        let specularCount = 1;
        let normalCount = 1;
        let heightCount = 1;

        // this.textures.forEach((texture, i) => {
        //     let count = 0;
        //     gl.activeTexture(gl.TEXTURE0 + i);
        //     switch (texture.type) {
        //         case TEXTURE_TYPES.DIFFUSE:
        //             count = diffuseCount++;
        //         case TEXTURE_TYPES.SPECULAR:
        //             count = specularCount++;
        //         case TEXTURE_TYPES.NORMAL:
        //             count = normalCount++;
        //         case TEXTURE_TYPES.HEIGHT:
        //             count = heightCount++;
        //         default:
        //             return;
        //     }
        //     shader.setUniform1f(texture.type, count);
        //     gl.bindTexture(gl.TEXTURE_2D, this.textures[i].id);
        // });
        
        


        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.activeTexture(gl.TEXTURE0);
    }
}
