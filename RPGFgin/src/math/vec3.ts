export class vec3 {
  constructor(public x = 0, public y = 0, public z = 0) {}

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  static mulScalar(v1: vec3, scalar: number): vec3 {
    return new vec3(v1.x * scalar, v1.y * scalar, v1.z * scalar);
  }

  static addScalar(v1: vec3, scalar: number): vec3 {
    return new vec3(v1.x + scalar, v1.y + scalar, v1.z + scalar);
  }

  static divScalar(v1: vec3, scalar: number): vec3 {
    return new vec3(v1.x / scalar, v1.y / scalar, v1.z / scalar);
  }

  static mul(v1: vec3, v2: vec3): vec3 {
    return new vec3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
  }

  static add(v1: vec3, v2: vec3): vec3 {
    return new vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  static cross(v1: vec3, v2: vec3): vec3 {
    return new vec3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    );
  }

  static dot(v1: vec3, v2: vec3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static sub(v1: vec3, v2: vec3): vec3 {
    return new vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  static normalize(v: vec3): vec3 {
    return vec3.divScalar(v, vec3.len(v) || 1);
  }

  static len(v: vec3): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  }
}
