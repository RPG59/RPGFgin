import { vec2 } from "glm-js";

//@ts-ignore
import FS from "../../RPGFgin/shaders/default.frag";
//@ts-ignore
import VS from "../../RPGFgin/shaders/default.vert";
import { Camera } from "../../RPGFgin/src/core/camera";
import { Material } from "../../RPGFgin/src/core/material";
import { Raycast } from "../../RPGFgin/src/core/raycast";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Scene } from "../../RPGFgin/src/core/scene";
import { Shader } from "../../RPGFgin/src/core/shader";
import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";
import { normalizeMouseCoords } from "../../RPGFgin/src/utils/convert";
import { LineGenerator } from "./lineGenerator";

export class SceneManager {
  scene: Scene;
  camera: Camera;

  constructor(camera: Camera) {
    this.scene = new Scene();
    this.camera = camera;
  }

  async load() {
    const defaultShader = new Shader(VS, FS);

    await this.loadWorldGeometry(defaultShader);
    this.initLineGenerator(defaultShader);
  }

  async loadWorldGeometry(shader: Shader) {
    const objTextData = await fetch("foobar.obj").then((x) => x.text());
    const loader = new ObjLoader(objTextData);

    await loader.load();

    const meshes = await loader.getMeshes();

    this.scene.push(new RenderableObject(meshes, new Material(shader)));
  }

  initLineGenerator(shader: Shader) {
    const lineGenerator = new LineGenerator(shader, this.camera);
    const raycaster = new Raycast();

    this.scene.push(lineGenerator);

    window.addEventListener("click", ({ clientX, clientY, ctrlKey }) => {
      if (!ctrlKey) {
        return;
      }

      const intersections = raycaster.raycast(
        normalizeMouseCoords(clientX, clientY),
        this.scene.renderableObjects,
        this.camera
      );

      if (!intersections.length) {
        return;
      }

      intersections.sort((a, b) => a.distance - b.distance);

      const { intersectionPoint, normal } = intersections[0];
      lineGenerator.createLine(intersectionPoint, normal);
    });
  }
}
