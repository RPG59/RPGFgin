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
// import { Renderer } from "../../RPGFgin/src/core/renderer";
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
        const camera = new Camera(Math.PI / 4, window.innerWidth / window.innerHeight, 0.1, 100, new float3(0, 0, 10));
        const userEvents = new UserEvents();
        const control = new CameraInputControl(camera, userEvents);
        const defaultShader = GPUContext.getDevice().createShaderModule({
          code: GPUShaderData,
        });

        await loader.load();

        const uniformBuffer = GPUContext.getDevice().createBuffer({
          size: camera.getProjectionMatrix().elements.byteLength + camera.getViewMatrix().elements.byteLength,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

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

        const meshes = await loader.getMeshes();
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
          vertex: {
            module: defaultShader,
            entryPoint: "vtx_main",
            buffers: vertexBuffers,
          },
          fragment: {
            module: defaultShader,
            entryPoint: "frag_main",
            targets: [
              {
                format: navigator.gpu.getPreferredCanvasFormat(),
              },
            ],
          },
          primitive: {
            topology: "triangle-list",
          },
          layout: "auto",
        };

        const renderPipeline = GPUContext.getDevice().createRenderPipeline(pipelineDescriptor);
        const commandEncoder = GPUContext.getDevice().createCommandEncoder();
        const clearColor = { r: 1, g: 1, b: 1, a: 1 };
        const renderPassDescriptor: GPURenderPassDescriptor = {
          colorAttachments: [
            {
              clearValue: clearColor,
              loadOp: "clear",
              storeOp: "store",
              view: GPUContext.getContext().getCurrentTexture().createView(),
            },
          ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        const bindGroup = GPUContext.getDevice().createBindGroup({
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });

        const uniformBufferData = new Float32Array(32);
        uniformBufferData.set(camera.getProjectionMatrix().elements);
        uniformBufferData.set(camera.getViewMatrix().elements, 16);
        console.log(uniformBufferData);

        GPUContext.getDevice().queue.writeBuffer(uniformBuffer, 0, uniformBufferData);

        passEncoder.setPipeline(renderPipeline);

        // passEncoder.setBindGroup(0, bindGroup);
        // console.log(uniformBufferData);
        // const vtx = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0]);
        // const idx = new Uint16Array([1, 2, 3, 4]);
        // const mesh = new Mesh("test", vtx, idx);
        // mesh.uploadToGPU();
        // passEncoder.setVertexBuffer(0, mesh.vertexBuffer);
        // passEncoder.draw(3);

        meshes.forEach((mesh) => mesh.uploadToGPU());

        // const scene = new Scene([new RenderableObject(meshes, new Material(shader))]);
        // const renderer = new Renderer(camera, scene);

        function mainLoop() {
          control.update();

          meshes.forEach((mesh) => {
            passEncoder.setVertexBuffer(0, mesh.vertexBuffer);
            passEncoder.setIndexBuffer(mesh.indexBuffer, "uint16", 0, mesh.indices.length);
            passEncoder.drawIndexed(mesh.indices.length / 3, 1, 0, 0, 0);
          });

          passEncoder.end();
          GPUContext.getDevice().queue.submit([commandEncoder.finish()]);

          requestAnimationFrame(mainLoop);
        }

        mainLoop();
      });
  });

// fetch('textured_output.obj').then(x => x.text()).then(x => {
