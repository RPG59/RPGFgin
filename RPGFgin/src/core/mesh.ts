import { gl } from "../main";
import { StaticVerticesBuffer } from "./staticVerticesBuffer";
import { StaticIndexBuffer } from "./staticIndexBuffer";
import { Texture } from "./texture";
import { float4x4 } from "../math/float4x4";
import { float3 } from "../math/float3";

export const VERTEX_SIZE = 32;

export enum TEXTURE_TYPES {
    DIFFUSE = 'texture_diffuse',
    SPECULAR = 'texture_specular',
    NORMAL = 'texture_normal',
    HEIGHT = 'texture_height'
}

export class Mesh {
    textures: Texture[];
    numIndices: number;
    VAO: WebGLVertexArrayObject;
    VBO: StaticVerticesBuffer;
    TBO: StaticVerticesBuffer;
    EBO: StaticIndexBuffer;

    constructor(vertices: Float32Array,
                texCoords: Float32Array,
                indices: Uint16Array,
                textures: Texture[],
                private position: float3 = new float3()
    ) {
        this.textures = textures;
        this.numIndices = indices.length;

        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);
        this.VBO = new StaticVerticesBuffer(vertices);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, null); // Positions

        this.TBO = new StaticVerticesBuffer(texCoords);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, null);

        this.EBO = new StaticIndexBuffer(indices);
        // gl.enableVertexAttribArray(1);
        // gl.vertexAttribPointer(1, 3, gl.FLOAT, false, VERTEX_SIZE, 4 * 3); // Normal
        // gl.enableVertexAttribArray(2);
        // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, VERTEX_SIZE, 4 * 6); // TexCoord

        gl.bindVertexArray(null);
    }

    getTextures(): Texture[] {
        return this.textures;
    }

    getModelMatrix(): float4x4 {
        return new float4x4().translate(this.position);
    }
}
