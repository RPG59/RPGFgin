import * as dat from "dat.gui";

export class DatGui {
  gui;

  cameraPinch;

  cameraYaw;

  meshesFolder;

  constructor() {
    this.gui = new dat.GUI();
    this.initCameraGui();
    this.initMeshesGui();
  }

  initCameraGui() {
    const cameraFolder = this.gui.addFolder("camera");
    this.cameraPinch = cameraFolder.add({ pinch: 0 }, "pinch");
    this.cameraYaw = cameraFolder.add({ yaw: 0 }, "yaw");
  }

  initMeshesGui() {
    this.meshesFolder = this.gui.addFolder("meshes");
  }
}
