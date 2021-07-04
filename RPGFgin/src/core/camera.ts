import { mat4 } from "../math/mat4";
import { vec3 } from "../math/vec3";
import { radians } from "glm-js";

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
  projMatrix: any;
  yaw: number = -0;
  pinch: number = 0;
  right: vec3 = new vec3();

  constructor(
    private verticalFowRad: number,
    private aspectRatio: number,
    private nearClip: number,
    private farClip: number,
    public position = new vec3(),
    private front: vec3 = new vec3(0, 0, -1),
    private up = new vec3(0, 1, 0)
  ) {
    this.updateProjMatrix();
  }

  getViewMatrix() {
    return mat4.lookAt(this.position, new vec3(), this.up);
  }

  updateProjMatrix(): void {
    this.projMatrix = mat4.perspective(
      this.verticalFowRad,
      this.aspectRatio,
      this.nearClip,
      this.farClip
    );
  }

  getProjectionMatrix() {
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
      this.position = vec3.sub(
        this.position,
        vec3.mulScalar(this.front, KEYBOARD_OFFSET_PER_FRAME)
      );
    }
    if (direction === CAMERA_MOVEMENT.FORWARD) {
      this.position = vec3.add(
        this.position,
        vec3.mulScalar(this.front, KEYBOARD_OFFSET_PER_FRAME)
      );
    }
    if (direction === CAMERA_MOVEMENT.LEFT) {
      this.position = vec3.sub(
        this.position,
        vec3.mulScalar(this.right, KEYBOARD_OFFSET_PER_FRAME)
      );
    }
    if (direction === CAMERA_MOVEMENT.RIGHT) {
      this.position = vec3.add(
        this.position,
        vec3.mulScalar(this.right, KEYBOARD_OFFSET_PER_FRAME)
      );
    }
  }

  updateVectors(): void {
    this.front = vec3.normalize(
      new vec3(
        -Math.sin(radians(this.yaw)) * Math.cos(radians(this.pinch)),
        Math.sin(radians(this.pinch)),
        Math.cos(radians(this.yaw)) * Math.cos(radians(this.pinch))
      )
    );

    this.right = vec3.cross(this.front, new vec3(0, 1, 0));
    const len = vec3.len(this.position);
    const yawRad = radians(this.yaw);
    const pinchRad = radians(this.pinch);
    this.position.x = -len * Math.sin(yawRad) * Math.cos(pinchRad);
    this.position.y = len * Math.sin(pinchRad);
    this.position.z = len * Math.cos(yawRad) * Math.cos(pinchRad);
  }
}
