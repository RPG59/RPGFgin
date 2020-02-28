import { RPGF, gl } from "../../RPGFgin/src/main";
import { Mesh, TEXTURE_TYPES } from "../../RPGFgin/src/core/mesh";
import { Shader } from "../../RPGFgin/src/core/shader";
import { float4x4 } from "../../RPGFgin/src/math/float4x4";
import { Texture } from "../../RPGFgin/src/core/texture";

//@ts-ignore
import FS from '../../RPGFgin/shaders/default.frag';
//@ts-ignore
import VS from '../../RPGFgin/shaders/default.vert';
import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";

const _vertices = new Float32Array([
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,

    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5
]);

const _indices = new Uint16Array([
    0, 1, 2,
    2, 3, 0,
    //нижняя часть
    0, 4, 7,
    7, 3, 0,
    // левая боковая часть
    0, 1, 5,
    5, 4, 0,
    // правая боковая часть
    2, 3, 7,
    7, 6, 2,
    // верхняя часть
    2, 1, 6,
    6, 5, 1,
    // задняя часть
    4, 5, 6,
    6, 7, 4,
]);

const rpgf = new RPGF('canvas3d');
gl.enable(gl.DEPTH_TEST);

// const texture = new Texture('10K_TEST.jpeg', 'test');
// texture.create().then(() => {

// })

fetch('test2.obj').then(x => x.text()).then(x => {
    const loader = new ObjLoader(x);
    const el = document.getElementById('run');

    // el.addEventListener('click', () => {
    //     console.log('debug');
    //     //@ts-ignore
    //     window.IS_RUN = true;
    //     loader.parse();
    //     console.log(loader);

    // })


    // const objDoc = new OBJDoc('test');
    // const res = objDoc.parse(x, 1, true);
    const shader = new Shader(VS, FS);
    const porj = new float4x4().perspective(Math.PI / 2, 1024. / 768., 0.1, 100.);

    const model = new float4x4().scale(4, 4, 4);

    // const info = objDoc.getDrawingInfo();
    console.log(loader);

    const meshes = [];

    shader.enable();


    loader.objects.forEach(obj => {
        const v = [];
        const vt = [];

        obj.indices.forEach(x => {
            v.push(loader.vertices[x].x);
            v.push(loader.vertices[x].y);
            v.push(loader.vertices[x].z);
        });

        obj.texIndeces.forEach((x, i) => {
            vt.push(loader.texCoord[x].x);
            vt.push(loader.texCoord[x].y);
        });


        const indices = Array.from(Array(obj.indices.length).keys());
        meshes.push(
            new Mesh(new Float32Array(v),
                new Float32Array(vt),
                new Uint16Array(indices),
                [_texture]));
    });
    gl.activeTexture(gl.TEXTURE1)
    // const _texture = new Texture('6.jpg', TEXTURE_TYPES.DIFFUSE);
    const _texture = new Texture('textures/handgun_C.jpg', TEXTURE_TYPES.DIFFUSE);
    _texture.create().then(() => {
        render()
    });



    console.log(meshes);

    ///



    function render() {
        const texLocation = gl.getUniformLocation(shader.program, '_tex');

        gl.uniform1i(texLocation, 1);

        setInterval(() => {
            //@ts-ignore
            // if(!window.IS_RUN) return;

            gl.clearColor(1, 1, 1, 1)
            gl.clear(gl.COLOR_BUFFER_BIT);
            const t = Date.now() / 5000;
            const c = Math.cos(t);
            const s = Math.sin(t);
            const cp = [3 * c, 5, 3 * s];
            const view = new float4x4().lookAt(cp, [0, 0, 0], [0, 1, 0]);


            shader.setUniformMatrix4f('u_projMatrix', porj.elements);
            shader.setUniformMatrix4f('u_viewMatrix', view.elements);
            shader.setUniformMatrix4f('u_modelMatrix', model.elements);
            //console.log(objDoc.isMTLComplete());


            // const mesh = new Mesh(_vertices, _indices, []);
            // @ts-ignore
            // meshes.forEach(mesh => {
            //     mesh.draw(shader);
            // })
            // meshes.forEach(mesh => {
            //     mesh.draw()
            // })
            meshes[3].draw();

        }, 33);
    }


});