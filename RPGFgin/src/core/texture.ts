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
        this.img = new Image()
        this.img.src = path;
    }

    create(): Promise<void> {
        return new Promise(res => {
            this.blobLoaedr.load().then(blob => {
                // createImageBitmap(blob, { imageOrientation: 'flipY' }).then(bitmap => {
                this.img.onload = () => {
                    gl.bindTexture(gl.TEXTURE_2D, this.id);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
                    res();
                }
                // });
            });
        })
    }
}

async function foo() {
    return new Promise(res => {
        setTimeout(() => {
            console.log('foo');
            res()
        }, 1000);
    })
}

async function bar_1() {
    await foo();
    await foo();
    console.log('end');
}

function bar_2() {
    foo().then();
    foo().then();
    console.log('end');
}