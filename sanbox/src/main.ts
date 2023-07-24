import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";
import { Camera } from "../../RPGFgin/src/core/camera";
import { CameraInputControl } from "../../RPGFgin/src/core/cameraInputControl";
import { float3 } from "../../RPGFgin/src/math/float3";
import { Scene } from "../../RPGFgin/src/core/scene";
import { UserEvents } from "../../RPGFgin/src/core/input";
import { GPUContext } from "../../RPGFgin/src/platform/webgpu/gpuContext";
import { WebGPURenderer } from "../../RPGFgin/src/core/webgpuRenderer";

GPUContext.getInstance()
  .init("canvas3d")
  .then(() => {
    fetch("LP1.obj")
      .then((x) => x.text())
      .then(async (x) => {
        const loader = new ObjLoader(x);
        const camera = new Camera(Math.PI / 4, window.innerWidth / window.innerHeight, 0.1, 100, new float3(0, 0, 10));
        const userEvents = new UserEvents();
        const control = new CameraInputControl(camera, userEvents);

        await loader.load();

        const meshes = await loader.getMeshes();

        const scene = new Scene(meshes);

        const renderer = new WebGPURenderer();

        renderer.uploadSceneToGpu(scene);

        function mainLoop() {
          control.update();
          renderer.render(scene, camera);
          requestAnimationFrame(mainLoop);
        }
        mainLoop();
      });
  });
