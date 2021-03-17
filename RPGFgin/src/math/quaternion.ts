import { float3 } from "./float3";

export class Quaternion {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 1) {
    }

    toArray(): number[] {
        return [this.x, this.y, this.z, this.w];
    }

    fromArisAngle(axis: float3, angle: number): Quaternion {
        const halfAngle = angle / 2;
        const s = Math.sin(halfAngle);

        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);

        return this;
    }
}

