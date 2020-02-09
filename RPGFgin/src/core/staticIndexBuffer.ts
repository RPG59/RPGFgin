import { gl } from "../main";

export class StaticIndexBuffer {
    private id: WebGLBuffer;
    constructor(data: ArrayBuffer) {
        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    bind(): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
    }

    unbind(): void {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}