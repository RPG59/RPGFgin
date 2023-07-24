import { DatGui } from "../debug/datGui";
import { GPUContext } from "../platform/webgpu/gpuContext";
import { Camera } from "./camera";
import { GPURenderingPipeline } from "./gpuRenderingPipeline";
import { GPUScene } from "./gpuScene";
import { Scene } from "./scene";

const CAMERA_BIND_GROUP_LAYOUT_INDEX = 0;
const TEXTURE_BIND_GROUP_LAYOUT_INDEX = 1;

export class WebGPURenderer {
  datGui: DatGui;
  gpuScenesMap = new Map<string, GPUScene>();
  gpuRenderingPipeline: GPURenderingPipeline;
  cameraBuffer: GPUBuffer;
  depthTexture: GPUTexture;
  clearColor = { r: 1, g: 1, b: 1, a: 1 };
  cameraBindGroup: GPUBindGroup;

  renderPassDescriptor: GPURenderPassDescriptor = {
    depthStencilAttachment: {
      view: null,
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
    colorAttachments: [
      {
        clearValue: this.clearColor,
        loadOp: "clear",
        storeOp: "store",
        view: null,
      },
    ],
  };

  constructor() {
    this.datGui = new DatGui();

    this.gpuRenderingPipeline = new GPURenderingPipeline();

    this.depthTexture = GPUContext.getDevice().createTexture({
      size: [window.innerWidth, window.innerHeight],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.cameraBuffer = GPUContext.getDevice().createBuffer({
      size: 2 * 16 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.cameraBindGroup = GPUContext.getDevice().createBindGroup({
      layout: this.gpuRenderingPipeline.shader.getPipeline().getBindGroupLayout(CAMERA_BIND_GROUP_LAYOUT_INDEX),
      entries: [{ binding: 0, resource: { buffer: this.cameraBuffer } }],
    });
  }

  public uploadSceneToGpu(scene: Scene) {
    this.updateDatGui(scene);
    if (!this.gpuScenesMap.get(scene.id)) {
      this.gpuScenesMap.set(
        scene.id,
        new GPUScene(
          scene,
          this.gpuRenderingPipeline.shader.getPipeline().getBindGroupLayout(TEXTURE_BIND_GROUP_LAYOUT_INDEX)
        )
      );
    }
  }

  public render(scene: Scene, camera: Camera) {
    const canvasTexture = GPUContext.getContext().getCurrentTexture();

    this.renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView();
    this.renderPassDescriptor.depthStencilAttachment.view = this.depthTexture.createView();

    const commandEncoder = GPUContext.getDevice().createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);

    passEncoder.setPipeline(this.gpuRenderingPipeline.shader.getPipeline());

    this.updateCamera(camera, passEncoder);

    this.renderScene(scene, passEncoder);

    passEncoder.end();
    GPUContext.getDevice().queue.submit([commandEncoder.finish()]);
  }

  private updateCamera(camera: Camera, passEncoder: GPURenderPassEncoder): void {
    const uniformBufferData = new Float32Array(2 * 16);

    uniformBufferData.set(camera.getProjectionMatrix().elements);
    uniformBufferData.set(camera.getViewMatrix().elements, 16);
    GPUContext.getDevice().queue.writeBuffer(this.cameraBuffer, 0, uniformBufferData);
    passEncoder.setBindGroup(CAMERA_BIND_GROUP_LAYOUT_INDEX, this.cameraBindGroup);
  }

  private renderScene(scene: Scene, passEncoder) {
    const gpuScene = this.gpuScenesMap.get(scene.id);
    if (!gpuScene) {
      // FIXME: ERROR!
      return;
    }
    for (const { id, indices, name } of scene.meshes) {
      // FIXME: fix datGui
      if (name === "obj_glass") {
        continue;
      }

      // if (!this.datGui.meshesFolder.__controllers[i].object[name]) {
      //   console.log(this.datGui.meshesFolder.__controllers);

      //   continue;
      // }
      const { vertexBuffer, indexBuffer, bindGroup } = gpuScene.gpuMeshesMap.get(id);

      if (bindGroup) {
        passEncoder.setBindGroup(TEXTURE_BIND_GROUP_LAYOUT_INDEX, bindGroup);
      }

      passEncoder.setVertexBuffer(0, vertexBuffer);
      passEncoder.setIndexBuffer(indexBuffer, "uint16", 0, indices.length);
      passEncoder.drawIndexed(indices.length / 3, 1, 0, 0, 0);
    }
  }

  // private updateGui(): void {
  //   this.datGui.cameraPinch.setValue(this.camera.pinch);
  //   this.datGui.cameraYaw.setValue(this.camera.yaw);
  // }

  private updateDatGui(scene: Scene): void {
    // this.datGui.cameraPinch.listen().onChange((e) => {
    //   this.camera.pinch = e;
    //   this.camera.updateVectors();
    // });

    // this.datGui.cameraYaw.listen().onChange((e) => {
    //   this.camera.yaw = e;
    //   this.camera.updateVectors();
    // });

    scene.meshes.forEach(({ name }) => {
      this.datGui.meshesFolder.add({ [name]: true }, [name]);
    });
  }
}
