import { IControl } from "./control";

export class UserEvents {
  keys: boolean[] = [];
  wheel: number = 0;
  controls: IControl[] = [];

  constructor() {
    this.init();
  }

  init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener("mousedown", (e) => {
      this.controls.forEach((control) => {
        control.onPointerDown(e);
      });
    });

    window.addEventListener("mouseup", (e) => {
      this.controls.forEach((control) => {
        control.onPointerUp(e);
      });
    });

    window.addEventListener("mousemove", (e) => {
      this.controls.forEach((control) => {
        control.onPointerMove(e);
      });
    });

    window.addEventListener("wheel", ({ deltaY }) => {
      this.wheel += deltaY;
    });

    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  addControl(control: IControl) {
    this.controls.push(control);
  }
}
