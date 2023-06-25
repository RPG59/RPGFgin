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

        const vertexBuffers: GPUVertexBufferLayout[] = [
          {
            attributes: [
              {
                shaderLocation: 0, // position
                offset: 0,
                format: "float32x3",
              },
              {
                shaderLocation: 1, // uv
                offset: 3 * 4,
                format: "float32x2",
              },
            ],
            arrayStride: 3 * 4 + 2 * 4,
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

        meshes.forEach((mesh) => mesh.uploadToGPU());

        const scene = new Scene([new RenderableObject(meshes, new Material(shader))]);
        const renderer = new Renderer(camera, scene);

        const depthTexture = GPUContext.getDevice().createTexture({
          size: [window.innerWidth, window.innerHeight],
          format: "depth24plus",
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        function mainLoop() {
          const canvasTexture = GPUContext.getContext().getCurrentTexture();
          renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView();

          renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();

          const commandEncoder = GPUContext.getDevice().createCommandEncoder();
          const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

          passEncoder.setPipeline(shader.getPipeline());
          control.update();

          renderer.render(passEncoder);

          passEncoder.end();
          GPUContext.getDevice().queue.submit([commandEncoder.finish()]);

          requestAnimationFrame(mainLoop);
        }
        mainLoop();
      });
  });
