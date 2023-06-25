import { Shader } from "../../RPGFgin/src/core/shader";

//@ts-ignore
import FS from "../../RPGFgin/shaders/default.frag";
//@ts-ignore
import VS from "../../RPGFgin/shaders/default.vert";
//@ts-ignore
import GPUShaderData from "../../RPGFgin/shaders/default.wgsl";
import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";
import { Camera } from "../../RPGFgin/src/core/camera";
import { CameraInputControl } from "../../RPGFgin/src/core/cameraInputControl";
import { float3 } from "../../RPGFgin/src/math/float3";
import { Scene } from "../../RPGFgin/src/core/scene";
import { RenderableObject } from "../../RPGFgin/src/core/RenderableObject";
import { Material } from "../../RPGFgin/src/core/material";
import { UserEvents } from "../../RPGFgin/src/core/input";
import { gl, initWebGL } from "../../RPGFgin/src/platform/webgl/utils";
import { GPUContext } from "../../RPGFgin/src/platform/webgpu/gpuContext";
import { GPUShader } from "../../RPGFgin/src/platform/webgpu/gpuShader";
import { float4x4 } from "../../RPGFgin/src/math/float4x4";
import { Mesh } from "../../RPGFgin/src/core/mesh";
import { Renderer } from "../../RPGFgin/src/core/renderer";

// initWebGL("canvas3d");
GPUContext.getInstance()
  .init("canvas3d")
  .then(() => {
    fetch("LP1.obj")
      .then((x) => x.text())
      .then(async (x) => {
        const loader = new ObjLoader(x);
        // const shader = new Shader(VS, FS);

        // const shader = new GPUShader(GPUShaderData);
        const camera = new Camera(Math.PI / 4, window.innerWidth / window.innerHeight, 1, 100, new float3(0, 0, 10));
        const userEvents = new UserEvents();
        const control = new CameraInputControl(camera, userEvents);

        await loader.load();

        const vertexBuffers: GPUVertexBufferLayout[] = [
          {
            attributes: [
              {
                shaderLocation: 0, // position
                offset: 0,
                format: "float32x3",
              },
              // {
              //   shaderLocation: 1, // normals
              //   offset: 0,
              //   format: "float32x3",
              // },
              // {
              //   shaderLocation: 2, // uv
              //   offset: 0,
              //   format: "float32x2",
              // },
            ],
            arrayStride: 12,
            stepMode: "vertex",
          },
        ];
        const shader = new GPUShader(GPUShaderData, vertexBuffers);
        const meshes = await loader.getMeshes();
        const clearColor = { r: 1, g: 1, b: 1, a: 1 };
        const renderPassDescriptor: GPURenderPassDescriptor = {
          depthStencilAttachment: {
            view: null,
            depthClearValue: 1,
            depthLoadOp: "clear",
            depthStoreOp: "store",
          },
          colorAttachments: [
            {
              clearValue: clearColor,
              loadOp: "clear",
              storeOp: "store",
              view: GPUContext.getContext().getCurrentTexture().createView(),
            },
          ],
        };

        // console.log(uniformBufferData);
        // const vtx = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0]);
        // const idx = new Uint16Array([1, 2, 3, 4]);
        // const mesh = new Mesh("test", vtx, idx);
        // mesh.uploadToGPU();
        // passEncoder.setVertexBuffer(0, mesh.vertexBuffer);
        // passEncoder.draw(3);

        meshes.forEach((mesh) => mesh.uploadToGPU());

        const scene = new Scene([new RenderableObject(meshes, new Material(shader))]);
        const renderer = new Renderer(camera, scene);

        function mainLoop() {
          const canvasTexture = GPUContext.getContext().getCurrentTexture();
          renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView();
          const depthTexture = GPUContext.getDevice().createTexture({
            size: [canvasTexture.width, canvasTexture.height],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
          });

          renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();

          const commandEncoder = GPUContext.getDevice().createCommandEncoder();
          const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
          const uniformBufferData = new Float32Array(32);

          uniformBufferData.set(camera.getProjectionMatrix().elements);
          uniformBufferData.set(camera.getViewMatrix().elements, 16);

          passEncoder.setPipeline(shader.getPipeline());
          control.update();

          renderer.render(passEncoder);

          // meshes.forEach((mesh) => {
          //   passEncoder.setVertexBuffer(0, mesh.vertexBuffer);
          //   passEncoder.setIndexBuffer(mesh.indexBuffer, "uint16", 0, mesh.indices.length);
          //   passEncoder.drawIndexed(mesh.indices.length / 3, 1, 0, 0, 0);
          // });

          passEncoder.end();
          GPUContext.getDevice().queue.submit([commandEncoder.finish()]);

          requestAnimationFrame(mainLoop);
        }
        mainLoop();
      });
  });

// fetch('textured_output.obj').then(x => x.text()).then(x => {
