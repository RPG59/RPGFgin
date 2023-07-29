import { float2 } from "../math/float2";
import { Camera, CAMERA_MOVEMENT } from "./camera";
import { IControl } from "./control";
import { UserEvents } from "./input";

export class CameraInputControl implements IControl {
  pointer: float2;
  pointerOld: float2;
  delta: float2;
  isDrag: boolean = false;
  mouseButton: number = 0;

  constructor(private camera: Camera, private userEvents: UserEvents) {
    this.pointer = new float2();
    this.pointerOld = new float2();
    this.delta = new float2();
    this.userEvents.addControl(this);
  }

  onPointerDown(e) {
    this.isDrag = true;
    this.pointerOld.set(e.clientX, e.clientY);
    this.mouseButton = e.button;
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

    if (this.mouseButton === 0) {
      this.rotate();
    }

    if (this.mouseButton === 2) {
      this.translate();
    }

    this.pointerOld.set(e.clientX, e.clientY);
  }

  rotate() {
    this.camera.rotate(this.delta.x, this.delta.y);
  }

  translate() {
    this.camera.translate(this.delta.x, this.delta.y);
  }

  update() {
    this.camera.move(CAMERA_MOVEMENT.FORWARD, this.userEvents.wheel);
    this.userEvents.wheel = 0;
  }
}
