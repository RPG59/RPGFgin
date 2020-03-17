import { RPGF, gl } from "../../RPGFgin/src/main";
import { Shader } from "../../RPGFgin/src/core/shader";
import { float4x4 } from "../../RPGFgin/src/math/float4x4";

//@ts-ignore
import FS from '../../RPGFgin/shaders/default.frag';
//@ts-ignore
import VS from '../../RPGFgin/shaders/default.vert';
import { ObjLoader } from "../../RPGFgin/src/loaders/objLoader";
import { Input } from "../../RPGFgin/src/core/input";


const rpgf = new RPGF('canvas3d');

gl.enable(gl.DEPTH_TEST);

fetch('LP1.obj').then(x => x.text()).then(x => {
	const loader = new ObjLoader(x);
	const el = document.getElementById('run');

	const shader = new Shader(VS, FS);
	const porj = new float4x4().perspective(Math.PI / 2, 1024. / 768., 0.1, 100.);

	const model = new float4x4();


	let meshes = [];

	shader.enable();

	loader.load().then(() => {
		loader.getMeshes().then(m => {
			meshes = m;
			render();
		});
	});

	let X_counter = 0;
	let Z_counter = 0;

	function render() {
		const texLocation = gl.getUniformLocation(shader.program, '_tex');

		gl.uniform1i(texLocation, 1);

		setInterval(() => {
			if (Input.keys['KeyW']) {
				Z_counter += 0.1;
			}
			if (Input.keys['KeyS']) {
				Z_counter -= 0.1;
			}
			if (Input.keys['KeyD']) {
				X_counter += 0.1;
			}
			if (Input.keys['KeyA']) {
				X_counter -= 0.1;
			}


			model.translate([0, Z_counter, X_counter]);
			gl.clearColor(1, 1, 1, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			const t = Date.now() / 5000;
			const c = Math.cos(t);
			const s = Math.sin(t);
			const cp = [2 * c, 5, 2 * s];
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
			meshes.forEach(mesh => {
				mesh.draw(shader)
			})
			// meshes[3].draw(shader);

		}, 33);
	}


});