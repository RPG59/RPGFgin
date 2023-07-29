import { float3 } from "./float3";

export class Spherical {
  constructor(public r: number = 0, public thetaRad: number = 0, public fiRad: number = 0) {}

  getCertesianCoords(): float3 {
    const sinTheta = Math.sin(this.thetaRad);
    const x = this.r * sinTheta * Math.cos(this.fiRad);
    const y = this.r * Math.cos(this.thetaRad);
    const z = this.r * sinTheta * Math.sin(this.fiRad);

    return new float3(x, y, z);
  }
}
