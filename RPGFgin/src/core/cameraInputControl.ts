import { float2 } from "../math/float2";
import { Camera, CAMERA_MOVEMENT } from "./camera";
import { IControl } from "./control";
import { UserEvents } from "./input";

export class CameraInputControl implements IControl {
  pointer: float2;
  pointerOld: float2;
  delta: float2;
  isDrag: boolean = false;

  constructor(private camera: Camera, private userEvents: UserEvents) {
    this.pointer = new float2();
    this.pointerOld = new float2();
    this.delta = new float2();
    this.userEvents.addControl(this);
  }

  onPointerDown(e) {
    this.isDrag = true;
    this.pointerOld.set(e.clientX, e.clientY);
  }

  onPointerUp(e) {
    this.isDrag = false;
    this.pointerOld.set(e.clientX, e.clientY);
  }

  onPointerMove(e) {
    if (!this.isDrag) {
      return;
    }

    this.delta.set(e.clientX - this.pointerOld.x, e.clientY - this.pointerOld.y);

    this.rotate();

    this.pointerOld.set(e.clientX, e.clientY);
  }

  rotate() {
    this.camera.rotate(this.delta.x, this.delta.y);
  }

  update() {
    if (this.userEvents.keys["KeyW"]) {
      this.camera.move(CAMERA_MOVEMENT.FORWARD);
    }
    if (this.userEvents.keys["KeyS"]) {
      this.camera.move(CAMERA_MOVEMENT.BACKWARD);
    }
    if (this.userEvents.keys["KeyD"]) {
      this.camera.move(CAMERA_MOVEMENT.LEFT);
    }
    if (this.userEvents.keys["KeyA"]) {
      this.camera.move(CAMERA_MOVEMENT.RIGHT);
    }
  }
}
