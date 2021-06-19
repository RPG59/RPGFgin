import { gl, initWebGL } from "../../RPGFgin/src/main";
import { Shader } from "../../RPGFgin/src/core/shader";

//@ts-ignore
import FS from "../../RPGFgin/shaders/default.frag";
//@ts-ignore
import VS from "../../RPGFgin/shaders/default.vert";
import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";
import { Camera } from "../../RPGFgin/src/core/camera";
import { CameraInputControl } from "../../RPGFgin/src/core/cameraInputControl";
import { Renderer } from "../../RPGFgin/src/core/renderer";
import { Scene } from "../../RPGFgin/src/core/scene";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Material } from "../../RPGFgin/src/core/material";
import { UserEvents } from "../../RPGFgin/src/core/input";
import { Raycast } from "../../RPGFgin/src/core/raycast";
import { vec3, vec2 } from "glm-js";

initWebGL("canvas3d");

const mouse = new vec2();

// fetch('textured_output.obj').then(x => x.text()).then(x => {
fetch("foobar.obj")
  .then((x) => x.text())
  .then(async (x) => {
    const loader = new ObjLoader(x);
    const shader = new Shader(VS, FS);
    const camera = new Camera(
      Math.PI / 4,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
      new vec3(0, 0, 10)
    );
    const userEvents = new UserEvents();
    const control = new CameraInputControl(camera, userEvents);

    await loader.load();

    const meshes = await loader.getMeshes();
    const scene = new Scene([
      new RenderableObject(meshes, new Material(shader)),
    ]);
    const renderer = new Renderer(camera, scene);

    const raycaster = new Raycast();

    window.addEventListener("click", ({ clientX, clientY, ctrlKey }) => {
      // if (!ctrlKey) {
      //   return;
      // }
      mouse.x = (2 * clientX) / window.innerWidth - 1;
      mouse.y = 1 - (2 * clientY) / window.innerHeight;
      raycaster.raycast(mouse, scene.renderableObjects, camera);
    });

    function mainLoop() {
      control.update();

      gl.clear(gl.COLOR_BUFFER_BIT);

      renderer.render();

      //requestAnimationFrame(mainLoop);
      setTimeout(mainLoop, 100);
    }

    mainLoop();
  });
