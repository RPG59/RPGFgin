import { vec3 } from "glm-js";

import { Camera } from "../../RPGFgin/src/core/camera";
import { CameraInputControl } from "../../RPGFgin/src/core/cameraInputControl";
import { UserEvents } from "../../RPGFgin/src/core/input";
import { Renderer } from "../../RPGFgin/src/core/renderer";

import { SceneManager } from "./sceneManager";

export class Game {
  camera: Camera;
  sceneManager: SceneManager;
  renderer: Renderer;
  running: boolean = false;
  updateListeners: Array<{ update(): void }> = [];

  static userEvents: UserEvents;

  constructor() {
    this.init();
  }

  async init() {
    this.initEvents();
    this.initCamera();

    await this.initScene();

    this.running = true;
  }

  async initScene() {
    this.sceneManager = new SceneManager(this.camera);
    await this.sceneManager.load();

    this.renderer = new Renderer(this.camera, this.sceneManager.scene);
  }

  initCamera() {
    const fov = Math.PI / 4;
    const aspect = window.innerWidth / window.innerHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const defaultCameraPosition = new vec3(0, 0, 10);

    this.camera = new Camera(
      fov,
      aspect,
      nearPlane,
      farPlane,
      defaultCameraPosition
    );

    this.updateListeners.push(
      new CameraInputControl(this.camera, Game.userEvents)
    );
  }

  initEvents() {
    Game.userEvents = new UserEvents();
  }

  update() {
    this.updateListeners.forEach((listener) => listener.update());
  }

  render() {
    if (this.running) {
      this.update();
      this.renderer.render();
    }
  }
}
