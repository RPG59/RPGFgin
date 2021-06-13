import { Camera } from "./camera";
import { Scene } from "./scene";
import { DatGui } from "../debug/datGui";
import { Shader } from "./shader";
import { gl } from "../main";
import { Mesh } from "./mesh";

export class Renderer {
    datGui: DatGui;
    currentProgramId: number | null = null;

    constructor(private camera: Camera, private scene: Scene) {
        this.initGui();
    }

    initGui(): void {
        this.datGui = new DatGui();
        this.datGui.cameraPinch.listen().onChange(e => {
            this.camera.pinch = e;
            this.camera.updateVectors();
        });

        this.datGui.cameraYaw.listen().onChange(e => {
            this.camera.yaw = e;
            this.camera.updateVectors();
        });

        this.scene.renderableObjects.forEach((renderableObject, i) => {
            renderableObject.meshes.forEach((mesh, meshIndex) => {
                this.datGui.meshesFolder.add({[meshIndex]: true}, [meshIndex]);
            })
        });
    }

    updateGui(): void {
        this.datGui.cameraPinch.setValue(this.camera.pinch);
        this.datGui.cameraYaw.setValue(this.camera.yaw);
    }

    updateCamera(shader: Shader): void {
        shader.setUniformMatrix4f('u_projMatrix', this.camera.getProjectionMatrix().elements);
        shader.setUniformMatrix4f('u_viewMatrix', this.camera.getViewMatrix().elements);
    }


    render(): void {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.updateGui();

        this.scene.renderableObjects.forEach(renderableObject => {
            const shader = renderableObject.material.getShader();

            if (this.currentProgramId !== shader.program) {
                shader.enable();
                this.currentProgramId = shader.program;
            }

            this.updateCamera(shader);

            renderableObject.meshes.forEach((mesh, i) => {
                if (this.datGui.meshesFolder.__controllers[i].object[i]) {
                    shader.setUniformMatrix4f('u_modelMatrix', mesh.getModelMatrix().elements);

                    this.renderMesh(shader, mesh);
                }
            });
        });
    }

    renderMesh(shader: Shader, mesh: Mesh): void {
        let diffuseCount = 1;
        let specularCount = 1;
        let normalCount = 1;
        let heightCount = 1;
        const textures = mesh.getTextures();

        textures.forEach((texture, i) => {
            shader.setUniform1i('mainSampler', i);
            gl.bindTexture(gl.TEXTURE_2D, texture.id);
        });


        gl.bindVertexArray(mesh.VAO);
        gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.activeTexture(gl.TEXTURE0);
    }
}
