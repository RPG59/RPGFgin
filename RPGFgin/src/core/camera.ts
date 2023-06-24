import { float4x4 } from "../math/float4x4";
import { float3 } from "../math/float3";
import { MathUtils } from "../math/mathUtils";
import degToRad = MathUtils.degToRad;

const MOUSE_SENSITIVITY = 0.1;
const KEYBOARD_OFFSET_PER_FRAME = 1;
const MAX_PINCH_ANGLE = 89;
const MIN_PINCH_ANGLE = -89;

export enum CAMERA_MOVEMENT {
  LEFT,
  RIGHT,
  FORWARD,
  BACKWARD,
}

export class Camera {
  projMatrix: float4x4;
  yaw: number = -90;
  pinch: number = 0;
  right: float3;

  constructor(
    private verticalFowRad: number,
    private aspectRatio: number,
    private nearClip: number,
    private farClip: number,
    private position: float3 = new float3(0, 0, 0),
    private front: float3 = new float3(0, 0, -1),
    private up: float3 = new float3(0, 1, 0)
  ) {
    this.updateProjMatrix();
  }

  getViewMatrix(): float4x4 {
    // return new float4x4().lookAt(this.position.toArray(), this.position.clone().add(this.front).toArray(), this.up.toArray());
    return new float4x4().lookAt(this.position.toArray(), new float3().toArray(), this.up.toArray());
  }

  updateProjMatrix(): void {
    this.projMatrix = new float4x4().perspective(this.verticalFowRad, this.aspectRatio, this.nearClip, this.farClip);
  }

  getProjectionMatrix(): float4x4 {
    return this.projMatrix;
  }

  rotate(yaw: number, pinch: number): void {
    this.yaw += yaw * MOUSE_SENSITIVITY;
    this.pinch += pinch * MOUSE_SENSITIVITY;

    if (this.pinch > MAX_PINCH_ANGLE) {
      this.pinch = MAX_PINCH_ANGLE;
    }

    if (this.pinch < MIN_PINCH_ANGLE) {
      this.pinch = MIN_PINCH_ANGLE;
    }

    this.updateVectors();
  }

  move(direction: CAMERA_MOVEMENT): void {
    if (direction === CAMERA_MOVEMENT.BACKWARD) {
      this.position.sub(this.front.clone().multiplyScalar(KEYBOARD_OFFSET_PER_FRAME));
    }
    if (direction === CAMERA_MOVEMENT.FORWARD) {
      this.position.add(this.front.clone().multiplyScalar(KEYBOARD_OFFSET_PER_FRAME));
    }
    if (direction === CAMERA_MOVEMENT.LEFT) {
      this.position.sub(this.right.clone().multiplyScalar(KEYBOARD_OFFSET_PER_FRAME));
    }
    if (direction === CAMERA_MOVEMENT.RIGHT) {
      this.position.add(this.right.clone().multiplyScalar(KEYBOARD_OFFSET_PER_FRAME));
    }
  }

  updateVectors(): void {
    this.front = new float3(
      -Math.sin(degToRad(this.yaw)) * Math.cos(degToRad(this.pinch)),
      Math.sin(degToRad(this.pinch)),
      Math.cos(degToRad(this.yaw)) * Math.cos(degToRad(this.pinch))
    ).normalize();
    this.right = this.front.clone().cross(new float3(0, 1, 0));

    const length = this.position.length();
    const yawRad = degToRad(this.yaw);
    const pinchRad = degToRad(this.pinch);

    this.position.x = -length * Math.sin(yawRad) * Math.cos(pinchRad);
    this.position.y = length * Math.sin(pinchRad);
    this.position.z = length * Math.cos(yawRad) * Math.cos(pinchRad);
  }
}
