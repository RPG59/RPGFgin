import { Quaternion } from "./quaternion";

export class float3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): float3 {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  add(v: float3): float3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  sub(v: float3): float3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  clone(): float3 {
    return new float3(this.x, this.y, this.z);
  }

  divideScalar(val: number): float3 {
    this.x /= val;
    this.y /= val;
    this.z /= val;

    return this;
  }

  multiplyScalar(val: number): float3 {
    this.x *= val;
    this.y *= val;
    this.z *= val;

    return this;
  }

  normalize(): float3 {
    return this.divideScalar(this.length() || 1);
  }

  cross(v: float3): float3 {
    const curr = this.clone();

    this.x = curr.y * v.z - curr.z * v.y;
    this.y = curr.z * v.x - curr.x * v.z;
    this.z = curr.x * v.y - curr.y * v.x;

    return this;
  }

  setLength(l: number): float3 {
    return this.normalize().multiplyScalar(l);
  }

  applyQuaternion(q: Quaternion): float3 {
    const x = this.x,
      y = this.y,
      z = this.z;
    const qx = q.x,
      qy = q.y,
      qz = q.z,
      qw = q.w;

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
  }
}
