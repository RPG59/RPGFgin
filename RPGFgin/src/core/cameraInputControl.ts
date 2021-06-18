import { Camera, CAMERA_MOVEMENT } from "./camera";
import { IControl } from "./control";
import { UserEvents } from "./input";
import { vec2 } from "glm-js";

export class CameraInputControl implements IControl {
  pointer: vec2;
  pointerOld: vec2;
  delta: vec2;
  isDrag: boolean = false;

  constructor(private camera: Camera, private userEvents: UserEvents) {
    this.pointer = new vec2();
    this.pointerOld = new vec2();
    this.delta = new vec2();
    this.userEvents.addControl(this);
  }

  onPointerDown(e) {
    this.isDrag = true;
    this.pointerOld.x = e.clientX;
    this.pointerOld.y = e.clientY;
  }

  onPointerUp(e) {
    this.isDrag = false;
    this.pointerOld.x = e.clientX;
    this.pointerOld.y = e.clientY;
  }

  onPointerMove(e) {
    if (!this.isDrag) {
      return;
    }

    this.delta.x = e.clientX - this.pointerOld.x;
    this.delta.y = e.clientY - this.pointerOld.y;

    this.rotate();

    this.pointerOld.x = e.clientX;
    this.pointerOld.y = e.clientY;
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
