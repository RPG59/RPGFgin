import { Camera } from "./camera";
import { Scene } from "./scene";
import { DatGui } from "../debug/datGui";
import { Shader } from "./shader";
import { Mesh, TEXTURE_TYPES } from "./mesh";
import { gl } from "../platform/webgl/utils";
import { GPUContext } from "../platform/webgpu/gpuContext";
import { GPUShader } from "../platform/webgpu/gpuShader";

export class Renderer {
  datGui: DatGui;
  cameraUniformBuffer: GPUBuffer;

  constructor(private camera: Camera, private scene: Scene) {
    this.initGui();

    this.cameraUniformBuffer = GPUContext.getDevice().createBuffer({
      size: camera.getProjectionMatrix().elements.byteLength + camera.getViewMatrix().elements.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  private initGui(): void {
    this.datGui = new DatGui();
    this.datGui.cameraPinch.listen().onChange((e) => {
      this.camera.pinch = e;
      this.camera.updateVectors();
    });

    this.datGui.cameraYaw.listen().onChange((e) => {
      this.camera.yaw = e;
      this.camera.updateVectors();
    });

    this.scene.renderableObjects.forEach((renderableObject, i) => {
      renderableObject.meshes.forEach(({ name }, meshIndex) => {
        this.datGui.meshesFolder.add({ [name]: true }, [name]);
      });
    });
  }

  private updateGui(): void {
    this.datGui.cameraPinch.setValue(this.camera.pinch);
    this.datGui.cameraYaw.setValue(this.camera.yaw);
  }

  private updateCamera(shader: GPUShader, passEncoder: GPURenderPassEncoder): void {
    const uniformBufferData = new Float32Array(32);

    uniformBufferData.set(this.camera.getProjectionMatrix().elements);
    uniformBufferData.set(this.camera.getViewMatrix().elements, 16);
    GPUContext.getDevice().queue.writeBuffer(this.cameraUniformBuffer, 0, uniformBufferData);

    const bindGroup = GPUContext.getDevice().createBindGroup({
      layout: shader.getPipeline().getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: this.cameraUniformBuffer } }],
    });

    passEncoder.setBindGroup(0, bindGroup);
  }

  private renderMesh(shader: Shader, mesh: Mesh, passEncoder: GPURenderPassEncoder): void {
    let diffuseCount = 1;
    let specularCount = 1;
    let normalCount = 1;
    let heightCount = 1;
    const textures = mesh.getTextures();

    textures.forEach((texture, i) => {
      // let count = 0;
      // gl.activeTexture(gl.TEXTURE0 + i + 1);
      // switch (texture.type) {
      //     case TEXTURE_TYPES.DIFFUSE:
      //         count = diffuseCount++;
      //         break;
      //     case TEXTURE_TYPES.SPECULAR:
      //         count = specularCount++;
      //         break;
      //     case TEXTURE_TYPES.NORMAL:
      //         count = normalCount++;
      //         break;
      //     case TEXTURE_TYPES.HEIGHT:
      //         count = heightCount++;
      //         break;
      //     default:
      //         return;
      // }
      // shader.setUniform1i(texture.type, count);
      // gl.bindTexture(gl.TEXTURE_2D, textures[i].id);
      // shader.setUniform1i("_tex", i);
      // gl.bindTexture(gl.TEXTURE_2D, texture.id);
    });

    // gl.bindVertexArray(mesh.VAO);
    // gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
    // gl.activeTexture(gl.TEXTURE0);

    passEncoder.setVertexBuffer(0, mesh.vertexBuffer);
    passEncoder.setIndexBuffer(mesh.indexBuffer, "uint16", 0, mesh.indices.length);
    passEncoder.drawIndexed(mesh.indices.length / 3, 1, 0, 0, 0);
  }

  render(passEncoder: GPURenderPassEncoder): void {
    this.updateGui();

    this.scene.renderableObjects.forEach((renderableObject) => {
      const shader = renderableObject.material.getShader();

      this.updateCamera(shader, passEncoder);

      renderableObject.meshes.forEach((mesh, i) => {
        if (this.datGui.meshesFolder.__controllers[i].object[mesh.name]) {
          // shader.setUniformMatrix4f("u_modelMatrix", mesh.getModelMatrix().elements);
          this.renderMesh(shader, mesh, passEncoder);
        }
      });
    });
  }
}
