import { gl, initWebGL } from "../../RPGFgin/src/main";
import { Shader } from "../../RPGFgin/src/core/shader";

//@ts-ignore
import FS from '../../RPGFgin/shaders/default.frag';
//@ts-ignore
import VS from '../../RPGFgin/shaders/default.vert';
import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";
import { Camera } from "../../RPGFgin/src/core/camera";
import { CameraInputControl } from "../../RPGFgin/src/core/cameraInputControl";
import { Renderer } from "../../RPGFgin/src/core/renderer";
import { float3 } from "../../RPGFgin/src/math/float3";
import { Scene } from "../../RPGFgin/src/core/scene";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Material } from "../../RPGFgin/src/core/material";
import { UserEvents } from "../../RPGFgin/src/core/input";


initWebGL('canvas3d');

// fetch('textured_output.obj').then(x => x.text()).then(x => {
fetch('foobar.obj').then(x => x.text()).then(async x => {
    const loader = new ObjLoader(x);
    const shader = new Shader(VS, FS);
    const camera = new Camera(Math.PI / 4, window.innerWidth / window.innerHeight, .1, 100., new float3(0, 0, 10));
    const userEvents = new UserEvents();
    const control = new CameraInputControl(camera, userEvents);

    await loader.load()

    const meshes = await loader.getMeshes();
    const scene = new Scene([new RenderableObject(meshes, new Material(shader))]);
    const renderer = new Renderer(camera, scene);

    function mainLoop() {
        control.update();

        gl.clear(gl.COLOR_BUFFER_BIT);

        renderer.render();

        requestAnimationFrame(mainLoop);
    }

    mainLoop();

});
