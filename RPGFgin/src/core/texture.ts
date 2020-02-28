import { gl } from "../main";
import { FileLoader } from "../loaders/fileLoader";

export class Texture {
	id: WebGLTexture;
	blobLoaedr: FileLoader;
	type: string
	img: any;

	constructor(path: string, type: string) {
		this.id = gl.createTexture();
		this.type = type;
		this.blobLoaedr = new FileLoader(path, 'blob');
		// this.img = new Image()
		// this.img.src = path;
	}

	create(): Promise<void> {
		return new Promise(res => {
			this.blobLoaedr.load().then(blob => {
				createImageBitmap(blob, {imageOrientation: 'flipY'}).then(bitmap => {
				// createImageBitmap(blob).then(bitmap => {
					// this.img.onload = () => {
					gl.bindTexture(gl.TEXTURE_2D, this.id);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, bitmap);
					res();

				});
			});
		})
	}
}
