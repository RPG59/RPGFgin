export class GPUContext {
  private adapter: GPUAdapter;
  private device: GPUDevice;
  private context: GPUCanvasContext;

  private static instance: GPUContext;

  static getInstance() {
    if (!GPUContext.instance) {
      GPUContext.instance = new GPUContext();
    }

    return GPUContext.instance;
  }

  static getContext(): GPUCanvasContext {
    return GPUContext.getInstance().context;
  }

  static getDevice(): GPUDevice {
    return GPUContext.getInstance().device;
  }

  static getAdapter(): GPUAdapter {
    return GPUContext.getInstance().adapter;
  }

  async init(canvasId: string) {
    if (!canvasId) {
      throw new Error("Invalid element id");
    }

    const canvasEl = document.getElementById(canvasId);

    if (!(canvasEl instanceof HTMLCanvasElement)) {
      throw new Error("Invalid canvas id");
    }

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;

    await this.initGPU();

    this.context = canvasEl.getContext("webgpu");

    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "premultiplied",
    });
  }

  async initGPU() {
    if (!navigator.gpu) {
      throw Error("WebGPU not supported!!!");
    }

    this.adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });

    if (!this.adapter) {
      throw new Error("Could not requset WebGPU adapter!");
    }

    console.log("%c Features: ", "color: red");
    this.adapter.features.forEach((x) => console.log(`%c ${x}`, "color: green"));

    this.device = await this.adapter.requestDevice({ defaultQueue: { label: "Default QUEUE!" } });
  }
}
