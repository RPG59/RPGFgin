import { float4x4 } from "../math/float4x4";
import { float3 } from "../math/float3";
import { MathUtils } from "../math/mathUtils";
import degToRad = MathUtils.degToRad;
import { Spherical } from "../math/sperical";

const MOUSE_SENSITIVITY_ROTATE = 0.01;
const MOUSE_SENSITIVITY_TRANSLATE = 0.023;
const WHEEL_MULTIPLIER = 0.01;

export enum CAMERA_MOVEMENT {
  LEFT,
  RIGHT,
  FORWARD,
  BACKWARD,
}

export class Camera {
  projMatrix: float4x4;
  x = 0;
  y = 0;
  spherecal: Spherical;

  constructor(
    private verticalFowRad: number,
    private aspectRatio: number,
    private nearClip: number,
    private farClip: number,
    private position: float3 = new float3(0, 0, 0),
    private front: float3 = new float3(0, 0, 0),
    private up: float3 = new float3(0, 1, 0)
  ) {
    this.spherecal = new Spherical(20, 1.5, 1.5);
    this.updateProjMatrix();
  }

  getViewMatrix(): float4x4 {
    return new float4x4().lookAt(
      this.spherecal.getCertesianCoords().add(new float3(this.x, this.y, 0)).toArray(),
      new float3(this.x, this.y, 0).toArray(),
      this.up.toArray()
    );
  }

  updateProjMatrix(): void {
    this.projMatrix = new float4x4().perspective(this.verticalFowRad, this.aspectRatio, this.nearClip, this.farClip);
  }

  getProjectionMatrix(): float4x4 {
    return this.projMatrix;
  }

  rotate(yaw: number, pinch: number): void {
    this.spherecal.thetaRad -= pinch * MOUSE_SENSITIVITY_ROTATE;
    this.spherecal.fiRad += yaw * MOUSE_SENSITIVITY_ROTATE;
    console.log(this.spherecal);
  }

  translate(dx: number, dy: number): void {
    // TODO: translate along axes
    this.x -= dx * MOUSE_SENSITIVITY_TRANSLATE;
    this.y += dy * MOUSE_SENSITIVITY_TRANSLATE;
  }

  move(direction: CAMERA_MOVEMENT, data: number): void {
    this.position.sub(
      this.position
        .clone()
        .normalize()
        .multiplyScalar(data * WHEEL_MULTIPLIER)
    );
    this.spherecal.r += data * WHEEL_MULTIPLIER;
  }
}
