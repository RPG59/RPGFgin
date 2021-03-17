import { Quaternion } from "./quaternion";

export class float3x3 {
    elements;

    constructor() {
        this.elements = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
    }

    from(q: Quaternion): float3x3 {
        const xx = q.x * q.x;
        const xy = q.y * q.x;
        const xz = q.z * q.x;
        const xw = q.w * q.x;

        const yy = q.y * q.y
        const yz = q.y * q.z
        const yw = q.y * q.w

        const zz = q.z * q.z
        const zw = q.z * q.w


        this.elements = new Float32Array([
            1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw),
            2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw),
            2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)
        ])

        return this;
    }
}
