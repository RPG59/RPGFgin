export let gl: WebGL2RenderingContext = null;
export class RPGF {
    canvasEL: HTMLCanvasElement;

    constructor(canvasID: string) {
        if (!canvasID) throw new Error('Invalid element id');
        const el = document.getElementById(canvasID);

        if (el instanceof HTMLCanvasElement) {
            this.canvasEL = el;
            this.init();
        } else {
            throw new Error('Invalid canvas id');
        }
    }

    private init(): void {
        let context = this.canvasEL.getContext('webgl2');
        if (context instanceof WebGL2RenderingContext) {
            gl = context;
        } else {
            throw new Error('WEBGL2 it not supported!');
        }
    }
}

