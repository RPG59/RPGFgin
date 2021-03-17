export namespace MathUtils {
    export function degToRad(val: number): number {
        return val * (Math.PI / 180);
    }

    export function radToDeg(val: number): number {
        return val / Math.PI * 180;
    }
}
